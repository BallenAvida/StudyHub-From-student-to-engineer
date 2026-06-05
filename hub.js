const hubApp = {
    currentCourse: null,
    currentTestId: null,
    currentTestQuestions: [],
    currentQuestionIndex: 0,
    testScore: 0,
    failedQuestions: [],
    currentSessionResults: [], // per-answer tracking for results breakdown
    isReviewMode: false,
    isMockExam: false,
    mockTimeRemaining: 0,
    mockTimerInterval: null,
    deferredPrompt: null,

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
        this.setupKeyboardShortcuts();
        this.setupPWA();
        this.setupAchievements();
    },

    async checkInitialData() {
        let loaded = false;
        
        // Load and sync default AWS course pack on load to ensure updates are captured
        if (typeof DEFAULT_COURSE_PACK !== 'undefined') {
            console.log("Syncing default AWS course pack...");
            EngineStorage.savePack(DEFAULT_COURSE_PACK);
            loaded = true;
        }
        
        // Load and sync default Mathematics course pack on load to ensure updates are captured
        if (typeof MATEMATICAS_COURSE_PACK !== 'undefined') {
            console.log("Syncing default Mathematics course pack...");
            EngineStorage.savePack(MATEMATICAS_COURSE_PACK);
            loaded = true;
        }

        // Fallback to fetch if storage is completely empty
        const packs = EngineStorage.getAllPacks();
        if (packs.length === 0) {
            try {
                const response = await fetch('course_data.json');
                const defaultPack = await response.json();
                if (EngineStorage.savePack(defaultPack)) {
                    loaded = true;
                }
            } catch (e) {
                console.warn("Could not load default data via fetch", e);
            }
        }
        return loaded;
    },

    renderMath(element) {
        if (typeof renderMathInElement === 'function' && element) {
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\[', display: true}
                ],
                throwOnError: false
            });
        }
    },

    setupAchievements() {
        document.addEventListener('achievementUnlocked', (e) => {
            const achId = e.detail.id;
            const titles = {
                'streak_7': 'Racha de 7 días',
                'first_100': 'Primer 100%',
                'mock_5': 'Arquitecto Junior'
            };
            
            const popup = document.getElementById('achievement-popup');
            const titleEl = document.getElementById('achievement-popup-title');
            
            if (popup && titleEl) {
                titleEl.textContent = titles[achId] || '¡Nuevo Logro!';
                popup.classList.remove('hidden');
                popup.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    popup.style.transform = 'translateY(100px)';
                    setTimeout(() => popup.classList.add('hidden'), 500);
                }, 4000);
            }
            
            // Re-render if on analytics view
            if (!document.getElementById('view-analiticas').classList.contains('hidden')) {
                this.loadAnalytics();
            }
        });
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

    setupPWA() {
        const installBtn = document.getElementById('btn-install-pwa');
        const statusMsg = document.getElementById('pwa-status-msg');

        if (window.location.protocol === 'file:') {
            if (statusMsg) {
                statusMsg.classList.remove('hidden');
                statusMsg.innerHTML = `
                    <i class="fa-solid fa-circle-info" style="color:#3b82f6; margin-right:5px;"></i>
                    <b>Protocolo Local detectado:</b> Chrome no permite instalar aplicaciones desde archivos locales.<br><br>
                    Para habilitar el botón de instalación, ejecuta este comando en la carpeta del proyecto y abre <b>http://localhost:8080</b>:<br>
                    <code style="display:block; background:rgba(0,0,0,0.3); padding:8px; margin-top:8px; border-radius:4px; color:#a7f3d0; font-size:0.8rem;">python -m http.server 8080</code>
                `;
            }
            return;
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (installBtn) installBtn.style.display = 'inline-block';
            if (statusMsg) {
                statusMsg.classList.remove('hidden');
                statusMsg.style.background = 'rgba(16, 185, 129, 0.1)';
                statusMsg.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                statusMsg.innerHTML = '<i class="fa-solid fa-check-circle" style="color:#10b981; margin-right:5px;"></i> ¡Listo! Tu navegador soporta la instalación. Haz clic en el botón de abajo.';
            }
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            if (installBtn) installBtn.style.display = 'none';
            if (statusMsg) statusMsg.innerHTML = '¡Aplicación instalada con éxito! Ya puedes abrirla desde tu menú de aplicaciones.';
        });
    },

    async installPWA() {
        if (!this.deferredPrompt) return;
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        this.deferredPrompt = null;
    },

    clearSearch() {
        const d = document.getElementById('search-dropdown');
        if (d) d.classList.add('hidden');
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if a test is active
            if (this.currentTestQuestions.length === 0) return;
            // Ignore if user is typing in an input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const resultsView = document.getElementById('test-results');
            const isEndView = resultsView && !resultsView.classList.contains('hidden');
            
            if (!isEndView) {
                // Answering questions
                if (['1', '2', '3', '4'].includes(e.key)) {
                    const idx = parseInt(e.key) - 1;
                    const options = document.querySelectorAll('.option-btn');
                    if (options[idx] && !options[idx].disabled) {
                        options[idx].click();
                    }
                }
                
                if (e.key === ' ' || e.key === 'Enter') {
                    const nextBtn = document.getElementById('btn-next');
                    if (nextBtn && !nextBtn.classList.contains('hidden')) {
                        e.preventDefault();
                        nextBtn.click();
                    }
                }

                if (e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    this.readTestAloud();
                }
            } else {
                // Result view
                if (e.key === ' ' || e.key === 'Enter') {
                    const repasoBtn = document.getElementById('btn-repaso');
                    if (repasoBtn && !repasoBtn.classList.contains('hidden')) {
                        e.preventDefault();
                        repasoBtn.click();
                    } else {
                        const returnBtn = document.querySelector('#test-results .btn.secondary');
                        if (returnBtn) {
                            e.preventDefault();
                            returnBtn.click();
                        }
                    }
                }
            }
        });
    },

    handleSearchResult(courseId, moduleId, type) {
        document.getElementById('search-input').value = '';
        this.clearSearch();
        this.enterCourse(courseId);
        if ((type === 'module' || type === 'question') && moduleId) {
            setTimeout(() => this.openModule(moduleId), 150);
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

    async handlePDFUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        document.getElementById('ai-pdf-name').textContent = file.name;
        const consoleEl = document.getElementById('ai-pdf-console');
        consoleEl.classList.remove('hidden');
        consoleEl.innerHTML = `Iniciando extracción de ${file.name}...<br>`;

        try {
            // Configure pdf.js worker
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            consoleEl.innerHTML += `PDF cargado. Total de páginas: ${pdf.numPages}<br>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\\n';
                if (i % 10 === 0 || i === pdf.numPages) {
                    consoleEl.innerHTML += `Páginas extraídas: ${i} / ${pdf.numPages}<br>`;
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }
            }

            consoleEl.innerHTML += `Extracción completa. Tamaño total: ${fullText.length} caracteres.<br>`;
            
            // Chunking: break into ~15k char blocks to respect token limits later
            const chunkSize = 15000;
            const chunks = [];
            for (let i = 0; i < fullText.length; i += chunkSize) {
                chunks.push(fullText.substring(i, i + chunkSize));
            }

            consoleEl.innerHTML += `Texto fragmentado en ${chunks.length} bloques listos para procesar.<br>`;
            consoleEl.innerHTML += `<span style="color:#10b981">¡Éxito! El PDF ha sido estructurado localmente. Esta consola enviará los bloques a Claude/Gemini en la próxima versión.</span><br>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;

        } catch (error) {
            consoleEl.innerHTML += `<span style="color:#ef4444">Error al leer PDF: ${error.message}</span><br>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
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
        
        // Handle math course chalkboard mode styling
        const isMathCourse = this.currentCourse && this.currentCourse.id === 'matematica-unidad-1';
        const isStudyOrTest = (viewId === 'view-study-module' || viewId === 'view-test');
        console.log("switchView: viewId =", viewId, "isMathCourse =", isMathCourse, "isStudyOrTest =", isStudyOrTest);
        if (isMathCourse && isStudyOrTest) {
            document.body.classList.add('chalkboard-mode');
        } else {
            document.body.classList.remove('chalkboard-mode');
        }

        if (viewId === 'view-analiticas') this.loadAnalytics();
        if (viewId === 'view-configuracion') this.loadApiConfigForm();
        if (viewId === 'view-python-lab') this.initPythonLab();
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
            <div class="sq-item" onclick="hubApp.enterCourseAndReview('${item.courseId}', '${item.domain}')">
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
        
        document.getElementById('daily-challenge-container').classList.remove('hidden');
    },

    enterCourseAndReview(courseId, domain) {
        this.enterCourse(courseId);
        // Let the view render, then launch Spaced Repetition Review automatically
        setTimeout(() => this.startSpacedRepetitionReview(domain), 150);
    },

    startSpacedRepetitionReview(domain) {
        if (!this.currentCourse) return;
        
        const questions = HubStorage.getSpacedRepetitionQuestions(this.currentCourse.id, this.currentCourse, domain, 10);

        if (questions.length === 0) {
            alert('¡No hay preguntas disponibles para repasar en este dominio!');
            return;
        }

        document.getElementById('test-title').textContent = `🧠 Repaso: ${domain}`;
        document.getElementById('test-total').textContent = questions.length;

        this.currentTestQuestions = this.shuffleQuestionsAndOptions(questions);
        this.currentTestId = '__spaced_review__';
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.currentSessionResults = [];
        this.isReviewMode = true; // Don’t overwrite normal module scores, but we WILL track question stats

        this.switchView('view-test');
        this.renderQuestion();
    },

    startDailyChallenge() {
        const packs = EngineStorage.getAllPacks();
        let allDueQuestions = [];

        // Gather spaced repetition questions across ALL due courses and domains
        packs.forEach(pack => {
            const dueDomains = HubStorage.getDueItems(pack.id).map(d => d.domain);
            dueDomains.forEach(domain => {
                const qs = HubStorage.getSpacedRepetitionQuestions(pack.id, pack, domain, 5); // 5 per domain to mix it up
                // Tag them with courseId so we can save stats properly later
                const taggedQs = qs.map(q => ({ ...q, _courseId: pack.id }));
                allDueQuestions.push(...taggedQs);
            });
        });

        if (allDueQuestions.length === 0) {
            alert('¡No tienes repasos pendientes! Prueba haciendo un test nuevo primero.');
            return;
        }

        // Shuffle and take top 15 max
        allDueQuestions = allDueQuestions.sort(() => Math.random() - 0.5).slice(0, 15);

        // We need a dummy "currentCourse" context for the test UI to work smoothly
        // If there's no current course, just use the first one from the questions
        this.currentCourse = EngineStorage.getPack(allDueQuestions[0]._courseId);

        document.getElementById('test-title').textContent = '⚡ Daily Challenge';
        document.getElementById('test-total').textContent = allDueQuestions.length;

        this.currentTestQuestions = this.shuffleQuestionsAndOptions(allDueQuestions);
        this.currentTestId = '__daily_challenge__';
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.currentSessionResults = [];
        this.isReviewMode = true; // Tracks per-question stats, but doesn't affect module scores

        this.switchView('view-test');
        this.renderQuestion();
    },

    startMockExam() {
        const packs = EngineStorage.getAllPacks();
        let allQuestions = [];

        packs.forEach(pack => {
            const mods = pack.modules || {};
            Object.values(mods).forEach(m => {
                if (m.questions) {
                    m.questions.forEach(q => {
                        allQuestions.push({ ...q, _courseId: pack.id });
                    });
                }
            });
        });

        if (allQuestions.length === 0) {
            alert('No hay preguntas disponibles. Importa un curso primero.');
            return;
        }

        // Shuffle and pick 65
        allQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 65);

        // Set state
        this.currentCourse = EngineStorage.getPack(allQuestions[0]._courseId);
        document.getElementById('test-title').textContent = '⏱️ Simulacro de Certificación';
        document.getElementById('test-total').textContent = allQuestions.length;

        this.currentTestQuestions = this.shuffleQuestionsAndOptions(allQuestions);
        this.currentTestId = '__mock_exam__';
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.currentSessionResults = [];
        this.isReviewMode = false;
        this.isMockExam = true;

        this.startMockTimer(90); // 90 minutes
        this.switchView('view-test');
        this.renderQuestion();
    },

    startMockTimer(minutes) {
        this.mockTimeRemaining = minutes * 60;
        const timerEl = document.getElementById('mock-timer');
        const display = document.getElementById('timer-display');
        if (timerEl) timerEl.classList.remove('hidden');
        
        clearInterval(this.mockTimerInterval);
        
        const updateDisplay = () => {
            const m = Math.floor(this.mockTimeRemaining / 60);
            const s = this.mockTimeRemaining % 60;
            if (display) display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

        updateDisplay();

        this.mockTimerInterval = setInterval(() => {
            this.mockTimeRemaining--;
            updateDisplay();
            
            if (this.mockTimeRemaining <= 0) {
                clearInterval(this.mockTimerInterval);
                alert('¡Tiempo agotado!');
                this.currentQuestionIndex = this.currentTestQuestions.length; // Force end
                this.nextQuestion();
            }
        }, 1000);
    },

    renderCourses() {
        const packs = EngineStorage.getAllPacks();
        const grid = document.getElementById('courses-grid');
        const emptyState = document.getElementById('empty-courses-state');
        
        if (!grid) return;

        if (packs.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('mock-exam-container')?.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            grid.innerHTML = packs.map(pack => this.buildCard(pack)).join('');
            document.getElementById('mock-exam-container')?.classList.remove('hidden');
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

    shuffleQuestionsAndOptions(questionsArray) {
        return questionsArray.map(q => {
            const qClone = JSON.parse(JSON.stringify(q));
            const originalCorrect = qClone.options[qClone.correct];
            qClone.options.sort(() => Math.random() - 0.5);
            qClone.correct = qClone.options.findIndex(opt => 
                (typeof opt === 'string' ? opt : opt.text) === 
                (typeof originalCorrect === 'string' ? originalCorrect : originalCorrect.text)
            );
            return qClone;
        }).sort(() => Math.random() - 0.5);
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
            <div class="card" onclick="hubApp.openModule('${key}')" style="cursor: pointer;">
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

    // --- STUDY / TEST LOGIC ---

    openModule(moduleId) {
        if (!this.currentCourse || !this.currentCourse.modules[moduleId]) return;
        
        const moduleData = this.currentCourse.modules[moduleId];
        
        if (moduleData.content) {
            // Show study theory view first
            this.currentTestId = moduleId;
            document.getElementById('study-title').textContent = moduleData.title || moduleId;
            
            // Format content: Simple text to HTML paragraphs if not already HTML/Markdown processed
            let theoryHtml = moduleData.content;
            if (!theoryHtml.includes('<') && !theoryHtml.includes('>')) {
                theoryHtml = theoryHtml.split('\n\n').map(p => `<p>${p}</p>`).join('');
            }
            
            document.getElementById('study-theory-text').innerHTML = theoryHtml;
            this.renderMath(document.getElementById('study-theory-text'));
            
            const btnStart = document.getElementById('btn-start-test-from-study');
            btnStart.onclick = () => this.startTest(moduleId);
            
            this.switchView('view-study-module');
        } else {
            // No content, skip straight to test
            this.startTest(moduleId);
        }
    },

    startTest(testId) {
        if (!this.currentCourse || !this.currentCourse.modules[testId]) return;
        
        this.currentTestId = testId;
        const testData = this.currentCourse.modules[testId];
        
        document.getElementById('test-title').textContent = testData.title || testId;
        this.currentTestQuestions = this.shuffleQuestionsAndOptions([...(testData.questions || [])]);
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.failedQuestions = [];
        this.currentSessionResults = [];
        this.isReviewMode = false;
        this.isMockExam = false;

        const timerEl = document.getElementById('mock-timer');
        if (timerEl) timerEl.classList.add('hidden');
        clearInterval(this.mockTimerInterval);

        document.getElementById('test-total').textContent = this.currentTestQuestions.length;
        
        this.switchView('view-test');
        this.renderQuestion();
    },

    renderQuestion() {
        const q = this.currentTestQuestions[this.currentQuestionIndex];
        document.getElementById('test-current').textContent = this.currentQuestionIndex + 1;
        document.getElementById('test-q-topic').textContent = q.domain || q.topic || 'General';
        document.getElementById('test-q-text').innerHTML = q.question;

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
        
        // Render math equations using KaTeX
        this.renderMath(document.getElementById('test-q-text'));
        this.renderMath(document.getElementById('test-q-options'));
        
        const feedbackBox = document.getElementById('test-q-feedback');
        feedbackBox.className = 'feedback-box hidden';
        feedbackBox.innerHTML = '';
        
        document.getElementById('btn-test-next').classList.add('hidden');
        
        // Notes Logic
        const noteInput = document.getElementById('question-note-input');
        const noteStatus = document.getElementById('note-save-status');
        if (noteInput) {
            noteInput.value = HubStorage.getNote(q.id || q.question);
        }
        if (noteStatus) noteStatus.classList.add('hidden');
    },

    saveCurrentNote() {
        if (this.currentTestQuestions.length === 0) return;
        const q = this.currentTestQuestions[this.currentQuestionIndex];
        const input = document.getElementById('question-note-input');
        const status = document.getElementById('note-save-status');
        
        if (input && status) {
            HubStorage.saveNote(q.id || q.question, input.value);
            status.classList.remove('hidden');
            setTimeout(() => status.classList.add('hidden'), 2000);
        }
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

        // Track per-question history (we want to track it during Spaced Repetition / Daily Challenge too)
        // Only skip tracking if it's the post-test "Repasar Falladas" (failedQuestions review)
        if (this.currentTestId !== '__failed_review__' && (this.currentCourse || q._courseId)) {
            const domain = q.domain || q.topic || 'General';
            const targetCourseId = q._courseId || this.currentCourse.id;
            // Only save result if we have a valid test ID or if it's a dynamic review
            HubStorage.saveQuestionResult(targetCourseId, this.currentTestId, q.question, isCorrect, domain);
        }

        // Always track for the in-session domain breakdown on results screen
        this.currentSessionResults.push({
            domain: q.domain || q.topic || 'General',
            isCorrect
        });
        
        let explanationHtml = explanation ? `<div class="explanation-text">${explanation}</div>` : '';
        
        if (this.isMockExam) {
            // Blind mode
            options[index].classList.add('selected');
            if (isCorrect) this.testScore++;
            else this.failedQuestions.push(q);
        } else {
            // Normal mode
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
            this.renderMath(feedbackBox);
        }
        
        document.getElementById('btn-test-next').classList.remove('hidden');
    },

    nextQuestion() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.currentTestQuestions.length) {
            this.finishTest();
        } else {
            this.renderQuestion();
        }
    },

    finishTest() {
        clearInterval(this.mockTimerInterval);
        
        const total = this.currentTestQuestions.length;
        const pct = total > 0 ? Math.round((this.testScore / total) * 100) : 0;

        if (!this.isReviewMode && !this.isMockExam) {
            HubStorage.saveTestResult(this.currentCourse.id, this.currentTestId, this.testScore, total);
        }

        if (this.isMockExam) {
            const awsScore = Math.round(100 + (this.testScore / total) * 900);
            document.getElementById('score-message').textContent = `Puntaje: ${awsScore} / 1000`;
            const passed = awsScore >= 700;
            document.getElementById('score-phrase').textContent = passed ? '¡Aprobado! Estás listo para certificarte.' : 'No aprobado. Sigue practicando los dominios débiles.';
            if (passed && typeof confetti === 'function') {
                confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
            }
            if (passed) HubStorage.awardAchievement('mock_5'); // Assuming 1 passes gives it for now to test
        } else {
            document.getElementById('score-message').textContent = `Puntaje: ${this.testScore} de ${total} (${pct}%)`;

            let phrase = '¡Sigue practicando!';
            if (pct >= 90) phrase = '¡Excelente! Tienes dominio total.';
            else if (pct >= 70) phrase = '¡Muy buen trabajo!';

            document.getElementById('score-phrase').textContent = phrase;

            if (pct === 100) {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#3b82f6', '#10b981', '#f59e0b']
                    });
                }
                HubStorage.awardAchievement('first_100');
            }
        }

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
            let radarLabels = [];
            let radarData = [];

            packs.forEach(pack => {
                const domainStats = HubStorage.getDomainStats(pack.id);
                const entries = Object.entries(domainStats);
                if (entries.length === 0) return;

                // Sort worst domain first for the HTML list
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
                    
                    // For the Radar Chart
                    radarLabels.push(domain);
                    radarData.push(pct);

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

            // Render Radar Chart if Chart.js is loaded and we have data
            if (typeof Chart !== 'undefined' && radarLabels.length > 0) {
                const ctx = document.getElementById('radar-chart');
                if (ctx) {
                    // Destroy previous instance if it exists
                    if (window.myRadarChart) window.myRadarChart.destroy();
                    
                    window.myRadarChart = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: radarLabels,
                            datasets: [{
                                label: 'Porcentaje de Aciertos (%)',
                                data: radarData,
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                    pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12 } },
                                    ticks: { min: 0, max: 100, stepSize: 20, display: false, backdropColor: 'transparent' }
                                }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                }
            } else if (typeof Chart !== 'undefined') {
                const ctx = document.getElementById('radar-chart');
                if (ctx && window.myRadarChart) window.myRadarChart.destroy();
            }
        }

        // ── Gamification: Achievements ───────────────────────
        const achContainer = document.getElementById('achievements-container');
        if (achContainer) {
            const unlocked = HubStorage.getAchievements();
            const allAchievements = [
                { id: 'streak_7', icon: 'fa-fire', color: '#f97316', title: 'Constancia', desc: 'Racha de 7 días' },
                { id: 'first_100', icon: 'fa-star', color: '#fbbf24', title: 'Perfección', desc: 'Saca un 100% en un test' },
                { id: 'mock_5', icon: 'fa-stopwatch', color: '#ef4444', title: 'Arquitecto Junior', desc: 'Aprueba un simulacro' }
            ];
            
            achContainer.innerHTML = allAchievements.map(ach => {
                const isUnlocked = unlocked.includes(ach.id);
                const opacity = isUnlocked ? '1' : '0.3';
                const filter = isUnlocked ? 'none' : 'grayscale(100%)';
                return `
                <div class="achievement-card" style="opacity: ${opacity}; filter: ${filter}; display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; width: 120px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: ${ach.color}20; color: ${ach.color}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.5rem;">
                        <i class="fa-solid ${ach.icon}"></i>
                    </div>
                    <div style="font-size: 0.9rem; font-weight: bold; color: var(--text-primary);">${ach.title}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">${ach.desc}</div>
                </div>`;
            }).join('');
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

        this.currentTestQuestions = this.shuffleQuestionsAndOptions(questionsToReview);
        this.failedQuestions = [];
        this.currentQuestionIndex = 0;
        this.testScore = 0;
        this.isReviewMode = true;
        this.currentTestId = '__failed_review__'; // explicitly tag as failed review so stats aren't recorded again

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

        this.currentTestQuestions = this.shuffleQuestionsAndOptions(questions);
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
            raw = await this.callGeminiAPI(prompt, config.key, 'json');
        }
        const cleaned = this.cleanJsonResponse(raw);
        const pack = JSON.parse(cleaned);
        if (!pack.id || !pack.title || !pack.modules) throw new Error('La IA no generó un Course Pack válido. Intentá de nuevo.');
        return pack;
    },

    async callGeminiAPI(prompt, key, responseType = 'text') {
        const model = await this.getGeminiModel(key);
        const genConfig = { temperature: 0.3 };
        if (responseType === 'json') {
            genConfig.responseMimeType = 'application/json';
        }
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: genConfig
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

    // ── Export / Import User Data ────────────────────────────────

    exportUserData() {
        const globalData = HubStorage.getGlobal();
        const dataStr = JSON.stringify(globalData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'studyhub_backup_' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    importUserData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && typeof data === 'object') {
                    localStorage.setItem('studyhub_global', JSON.stringify(data));
                    alert('Datos importados correctamente. La aplicación se recargará.');
                    window.location.reload();
                } else {
                    throw new Error('Formato inválido');
                }
            } catch (err) {
                alert('Error al importar el archivo: ' + err.message);
            }
        };
        reader.readAsText(file);
    },

    // ── Voice Coach ──────────────────────────────────────────────

    readTestAloud() {
        if (!('speechSynthesis' in window)) return;
        const q = this.currentTestQuestions[this.currentQuestionIndex];
        if (!q) return;
        window.speechSynthesis.cancel(); // Stop anything currently playing
        
        // Build the string to read: Question, followed by each option
        let textToRead = q.question + '. ';
        const labels = ['Opción A.', 'Opción B.', 'Opción C.', 'Opción D.'];
        
        q.options.forEach((opt, index) => {
            const optText = typeof opt === 'object' ? opt.text : opt;
            textToRead += labels[index] + ' ' + optText + '. ';
        });
 
        const msg = new SpeechSynthesisUtterance(textToRead);
        msg.lang = this.currentCourse.lang || (this.currentCourse.id.includes('english') ? 'en-US' : 'es-ES');
        msg.rate = 1.0;
        window.speechSynthesis.speak(msg);
    },
 
    // ── Python Lab (Interactive Python Playground) ─────────────
 
    pythonChallenges: {
        suma: {
            title: "Suma de dos números",
            desc: "Define una función llamada `sumar(a, b)` que reciba dos parámetros y retorne su suma.",
            example: "sumar(5, 7) -> 12",
            initialCode: "def sumar(a, b):\n    # Escribe tu código aquí\n    pass\n",
            testScript: `
try:
    assert sumar(2, 3) == 5, "sumar(2, 3) debe retornar 5"
    assert sumar(-1, 1) == 0, "sumar(-1, 1) debe retornar 0"
    assert sumar(10.5, 2.5) == 13.0, "sumar(10.5, 2.5) debe retornar 13.0"
    print("¡TODAS LAS PRUEBAS PASADAS! Excelente trabajo.")
except AssertionError as e:
    print(f"FALLÓ LA PRUEBA: {e}")
    raise AssertionError(f"La prueba de suma falló: {e}")
except NameError as e:
    print("FALLÓ LA PRUEBA: La función 'sumar' no está definida.")
    raise NameError("La función 'sumar' no está definida.")
except Exception as e:
    print(f"ERROR AL EJECUTAR: {e}")
    raise e
`
        },
        mayor: {
            title: "Encontrar el número mayor",
            desc: "Define una función llamada `encontrar_mayor(a, b)` que devuelva el número más grande de los dos. Si son iguales, devuelve cualquiera.",
            example: "encontrar_mayor(10, 20) -> 20",
            initialCode: "def encontrar_mayor(a, b):\n    # Escribe tu código aquí\n    pass\n",
            testScript: `
try:
    assert encontrar_mayor(10, 20) == 20, "encontrar_mayor(10, 20) debe retornar 20"
    assert encontrar_mayor(5, -5) == 5, "encontrar_mayor(5, -5) debe retornar 5"
    assert encontrar_mayor(7, 7) == 7, "encontrar_mayor(7, 7) debe retornar 7"
    print("¡TODAS LAS PRUEBAS PASADAS! Excelente trabajo.")
except AssertionError as e:
    print(f"FALLÓ LA PRUEBA: {e}")
    raise AssertionError(f"La prueba de mayor falló: {e}")
except NameError as e:
    print("FALLÓ LA PRUEBA: La función 'encontrar_mayor' no está definida.")
    raise NameError("La función 'encontrar_mayor' no está definida.")
except Exception as e:
    print(f"ERROR AL EJECUTAR: {e}")
    raise e
`
        },
        promedio: {
            title: "Promedio de una lista",
            desc: "Define una función llamada `calcular_promedio(numeros)` que reciba una lista de números y devuelva su promedio aritmético (float). Si la lista está vacía, debe retornar 0.",
            example: "calcular_promedio([10, 20, 30]) -> 20.0",
            initialCode: "def calcular_promedio(numeros):\n    # Escribe tu código aquí\n    pass\n",
            testScript: `
try:
    assert calcular_promedio([10, 20, 30]) == 20.0, "calcular_promedio([10, 20, 30]) debe retornar 20.0"
    assert calcular_promedio([5]) == 5.0, "calcular_promedio([5]) debe retornar 5.0"
    assert calcular_promedio([]) == 0, "calcular_promedio([]) para una lista vacía debe retornar 0"
    print("¡TODAS LAS PRUEBAS PASADAS! Excelente trabajo.")
except AssertionError as e:
    print(f"FALLÓ LA PRUEBA: {e}")
    raise AssertionError(f"La prueba de promedio falló: {e}")
except NameError as e:
    print("FALLÓ LA PRUEBA: La función 'calcular_promedio' no está definida.")
    raise NameError("La función 'calcular_promedio' no está definida.")
except Exception as e:
    print(f"ERROR AL EJECUTAR: {e}")
    raise e
`
        },
        contrasena: {
            title: "Validar longitud de contraseña",
            desc: "Define una función llamada `validar_contrasena(clave)` que devuelva `True` si la contraseña tiene 8 o más caracteres de largo, y `False` de lo contrario.",
            example: "validar_contrasena('12345678') -> True",
            initialCode: "def validar_contrasena(clave):\n    # Escribe tu código aquí\n    pass\n",
            testScript: `
try:
    assert validar_contrasena("1234567") == False, "validar_contrasena('1234567') debe retornar False"
    assert validar_contrasena("12345678") == True, "validar_contrasena('12345678') debe retornar True"
    assert validar_contrasena("aiepprogramacion") == True, "validar_contrasena('aiepprogramacion') debe retornar True"
    print("¡TODAS LAS PRUEBAS PASADAS! Excelente trabajo.")
except AssertionError as e:
    print(f"FALLÓ LA PRUEBA: {e}")
    raise AssertionError(f"La prueba de contraseña falló: {e}")
except NameError as e:
    print("FALLÓ LA PRUEBA: La función 'validar_contrasena' no está definida.")
    raise NameError("La función 'validar_contrasena' no está definida.")
except Exception as e:
    print(f"ERROR AL EJECUTAR: {e}")
    raise e
`
        },
        paridad: {
            title: "Determinar si es par o impar",
            desc: "Define una función llamada `es_par(numero)` que devuelva la cadena `'par'` si el número es par, o `'impar'` si el número es impar.",
            example: "es_par(4) -> 'par'",
            initialCode: "def es_par(numero):\n    # Escribe tu código aquí\n    pass\n",
            testScript: `
try:
    assert es_par(4) == "par", "es_par(4) debe retornar 'par'"
    assert es_par(7) == "impar", "es_par(7) debe retornar 'impar'"
    assert es_par(0) == "par", "es_par(0) debe retornar 'par'"
    print("¡TODAS LAS PRUEBAS PASADAS! Excelente trabajo.")
except AssertionError as e:
    print(f"FALLÓ LA PRUEBA: {e}")
    raise AssertionError(f"La prueba de paridad falló: {e}")
except NameError as e:
    print("FALLÓ LA PRUEBA: La función 'es_par' no está definida.")
    raise NameError("La función 'es_par' no está definida.")
except Exception as e:
    print(f"ERROR AL EJECUTAR: {e}")
    raise e
`
        }
    },
 
    activeChallengeId: null,
    isPyodideLoading: false,
    isMonacoLoading: false,
 
    async async_loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.body.appendChild(script);
        });
    },
 
    async initPythonLab() {
        // 1. Load Monaco Editor
        if (typeof monaco === 'undefined' && !this.isMonacoLoading) {
            this.isMonacoLoading = true;
            this.appendTerminalOutput("Cargando Monaco Editor (Editor de VS Code)...\n", "stdout");
            try {
                if (typeof require === 'undefined' || typeof require.config === 'undefined') {
                    await this.async_loadScript('https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js');
                }
                this.loadMonacoEditor();
            } catch (err) {
                this.appendTerminalOutput(`Error cargando Monaco Editor: ${err.message}\n`, "stderr");
                this.isMonacoLoading = false;
            }
        } else if (typeof monaco !== 'undefined') {
            this.loadMonacoEditor();
        }
 
        // 2. Load Pyodide (lazy load on UI entry, but run is where it blocks)
        if (typeof loadPyodide === 'undefined' && !this.isPyodideLoading) {
            this.isPyodideLoading = true;
            this.appendTerminalOutput("Cargando motor de Python (Pyodide WebAssembly)...\n", "stdout");
            try {
                await this.async_loadScript('https://cdn.jsdelivr.net/npm/pyodide@0.26.1/pyodide.js');
                this.loadPyodideEngine();
            } catch (err) {
                this.appendTerminalOutput(`Error cargando Pyodide: ${err.message}\n`, "stderr");
                this.isPyodideLoading = false;
            }
        } else if (typeof loadPyodide !== 'undefined' && !window.pyodide) {
            this.loadPyodideEngine();
        }
    },
 
    async loadMonacoEditor() {
        if (window.pythonEditor) {
            // Editor already created, just trigger layout refresh
            setTimeout(() => window.pythonEditor.layout(), 100);
            return;
        }
        
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            const container = document.getElementById('python-editor-container');
            if (container) container.innerHTML = ''; // Clear spinner
            
            const defaultCode = "# Escribe tu código de Python aquí\nprint(\"¡Hola desde el Python Lab de StudyHub!\")\n\n# Puedes escribir funciones, bucles, etc.\nfor i in range(3):\n    print(f\"Iteración {i + 1}\")\n";
            
            window.pythonEditor = monaco.editor.create(container, {
                value: localStorage.getItem('studyhub_python_code') || defaultCode,
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                lineHeight: 20,
                padding: { top: 10, bottom: 10 }
            });
 
            // Save code locally to preserve work
            window.pythonEditor.onDidChangeModelContent(() => {
                localStorage.setItem('studyhub_python_code', window.pythonEditor.getValue());
            });
 
            this.registerAICompletionProvider();
            this.isMonacoLoading = false;
            this.appendTerminalOutput("VS Code Editor cargado con éxito. Autocompletado local (IntelliSense) activo.\n", "stdout");
        });
    },
 
    async loadPyodideEngine() {
        if (window.pyodide) return;
        
        const spinner = document.getElementById('python-status-spinner');
        const text = document.getElementById('python-status-text');
        const statusBlock = document.getElementById('python-engine-status');
 
        if (spinner) spinner.style.display = 'inline-block';
        if (text) text.textContent = 'Cargando motor de Python...';
        if (statusBlock) {
            statusBlock.style.background = 'rgba(245, 158, 11, 0.15)';
            statusBlock.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            statusBlock.style.color = '#f59e0b';
        }
 
        try {
            window.pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.26.1/",
                stdout: (output) => {
                    this.appendTerminalOutput(output + '\n', 'stdout');
                },
                stderr: (output) => {
                    this.appendTerminalOutput(output + '\n', 'stderr');
                }
            });
 
            if (spinner) spinner.style.display = 'none';
            if (text) text.textContent = 'Python 3 listo';
            if (statusBlock) {
                statusBlock.style.background = 'rgba(16, 185, 129, 0.15)';
                statusBlock.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                statusBlock.style.color = '#34d399';
            }
            this.appendTerminalOutput("Motor de Python 3.11 (WebAssembly) iniciado con éxito. Consola activa.\n", "stdout");
            this.isPyodideLoading = false;
        } catch (err) {
            this.appendTerminalOutput(`Error inicializando Pyodide: ${err.message}\n`, "stderr");
            if (spinner) spinner.style.display = 'none';
            if (text) text.textContent = 'Error al iniciar';
            this.isPyodideLoading = false;
        }
    },
 
    appendTerminalOutput(text, type = 'stdout') {
        const terminal = document.getElementById('python-terminal');
        if (!terminal) return;
        
        const span = document.createElement('span');
        if (type === 'stderr') {
            span.style.color = '#f87171';
            span.style.fontWeight = 'bold';
        } else {
            span.style.color = '#34d399';
        }
        
        span.textContent = text;
        terminal.appendChild(span);
        terminal.scrollTop = terminal.scrollHeight;
    },
 
    async runPythonCode() {
        const terminal = document.getElementById('python-terminal');
        if (terminal) terminal.innerHTML = ''; // Clear console
        
        document.getElementById('btn-debug-code').style.display = 'none';
        this.appendTerminalOutput("Ejecutando script...\n", "stdout");
 
        // Ensure Pyodide is loaded
        if (!window.pyodide) {
            await this.loadPyodideEngine();
            if (!window.pyodide) {
                this.appendTerminalOutput("Error: No se pudo cargar el intérprete de Python.\n", "stderr");
                return;
            }
        }
 
        const code = window.pythonEditor ? window.pythonEditor.getValue() : '';
        try {
            await window.pyodide.runPythonAsync(code);
            this.appendTerminalOutput("\n[Ejecución terminada con éxito]\n", "stdout");
        } catch (err) {
            this.appendTerminalOutput(`\n❌ Error de ejecución en Python:\n${err.message}\n`, "stderr");
            document.getElementById('btn-debug-code').style.display = 'inline-block'; // Show debug button!
        }
    },
 
    loadPythonChallenge(id) {
        this.activeChallengeId = id;
        const infoBox = document.getElementById('python-challenge-info');
        const verifyBtn = document.getElementById('btn-verify-challenge');
 
        if (!id || id === 'sandbox') {
            if (infoBox) infoBox.classList.add('hidden');
            if (verifyBtn) verifyBtn.style.display = 'none';
            return;
        }
 
        const chal = this.pythonChallenges[id];
        if (!chal) return;
 
        document.getElementById('challenge-title').textContent = chal.title;
        document.getElementById('challenge-desc').innerHTML = chal.desc;
        document.getElementById('challenge-example').textContent = chal.example;
 
        if (infoBox) infoBox.classList.remove('hidden');
        if (verifyBtn) verifyBtn.style.display = 'inline-block';
 
        if (window.pythonEditor) {
            window.pythonEditor.setValue(chal.initialCode);
        }
    },
 
    async verifyPythonChallenge() {
        const terminal = document.getElementById('python-terminal');
        if (terminal) terminal.innerHTML = ''; // Clear terminal
        
        document.getElementById('btn-debug-code').style.display = 'none';
        
        const chal = this.pythonChallenges[this.activeChallengeId];
        if (!chal) {
            this.appendTerminalOutput("Error: Ningún desafío cargado.\n", "stderr");
            return;
        }
 
        this.appendTerminalOutput(`Verificando solución para "${chal.title}"...\n`, "stdout");
 
        // Ensure Pyodide is loaded
        if (!window.pyodide) {
            await this.loadPyodideEngine();
            if (!window.pyodide) {
                this.appendTerminalOutput("Error: No se pudo cargar el intérprete de Python.\n", "stderr");
                return;
            }
        }
 
        const userCode = window.pythonEditor ? window.pythonEditor.getValue() : '';
        const runCode = userCode + '\n' + chal.testScript;
 
        try {
            await window.pyodide.runPythonAsync(runCode);
            this.appendTerminalOutput("\n✨ ¡DESAFÍO COMPLETADO CON ÉXITO! ✨\n", "stdout");
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        } catch (err) {
            this.appendTerminalOutput(`\n❌ La solución no pasó todas las pruebas obligatorias:\n${err.message}\n`, "stderr");
            document.getElementById('btn-debug-code').style.display = 'inline-block';
        }
    },
 
    toggleAiCopilot(checked) {
        if (checked) {
            const config = HubStorage.getApiConfig();
            if (!config.key) {
                alert("Debes configurar tu API Key de Gemini o Claude en la pestaña 'Configuración' antes de usar la IA.");
                document.getElementById('toggle-ai-copilot').checked = false;
            } else {
                this.appendTerminalOutput("Copilot IA activado. Al pausar la escritura por 800ms, se consultará a la IA.\n", "stdout");
            }
        } else {
            this.appendTerminalOutput("Copilot IA desactivado. Solo IntelliSense local activo.\n", "stdout");
        }
    },
 
    registerAICompletionProvider() {
        if (window.monacoInlineCompletionsRegistered) return;
        window.monacoInlineCompletionsRegistered = true;
 
        monaco.languages.registerInlineCompletionsProvider('python', {
            provideInlineCompletions: async function (model, position, context, token) {
                const aiEnabled = document.getElementById('toggle-ai-copilot')?.checked;
                if (!aiEnabled) return { items: [] };
 
                // Debounce: Wait 800ms
                const myPromise = new Promise((resolve) => setTimeout(resolve, 800));
                await myPromise;
                if (token.isCancellationRequested) return { items: [] };
 
                // Get code context before and after
                const textBefore = model.getValueInRange({
                    startLineNumber: Math.max(1, position.lineNumber - 15),
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
 
                try {
                    const suggestion = await hubApp.getAICodeSuggestion(textBefore);
                    if (!suggestion || token.isCancellationRequested) return { items: [] };
 
                    return {
                        items: [
                            {
                                insertText: suggestion,
                                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column)
                            }
                        ]
                    };
                } catch (e) {
                    console.warn("Error getting AI suggestion:", e);
                    return { items: [] };
                }
            },
            freeInlineCompletions: () => {}
        });
    },
 
    async getAICodeSuggestion(textBefore) {
        const config = HubStorage.getApiConfig();
        if (!config.key) return '';
 
        const prompt = `Eres un autocompletador de código de Python de baja latencia para un editor web. Tu tarea es completar el código que el usuario está escribiendo.
Instrucciones críticas:
1. Retorna ÚNICAMENTE el código faltante (una o dos líneas) a partir del cursor.
2. NO incluyas formato Markdown (sin bloques de código con triple comilla \`\`\`).
3. NO incluyas explicaciones ni comentarios.
4. Si no hay continuación lógica clara, devuelve vacío.

Código escrito hasta ahora:
${textBefore}`;
 
        let raw;
        if (config.provider === 'claude') {
            raw = await this.callClaudeAPI(prompt, config.key);
        } else {
            raw = await this.callGeminiAPI(prompt, config.key);
        }
 
        return this.cleanPythonResponse(raw);
    },
 
    cleanPythonResponse(text) {
        text = text.trim();
        const match = text.match(/```(?:python|py|javascript|js|json)?\s*([\s\S]*?)```/i);
        if (match) return match[1].trim();
        return text;
    },
 
    async explainPythonCode() {
        const config = HubStorage.getApiConfig();
        if (!config.key) {
            alert("Por favor, configura tu API Key en Configuración.");
            return;
        }
 
        const code = window.pythonEditor ? window.pythonEditor.getValue() : '';
        if (!code.trim()) {
            alert("Escribe algo de código en el editor primero.");
            return;
        }
 
        this.showLoading("Analizando tu código...");
        const prompt = `Explica en español de forma educativa, clara y concisa el siguiente código de Python para un estudiante universitario de programación. Estructúralo con puntos clave:\n\n\`\`\`python\n${code}\n\`\`\``;
 
        try {
            let resText;
            if (config.provider === 'claude') {
                resText = await this.callClaudeAPI(prompt, config.key);
            } else {
                resText = await this.callGeminiAPI(prompt, config.key);
            }
            this.hideLoading();
            this.showExplanationModal("Explicación de Código (IA)", resText);
        } catch (err) {
            this.hideLoading();
            alert(`Error: ${err.message}`);
        }
    },
 
    async debugPythonCode() {
        const config = HubStorage.getApiConfig();
        if (!config.key) {
            alert("Por favor, configura tu API Key en Configuración.");
            return;
        }
 
        const code = window.pythonEditor ? window.pythonEditor.getValue() : '';
        const terminal = document.getElementById('python-terminal');
        const errorText = terminal ? terminal.innerText : '';
 
        if (!code.trim() || !errorText.trim()) {
            alert("No hay error de terminal para depurar.");
            return;
        }
 
        this.showLoading("Depurando código...");
        const prompt = `El siguiente código de Python falló en el navegador del estudiante.
Depura el error y explica en español:
1. Qué causó el error (en términos amigables).
2. Dónde se encuentra el problema (indicando líneas de código).
3. Cómo arreglarlo paso a paso.
4. Proporciona el bloque de código corregido.

CÓDIGO:
\`\`\`python
${code}
\`\`\`

DETALLE DEL ERROR:
${errorText}`;
 
        try {
            let resText;
            if (config.provider === 'claude') {
                resText = await this.callClaudeAPI(prompt, config.key);
            } else {
                resText = await this.callGeminiAPI(prompt, config.key);
            }
            this.hideLoading();
            this.showExplanationModal("Depurador de IA", resText);
        } catch (err) {
            this.hideLoading();
            alert(`Error: ${err.message}`);
        }
    },
 
    showExplanationModal(title, contentMarkdown) {
        const existing = document.getElementById('python-explain-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'python-explain-modal';
        modal.className = 'modal';
        
        let htmlContent = contentMarkdown
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/^### (.*$)/gim, '<h4 style="color:var(--primary);margin:1rem 0 0.5rem 0;font-weight:700;">$1</h4>')
            .replace(/^## (.*$)/gim, '<h3 style="color:var(--primary);margin:1.2rem 0 0.6rem 0;font-weight:700;">$1</h3>')
            .replace(/^# (.*$)/gim, '<h2 style="color:var(--primary);margin:1.5rem 0 0.8rem 0;font-weight:800;">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#fca5a5;">$1</code>')
            .replace(/```python([\s\S]*?)```/gim, '<pre style="background:#080c14;padding:1rem;border-radius:8px;font-family:monospace;overflow-x:auto;margin:0.8rem 0;border:1px solid rgba(255,255,255,0.05);color:#a7f3d0;white-space:pre;">$1</pre>')
            .replace(/```([\s\S]*?)```/gim, '<pre style="background:#080c14;padding:1rem;border-radius:8px;font-family:monospace;overflow-x:auto;margin:0.8rem 0;border:1px solid rgba(255,255,255,0.05);color:var(--text-primary);white-space:pre;">$1</pre>')
            .replace(/^\s*[-*+]\s+(.*$)/gim, '<li style="margin-left:1.5rem;margin-bottom:0.4rem;color:var(--text-primary);">$1</li>');

        const parts = htmlContent.split(/(<pre[\s\S]*?<\/pre>)/gim);
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                parts[i] = parts[i].replace(/\n/g, '<br>');
            }
        }
        htmlContent = parts.join('');
 
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 650px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative;">
                <div class="modal-header" style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <h3 style="margin:0; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-brain" style="color:var(--primary);"></i> ${title}</h3>
                    <button class="close-modal" onclick="document.getElementById('python-explain-modal').remove()" style="background:transparent; border:none; color:var(--text-secondary); font-size:1.5rem; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="font-size:0.95rem; line-height:1.6; color:var(--text-primary);">
                    ${htmlContent}
                </div>
                <div class="modal-footer" style="margin-top:2rem; display:flex; justify-content:flex-end;">
                    <button class="btn primary" onclick="document.getElementById('python-explain-modal').remove()">Entendido</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // ── Study Chat (Pregúntale a tus Apuntes) ────────────────────
    chatHistory: [],

    openCourseChat() {
        if (!this.currentCourse) return;

        document.getElementById('course-chat-title').textContent = `Chat de Estudio: ${this.currentCourse.title}`;
        
        // Setup Provider Badge
        const config = HubStorage.getApiConfig();
        const providerNameEl = document.getElementById('course-chat-provider-name');
        if (providerNameEl) {
            providerNameEl.textContent = config.provider ? (config.provider.charAt(0).toUpperCase() + config.provider.slice(1)) : 'IA';
        }

        // Toggle warning if no API key is configured
        const warningEl = document.getElementById('chat-api-warning');
        const inputEl = document.getElementById('chat-input');
        const sendBtn = document.getElementById('btn-send-chat');

        if (!config.key) {
            if (warningEl) warningEl.classList.remove('hidden');
            if (inputEl) inputEl.disabled = true;
            if (sendBtn) sendBtn.disabled = true;
        } else {
            if (warningEl) warningEl.classList.add('hidden');
            if (inputEl) inputEl.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
        }

        // Reset chat message container (keeping the welcome message)
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="chat-message assistant">
                    <div class="chat-message-avatar">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                    <div class="chat-message-body">
                        <span class="chat-message-sender">Asistente de Estudio</span>
                        <div class="chat-message-text" id="chat-welcome-text">¡Hola! Puedes hacerme preguntas sobre cualquier tema de este curso. Analizaré todo el material disponible para responder tus dudas.</div>
                    </div>
                </div>
            `;
            
            // Set dynamic course-specific greeting
            const welcomeText = document.getElementById('chat-welcome-text');
            if (welcomeText) {
                welcomeText.textContent = `¡Hola! Soy tu asistente de estudio para "${this.currentCourse.title}". Escribe cualquier duda sobre la materia y te responderé utilizando los apuntes oficiales.`;
            }
        }

        this.chatHistory = [];
        this.switchView('view-course-chat');
    },

    switchToConfigTab(event) {
        if (event) event.preventDefault();
        this.switchView('view-configuracion');
        
        // Update sidebar menu items visual state
        const navItems = document.querySelectorAll('.nav-item[data-target]');
        navItems.forEach(nav => nav.classList.remove('active'));
        const configNavItem = document.querySelector('.nav-item[data-target="view-configuracion"]');
        if (configNavItem) configNavItem.classList.add('active');
    },

    async submitChatMessage(event) {
        if (event) event.preventDefault();

        const inputEl = document.getElementById('chat-input');
        if (!inputEl) return;

        const text = inputEl.value.trim();
        if (!text) return;

        inputEl.value = '';

        // Render User Message in UI
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const userMsgHtml = `
            <div class="chat-message user">
                <div class="chat-message-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="chat-message-body">
                    <span class="chat-message-sender">Estudiante</span>
                    <div class="chat-message-text">${text}</div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', userMsgHtml);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Render Typing Indicator
        const typingId = 'chat-typing-indicator';
        const typingHtml = `
            <div class="chat-message assistant" id="${typingId}">
                <div class="chat-message-avatar">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                </div>
                <div class="chat-message-body">
                    <span class="chat-message-sender">Asistente de Estudio</span>
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHtml);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to Local history
        this.chatHistory.push({ role: 'user', text });

        try {
            // Get AI Response
            const aiResponse = await this.getAIChatResponse(text);

            // Remove typing indicator
            const typingIndicatorEl = document.getElementById(typingId);
            if (typingIndicatorEl) typingIndicatorEl.remove();

            // Save to Local history
            this.chatHistory.push({ role: 'assistant', text: aiResponse });

            // Render Assistant Message in UI
            const assistantMsgHtml = `
                <div class="chat-message assistant">
                    <div class="chat-message-avatar">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                    <div class="chat-message-body">
                        <span class="chat-message-sender">Asistente de Estudio</span>
                        <div class="chat-message-text">${aiResponse}</div>
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', assistantMsgHtml);
            
            // Format math if equations are generated (using KaTeX)
            this.renderMath(messagesContainer);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error('Error fetching chat response:', error);
            
            // Remove typing indicator
            const typingIndicatorEl = document.getElementById(typingId);
            if (typingIndicatorEl) typingIndicatorEl.remove();

            const errMsgHtml = `
                <div class="chat-message assistant" style="border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05);">
                    <div class="chat-message-avatar" style="color: var(--danger); background: rgba(239, 68, 68, 0.2);">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="chat-message-body">
                        <span class="chat-message-sender" style="color: var(--danger);">Error</span>
                        <div class="chat-message-text" style="color: #fca5a5;">Hubo un error al conectar con el servidor de la IA.<br><br><small style="opacity: 0.85;"><b>Detalle técnico:</b> ${error.message || error}</small></div>
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', errMsgHtml);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    async getAIChatResponse(userMessage) {
        if (!this.currentCourse) return '';

        // Build course context
        let contextText = `MATERIAL DEL CURSO: "${this.currentCourse.title}"\n\n`;
        const modules = this.currentCourse.modules || {};
        for (const [key, mod] of Object.entries(modules)) {
            contextText += `--- MÓDULO: ${mod.title || key} ---\n`;
            if (mod.content) {
                // Strip simple HTML tags to keep context lightweight
                const cleanContent = mod.content.replace(/<[^>]*>/g, ' ');
                contextText += cleanContent.trim() + '\n\n';
            }
        }

        // Build compiled prompt with system rules, course notes, and history
        let prompt = `Eres un tutor de estudio de Inteligencia Artificial experto y didáctico para el curso "${this.currentCourse.title}".
Tu objetivo es ayudar al estudiante a responder sus dudas y comprender los conceptos clave del material provisto.

Reglas críticas de comportamiento:
1. Responde de forma amigable, estructurada y educativa en español.
2. Basate PRINCIPALMENTE en el material oficial provisto a continuación.
3. Si la pregunta del estudiante no tiene relación alguna con la materia del curso o no se puede resolver con el material proporcionado, explícaselo amigablemente, pero intenta de todos modos guiarlo usando principios generales alineados al curso.
4. Si generas fórmulas matemáticas o ecuaciones, escríbelas en notación LaTeX estándar utilizando signos de dólar simple para fórmulas en línea (ej: $E = mc^2$) o doble signo de dólar para fórmulas destacadas (ej: $$a^2 + b^2 = c^2$$), para que el motor KaTeX de la aplicación pueda renderizarlas en vivo.

MATERIAL OFICIAL DEL CURSO:
=========================================
${contextText}
=========================================

Historial del Chat:
`;

        // Append conversation history
        this.chatHistory.forEach(msg => {
            if (msg.role === 'user') {
                prompt += `Estudiante: ${msg.text}\n`;
            } else {
                prompt += `Asistente: ${msg.text}\n`;
            }
        });

        // Append current message
        prompt += `Estudiante: ${userMessage}\nAsistente: `;

        // Execute API call based on configured provider
        const config = HubStorage.getApiConfig();
        let rawResponse = '';
        if (config.provider === 'claude') {
            rawResponse = await this.callClaudeAPI(prompt, config.key);
        } else {
            rawResponse = await this.callGeminiAPI(prompt, config.key);
        }

        return this.cleanJsonResponse(rawResponse);
    }
};

window.hubApp = hubApp;
document.addEventListener('DOMContentLoaded', () => hubApp.init());
