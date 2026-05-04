const hubApp = {
    currentCourse: null,
    currentTestId: null,
    currentTestQuestions: [],
    currentQuestionIndex: 0,
    testScore: 0,
    failedQuestions: [],
    currentSessionResults: [], // per-answer tracking for results breakdown
    isReviewMode: false,

    async init() {
        // First, ensure we have data
        await this.checkInitialData();
        
        // Then setup UI
        this.setupNavigation();
        this.setupCalendar();
        this.setupUploader();
        this.setupSearch();
        this.setGreeting();
        this.loadGlobalStats();
        this.renderCourses();
        this.renderCalendar();
        this.renderStudyQueue();
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
        uploader.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.name.toLowerCase().endsWith('.pdf')) {
                await this.handlePdfImport(file);
            } else {
                this.handleJsonImport(file);
            }
            uploader.value = '';
        });
    },

    // ── Live Search ────────────────────────────────────

    setupSearch() {
        const input = document.getElementById('search-input');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query.length < 2) { this.clearSearch(); return; }
            this.renderSearchResults(query);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.clearSearch(); input.blur(); }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) this.clearSearch();
        });
    },

    renderSearchResults(query) {
        const dropdown = document.getElementById('search-dropdown');
        if (!dropdown) return;

        const packs  = EngineStorage.getAllPacks();
        const results = [];

        for (const pack of packs) {
            if (pack.title.toLowerCase().includes(query)) {
                results.push({ type: 'course', courseId: pack.id, moduleId: '', label: pack.title, sub: `${Object.keys(pack.modules || {}).length} módulos`, icon: 'fa-book' });
            }
            for (const [key, mod] of Object.entries(pack.modules || {})) {
                if ((mod.title || key).toLowerCase().includes(query)) {
                    results.push({ type: 'module', courseId: pack.id, moduleId: key, label: mod.title || key, sub: pack.title, icon: 'fa-laptop-code' });
                }
                for (const q of (mod.questions || [])) {
                    if (q.question.toLowerCase().includes(query)) {
                        const label = q.question.length > 70 ? q.question.slice(0, 70) + '…' : q.question;
                        results.push({ type: 'question', courseId: pack.id, moduleId: key, label, sub: `${mod.title || key} · ${pack.title}`, icon: 'fa-circle-question' });
                    }
                }
            }
            if (results.length >= 8) break;
        }

        if (results.length === 0) {
            dropdown.innerHTML = `<div class="search-no-results">Sin resultados para "${query}"</div>`;
        } else {
            dropdown.innerHTML = results.slice(0, 8).map(r => `
            <div class="search-result-item" onclick="hubApp.handleSearchResult('${r.courseId}','${r.moduleId}','${r.type}')">
                <i class="fa-solid ${r.icon} sri-icon"></i>
                <div class="sri-content">
                    <div class="sri-label">${r.label}</div>
                    <div class="sri-sub">${r.sub}</div>
                </div>
            </div>`).join('');
        }
        dropdown.classList.remove('hidden');
    },

    clearSearch() {
        const d = document.getElementById('search-dropdown');
        if (d) d.classList.add('hidden');
    },

    handleSearchResult(courseId, moduleId, type) {
        document.getElementById('search-input').value = '';
        this.clearSearch();
        this.enterCourse(courseId);
        if ((type === 'module' || type === 'question') && moduleId) {
            setTimeout(() => this.startTest(moduleId), 150);
        }
    },

    handleJsonImport(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const coursePack = JSON.parse(event.target.result);
                if (!coursePack.id || !coursePack.title) throw new Error('Invalid format');
                if (EngineStorage.savePack(coursePack)) {
                    alert(`¡Curso "${coursePack.title}" importado con éxito!`);
                    this.renderCourses();
                }
            } catch {
                alert('Error al importar: El archivo no tiene el formato Course Pack válido.');
            }
        };
        reader.readAsText(file);
    },

    async handlePdfImport(file) {
        const config = HubStorage.getApiConfig();
        if (!config.key) {
            alert('Para importar PDFs necesitás configurar una API key en Configuración → IA para Generación de Cursos.');
            return;
        }
        try {
            if (config.provider === 'claude') {
                // Claude: extract text first with PDF.js
                this.showLoading('Leyendo PDF...');
                const text = await this.extractPdfText(file);
                if (text.trim().length < 50) throw new Error('No se pudo extraer texto del PDF.');
                this.showLoading('Generando Course Pack con IA...\nEsto puede tomar 15–30 segundos.');
                const pack = await this.callAiApi(text, file.name);
                this.hideLoading();
                if (EngineStorage.savePack(pack)) {
                    alert(`¡Curso "${pack.title}" generado e importado con éxito!`);
                    this.renderCourses();
                }
            } else {
                // Gemini: send PDF directly as base64 — no PDF.js needed, works with any PDF
                this.showLoading('Preparando PDF...');
                const pack = await this.generateFromPdfBase64(file, config.key);
                this.hideLoading();
                if (EngineStorage.savePack(pack)) {
                    alert(`¡Curso "${pack.title}" generado e importado con éxito!`);
                    this.renderCourses();
                }
            }
        } catch (err) {
            this.hideLoading();
            alert(`Error: ${err.message}`);
        }
    },

    async getGeminiModel(key) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!res.ok) throw new Error('No se pudo conectar con Gemini. Verificá tu API key.');
        const data = await res.json();
        const models = (data.models || [])
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
        const preferred = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash-latest',
                           'gemini-1.5-flash-002', 'gemini-1.5-flash-001', 'gemini-1.5-flash'];
        for (const name of preferred) {
            if (models.includes(name)) return name;
        }
        const flash = models.find(m => m.includes('flash'));
        if (flash) return flash;
        throw new Error(`No se encontró un modelo compatible. Modelos disponibles: ${models.slice(0, 5).join(', ')}`);
    },

    async generateFromPdfBase64(file, key) {
        this.showLoading('Verificando modelo disponible...');
        const model = await this.getGeminiModel(key);

        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const base64 = btoa(binary);

        this.showLoading(`Generando Course Pack con IA...\nEsto puede tomar 15–30 segundos.`);

        const prompt = this.buildCoursePackPrompt('', file.name);
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inline_data: { mime_type: 'application/pdf', data: base64 } },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
                })
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(`Gemini (${model}): ${err.error?.message || res.statusText}`);
        }
        const data = await res.json();
        const raw = data.candidates[0].content.parts[0].text;
        const cleaned = this.cleanJsonResponse(raw);
        const pack = JSON.parse(cleaned);
        if (!pack.id || !pack.title || !pack.modules) throw new Error('La IA no generó un Course Pack válido. Intentá de nuevo.');
        return pack;
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
        if (viewId === 'view-analiticas') this.loadAnalytics();
        if (viewId === 'view-configuracion') this.loadApiConfigForm();
    },

    goHome() {
        this.switchView('view-inicio');
        document.querySelector('.nav-item[data-target="view-inicio"]').classList.add('active');
        this.renderCourses();
        this.renderStudyQueue();
    },

    goCourseMenu() {
        if (this.currentCourse) this.renderCourseModules();
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

    // ── Spaced Repetition: Study Queue ───────────────────────────

    renderStudyQueue() {
        const container = document.getElementById('study-queue-container');
        if (!container) return;

        const packs = EngineStorage.getAllPacks();
        const allDue = [];

        packs.forEach(pack => {
            HubStorage.getDueItems(pack.id).forEach(item => {
                allDue.push({ ...item, courseId: pack.id, courseTitle: pack.title });
            });
        });

        if (allDue.length === 0) {
            container.innerHTML = '';
            return;
        }

        const rows = allDue.slice(0, 5).map(item => {
            const color     = item.failRate >= 60 ? '#ef4444' : item.failRate >= 40 ? '#f59e0b' : '#10b981';
            const icon      = item.failRate >= 60 ? 'fa-fire'  : item.failRate >= 40 ? 'fa-circle-half-stroke' : 'fa-check-circle';
            const daysLabel = item.daysSince === 0 ? 'hoy'
                            : item.daysSince === 1 ? 'hace 1 d\u00eda'
                            : `hace ${item.daysSince} d\u00edas`;
            return `
            <div class="sq-item" onclick="hubApp.enterCourseAndReview('${item.courseId}')">
                <i class="fa-solid ${icon} sq-item-icon" style="color:${color}"></i>
                <div class="sq-item-info">
                    <span class="sq-domain">${item.domain}</span>
                    <span class="sq-meta">${item.courseTitle} \u00b7 ${daysLabel} \u00b7 ${item.failRate}% fallos</span>
                </div>
                <span class="sq-badge" style="background:${color}20;color:${color};border-color:${color}40">${item.failRate}%</span>
            </div>`;
        }).join('');

        container.innerHTML = `
        <div class="study-queue-card">
            <div class="sq-header">
                <div class="sq-label"><i class="fa-solid fa-calendar-check"></i> Para Estudiar Hoy</div>
                <span class="sq-count">${allDue.length} dominio${allDue.length !== 1 ? 's' : ''} pendiente${allDue.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="sq-items">${rows}</div>
        </div>`;
    },

    enterCourseAndReview(courseId) {
        this.enterCourse(courseId);
        // Let the view render, then launch Smart Review automatically
        setTimeout(() => this.startSmartReview(), 150);
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

        this.renderCourseModules();
        this.switchView('view-course-menu');
        HubStorage.recordSession(courseId);
    },

    renderCourseModules() {
        const pack = this.currentCourse;
        const container = document.getElementById('course-modules-container');
        const modules = pack.modules || {};
        const courseData = HubStorage.getCourse(pack.id);

        this.renderReadinessScore();

        container.innerHTML = Object.keys(modules).map(key => {
            const mod = modules[key];
            const tData = courseData.tests[key];
            const bestScore = tData && tData.bestScore !== null ? tData.bestScore : null;

            let badgeClass, badgeText;
            if (bestScore === null) {
                badgeClass = 'badge-untried';
                badgeText = 'Sin intentar';
            } else if (bestScore >= 80) {
                badgeClass = 'badge-green';
                badgeText = `${bestScore}%`;
            } else if (bestScore >= 60) {
                badgeClass = 'badge-yellow';
                badgeText = `${bestScore}%`;
            } else {
                badgeClass = 'badge-red';
                badgeText = `${bestScore}%`;
            }

            return `
            <div class="card" onclick="hubApp.startTest('${key}')" style="cursor: pointer;">
                <div class="card-icon test-icon" style="color: ${pack.theme.primary}"><i class="fa-solid fa-laptop-code"></i></div>
                <div class="card-content">
                    <h4>${mod.title || key}</h4>
                    <p>${mod.questions ? mod.questions.length : 0} preguntas</p>
                </div>
                <div class="module-badge ${badgeClass}">${badgeText}</div>
            </div>`;
        }).join('');

        // Smart Review banner — shown only when there is fail history
        const smartQs = HubStorage.getSmartReviewQuestions(pack.id, pack);
        if (smartQs.length > 0) {
            container.innerHTML += `
            <div class="smart-review-banner" onclick="hubApp.startSmartReview()">
                <div class="srb-icon"><i class="fa-solid fa-brain"></i></div>
                <div class="srb-content">
                    <div class="srb-title">Repaso Inteligente</div>
                    <div class="srb-sub">${smartQs.length} pregunta${smartQs.length !== 1 ? 's' : ''} priorizadas por historial de fallos</div>
                </div>
                <div class="srb-arrow"><i class="fa-solid fa-bolt"></i> Iniciar</div>
            </div>`;
        }
    },

    // ── Exam Readiness Score ──────────────────────────────

    renderReadinessScore() {
        const container = document.getElementById('readiness-score-container');
        if (!container || !this.currentCourse) { if (container) container.innerHTML = ''; return; }

        const score = HubStorage.getReadinessScore(this.currentCourse.id, this.currentCourse);
        if (score === null) { container.innerHTML = ''; return; }

        const color      = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
        const label      = score >= 80 ? '¡Listo para el examen!' : score >= 65 ? 'Progresando — sigue así' : 'Necesita práctica enfocada';
        const hasWeights = !!this.currentCourse.domainWeights;

        container.innerHTML = `
        <div class="readiness-card">
            <div class="rc-info">
                <div class="rc-title">
                    🎯 Exam Readiness
                    ${hasWeights ? '<span class="rc-tag">ponderado</span>' : ''}
                </div>
                <div class="rc-sublabel" style="color:${color}">${label}</div>
                <div class="rc-bar-row">
                    <div class="rc-bar-track">
                        <div class="rc-bar-fill" style="width:${score}%;background:${color}"></div>
                    </div>
                    <span class="rc-threshold">80% = aprobado</span>
                </div>
            </div>
            <div class="rc-score-big" style="color:${color}">${score}<span class="rc-pct">%</span></div>
        </div>`;
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
        this.failedQuestions = [];
        this.currentSessionResults = [];
        this.isReviewMode = false;

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
        document.getElementById('test-q-topic').textContent = q.domain || q.topic || 'General';
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

        // Track per-question history (not during review modes)
        if (this.currentCourse && !this.isReviewMode) {
            const domain = q.domain || q.topic || 'General';
            HubStorage.saveQuestionResult(this.currentCourse.id, this.currentTestId, q.question, isCorrect, domain);
        }

        // Always track for the in-session domain breakdown on results screen
        this.currentSessionResults.push({
            domain: q.domain || q.topic || 'General',
            isCorrect
        });
        
        let explanationHtml = explanation ? `<div class="explanation-text">${explanation}</div>` : '';
        
        if (isCorrect) {
            options[index].classList.add('correct');
            this.testScore++;
            feedbackBox.className = 'feedback-box success';
            feedbackBox.innerHTML = `<div class="feedback-icon"><i class="fa-solid fa-check-circle"></i></div><div class="feedback-text"><strong>¡Correcto!</strong>${explanationHtml}</div>`;
        } else {
            options[index].classList.add('incorrect');
            options[q.correct].classList.add('correct');
            this.failedQuestions.push(q);
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

        if (!this.isReviewMode) {
            HubStorage.saveTestResult(this.currentCourse.id, this.currentTestId, this.testScore, total);
        }

        document.getElementById('score-message').textContent = `Puntaje: ${this.testScore} de ${total} (${pct}%)`;

        let phrase = '¡Sigue practicando!';
        if (pct >= 90) phrase = '¡Excelente! Tienes dominio total.';
        else if (pct >= 70) phrase = '¡Muy buen trabajo!';

        document.getElementById('score-phrase').textContent = phrase;

        const btnRepaso = document.getElementById('btn-repaso');
        if (btnRepaso) btnRepaso.classList.toggle('hidden', this.failedQuestions.length === 0);

        this.renderResultsDomainBreakdown();

        this.switchView('view-results');
        this.loadGlobalStats();
    },

    renderResultsDomainBreakdown() {
        const container = document.getElementById('results-domain-breakdown');
        if (!container) return;

        if (this.currentSessionResults.length === 0) {
            container.innerHTML = '';
            return;
        }

        // Aggregate by domain
        const domains = {};
        this.currentSessionResults.forEach(r => {
            if (!domains[r.domain]) domains[r.domain] = { correct: 0, total: 0 };
            domains[r.domain].total++;
            if (r.isCorrect) domains[r.domain].correct++;
        });

        // Only show breakdown if there is more than one domain
        const entries = Object.entries(domains)
            .map(([domain, s]) => ({ domain, ...s, pct: Math.round(s.correct / s.total * 100) }))
            .sort((a, b) => a.pct - b.pct); // worst first

        if (entries.length <= 1) {
            container.innerHTML = '';
            return;
        }

        const rows = entries.map(e => {
            const color = e.pct >= 80 ? '#10b981' : e.pct >= 60 ? '#f59e0b' : '#ef4444';
            const icon  = e.pct >= 80 ? 'fa-check-circle' : e.pct >= 60 ? 'fa-circle-half-stroke' : 'fa-circle-xmark';
            return `
            <div class="rd-item">
                <div class="rd-item-header">
                    <div class="rd-domain">
                        <i class="fa-solid ${icon}" style="color:${color};width:16px"></i>
                        <span>${e.domain}</span>
                    </div>
                    <span class="rd-score" style="color:${color}">${e.correct}/${e.total} (${e.pct}%)</span>
                </div>
                <div class="rd-bar-track">
                    <div class="rd-bar-fill" style="width:${e.pct}%;background:${color}"></div>
                </div>
            </div>`;
        }).join('');

        container.innerHTML = `
        <div class="rd-panel">
            <div class="rd-panel-title">
                <i class="fa-solid fa-chart-bar"></i> Resultados por Dominio
            </div>
            ${rows}
        </div>`;
    },

    loadAnalytics() {
        const global = HubStorage.getGlobal();
        const streak = global.streak ? global.streak.count : 0;
        const sessions = global.totalSessions || 0;

        const streakEl = document.getElementById('analytics-streak');
        if (streakEl) streakEl.textContent = `${streak} días`;

        const sessionsEl = document.getElementById('analytics-sessions');
        if (sessionsEl) sessionsEl.textContent = `${sessions} completadas`;

        const packs = EngineStorage.getAllPacks();

        // ── Domain Breakdown ───────────────────────────────
        const domainContainer = document.getElementById('analytics-domains');
        if (domainContainer) {
            let domainHtml = '';
            packs.forEach(pack => {
                const domainStats = HubStorage.getDomainStats(pack.id);
                const entries = Object.entries(domainStats);
                if (entries.length === 0) return;

                // Sort worst domain first
                entries.sort((a, b) => {
                    const accA = a[1].correct / (a[1].correct + a[1].incorrect);
                    const accB = b[1].correct / (b[1].correct + b[1].incorrect);
                    return accA - accB;
                });

                domainHtml += `<div class="domain-course-block">
                    <div class="domain-course-label"><i class="fa-solid fa-book"></i> ${pack.title}</div>`;

                entries.forEach(([domain, stats]) => {
                    const total = stats.correct + stats.incorrect;
                    const pct   = total > 0 ? Math.round(stats.correct / total * 100) : 0;
                    const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
                    domainHtml += `
                    <div class="domain-bar-item">
                        <div class="domain-bar-header">
                            <span class="domain-bar-name">${domain}</span>
                            <span class="domain-bar-pct" style="color:${color}">${pct}%</span>
                        </div>
                        <div class="domain-bar-track">
                            <div class="domain-bar-fill" style="width:${pct}%;background:${color}"></div>
                        </div>
                        <div class="domain-bar-detail">${stats.correct} correctas de ${total} intentos</div>
                    </div>`;
                });
                domainHtml += '</div>';
            });

            domainContainer.innerHTML = domainHtml ||
                '<p class="analytics-empty">Completa tests para ver tu rendimiento por dominio.</p>';
        }

        // ── Weak Modules ───────────────────────────────
        const weakTopics = [];
        packs.forEach(pack => {
            const courseData = HubStorage.getCourse(pack.id);
            Object.keys(pack.modules || {}).forEach(key => {
                const tData = courseData.tests[key];
                if (tData && tData.attempts > 0 && tData.bestScore !== null) {
                    weakTopics.push({
                        courseTitle:  pack.title,
                        moduleTitle:  pack.modules[key].title || key,
                        bestScore:    tData.bestScore,
                        attempts:     tData.attempts
                    });
                }
            });
        });
        weakTopics.sort((a, b) => a.bestScore - b.bestScore);

        const weakContainer = document.getElementById('analytics-weak-topics');
        if (!weakContainer) return;

        if (weakTopics.length === 0) {
            weakContainer.innerHTML = '<p class="analytics-empty">Completa algunos tests para ver tus puntos débiles.</p>';
            return;
        }

        weakContainer.innerHTML = weakTopics.slice(0, 8).map(t => {
            const color = t.bestScore >= 80 ? '#10b981' : t.bestScore >= 60 ? '#f59e0b' : '#ef4444';
            const icon  = t.bestScore >= 80 ? 'fa-check-circle' : t.bestScore >= 60 ? 'fa-circle-half-stroke' : 'fa-circle-xmark';
            return `
            <div class="weak-topic-item">
                <div class="weak-topic-left">
                    <i class="fa-solid ${icon}" style="color:${color};font-size:1.1rem;flex-shrink:0"></i>
                    <div class="weak-topic-info">
                        <span class="weak-topic-name">${t.moduleTitle}</span>
                        <span class="weak-topic-course">${t.courseTitle} · ${t.attempts} intento${t.attempts !== 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="weak-topic-score" style="color:${color}">${t.bestScore}%</div>
            </div>`;
        }).join('');
    },

    startReviewMode() {
        const questionsToReview = [...this.failedQuestions];
        if (questionsToReview.length === 0) return;

        const moduleTitle = this.currentCourse.modules[this.currentTestId]?.title || this.currentTestId;
        document.getElementById('test-title').textContent = `Repaso — ${moduleTitle}`;

        this.currentTestQuestions = questionsToReview.sort(() => Math.random() - 0.5);
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.isReviewMode = true;

        document.getElementById('test-total').textContent = this.currentTestQuestions.length;

        this.switchView('view-test');
        this.renderQuestion();
    },

    startSmartReview() {
        if (!this.currentCourse) return;
        const questions = HubStorage.getSmartReviewQuestions(this.currentCourse.id, this.currentCourse);

        if (questions.length === 0) {
            alert('¡Aún no hay historial de fallos! Completa algunos tests primero.');
            return;
        }

        document.getElementById('test-title').textContent = '🧠 Repaso Inteligente';
        document.getElementById('test-total').textContent = questions.length;

        this.currentTestQuestions = questions;
        this.currentTestId = '__smart_review__';
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.currentSessionResults = [];
        this.isReviewMode = true; // Don’t overwrite normal test scores

        this.switchView('view-test');
        this.renderQuestion();
    },

    // ── Settings: API Config ─────────────────────────────────────

    saveApiConfig() {
        const provider = document.getElementById('ai-provider')?.value || 'gemini';
        const key = document.getElementById('ai-api-key')?.value.trim() || '';
        HubStorage.saveApiConfig({ provider, key });
        const status = document.getElementById('api-save-status');
        if (status) {
            status.textContent = '✓ Guardado';
            setTimeout(() => { status.textContent = ''; }, 2000);
        }
    },

    loadApiConfigForm() {
        const config = HubStorage.getApiConfig();
        const providerEl = document.getElementById('ai-provider');
        const keyEl = document.getElementById('ai-api-key');
        if (providerEl && config.provider) providerEl.value = config.provider;
        if (keyEl && config.key) keyEl.value = config.key;
    },

    // ── Loading Overlay ──────────────────────────────────────────

    showLoading(msg) {
        const overlay = document.getElementById('ai-loading-overlay');
        const msgEl = document.getElementById('ai-loading-msg');
        if (msgEl) msgEl.textContent = msg;
        if (overlay) overlay.classList.remove('hidden');
    },

    hideLoading() {
        const overlay = document.getElementById('ai-loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    // ── AI Course Pack Generation ────────────────────────────────

    async extractPdfText(file) {
        if (typeof pdfjsLib === 'undefined') throw new Error('PDF.js no cargó. Revisá tu conexión a internet.');

        // Fetch worker as blob to avoid CORS restrictions when running via file://
        if (!this._pdfWorkerUrl) {
            try {
                const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
                const blob = await res.blob();
                this._pdfWorkerUrl = URL.createObjectURL(blob);
            } catch {
                this._pdfWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = this._pdfWorkerUrl;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.filter(item => 'str' in item).map(item => item.str).join(' ') + '\n';
        }
        return text.trim().slice(0, 15000);
    },

    buildCoursePackPrompt(text, fileName) {
        const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        return `Eres un experto creador de material de estudio. Convierte el siguiente material en un Course Pack JSON para una app de tests interactivos.

RESPONDE ÚNICAMENTE CON EL JSON VÁLIDO. Sin explicaciones, sin markdown, sin bloques de código.

Estructura requerida:
{
  "id": "slug-sin-espacios",
  "title": "Título del Curso",
  "author": "Generado por IA",
  "description": "Descripción breve",
  "theme": { "primary": "#3b82f6", "background": "rgba(59, 130, 246, 0.1)" },
  "modules": {
    "modulo-1": {
      "title": "Nombre del Módulo",
      "questions": [
        {
          "topic": "Subtema",
          "question": "¿Pregunta?",
          "options": [
            { "text": "Opción A", "explanation": "Por qué es correcta/incorrecta" },
            { "text": "Opción B", "explanation": "Por qué es correcta/incorrecta" },
            { "text": "Opción C", "explanation": "Por qué es correcta/incorrecta" },
            { "text": "Opción D", "explanation": "Por qué es correcta/incorrecta" }
          ],
          "correct": 0
        }
      ]
    }
  }
}

Reglas:
- 3 a 6 módulos según los temas principales
- 8 a 12 preguntas por módulo
- Exactamente 4 opciones por pregunta, cada una con "explanation"
- "correct" es el índice 0-3 de la opción correcta
- Idioma: el mismo del material de estudio
- El "id" debe ser un slug único (ej: "redes-computacion-2026")

Archivo fuente: ${baseName}

${text ? `MATERIAL:\n${text}` : 'Lee y analiza el documento PDF adjunto para generar el Course Pack.'}`;
    },

    async callAiApi(text, fileName) {
        const config = HubStorage.getApiConfig();
        const prompt = this.buildCoursePackPrompt(text, fileName);
        let raw;
        if (config.provider === 'claude') {
            raw = await this.callClaudeAPI(prompt, config.key);
        } else {
            raw = await this.callGeminiAPI(prompt, config.key);
        }
        const cleaned = this.cleanJsonResponse(raw);
        const pack = JSON.parse(cleaned);
        if (!pack.id || !pack.title || !pack.modules) throw new Error('La IA no generó un Course Pack válido. Intentá de nuevo.');
        return pack;
    },

    async callGeminiAPI(prompt, key) {
        const model = await this.getGeminiModel(key);
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
                })
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(`Gemini: ${err.error?.message || res.statusText}`);
        }
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    },

    async callClaudeAPI(prompt, key) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(`Claude: ${err.error?.message || res.statusText}`);
        }
        const data = await res.json();
        return data.content[0].text;
    },

    cleanJsonResponse(text) {
        text = text.trim();
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) return match[1].trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) return text.slice(start, end + 1);
        return text;
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
