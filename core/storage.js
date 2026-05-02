const EngineStorage = {
    PACKS_KEY: 'studyhub_engine_packs',
    
    getAllPacks() {
        try {
            const data = localStorage.getItem(this.PACKS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading packs", e);
            return [];
        }
    },
    
    getPack(id) {
        return this.getAllPacks().find(c => c.id === id);
    },
    
    savePack(pack) {
        const packs = this.getAllPacks();
        const index = packs.findIndex(c => c.id === pack.id);
        if (index !== -1) packs[index] = pack;
        else packs.push(pack);
        
        try {
            localStorage.setItem(this.PACKS_KEY, JSON.stringify(packs));
            return true;
        } catch (e) {
            alert("Error: No se pudo guardar el curso. Probablemente excede el límite del navegador.");
            return false;
        }
    }
};

const HubStorage = {
    COURSES_KEY: 'studyhub_courses',
    GLOBAL_KEY:  'studyhub_global',

    getAllCourses() {
        try { return JSON.parse(localStorage.getItem(this.COURSES_KEY) || '{}'); }
        catch { return {}; }
    },

    getCourse(courseId) {
        return this.getAllCourses()[courseId] || { lastStudied: null, tests: {} };
    },

    saveTestResult(courseId, testId, score, total) {
        const all = this.getAllCourses();
        if (!all[courseId]) all[courseId] = { lastStudied: null, tests: {} };
        if (!all[courseId].tests[testId]) all[courseId].tests[testId] = { bestScore: null, attempts: 0, lastScore: null };

        const pct = Math.round((score / total) * 100);
        const t   = all[courseId].tests[testId];
        t.attempts++;
        t.lastScore = pct;
        if (t.bestScore === null || pct > t.bestScore) t.bestScore = pct;
        all[courseId].lastStudied = Date.now();

        localStorage.setItem(this.COURSES_KEY, JSON.stringify(all));
        this._updateStreak();
    },

    recordSession(courseId) {
        const all = this.getAllCourses();
        if (!all[courseId]) all[courseId] = { lastStudied: null, tests: {} };
        all[courseId].lastStudied = Date.now();
        localStorage.setItem(this.COURSES_KEY, JSON.stringify(all));
        this._updateStreak();
    },

    _updateStreak() {
        try {
            const global  = JSON.parse(localStorage.getItem(this.GLOBAL_KEY) || '{}');
            const today   = new Date().toISOString().split('T')[0];
            if (!global.streak) global.streak = { lastDate: null, count: 0 };
            if (global.streak.lastDate === today) return;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().split('T')[0];

            global.streak.count    = global.streak.lastDate === yStr ? global.streak.count + 1 : 1;
            global.streak.lastDate = today;
            global.totalSessions   = (global.totalSessions || 0) + 1;

            localStorage.setItem(this.GLOBAL_KEY, JSON.stringify(global));
        } catch {}
    },

    getGlobal() {
        try { return JSON.parse(localStorage.getItem(this.GLOBAL_KEY) || '{}'); }
        catch { return {}; }
    },

    getEvents() {
        try {
            const global = this.getGlobal();
            return global.calendar || [];
        } catch { return []; }
    },

    saveEvent(event) {
        const global = this.getGlobal();
        if (!global.calendar) global.calendar = [];
        global.calendar.push({
            id: Date.now(),
            ...event
        });
        localStorage.setItem(this.GLOBAL_KEY, JSON.stringify(global));
    }
};
