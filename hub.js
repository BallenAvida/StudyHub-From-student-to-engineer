const hubApp = {
    currentCourse: null,
    currentTestId: null,
    currentTestQuestions: [],
    currentQuestionIndex: 0,
    testScore: 0,

    async init() {
        // First, ensure we have data
        await this.checkInitialData();
        
        // Then setup UI
        this.setupNavigation();
        this.setupCalendar();
        this.setupUploader();
        this.setGreeting();
        this.loadGlobalStats();
        this.renderCourses();
        this.renderCalendar();
    },

    async checkInitialData() {
        const packs = EngineStorage.getAllPacks();
        if (packs.length === 0) {
            console.log("Checking for initial data...");
            
            // Try global variable first (from course_data.js)
            if (typeof DEFAULT_COURSE_PACK !== 'undefined') {
                console.log("Loading from global DEFAULT_COURSE_PACK...");
                if (EngineStorage.savePack(DEFAULT_COURSE_PACK)) {
                    return true;
                }
            }

            // Fallback to fetch
            try {
                const response = await fetch('course_data.json');
                const defaultPack = await response.json();
                if (EngineStorage.savePack(defaultPack)) {
                    return true;
                }
            } catch (e) {
                console.warn("Could not load default data", e);
            }
        }
        return false;
    },

    setupUploader() {
        const uploader = document.getElementById('courseUploader');
        if (!uploader) return;
        uploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const coursePack = JSON.parse(event.target.result);
                    if (!coursePack.id || !coursePack.title) throw new Error("Invalid format");
                    
                    if (EngineStorage.savePack(coursePack)) {
                        alert(`¡Curso "${coursePack.title}" importado con éxito!`);
                        this.renderCourses();
                    }
                } catch (err) {
                    alert("Error al importar: El archivo no tiene el formato Course Pack válido.");
                }
                uploader.value = ''; // Reset
            };
            reader.readAsText(file);
        });
    },

    setupCalendar() {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const addButtons = document.querySelectorAll('.btn-add-event');
        const closeButtons = document.querySelectorAll('.close-modal');

        if (!modal) return;

        addButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                document.getElementById('event-date').valueAsDate = new Date();
            });
        });

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => modal.classList.add('hidden'));
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const event = {
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                category: document.getElementById('event-category').value
            };
            HubStorage.saveEvent(event);
            form.reset();
            modal.classList.add('hidden');
            this.renderCalendar();
        });
    },

    renderCalendar() {
        const events = HubStorage.getEvents();
        const emptyState = document.getElementById('calendar-empty-state');
        const eventList = document.getElementById('calendar-event-list');
        const actions = document.getElementById('calendar-active-actions');

        if (!emptyState) return;

        if (events.length === 0) {
            emptyState.classList.remove('hidden');
            eventList.classList.add('hidden');
            actions.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        eventList.classList.remove('hidden');
        actions.classList.remove('hidden');

        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        eventList.innerHTML = events.map(event => {
            const date = new Date(event.date);
            const day = date.getDate() + 1;
            const month = date.toLocaleDateString('es-ES', { month: 'short' });
            return `
                <div class="event-item">
                    <div class="event-date-box">
                        <span class="event-day">${day}</span>
                        <span class="event-month">${month}</span>
                    </div>
                    <div class="event-info">
                        <div class="event-title">${event.title}</div>
                        <span class="event-category-tag cat-${event.category}">${event.category}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-target]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                this.switchView(item.getAttribute('data-target'));
            });
        });
    },

    switchView(viewId) {
        const views = document.querySelectorAll('.dashboard-view');
        views.forEach(view => {
            if (view.id === viewId) {
                view.classList.remove('hidden');
                view.classList.add('active');
            } else {
                view.classList.add('hidden');
                view.classList.remove('active');
            }
        });
    },

    goHome() {
        this.switchView('view-inicio');
        document.querySelector('.nav-item[data-target="view-inicio"]').classList.add('active');
        this.renderCourses();
    },

    goCourseMenu() {
        this.switchView('view-course-menu');
    },

    setGreeting() {
        const h = new Date().getHours();
        const global = HubStorage.getGlobal();
        const streak = global.streak ? global.streak.count : 0;

        let greeting;
        if (h >= 5 && h < 12) greeting = '¡Buenos días!';
        else if (h >= 12 && h < 19) greeting = '¡Buenas tardes!';
        else greeting = '¡Buenas noches!';

        const greetingEl = document.getElementById('hub-greeting');
        if (greetingEl) greetingEl.textContent = greeting;
        
        const subEl = document.getElementById('hub-subgreeting');
        if (subEl) subEl.textContent = streak >= 2 ? `🔥 ¡${streak} días de racha! Sigue así.` : 'Tu hub de estudio personal.';
    },

    loadGlobalStats() {
        const global = HubStorage.getGlobal();
        const streak = global.streak ? global.streak.count : 0;
        const sessions = global.totalSessions || 0;

        const statStreak = document.getElementById('stat-streak');
        if(statStreak) statStreak.textContent = streak;

        const statSessions = document.getElementById('stat-sessions');
        if(statSessions) statSessions.textContent = sessions;

        const badge = document.getElementById('streak-badge');
        if (badge && streak > 0) {
            document.getElementById('streak-badge-num').textContent = streak;
            badge.classList.remove('hidden');
        }
    },

    renderCourses() {
        const packs = EngineStorage.getAllPacks();
        const grid = document.getElementById('courses-grid');
        const emptyState = document.getElementById('empty-courses-state');
        
        if (!grid) return;

        if (packs.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            grid.innerHTML = packs.map(pack => this.buildCard(pack)).join('');
        }
        
        this.renderQuickResume(packs);
    },

    renderQuickResume(packs) {
        let lastCourseId = null;
        let lastTime = 0;

        packs.forEach(pack => {
            const data = HubStorage.getCourse(pack.id);
            if (data && data.lastStudied) {
                if (data.lastStudied > lastTime) {
                    lastTime = data.lastStudied;
                    lastCourseId = pack.id;
                }
            }
        });

        const container = document.getElementById('quick-resume-container');
        if (!container) return;

        if (!lastCourseId && packs.length > 0) lastCourseId = packs[0].id;

        if (!lastCourseId) {
            container.innerHTML = '';
            return;
        }

        const lastPack = packs.find(p => p.id === lastCourseId);
        container.innerHTML = `
            <div class="quick-resume-card" style="--card-accent: ${lastPack.theme.primary}">
                <div class="qr-content">
                    <div class="qr-label"><i class="fa-solid fa-bolt"></i> Continuar Estudiando</div>
                    <h3 class="qr-title">${lastPack.title}</h3>
                </div>
                <div class="qr-action">
                    <button class="qr-btn" onclick="hubApp.enterCourse('${lastPack.id}')">
                        Continuar <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    },

    buildCard(pack) {
        const data = HubStorage.getCourse(pack.id);
        const moduleKeys = Object.keys(pack.modules || {});
        const total = moduleKeys.length;
        
        let testsAttempted = 0;
        let bestScore = null;

        moduleKeys.forEach(tid => {
            const t = data.tests[tid];
            if (t && t.attempts > 0) {
                testsAttempted++;
                if (t.bestScore !== null && (bestScore === null || t.bestScore > bestScore)) bestScore = t.bestScore;
            }
        });

        const progressPct = total > 0 ? Math.round((testsAttempted / total) * 100) : 0;
        const bestDisplay = bestScore !== null ? `${bestScore}%` : '--';
        const testsDisplay = `${testsAttempted}/${total}`;

        return `
        <div class="course-card active" style="--card-accent:${pack.theme.primary}" onclick="hubApp.enterCourse('${pack.id}')">
            <div class="course-card-header">
                <div class="course-card-icon" style="background:${pack.theme.background};color:${pack.theme.primary}">
                    <i class="fa-solid fa-book"></i>
                </div>
            </div>
            <div class="course-name">${pack.title}</div>
            <div class="course-desc">${total} módulos de estudio disponibles.</div>
            <div class="course-stats-row">
                <div class="course-stat">
                    <span class="course-stat-value">${bestDisplay}</span>
                    <span class="course-stat-label">Mejor</span>
                </div>
                <div class="course-stat">
                    <span class="course-stat-value">${testsDisplay}</span>
                    <span class="course-stat-label">Tests</span>
                </div>
            </div>
            <div class="course-progress-wrap">
                <div class="course-progress-track">
                    <div class="course-progress-fill" style="width:${progressPct}%;background:${pack.theme.primary}"></div>
                </div>
            </div>
            <div class="course-card-footer">
                <button class="btn primary" style="background:${pack.theme.primary}">
                    Entrar <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;
    },

    enterCourse(courseId) {
        const pack = EngineStorage.getPack(courseId);
        if (!pack) return;

        this.currentCourse = pack;
        document.getElementById('current-course-title').textContent = pack.title;
        
        // Render Modules
        const container = document.getElementById('course-modules-container');
        const modules = pack.modules || {};
        
        container.innerHTML = Object.keys(modules).map(key => {
            const mod = modules[key];
            const data = HubStorage.getCourse(courseId);
            const tData = data.tests[key];
            const best = tData && tData.bestScore !== null ? tData.bestScore + '%' : '--';
            
            return `
            <div class="card" onclick="hubApp.startTest('${key}')" style="cursor: pointer;">
                <div class="card-icon test-icon" style="color: ${pack.theme.primary}"><i class="fa-solid fa-laptop-code"></i></div>
                <div class="card-content">
                    <h4>${mod.title || key}</h4>
                    <p>${mod.questions ? mod.questions.length : 0} Preguntas | Mejor: ${best}</p>
                </div>
            </div>`;
        }).join('');

        this.switchView('view-course-menu');
        HubStorage.recordSession(courseId);
    },

    // --- TEST LOGIC ---

    startTest(testId) {
        if (!this.currentCourse || !this.currentCourse.modules[testId]) return;
        
        this.currentTestId = testId;
        const testData = this.currentCourse.modules[testId];
        
        document.getElementById('test-title').textContent = testData.title || testId;
        this.currentTestQuestions = [...(testData.questions || [])].sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.testScore = 0;

        document.getElementById('test-total').textContent = this.currentTestQuestions.length;
        
        this.switchView('view-test');
        this.renderQuestion();
    },

    renderQuestion() {
        if (this.currentQuestionIndex >= this.currentTestQuestions.length) {
            this.finishTest();
            return;
        }

        const q = this.currentTestQuestions[this.currentQuestionIndex];
        document.getElementById('test-current').textContent = this.currentQuestionIndex + 1;
        document.getElementById('test-q-topic').textContent = q.topic || 'General';
        document.getElementById('test-q-text').textContent = q.question;

        const optionsHtml = q.options.map((opt, index) => {
            const text = typeof opt === 'string' ? opt : opt.text;
            return `
                <div class="option" onclick="hubApp.selectOption(${index})" id="opt-${index}">
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${text}</div>
                </div>
            `;
        }).join('');
        
        document.getElementById('test-q-options').innerHTML = optionsHtml;
        
        const feedbackBox = document.getElementById('test-q-feedback');
        feedbackBox.className = 'feedback-box hidden';
        feedbackBox.innerHTML = '';
        
        document.getElementById('btn-test-next').classList.add('hidden');
    },

    selectOption(index) {
        if (!document.getElementById('btn-test-next').classList.contains('hidden')) return;

        const q = this.currentTestQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        const feedbackBox = document.getElementById('test-q-feedback');
        
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        const selectedOpt = q.options[index];
        const isCorrect = index === q.correct;
        const explanation = typeof selectedOpt === 'object' ? selectedOpt.explanation : (q.explanation || '');
        
        let explanationHtml = explanation ? `<div class="explanation-text">${explanation}</div>` : '';
        
        if (isCorrect) {
            options[index].classList.add('correct');
            this.testScore++;
            feedbackBox.className = 'feedback-box success';
            feedbackBox.innerHTML = `<div class="feedback-icon"><i class="fa-solid fa-check-circle"></i></div><div class="feedback-text"><strong>¡Correcto!</strong>${explanationHtml}</div>`;
        } else {
            options[index].classList.add('incorrect');
            options[q.correct].classList.add('correct');
            feedbackBox.className = 'feedback-box error';
            feedbackBox.innerHTML = `<div class="feedback-icon"><i class="fa-solid fa-xmark-circle"></i></div><div class="feedback-text"><strong>Incorrecto.</strong>${explanationHtml}</div>`;
        }
        
        document.getElementById('btn-test-next').classList.remove('hidden');
    },

    nextQuestion() {
        this.currentQuestionIndex++;
        this.renderQuestion();
    },

    finishTest() {
        const total = this.currentTestQuestions.length;
        const pct = total > 0 ? Math.round((this.testScore / total) * 100) : 0;
        
        HubStorage.saveTestResult(this.currentCourse.id, this.currentTestId, this.testScore, total);
        
        document.getElementById('score-message').textContent = `Puntaje: ${this.testScore} de ${total} (${pct}%)`;
        
        let phrase = '¡Sigue practicando!';
        if (pct >= 90) phrase = '¡Excelente! Tienes dominio total.';
        else if (pct >= 70) phrase = '¡Muy buen trabajo!';
        
        document.getElementById('score-phrase').textContent = phrase;
        
        this.switchView('view-results');
        this.loadGlobalStats(); // Update streak UI
    },

    readTestAloud() {
        if (!('speechSynthesis' in window)) return;
        const q = this.currentTestQuestions[this.currentQuestionIndex];
        if (!q) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(q.question);
        msg.lang = 'es-ES';
        msg.rate = 1.1;
        window.speechSynthesis.speak(msg);
    }
};

window.hubApp = hubApp;
document.addEventListener('DOMContentLoaded', () => hubApp.init());
