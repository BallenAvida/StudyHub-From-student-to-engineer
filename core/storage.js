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
    },

    getApiConfig() {
        try { return JSON.parse(localStorage.getItem('studyhub_api_config') || '{}'); }
        catch { return {}; }
    },

    saveApiConfig(config) {
        localStorage.setItem('studyhub_api_config', JSON.stringify(config));
    },

    // ── Per-Question Analytics ──────────────────────────────────

    QUESTION_STATS_KEY: 'studyhub_question_stats',

    _hashText(text) {
        // djb2 hash — stable ID for a question without needing an explicit id field
        let h = 5381;
        const len = Math.min(text.length, 300);
        for (let i = 0; i < len; i++) {
            h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0;
        }
        return Math.abs(h).toString(36);
    },

    _getQuestionStats() {
        try { return JSON.parse(localStorage.getItem(this.QUESTION_STATS_KEY) || '{}'); }
        catch { return {}; }
    },

    /**
     * Record a single question answer.
     * @param {string} courseId
     * @param {string} testId    — module key
     * @param {string} qText     — question text (used to derive stable hash ID)
     * @param {boolean} isCorrect
     * @param {string} domain    — q.domain || q.topic || 'General'
     */
    saveQuestionResult(courseId, testId, qText, isCorrect, domain) {
        const all = this._getQuestionStats();
        const qHash = this._hashText(qText);
        const key = `${courseId}::${qHash}`;
        if (!all[key]) {
            all[key] = { courseId, testId, qHash, domain: domain || 'General', correct: 0, incorrect: 0, lastSeen: null };
        }
        if (isCorrect) all[key].correct++;
        else all[key].incorrect++;
        all[key].lastSeen = Date.now();
        try { localStorage.setItem(this.QUESTION_STATS_KEY, JSON.stringify(all)); } catch {}
    },

    /**
     * Get accuracy stats grouped by domain for a course.
     * @returns {{ [domain]: { correct: number, incorrect: number } }}
     */
    getDomainStats(courseId) {
        const all = this._getQuestionStats();
        const domains = {};
        Object.values(all)
            .filter(q => q.courseId === courseId)
            .forEach(q => {
                const d = q.domain || 'General';
                if (!domains[d]) domains[d] = { correct: 0, incorrect: 0 };
                domains[d].correct  += q.correct;
                domains[d].incorrect += q.incorrect;
            });
        return domains;
    },

    /**
     * Return up to 25 question objects (from the pack) sorted by fail rate desc.
     * Only includes questions that have been answered and failed at least once.
     * @param {string} courseId
     * @param {object} pack     — the full course pack object
     * @returns {Array}
     */
    getSmartReviewQuestions(courseId, pack) {
        const all = this._getQuestionStats();
        const courseStats = Object.values(all).filter(q => q.courseId === courseId && q.incorrect > 0);

        // Build hash → question object map from the pack
        const byHash = {};
        Object.keys(pack.modules || {}).forEach(moduleKey => {
            const mod = pack.modules[moduleKey];
            (mod.questions || []).forEach(q => {
                const hash = this._hashText(q.question);
                byHash[hash] = { ...q, _moduleTitle: mod.title || moduleKey };
            });
        });

        // Sort: highest fail rate first, then most total fails as tiebreak
        courseStats.sort((a, b) => {
            const rA = a.incorrect / (a.correct + a.incorrect);
            const rB = b.incorrect / (b.correct + b.incorrect);
            return rB !== rA ? rB - rA : b.incorrect - a.incorrect;
        });

        return courseStats.slice(0, 25)
            .map(stat => {
                const q = byHash[stat.qHash];
                return q ? {
                    ...q,
                    _failRate:  Math.round(stat.incorrect / (stat.correct + stat.incorrect) * 100),
                    _incorrect: stat.incorrect,
                    _correct:   stat.correct,
                    _domain:    stat.domain
                } : null;
            })
            .filter(Boolean);
    },

    /**
     * Returns domains that are "due" for review today based on spaced repetition intervals.
     * Interval is derived from the domain's fail rate:
     *   ≥60% fail → review every 1 day
     *   40-59%    → every 3 days
     *   20-39%    → every 7 days
     *   <20%      → every 14 days
     * @param {string} courseId
     * @returns {Array<{domain, failRate, daysSince, intervalDays, isDue}>}
     */
    getDueItems(courseId) {
        const allStats = this._getQuestionStats();
        const DAY = 86400000;
        const now = Date.now();

        const domains = {};
        Object.values(allStats)
            .filter(q => q.courseId === courseId)
            .forEach(q => {
                const d = q.domain || 'General';
                if (!domains[d]) domains[d] = { correct: 0, incorrect: 0, lastSeen: 0 };
                domains[d].correct   += q.correct;
                domains[d].incorrect += q.incorrect;
                if (q.lastSeen && q.lastSeen > domains[d].lastSeen) {
                    domains[d].lastSeen = q.lastSeen;
                }
            });

        return Object.entries(domains)
            .map(([domain, data]) => {
                const total        = data.correct + data.incorrect;
                const failRate     = total > 0 ? data.incorrect / total : 1;
                const intervalDays = failRate >= 0.6 ? 1 : failRate >= 0.4 ? 3 : failRate >= 0.2 ? 7 : 14;
                const daysSince    = data.lastSeen ? (now - data.lastSeen) / DAY : 999;
                return {
                    domain,
                    failRate:     Math.round(failRate * 100),
                    daysSince:    Math.floor(daysSince),
                    intervalDays,
                    isDue:        daysSince >= intervalDays,
                };
            })
            .filter(item => item.isDue)
            .sort((a, b) => b.failRate - a.failRate || b.daysSince - a.daysSince);
    },

    /**
     * Compute an overall Exam Readiness score (0-100) for a course.
     * - If the pack has `domainWeights: { "Domain Name": weight }`, uses weighted avg.
     * - Otherwise uses equal-weight domain average (not raw question avg, to avoid
     *   bias from modules with many more questions in one domain).
     * Returns null if no answers have been recorded yet.
     * @param {string} courseId
     * @param {object} pack
     * @returns {number|null}
     */
    getReadinessScore(courseId, pack) {
        const domainStats = this.getDomainStats(courseId);
        const entries = Object.entries(domainStats);
        if (entries.length === 0) return null;

        const weights = pack.domainWeights || null;

        if (weights) {
            let weightedSum = 0;
            let totalWeight = 0;
            entries.forEach(([domain, stats]) => {
                const w     = weights[domain] !== undefined ? weights[domain] : 1;
                const total = stats.correct + stats.incorrect;
                const acc   = total > 0 ? stats.correct / total : 0;
                weightedSum  += acc * w;
                totalWeight  += w;
            });
            return totalWeight > 0 ? Math.round(weightedSum / totalWeight * 100) : null;
        } else {
            // Equal-weight per-domain accuracy average
            const sum = entries.reduce((acc, [, s]) => {
                const total = s.correct + s.incorrect;
                return acc + (total > 0 ? s.correct / total : 0);
            }, 0);
            return Math.round(sum / entries.length * 100);
        }
    }
};
