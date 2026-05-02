const app = {
    state: {
        currentView: 'view-splash',
        currentCourse: null,
        currentGuide: null,
        currentGuideIndex: 0,
        currentTest: null,
        currentTestId: null,
        currentTestIndex: 0,
        score: 0,
        answered: false,
        gameState: {
            playerHP: 100,
            enemyHP: 100,
            level: 1,
            currentEnemy: null,
            currentQuestion: null,
            pool: []
        },
        memoryState: {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 0,
            isLocked: false
        },
        currentPPT: null,
        currentSlideIndex: 0
    },

    init() {
        if (typeof STUDY_DATA === 'undefined') {
            alert('Error: data.js no cargó correctamente. Asegúrate de generar el archivo.');
        }
        if (typeof HubStorage !== 'undefined') {
            HubStorage.recordSession('aws-cloud-practitioner');
        }
    },

    // --- Navigation ---
    switchView(viewId) {
        this.stopSpeech();
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        const viewName = viewId.startsWith('view-') ? viewId : `view-${viewId}`;
        const target = document.getElementById(viewName);
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 10);
        }
        this.state.currentView = viewName;
        this.updateHeaderButtons();
    },

    updateHeaderButtons() {
        const btnHome = document.getElementById('btn-home');
        const btnBack = document.getElementById('btn-back');

        if (this.state.currentView === 'view-splash') {
            btnHome.classList.add('hidden');
            btnBack.classList.add('hidden');
        } else if (this.state.currentView === 'view-dashboard') {
            btnHome.classList.remove('hidden');
            btnBack.classList.add('hidden');
        } else {
            btnHome.classList.remove('hidden');
            btnBack.classList.remove('hidden');
        }
    },

    enterCourseSelection() {
        this.switchView('view-dashboard');
    },

    goBack() {
        if (this.state.currentView === 'view-ppt-detail') {
            this.switchView('view-ppts');
        } else if (this.state.currentView === 'view-ppts') {
            this.switchView('view-dashboard');
        } else {
            this.switchView('view-dashboard');
        }
    },

    goHome() {
        this.stopSpeech();
        window.location.href = '../../index.html';
    },

    // --- Guide Logic ---
    startGuide(guideId) {
        if (!STUDY_DATA.guides[guideId]) return;

        this.state.currentGuide = STUDY_DATA.guides[guideId];
        this.state.currentGuideIndex = 0;

        document.getElementById('guide-title').textContent = this.state.currentGuide.title;
        document.getElementById('guide-total').textContent = this.state.currentGuide.temas.length;

        this.renderGuideTopic();
        this.switchView('guide');
    },

    renderGuideTopic() {
        const index = this.state.currentGuideIndex;
        const tema = this.state.currentGuide.temas[index];

        document.getElementById('guide-current').textContent = index + 1;
        document.getElementById('topic-title').textContent = tema.titulo;

        const linesContainer = document.getElementById('topic-lines');
        linesContainer.innerHTML = '';

        tema.lineas.forEach((line, i) => {
            const div = document.createElement('div');
            div.className = 'guide-line';
            div.style.animationDelay = `${i * 0.1}s`;

            let formattedLine = line;
            if (line.includes(':')) {
                const parts = line.split(':');
                if (parts[0].length < 40) {
                    formattedLine = `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}`;
                }
            }

            div.innerHTML = formattedLine;
            linesContainer.appendChild(div);
        });

        this.renderVisualAids(tema.titulo + " " + tema.lineas.join(" "));

        const qBox = document.getElementById('guide-question-box');
        if (tema.pregunta) {
            qBox.classList.remove('hidden');
            document.getElementById('guide-q-text').textContent = tema.pregunta.texto;

            const optionsGrid = document.getElementById('guide-q-options');
            optionsGrid.innerHTML = '';

            tema.pregunta.opciones.forEach((opt) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span class="letter"><strong>${opt.letra})</strong></span> <span>${opt.texto}</span>`;
                btn.dataset.isCorrect = opt.isCorrect;
                btn.onclick = () => this.answerGuideQuestion(opt, btn, optionsGrid);
                optionsGrid.appendChild(btn);
            });

            document.getElementById('guide-q-feedback').className = 'feedback-box hidden';
        } else {
            qBox.classList.add('hidden');
        }

        document.getElementById('btn-guide-prev').disabled = index === 0;

        const nextBtn = document.getElementById('btn-guide-next');
        if (index === this.state.currentGuide.temas.length - 1) {
            nextBtn.innerHTML = '<i class="fa-solid fa-check"></i> Terminar Guía';
        } else {
            nextBtn.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
        }
    },

    renderVisualAids(text) {
        const container = document.getElementById('visual-aids');
        container.innerHTML = '';
        text = text.toLowerCase();

        if (text.includes('bpmn')) {
            if (text.includes('inicio')) {
                container.innerHTML += `<div class="visual-aid"><div class="shape circle-green"></div><span class="label">Inicio</span></div>`;
            }
            if (text.includes('fin')) {
                container.innerHTML += `<div class="visual-aid"><div class="shape circle-red"></div><span class="label">Fin</span></div>`;
            }
            if (text.includes('exclusiva')) {
                container.innerHTML += `<div class="visual-aid"><div class="shape diamond"><span>X</span></div><span class="label">Exclusiva</span></div>`;
            }
            if (text.includes('paralela')) {
                container.innerHTML += `<div class="visual-aid"><div class="shape diamond"><span>+</span></div><span class="label">Paralela</span></div>`;
            }
            if (text.includes('inclusiva')) {
                container.innerHTML += `<div class="visual-aid"><div class="shape diamond"><span>O</span></div><span class="label">Inclusiva</span></div>`;
            }
        }
        if (text.includes('actor') && text.includes('caso de uso')) {
            container.innerHTML += `<div class="visual-aid"><div class="shape stickman"><i class="fa-solid fa-person"></i></div><span class="label">Actor</span></div>`;
            container.innerHTML += `<div class="visual-aid"><div class="shape oval"></div><span class="label">Caso de Uso</span></div>`;
        }
    },

    answerGuideQuestion(selectedOpt, btnNode, gridNode) {
        Array.from(gridNode.children).forEach(b => b.style.pointerEvents = 'none');

        const feedback = document.getElementById('guide-q-feedback');
        const icon = feedback.querySelector('.feedback-icon');
        const text = feedback.querySelector('.feedback-text');

        feedback.classList.remove('hidden', 'success', 'error');

        if (selectedOpt.isCorrect) {
            btnNode.classList.add('correct');
            feedback.classList.add('success');
            icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            text.innerHTML = `<strong>¡Correcto!</strong> ${selectedOpt.explicacion}`;
        } else {
            btnNode.classList.add('incorrect');
            feedback.classList.add('error');
            icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
            text.innerHTML = `<strong>Incorrecto.</strong> ${selectedOpt.explicacion}`;

            Array.from(gridNode.children).forEach(b => {
                if (b.dataset.isCorrect === "true") {
                    b.classList.add('correct');
                }
            });
        }
    },

    prevTopic() {
        if (this.state.currentGuideIndex > 0) {
            this.state.currentGuideIndex--;
            this.renderGuideTopic();
        }
    },

    nextTopic() {
        if (this.state.currentGuideIndex < this.state.currentGuide.temas.length - 1) {
            this.state.currentGuideIndex++;
            this.renderGuideTopic();
        } else {
            this.switchView('view-dashboard');
        }
    },

    // --- Test Logic ---
    startTest(testId) {
        if (!STUDY_DATA.tests[testId]) return;

        this.state.currentTest   = STUDY_DATA.tests[testId];
        this.state.currentTestId = testId;
        this.state.currentTestIndex = 0;
        this.state.score = 0;

        this.state.currentTest.questions.sort(() => Math.random() - 0.5);

        document.getElementById('test-title').textContent = this.state.currentTest.title;
        document.getElementById('test-total').textContent = this.state.currentTest.questions.length;

        this.renderTestQuestion();
        this.switchView('test');
    },

    renderTestQuestion() {
        this.state.answered = false;
        const index = this.state.currentTestIndex;
        const q     = this.state.currentTest.questions[index];
        const total = this.state.currentTest.questions.length;

        document.getElementById('test-current').textContent = index + 1;
        document.getElementById('test-progress-bar').style.width = `${((index) / total) * 100}%`;

        document.getElementById('test-q-topic').textContent = q.topic;
        document.getElementById('test-q-text').textContent  = q.question;

        const optionsList = document.getElementById('test-q-options');
        optionsList.innerHTML = '';

        const options = [...q.options].sort(() => Math.random() - 0.5);
        const letters = ['A', 'B', 'C', 'D'];

        options.forEach((opt, i) => {
            opt.displayLetter = letters[i];
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="letter"><strong>${letters[i]})</strong></span> <span>${opt.text}</span>`;
            btn.onclick = () => this.answerTestQuestion(opt, btn, optionsList, q, letters[i]);
            optionsList.appendChild(btn);
        });

        document.getElementById('test-q-feedback').className = 'feedback-box hidden';
        document.getElementById('test-q-feedback').innerHTML = '';
        document.getElementById('btn-test-next').classList.add('hidden');
    },

    answerTestQuestion(selectedOpt, btnNode, listNode, questionData, letterSelected) {
        if (this.state.answered) return;
        this.state.answered = true;

        Array.from(listNode.children).forEach(b => b.style.pointerEvents = 'none');

        if (selectedOpt.isCorrect) {
            btnNode.classList.add('correct');
            this.state.score++;
        } else {
            btnNode.classList.add('incorrect');
            const allBtns = Array.from(listNode.children);
            allBtns.forEach(b => {
                const textSpan = b.querySelectorAll('span')[1].innerText;
                if (textSpan === questionData.options.find(o => o.isCorrect).text) {
                    b.classList.add('correct');
                }
            });
        }

        const feedbackBox = document.getElementById('test-q-feedback');
        feedbackBox.classList.remove('hidden');
        feedbackBox.classList.add(selectedOpt.isCorrect ? 'success' : 'error');

        let feedbackHTML = `
            <div class="feedback-icon">${selectedOpt.isCorrect ? '<i class="fa-solid fa-check-circle"></i>' : '<i class="fa-solid fa-times-circle"></i>'}</div>
            <div class="feedback-content" style="flex-grow:1;">
                <h4 style="margin-bottom:1rem;">Explicación:</h4>
        `;

        const sortedOptions = [...questionData.options].sort((a, b) => (a.displayLetter || '').localeCompare(b.displayLetter || ''));
        sortedOptions.forEach(opt => {
            feedbackHTML += `
                <div class="explanation-item">
                    <strong>${opt.displayLetter}) ${opt.isCorrect ? '✅' : '❌'}</strong>
                    <span style="color:var(--text-secondary)">${opt.explanation}</span>
                </div>
            `;
        });
        feedbackHTML += '</div>';

        feedbackBox.innerHTML = feedbackHTML;

        const total = this.state.currentTest.questions.length;
        document.getElementById('test-progress-bar').style.width = `${((this.state.currentTestIndex + 1) / total) * 100}%`;

        const nextBtn = document.getElementById('btn-test-next');
        nextBtn.classList.remove('hidden');
        if (this.state.currentTestIndex === total - 1) {
            nextBtn.innerHTML = 'Ver Resultados <i class="fa-solid fa-flag-checkered"></i>';
        } else {
            nextBtn.innerHTML = 'Siguiente Pregunta <i class="fa-solid fa-arrow-right"></i>';
        }
    },

    nextQuestion() {
        if (this.state.currentTestIndex < this.state.currentTest.questions.length - 1) {
            this.state.currentTestIndex++;
            this.renderTestQuestion();
        } else {
            this.showTestResults();
        }
    },

    showTestResults() {
        const total      = this.state.currentTest.questions.length;
        const percentage = Math.round((this.state.score / total) * 100);

        // Save to hub storage and check for record
        let isNewRecord = false;
        if (typeof HubStorage !== 'undefined' && this.state.currentTestId) {
            const before = HubStorage.getCourse('aws-cloud-practitioner').tests[this.state.currentTestId];
            const prevBest = before ? before.bestScore : null;
            HubStorage.saveTestResult('aws-cloud-practitioner', this.state.currentTestId, this.state.score, total);
            isNewRecord = prevBest === null || percentage > prevBest;
        }

        this.switchView('results');

        document.getElementById('score-message').textContent = `Puntaje: ${this.state.score} de ${total}`;
        document.getElementById('score-text').textContent    = `${percentage}%`;

        const recordBadge = document.getElementById('score-record-badge');
        if (isNewRecord) {
            recordBadge.style.display = 'inline-block';
            recordBadge.classList.remove('hidden');
        } else {
            recordBadge.classList.add('hidden');
        }

        const circle = document.getElementById('score-path');
        setTimeout(() => {
            circle.setAttribute('stroke-dasharray', `${percentage}, 100`);

            if (percentage >= 90) {
                circle.style.stroke = '#10b981';
                document.getElementById('score-phrase').textContent = "¡Excelente! Nivel Experto.";
            } else if (percentage >= 70) {
                circle.style.stroke = '#3b82f6';
                document.getElementById('score-phrase').textContent = "¡Muy bien! Estás listo.";
            } else if (percentage >= 50) {
                circle.style.stroke = '#f59e0b';
                document.getElementById('score-phrase').textContent = "Aprobado, pero debes repasar más.";
            } else {
                circle.style.stroke = '#ef4444';
                document.getElementById('score-phrase').textContent = "Necesitas seguir estudiando las guías.";
            }
        }, 100);
    },

    // --- Agile Quest (Game Mode) ---
    startAgileQuest() {
        this.state.gameState = {
            playerHP: 100,
            enemyHP: 100,
            level: 1,
            currentEnemy: null,
            currentQuestion: null,
            pool: []
        };

        const allQuestions = [];
        Object.values(STUDY_DATA.tests).forEach(test => {
            allQuestions.push(...test.questions);
        });

        this.state.gameState.pool = allQuestions.sort(() => Math.random() - 0.5);

        this.switchView('view-game');
        this.generateEnemy();
    },

    generateEnemy() {
        const bosses = [
            { name: "El Cliente Indeciso",       icon: "fa-user-tie"    },
            { name: "Bug Crítico de Producción",  icon: "fa-bug"         },
            { name: "El Stakeholder Enojado",     icon: "fa-user-ninja"  },
            { name: "El Servidor Caído",          icon: "fa-server"      },
            { name: "La Deuda Técnica",           icon: "fa-ghost"       }
        ];

        const boss = bosses[(this.state.gameState.level - 1) % bosses.length];
        this.state.gameState.currentEnemy = boss;
        this.state.gameState.enemyHP      = 100;

        document.getElementById('enemy-name').textContent   = `Nivel ${this.state.gameState.level}: ${boss.name}`;
        document.getElementById('enemy-avatar').className   = `fa-solid ${boss.icon} fa-4x`;
        document.getElementById('game-level').textContent   = this.state.gameState.level;

        this.updateHealthBars();
        this.nextGameTurn();
    },

    nextGameTurn() {
        const pool = this.state.gameState.pool;
        if (pool.length === 0) {
            alert("¡Felicidades! Has derrotado a todos los jefes y completado el juego.");
            this.switchView('view-dashboard');
            return;
        }

        document.getElementById('btn-game-next').classList.add('hidden');
        document.getElementById('game-q-feedback').classList.add('hidden');

        const q = pool.pop();
        this.state.gameState.currentQuestion = q;

        document.getElementById('game-q-topic').textContent = "¡El enemigo ataca con una pregunta!";
        document.getElementById('game-q-text').innerHTML    = q.question;

        const optionsList = document.getElementById('game-q-options');
        optionsList.innerHTML = '';

        const options = [...q.options].sort(() => Math.random() - 0.5);
        const letters = ['A', 'B', 'C', 'D'];

        options.forEach((opt, i) => {
            opt.displayLetter = letters[i];
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="letter"><strong>${letters[i]})</strong></span> <span>${opt.text}</span>`;
            btn.onclick = () => this.playerAttack(opt, btn, optionsList);
            optionsList.appendChild(btn);
        });
    },

    playerAttack(selectedOpt, btnElement, optionsList) {
        Array.from(optionsList.children).forEach(b => b.onclick = null);

        const isCorrect  = selectedOpt.isCorrect;
        const feedbackBox = document.getElementById('game-q-feedback');
        feedbackBox.classList.remove('hidden');
        feedbackBox.className = `feedback-box battle-log ${isCorrect ? 'success' : 'error'}`;

        if (isCorrect) {
            btnElement.classList.add('correct');
            this.state.gameState.enemyHP -= 34;
            if (this.state.gameState.enemyHP < 0) this.state.gameState.enemyHP = 0;

            this.showFloatingDamage(document.querySelector('.enemy .avatar-container'), "34!", "#10b981");
            document.querySelector('.enemy').classList.add('shake', 'flash-red');
            setTimeout(() => document.querySelector('.enemy').classList.remove('shake', 'flash-red'), 500);

            feedbackBox.innerHTML = `<strong>¡GOLPE CRÍTICO!</strong> Elegiste correctamente. El enemigo pierde HP. <br><br> ${selectedOpt.explanation}`;
        } else {
            btnElement.classList.add('incorrect');

            const allBtns = Array.from(optionsList.children);
            allBtns.forEach(b => {
                const textSpan = b.querySelectorAll('span')[1].innerText;
                if (textSpan === this.state.gameState.currentQuestion.options.find(o => o.isCorrect).text) {
                    b.classList.add('correct');
                }
            });

            this.state.gameState.playerHP -= 20;
            if (this.state.gameState.playerHP < 0) this.state.gameState.playerHP = 0;

            this.showFloatingDamage(document.querySelector('.player .avatar-container'), "20!", "#ef4444");
            document.querySelector('.player').classList.add('shake', 'flash-red');
            setTimeout(() => document.querySelector('.player').classList.remove('shake', 'flash-red'), 500);

            feedbackBox.innerHTML = `<strong>¡FALLASTE EL ATAQUE!</strong> El enemigo contraataca y pierdes HP. <br><br> ${selectedOpt.explanation}`;
        }

        this.updateHealthBars();

        if (this.state.gameState.playerHP <= 0) {
            setTimeout(() => {
                alert("Has sido derrotado. ¡Sigue estudiando!");
                this.switchView('view-dashboard');
            }, 1000);
        } else if (this.state.gameState.enemyHP <= 0) {
            setTimeout(() => {
                alert(`¡Has derrotado a ${this.state.gameState.currentEnemy.name}! Avanzas al siguiente nivel.`);
                this.state.gameState.level++;
                this.generateEnemy();
            }, 1000);
        } else {
            document.getElementById('btn-game-next').classList.remove('hidden');
        }
    },

    updateHealthBars() {
        const pHP = this.state.gameState.playerHP;
        const eHP = this.state.gameState.enemyHP;
        document.getElementById('player-hp-bar').style.width  = `${pHP}%`;
        document.getElementById('enemy-hp-bar').style.width   = `${eHP}%`;
        document.getElementById('player-hp-text').textContent = pHP;
        document.getElementById('enemy-hp-text').textContent  = eHP;
    },

    showFloatingDamage(element, text, color) {
        const dmg = document.createElement('div');
        dmg.className   = 'damage-text';
        dmg.textContent = text;
        dmg.style.color = color;
        element.appendChild(dmg);
        setTimeout(() => dmg.remove(), 1000);
    },

    // --- Memory Game (Memorice) ---
    startMemoryGame() {
        this.state.memoryState = {
            cards: [], flippedCards: [],
            matchedPairs: 0, totalPairs: 0, isLocked: false
        };

        let sourceQuestions = [];
        if (STUDY_DATA.tests['test1']) {
            sourceQuestions = [...STUDY_DATA.tests['test1'].questions];
        } else {
            Object.values(STUDY_DATA.tests).forEach(test => {
                sourceQuestions.push(...test.questions);
            });
        }

        sourceQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = sourceQuestions.slice(0, 30);
        this.state.memoryState.totalPairs = selectedQuestions.length;

        const deck = [];
        selectedQuestions.forEach((q, index) => {
            const correctOpt = q.options.find(o => o.isCorrect);
            deck.push({ id: `q-${index}`, pairId: index, type: 'q', text: q.question });
            deck.push({ id: `a-${index}`, pairId: index, type: 'a', text: correctOpt ? correctOpt.text : "Respuesta correcta" });
        });

        deck.sort(() => Math.random() - 0.5);
        this.state.memoryState.cards = deck;

        document.getElementById('memory-score').textContent = "0";
        document.getElementById('memory-total').textContent  = this.state.memoryState.totalPairs;
        document.getElementById('btn-memory-continue').classList.add('hidden');

        this.renderMemoryGrid();
        this.switchView('view-memory');
    },

    renderMemoryGrid() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';

        this.state.memoryState.cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className       = 'memory-card';
            cardEl.dataset.index   = index;
            cardEl.onclick         = () => this.flipMemoryCard(cardEl, card);

            cardEl.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div class="memory-card-back type-${card.type}">
                        <span>${card.text}</span>
                    </div>
                </div>
            `;

            grid.appendChild(cardEl);
        });
    },

    flipMemoryCard(cardEl, cardData) {
        const state = this.state.memoryState;
        if (state.isLocked) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        cardEl.classList.add('flipped');
        state.flippedCards.push({ element: cardEl, data: cardData });

        if (state.flippedCards.length === 2) {
            this.checkMemoryMatch();
        }
    },

    checkMemoryMatch() {
        const state = this.state.memoryState;
        state.isLocked = true;

        const card1 = state.flippedCards[0];
        const card2 = state.flippedCards[1];
        const isMatch = (card1.data.pairId === card2.data.pairId) && (card1.data.type !== card2.data.type);

        if (isMatch) {
            setTimeout(() => {
                card1.element.classList.add('matched');
                card2.element.classList.add('matched');

                state.matchedPairs++;
                document.getElementById('memory-score').textContent = state.matchedPairs;

                this.resetMemoryTurn();

                if (state.matchedPairs === state.totalPairs) {
                    setTimeout(() => {
                        alert("¡Increíble! Has encontrado todas las parejas. Tu memoria está lista para el examen.");
                        this.switchView('view-dashboard');
                    }, 500);
                }
            }, 500);
        } else {
            document.getElementById('btn-memory-continue').classList.remove('hidden');
        }
    },

    continueMemory() {
        const state = this.state.memoryState;
        document.getElementById('btn-memory-continue').classList.add('hidden');
        if (state.flippedCards.length === 2) {
            state.flippedCards[0].element.classList.remove('flipped');
            state.flippedCards[1].element.classList.remove('flipped');
        }
        this.resetMemoryTurn();
    },

    resetMemoryTurn() {
        const state = this.state.memoryState;
        state.flippedCards = [];
        state.isLocked     = false;
    },

    // --- PPT Viewer ---
    openPPTList() {
        if (!STUDY_DATA.ppts) {
            alert('No hay datos de PPTs cargados. Asegúrate de haber ejecutado inject_ppts.py y que data.js esté actualizado.');
            return;
        }

        const grid = document.getElementById('ppt-list-grid');
        grid.innerHTML = '';

        const pptColors = ['#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#f87171', '#38bdf8'];
        let i = 0;

        Object.entries(STUDY_DATA.ppts).forEach(([key, ppt]) => {
            const color = pptColors[i % pptColors.length];
            const card  = document.createElement('div');
            card.className = 'card';
            card.style.cssText = 'flex-direction:column;align-items:center;text-align:center;padding:2rem;';
            card.innerHTML = `
                <div class="card-icon" style="width:70px;height:70px;font-size:2rem;margin-bottom:1rem;background:rgba(245,158,11,0.15);color:${color};">
                    <i class="fa-solid fa-file-powerpoint"></i>
                </div>
                <h3 style="margin-bottom:0.3rem;">${ppt.title}</h3>
                <p style="font-size:0.85rem;">${ppt.slides.length} diapositivas</p>
            `;
            card.onclick = () => this.openPPT(key);
            grid.appendChild(card);
            i++;
        });

        this.switchView('view-ppts');
    },

    openPPT(pptKey) {
        const ppt = STUDY_DATA.ppts[pptKey];
        if (!ppt) return;

        this.state.currentPPT        = ppt;
        this.state.currentSlideIndex = 0;

        document.getElementById('ppt-detail-title').textContent = ppt.title;
        this.renderSlide();
        this.switchView('view-ppt-detail');
    },

    renderSlide() {
        const ppt   = this.state.currentPPT;
        const index = this.state.currentSlideIndex;
        const slide = ppt.slides[index];

        const contentEl = document.getElementById('ppt-slide-content');
        contentEl.style.animation = 'none';
        contentEl.offsetHeight;
        contentEl.style.animation = '';

        document.getElementById('ppt-slide-number').textContent =
            String(slide.slide).padStart(2, '0');

        const mainContent = slide.content.split(/\n\n\[(Notas de clase|Nota|Detalle del docente)\]:/)[0];
        let html = `<p style="margin-bottom:1rem;">${mainContent.replace(/\n/g, '<br>')}</p>`;

        const normalizedTitle = ppt.title.toUpperCase();
        const slideLabel      = `Diapositiva ${slide.slide}`;
        const explanation     = typeof getExplanation === 'function'
            ? getExplanation(normalizedTitle, slideLabel)
            : null;

        if (explanation && explanation !== 'Explicación no disponible para esta diapositiva.') {
            html += `
                <div style="margin-top:1.5rem;padding:1.2rem 1.4rem;background:rgba(192,132,252,0.08);border-left:3px solid #c084fc;border-radius:0 10px 10px 0;">
                    <div style="color:#c084fc;font-size:0.8rem;font-weight:700;margin-bottom:0.7rem;text-transform:uppercase;letter-spacing:0.05em;">
                        <i class="fa-solid fa-chalkboard-user" style="margin-right:0.4rem;"></i>Explicación de la profesora
                    </div>
                    <p style="font-size:0.95rem;line-height:1.8;white-space:pre-line;">${explanation}</p>
                </div>`;
        }

        contentEl.innerHTML = html;
        document.getElementById('ppt-slide-counter').textContent =
            `Diapositiva ${index + 1} / ${ppt.slides.length}`;
    },

    nextSlide() {
        if (this.state.currentSlideIndex < this.state.currentPPT.slides.length - 1) {
            this.state.currentSlideIndex++;
            this.renderSlide();
        }
    },

    prevSlide() {
        if (this.state.currentSlideIndex > 0) {
            this.state.currentSlideIndex--;
            this.renderSlide();
        }
    },

    // --- Text To Speech ---
    stopSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    },

    toggleSpeech(text) {
        if (!('speechSynthesis' in window)) {
            alert("Tu navegador no soporta lectura de voz.");
            return;
        }
        if (window.speechSynthesis.speaking) {
            this.stopSpeech();
            return;
        }
        const utterance  = new SpeechSynthesisUtterance(text);
        utterance.lang   = 'es-ES';
        utterance.rate   = 1.0;
        utterance.pitch  = 1.0;
        window.speechSynthesis.speak(utterance);
    },

    readGuideAloud() {
        const index = this.state.currentGuideIndex;
        const tema  = this.state.currentGuide.temas[index];
        let textToRead = "Tema: " + tema.titulo + ". ";

        tema.lineas.forEach(line => {
            textToRead += line.replace(/<\/?[^>]+(>|$)/g, "") + ". ";
        });

        if (tema.pregunta) {
            textToRead += "Pregunta rápida: " + tema.pregunta.texto + ". ";
            tema.pregunta.opciones.forEach(opt => {
                textToRead += "Opción " + opt.letra + ": " + opt.texto + ". ";
            });
        }

        this.toggleSpeech(textToRead);
    },

    readTestAloud() {
        const index = this.state.currentTestIndex;
        const q     = this.state.currentTest.questions[index];
        let textToRead = "Pregunta: " + q.question + ". ";

        const listNode = document.getElementById('test-q-options');
        Array.from(listNode.children).forEach(btn => {
            textToRead += btn.innerText + ". ";
        });

        if (this.state.answered) {
            textToRead += " " + document.getElementById('test-q-feedback').innerText;
        }

        this.toggleSpeech(textToRead);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
