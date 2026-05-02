const COURSES = [
    {
        id:          'modelos-negocios',
        name:        'Modelos de Negocios',
        description: 'Requerimientos, Agile, BPMN y UML',
        icon:        'fa-chart-line',
        color:       '#60a5fa',
        colorBg:     'rgba(59, 130, 246, 0.2)',
        accentColor: '#3b82f6',
        path:        'cursos/modelos-negocios/index.html',
        semester:    'Sem. 1',
        tests:       ['test1', 'test2', 'test3'],
        locked:      false
    },
    {
        id:          'aws-cloud-practitioner',
        name:        'AWS Cloud Practitioner',
        description: 'Conceptos, Cómputo, Seguridad y Redes',
        icon:        'fa-aws',
        color:       '#f59e0b',
        colorBg:     'rgba(245, 158, 11, 0.2)',
        accentColor: '#f59e0b',
        path:        'cursos/aws-cloud-practitioner/index.html',
        semester:    'Certificación',
        tests:       ['aws_part1'],
        locked:      false
    },
    {
        id:          'placeholder-1',
        name:        'Próxima Materia',
        description: 'Agrega tu próximo curso cuando empiece el semestre.',
        icon:        'fa-plus',
        color:       '#94a3b8',
        colorBg:     'rgba(148, 163, 184, 0.1)',
        accentColor: 'transparent',
        path:        null,
        semester:    '',
        tests:       [],
        locked:      true
    }
];

const hub = {
    init() {
        this.setupNavigation();
        this.setupCalendar();
        this.setGreeting();
        this.loadGlobalStats();
        this.renderQuickResume();
        this.renderCourses();
        this.renderCalendar();
    },

    setupCalendar() {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const addButtons = document.querySelectorAll('.btn-add-event');
        const closeButtons = document.querySelectorAll('.close-modal');

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

        if (events.length === 0) {
            emptyState.classList.remove('hidden');
            eventList.classList.add('hidden');
            actions.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        eventList.classList.remove('hidden');
        actions.classList.remove('hidden');

        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        eventList.innerHTML = events.map(event => {
            const date = new Date(event.date);
            const day = date.getDate() + 1; // Correction for UTC
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
        const views = document.querySelectorAll('.dashboard-view');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // If it's "Mis Cursos", we activate the first item (Inicio) visually but maybe it scrolls, 
                // for now let's just activate the clicked item
                item.classList.add('active');

                // Switch view
                const targetId = item.getAttribute('data-target');
                views.forEach(view => {
                    if (view.id === targetId) {
                        view.classList.remove('hidden');
                        view.classList.add('active');
                    } else {
                        view.classList.add('hidden');
                        view.classList.remove('active');
                    }
                });

                // Smooth scroll to courses if "Mis Cursos" was clicked
                if (item.querySelector('span').textContent === 'Mis Cursos') {
                    const grid = document.getElementById('courses-grid');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    },

    setGreeting() {
        const h     = new Date().getHours();
        const global = HubStorage.getGlobal();
        const streak = global.streak ? global.streak.count : 0;

        let greeting;
        if      (h >= 5  && h < 12) greeting = '¡Buenos días!';
        else if (h >= 12 && h < 19) greeting = '¡Buenas tardes!';
        else                         greeting = '¡Buenas noches!';

        let sub;
        if (streak >= 7)       sub = `🔥 ¡${streak} días de racha! Imparable.`;
        else if (streak >= 2)  sub = `Llevas ${streak} días seguidos. ¡Sigue así!`;
        else                   sub = 'Tu hub de estudio personal.';

        document.getElementById('hub-greeting').textContent  = greeting;
        document.getElementById('hub-subgreeting').textContent = sub;
    },

    loadGlobalStats() {
        const global  = HubStorage.getGlobal();
        const streak   = global.streak ? global.streak.count : 0;
        const sessions = global.totalSessions || 0;

        document.getElementById('stat-streak').textContent   = streak;
        document.getElementById('stat-sessions').textContent = sessions;

        const analyticsStreak = document.getElementById('analytics-streak');
        if (analyticsStreak) analyticsStreak.textContent = streak + ' días';
        
        const analyticsSessions = document.getElementById('analytics-sessions');
        if (analyticsSessions) analyticsSessions.textContent = sessions + ' completadas';

        const badge = document.getElementById('streak-badge');
        if (streak > 0) {
            document.getElementById('streak-badge-num').textContent = streak;
            badge.classList.remove('hidden');
        }
    },

    renderQuickResume() {
        let lastCourse = null;
        let lastTime = 0;

        COURSES.forEach(c => {
            if (c.locked) return;
            const data = HubStorage.getCourse(c.id);
            if (data && data.lastStudied) {
                const t = new Date(data.lastStudied).getTime();
                if (t > lastTime) {
                    lastTime = t;
                    lastCourse = c;
                }
            }
        });

        if (!lastCourse) {
            lastCourse = COURSES.find(c => !c.locked);
        }

        const container = document.getElementById('quick-resume-container');
        if (!container || !lastCourse) return;

        container.innerHTML = `
            <div class="quick-resume-card">
                <div class="qr-content">
                    <div class="qr-label">
                        <i class="fa-solid fa-bolt"></i> Continuar Estudiando
                    </div>
                    <h3 class="qr-title">${lastCourse.name}</h3>
                    <p class="qr-desc">Retoma donde lo dejaste y mantén tu racha activa.</p>
                </div>
                <div class="qr-action">
                    <button class="qr-btn" onclick="hub.enterCourse('${lastCourse.id}')">
                        Continuar <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    },

    renderCourses() {
        const grid = document.getElementById('courses-grid');
        grid.innerHTML = COURSES.map(c => this.buildCard(c)).join('');
    },

    buildCard(course) {
        if (course.locked) {
            return `
            <div class="course-card locked" style="--card-accent: ${course.accentColor}">
                <div class="course-card-header">
                    <div class="course-card-icon" style="background:${course.colorBg};color:${course.color}">
                        <i class="fa-solid ${course.icon}"></i>
                    </div>
                </div>
                <div class="course-name">${course.name}</div>
                <div class="course-desc">${course.description}</div>
                <div class="lock-overlay">
                    <i class="fa-solid fa-lock"></i>
                    <span>Próximamente</span>
                </div>
            </div>`;
        }

        const data  = HubStorage.getCourse(course.id);
        const total = course.tests.length;
        let bestScore      = null;
        let testsAttempted = 0;

        course.tests.forEach(tid => {
            const t = data.tests[tid];
            if (t && t.attempts > 0) {
                testsAttempted++;
                if (t.bestScore !== null && (bestScore === null || t.bestScore > bestScore))
                    bestScore = t.bestScore;
            }
        });

        const progressPct  = total > 0 ? Math.round((testsAttempted / total) * 100) : 0;
        const lastStudied  = data.lastStudied ? this.formatDate(new Date(data.lastStudied)) : 'Nunca';
        const bestDisplay  = bestScore !== null ? `${bestScore}%` : '--';
        const testsDisplay = `${testsAttempted}/${total}`;
        const progressText = testsAttempted === 0
            ? 'Aún no has realizado ningún test'
            : `${testsAttempted} de ${total} tests completados`;

        return `
        <div class="course-card active" style="--card-accent:${course.accentColor}"
             onclick="hub.enterCourse('${course.id}')">
            <div class="course-card-header">
                <div class="course-card-icon" style="background:${course.colorBg};color:${course.color}">
                    <i class="fa-solid ${course.icon}"></i>
                </div>
                <div class="course-meta">
                    ${course.semester ? `<span class="course-semester">${course.semester}</span>` : ''}
                    <span class="course-last-studied">Último: ${lastStudied}</span>
                </div>
            </div>
            <div class="course-name">${course.name}</div>
            <div class="course-desc">${course.description}</div>
            <div class="course-stats-row">
                <div class="course-stat">
                    <span class="course-stat-value">${bestDisplay}</span>
                    <span class="course-stat-label">Mejor puntaje</span>
                </div>
                <div class="course-stat">
                    <span class="course-stat-value">${testsDisplay}</span>
                    <span class="course-stat-label">Tests</span>
                </div>
                <div class="course-stat">
                    <span class="course-stat-value">${lastStudied}</span>
                    <span class="course-stat-label">Último estudio</span>
                </div>
            </div>
            <div class="course-progress-wrap">
                <div class="course-progress-track">
                    <div class="course-progress-fill"
                         style="width:${progressPct}%;background:${course.color}"></div>
                </div>
                <span class="course-progress-text">${progressText}</span>
            </div>
            <div class="course-card-footer">
                <button class="btn primary">
                    Entrar <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;
    },

    enterCourse(courseId) {
        const course = COURSES.find(c => c.id === courseId);
        if (course && course.path) window.location.href = course.path;
    },

    formatDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.round((today - d) / 86400000);
        if (diff === 0) return 'Hoy';
        if (diff === 1) return 'Ayer';
        if (diff < 7)   return `Hace ${diff} días`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
};

document.addEventListener('DOMContentLoaded', () => hub.init());
