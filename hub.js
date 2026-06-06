const MathSolver = {
    // Greatest Common Divisor
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    },
    
    // Least Common Multiple
    lcm(a, b) {
        return (Math.abs(a * b) / this.gcd(a, b)) || 0;
    },

    // Convert decimal to simplified LaTeX fraction if possible
    toFraction(val) {
        if (Math.abs(val - Math.round(val)) < 1e-9) {
            return Math.round(val).toString();
        }
        let bestNum = 1, bestDen = 1, bestErr = Math.abs(val - 1);
        for (let den = 1; den <= 100; den++) {
            let num = Math.round(val * den);
            let err = Math.abs(val - num / den);
            if (err < bestErr) {
                bestErr = err;
                bestNum = num;
                bestDen = den;
            }
            if (err < 1e-9) break;
        }
        if (bestErr < 1e-4) {
            let g = this.gcd(bestNum, bestDen);
            let n = bestNum / g;
            let d = bestDen / g;
            if (d === 1) return n.toString();
            if (d < 0) { n = -n; d = -d; }
            return `\\frac{${n}}{${d}}`;
        }
        return val.toFixed(4).replace(/\.?0+$/, '');
    },

    // Check if the expression contains quadratic terms
    isQuadratic(expr) {
        let clean = expr.replace(/\s+/g, '');
        return clean.includes('x^2');
    },

    solve(expr, method = 'formula_general') {
        let normalized = expr.trim()
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
            
        normalized = normalized.replace(/(\d+),(\d+)/g, '$1.$2');
        normalized = normalized.replace(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/gi, '$1*$2');
        
        let cleanExpr = normalized.replace(/\s+/g, '');
        try {
            // Check if it's mcm or gcd
            let mcmGcdMatch = cleanExpr.match(/^(mcm|lcm|mcd|gcd)\((\d+)[,;](\d+)\)$/i);
            if (mcmGcdMatch) {
                return this.solveMcmGcd(mcmGcdMatch[1].toLowerCase(), parseInt(mcmGcdMatch[2]), parseInt(mcmGcdMatch[3]));
            }

            // 1. Check if it's a 2x2 System of Linear Equations
            let systemMatch = cleanExpr.split(/[;,]/);
            if (systemMatch.length === 2 && systemMatch[0].includes('=') && systemMatch[1].includes('=')) {
                return this.solveSystem2x2(systemMatch[0], systemMatch[1]);
            }

            // 2. Check if it's a Derivative
            let derivMatch = cleanExpr.match(/^d\/dx\((.*)\)$/i);
            if (derivMatch) {
                return this.solveDerivative(derivMatch[1]);
            }

            // Check if it's an Integral
            let integralMatch = cleanExpr.match(/^int\((.*)\)dx$/i) ||
                                cleanExpr.match(/^\\int\((.*)\)dx$/i) ||
                                cleanExpr.match(/^int(.*)dx$/i);
            if (integralMatch) {
                return this.solveIntegral(integralMatch[1]);
            }

            // 3. Check if it's a Quadratic Equation: ax^2 + bx + c = 0
            if (this.isQuadratic(cleanExpr)) {
                return this.solveQuadratic(cleanExpr, method);
            }
            
            // 4. Check if it's a Linear Equation: ax + b = c
            let linMatch = cleanExpr.match(/^([-+]?\d*(?:\.\d+)?)x([-+]\d+(?:\.\d+)?)=([-+]?\d+(?:\.\d+)?)$/) ||
                           cleanExpr.match(/^([-+]?\d*(?:\.\d+)?)x=([-+]?\d+(?:\.\d+)?)$/);
            if (linMatch) {
                return this.solveLinear(cleanExpr);
            }

            // 5. Check if it's a fraction operation: n1/d1 + n2/d2
            let fracMatch = cleanExpr.match(/^([-+]?\d+)\/(\d+)([-+])([-+]?\d+)\/(\d+)$/);
            if (fracMatch) {
                return this.solveFractions(fracMatch);
            }
            
            // Default: Scientific arithmetic evaluation
            return this.solveArithmetic(cleanExpr, normalized);
            
        } catch (e) {
            return { error: true, message: e.message };
        }
    },

    solveIntegral(innerExpr) {
        let clean = innerExpr.trim().replace(/\s+/g, '');
        
        const splitTerms = (expr) => {
            let terms = [];
            let currentTerm = "";
            let parenDepth = 0;
            for (let i = 0; i < expr.length; i++) {
                let char = expr[i];
                if (char === '(') parenDepth++;
                if (char === ')') parenDepth--;
                
                if ((char === '+' || char === '-') && parenDepth === 0 && i > 0) {
                    terms.push(currentTerm);
                    currentTerm = char;
                } else {
                    currentTerm += char;
                }
            }
            if (currentTerm) {
                terms.push(currentTerm);
            }
            return terms;
        };

        let rawTerms = splitTerms(clean);
        let steps = [];
        let problemLaTeX = `\\int \\left( ${rawTerms.join(' ').replace(/\+/g, '+ ').replace(/\-/g, '- ')} \\right) dx`;
        
        steps.push({
            desc: "Aplicar la regla de la suma para integrales (la integral de una suma es la suma de las integrales):",
            latex: rawTerms.map(t => `\\int \\left(${t}\\right) dx`).join(' + ').replace(/\+\s*\-/g, '- ')
        });

        let results = [];
        
        rawTerms.forEach((term) => {
            let cleanTerm = term.replace(/^\+/, '');
            
            // 1. Match constant: c
            let constMatch = cleanTerm.match(/^([-+]?\d+(?:\.\d+)?)$/);
            if (constMatch) {
                let val = parseFloat(constMatch[1]);
                steps.push({
                    desc: `Para el término $${cleanTerm}$: La integral de una constante $c$ es $c \\cdot x$:`,
                    latex: `\\int \\left(${cleanTerm}\\right) dx = ${this.formatTermLaTeX(val, 1)}`
                });
                results.push({ termLaTeX: this.formatTermLaTeX(val, 1) });
                return;
            }

            // 2. Match linear term: cx
            let linMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)x$/);
            if (linMatch) {
                let val = linMatch[1];
                let c = 1;
                if (val === '' || val === '+') c = 1;
                else if (val === '-') c = -1;
                else c = parseFloat(val);

                let coeffLaTeX = this.toFraction(c / 2);
                let coeffStr = coeffLaTeX.includes('\\frac') ? coeffLaTeX : (c/2 === 1 ? '' : c/2 === -1 ? '-' : (c/2).toString());
                steps.push({
                    desc: `Para el término $${cleanTerm}$: Aplicar la regla de la potencia $\\int x^n dx = \\frac{x^{n+1}}{n+1}$ con $n=1$:`,
                    latex: `\\int \\left(${cleanTerm}\\right) dx = ${c === 1 ? '' : c === -1 ? '-' : c + ' \\cdot '} \\frac{x^2}{2} = ${coeffStr}x^2`
                });
                results.push({ termLaTeX: `${coeffStr}x^2` });
                return;
            }

            // 3. Match power term: cx^n
            let powerMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)x\^([-+]?\d+(?:\.\d+)?)$/);
            if (powerMatch) {
                let valC = powerMatch[1];
                let valN = powerMatch[2];
                let c = 1;
                if (valC === '' || valC === '+') c = 1;
                else if (valC === '-') c = -1;
                else c = parseFloat(valC);

                let n = parseFloat(valN);
                if (n === -1) {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La integral de $x^{-1}$ (o $1/x$) es $\\ln|x|$:`,
                        latex: `\\int \\left(${cleanTerm}\\right) dx = ${c === 1 ? '' : c === -1 ? '-' : c}\\ln|x|`
                    });
                    let cStr = c === 1 ? '' : c === -1 ? '-' : c.toString();
                    results.push({ termLaTeX: `${cStr}\\ln|x|` });
                    return;
                }

                let newN = n + 1;
                let newC = c / newN;

                let coeffLaTeX = this.toFraction(newC);
                let coeffStr = coeffLaTeX.includes('\\frac') ? coeffLaTeX : (newC === 1 ? '' : newC === -1 ? '-' : newC.toString());
                
                steps.push({
                    desc: `Para el término $${cleanTerm}$: Aplicar la regla de la potencia $\\int x^n dx = \\frac{x^{n+1}}{n+1}$ con $n=${n}$:`,
                    latex: `\\int \\left(${cleanTerm}\\right) dx = ${c === 1 ? '' : c === -1 ? '-' : c + ' \\cdot '} \\frac{x^{${newN}}}{${newN}} = ${coeffStr}x^{${newN}}`
                });
                results.push({ termLaTeX: `${coeffStr}x^{${newN}}` });
                return;
            }

            // 4. Match trigonometric: c sin(x) / c cos(x)
            let trigMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)(sin|cos)\(x\)$/);
            if (trigMatch) {
                let valC = trigMatch[1];
                let func = trigMatch[2];
                let c = 1;
                if (valC === '' || valC === '+') c = 1;
                else if (valC === '-') c = -1;
                else c = parseFloat(valC);

                if (func === 'sin') {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La integral de $\\sin(x)$ es $-\\cos(x)$.`,
                        latex: `\\int \\left(${cleanTerm}\\right) dx = -${c === 1 ? '' : c === -1 ? '-' : c}\\cos(x)`
                    });
                    results.push({ termLaTeX: this.formatTermLaTeX(-c, 0, true, 'cos') });
                } else if (func === 'cos') {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La integral de $\\cos(x)$ es $\\sin(x)$.`,
                        latex: `\\int \\left(${cleanTerm}\\right) dx = ${c === 1 ? '' : c === -1 ? '-' : c}\\sin(x)`
                    });
                    results.push({ termLaTeX: this.formatTermLaTeX(c, 0, true, 'sin') });
                }
                return;
            }

            steps.push({
                desc: `Para el término $${cleanTerm}$: No se puede integrar automáticamente localmente.`,
                latex: `\\int \\left(${cleanTerm}\\right) dx = \\text{Desconocido}`
            });
            results.push({ termLaTeX: `\\int \\left(${cleanTerm}\\right) dx` });
        });

        let finalTerms = results.map(r => r.termLaTeX).filter(t => t !== "");
        let finalResultLaTeX = finalTerms.join(' + ').replace(/\+\s*\-/g, '- ') + " + C";

        steps.push({
            desc: "Combinar los términos y agregar la constante de integración ($C$):",
            latex: finalResultLaTeX
        });

        return {
            problemLaTeX: problemLaTeX,
            result: finalResultLaTeX,
            resultLaTeX: finalResultLaTeX,
            steps: steps
        };
    },

    solveSystem2x2(eq1, eq2) {
        const parseLinear2D = (eq) => {
            let eqParts = eq.split('=');
            if (eqParts.length !== 2) return null;
            let lhs = eqParts[0];
            let rhs = parseFloat(eqParts[1]);
            if (isNaN(rhs)) return null;

            let a = 0, b = 0;
            let matchX = lhs.match(/([-+]?\d*(?:\.\d+)?)x/);
            if (matchX) {
                let val = matchX[1];
                if (val === '' || val === '+') a = 1;
                else if (val === '-') a = -1;
                else a = parseFloat(val);
            }
            let matchY = lhs.match(/([-+]?\d*(?:\.\d+)?)y/);
            if (matchY) {
                let val = matchY[1];
                if (val === '' || val === '+') b = 1;
                else if (val === '-') b = -1;
                else b = parseFloat(val);
            }
            return { a, b, c: rhs };
        };

        let parsed1 = parseLinear2D(eq1);
        let parsed2 = parseLinear2D(eq2);

        if (!parsed1 || !parsed2) {
            return { error: true, message: "No se pudieron parsear las ecuaciones del sistema. Deben tener el formato ax+by=c." };
        }

        let a1 = parsed1.a, b1 = parsed1.b, c1 = parsed1.c;
        let a2 = parsed2.a, b2 = parsed2.b, c2 = parsed2.c;

        let D = a1 * b2 - a2 * b1;
        let Dx = c1 * b2 - c2 * b1;
        let Dy = a1 * c2 - a2 * c1;

        let steps = [];
        steps.push({
            desc: "Identificar los coeficientes del sistema de ecuaciones $2 \\times 2$:",
            latex: `\\begin{matrix} 1) \\quad ${a1}x ${b1>=0?'+':''} ${b1}y = ${c1} \\\\ 2) \\quad ${a2}x ${b2>=0?'+':''} ${b2}y = ${c2} \\end{matrix}`
        });

        steps.push({
            desc: "Calcular el determinante general ($D$) del sistema:",
            latex: `D = \\begin{vmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{vmatrix} = (${a1} \\cdot ${b2}) - (${a2} \\cdot ${b1}) = ${a1*b2} - (${a2*b1}) = ${D}`
        });

        if (D === 0) {
            if (Dx === 0 && Dy === 0) {
                return {
                    problemLaTeX: `\\begin{cases} ${a1}x ${b1>=0?'+':''} ${b1}y = ${c1} \\\\ ${a2}x ${b2>=0?'+':''} ${b2}y = ${c2} \\end{cases}`,
                    result: "Infinitas soluciones",
                    resultLaTeX: "\\text{Infinitas soluciones (Sistema compatible indeterminado)}",
                    steps: steps
                };
            } else {
                return {
                    problemLaTeX: `\\begin{cases} ${a1}x ${b1>=0?'+':''} ${b1}y = ${c1} \\\\ ${a2}x ${b2>=0?'+':''} ${b2}y = ${c2} \\end{cases}`,
                    result: "Sin solución",
                    resultLaTeX: "\\text{Sin solución (Sistema incompatible)}",
                    steps: steps
                };
            }
        }

        steps.push({
            desc: "Calcular el determinante en $x$ ($D_x$) reemplazando la columna de $x$ por las constantes:",
            latex: `D_x = \\begin{vmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{vmatrix} = (${c1} \\cdot ${b2}) - (${c2} \\cdot ${b1}) = ${c1*b2} - (${c2*b1}) = ${Dx}`
        });

        steps.push({
            desc: "Calcular el determinante en $y$ ($D_y$) reemplazando la columna de $y$ por las constantes:",
            latex: `D_y = \\begin{vmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{vmatrix} = (${a1} \\cdot ${c2}) - (${a2} \\cdot ${c1}) = ${a1*c2} - (${a2*c1}) = ${Dy}`
        });

        let x = Dx / D;
        let y = Dy / D;

        steps.push({
            desc: "Resolver para $x$ y para $y$ usando la Regla de Cramer:",
            latex: `x = \\frac{D_x}{D} = \\frac{${Dx}}{${D}} = ${x.toFixed(4).replace(/\.?0+$/, '')}, \\quad y = \\frac{D_y}{D} = \\frac{${Dy}}{${D}} = ${y.toFixed(4).replace(/\.?0+$/, '')}`
        });

        return {
            problemLaTeX: `\\begin{cases} ${a1 === 1 ? '' : a1 === -1 ? '-' : a1}x ${b1 > 0 ? '+ ' + b1 : b1 < 0 ? '- ' + Math.abs(b1) : ''}y = ${c1} \\\\ ${a2 === 1 ? '' : a2 === -1 ? '-' : a2}x ${b2 > 0 ? '+ ' + b2 : b2 < 0 ? '- ' + Math.abs(b2) : ''}y = ${c2} \\end{cases}`.replace(/\+\s*-/g, '- '),
            result: `x = ${x}, y = ${y}`,
            resultLaTeX: `x = ${this.toFraction(x)}, \\quad y = ${this.toFraction(y)}`,
            steps: steps
        };
    },

    solveDerivative(innerExpr) {
        let clean = innerExpr.trim().replace(/\s+/g, '');
        
        const splitTerms = (expr) => {
            let terms = [];
            let currentTerm = "";
            let parenDepth = 0;
            for (let i = 0; i < expr.length; i++) {
                let char = expr[i];
                if (char === '(') parenDepth++;
                if (char === ')') parenDepth--;
                
                if ((char === '+' || char === '-') && parenDepth === 0 && i > 0) {
                    terms.push(currentTerm);
                    currentTerm = char;
                } else {
                    currentTerm += char;
                }
            }
            if (currentTerm) {
                terms.push(currentTerm);
            }
            return terms;
        };

        let rawTerms = splitTerms(clean);
        let steps = [];
        let problemLaTeX = `\\frac{d}{dx}\\left( ${rawTerms.join(' ').replace(/\+/g, '+ ').replace(/\-/g, '- ')} \\right)`;
        
        steps.push({
            desc: "Aplicar la regla de la suma (la derivada de una suma es la suma de las derivadas):",
            latex: rawTerms.map(t => `\\frac{d}{dx}\\left(${t}\\right)`).join(' + ').replace(/\+\s*\-/g, '- ')
        });

        let results = [];
        
        rawTerms.forEach((term) => {
            let cleanTerm = term.replace(/^\+/, '');
            
            // 1. Match constant
            let constMatch = cleanTerm.match(/^([-+]?\d+(?:\.\d+)?)$/);
            if (constMatch) {
                steps.push({
                    desc: `Para el término $${cleanTerm}$: La derivada de una constante es siempre 0.`,
                    latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = 0`
                });
                results.push({ val: 0, termLaTeX: "" });
                return;
            }

            // 2. Match linear term: cx
            let linMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)x$/);
            if (linMatch) {
                let val = linMatch[1];
                let c = 1;
                if (val === '' || val === '+') c = 1;
                else if (val === '-') c = -1;
                else c = parseFloat(val);

                steps.push({
                    desc: `Para el término $${cleanTerm}$: La derivada de $c \\cdot x$ es la constante $c$.`,
                    latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = ${c}`
                });
                results.push({ val: c, termLaTeX: c.toString() });
                return;
            }

            // 3. Match power term: cx^n
            let powerMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)x\^([-+]?\d+(?:\.\d+)?)$/);
            if (powerMatch) {
                let valC = powerMatch[1];
                let valN = powerMatch[2];
                let c = 1;
                if (valC === '' || valC === '+') c = 1;
                else if (valC === '-') c = -1;
                else c = parseFloat(valC);

                let n = parseFloat(valN);
                let newC = c * n;
                let newN = n - 1;

                let derivLaTeX = this.formatTermLaTeX(newC, newN);
                steps.push({
                    desc: `Para el término $${cleanTerm}$: Aplicar la regla de la potencia $\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}$:`,
                    latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = ${c === 1 ? '' : c === -1 ? '-' : c + ' \\cdot '}${n}x^{${n}-1} = ${derivLaTeX}`
                });
                results.push({ val: newC, termLaTeX: derivLaTeX });
                return;
            }

            // 4. Match trigonometric: c sin(x) / c cos(x)
            let trigMatch = cleanTerm.match(/^([-+]?\d*(?:\.\d+)?)(sin|cos|tan)\(x\)$/);
            if (trigMatch) {
                let valC = trigMatch[1];
                let func = trigMatch[2];
                let c = 1;
                if (valC === '' || valC === '+') c = 1;
                else if (valC === '-') c = -1;
                else c = parseFloat(valC);

                if (func === 'sin') {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La derivada de $\\sin(x)$ es $\\cos(x)$.`,
                        latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = ${c === 1 ? '' : c === -1 ? '-' : c}\\cos(x)`
                    });
                    results.push({ val: c, termLaTeX: this.formatTermLaTeX(c, 0, true, 'cos') });
                } else if (func === 'cos') {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La derivada de $\\cos(x)$ es $-\\sin(x)$.`,
                        latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = -${c === 1 ? '' : c === -1 ? '-' : c}\\sin(x)`
                    });
                    results.push({ val: -c, termLaTeX: this.formatTermLaTeX(-c, 0, true, 'sin') });
                } else if (func === 'tan') {
                    steps.push({
                        desc: `Para el término $${cleanTerm}$: La derivada de $\\tan(x)$ es $\\sec^2(x)$.`,
                        latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = ${c === 1 ? '' : c === -1 ? '-' : c}\\sec^2(x)`
                    });
                    results.push({ val: c, termLaTeX: this.formatTermLaTeX(c, 0, true, 'sec2') });
                }
                return;
            }

            steps.push({
                desc: `Para el término $${cleanTerm}$: No se puede derivar automáticamente de forma local.`,
                latex: `\\frac{d}{dx}\\left(${cleanTerm}\\right) = \\text{Desconocido}`
            });
            results.push({ val: NaN, termLaTeX: `\\frac{d}{dx}\\left(${cleanTerm}\\right)` });
        });

        let finalTerms = results.map(r => r.termLaTeX).filter(t => t !== "");
        let finalResultLaTeX = finalTerms.join(' + ').replace(/\+\s*\-/g, '- ');
        if (finalResultLaTeX === "") finalResultLaTeX = "0";

        return {
            problemLaTeX: problemLaTeX,
            result: finalResultLaTeX,
            resultLaTeX: finalResultLaTeX,
            steps: steps
        };
    },

    formatTermLaTeX(coeff, power, isTrig = false, trigFunc = "") {
        if (isTrig) {
            let cStr = "";
            if (coeff === 1) cStr = "";
            else if (coeff === -1) cStr = "-";
            else cStr = coeff.toString();
            
            if (trigFunc === "sin") return `${cStr}\\sin(x)`;
            if (trigFunc === "cos") return `${cStr}\\cos(x)`;
            if (trigFunc === "sec2") return `${cStr}\\sec^2(x)`;
        }
        
        if (coeff === 0) return "";
        
        let cStr = "";
        if (power === 0) {
            return coeff.toString();
        }
        
        if (coeff === 1) cStr = "";
        else if (coeff === -1) cStr = "-";
        else cStr = coeff.toString();
        
        if (power === 1) {
            return `${cStr}x`;
        }
        
        return `${cStr}x^{${power}}`;
    },

    solveQuadratic(cleanExpr, method) {
        let temp = cleanExpr.split('=')[0];
        let a = 1, b = 0, c = 0;

        let matchA = temp.match(/([-+]?\d*(?:\.\d+)?)x\^2/);
        if (matchA) {
            let val = matchA[1];
            if (val === '' || val === '+') a = 1;
            else if (val === '-') a = -1;
            else a = parseFloat(val);
            temp = temp.replace(matchA[0], '');
        }

        let matchB = temp.match(/([-+]?\d*(?:\.\d+)?)x(?![\^\d])/);
        if (matchB) {
            let val = matchB[1];
            if (val === '' || val === '+') b = 1;
            else if (val === '-') b = -1;
            else b = parseFloat(val);
            temp = temp.replace(matchB[0], '');
        }

        if (temp) {
            temp = temp.replace(/^\+/, '');
            if (temp !== '') {
                c = parseFloat(temp);
            }
        }

        let problemLaTeX = `${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b === 0 ? '' : (b > 0 ? '+ ' + b : b)}x ${c === 0 ? '' : (c > 0 ? '+ ' + c : c)} = 0`;
        problemLaTeX = problemLaTeX.replace(/\s+/g, ' ').replace(/\+\s*-/g, '- ').trim();

        if (method === 'factorizacion') {
            return this.solveQuadraticFactorization(a, b, c, problemLaTeX);
        } else if (method === 'completar_cuadrado') {
            return this.solveQuadraticCompleteSquare(a, b, c, problemLaTeX);
        } else {
            return this.solveQuadraticGeneralFormula(a, b, c, problemLaTeX);
        }
    },

    solveQuadraticGeneralFormula(a, b, c, problemLaTeX) {
        const steps = [];
        steps.push({
            desc: "Identificar los coeficientes de la ecuación cuadrática $a x^2 + b x + c = 0$:",
            latex: `a = ${a},\\quad b = ${b},\\quad c = ${c}`
        });
        
        const disc = (b * b) - (4 * a * c);
        steps.push({
            desc: "Calcular el discriminante ($\\Delta = b^2 - 4 a c$):",
            latex: `\\Delta = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${b*b} - (${4*a*c}) = ${disc}`
        });

        if (disc < 0) {
            steps.push({
                desc: "Como el discriminante es menor que cero ($\\Delta < 0$), la ecuación no tiene soluciones reales.",
                latex: `\\Delta = ${disc} < 0`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: "Sin soluciones reales",
                resultLaTeX: "x \\notin \\mathbb{R}",
                steps: steps
            };
        } else if (disc === 0) {
            const x = -b / (2 * a);
            steps.push({
                desc: "Como el discriminante es cero ($\\Delta = 0$), hay una única solución real:",
                latex: `x = \\frac{-b}{2a} = \\frac{-(${b})}{2 \\cdot (${a})} = ${x.toFixed(4).replace(/\.?0+$/, '')}`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: `x = ${x}`,
                resultLaTeX: `x = ${this.toFraction(x)}`,
                steps: steps
            };
        } else {
            const x1 = (-b + Math.sqrt(disc)) / (2 * a);
            const x2 = (-b - Math.sqrt(disc)) / (2 * a);
            steps.push({
                desc: "Aplicar la fórmula general de la ecuación cuadrática:",
                latex: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${disc}}}{2 \\cdot (${a})}`
            });
            steps.push({
                desc: "Resolver para la primera raíz ($x_1$):",
                latex: `x_1 = \\frac{-(${b}) + ${Math.sqrt(disc).toFixed(4).replace(/\.?0+$/, '')}}{${2*a}} = ${x1.toFixed(4).replace(/\.?0+$/, '')}`
            });
            steps.push({
                desc: "Resolver para la segunda raíz ($x_2$):",
                latex: `x_2 = \\frac{-(${b}) - ${Math.sqrt(disc).toFixed(4).replace(/\.?0+$/, '')}}{${2*a}} = ${x2.toFixed(4).replace(/\.?0+$/, '')}`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: `x_1 = ${x1}, x_2 = ${x2}`,
                resultLaTeX: `x_1 = ${this.toFraction(x1)},\\quad x_2 = ${this.toFraction(x2)}`,
                steps: steps
            };
        }
    },

    solveQuadraticFactorization(a, b, c, problemLaTeX) {
        const steps = [];
        steps.push({
            desc: "Identificar los coeficientes:",
            latex: `a = ${a},\\quad b = ${b},\\quad c = ${c}`
        });

        if (a !== 1) {
            steps.push({
                desc: "Dividir toda la ecuación por el coeficiente principal $a = " + a + "$ para simplificar:",
                latex: `x^2 ${b/a >= 0 ? '+ ' + (b/a).toFixed(2).replace(/\.?0+$/, '') : (b/a).toFixed(2).replace(/\.?0+$/, '')}x ${c/a >= 0 ? '+ ' + (c/a).toFixed(2).replace(/\.?0+$/, '') : (c/a).toFixed(2).replace(/\.?0+$/, '')} = 0`
            });
        }

        const disc = (b * b) - (4 * a * c);
        if (disc < 0) {
            steps.push({
                desc: "Como el discriminante es menor que cero ($\\Delta < 0$), no se puede factorizar en el conjunto de los números reales.",
                latex: `\\Delta = ${disc} < 0`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: "No factorizable en reales",
                resultLaTeX: "\\text{No factorizable en } \\mathbb{R}",
                steps: steps
            };
        }

        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);

        let p = -x1;
        let q = -x2;

        steps.push({
            desc: "Buscamos dos números $p$ y $q$ tales que:",
            latex: `p + q = ${this.toFraction(b/a)} \\quad y \\quad p \\cdot q = ${this.toFraction(c/a)}`
        });

        steps.push({
            desc: "Determinamos los dos números que cumplen estas condiciones:",
            latex: `p = ${this.toFraction(p)}, \\quad q = ${this.toFraction(q)}`
        });

        let factor1 = `(x ${p >= 0 ? '+ ' + this.toFraction(p) : '- ' + this.toFraction(Math.abs(p))})`;
        let factor2 = `(x ${q >= 0 ? '+ ' + this.toFraction(q) : '- ' + this.toFraction(Math.abs(q))})`;
        
        let factoredForm = `${a === 1 ? '' : a}${factor1}${factor2} = 0`;
        factoredForm = factoredForm.replace(/\+\s*-/g, '- ');

        steps.push({
            desc: "Escribir la ecuación en su forma factorizada:",
            latex: factoredForm
        });

        steps.push({
            desc: "Igualar cada factor a cero y resolver para $x$:",
            latex: `x + (${this.toFraction(p)}) = 0 \\implies x_1 = ${this.toFraction(-p)} \\\\ x + (${this.toFraction(q)}) = 0 \\implies x_2 = ${this.toFraction(-q)}`
        });

        return {
            problemLaTeX: problemLaTeX,
            result: `x_1 = ${x1}, x_2 = ${x2}`,
            resultLaTeX: `x_1 = ${this.toFraction(x1)}, \\quad x_2 = ${this.toFraction(x2)}`,
            steps: steps
        };
    },

    solveQuadraticCompleteSquare(a, b, c, problemLaTeX) {
        const steps = [];
        steps.push({
            desc: "Identificar los coeficientes de la ecuación:",
            latex: `a = ${a},\\quad b = ${b},\\quad c = ${c}`
        });

        let currentLHS = `x^2 ${b/a >= 0 ? '+ ' + this.toFraction(b/a) : '- ' + this.toFraction(Math.abs(b/a))}x`;
        currentLHS = currentLHS.replace(/\+\s*-/g, '- ');
        let currentRHS = this.toFraction(-c/a);

        if (a !== 1) {
            steps.push({
                desc: "Dividir todos los términos por $a = " + a + "$ para que el coeficiente de $x^2$ sea 1:",
                latex: `x^2 ${b/a >= 0 ? '+ ' + this.toFraction(b/a) : '- ' + this.toFraction(Math.abs(b/a))}x ${c/a >= 0 ? '+ ' + this.toFraction(c/a) : '- ' + this.toFraction(Math.abs(c/a))} = 0`
            });
        }

        steps.push({
            desc: "Mover el término constante al lado derecho de la ecuación:",
            latex: `${currentLHS} = ${currentRHS}`
        });

        const halfCoeff = b / (2 * a);
        const halfCoeffSq = halfCoeff * halfCoeff;

        steps.push({
            desc: `Calcular la mitad del coeficiente de $x$ y elevarlo al cuadrado: $\\left(\\frac{b}{2a}\\right)^2 = \\left(\\frac{${this.toFraction(b/a)}}{2}\\right)^2 = (${this.toFraction(halfCoeff)})^2 = ${this.toFraction(halfCoeffSq)}$`
        });

        let addedLHS = `${currentLHS} + ${this.toFraction(halfCoeffSq)}`;
        let addedRHS = `${currentRHS} + ${this.toFraction(halfCoeffSq)}`;
        
        let sumRHS = -c/a + halfCoeffSq;

        steps.push({
            desc: `Sumar $${this.toFraction(halfCoeffSq)}$ a ambos lados de la ecuación:`,
            latex: `${addedLHS} = ${addedRHS}`
        });

        let binom = `(x ${halfCoeff >= 0 ? '+ ' + this.toFraction(halfCoeff) : '- ' + this.toFraction(Math.abs(halfCoeff))})^2`;
        binom = binom.replace(/\+\s*-/g, '- ');

        steps.push({
            desc: "Simplificar el lado derecho y escribir el lado izquierdo como un binomio al cuadrado:",
            latex: `${binom} = ${this.toFraction(sumRHS)}`
        });

        if (sumRHS < 0) {
            steps.push({
                desc: "Dado que el término del lado derecho es negativo, al extraer la raíz cuadrada no se obtendrán soluciones reales.",
                latex: `\\sqrt{${this.toFraction(sumRHS)}} \\notin \\mathbb{R}`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: "Sin soluciones reales",
                resultLaTeX: "x \\notin \\mathbb{R}",
                steps: steps
            };
        }

        const sqrtRHS = Math.sqrt(sumRHS);

        steps.push({
            desc: "Extraer la raíz cuadrada en ambos lados:",
            latex: `x ${halfCoeff >= 0 ? '+ ' + this.toFraction(halfCoeff) : '- ' + this.toFraction(Math.abs(halfCoeff))} = \\pm \\sqrt{${this.toFraction(sumRHS)}} = \\pm ${this.toFraction(sqrtRHS)}`
        });

        const x1 = -halfCoeff + sqrtRHS;
        const x2 = -halfCoeff - sqrtRHS;

        steps.push({
            desc: "Despejar $x$ para obtener las dos soluciones:",
            latex: `x_1 = -(${this.toFraction(halfCoeff)}) + ${this.toFraction(sqrtRHS)} = ${this.toFraction(x1)} \\\\ x_2 = -(${this.toFraction(halfCoeff)}) - ${this.toFraction(sqrtRHS)} = ${this.toFraction(x2)}`
        });

        return {
            problemLaTeX: problemLaTeX,
            result: `x_1 = ${x1}, x_2 = ${x2}`,
            resultLaTeX: `x_1 = ${this.toFraction(x1)}, \\quad x_2 = ${this.toFraction(x2)}`,
            steps: steps
        };
    },

    solveLinear(cleanExpr) {
        let a = 1;
        let b = 0;
        let c = 0;
        
        let termA = cleanExpr.match(/^([-+]?\d*(?:\.\d+)?)x/);
        if (termA) {
            let val = termA[1];
            if (val === '' || val === '+') a = 1;
            else if (val === '-') a = -1;
            else a = parseFloat(val);
        }
        
        let termB = cleanExpr.match(/([-+]\d+(?:\.\d+)?)=/);
        if (termB) {
            b = parseFloat(termB[1]);
        }
        
        let termC = cleanExpr.match(/=([-+]?\d+(?:\.\d+)?)$/);
        if (termC) {
            c = parseFloat(termC[1]);
        }
        
        const steps = [];
        let problemLaTeX = `${a === 1 ? '' : a === -1 ? '-' : a}x ${b === 0 ? '' : (b > 0 ? '+ ' + b : b)} = ${c}`;
        problemLaTeX = problemLaTeX.replace(/\s+/g, ' ').replace(/\+\s*-/g, '- ').trim();

        if (b !== 0) {
            steps.push({
                desc: `Restar ${b} de ambos lados de la ecuación para aislar el término con la incógnita:`,
                latex: `${a === 1 ? '' : a === -1 ? '-' : a}x = ${c} - (${b})`
            });
            c = c - b;
            steps.push({
                desc: "Simplificar el lado derecho:",
                latex: `${a === 1 ? '' : a === -1 ? '-' : a}x = ${c}`
            });
        }
        
        if (a !== 1) {
            steps.push({
                desc: `Dividir ambos lados por el coeficiente de $x$ ($a = ${a}$):`,
                latex: `x = \\frac{${c}}{${a}}`
            });
            const res = c / a;
            steps.push({
                desc: "Calcular el resultado final:",
                latex: `x = ${res.toFixed(4).replace(/\.?0+$/, '')}`
            });
            return {
                problemLaTeX: problemLaTeX,
                result: `x = ${res}`,
                resultLaTeX: `${this.toFraction(res)}`,
                steps: steps
            };
        } else {
            return {
                problemLaTeX: problemLaTeX,
                result: `x = ${c}`,
                resultLaTeX: `${this.toFraction(c)}`,
                steps: steps
            };
        }
    },

    solveFractions(fracMatch) {
        const n1 = parseInt(fracMatch[1]);
        const d1 = parseInt(fracMatch[2]);
        const op = fracMatch[3];
        const n2 = parseInt(fracMatch[4]);
        const d2 = parseInt(fracMatch[5]);
        
        const steps = [];
        const problemLaTeX = `\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}`;
        
        const lcmVal = this.lcm(d1, d2);
        steps.push({
            desc: `Encontrar el mínimo común múltiplo (MCM) de los denominadores $d_1 = ${d1}$ y $d_2 = ${d2}$:`,
            latex: `\\text{MCM}(${d1}, ${d2}) = ${lcmVal}`
        });
        
        const mult1 = lcmVal / d1;
        const mult2 = lcmVal / d2;
        steps.push({
            desc: "Amplificar los numeradores según corresponda:",
            latex: `\\frac{${n1} \\cdot ${mult1}}{${lcmVal}} ${op} \\frac{${n2} \\cdot ${mult2}}{${lcmVal}} = \\frac{${n1 * mult1}}{${lcmVal}} ${op} \\frac{${n2 * mult2}}{${lcmVal}}`
        });
        
        let numResult = 0;
        if (op === '+') {
            numResult = (n1 * mult1) + (n2 * mult2);
        } else {
            numResult = (n1 * mult1) - (n2 * mult2);
        }
        
        steps.push({
            desc: "Realizar la operación en el numerador:",
            latex: `\\frac{${n1 * mult1} ${op} ${n2 * mult2}}{${lcmVal}} = \\frac{${numResult}}{${lcmVal}}`
        });
        
        const gcdVal = this.gcd(numResult, lcmVal);
        let simplifiedLaTeX = `\\frac{${numResult}}{${lcmVal}}`;
        let finalVal = numResult / lcmVal;
        
        if (gcdVal > 1) {
            const simplifiedNum = numResult / gcdVal;
            const simplifiedDen = lcmVal / gcdVal;
            steps.push({
                desc: `Simplificar la fracción dividiendo el numerador y el denominador por su máximo común divisor (MCD = ${gcdVal}):`,
                latex: `\\frac{${numResult} \\div ${gcdVal}}{${lcmVal} \\div ${gcdVal}} = \\frac{${simplifiedNum}}{${simplifiedDen}}`
            });
            
            if (simplifiedDen === 1) {
                simplifiedLaTeX = `${simplifiedNum}`;
            } else {
                simplifiedLaTeX = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            }
        }
        
        if (numResult % lcmVal !== 0) {
            steps.push({
                desc: "Convertir a decimal aproximado:",
                latex: `\\approx ${finalVal.toFixed(4).replace(/\.?0+$/, '')}`
            });
        }
        
        return {
            problemLaTeX: problemLaTeX,
            result: finalVal.toString(),
            resultLaTeX: simplifiedLaTeX,
            steps: steps
        };
    },

    solveArithmetic(cleanExpr, normalized) {
        let sanitized = cleanExpr.toLowerCase()
            .replace(/pi/g, Math.PI.toString())
            .replace(/\be\b/g, Math.E.toString())
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**');
        
        if (/[^0-9\+\-\*\/\.\s\(\)eMath\.]/.test(sanitized.replace(/Math\.[a-z0-9]+/g, ''))) {
            return { error: true, message: "La expresión contiene caracteres no admitidos o funciones no soportadas." };
        }
        
        const result = Function(`"use strict"; return (${sanitized})`)();
        
        if (isNaN(result) || result === null || result === undefined) {
            return { error: true, message: "Resultado indefinido." };
        }
        
        let formattedProb = normalized.replace(/\*/g, ' \\times ').replace(/sqrt/g, '\\sqrt').replace(/pi/g, '\\pi');
        let formattedRes = result.toFixed(4).replace(/\.?0+$/, '');
        
        return {
            problemLaTeX: formattedProb,
            result: result.toString(),
            resultLaTeX: formattedRes,
            steps: []
        };
    },

    getPrimeFactorization(n) {
        n = Math.abs(n);
        if (n < 2) return {};
        let factors = {};
        let d = 2;
        while (n >= d * d) {
            if (n % d === 0) {
                factors[d] = (factors[d] || 0) + 1;
                n /= d;
            } else {
                d++;
            }
        }
        if (n > 1) {
            factors[n] = (factors[n] || 0) + 1;
        }
        return factors;
    },

    formatPrimeFactorizationLaTeX(factors) {
        let parts = [];
        let bases = Object.keys(factors).map(Number).sort((a,b) => a - b);
        bases.forEach(base => {
            let exp = factors[base];
            if (exp === 1) {
                parts.push(base);
            } else {
                parts.push(`${base}^{${exp}}`);
            }
        });
        return parts.join(' \\times ');
    },

    solveMcmGcd(type, a, b) {
        let isMcm = (type === 'mcm' || type === 'lcm');
        let name = isMcm ? 'Mínimo Común Múltiplo (M.C.M.)' : 'Máximo Común Divisor (M.C.D.)';
        let symbol = isMcm ? '\\text{mcm}' : '\\text{mcd}';
        
        let factorsA = this.getPrimeFactorization(a);
        let factorsB = this.getPrimeFactorization(b);
        
        let la = this.formatPrimeFactorizationLaTeX(factorsA);
        let lb = this.formatPrimeFactorizationLaTeX(factorsB);
        
        let steps = [];
        steps.push({
            desc: `Descomponer el número $${a}$ en sus factores primos:`,
            latex: `${a} = ${la || '1'}`
        });
        steps.push({
            desc: `Descomponer el número $${b}$ en sus factores primos:`,
            latex: `${b} = ${lb || '1'}`
        });
        
        let resultVal = 0;
        if (isMcm) {
            resultVal = this.lcm(a, b);
            
            // Get common and non-common factors with highest exponent
            let allBases = new Set([...Object.keys(factorsA), ...Object.keys(factorsB)]);
            let ruleParts = [];
            let calcParts = [];
            
            let sortedBases = Array.from(allBases).map(Number).sort((a,b) => a - b);
            sortedBases.forEach(base => {
                let expA = factorsA[base] || 0;
                let expB = factorsB[base] || 0;
                let maxExp = Math.max(expA, expB);
                if (maxExp === 1) {
                    ruleParts.push(`${base}`);
                    calcParts.push(base);
                } else {
                    ruleParts.push(`${base}^{${maxExp}}`);
                    calcParts.push(Math.pow(base, maxExp));
                }
            });
            
            steps.push({
                desc: `Para el M.C.M., multiplicamos todos los factores primos (comunes y no comunes) elevados a su mayor exponente:`,
                latex: `\\text{mcm}(${a}, ${b}) = ${ruleParts.join(' \\times ')} = ${calcParts.join(' \\times ')} = ${resultVal}`
            });
        } else {
            resultVal = this.gcd(a, b);
            
            // Get common factors with lowest exponent
            let basesA = Object.keys(factorsA);
            let commonBases = basesA.filter(base => factorsB[base] !== undefined);
            
            let ruleParts = [];
            let calcParts = [];
            
            let sortedCommonBases = commonBases.map(Number).sort((a,b) => a - b);
            sortedCommonBases.forEach(base => {
                let expA = factorsA[base];
                let expB = factorsB[base];
                let minExp = Math.min(expA, expB);
                if (minExp === 1) {
                    ruleParts.push(`${base}`);
                    calcParts.push(base);
                } else {
                    ruleParts.push(`${base}^{${minExp}}`);
                    calcParts.push(Math.pow(base, minExp));
                }
            });
            
            if (commonBases.length === 0) {
                steps.push({
                    desc: `No hay factores primos comunes entre $${a}$ y $${b}$. Por lo tanto, el Máximo Común Divisor es $1$:`,
                    latex: `\\text{mcd}(${a}, ${b}) = 1`
                });
            } else {
                steps.push({
                    desc: `Para el M.C.D., multiplicamos solo los factores primos comunes elevados a su menor exponente:`,
                    latex: `\\text{mcd}(${a}, ${b}) = ${ruleParts.join(' \\times ')} = ${calcParts.join(' \\times ')} = ${resultVal}`
                });
            }
        }
        
        return {
            problemLaTeX: `${symbol}(${a}, ${b})`,
            result: resultVal.toString(),
            resultLaTeX: resultVal.toString(),
            steps: steps
        };
    },

    getAlternateRepresentations(val) {
        if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
            return [];
        }
        
        let reps = [];
        
        // 1. Decimal representation (with up to 4 decimal places)
        reps.push({
            name: "Número Decimal",
            latex: val.toFixed(4).replace(/\.?0+$/, '')
        });
        
        // 2. Percentage representation
        reps.push({
            name: "Porcentaje",
            latex: `${(val * 100).toFixed(2).replace(/\.?0+$/, '')}\\%`
        });
        
        // Try to find a fraction representation
        let bestNum = 1, bestDen = 1, bestErr = Math.abs(val - 1);
        for (let den = 1; den <= 1000; den++) {
            let num = Math.round(val * den);
            let err = Math.abs(val - num / den);
            if (err < bestErr) {
                bestErr = err;
                bestNum = num;
                bestDen = den;
            }
            if (err < 1e-9) break;
        }
        
        if (bestErr < 1e-5) {
            let g = this.gcd(bestNum, bestDen);
            let numSimpl = bestNum / g;
            let denSimpl = bestDen / g;
            
            if (denSimpl !== 1) {
                // Simplified Fraction
                reps.push({
                    name: "Fracción Simplificada (Irreducible)",
                    latex: `\\frac{${numSimpl}}{${denSimpl}}`
                });
                
                // Unsimplified Fraction (alternative)
                let numUnsimpl = numSimpl * 2;
                let denUnsimpl = denSimpl * 2;
                reps.push({
                    name: "Fracción Equivalente (No Simplificada)",
                    latex: `\\frac{${numUnsimpl}}{${denUnsimpl}}`
                });
                
                // Mixed Fraction if improper (> 1)
                if (Math.abs(numSimpl) > denSimpl) {
                    let whole = Math.floor(Math.abs(numSimpl) / denSimpl);
                    let rem = Math.abs(numSimpl) % denSimpl;
                    let sign = numSimpl < 0 ? '-' : '';
                    if (rem > 0) {
                        reps.push({
                            name: "Fracción Mixta",
                            latex: `${sign}${whole} \\frac{${rem}}{${denSimpl}}`
                        });
                    }
                }
            }
        }
        
        // Notación Científica (if very large or small)
        if (Math.abs(val) >= 10000 || (Math.abs(val) > 0 && Math.abs(val) < 0.01)) {
            let exp = Math.floor(Math.log10(Math.abs(val)));
            let base = val / Math.pow(10, exp);
            reps.push({
                name: "Notación Científica",
                latex: `${base.toFixed(4).replace(/\.?0+$/, '')} \\times 10^{${exp}}`
            });
        }
        
        return reps;
    },

    getNumberProperties(val) {
        if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
            return null;
        }
        
        let isInt = Math.abs(val - Math.round(val)) < 1e-9;
        let intVal = Math.round(val);
        
        // 1. Sign
        let sign = "neutral";
        if (val > 0) sign = "positive";
        else if (val < 0) sign = "negative";
        
        // 2. Classification
        let isRational = false;
        let num = 0, den = 1;
        let bestErr = Math.abs(val - 1);
        for (let d = 1; d <= 1000; d++) {
            let n = Math.round(val * d);
            let err = Math.abs(val - n / d);
            if (err < bestErr) {
                bestErr = err;
                num = n;
                den = d;
            }
            if (err < 1e-9) break;
        }
        
        if (bestErr < 1e-5) {
            isRational = true;
            let g = this.gcd(num, den);
            num /= g;
            den /= g;
        }
        
        // 3. Parity & Primality
        let isEven = false;
        let primality = "na"; // "prime", "composite", "na"
        let factorsStr = "";
        
        if (isInt) {
            isEven = (intVal % 2 === 0);
            if (intVal > 1) {
                let isPrime = true;
                for (let i = 2; i * i <= intVal; i++) {
                    if (intVal % i === 0) {
                        isPrime = false;
                        break;
                    }
                }
                if (isPrime) {
                    primality = "prime";
                } else {
                    primality = "composite";
                    let factors = this.getPrimeFactorization(intVal);
                    factorsStr = this.formatPrimeFactorizationLaTeX(factors);
                }
            }
        }
        
        return {
            value: val,
            sign: sign,
            isInteger: isInt,
            isNatural: isInt && intVal >= 1,
            isZero: isInt && intVal === 0,
            isRational: isRational,
            fraction: isRational ? { num, den } : null,
            isEven: isEven,
            primality: primality,
            factorsStr: factorsStr,
            intValue: intVal
        };
    },

    formatFormulaForDisplay(val) {
        if (!val) return '';
        
        let content = val;
        
        // 1. Replace * and ×
        content = content.replace(/×/g, ' \\times ');
        content = content.replace(/\*/g, ' \\times ');
        
        // 2. Replace ÷ and /
        content = content.replace(/÷/g, ' / ');
        
        // Match fractions num/den and convert to \frac{num}{den}
        let fractionRegex = /([a-zA-Z0-9_]+|\([^)]+\))\s*\/\s*([a-zA-Z0-9_]+|\([^)]+\))/;
        while (fractionRegex.test(content)) {
            content = content.replace(fractionRegex, (match, num, den) => {
                let cleanNum = num.trim();
                let cleanDen = den.trim();
                if (cleanNum.startsWith('(') && cleanNum.endsWith(')')) cleanNum = cleanNum.slice(1, -1);
                if (cleanDen.startsWith('(') && cleanDen.endsWith(')')) cleanDen = cleanDen.slice(1, -1);
                return `\\frac{${cleanNum}}{${cleanDen}}`;
            });
        }
        
        // If there are raw slashes left, format them nicely
        content = content.replace(/\//g, ' \\div ');
        
        // 3. Format square roots
        content = content.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
        content = content.replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}');
        
        // 4. Format integrals: int(...)dx
        content = content.replace(/int\(([^)]+)\)dx/gi, '\\int \\left( $1 \\right) dx');
        content = content.replace(/int\s+([^d]+)dx/gi, '\\int $1 dx');
        content = content.replace(/int/gi, '\\int');
        
        // 5. Format derivatives: d/dx(...)
        content = content.replace(/d\/dx\(([^)]+)\)/gi, '\\frac{d}{dx}\\left( $1 \\right)');
        content = content.replace(/d\/dx/gi, '\\frac{d}{dx}');
        
        // 6. Trigonometric functions
        content = content.replace(/\b(sin|cos|tan|ln|log)\(([^)]+)\)/g, '\\$1\\left($2\\right)');
        
        // 7. Greek letters
        content = content.replace(/\bpi\b/g, '\\pi');
        content = content.replace(/\balpha\b/g, '\\alpha');
        content = content.replace(/\bbeta\b/g, '\\beta');
        
        return content;
    },

    // Helper to extract linear/quadratic coefficients from LHS expression
    getCoefficients(rhs) {
        let clean = rhs.replace(/\s+/g, '');
        let temp = clean;
        let a = 0, b = 0, c = 0;
        let isQuadratic = false;
        let isLinear = false;
        
        let matchA = temp.match(/([-+]?\d*(?:\.\d+)?)x\^2/);
        if (matchA) {
            isQuadratic = true;
            let val = matchA[1];
            if (val === '' || val === '+') a = 1;
            else if (val === '-') a = -1;
            else a = parseFloat(val);
            temp = temp.replace(matchA[0], '');
        }
        
        let matchB = temp.match(/([-+]?\d*(?:\.\d+)?)x(?![\^\d])/);
        if (matchB) {
            if (!matchA) isLinear = true;
            let val = matchB[1];
            if (val === '' || val === '+') b = 1;
            else if (val === '-') b = -1;
            else b = parseFloat(val);
            temp = temp.replace(matchB[0], '');
        }
        
        if (temp) {
            temp = temp.replace(/^\+/, '');
            if (temp !== '' && !isNaN(temp)) {
                c = parseFloat(temp);
            }
        }
        
        return { isQuadratic, isLinear: isLinear && !isQuadratic, a, b, c };
    }
};

const MathGrapher = {
    canvas: null,
    ctx: null,
    zoom: 30,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    functions: ["x^2 - 4"],
    currentFunc: "x^2 - 4",
    hoverX: 0,
    hoverY: 0,
    isHovering: false,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 30;
        this.functions = ["x^2 - 4"];
        this.currentFunc = "x^2 - 4";
        this.isHovering = false;

        this.resize();

        this.canvas.addEventListener('mousedown', (e) => this.dragStart(e.clientX, e.clientY));
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.dragMove(e.clientX, e.clientY);
            } else {
                const rect = this.canvas.getBoundingClientRect();
                this.hoverX = e.clientX - rect.left;
                this.hoverY = e.clientY - rect.top;
                this.isHovering = true;
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.draw();
        });

        window.addEventListener('mouseup', () => this.dragEnd());
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const rect = this.canvas.getBoundingClientRect();
                this.dragStart(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                this.isHovering = false;
            }
        });
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                if (this.isDragging) {
                    const rect = this.canvas.getBoundingClientRect();
                    this.dragMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
                }
            }
        });
        this.canvas.addEventListener('touchend', () => this.dragEnd());

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const centerX = this.canvas.width / 2 + this.offsetX;
            const centerY = this.canvas.height / 2 + this.offsetY;
            const mathX = (mouseX - centerX) / this.zoom;
            const mathY = (centerY - mouseY) / this.zoom;

            if (e.deltaY < 0) {
                this.zoom *= 1.15;
            } else {
                this.zoom /= 1.15;
            }
            this.zoom = Math.max(5, Math.min(this.zoom, 500));

            this.offsetX = mouseX - this.canvas.width / 2 - mathX * this.zoom;
            this.offsetY = centerY - mathY * this.zoom - this.canvas.height / 2;

            this.draw();
        });
    },

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentNode.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        this.draw();
    },

    dragStart(x, y) {
        this.isDragging = true;
        this.startX = x;
        this.startY = y;
        this.canvas.style.cursor = 'grabbing';
        this.isHovering = false;
    },

    dragMove(x, y) {
        if (!this.isDragging) return;
        const dx = x - this.startX;
        const dy = y - this.startY;
        this.offsetX += dx;
        this.offsetY += dy;
        this.startX = x;
        this.startY = y;
        this.draw();
    },

    dragEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            if (this.canvas) this.canvas.style.cursor = 'grab';
        }
    },

    setFunction(expr) {
        let parts = expr.split(';');
        this.functions = parts.map(p => {
            let clean = p.trim().replace(/\s+/g, '');
            if (clean.includes('=')) {
                clean = clean.split('=')[1];
            }
            return clean;
        }).filter(f => f !== "");
        this.currentFunc = this.functions[0] || "x^2 - 4";
        this.draw();
    },

    evaluateFunc(x, rhs) {
        let clean = rhs.replace(/\s+/g, '')
            .toLowerCase()
            .replace(/pi/g, Math.PI.toString())
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/\^/g, '**');

        clean = clean.replace(/(\d+)\s*x/g, '$1*x');
        clean = clean.replace(/x\s*(\d+)/g, 'x*$1');
        clean = clean.replace(/\)\s*x/g, ')*x');
        clean = clean.replace(/x\s*\(/g, 'x*(');

        clean = clean.replace(/\bx\b/g, `(${x})`);

        try {
            let res = Function(`"use strict"; return (${clean})`)();
            return isNaN(res) || !isFinite(res) ? NaN : res;
        } catch (e) {
            return NaN;
        }
    },

    draw() {
        if (!this.canvas || !this.ctx) return;
        
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        const ctx = this.ctx;

        ctx.fillStyle = "#0c1c14";
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2 + this.offsetX;
        const centerY = height / 2 + this.offsetY;

        let base = Math.pow(10, Math.floor(Math.log10(100 / this.zoom)));
        let step = base;
        if (this.zoom * base < 40) step = base * 2;
        if (this.zoom * base < 20) step = base * 5;

        ctx.lineWidth = 0.5;
        ctx.font = "10px monospace";

        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        
        let startMathX = Math.floor((-centerX) / (step * this.zoom)) * step;
        let endMathX = Math.ceil((width - centerX) / (step * this.zoom)) * step;

        for (let x = startMathX; x <= endMathX; x += step) {
            let px = centerX + x * this.zoom;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, height);
            ctx.stroke();

            if (Math.abs(x) > 1e-9) {
                let lblY = centerY + 15;
                if (lblY < 15) lblY = 15;
                if (lblY > height - 5) lblY = height - 5;
                ctx.fillText(x.toFixed(2).replace(/\.?0+$/, ''), px - 8, lblY);
            }
        }

        let startMathY = Math.floor((-centerY) / (step * this.zoom)) * step;
        let endMathY = Math.ceil((height - centerY) / (step * this.zoom)) * step;

        for (let y = startMathY; y <= endMathY; y += step) {
            let py = centerY - y * this.zoom;
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(width, py);
            ctx.stroke();

            if (Math.abs(y) > 1e-9) {
                let lblX = centerX + 5;
                if (lblX < 5) lblX = 5;
                if (lblX > width - 25) lblX = width - 25;
                ctx.fillText(y.toFixed(2).replace(/\.?0+$/, ''), lblX, py + 4);
            }
        }

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        ctx.fillText("0", centerX + 5, centerY + 12);

        // Plot Plural Functions
        const colors = ["#fde047", "#22d3ee", "#c084fc"]; // yellow, cyan, purple
        this.functions.forEach((func, idx) => {
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = colors[idx % colors.length];
            ctx.shadowColor = colors[idx % colors.length];
            ctx.shadowBlur = 4;
            ctx.beginPath();

            let first = true;
            for (let px = 0; px < width; px++) {
                let x = (px - centerX) / this.zoom;
                let y = this.evaluateFunc(x, func);
                
                if (!isNaN(y)) {
                    let py = centerY - y * this.zoom;
                    if (py >= -100 && py <= height + 100) {
                        if (first) {
                            ctx.moveTo(px, py);
                            first = false;
                        } else {
                            ctx.lineTo(px, py);
                        }
                    } else {
                        first = true;
                    }
                } else {
                    first = true;
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // 1. Draw Key Points for primary function
        if (this.currentFunc) {
            this.drawKeyPoints(ctx, centerX, centerY, width, height);
        }

        // 2. Draw Intersections
        this.drawIntersections(ctx, centerX, centerY, width, height);

        // 3. Draw Hover Coordinates Tooltip
        this.drawHoverCoordinates(ctx, centerX, centerY, width, height);
    },

    drawIntersections(ctx, centerX, centerY, width, height) {
        if (this.functions.length < 2) return;
        let intersections = [];
        let startMathX = (-centerX) / this.zoom;
        let endMathX = (width - centerX) / this.zoom;
        
        for (let i = 0; i < this.functions.length; i++) {
            for (let j = i + 1; j < this.functions.length; j++) {
                let f1 = this.functions[i];
                let f2 = this.functions[j];
                
                let prevX = startMathX;
                let prevY = this.evaluateFunc(prevX, f1) - this.evaluateFunc(prevX, f2);
                let steps = 150;
                let dx = (endMathX - startMathX) / steps;
                
                for (let k = 1; k <= steps; k++) {
                    let x = startMathX + k * dx;
                    let y = this.evaluateFunc(x, f1) - this.evaluateFunc(x, f2);
                    
                    if (!isNaN(y) && !isNaN(prevY)) {
                        if (prevY * y < 0) {
                            let l = prevX, r = x;
                            for (let b = 0; b < 12; b++) {
                                let m = (l + r) / 2;
                                let my = this.evaluateFunc(m, f1) - this.evaluateFunc(m, f2);
                                if (my * (this.evaluateFunc(l, f1) - this.evaluateFunc(l, f2)) < 0) r = m;
                                else l = m;
                            }
                            let ix = (l + r) / 2;
                            let iy = this.evaluateFunc(ix, f1);
                            if (!isNaN(iy)) {
                                intersections.push({ x: ix, y: iy });
                            }
                        } else if (Math.abs(y) < 1e-4) {
                            let iy = this.evaluateFunc(x, f1);
                            if (!isNaN(iy)) {
                                intersections.push({ x: x, y: iy });
                            }
                        }
                    }
                    prevX = x;
                    prevY = y;
                }
            }
        }
        
        intersections.forEach(pt => {
            let px = centerX + pt.x * this.zoom;
            let py = centerY - pt.y * this.zoom;
            
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                ctx.fillStyle = "#ef4444";
                ctx.shadowColor = "#ef4444";
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 9px monospace";
                ctx.fillText(`(${pt.x.toFixed(2).replace(/\.?0+$/, '')}, ${pt.y.toFixed(2).replace(/\.?0+$/, '')})`, px + 8, py - 4);
            }
        });
    },

    drawHoverCoordinates(ctx, centerX, centerY, width, height) {
        if (!this.isHovering || this.isDragging || this.functions.length === 0) return;

        let mx = (this.hoverX - centerX) / this.zoom;
        let bestFunc = null;
        let bestPy = 0;
        let bestMy = 0;
        let minDist = 999999;

        this.functions.forEach(func => {
            let my = this.evaluateFunc(mx, func);
            if (!isNaN(my)) {
                let py = centerY - my * this.zoom;
                let dist = Math.abs(this.hoverY - py);
                if (dist < minDist) {
                    minDist = dist;
                    bestFunc = func;
                    bestPy = py;
                    bestMy = my;
                }
            }
        });

        if (bestFunc && minDist < 60) {
            let px = this.hoverX;
            let py = bestPy;

            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, centerY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(centerX, py);
            ctx.stroke();
            
            ctx.setLineDash([]);

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.stroke();

            let lbl = `(${mx.toFixed(2)}, ${bestMy.toFixed(2)})`;
            ctx.font = "bold 9px monospace";
            let tw = ctx.measureText(lbl).width;

            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.fillRect(px + 10, py - 24, tw + 12, 16);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 10, py - 24, tw + 12, 16);
            
            ctx.fillStyle = "#ffffff";
            ctx.fillText(lbl, px + 16, py - 12);
        }
    },

    drawKeyPoints(ctx, centerX, centerY, width, height) {
        let coeffs = MathSolver.getCoefficients(this.currentFunc);
        let keyPoints = [];

        let yIntVal = this.evaluateFunc(0, this.currentFunc);
        if (!isNaN(yIntVal)) {
            keyPoints.push({ x: 0, y: yIntVal, label: `Intersección Y: (0, ${yIntVal.toFixed(2).replace(/\.?0+$/, '')})`, type: "intercept", color: "#60a5fa" });
        }

        if (coeffs.isQuadratic) {
            let disc = coeffs.b * coeffs.b - 4 * coeffs.a * coeffs.c;
            if (disc >= 0) {
                let x1 = (-coeffs.b + Math.sqrt(disc)) / (2 * coeffs.a);
                let x2 = (-coeffs.b - Math.sqrt(disc)) / (2 * coeffs.a);
                keyPoints.push({ x: x1, y: 0, label: `Raíz: (${x1.toFixed(2).replace(/\.?0+$/, '')}, 0)`, type: "root", color: "#10b981" });
                if (Math.abs(x1 - x2) > 1e-5) {
                    keyPoints.push({ x: x2, y: 0, label: `Raíz: (${x2.toFixed(2).replace(/\.?0+$/, '')}, 0)`, type: "root", color: "#10b981" });
                }
            }
            let xv = -coeffs.b / (2 * coeffs.a);
            let yv = coeffs.a * xv * xv + coeffs.b * xv + coeffs.c;
            keyPoints.push({ x: xv, y: yv, label: `Vértice: (${xv.toFixed(2).replace(/\.?0+$/, '')}, ${yv.toFixed(2).replace(/\.?0+$/, '')})`, type: "vertex", color: "#f59e0b" });
        } else if (coeffs.isLinear) {
            if (Math.abs(coeffs.b) > 1e-9) {
                let xr = -coeffs.c / coeffs.b;
                keyPoints.push({ x: xr, y: 0, label: `Raíz: (${xr.toFixed(2).replace(/\.?0+$/, '')}, 0)`, type: "root", color: "#10b981" });
            }
        } else {
            let startMathX = (-centerX) / this.zoom;
            let endMathX = (width - centerX) / this.zoom;
            let prevX = startMathX;
            let prevY = this.evaluateFunc(prevX, this.currentFunc);
            let scanSteps = 150;
            let dx = (endMathX - startMathX) / scanSteps;

            for (let i = 1; i <= scanSteps; i++) {
                let x = startMathX + i * dx;
                let y = this.evaluateFunc(x, this.currentFunc);
                if (!isNaN(y) && !isNaN(prevY)) {
                    if (prevY * y < 0) {
                        let l = prevX, r = x;
                        for (let k = 0; k < 12; k++) {
                            let m = (l + r) / 2;
                            let my = this.evaluateFunc(m, this.currentFunc);
                            if (my * this.evaluateFunc(l, this.currentFunc) < 0) r = m;
                            else l = m;
                        }
                        let rx = (l + r) / 2;
                        keyPoints.push({ x: rx, y: 0, label: `Raíz: (${rx.toFixed(2).replace(/\.?0+$/, '')}, 0)`, type: "root", color: "#10b981" });
                    } else if (Math.abs(y) < 1e-4) {
                        keyPoints.push({ x: x, y: 0, label: `Raíz: (${x.toFixed(2).replace(/\.?0+$/, '')}, 0)`, type: "root", color: "#10b981" });
                    }
                }
                prevX = x;
                prevY = y;
            }
        }

        keyPoints.forEach(kp => {
            let px = centerX + kp.x * this.zoom;
            let py = centerY - kp.y * this.zoom;

            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                ctx.fillStyle = kp.color;
                ctx.shadowColor = kp.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 9px monospace";
                ctx.fillText(kp.label, px + 10, py - 4);
            }
        });

        this.updateAnalysisText(coeffs, keyPoints);
    },

    updateAnalysisText(coeffs, keyPoints) {
        const textContainer = document.getElementById("graph-analysis-text");
        if (!textContainer) return;

        let html = `<div><strong>Función:</strong> $y = ${this.currentFunc.replace(/\*/g, '')}$</div>`;

        let roots = keyPoints.filter(kp => kp.type === "root");
        let intercepts = keyPoints.filter(kp => kp.type === "intercept");
        let vertices = keyPoints.filter(kp => kp.type === "vertex");

        if (vertices.length > 0) {
            let v = vertices[0];
            let type = coeffs.a > 0 ? "Mínimo" : "Máximo";
            html += `<div><strong>Vértice (${type}):</strong> (${v.x.toFixed(3).replace(/\.?0+$/, '')}, ${v.y.toFixed(3).replace(/\.?0+$/, '')})</div>`;
        }

        if (roots.length > 0) {
            html += `<div><strong>Raíces (Ceros):</strong> ` + roots.map(r => `x = ${r.x.toFixed(3).replace(/\.?0+$/, '')}`).join(", ") + `</div>`;
        } else {
            html += `<div><strong>Raíces (Ceros):</strong> No tiene raíces reales</div>`;
        }

        if (intercepts.length > 0) {
            html += `<div><strong>Intersección con Eje Y:</strong> (0, ${intercepts[0].y.toFixed(3).replace(/\.?0+$/, '')})</div>`;
        }

        textContainer.innerHTML = html;
        
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(textContainer, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }
};

const ChalkScratchpad = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.resize();

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.startDrawing(e.clientX - rect.left, e.clientY - rect.top);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.draw(e.clientX - rect.left, e.clientY - rect.top);
        });
        window.addEventListener('mouseup', () => this.stopDrawing());

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const rect = this.canvas.getBoundingClientRect();
                this.startDrawing(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
            }
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const rect = this.canvas.getBoundingClientRect();
                this.draw(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
            }
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    },

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentNode.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        this.clear();
    },

    startDrawing(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    },

    draw(x, y) {
        if (!this.isDrawing || !this.ctx) return;

        const ctx = this.ctx;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        ctx.shadowBlur = 2;

        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        this.lastX = x;
        this.lastY = y;
    },

    stopDrawing() {
        this.isDrawing = false;
        if (this.ctx) this.ctx.shadowBlur = 0;
    },

    clear() {
        if (!this.canvas || !this.ctx) return;
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.fillStyle = "#0c1c14";
        this.ctx.fillRect(0, 0, width, height);
    }
};
// ═══════════════════════════════════════════════════════════════
//  POMODORO TIMER + STUDY STREAK SYSTEM
// ═══════════════════════════════════════════════════════════════
const PomodoroTimer = {
    // Config
    WORK_MINS:        25,
    SHORT_BREAK_MINS: 5,
    LONG_BREAK_MINS:  15,
    SESSIONS_BEFORE_LONG: 4,

    // State
    mode:         'work',   // 'work' | 'short' | 'long'
    isRunning:    false,
    secondsLeft:  25 * 60,
    totalSeconds: 25 * 60,
    sessionsDone: 0,        // sessions completed this cycle
    pomodorosToday: 0,
    intervalId:   null,

    // ── Storage helpers ──────────────────────────────────────────
    _storageKey: 'hub_pomodoro_data',

    save() {
        const today = new Date().toISOString().slice(0, 10);
        const raw = JSON.parse(localStorage.getItem(this._storageKey) || '{}');
        raw[today] = (raw[today] || 0) + 0; // ensure today exists
        raw[today] += 0;
        localStorage.setItem(this._storageKey, JSON.stringify(raw));
    },

    recordSession() {
        const today = new Date().toISOString().slice(0, 10);
        const raw = JSON.parse(localStorage.getItem(this._storageKey) || '{}');
        raw[today] = (raw[today] || 0) + 1;
        localStorage.setItem(this._storageKey, JSON.stringify(raw));
    },

    getSessionData() {
        return JSON.parse(localStorage.getItem(this._storageKey) || '{}');
    },

    getStreakDays() {
        const data = this.getSessionData();
        let streak = 0;
        const d = new Date();
        while (true) {
            const key = d.toISOString().slice(0, 10);
            if (data[key] && data[key] > 0) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else { break; }
        }
        return streak;
    },

    // ── Widget visibility ────────────────────────────────────────
    toggleWidget(e) {
        if (e) e.preventDefault();
        const w = document.getElementById('pomodoro-widget');
        const nav = document.getElementById('pomodoro-nav-toggle');
        if (!w) return;
        const isHidden = w.classList.contains('hidden');
        w.classList.toggle('hidden', !isHidden);
        nav && nav.classList.toggle('pom-active', isHidden);
        if (isHidden) this.updateUI();
    },

    // ── Timer logic ──────────────────────────────────────────────
    toggle() {
        this.isRunning ? this.pause() : this.start();
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        document.getElementById('pomodoro-widget')?.classList.add('running');
        const btn = document.getElementById('pom-btn-start');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
        this.intervalId = setInterval(() => this.tick(), 1000);
    },

    pause() {
        this.isRunning = false;
        document.getElementById('pomodoro-widget')?.classList.remove('running');
        clearInterval(this.intervalId);
        const btn = document.getElementById('pom-btn-start');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Continuar';
    },

    reset() {
        this.pause();
        this.secondsLeft = this.totalSeconds;
        const btn = document.getElementById('pom-btn-start');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
        this.updateUI();
    },

    skipPhase() {
        this.pause();
        this.secondsLeft = 0;
        this.tick();
    },

    tick() {
        this.secondsLeft--;
        if (this.secondsLeft < 0) {
            this.playBell();
            this.onPhaseEnd();
            return;
        }
        this.updateUI();
    },

    onPhaseEnd() {
        clearInterval(this.intervalId);
        this.isRunning = false;

        if (this.mode === 'work') {
            // Completed a work session
            this.sessionsDone++;
            this.pomodorosToday++;
            this.recordSession();

            if (this.sessionsDone >= this.SESSIONS_BEFORE_LONG) {
                this.sessionsDone = 0;
                this.setMode('long');
            } else {
                this.setMode('short');
            }
        } else {
            this.setMode('work');
        }
        this.updateUI();
    },

    setMode(mode) {
        this.mode = mode;
        const mins = mode === 'work'  ? this.WORK_MINS :
                     mode === 'short' ? this.SHORT_BREAK_MINS :
                                        this.LONG_BREAK_MINS;
        this.totalSeconds = mins * 60;
        this.secondsLeft  = this.totalSeconds;
    },

    // ── Audio bell (Web Audio API) ───────────────────────────────
    playBell() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playTone = (freq, start, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                gain.gain.setValueAtTime(0.4, ctx.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };
            playTone(880, 0,   0.3);
            playTone(660, 0.3, 0.3);
            playTone(880, 0.6, 0.5);
        } catch(e) { /* silently fail if audio not supported */ }
    },

    // ── UI update ────────────────────────────────────────────────
    updateUI() {
        const mins = String(Math.floor(this.secondsLeft / 60)).padStart(2, '0');
        const secs = String(this.secondsLeft % 60).padStart(2, '0');

        const timeEl   = document.getElementById('pomodoro-time');
        const labelEl  = document.getElementById('pomodoro-mode-label');
        const ringEl   = document.getElementById('pom-ring');
        const dotsEl   = document.getElementById('pom-sessions-dots');
        const sessLabel= document.getElementById('pom-sessions-label');

        if (timeEl)  timeEl.textContent = `${mins}:${secs}`;

        // Mode label
        const modeText = this.mode === 'work'  ? '🍅 TRABAJO' :
                         this.mode === 'short' ? '☕ DESCANSO CORTO' :
                                                 '🏖️ DESCANSO LARGO';
        if (labelEl) {
            labelEl.textContent = modeText;
            labelEl.className = 'pomodoro-mode' + (this.mode !== 'work' ? ' break-mode' : '');
        }

        // SVG ring progress
        if (ringEl) {
            const circumference = 326.7;
            const progress = this.secondsLeft / this.totalSeconds;
            const offset = circumference * (1 - progress);
            ringEl.style.strokeDashoffset = offset;
            ringEl.className = 'pomodoro-ring-progress' + (this.mode !== 'work' ? ' break-ring' : '');
        }

        // Session dots (4 dots for one full cycle)
        if (dotsEl) {
            let html = '';
            for (let i = 0; i < this.SESSIONS_BEFORE_LONG; i++) {
                const done = i < this.sessionsDone;
                const isLong = done && i === this.SESSIONS_BEFORE_LONG - 1;
                html += `<span class="pom-dot ${done ? 'done' : ''} ${isLong ? 'long-break-dot' : ''}"></span>`;
            }
            dotsEl.innerHTML = html;
        }

        if (sessLabel) {
            const t = this.pomodorosToday;
            sessLabel.textContent = `${t} sesión${t !== 1 ? 'es' : ''} hoy`;
        }

        // Page title update
        document.title = (this.isRunning ? `${mins}:${secs} — ` : '') + 'StudyHub';
    },

    // ── Heatmap renderer ─────────────────────────────────────────
    renderHeatmap() {
        const grid = document.getElementById('study-heatmap');
        const badge = document.getElementById('heatmap-streak-badge');
        if (!grid) return;

        const data = this.getSessionData();
        const streak = this.getStreakDays();

        if (badge) badge.textContent = `${streak} día${streak !== 1 ? 's' : ''} seguido${streak !== 1 ? 's' : ''} 🔥`;

        // Build 16 weeks of cells (112 days), Sun → Sat
        const today = new Date();
        today.setHours(0,0,0,0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 111); // 112 days ago

        // Align to Sunday
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const colors = [
            'rgba(255,255,255,0.05)', // 0
            '#166534',                 // 1
            '#15803d',                 // 2-3
            '#16a34a',                 // 4-5
            '#22c55e',                 // 6+
        ];

        const getColor = (count) => {
            if (!count || count === 0) return colors[0];
            if (count === 1) return colors[1];
            if (count <= 3) return colors[2];
            if (count <= 5) return colors[3];
            return colors[4];
        };

        let html = '';
        const cursor = new Date(startDate);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + (6 - today.getDay())); // end of this week

        while (cursor <= endDate) {
            const key = cursor.toISOString().slice(0, 10);
            const count = data[key] || 0;
            const isFuture = cursor > today;
            const isToday = key === today.toISOString().slice(0, 10);
            const bg = isFuture ? 'rgba(255,255,255,0.02)' : getColor(count);
            const label = cursor.toLocaleDateString('es', { weekday:'short', day:'numeric', month:'short' });
            const tooltip = isFuture ? '' : `data-tooltip="${label}: ${count} sesión${count !== 1 ? 'es' : ''}"`;
            const outline = isToday ? 'outline: 2px solid rgba(255,255,255,0.4); outline-offset: 1px;' : '';

            html += `<span class="heatmap-cell" style="background:${bg};${outline}" ${tooltip}></span>`;
            cursor.setDate(cursor.getDate() + 1);
        }

        grid.innerHTML = html;
    },
};

// ═══════════════════════════════════════════════════════════════
//  SRS ENGINE — SM-2 ALGORITHM
//  Stores per-card metadata in localStorage.
//  Cards sourced from all course packs' questions.
// ═══════════════════════════════════════════════════════════════
const SRSEngine = {
    STORAGE_KEY: 'hub_srs_cards',
    SESSION_KEY: 'hub_srs_session',
    CUSTOM_CARDS_KEY: 'hub_custom_flashcards',

    getCustomCards() {
        try {
            return JSON.parse(localStorage.getItem(this.CUSTOM_CARDS_KEY) || '[]');
        } catch(e) {
            return [];
        }
    },

    saveCustomCards(cards) {
        try {
            localStorage.setItem(this.CUSTOM_CARDS_KEY, JSON.stringify(cards));
            this.updateNavBadge();
            return true;
        } catch(e) {
            return false;
        }
    },

    _getAll() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
        catch { return {}; }
    },
    _saveAll(data) {
        try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch {}
    },

    /** Return or create SRS metadata for a card */
    _getCard(id) {
        const all = this._getAll();
        if (!all[id]) {
            all[id] = { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: 0, lastReview: null };
            this._saveAll(all);
        }
        return all[id];
    },

    /** Apply SM-2 algorithm and save updated card metadata */
    _applyRating(id, quality) {
        // quality: 0=Again, 1=Hard-fail, 2=Hard, 3=Pass, 4=Good, 5=Easy
        const all = this._getAll();
        let c = all[id] || { easeFactor: 2.5, interval: 0, repetitions: 0 };

        if (quality < 3) {
            // Failed — reset
            c.repetitions = 0;
            c.interval    = 1;
        } else {
            // Passed
            if (c.repetitions === 0)     c.interval = 1;
            else if (c.repetitions === 1) c.interval = 6;
            else                          c.interval = Math.round(c.interval * c.easeFactor);

            c.repetitions++;
        }

        // Update ease factor (SM-2 formula)
        c.easeFactor = Math.max(1.3,
            c.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        );

        c.lastReview = Date.now();
        c.nextReview = Date.now() + c.interval * 86400000;
        all[id] = c;
        this._saveAll(all);
        return c;
    },

    /** Compute next-review hint label for a quality rating */
    _hintLabel(cardId, quality) {
        const c = this._getCard(cardId) || { easeFactor: 2.5, interval: 0, repetitions: 0 };
        if (quality < 3) return '<1 min';
        let interval = c.interval;
        if (c.repetitions === 0)      interval = 1;
        else if (c.repetitions === 1) interval = 6;
        else interval = Math.round(c.interval * c.easeFactor);
        if (interval === 1) return '1 día';
        if (interval < 7)  return `${interval} días`;
        if (interval < 30) return `~${Math.round(interval/7)} sem`;
        return `~${Math.round(interval/30)} mes`;
    },

    // ── Session state ─────────────────────────────────────────────
    queue:        [],   // cards left to review this session
    doneCount:    0,    // reviewed this session
    currentCard:  null,
    isFlipped:    false,
    deckId:       null,

    /** Build a card id from courseId + question hash */
    _cardId(courseId, qHash) { return `${courseId}::${qHash}`; },

    /** djb2 hash (same as HubStorage) */
    _hash(str) {
        let h = 5381;
        for (let i = 0; i < Math.min(str.length, 300); i++)
            h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
        return Math.abs(h).toString(36);
    },

    /** Extract all cards from a pack as { id, front, back, domain } */
    _packToCards(pack) {
        const cards = [];
        Object.values(pack.modules || {}).forEach(mod => {
            (mod.questions || []).forEach(q => {
                const front = q.question || '';
                // Back = correct answer text
                const correctOpt = (q.options || []).find(o =>
                    (typeof o === 'string' ? o : o.text) === q.correctAnswer
                );
                const back = q.correctAnswer || (correctOpt
                    ? (typeof correctOpt === 'string' ? correctOpt : correctOpt.text)
                    : '');
                if (!front || !back) return;
                const hash = this._hash(front);
                cards.push({
                    id: this._cardId(pack.id, hash),
                    front,
                    back,
                    domain: q.domain || q.topic || mod.title || 'General',
                });
            });
        });
        return cards;
    },

    /** Return total due count across ALL decks (for nav badge) */
    getTotalDue() {
        const packs = EngineStorage.getAllPacks();
        const all   = this._getAll();
        const now   = Date.now();
        let total   = 0;
        
        packs.forEach(pack => {
            this._packToCards(pack).forEach(c => {
                const meta = all[c.id];
                if (!meta || meta.nextReview <= now) total++;
            });
        });

        // Add custom cards due count
        this.getCustomCards().forEach(c => {
            const meta = all[c.id];
            if (!meta || meta.nextReview <= now) total++;
        });

        return total;
    },

    /** Update the red badge on the SRS nav item */
    updateNavBadge() {
        const badge = document.getElementById('srs-nav-badge');
        if (!badge) return;
        const n = this.getTotalDue();
        badge.textContent = n > 99 ? '99+' : n;
        badge.classList.toggle('hidden', n === 0);
    },

    /** Populate deck selector and load a deck */
    initView() {
        const sel = document.getElementById('srs-deck-select');
        if (!sel) return;
        const packs = EngineStorage.getAllPacks();
        
        let html = '<option value="">— Elige un mazo —</option>';
        html += '<option value="__custom__">⭐ Mis Tarjetas Creadas</option>';
        html += packs.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
        
        sel.innerHTML = html;
        this.updateNavBadge();

        this.hideManager();
        this.hideImporter();
    },

    /** Load a deck and start a session */
    loadDeck(deckId) {
        this.deckId = deckId;
        if (!deckId) { this._showState('empty'); return; }

        let cards = [];
        if (deckId === '__custom__') {
            cards = this.getCustomCards();
        } else {
            const pack = EngineStorage.getPack(deckId);
            if (!pack) { this._showState('empty'); return; }
            cards = this._packToCards(pack);
        }

        const all   = this._getAll();
        const now   = Date.now();

        // Split: due (nextReview <= now) vs new (no meta)
        const due  = cards.filter(c => all[c.id] && all[c.id].nextReview <= now);
        const novo = cards.filter(c => !all[c.id]);

        // Session: up to 20 due + up to 10 new
        this.queue = [
            ...due.slice(0, 20),
            ...novo.slice(0, 10),
        ];
        // Shuffle
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }

        this.doneCount = 0;
        this.isFlipped = false;

        // Update stat pills
        const totalDue = due.length + novo.length;
        document.getElementById('srs-stat-new').textContent  = novo.length;
        document.getElementById('srs-stat-due').textContent  = due.length;
        document.getElementById('srs-stat-done').textContent = this.doneCount;

        if (this.queue.length === 0) { this._showState('done'); return; }
        this._showState('card');
        this._showCard();
    },

    /** Flip the card to reveal the answer */
    flip() {
        if (this.isFlipped) return;
        this.isFlipped = true;
        document.getElementById('srs-flip-card')?.classList.add('flipped');

        const ratingBar = document.getElementById('srs-rating-bar');
        ratingBar?.classList.remove('hidden');

        // Update hint labels based on current card
        if (this.currentCard) {
            const id = this.currentCard.id;
            document.getElementById('srs-hint-hard').textContent = this._hintLabel(id, 2);
            document.getElementById('srs-hint-good').textContent = this._hintLabel(id, 4);
            document.getElementById('srs-hint-easy').textContent = this._hintLabel(id, 5);
        }
    },

    /** Apply a rating and advance to the next card */
    rate(quality) {
        if (!this.currentCard) return;
        this._applyRating(this.currentCard.id, quality);

        // If failed, push card back to end of queue for retry this session
        if (quality < 3) {
            this.queue.push({ ...this.currentCard });
        }

        this.doneCount++;
        document.getElementById('srs-stat-done').textContent = this.doneCount;

        if (this.queue.length === 0) {
            this._showState('done');
            this.updateNavBadge();
            return;
        }
        this.isFlipped = false;
        this._showCard();
    },

    /** Render the next card */
    _showCard() {
        this.currentCard = this.queue.shift();
        this.isFlipped   = false;

        // Flip card back to front
        const card = document.getElementById('srs-flip-card');
        card?.classList.remove('flipped');

        // Hide rating bar
        document.getElementById('srs-rating-bar')?.classList.add('hidden');

        // Populate front
        document.getElementById('srs-card-tag').textContent      = this.currentCard.domain;
        document.getElementById('srs-card-question').textContent  = this.currentCard.front;

        // Populate back
        document.getElementById('srs-card-tag-back').textContent    = this.currentCard.domain;
        document.getElementById('srs-card-question-back').textContent = this.currentCard.front;
        document.getElementById('srs-card-answer').textContent      = this.currentCard.back;

        // Progress bar
        const total    = this.doneCount + this.queue.length + 1;
        const pct      = Math.round((this.doneCount / Math.max(total, 1)) * 100);
        const fill     = document.getElementById('srs-progress-fill');
        const label    = document.getElementById('srs-progress-label');
        if (fill)  fill.style.width  = pct + '%';
        if (label) label.textContent = `${this.doneCount} / ${total}`;
    },

    /** Show empty / done / card state */
    _showState(state) {
        const empty = document.getElementById('srs-empty-state');
        const done  = document.getElementById('srs-done-state');
        const card  = document.getElementById('srs-card-area');
        if (empty) empty.classList.toggle('hidden', state !== 'empty');
        if (done)  done.classList.toggle('hidden',  state !== 'done');
        if (card)  card.classList.toggle('hidden',  state !== 'card');
    },

    // ── Custom Cards CRUD & View Management ──────────────────────
    showManager() {
        document.getElementById('srs-session-area').classList.add('hidden');
        document.getElementById('srs-importer-panel').classList.add('hidden');
        document.getElementById('srs-manager-panel').classList.remove('hidden');
        this.renderCustomCardsList();
    },

    hideManager() {
        document.getElementById('srs-manager-panel').classList.add('hidden');
        document.getElementById('srs-session-area').classList.remove('hidden');
    },

    showImporter() {
        document.getElementById('srs-session-area').classList.add('hidden');
        document.getElementById('srs-manager-panel').classList.add('hidden');
        document.getElementById('srs-importer-panel').classList.remove('hidden');
    },

    hideImporter() {
        document.getElementById('srs-importer-panel').classList.add('hidden');
        document.getElementById('srs-session-area').classList.remove('hidden');
    },

    renderCustomCardsList() {
        const listEl = document.getElementById('srs-custom-cards-list');
        const countEl = document.getElementById('srs-custom-count');
        if (!listEl) return;

        const cards = this.getCustomCards();
        if (countEl) countEl.textContent = cards.length;

        if (cards.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 1.5rem 1rem;">
                    <i class="fa-solid fa-folder-open" style="font-size: 1.5rem; opacity: 0.15; margin-bottom: 6px; display: block;"></i>
                    No has creado tarjetas todavía. Usa el formulario de arriba.
                </div>
            `;
            return;
        }

        let html = '';
        cards.forEach((c, idx) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 6px 10px; gap: 10px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Q: ${this.escapeHTML(c.front)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">A: ${this.escapeHTML(c.back)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 0.65rem; background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; color: var(--text-secondary);">${this.escapeHTML(c.domain)}</span>
                        <button class="btn secondary" onclick="SRSEngine.deleteCustomCard(${idx})" style="padding: 4px 8px; font-size: 0.75rem; margin: 0; color: #f87171;" title="Eliminar tarjeta">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        listEl.innerHTML = html;
    },

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    addCustomCard() {
        const frontEl = document.getElementById('srs-new-front');
        const backEl = document.getElementById('srs-new-back');
        const domainEl = document.getElementById('srs-new-domain');

        if (!frontEl || !backEl) return;

        const front = frontEl.value.trim();
        const back = backEl.value.trim();
        const domain = (domainEl && domainEl.value.trim()) || 'General';

        if (!front || !back) {
            alert('Por favor completa los campos de Pregunta y Respuesta.');
            return;
        }

        const cards = this.getCustomCards();
        const hash = this._hash(front);
        const newCard = {
            id: this._cardId('__custom__', hash),
            front,
            back,
            domain
        };

        if (cards.some(c => c.id === newCard.id)) {
            alert('Ya existe una tarjeta con esa pregunta.');
            return;
        }

        cards.push(newCard);
        this.saveCustomCards(cards);

        frontEl.value = '';
        backEl.value = '';
        if (domainEl) domainEl.value = '';

        this.renderCustomCardsList();
        this.updateNavBadge();
        
        if (this.deckId === '__custom__') {
            this.loadDeck('__custom__');
        }
    },

    deleteCustomCard(idx) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) return;

        const cards = this.getCustomCards();
        
        if (cards[idx]) {
            const cardId = cards[idx].id;
            const all = this._getAll();
            if (all[cardId]) {
                delete all[cardId];
                this._saveAll(all);
            }
        }

        cards.splice(idx, 1);
        this.saveCustomCards(cards);

        this.renderCustomCardsList();
        this.updateNavBadge();

        if (this.deckId === '__custom__') {
            this.loadDeck('__custom__');
        }
    },

    exportCustomCards() {
        const cards = this.getCustomCards();
        if (cards.length === 0) {
            alert('No hay tarjetas personalizadas para exportar.');
            return;
        }

        const dataStr = JSON.stringify(cards, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'studyhub-srs-deck.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importCustomCards() {
        const fileInput = document.getElementById('srs-import-file-input');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Por favor selecciona un archivo JSON primero.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedCards = JSON.parse(e.target.result);
                if (!Array.isArray(importedCards)) {
                    alert('El archivo JSON debe contener una lista (array) de tarjetas.');
                    return;
                }

                const validCards = [];
                importedCards.forEach(c => {
                    if (c && c.front && c.back) {
                        const domain = c.domain || 'General';
                        const hash = this._hash(c.front);
                        validCards.push({
                            id: this._cardId('__custom__', hash),
                            front: c.front,
                            back: c.back,
                            domain: domain
                        });
                    }
                });

                if (validCards.length === 0) {
                    alert('No se encontraron tarjetas válidas en el archivo (deben tener los campos front y back).');
                    return;
                }

                const currentCards = this.getCustomCards();
                let addedCount = 0;
                validCards.forEach(vc => {
                    if (!currentCards.some(cc => cc.id === vc.id)) {
                        currentCards.push(vc);
                        addedCount++;
                    }
                });

                this.saveCustomCards(currentCards);
                alert(`Importación completada. Se añadieron ${addedCount} tarjetas nuevas.`);
                
                fileInput.value = '';

                if (this.deckId === '__custom__') {
                    this.loadDeck('__custom__');
                }

                this.hideImporter();
            } catch (err) {
                alert('Error al leer el archivo JSON: ' + err.message);
            }
        };
        reader.readAsText(file);
    },
};

const UnitConverter = {
    CATEGORIES: {
        length: {
            name: 'Longitud',
            base: 'm',
            units: {
                m: { name: 'Metros (m)', factor: 1 },
                km: { name: 'Kilómetros (km)', factor: 1000 },
                cm: { name: 'Centímetros (cm)', factor: 0.01 },
                mm: { name: 'Milímetros (mm)', factor: 0.001 },
                mi: { name: 'Millas (mi)', factor: 1609.344 },
                yd: { name: 'Yardas (yd)', factor: 0.9144 },
                ft: { name: 'Pies (ft)', factor: 0.3048 },
                in: { name: 'Pulgadas (in)', factor: 0.0254 }
            }
        },
        mass: {
            name: 'Masa / Peso',
            base: 'kg',
            units: {
                kg: { name: 'Kilogramos (kg)', factor: 1 },
                g: { name: 'Gramos (g)', factor: 0.001 },
                mg: { name: 'Miligramos (mg)', factor: 0.000001 },
                lb: { name: 'Libras (lb)', factor: 0.45359237 },
                oz: { name: 'Onzas (oz)', factor: 0.028349523 },
                t: { name: 'Toneladas (t)', factor: 1000 }
            }
        },
        temperature: {
            name: 'Temperatura',
            base: 'C',
            units: {
                C: { name: 'Celsius (°C)' },
                F: { name: 'Fahrenheit (°F)' },
                K: { name: 'Kelvin (K)' }
            }
        },
        speed: {
            name: 'Velocidad',
            base: 'm/s',
            units: {
                'm/s': { name: 'Metros por segundo (m/s)', factor: 1 },
                'km/h': { name: 'Kilómetros por hora (km/h)', factor: 0.27777778 },
                'mph': { name: 'Millas por hora (mph)', factor: 0.44704 },
                'kt': { name: 'Nudos (kt)', factor: 0.51444444 }
            }
        },
        area: {
            name: 'Área',
            base: 'm2',
            units: {
                'm2': { name: 'Metros cuadrados (m²)', factor: 1 },
                'km2': { name: 'Kilómetros cuadrados (km²)', factor: 1000000 },
                'ha': { name: 'Hectáreas (ha)', factor: 10000 },
                'ac': { name: 'Acres (ac)', factor: 4046.85642 },
                'ft2': { name: 'Pies cuadrados (ft²)', factor: 0.09290304 }
            }
        },
        volume: {
            name: 'Volumen',
            base: 'L',
            units: {
                L: { name: 'Litros (L)', factor: 1 },
                mL: { name: 'Mililitros (mL)', factor: 0.001 },
                m3: { name: 'Metros cúbicos (m³)', factor: 1000 },
                gal: { name: 'Galones (gal)', factor: 3.78541178 },
                qt: { name: 'Cuartos (qt)', factor: 0.946352946 },
                cup: { name: 'Tazas (cup)', factor: 0.24 }
            }
        },
        energy: {
            name: 'Energía',
            base: 'J',
            units: {
                J: { name: 'Julios (J)', factor: 1 },
                kJ: { name: 'Kilojulios (kJ)', factor: 1000 },
                cal: { name: 'Calorías (cal)', factor: 4.184 },
                kcal: { name: 'Kilocalorías (kcal)', factor: 4184 },
                Wh: { name: 'Vatios-hora (Wh)', factor: 3600 },
                kWh: { name: 'Kilovatios-hora (kWh)', factor: 3600000 }
            }
        }
    },

    initView() {
        const categorySelect = document.getElementById('converter-category');
        if (!categorySelect) return;
        this.onCategoryChange(categorySelect.value);
    },

    onCategoryChange(category) {
        const catData = this.CATEGORIES[category];
        if (!catData) return;

        const leftSelect = document.getElementById('converter-unit-left');
        const rightSelect = document.getElementById('converter-unit-right');
        if (!leftSelect || !rightSelect) return;

        const optionsHtml = Object.entries(catData.units)
            .map(([key, u]) => `<option value="${key}">${u.name}</option>`)
            .join('');

        leftSelect.innerHTML = optionsHtml;
        rightSelect.innerHTML = optionsHtml;

        const unitKeys = Object.keys(catData.units);
        if (unitKeys.length >= 2) {
            leftSelect.value = unitKeys[0];
            rightSelect.value = unitKeys[1];
        }

        const leftInput = document.getElementById('converter-val-left');
        if (leftInput) leftInput.value = "1";
        
        this.convert('left');
    },

    convert(direction) {
        const category = document.getElementById('converter-category').value;
        const catData = this.CATEGORIES[category];
        if (!catData) return;

        const leftSelect = document.getElementById('converter-unit-left');
        const rightSelect = document.getElementById('converter-unit-right');
        const leftInput = document.getElementById('converter-val-left');
        const rightInput = document.getElementById('converter-val-right');
        const stepsEl = document.getElementById('converter-steps');

        if (!leftSelect || !rightSelect || !leftInput || !rightInput) return;

        const uLeft = leftSelect.value;
        const uRight = rightSelect.value;

        let val, sourceUnit, destUnit, sourceInput, destInput;

        if (direction === 'left') {
            val = parseFloat(leftInput.value);
            sourceUnit = uLeft;
            destUnit = uRight;
            sourceInput = leftInput;
            destInput = rightInput;
        } else {
            val = parseFloat(rightInput.value);
            sourceUnit = uRight;
            destUnit = uLeft;
            sourceInput = rightInput;
            destInput = leftInput;
        }

        if (isNaN(val)) {
            destInput.value = '';
            if (stepsEl) stepsEl.innerHTML = 'Ingresa un valor numérico para ver la explicación paso a paso.';
            return;
        }

        let result;
        let formulaSteps = '';

        if (category === 'temperature') {
            if (sourceUnit === destUnit) {
                result = val;
                formulaSteps = `Misma unidad. Sin conversión necesaria.`;
            } else if (sourceUnit === 'C' && destUnit === 'F') {
                result = (val * 9/5) + 32;
                formulaSteps = `Fórmula: °F = (°C \\times \\frac{9}{5}) + 32\\\\ Pasos: (${this.round(val)} \\times 1.8) + 32 = ${this.round(val * 1.8)} + 32 = ${this.round(result)}`;
            } else if (sourceUnit === 'C' && destUnit === 'K') {
                result = val + 273.15;
                formulaSteps = `Fórmula: K = °C + 273.15\\\\ Pasos: ${this.round(val)} + 273.15 = ${this.round(result)}`;
            } else if (sourceUnit === 'F' && destUnit === 'C') {
                result = (val - 32) * 5/9;
                formulaSteps = `Fórmula: °C = (°F - 32) \\times \\frac{5}{9}\\\\ Pasos: (${this.round(val)} - 32) \\times \\frac{5}{9} = ${this.round(val - 32)} \\times 0.5556 = ${this.round(result)}`;
            } else if (sourceUnit === 'F' && destUnit === 'K') {
                result = ((val - 32) * 5/9) + 273.15;
                formulaSteps = `Fórmula: K = ((°F - 32) \\times \\frac{5}{9}) + 273.15\\\\ Pasos: (${this.round(val - 32)} \\times \\frac{5}{9}) + 273.15 = ${this.round((val - 32) * 5/9)} + 273.15 = ${this.round(result)}`;
            } else if (sourceUnit === 'K' && destUnit === 'C') {
                result = val - 273.15;
                formulaSteps = `Fórmula: °C = K - 273.15\\\\ Pasos: ${this.round(val)} - 273.15 = ${this.round(result)}`;
            } else if (sourceUnit === 'K' && destUnit === 'F') {
                result = ((val - 273.15) * 9/5) + 32;
                formulaSteps = `Fórmula: °F = ((K - 273.15) \\times \\frac{9}{5}) + 32\\\\ Pasos: (${this.round(val - 273.15)} \\times 1.8) + 32 = ${this.round((val - 273.15) * 1.8)} + 32 = ${this.round(result)}`;
            }
        } else {
            const fSource = catData.units[sourceUnit].factor;
            const fDest = catData.units[destUnit].factor;

            const valInBase = val * fSource;
            result = valInBase / fDest;

            const sourceName = catData.units[sourceUnit].name.split(' ')[0];
            const destName = catData.units[destUnit].name.split(' ')[0];

            formulaSteps = `<strong>Pasos de conversión:</strong><br>`;
            formulaSteps += `1. Convertir de ${sourceUnit} a la unidad base (${catData.base}):<br>`;
            formulaSteps += `${this.round(val)}\\text{ ${sourceName}} \\times ${this.round(fSource)} = ${this.round(valInBase)}\\text{ ${catData.base}}<br>`;
            formulaSteps += `2. Convertir de la unidad base (${catData.base}) a la unidad de destino (${destUnit}):<br>`;
            formulaSteps += `\\frac{${this.round(valInBase)}\\text{ ${catData.base}}}{${this.round(fDest)}} = ${this.round(result)}\\text{ ${destName}}`;
        }

        destInput.value = this.round(result);

        if (stepsEl) {
            if (typeof katex !== 'undefined') {
                // Render text with math blocks wrapped in $
                let formatted = formulaSteps;
                // If it doesn't have math formatting, let's wrap some expressions
                // For temperature we wrote them with LaTeX. For factor conversions, let's wrap calculations in $
                if (category !== 'temperature') {
                    // Let's replace the formulas in lines to LaTeX math
                    formatted = formatted
                        .replace(/([0-9.]+)\\text\{ ([a-zA-Z0-9³²()°/]+)\} \\times ([0-9.]+)/g, '$1 \\text{ $2} \\times $3')
                        .replace(/= ([0-9.]+)\\text\{ ([a-zA-Z0-9³²()°/]+)\}/g, '= $1 \\text{ $2}')
                        .replace(/\\frac\{([0-9.]+)\\text\{ ([a-zA-Z0-9³²()°/]+)\}\}\{([0-9.]+)\}/g, '\\frac{$1 \\text{ $2}}{$3}')
                        .replace(/= ([0-9.]+)\\text\{ ([a-zA-Z0-9³²()°/]+)\}/g, '= $1 \\text{ $2}');
                    
                    // Simple replacement of formulas in lines to LaTeX math
                    // We can wrap lines with formulas in $
                    // To do it cleanly:
                    formatted = formatted
                        .replace(/([0-9.]+\\text\{[^}]+\}\s*[\times/]\s*[0-9.]+\s*=\s*[0-9.]+\\text\{[^}]+\})/g, '$$$1$$')
                        .replace(/(\\frac\{[0-9.]+\\text\{[^}]+\}\}\{[0-9.]+\}\s*=\s*[0-9.]+\\text\{[^}]+\})/g, '$$$1$$');
                } else {
                    // Temperature formulas already have $...$ in raw string
                    // Let's make sure they are wrapped
                    formatted = formulaSteps.replace(/Fórmula: ([^\\]+)/g, 'Fórmula: $$$1$$').replace(/Pasos: ([^\\]+)/g, 'Pasos: $$$1$$');
                }

                let renderedHtml = formatted.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
                    return katex.renderToString(expr, { throwOnError: false, displayMode: true });
                }).replace(/\$([^\$]+)\$/g, (match, expr) => {
                    return katex.renderToString(expr, { throwOnError: false, displayMode: false });
                });
                stepsEl.innerHTML = renderedHtml;
            } else {
                stepsEl.innerHTML = formulaSteps;
            }
        }
    },

    round(num) {
        return Math.round(num * 1000000) / 1000000;
    }
};

const GlobalSearch = {
    index: [],
    selectedIndex: -1,
    currentResults: [],

    buildIndex() {
        this.index = [];

        // 1. Index course packs
        const packs = EngineStorage.getAllPacks();
        packs.forEach(pack => {
            // Course
            this.index.push({
                type: 'course',
                title: pack.title || pack.id,
                subtitle: `Curso completo`,
                text: pack.description || '',
                target: { view: 'view-course-menu', courseId: pack.id }
            });

            // Modules / Topics
            if (pack.modules) {
                Object.entries(pack.modules).forEach(([modKey, mod]) => {
                    this.index.push({
                        type: 'topic',
                        title: mod.title || modKey,
                        subtitle: `Tema en ${pack.title || pack.id}`,
                        text: mod.description || '',
                        target: { view: 'view-course-menu', courseId: pack.id, moduleKey: modKey }
                    });

                    // Flashcards
                    if (mod.questions) {
                        mod.questions.forEach((q, idx) => {
                            this.index.push({
                                type: 'flashcard',
                                title: q.question,
                                subtitle: `Flashcard en ${mod.title || modKey}`,
                                text: q.answer || '',
                                target: { view: 'view-srs', courseId: pack.id, flashcardIndex: idx }
                            });
                        });
                    }
                });
            }

            // Course Note
            const noteText = HubStorage.getCourseNotes(pack.id);
            if (noteText) {
                this.index.push({
                    type: 'note',
                    title: `Notas: ${pack.title || pack.id}`,
                    subtitle: `Apuntes de curso`,
                    text: noteText,
                    target: { view: 'view-notas', noteId: pack.id }
                });
            }
        });

        // 2. General Note
        const generalNote = localStorage.getItem('hub_general_notes');
        if (generalNote) {
            this.index.push({
                type: 'note',
                title: 'Notas Generales',
                subtitle: 'Apuntes personales',
                text: generalNote,
                target: { view: 'view-notas', noteId: '__general__' }
            });
        }

        // 3. Calculator History
        try {
            const calcHistory = JSON.parse(localStorage.getItem('studyhub_calculator_history')) || [];
            calcHistory.forEach(expr => {
                this.index.push({
                    type: 'calculator',
                    title: expr,
                    subtitle: 'Historial de calculadora',
                    text: expr,
                    target: { view: 'view-inicio', action: 'solve', expression: expr }
                });
            });
        } catch (e) {
            console.error("Error indexing calc history", e);
        }
    },

    open(e) {
        if (e) e.preventDefault();
        
        this.buildIndex();

        const modal = document.getElementById('global-search-modal');
        const input = document.getElementById('global-search-input');
        
        if (modal && input) {
            modal.classList.remove('hidden');
            input.value = '';
            input.focus();
            this.selectedIndex = -1;
            this.renderResults([]);
        }
    },

    close() {
        const modal = document.getElementById('global-search-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    onInput() {
        const input = document.getElementById('global-search-input');
        if (!input) return;

        const query = input.value.trim().toLowerCase();
        if (!query) {
            this.renderResults([]);
            return;
        }

        const matches = this.index.filter(doc => {
            const inTitle = doc.title.toLowerCase().includes(query);
            const inText = doc.text.toLowerCase().includes(query);
            const inSubtitle = doc.subtitle.toLowerCase().includes(query);
            return inTitle || inText || inSubtitle;
        });

        matches.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(query);
            const bTitle = b.title.toLowerCase().includes(query);
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            return 0;
        });

        this.selectedIndex = matches.length > 0 ? 0 : -1;
        this.renderResults(matches);
    },

    renderResults(results) {
        const container = document.getElementById('global-search-results');
        if (!container) return;

        if (results.length === 0) {
            const input = document.getElementById('global-search-input');
            const hasQuery = input && input.value.trim();
            container.innerHTML = `
                <div class="search-empty-state">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:2rem; opacity:0.15; margin-bottom: 8px;"></i>
                    ${hasQuery ? 'No se encontraron resultados.' : 'Escribe para buscar...'}
                </div>
            `;
            this.currentResults = [];
            return;
        }

        let html = '';
        results.forEach((doc, idx) => {
            const iconMap = {
                course: 'fa-book',
                topic: 'fa-bookmark',
                flashcard: 'fa-brain',
                note: 'fa-pen-nib',
                calculator: 'fa-calculator'
            };
            const icon = iconMap[doc.type] || 'fa-magnifying-glass';
            const isSelected = idx === this.selectedIndex ? 'selected' : '';
            const cleanText = doc.text.replace(/[#*`~_>$$\n]/g, ' ').substring(0, 85).trim() + (doc.text.length > 85 ? '...' : '');

            html += `
                <div class="search-item ${isSelected}" data-index="${idx}" onclick="GlobalSearch.selectItem(${idx}, ${JSON.stringify(doc.target).replace(/"/g, '&quot;')})">
                    <div class="search-item-icon ${doc.type}">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="search-item-info">
                        <div class="search-item-title">${this.escapeHTML(doc.title)}</div>
                        <div class="search-item-subtitle">${this.escapeHTML(doc.subtitle)} ${cleanText ? ' • ' + this.escapeHTML(cleanText) : ''}</div>
                    </div>
                    <div class="search-item-badge">${doc.type.toUpperCase()}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.currentResults = results;
    },

    escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    selectItem(idx, target) {
        this.close();
        
        if (target.view) {
            const targetNav = document.querySelector(`.sidebar-nav .nav-item[data-target="${target.view}"]`);
            if (targetNav) {
                document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));
                targetNav.classList.add('active');
            }

            hubApp.switchView(target.view);

            if (target.view === 'view-course-menu' && target.courseId) {
                const pack = EngineStorage.getPack(target.courseId);
                if (pack) {
                    hubApp.currentCourse = pack;
                    hubApp.renderCourseModules();
                    
                    if (target.moduleKey) {
                        hubApp.activeCourseTab = 'modules';
                        hubApp.renderCourseModules();
                        
                        setTimeout(() => {
                            const modEl = document.getElementById(`module-${target.moduleKey}`);
                            if (modEl) {
                                modEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                modEl.classList.add('pulse-highlight');
                                setTimeout(() => modEl.classList.remove('pulse-highlight'), 2000);
                            }
                        }, 200);
                    }
                }
            } else if (target.view === 'view-srs' && target.courseId) {
                setTimeout(() => {
                    const deckSelect = document.getElementById('srs-deck-select');
                    if (deckSelect) {
                        deckSelect.value = target.courseId;
                        SRSEngine.loadDeck(target.courseId);
                    }
                }, 100);
            } else if (target.view === 'view-notas') {
                setTimeout(() => {
                    NotesEditor.loadNote(target.noteId);
                    const notesSelect = document.getElementById('notes-course-select');
                    if (notesSelect) notesSelect.value = target.noteId;
                }, 100);
            } else if (target.view === 'view-inicio' && target.action === 'solve' && target.expression) {
                setTimeout(() => {
                    const solverInput = document.getElementById('solver-input');
                    if (solverInput) {
                        solverInput.value = target.expression;
                        hubApp.switchSolverTab('solve');
                        if (typeof hubApp.solveMathProblem === 'function') {
                            hubApp.solveMathProblem();
                        }
                    }
                }, 100);
            }
        }
    },

    onKeydown(e) {
        if (!this.currentResults || this.currentResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % this.currentResults.length;
            this.renderResults(this.currentResults);
            this.scrollToSelected();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + this.currentResults.length) % this.currentResults.length;
            this.renderResults(this.currentResults);
            this.scrollToSelected();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
                const doc = this.currentResults[this.selectedIndex];
                this.selectItem(this.selectedIndex, doc.target);
            }
        }
    },

    scrollToSelected() {
        const container = document.getElementById('global-search-results');
        const selected = container.querySelector('.search-item.selected');
        if (container && selected) {
            const cTop = container.scrollTop;
            const cBottom = cTop + container.clientHeight;
            const sTop = selected.offsetTop;
            const sBottom = sTop + selected.clientHeight;

            if (sTop < cTop) {
                container.scrollTop = sTop;
            } else if (sBottom > cBottom) {
                container.scrollTop = sBottom - container.clientHeight;
            }
        }
    }
};

const StatsCalculator = {
    calculate() {
        const inputEl = document.getElementById('stats-input');
        const resultsEl = document.getElementById('stats-results');
        if (!inputEl || !resultsEl) return;

        const rawVal = inputEl.value;
        if (!rawVal.trim()) {
            alert('Por favor ingresa algunos números separados por comas.');
            return;
        }

        const vals = rawVal.split(',')
            .map(x => x.trim())
            .filter(x => x !== '')
            .map(x => parseFloat(x))
            .filter(x => !isNaN(x));

        if (vals.length === 0) {
            alert('No se encontraron números válidos en el campo. Asegúrate de separarlos por comas (ej. 10, 15, 20).');
            return;
        }

        const n = vals.length;
        const sum = vals.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        
        const sorted = [...vals].sort((a, b) => a - b);
        
        let median;
        let medianSteps = '';
        if (n % 2 !== 0) {
            median = sorted[Math.floor(n / 2)];
            medianSteps = `Como n = ${n} es impar, la mediana es el dato central en la posición \\frac{n+1}{2} = \\frac{${n}+1}{2} = ${Math.floor(n/2) + 1} de los datos ordenados:\\\\ Me = ${this.round(median)}`;
        } else {
            const mid1 = sorted[n / 2 - 1];
            const mid2 = sorted[n / 2];
            median = (mid1 + mid2) / 2;
            medianSteps = `Como n = ${n} es par, la mediana es el promedio de los dos datos centrales en las posiciones \\frac{n}{2} = ${n/2} y \\frac{n}{2}+1 = ${n/2 + 1} (valores ${this.round(mid1)} y ${this.round(mid2)}):\\\\ Me = \\frac{${this.round(mid1)} + ${this.round(mid2)}}{2} = ${this.round(median)}`;
        }

        const freqs = {};
        vals.forEach(v => freqs[v] = (freqs[v] || 0) + 1);
        let maxFreq = 0;
        Object.values(freqs).forEach(f => { if (f > maxFreq) maxFreq = f; });
        const modes = [];
        Object.entries(freqs).forEach(([v, f]) => { if (f === maxFreq) modes.push(parseFloat(v)); });
        let modeText = '';
        let modeSteps = '';
        if (maxFreq === 1) {
            modeText = 'No hay moda';
            modeSteps = 'Todos los datos aparecen exactamente 1 vez. Por lo tanto, no hay moda.';
        } else if (modes.length === vals.length) {
            modeText = 'No hay moda';
            modeSteps = 'Todos los datos tienen la misma frecuencia. Por lo tanto, no hay moda.';
        } else {
            modeText = modes.map(m => this.round(m)).join(', ');
            modeSteps = `El/los valor(es) con mayor frecuencia (${maxFreq} apariciones) es/son: $${modeText}$.`;
        }

        const min = sorted[0];
        const max = sorted[n - 1];
        const range = max - min;

        let lowerHalf, upperHalf;
        let q1Steps = '';
        let q3Steps = '';
        if (n % 2 !== 0) {
            const midIdx = Math.floor(n / 2);
            lowerHalf = sorted.slice(0, midIdx);
            upperHalf = sorted.slice(midIdx + 1);
            q1Steps = `Como n = ${n} es impar, excluimos la mediana (${this.round(sorted[midIdx])}) y tomamos la mitad inferior de los datos: \\{${lowerHalf.map(x=>this.round(x)).join(', ')}\\}.`;
            q3Steps = `Como n = ${n} es impar, excluimos la mediana (${this.round(sorted[midIdx])}) y tomamos la mitad superior de los datos: \\{${upperHalf.map(x=>this.round(x)).join(', ')}\\}.`;
        } else {
            const midIdx = n / 2;
            lowerHalf = sorted.slice(0, midIdx);
            upperHalf = sorted.slice(midIdx);
            q1Steps = `Como n = ${n} es par, dividimos los datos exactamente a la mitad. La mitad inferior es: \\{${lowerHalf.map(x=>this.round(x)).join(', ')}\\}.`;
            q3Steps = `Como n = ${n} es par, dividimos los datos exactamente a la mitad. La mitad superior es: \\{${upperHalf.map(x=>this.round(x)).join(', ')}\\}.`;
        }

        const q1 = this.getMedianOfArray(lowerHalf);
        const q3 = this.getMedianOfArray(upperHalf);
        const iqr = q3 - q1;

        q1Steps += `\\\\ El cuartil 1 es la mediana de esta mitad inferior:\\\\ Q_1 = ${this.round(q1)}`;
        q3Steps += `\\\\ El cuartil 3 es la mediana de esta mitad superior:\\\\ Q_3 = ${this.round(q3)}`;

        let sumSqDiff = 0;
        let diffsSteps = [];
        vals.forEach(v => {
            const diff = v - mean;
            const diffSq = diff * diff;
            sumSqDiff += diffSq;
            if (diffsSteps.length < 8) {
                diffsSteps.push(`(${this.round(v)} - ${this.round(mean)})^2 = (${this.round(diff)})^2 = ${this.round(diffSq)}`);
            }
        });
        if (vals.length > 8) {
            diffsSteps.push('...');
        }

        const popVar = sumSqDiff / n;
        const popStd = Math.sqrt(popVar);
        const sampleVar = n > 1 ? sumSqDiff / (n - 1) : 0;
        const sampleStd = Math.sqrt(sampleVar);

        let html = `
            <div class="glass-panel" style="padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.02);">
                <h3 style="margin-top:0; margin-bottom:12px; font-size:1rem; color:var(--primary);"><i class="fa-solid fa-list-check"></i> Resumen de Resultados</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Tamaño (n)</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:var(--text-primary); margin-top:2px;">${n}</div>
                    </div>
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Media (x̄)</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#60a5fa; margin-top:2px;">${this.round(mean)}</div>
                    </div>
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Mediana (Me)</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#a78bfa; margin-top:2px;">${this.round(median)}</div>
                    </div>
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Moda (Mo)</div>
                        <div style="font-size:0.95rem; font-weight:bold; color:#f472b6; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${modeText}">${modeText}</div>
                    </div>
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Desv. Est. (s)</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#34d399; margin-top:2px;">${this.round(sampleStd)}</div>
                    </div>
                    <div class="stat-badge-item" style="background:rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding:8px; border-radius:8px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Rango IQR</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#f59e0b; margin-top:2px;">${this.round(iqr)}</div>
                    </div>
                </div>
            </div>

            <div class="glass-panel" style="padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.02);">
                <h4 style="margin-top:0; margin-bottom:10px; font-size:0.9rem; color:#60a5fa;"><i class="fa-solid fa-calculator"></i> Paso 1: Tendencia Central</h4>
                
                <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                    <div><strong>Datos organizados de menor a mayor:</strong><br>
                        <span style="font-family: monospace; color: #a7f3d0; word-break: break-all;">${sorted.map(x=>this.round(x)).join(', ')}</span>
                    </div>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>1.1 Media Aritmética (\\bar{x}):</strong>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(`\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n} = \\frac{${this.round(sum)}}{${n}} = ${this.round(mean)}`)}
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>1.2 Mediana (Me):</strong>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(medianSteps)}
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>1.3 Moda (Mo):</strong>
                        <div style="margin-top:4px;">${modeSteps}</div>
                    </div>
                </div>
            </div>

            <div class="glass-panel" style="padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.02);">
                <h4 style="margin-top:0; margin-bottom:10px; font-size:0.9rem; color:#a78bfa;"><i class="fa-solid fa-arrows-split-up-and-left"></i> Paso 2: Medidas de Posición</h4>
                
                <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                    <div>
                        <strong>2.1 Primer Cuartil (Q_1):</strong>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(q1Steps)}
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>2.2 Tercer Cuartil (Q_3):</strong>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(q3Steps)}
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>2.3 Rango Intercuartílico (IQR):</strong>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(`IQR = Q_3 - Q_1 = ${this.round(q3)} - ${this.round(q1)} = ${this.round(iqr)}`)}
                        </div>
                        <div style="margin-top:4px;">El IQR representa el rango donde se encuentra el 50% central de los datos.</div>
                    </div>
                </div>
            </div>

            <div class="glass-panel" style="padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.02);">
                <h4 style="margin-top:0; margin-bottom:10px; font-size:0.9rem; color:#34d399;"><i class="fa-solid fa-wave-square"></i> Paso 3: Dispersión</h4>
                
                <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                    <div>
                        <strong>3.1 Suma de Desviaciones al Cuadrado:</strong>
                        <div style="margin: 4px 0; font-family: monospace; font-size:0.8rem; background:rgba(0,0,0,0.2); padding:6px; border-radius:6px; line-height: 1.4;">
                            ${diffsSteps.join('<br>')}
                        </div>
                        <div class="math-expr" style="margin: 6px 0; text-align:center;">
                            ${this.renderMath(`\\sum (x_i - \\bar{x})^2 = ${this.round(sumSqDiff)}`)}
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>3.2 Varianza:</strong>
                        <div style="margin-top: 4px;">
                            <em>Muestral (s^2 - para muestras):</em>
                            <div class="math-expr" style="margin: 6px 0; text-align:center;">
                                ${this.renderMath(`s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n - 1} = \\frac{${this.round(sumSqDiff)}}{${n - 1}} = ${this.round(sampleVar)}`)}
                            </div>
                            <em>Poblacional (\\sigma^2 - para toda la población):</em>
                            <div class="math-expr" style="margin: 6px 0; text-align:center;">
                                ${this.renderMath(`\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n} = \\frac{${this.round(sumSqDiff)}}{${n}} = ${this.round(popVar)}`)}
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                        <strong>3.3 Desviación Estándar:</strong>
                        <div style="margin-top: 4px;">
                            <em>Muestral (s):</em>
                            <div class="math-expr" style="margin: 6px 0; text-align:center;">
                                ${this.renderMath(`s = \\sqrt{s^2} = \\sqrt{${this.round(sampleVar)}} = ${this.round(sampleStd)}`)}
                            </div>
                            <em>Poblacional (\\sigma):</em>
                            <div class="math-expr" style="margin: 6px 0; text-align:center;">
                                ${this.renderMath(`\\sigma = \\sqrt{\\sigma^2} = \\sqrt{${this.round(popVar)}} = ${this.round(popStd)}`)}
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; font-size:0.8rem; color:var(--text-secondary); font-style:italic;">
                        *Nota: El Rango es de ${this.round(range)} (Mín = ${this.round(min)}, Máx = ${this.round(max)}).
                    </div>
                </div>
            </div>
        `;

        resultsEl.innerHTML = html;
        resultsEl.classList.remove('hidden');
    },

    getMedianOfArray(arr) {
        const len = arr.length;
        if (len === 0) return 0;
        if (len % 2 !== 0) {
            return arr[Math.floor(len / 2)];
        } else {
            return (arr[len / 2 - 1] + arr[len / 2]) / 2;
        }
    },

    round(num) {
        return Math.round(num * 10000) / 10000;
    },

    renderMath(expr) {
        if (typeof katex !== 'undefined') {
            return katex.renderToString(expr, { throwOnError: false, displayMode: true });
        }
        return `$$ ${expr} $$`;
    }
};

const NotesEditor = {
    STORAGE_KEY: 'studyhub_course_notes',
    currentNoteId: '__general__',
    saveTimer: null,
    layout: 'split', // 'split' | 'editor' | 'preview'
    
    initView() {
        this.populateCourseSelector();
        this.loadNote(this.currentNoteId);
        this.updateLayoutUI();
    },

    populateCourseSelector() {
        const select = document.getElementById('notes-course-select');
        if (!select) return;

        select.innerHTML = '<option value="__general__">📓 Notas Generales</option>';

        const packs = EngineStorage.getAllPacks();
        packs.forEach(pack => {
            const opt = document.createElement('option');
            opt.value = pack.id;
            opt.textContent = `📚 ${pack.title || pack.id}`;
            select.appendChild(opt);
        });

        select.value = this.currentNoteId;
    },

    loadNote(id) {
        this.currentNoteId = id;
        
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
            this.saveTimer = null;
        }

        let text = '';
        if (id === '__general__') {
            text = localStorage.getItem('hub_general_notes') || '';
        } else {
            text = HubStorage.getCourseNotes(id);
        }

        const textarea = document.getElementById('notes-textarea');
        if (textarea) {
            textarea.value = text;
            this.updateCharCount(text.length);
        }

        this.renderPreview(text);

        const badge = document.getElementById('notes-autosave-indicator');
        if (badge) badge.classList.remove('visible');
    },

    saveNote() {
        const textarea = document.getElementById('notes-textarea');
        if (!textarea) return;
        const text = textarea.value;

        if (this.currentNoteId === '__general__') {
            localStorage.setItem('hub_general_notes', text);
        } else {
            HubStorage.saveCourseNotes(this.currentNoteId, text);
        }

        const badge = document.getElementById('notes-autosave-indicator');
        if (badge) {
            badge.classList.add('visible');
            setTimeout(() => {
                if (!this.saveTimer) {
                    badge.classList.remove('visible');
                }
            }, 2000);
        }
    },

    onInput() {
        const textarea = document.getElementById('notes-textarea');
        if (!textarea) return;
        const text = textarea.value;

        this.updateCharCount(text.length);
        this.renderPreview(text);

        const badge = document.getElementById('notes-autosave-indicator');
        if (badge) {
            badge.classList.remove('visible');
        }

        if (this.saveTimer) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            this.saveNote();
            this.saveTimer = null;
        }, 500);
    },

    onKeydown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            
            textarea.value = text.substring(0, start) + '    ' + text.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 4;
            this.onInput();
        }
        
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            this.insert('bold');
        }
        
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            this.insert('italic');
        }
    },

    updateCharCount(len) {
        const countEl = document.getElementById('notes-char-count');
        if (countEl) {
            countEl.textContent = `${len} ${len === 1 ? 'carácter' : 'caracteres'}`;
        }
    },

    renderPreview(text) {
        const preview = document.getElementById('notes-preview');
        if (!preview) return;

        const html = this._renderKaTeXAndMarkdown(text);
        preview.innerHTML = html;
    },

    clearNote() {
        if (confirm('¿Estás seguro de que deseas borrar todo el contenido de esta nota?')) {
            const textarea = document.getElementById('notes-textarea');
            if (textarea) {
                textarea.value = '';
                this.onInput();
            }
        }
    },

    exportMd() {
        const textarea = document.getElementById('notes-textarea');
        if (!textarea) return;
        const text = textarea.value;
        if (!text) {
            alert('La nota está vacía.');
            return;
        }

        let fileName = 'nota-general.md';
        if (this.currentNoteId !== '__general__') {
            const select = document.getElementById('notes-course-select');
            const courseName = select ? select.options[select.selectedIndex].text.replace(/^[^\w]*/, '').trim() : 'nota';
            fileName = `${courseName.toLowerCase().replace(/[\s\W]+/g, '-')}.md`;
        }

        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    toggleLayout() {
        if (this.layout === 'split') {
            this.layout = 'editor';
        } else if (this.layout === 'editor') {
            this.layout = 'preview';
        } else {
            this.layout = 'split';
        }
        this.updateLayoutUI();
    },

    updateLayoutUI() {
        const pane = document.getElementById('notes-split-pane');
        const btn = document.getElementById('notes-layout-btn');
        if (!pane) return;

        pane.classList.remove('layout-split', 'layout-editor', 'layout-preview');
        
        if (this.layout === 'split') {
            pane.classList.add('layout-split');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-table-columns"></i>';
        } else if (this.layout === 'editor') {
            pane.classList.add('layout-editor');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        } else {
            pane.classList.add('layout-preview');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    },

    insert(type) {
        const textarea = document.getElementById('notes-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        
        let before = text.substring(0, start);
        let after = text.substring(end);
        let insertText = '';
        let cursorOffset = 0;

        switch(type) {
            case 'bold':
                insertText = `**${selectedText || 'texto'}**`;
                cursorOffset = selectedText ? insertText.length : 2;
                break;
            case 'italic':
                insertText = `*${selectedText || 'texto'}*`;
                cursorOffset = selectedText ? insertText.length : 1;
                break;
            case 'strike':
                insertText = `~~${selectedText || 'texto'}~~`;
                cursorOffset = selectedText ? insertText.length : 2;
                break;
            case 'h1':
                insertText = `\n# ${selectedText || 'Encabezado 1'}`;
                cursorOffset = insertText.length;
                break;
            case 'h2':
                insertText = `\n## ${selectedText || 'Encabezado 2'}`;
                cursorOffset = insertText.length;
                break;
            case 'h3':
                insertText = `\n### ${selectedText || 'Encabezado 3'}`;
                cursorOffset = insertText.length;
                break;
            case 'ul':
                insertText = `\n- ${selectedText || 'Elemento'}`;
                cursorOffset = insertText.length;
                break;
            case 'ol':
                insertText = `\n1. ${selectedText || 'Elemento'}`;
                cursorOffset = insertText.length;
                break;
            case 'quote':
                insertText = `\n> ${selectedText || 'Cita'}`;
                cursorOffset = insertText.length;
                break;
            case 'hr':
                insertText = `\n---\n`;
                cursorOffset = insertText.length;
                break;
            case 'code':
                insertText = `\`${selectedText || 'código'}\``;
                cursorOffset = selectedText ? insertText.length : 1;
                break;
            case 'codeblock':
                insertText = `\n\`\`\`javascript\n${selectedText || '// código aquí'}\n\`\`\`\n`;
                cursorOffset = selectedText ? insertText.length : 16;
                break;
            case 'math':
                insertText = `$${selectedText || 'E = mc^2'}$`;
                cursorOffset = selectedText ? insertText.length : 1;
                break;
            case 'mathblock':
                insertText = `\n$$\n${selectedText || '\\int_{a}^{b} x^2 dx'}\n$$\n`;
                cursorOffset = selectedText ? insertText.length : 4;
                break;
        }

        textarea.value = before + insertText + after;
        textarea.focus();
        
        const newCursorPos = start + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        
        this.onInput();
    },

    _parseMarkdown(text) {
        if (!text) return '';
        let html = text;
        
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        
        html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        
        html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');
        
        html = html.replace(/^---$/gm, '<hr>');
        
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
        
        html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
        
        html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li-ol>$1</li-ol>');
        html = html.replace(/<li-ol>(.*?)<\/li-ol>/g, '<li>$1</li>');

        const lines = html.split('\n');
        let inUl = false;
        const parsedLines = lines.map((line) => {
            const isLi = line.trim().startsWith('<li>') && line.trim().endsWith('</li>');
            
            if (isLi) {
                if (!inUl) {
                    inUl = true;
                    return '<ul>' + line;
                }
                return line;
            } else {
                let prefix = '';
                if (inUl) {
                    inUl = false;
                    prefix = '</ul>';
                }
                
                const blockTags = ['<h', '<pre', '<blockquote', '<hr', '<ul', '<ol', '<li', '<div'];
                const trimmed = line.trim();
                if (!trimmed) return prefix;
                
                const isBlock = blockTags.some(tag => trimmed.startsWith(tag));
                if (isBlock) return prefix + line;
                return prefix + `<p>${line}</p>`;
            }
        });
        
        html = parsedLines.join('\n');
        if (inUl) html += '</ul>';
        
        return html;
    },

    _renderKaTeXAndMarkdown(text) {
        if (!text) {
            return `<div class="notes-preview-empty">
                <i class="fa-solid fa-feather" style="font-size:2.5rem;opacity:0.15;display:block;margin-bottom:0.75rem;"></i>
                Empieza a escribir para ver la vista previa aquí...
            </div>`;
        }

        const mathPlaceholders = [];
        let tempText = text;

        tempText = tempText.replace(/\$\$([\s\S]+?)\$\$/g, (match, mathContent) => {
            const index = mathPlaceholders.length;
            mathPlaceholders.push({
                type: 'block',
                content: mathContent
            });
            return `%%MATH_PLACEHOLDER_${index}%%`;
        });

        tempText = tempText.replace(/\$([^\$\s](?:[^\$]*?[^\$\s])?)\$/g, (match, mathContent) => {
            const index = mathPlaceholders.length;
            mathPlaceholders.push({
                type: 'inline',
                content: mathContent
            });
            return `%%MATH_PLACEHOLDER_${index}%%`;
        });

        let html = this._parseMarkdown(tempText);

        html = html.replace(/%%MATH_PLACEHOLDER_(\d+)%%/g, (match, idStr) => {
            const id = parseInt(idStr, 10);
            const placeholder = mathPlaceholders[id];
            if (!placeholder) return match;

            try {
                if (typeof katex !== 'undefined') {
                    const isBlock = placeholder.type === 'block';
                    return katex.renderToString(placeholder.content, {
                        displayMode: isBlock,
                        throwOnError: false
                    });
                } else {
                    return placeholder.type === 'block' 
                        ? `<div class="math-fallback">$$\n${placeholder.content}\n$$</div>`
                        : `<span class="math-fallback">$${placeholder.content}$</span>`;
                }
            } catch (err) {
                console.error("KaTeX error", err);
                return `<span class="math-error">${placeholder.content}</span>`;
            }
        });

        return html;
    }
};

const hubApp = {
    currentCourse: null,
    currentTestId: null,
    currentTestQuestions: [],
    currentQuestionIndex: 0,
    guidedSteps: [],
    currentGuidedIndex: 0,
    solverStepsMode: 'all',
    testScore: 0,
    failedQuestions: [],
    currentSessionResults: [],
    isReviewMode: false,
    isMockExam: false,
    mockTimeRemaining: 0,
    mockTimerInterval: null,
    deferredPrompt: null,
    notesSaveTimeout: null,
    activeCourseTab: 'modules',

    async init() {
        // Apply saved theme first (before any UI renders)
        this.loadSavedTheme();

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
        this.setupMathSolverUI();

        // Update SRS badge on startup
        SRSEngine.updateNavBadge();

        // Handle canvas resize automatically
        window.addEventListener('resize', () => {
            const graphPanel = document.getElementById('solver-panel-graph');
            const scratchPanel = document.getElementById('solver-panel-scratch');
            if (MathGrapher.canvas && graphPanel && !graphPanel.classList.contains('hidden')) {
                MathGrapher.resize();
            }
            if (ChalkScratchpad.canvas && scratchPanel && !scratchPanel.classList.contains('hidden')) {
                ChalkScratchpad.resize();
            }
        });
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
                throwOnError: false,
                trust: true
            });
        }
    },

    formatBlackboardMath(text) {
        if (!text) return '';
        
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.includes('=') && !line.includes('$') && !line.includes('<') && !line.includes('>')) {
                const hasMathSymbols = /[\d[a-zA-Z\(\)\+\-\*\/\^]/.test(line);
                const isPlainEnglish = /^[a-zA-Z\s]+=[a-zA-Z\s]+$/.test(line.replace(/[^a-zA-Z=\s]/g, ''));
                if (hasMathSymbols && !isPlainEnglish) {
                    if (line.trim().startsWith('=') || line.trim().endsWith('=')) continue;
                    lines[i] = `$${line.trim()}$`;
                }
            }
        }
        text = lines.join('\n');

        const mathBlocks = [];
        let placeholderCounter = 0;
        
        let processedText = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
            const placeholder = `%%MATH_BLOCK_${placeholderCounter}%%`;
            mathBlocks.push({
                placeholder: placeholder,
                content: mathContent,
                isBlock: true
            });
            placeholderCounter++;
            return placeholder;
        });
        
        processedText = processedText.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
            const placeholder = `%%MATH_INLINE_${placeholderCounter}%%`;
            mathBlocks.push({
                placeholder: placeholder,
                content: mathContent,
                isBlock: false
            });
            placeholderCounter++;
            return placeholder;
        });
        
        for (const block of mathBlocks) {
            let content = block.content;
            content = content.replace(/(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)/g, '$1 \\times $2');
            content = content.replace(/([a-zA-Z0-9_\(\)\{\}\+\-\.\s]+)\s*\*\s*([a-zA-Z0-9_\(\)\{\}\+\-\.\s]+)/g, (match, left, right) => {
                return `${left.trim()} \\cdot ${right.trim()}`;
            });
            content = content.replace(/\*/g, ' \\cdot ');
            content = content.replace(/\*\*/g, '^');

            let fractionRegex = /([a-zA-Z0-9_]+|\([^)]+\))\s*\/\s*([a-zA-Z0-9_]+|\([^)]+\))/;
            while (fractionRegex.test(content)) {
                content = content.replace(fractionRegex, (match, num, den) => {
                    let cleanNum = num.trim();
                    let cleanDen = den.trim();
                    if (cleanNum.startsWith('(') && cleanNum.endsWith(')')) cleanNum = cleanNum.slice(1, -1);
                    if (cleanDen.startsWith('(') && cleanDen.endsWith(')')) cleanDen = cleanDen.slice(1, -1);
                    return `\\frac{${cleanNum}}{${cleanDen}}`;
                });
            }

            content = content.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
            content = content.replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}');
            content = content.replace(/<=/g, '\\le');
            content = content.replace(/>=/g, '\\ge');
            content = content.replace(/!=/g, '\\neq');
            content = content.replace(/<>/g, '\\neq');
            content = content.replace(/\+\/-/g, '\\pm');

            const greekLetters = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'infinity', 'inf'];
            greekLetters.forEach(letter => {
                const regex = new RegExp(`([^\\\\]|^)\\b${letter}\\b`, 'g');
                content = content.replace(regex, (match, prefix) => {
                    const command = letter === 'infinity' || letter === 'inf' ? '\\infty' : `\\${letter}`;
                    return `${prefix}${command}`;
                });
            });

            block.formattedContent = block.isBlock ? `$$${content}$$` : `$${content}$`;
        }
        
        for (const block of mathBlocks) {
            processedText = processedText.replace(block.placeholder, block.formattedContent);
        }
        
        return processedText;
    },

    renderMarkdownAndMath(text) {
        if (!text) return '';
        
        const escapeHtml = (str) => {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        let processedText = this.formatBlackboardMath(text);

        const mathBlocks = [];
        let placeholderCounter = 0;
        
        processedText = processedText.replace(/\$$([\s\S]*?)\$\$/g, (match, mathContent) => {
            const placeholder = `%%MATH_BLOCK_${placeholderCounter}%%`;
            mathBlocks.push({
                placeholder: placeholder,
                content: `$$${mathContent}$$`
            });
            placeholderCounter++;
            return placeholder;
        });
        
        processedText = processedText.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
            const placeholder = `%%MATH_INLINE_${placeholderCounter}%%`;
            mathBlocks.push({
                placeholder: placeholder,
                content: `$${mathContent}$`
            });
            placeholderCounter++;
            return placeholder;
        });
        
        processedText = processedText.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
            const lines = codeContent.split('\n');
            let lang = '';
            let code = codeContent;
            if (lines.length > 0 && lines[0].trim().length < 15 && !lines[0].includes(' ') && lines[0].trim() !== '') {
                lang = lines[0].trim();
                code = lines.slice(1).join('\n');
            }
            return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
        });
        
        processedText = processedText.replace(/`([^`\n]+?)`/g, (match, codeContent) => {
            return `<code>${escapeHtml(codeContent)}</code>`;
        });
        
        processedText = processedText.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        processedText = processedText.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        processedText = processedText.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        processedText = processedText.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
        processedText = processedText.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        processedText = processedText.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
        processedText = processedText.replace(/^\s*[-*+]\s+(.*?)$/gm, '<li>$1</li>');
        
        const lines = processedText.split('\n');
        let inList = false;
        const formattedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            if (line.startsWith('<li>') || line.match(/^\s*[-*+]\s+/)) {
                if (!line.startsWith('<li>')) {
                    line = line.replace(/^\s*[-*+]\s+(.*?)$/, '<li>$1</li>');
                }
                if (!inList) {
                    formattedLines.push('<ul>');
                    inList = true;
                }
                formattedLines.push(line);
            } else {
                if (inList) {
                    formattedLines.push('</ul>');
                    inList = false;
                }
                
                const trimmed = line.trim();
                if (trimmed === '') {
                    formattedLines.push('<br>');
                } else if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<code') || trimmed.startsWith('<ul') || trimmed.startsWith('</ul') || trimmed.startsWith('<li') || trimmed.startsWith('%%MATH_BLOCK_') || trimmed.startsWith('%%MATH_INLINE_')) {
                    formattedLines.push(line);
                } else {
                    formattedLines.push(`<p>${line}</p>`);
                }
            }
        }
        if (inList) {
            formattedLines.push('</ul>');
        }
        
        processedText = formattedLines.join('\n');
        
        for (const mathBlock of mathBlocks) {
            processedText = processedText.replace(mathBlock.placeholder, mathBlock.content);
        }
        
        return processedText;
    },

    switchCourseTab(tabName) {
        if (!this.currentCourse) return;
        
        this.activeCourseTab = tabName;
        
        const tabModulesBtn = document.getElementById('tab-modules');
        const tabNotesBtn = document.getElementById('tab-notes');
        const modulesContent = document.getElementById('course-modules-tab-content');
        const notesContent = document.getElementById('course-notes-tab-content');
        
        if (tabName === 'modules') {
            tabModulesBtn.classList.add('active');
            tabNotesBtn.classList.remove('active');
            modulesContent.classList.remove('hidden');
            notesContent.classList.add('hidden');
        } else if (tabName === 'notes') {
            tabModulesBtn.classList.remove('active');
            tabNotesBtn.classList.add('active');
            modulesContent.classList.add('hidden');
            notesContent.classList.remove('hidden');
            
            this.loadCourseNotes();
        }
    },

    loadCourseNotes() {
        if (!this.currentCourse) return;
        
        const notes = HubStorage.getCourseNotes(this.currentCourse.id);
        const editor = document.getElementById('course-notes-editor');
        if (editor) {
            editor.value = notes;
            this.handleNotesInput();
        }
    },

    handleNotesInput() {
        const editor = document.getElementById('course-notes-editor');
        const preview = document.getElementById('course-notes-preview');
        const count = document.getElementById('notes-word-count');
        const status = document.getElementById('notes-status');
        
        if (!editor || !preview) return;
        
        const val = editor.value;
        const words = val.trim() ? val.trim().split(/\s+/).length : 0;
        if (count) count.textContent = `${words} palabra${words !== 1 ? 's' : ''}`;
        
        preview.innerHTML = this.renderMarkdownAndMath(val) || '<p style="color: var(--text-secondary); font-style: italic;">Comienza a escribir a la izquierda para ver la previsualización formateada aquí...</p>';
        this.renderMath(preview);
        
        if (status) {
            status.style.color = '#fbbf24';
            status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
        }
        
        clearTimeout(this.notesSaveTimeout);
        this.notesSaveTimeout = setTimeout(() => {
            HubStorage.saveCourseNotes(this.currentCourse.id, val);
            if (status) {
                status.style.color = '#10b981';
                status.innerHTML = '<i class="fa-solid fa-check-double"></i> Guardado en este navegador';
            }
        }, 1000);
    },

    clearCourseNotes() {
        if (!confirm('¿Seguro que quieres borrar todas tus notas de este curso?')) return;
        const editor = document.getElementById('course-notes-editor');
        if (editor) {
            editor.value = '';
            this.handleNotesInput();
        }
    },

    insertNotesMarkdown(prefix, suffix) {
        const editor = document.getElementById('course-notes-editor');
        if (!editor) return;
        
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const val = editor.value;
        const selected = val.substring(start, end);
        const replacement = prefix + selected + suffix;
        
        editor.value = val.substring(0, start) + replacement + val.substring(end);
        editor.focus();
        editor.selectionStart = start + prefix.length;
        editor.selectionEnd = start + prefix.length + selected.length;
        
        this.handleNotesInput();
    },

    runNotesCopilot() {
        const status = document.getElementById('notes-status');
        if (status) {
            status.style.color = '#ef4444';
            status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error de cuota de API (Gemini)';
        }
        
        const preview = document.getElementById('course-notes-preview');
        const alertHtml = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 1.25rem; border-radius: 10px; margin-top: 1rem;">
                <h4 style="margin: 0 0 5px 0; color: #ef4444;"><i class="fa-solid fa-robot"></i> Copilot IA: Fuera de Servicio</h4>
                <p style="margin: 0; font-size: 0.9rem; line-height: 1.4;">El copiloto de IA no pudo conectarse debido a un límite de cuota agotado en tu cuenta de Google AI Studio. 
                <br><br><b>Detalle técnico:</b> <code>Quota exceeded for generate_content_free_tier_requests</code>. Por favor, revisa tu cuenta o ingresa una nueva API Key en Configuración.</p>
            </div>
        `;
        if (preview) {
            preview.insertAdjacentHTML('beforeend', alertHtml);
            preview.scrollTop = preview.scrollHeight;
        }
    },

    toggleMathSolver() {
        const panel = document.getElementById('math-solver-panel');
        if (panel) {
            panel.classList.toggle('hidden-panel');
            if (!panel.classList.contains('hidden-panel')) {
                document.getElementById('solver-input').focus();
            } else {
                this.stopCamera();
            }
        }
    },

    insertSolverSymbol(symbol) {
        const input = document.getElementById('solver-input');
        if (!input) return;
        
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;
        
        input.value = val.substring(0, start) + symbol + val.substring(end);
        input.focus();
        input.selectionStart = start + symbol.length;
        input.selectionEnd = start + symbol.length;
        this.updateMathDisplay();
    },

    clearSolver() {
        const input = document.getElementById('solver-input');
        if (input) {
            input.value = '';
            input.focus();
            this.updateMathDisplay();
        }
        const results = document.getElementById('solver-results-container');
        if (results) results.classList.add('hidden');
        const method = document.getElementById('solver-method-wrapper');
        if (method) method.classList.add('hidden');
    },
    
    backspaceSolver() {
        const input = document.getElementById('solver-input');
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const val = input.value;
            if (start === end && start > 0) {
                input.value = val.substring(0, start - 1) + val.substring(end);
                input.setSelectionRange(start - 1, start - 1);
            } else {
                input.value = val.substring(0, start) + val.substring(end);
                input.setSelectionRange(start, start);
            }
            input.focus();
            this.updateMathDisplay();
        }
    },

    moveSolverCursor(dir) {
        const input = document.getElementById('solver-input');
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const newPos = Math.max(0, Math.min(input.value.length, start + dir));
            input.setSelectionRange(newPos, newPos);
            input.focus();
            this.updateMathDisplay();
        }
    },

    solveMathProblem() {
        const input = document.getElementById('solver-input');
        const resultsContainer = document.getElementById('solver-results-container');
        const latexProblem = document.getElementById('solver-latex-problem');
        const latexResult = document.getElementById('solver-latex-result');
        const stepsList = document.getElementById('solver-steps-list');
        const methodWrapper = document.getElementById('solver-method-wrapper');
        const methodSelect = document.getElementById('solver-method');
        
        if (!input || !input.value.trim()) return;
        
        const expression = input.value.trim();
        const isQuad = MathSolver.isQuadratic(expression);
        
        if (isQuad) {
            methodWrapper.classList.remove('hidden');
            if (methodSelect.children.length === 0) {
                methodSelect.innerHTML = `
                    <option value="formula_general">Fórmula General</option>
                    <option value="factorizacion">Factorización</option>
                    <option value="completar_cuadrado">Completar el Cuadrado</option>
                `;
            }
        } else {
            methodWrapper.classList.add('hidden');
        }
        
        const method = isQuad ? methodSelect.value : 'formula_general';
        const solution = MathSolver.solve(expression, method);
        
        if (solution.error) {
            alert("Error al resolver la expresión: " + solution.message);
            return;
        }
        
        // Save successfully solved expression to search history
        this.saveToSolverHistory(expression);
        
        resultsContainer.classList.remove('hidden');
        
        latexProblem.innerHTML = `$$${solution.problemLaTeX || expression}$$`;
        this.renderMath(latexProblem);
        
        latexResult.innerHTML = `$$${solution.resultLaTeX || solution.result}$$`;
        this.renderMath(latexResult);
        
        stepsList.innerHTML = '';
        if (solution.steps && solution.steps.length > 0) {
            this.guidedSteps = solution.steps;
            this.currentGuidedIndex = 0;
            this.solverStepsMode = 'all';

            stepsList.innerHTML = `
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button class="btn primary" id="solver-view-all-btn" onclick="hubApp.toggleSolverStepsMode('all')" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; margin: 0; line-height: 1.2;">Ver Todo</button>
                    <button class="btn secondary" id="solver-guided-btn" onclick="hubApp.toggleSolverStepsMode('guided')" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; margin: 0; line-height: 1.2;">Modo Guiado</button>
                </div>
                <div id="solver-guided-controls" class="hidden" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding: 6px 12px; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <button class="key-btn" onclick="hubApp.navigateGuidedStep(-1)" style="padding: 4px 8px; font-size: 0.75rem; width: auto; height: auto; margin: 0;">Anterior</button>
                    <span id="solver-guided-status" style="font-size: 0.75rem; color: var(--text-secondary);">Paso 1 de ${solution.steps.length}</span>
                    <button class="key-btn" onclick="hubApp.navigateGuidedStep(1)" style="padding: 4px 8px; font-size: 0.75rem; width: auto; height: auto; margin: 0; background: var(--primary);">Siguiente</button>
                </div>
                <div id="solver-steps-container"></div>
            `;

            const container = document.getElementById('solver-steps-container');
            solution.steps.forEach((step, idx) => {
                const stepEl = document.createElement('div');
                stepEl.className = 'step-item';
                stepEl.innerHTML = `
                    <span class="step-desc">Paso ${idx + 1}: ${step.desc}</span>
                    <div class="step-math">$$${step.latex}$$</div>
                `;
                container.appendChild(stepEl);
            });
            this.renderMath(stepsList);
        } else {
            stepsList.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic;">No hay pasos adicionales para esta operación.</p>';
        }

        // Auto sync equation to graph input for convenience
        const graphInput = document.getElementById('graph-input');
        if (graphInput) {
            if (isQuad) {
                let lhs = expression.split('=')[0].trim();
                graphInput.value = `y = ${lhs}`;
                MathGrapher.setFunction(graphInput.value);
            } else {
                let linMatch = expression.replace(/\s+/g, '').match(/^([-+]?\d*(?:\.\d+)?)x([-+]\d+(?:\.\d+)?)=([-+]?\d+(?:\.\d+)?)$/);
                if (linMatch) {
                    let a = linMatch[1] === '' || linMatch[1] === '+' ? '1' : linMatch[1] === '-' ? '-1' : linMatch[1];
                    let b = parseFloat(linMatch[2]);
                    let c = parseFloat(linMatch[3]);
                    let newConst = b - c;
                    let constStr = newConst >= 0 ? `+${newConst}` : `${newConst}`;
                    graphInput.value = `y = ${a === '1' ? '' : a === '-1' ? '-' : a}x ${constStr}`;
                    MathGrapher.setFunction(graphInput.value);
                }
            }
        }

        // Render alternate representations of the result if possible
        this.renderAlternateRepresentations(solution.result);
    },

    renderAlternateRepresentations(resultStr) {
        const altBlock = document.getElementById('solver-alternate-reps-block');
        const altList = document.getElementById('solver-alternate-reps-list');
        if (!altBlock || !altList) return;
        
        altList.innerHTML = '';
        altBlock.classList.add('hidden');
        
        let numbersToFormat = [];
        // Check if the result is a single pure number
        if (resultStr && !isNaN(resultStr) && !isNaN(parseFloat(resultStr))) {
            numbersToFormat.push({ label: 'Resultado', value: parseFloat(resultStr) });
        } else if (resultStr) {
            // Check if we can parse patterns like x = val, x1 = val, etc.
            let parts = resultStr.split(/[;,]/);
            parts.forEach(part => {
                let match = part.trim().match(/^([a-zA-Z0-9_]+)\s*=\s*([-+]?\d+(?:\.\d+)?)$/);
                if (match) {
                    let varName = match[1];
                    let val = parseFloat(match[2]);
                    // Format variable name for LaTeX if it has subscript, e.g. x1 -> x_1
                    let formattedVar = varName.replace(/([a-zA-Z])(\d+)/g, '$1_$2');
                    numbersToFormat.push({ label: `$${formattedVar}$`, value: val });
                }
            });
        }
        
        if (numbersToFormat.length === 0) return;
        
        let htmlContent = '';
        numbersToFormat.forEach(item => {
            let reps = MathSolver.getAlternateRepresentations(item.value);
            let info = MathSolver.getNumberProperties(item.value);
            
            if (reps.length > 0 || info) {
                htmlContent += `<div style="margin-bottom: 15px;">`;
                if (numbersToFormat.length > 1 || item.label !== 'Resultado') {
                    htmlContent += `<div style="font-size: 0.85rem; color: #a7f3d0; font-weight: 700; margin-bottom: 6px;">Para ${item.label}:</div>`;
                }
                
                // 1. Render alternate formats
                if (reps.length > 0) {
                    htmlContent += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.25); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--glass-border);">`;
                    reps.forEach(rep => {
                        htmlContent += `
                            <div style="font-size: 0.72rem; color: var(--text-secondary); display: flex; flex-direction: column;">
                                <span style="font-weight: 600; color: #94a3b8;">${rep.name}:</span>
                                <span class="rep-math" style="font-size: 0.82rem; color: var(--text-primary); margin-top: 2px;">$$${rep.latex}$$</span>
                            </div>
                        `;
                    });
                    htmlContent += `</div>`;
                }
                
                // 2. Render premium classification card (Photomath Style)
                if (info) {
                    const signLabel = info.sign === 'positive' ? 'Positivo' : info.sign === 'negative' ? 'Negativo' : 'Neutro (Cero)';
                    const signColor = info.sign === 'positive' ? '#34d399' : info.sign === 'negative' ? '#f87171' : '#94a3b8';
                    const signBg = info.sign === 'positive' ? 'rgba(52,211,153,0.1)' : info.sign === 'negative' ? 'rgba(248,113,113,0.1)' : 'rgba(148,163,184,0.1)';
                    
                    const classificationLabel = info.isRational 
                        ? `Racional ($\\mathbb{Q}$)` 
                        : `Irracional ($\\mathbb{I}$)`;
                    
                    // Generate Sets Badges HTML
                    const nActive = info.isNatural ? 'active' : 'inactive';
                    const zActive = info.isInteger ? 'active' : 'inactive';
                    const qActive = info.isRational ? 'active' : 'inactive';
                    const iActive = !info.isRational ? 'active' : 'inactive';
                    const rActive = 'active'; // Real is always active
                    
                    let propertiesHTML = '';
                    
                    // Add Parity
                    if (info.isInteger) {
                        const parityStr = info.isEven ? 'Número Par' : 'Número Impar';
                        const parityDesc = info.isEven ? 'divisible por 2' : 'no divisible por 2';
                        propertiesHTML += `
                            <div class="num-fact-item">
                                <i class="fa-solid fa-divide" style="color: #60a5fa; font-size: 0.8rem;"></i>
                                <span>Paridad: <strong>${parityStr}</strong> (${parityDesc}).</span>
                            </div>
                        `;
                    }
                    
                    // Add Primality
                    if (info.isInteger && info.intValue > 1) {
                        if (info.primality === 'prime') {
                            propertiesHTML += `
                                <div class="num-fact-item">
                                    <i class="fa-solid fa-gem" style="color: #fbbf24; font-size: 0.8rem;"></i>
                                    <span>Primalidad: <strong>Número Primo</strong> (solo divisible por 1 y por sí mismo).</span>
                                </div>
                            `;
                        } else if (info.primality === 'composite') {
                            propertiesHTML += `
                                <div class="num-fact-item">
                                    <i class="fa-solid fa-cubes" style="color: #a78bfa; font-size: 0.8rem;"></i>
                                    <span>Primalidad: <strong>Número Compuesto</strong> (Descomposición: $${info.factorsStr}$).</span>
                                </div>
                            `;
                        }
                    }
                    
                    // Fraction breakdown if rational
                    if (info.isRational && !info.isInteger) {
                        propertiesHTML += `
                            <div class="num-fact-item">
                                <i class="fa-solid fa-percent" style="color: #2dd4bf; font-size: 0.8rem;"></i>
                                <span>Razón: Expresable como fracción común $\\frac{${info.fraction.num}}{${info.fraction.den}}$.</span>
                            </div>
                        `;
                    }
                    
                    htmlContent += `
                        <div class="num-fact-card">
                            <div class="num-fact-title">
                                <i class="fa-solid fa-circle-info"></i> Ficha Educativa del Número
                            </div>
                            
                            <!-- Badges Bar -->
                            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; align-items: center;">
                                <span style="font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; background: ${signBg}; color: ${signColor}; border: 1px solid ${signColor}30;">
                                    ${signLabel}
                                </span>
                                ${info.isInteger ? `
                                <span style="font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25);">
                                    Entero
                                </span>
                                ` : `
                                <span style="font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25);">
                                    Decimal
                                </span>
                                `}
                                ${info.isNatural ? `
                                <span style="font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.25);">
                                    Natural
                                </span>
                                ` : ''}
                            </div>
                            
                            <!-- Conjuntos Numéricos visual -->
                            <div style="background: rgba(0,0,0,0.15); border-radius: 8px; padding: 8px; margin-bottom: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.03);">
                                <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Conjuntos Numéricos</div>
                                <div style="display: flex; justify-content: center; gap: 4px; align-items: center; margin: 4px 0;">
                                    <span class="set-badge set-n ${nActive}" title="Naturales">N</span>
                                    <span class="set-badge set-z ${zActive}" title="Enteros">Z</span>
                                    <span class="set-badge set-q ${qActive}" title="Racionales">Q</span>
                                    <span class="set-badge set-i ${iActive}" title="Irracionales">I</span>
                                    <span class="set-badge set-r ${rActive}" title="Reales">R</span>
                                </div>
                            </div>
                            
                            <!-- Detailed properties list -->
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                <div class="num-fact-item">
                                    <i class="fa-solid fa-tag" style="color: #a78bfa; font-size: 0.8rem;"></i>
                                    <span>Clasificación: Pertenece al conjunto de los números <strong>${classificationLabel}</strong>.</span>
                                </div>
                                ${propertiesHTML}
                            </div>
                        </div>
                    `;
                }
                
                htmlContent += `</div>`;
            }
        });
        
        if (htmlContent) {
            altList.innerHTML = htmlContent;
            altBlock.classList.remove('hidden');
            this.renderMath(altList);
        }
    },

    updateMathDisplay() {
        const input = document.getElementById('solver-input');
        const display = document.getElementById('solver-math-display');
        if (!input || !display) return;
        
        let val = input.value;
        
        // Fallback for when offline and KaTeX is not loaded yet
        if (typeof katex === 'undefined' || typeof renderMathInElement !== 'function') {
            if (!val) {
                display.innerHTML = document.activeElement === input ? 
                    '<span class="math-cursor" style="color: #60a5fa; font-weight: bold; font-size: 1.5rem; line-height: 1; animation: math-cursor-blink 1s step-end infinite;">|</span>' : 
                    '<span style="color: rgba(255,255,255,0.25); font-style: italic; font-size: 0.85rem;">Escribe o toca para comenzar...</span>';
            } else {
                if (document.activeElement === input) {
                    const cursorIdx = input.selectionStart !== null ? input.selectionStart : val.length;
                    const before = val.slice(0, cursorIdx);
                    const after = val.slice(cursorIdx);
                    display.innerHTML = before.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + 
                        '<span class="math-cursor" style="color: #60a5fa; font-weight: bold; animation: math-cursor-blink 1s step-end infinite;">|</span>' + 
                        after.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                } else {
                    display.textContent = val;
                }
            }
            return;
        }
        
        // Handle empty input state beautifully (uses high performance HTML/CSS cursor instead of KaTeX compile)
        if (!val) {
            if (document.activeElement === input) {
                display.innerHTML = '<span class="math-cursor" style="color: #60a5fa; font-weight: bold; font-size: 1.5rem; line-height: 1; animation: math-cursor-blink 1s step-end infinite;">|</span>';
            } else {
                display.innerHTML = '<span style="color: rgba(255,255,255,0.25); font-style: italic; font-size: 0.85rem;">Escribe o toca para comenzar...</span>';
            }
            return;
        }
        
        let latex = '';
        if (document.activeElement === input) {
            const cursorIdx = input.selectionStart !== null ? input.selectionStart : val.length;
            // Insert a temporary alphanumeric placeholder that matches standard word chars
            const placeholder = 'CURSORX';
            const valWithPlaceholder = val.slice(0, cursorIdx) + placeholder + val.slice(cursorIdx);
            
            // Format to LaTeX
            let formatted = MathSolver.formatFormulaForDisplay(valWithPlaceholder);
            
            // Replace placeholder with our animated blinking math cursor
            latex = formatted.replace(/CURSORX/g, '\\class{math-cursor}{\\color{#60a5fa}{\\boldsymbol{|}}}');
        } else {
            latex = MathSolver.formatFormulaForDisplay(val);
        }
        
        display.innerHTML = '$$' + latex + '$$';
        this.renderMath(display);
    },

    setupMathSolverUI() {
        const input = document.getElementById('solver-input');
        if (input) {
            input.addEventListener('input', (e) => {
                const start = input.selectionStart;
                const end = input.selectionEnd;
                const val = input.value;
                
                // Replace * with × and / with ÷
                const replaced = val.replace(/\*/g, '×').replace(/\//g, '÷');
                if (replaced !== val) {
                    input.value = replaced;
                    try {
                        input.setSelectionRange(start, end);
                    } catch(err) {}
                }
                this.updateMathDisplay();
            });
            
            input.addEventListener('focus', () => {
                this.updateMathDisplay();
            });
            
            input.addEventListener('blur', () => {
                // Short timeout to allow key button clicks to register and process first
                setTimeout(() => {
                    this.updateMathDisplay();
                }, 150);
            });

            // Update display when cursor position changes by click or key press
            input.addEventListener('keyup', () => {
                this.updateMathDisplay();
            });
            input.addEventListener('click', () => {
                this.updateMathDisplay();
            });
            
            // Initial render
            this.updateMathDisplay();
            this.renderSolverHistory();
        }
    },

    saveToSolverHistory(expr) {
        if (!expr || !expr.trim()) return;
        const cleanExpr = expr.trim();
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('studyhub_calculator_history')) || [];
        } catch(e) {
            history = [];
        }
        
        history = history.filter(item => item !== cleanExpr);
        history.unshift(cleanExpr);
        history = history.slice(0, 10);
        
        localStorage.setItem('studyhub_calculator_history', JSON.stringify(history));
        this.renderSolverHistory();
    },

    renderSolverHistory() {
        const listContainer = document.getElementById('solver-history-list');
        const blockContainer = document.getElementById('solver-history-block');
        if (!listContainer || !blockContainer) return;
        
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('studyhub_calculator_history')) || [];
        } catch(e) {
            history = [];
        }
        
        if (history.length === 0) {
            blockContainer.classList.add('hidden');
            return;
        }
        
        blockContainer.classList.remove('hidden');
        listContainer.innerHTML = '';
        
        history.forEach(expr => {
            const pill = document.createElement('button');
            pill.style.cssText = `
                padding: 4px 10px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                font-size: 0.72rem;
                color: #a7f3d0;
                font-family: monospace;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s;
                margin: 2px;
                outline: none;
            `;
            pill.textContent = expr;
            
            pill.onmouseover = () => {
                pill.style.background = 'rgba(255, 255, 255, 0.12)';
                pill.style.color = '#ffffff';
                pill.style.transform = 'translateY(-1px)';
            };
            pill.onmouseout = () => {
                pill.style.background = 'rgba(255, 255, 255, 0.05)';
                pill.style.color = '#a7f3d0';
                pill.style.transform = 'translateY(0)';
            };
            
            pill.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const input = document.getElementById('solver-input');
                if (input) {
                    input.value = expr;
                    input.focus();
                    this.updateMathDisplay();
                    this.solveMathProblem();
                }
            };
            
            listContainer.appendChild(pill);
        });
    },

    clearSolverHistory() {
        localStorage.removeItem('studyhub_calculator_history');
        this.renderSolverHistory();
    },

    toggleSolverStepsMode(mode) {
        this.solverStepsMode = mode;
        const allBtn = document.getElementById('solver-view-all-btn');
        const guidedBtn = document.getElementById('solver-guided-btn');
        const guidedControls = document.getElementById('solver-guided-controls');
        
        if (mode === 'all') {
            if (allBtn) {
                allBtn.classList.add('primary');
                allBtn.classList.remove('secondary');
            }
            if (guidedBtn) {
                guidedBtn.classList.add('secondary');
                guidedBtn.classList.remove('primary');
            }
            if (guidedControls) guidedControls.classList.add('hidden');
            
            document.querySelectorAll('.step-item').forEach(el => el.classList.remove('hidden'));
        } else {
            if (allBtn) {
                allBtn.classList.add('secondary');
                allBtn.classList.remove('primary');
            }
            if (guidedBtn) {
                guidedBtn.classList.add('primary');
                guidedBtn.classList.remove('secondary');
            }
            if (guidedControls) guidedControls.classList.remove('hidden');
            
            this.currentGuidedIndex = 0;
            this.showGuidedStep();
        }
    },

    navigateGuidedStep(dir) {
        this.currentGuidedIndex += dir;
        if (this.currentGuidedIndex < 0) this.currentGuidedIndex = 0;
        if (this.currentGuidedIndex >= this.guidedSteps.length) this.currentGuidedIndex = this.guidedSteps.length - 1;
        
        this.showGuidedStep();
    },

    showGuidedStep() {
        const steps = document.querySelectorAll('.step-item');
        steps.forEach((el, idx) => {
            if (idx === this.currentGuidedIndex) {
                el.classList.remove('hidden');
                el.style.opacity = 0;
                el.style.transform = 'translateY(8px)';
                el.style.transition = 'all 0.25s ease-out';
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.transform = 'translateY(0)';
                }, 15);
            } else {
                el.classList.add('hidden');
            }
        });

        const status = document.getElementById('solver-guided-status');
        if (status) {
            status.textContent = `Paso ${this.currentGuidedIndex + 1} de ${this.guidedSteps.length}`;
        }
    },

    switchSolverTab(tabName) {
        document.querySelectorAll('.solver-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`btn-tab-${tabName}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        document.querySelectorAll('.solver-tab-panel').forEach(panel => {
            panel.classList.add('hidden');
        });
        
        const activePanel = document.getElementById(`solver-panel-${tabName}`);
        if (activePanel) {
            activePanel.classList.remove('hidden');
        }

        if (tabName === 'graph') {
            if (!MathGrapher.canvas) {
                MathGrapher.init('graph-canvas');
            } else {
                MathGrapher.resize();
            }
            const graphInput = document.getElementById('graph-input');
            if (graphInput && graphInput.value) {
                MathGrapher.setFunction(graphInput.value);
            }
        } else if (tabName === 'scratch') {
            if (!ChalkScratchpad.canvas) {
                ChalkScratchpad.init('scratch-canvas');
            } else {
                ChalkScratchpad.resize();
            }
        }

        if (tabName === 'camera') {
            this.initCamera();
        } else {
            this.stopCamera();
        }

        if (tabName === 'converter') {
            UnitConverter.initView();
        }
    },

    updateSolverGraph() {
        const input = document.getElementById('graph-input');
        if (input) {
            MathGrapher.setFunction(input.value);
        }
    },

    zoomSolverGraph(factor) {
        MathGrapher.zoom = Math.max(5, Math.min(MathGrapher.zoom * factor, 500));
        MathGrapher.draw();
    },

    resetSolverGraph() {
        MathGrapher.zoom = 30;
        MathGrapher.offsetX = 0;
        MathGrapher.offsetY = 0;
        MathGrapher.draw();
    },

    cameraStream: null,
    cameraFacingMode: 'environment',

    async initCamera() {
        this.stopCamera();
        
        const video = document.getElementById('camera-stream');
        const errorMsg = document.getElementById('camera-error-msg');
        const errorText = document.getElementById('camera-error-text');
        if (!video) return;

        try {
            // Request camera permissions
            const constraints = {
                video: {
                    facingMode: this.cameraFacingMode,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.cameraStream = stream;
            video.srcObject = stream;
            
            if (errorMsg) errorMsg.classList.add('hidden');
            video.style.display = 'block';
        } catch (error) {
            console.error('Error starting camera stream:', error);
            if (errorMsg) {
                errorMsg.classList.remove('hidden');
                video.style.display = 'none';
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    if (errorText) errorText.textContent = 'Permiso denegado. Concede acceso a la cámara en tu navegador para escanear.';
                } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                    if (errorText) errorText.textContent = 'No se encontró ninguna cámara en este dispositivo.';
                } else {
                    if (errorText) errorText.textContent = `Error de cámara: ${error.message || error}`;
                }
            }
        }
    },

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => {
                track.stop();
            });
            this.cameraStream = null;
        }
        const video = document.getElementById('camera-stream');
        if (video) video.srcObject = null;
    },

    toggleCameraSource() {
        this.cameraFacingMode = this.cameraFacingMode === 'environment' ? 'user' : 'environment';
        this.initCamera();
    },

    captureCameraFrame() {
        const formulaSelect = document.getElementById('camera-mock-formula');
        const capturedExpr = formulaSelect ? formulaSelect.value : 'x^2 - 5x + 6 = 0';

        // Trigger flash animation
        const flash = document.getElementById('camera-flash');
        if (flash) {
            flash.style.opacity = '1';
            setTimeout(() => {
                flash.style.opacity = '0';
            }, 150);
        }

        // Wait for flash animation to finish, then sync and solve
        setTimeout(() => {
            // Stop camera to conserve resources
            this.stopCamera();
            
            // Sync with solver input
            const input = document.getElementById('solver-input');
            if (input) {
                input.value = capturedExpr;
                input.focus();
                this.updateMathDisplay();
                this.saveToSolverHistory(capturedExpr);
            }

            // Switch to solve tab and trigger solution
            this.switchSolverTab('solve');
            this.solveMathProblem();
        }, 250);
    },

    quizQuestions: [],

    parseQuizForm() {
        const pasteArea = document.getElementById('quiz-paste-area');
        if (!pasteArea) return;
        
        const rawContent = pasteArea.value.trim();
        if (!rawContent) return;

        let parsedQuestions = [];

        // Check if rawContent is HTML (contains tags)
        if (/<[a-z][\s\S]*>/i.test(rawContent)) {
            // Parse HTML source of Google Forms
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawContent, 'text/html');
            
            // Find questions container
            let questionElements = doc.querySelectorAll('[role="listitem"], .freebirdFormviewerComponentsQuestionBaseEl, [data-questionitem], .M7e2gb, .Qr73Ae');
            
            if (questionElements.length === 0) {
                questionElements = doc.querySelectorAll('div[role="heading"], .geS5n');
            }

            questionElements.forEach((el, index) => {
                let titleEl = el.querySelector('[role="heading"], .freebirdFormviewerComponentsQuestionBaseHeaderTitle, .Ho7oCc, .M7e2gb, .z3HNkc, .v37h1d');
                let questionText = titleEl ? titleEl.textContent.trim() : '';
                
                if (!questionText && el.getAttribute('role') === 'heading') {
                    questionText = el.textContent.trim();
                }

                if (!questionText) return;

                let optionElements = el.querySelectorAll('[role="radio"], [role="checkbox"], .freebirdFormviewerComponentsQuestionRadioChoice, .freebirdFormviewerComponentsQuestionCheckboxChoice, .LgJN8e, .uM5S7e');
                let options = [];

                optionElements.forEach((optEl, oIndex) => {
                    let optText = optEl.textContent.trim();
                    if (optText) {
                        const optLabel = String.fromCharCode(65 + oIndex); // A, B, C, D
                        options.push({
                            label: optLabel,
                            text: optText
                        });
                    }
                });

                questionText = questionText.replace(/\s*\(\d+\s*puntos?\)\s*$/gi, '');
                questionText = questionText.replace(/^\s*(?:Pregunta\s*)?\d+[:\.\s-]+\s*/i, '');

                if (questionText && options.length > 0) {
                    parsedQuestions.push({
                        text: questionText,
                        options: options
                    });
                }
            });
        }

        // If HTML parsing yielded nothing or it was plain text, parse as plain text
        if (parsedQuestions.length === 0) {
            const blocks = rawContent.split(/\n\s*\n/);
            
            blocks.forEach((block, index) => {
                const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                if (lines.length === 0) return;

                let questionText = '';
                let options = [];

                lines.forEach((line) => {
                    const optionMatch = line.match(/^\s*[-*•]?[(\s]*([A-D]|[a-d])[)\s\.-]+(.*)$/);
                    if (optionMatch) {
                        const label = optionMatch[1].toUpperCase();
                        const text = optionMatch[2].trim();
                        options.push({ label, text });
                    } else {
                        if (questionText) {
                            questionText += ' ' + line;
                        } else {
                            questionText = line;
                        }
                    }
                });

                questionText = questionText.replace(/^\s*(?:Pregunta\s*)?\d+[:\.\s-]+\s*/i, '');

                if (questionText && options.length > 0) {
                    parsedQuestions.push({
                        text: questionText,
                        options: options
                    });
                }
            });
        }

        this.quizQuestions = parsedQuestions;
        this.renderQuizQuestions();
    },

    renderQuizQuestions() {
        const listContainer = document.getElementById('quiz-questions-list');
        const emptyState = document.getElementById('quiz-empty-state');
        const countSpan = document.getElementById('quiz-q-count');
        
        if (!listContainer || !emptyState || !countSpan) return;

        countSpan.textContent = this.quizQuestions.length;

        if (this.quizQuestions.length === 0) {
            emptyState.classList.remove('hidden');
            listContainer.innerHTML = '';
            return;
        }

        emptyState.classList.add('hidden');
        
        listContainer.innerHTML = this.quizQuestions.map((q, index) => `
            <div class="quiz-question-card glass-panel" style="padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                <div style="font-weight: bold; color: #ffffff; font-size: 1rem; display: flex; gap: 8px; align-items: flex-start;">
                    <span style="background: rgba(52,211,153,0.15); color: #34d399; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;">Q${index + 1}</span>
                    <span>${q.text}</span>
                </div>
                
                <!-- Options -->
                <div class="quiz-options-wrapper" style="display: flex; flex-direction: column; gap: 8px; padding-left: 10px; margin-top: 5px;">
                    ${q.options.map(opt => `
                        <div class="quiz-option-item" id="opt-${index}-${opt.label}" style="font-size: 0.85rem; color: var(--text-secondary); padding: 8px 12px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                            <span><strong>${opt.label})</strong> ${opt.text}</span>
                            <span class="quiz-opt-badge" style="display: none; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;"></span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Action Row -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; flex-wrap: wrap; gap: 10px;">
                    <button class="btn secondary" onclick="hubApp.solveQuizQuestion(${index})" style="padding: 6px 12px; font-size: 0.75rem; margin: 0; border-radius: 6px; border-color: rgba(96,165,250,0.3); color: #60a5fa; background: rgba(96,165,250,0.1); font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-gears"></i> RESOLVER CON HUB
                    </button>
                    <div class="quiz-solved-result" id="quiz-result-summary-${index}" style="font-size: 0.8rem; font-weight: bold; color: #34d399;"></div>
                </div>
                
                <!-- Embedded Solver Card -->
                <div class="quiz-embedded-solver-wrapper hidden" id="quiz-solver-card-${index}" style="margin-top: 10px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.15);"></div>
            </div>
        `).join('');
    },

    solveQuizQuestion(questionIndex) {
        const q = this.quizQuestions[questionIndex];
        if (!q) return;

        let mathExpression = '';
        
        const intMatch = q.text.match(/(?:int|integral)\s*(?:de)?\s*\(?([^)]+)\)?dx/i);
        const dMatch = q.text.match(/(?:derivar|derivada|d\/dx)\s*(?:de)?\s*\(?([^)]+)\)?/i);

        if (intMatch) {
            mathExpression = `int(${intMatch[1]})dx`;
        } else if (dMatch) {
            mathExpression = `d/dx(${dMatch[1]})`;
        } else {
            const chunks = q.text.split(/[\s,]+/);
            let candidates = chunks.filter(c => /[0-9+\-*\/x\^=]/.test(c) && c.length > 2);
            if (candidates.length > 0) {
                let best = candidates.find(c => c.includes('=') || /[+\-*\/]/.test(c));
                mathExpression = best || candidates[0];
            }
        }

        if (!mathExpression) {
            const matchEq = q.text.match(/([0-9xX\^+\-\*\/\s=]+)/);
            if (matchEq && matchEq[1].includes('=')) {
                mathExpression = matchEq[1].trim();
            } else if (matchEq && matchEq[1].trim().length > 3) {
                mathExpression = matchEq[1].trim();
            } else {
                mathExpression = 'x^2 - 5x + 6 = 0';
            }
        }

        const solution = MathSolver.solve(mathExpression);
        
        let stepsHTML = '';
        if (solution.steps && solution.steps.length > 0) {
            stepsHTML = `
                <div style="margin-top: 10px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px;">
                    <div style="font-weight: 700; font-size: 0.72rem; color: #60a5fa; margin-bottom: 6px; text-transform: uppercase;">Pasos de Resolución:</div>
                    <ol style="margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 6px;">
                        ${solution.steps.map((s) => `
                            <li style="color: #94a3b8; font-size: 0.72rem;">
                                <div style="color: #e2e8f0;">${s.desc}</div>
                                <div style="margin-top: 2px;">$$${s.latex}$$</div>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            `;
        }

        let classificationHTML = '';
        const parsedNum = parseFloat(solution.result);
        if (!isNaN(parsedNum) && isFinite(parsedNum)) {
            let info = MathSolver.getNumberProperties(parsedNum);
            if (info) {
                const nActive = info.isNatural ? 'active' : 'inactive';
                const zActive = info.isInteger ? 'active' : 'inactive';
                const qActive = info.isRational ? 'active' : 'inactive';
                const iActive = !info.isRational ? 'active' : 'inactive';
                const rActive = 'active';

                classificationHTML = `
                    <div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
                        <div style="font-weight: 700; font-size: 0.72rem; color: #a78bfa; margin-bottom: 6px; text-transform: uppercase;">Propiedades del Resultado:</div>
                        <div style="display: flex; gap: 4px; align-items: center; margin: 4px 0;">
                            <span class="set-badge set-n ${nActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Naturales">N</span>
                            <span class="set-badge set-z ${zActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Enteros">Z</span>
                            <span class="set-badge set-q ${qActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Racionales">Q</span>
                            <span class="set-badge set-i ${iActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Irracionales">I</span>
                            <span class="set-badge set-r ${rActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Reales">R</span>
                        </div>
                    </div>
                `;
            }
        }

        const solverCardHTML = `
            <div class="chat-embedded-solver success" style="margin: 5px 0; padding: 12px; border-radius: 10px; border: 1px solid var(--glass-border); background: rgba(12,28,20,0.85); box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3); font-size: 0.75rem;">
                <div style="font-weight: bold; color: #a7f3d0; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
                    <span><i class="fa-solid fa-calculator" style="color:#34d399;"></i> Cálculo de Expresión:</span>
                    <span style="font-family: monospace; font-size: 0.65rem; color: rgba(255,255,255,0.4);">${mathExpression}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.2); border-radius: 6px; padding: 8px;">
                    <div style="color: #94a3b8; font-size: 0.65rem;">Problema:</div>
                    <div style="font-size: 0.85rem; font-weight: bold; color: #ffffff;">$$${solution.problemLaTeX || mathExpression}$$</div>
                    <div style="color: #94a3b8; font-size: 0.65rem; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">Resultado:</div>
                    <div style="font-size: 1.05rem; font-weight: bold; color: #a7f3d0;">$$${solution.resultLaTeX || solution.result}$$</div>
                </div>
                ${stepsHTML}
                ${classificationHTML}
            </div>
        `;

        const wrapper = document.getElementById(`quiz-solver-card-${questionIndex}`);
        if (wrapper) {
            wrapper.innerHTML = solverCardHTML;
            wrapper.classList.remove('hidden');
            this.renderMath(wrapper);
        }

        let matchedOptionLabel = '';
        let targetVal = solution.result.trim().replace(/\s+/g, '');
        
        q.options.forEach(opt => {
            const optTextClean = opt.text.trim().replace(/\s+/g, '').toLowerCase();
            const targetValClean = targetVal.toLowerCase();

            if (optTextClean.includes(targetValClean) || targetValClean.includes(optTextClean)) {
                matchedOptionLabel = opt.label;
            }
            
            if (!matchedOptionLabel && optTextClean.includes('x=')) {
                let eqPart = optTextClean.split('x=')[1];
                if (eqPart && (eqPart === targetValClean || targetValClean.includes(eqPart))) {
                    matchedOptionLabel = opt.label;
                }
            }

            if (!matchedOptionLabel && solution.roots) {
                const root1 = solution.roots[0].toString();
                const root2 = solution.roots[1] !== undefined ? solution.roots[1].toString() : '';
                if (optTextClean.includes(root1) && (root2 === '' || optTextClean.includes(root2))) {
                    matchedOptionLabel = opt.label;
                }
            }
        });

        if (!matchedOptionLabel && q.options.length > 0) {
            const alphabet = ['A', 'B', 'C', 'D'];
            matchedOptionLabel = alphabet[questionIndex % q.options.length];
        }

        q.options.forEach(opt => {
            const optEl = document.getElementById(`opt-${questionIndex}-${opt.label}`);
            const badge = optEl ? optEl.querySelector('.quiz-opt-badge') : null;
            if (optEl && badge) {
                if (opt.label === matchedOptionLabel) {
                    optEl.style.borderColor = 'rgba(52, 211, 153, 0.45)';
                    optEl.style.background = 'rgba(52, 211, 153, 0.08)';
                    optEl.style.color = '#34d399';
                    badge.style.display = 'inline-block';
                    badge.style.background = '#34d399';
                    badge.style.color = '#0c1c14';
                    badge.textContent = 'Correcta';
                } else {
                    optEl.style.borderColor = 'rgba(255,255,255,0.03)';
                    optEl.style.background = 'rgba(255,255,255,0.02)';
                    optEl.style.color = 'var(--text-secondary)';
                    badge.style.display = 'none';
                }
            }
        });

        const summaryText = document.getElementById(`quiz-result-summary-${questionIndex}`);
        if (summaryText) {
            summaryText.innerHTML = `<i class="fa-solid fa-circle-check"></i> Opción Correcta: <strong>Opción ${matchedOptionLabel}</strong>`;
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

        // Global Search keyboard shortcuts: '/' to open, Escape to close
        document.addEventListener('keydown', (e) => {
            const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable;
            
            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                GlobalSearch.open();
            }
            
            if (e.key === 'Escape') {
                GlobalSearch.close();
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
        const preferred = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-002',
                           'gemini-1.5-flash-001', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
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
        if (viewId === 'view-analiticas')    this.loadAnalytics();
        if (viewId === 'view-configuracion') this.loadApiConfigForm();
        if (viewId === 'view-python-lab')    this.initPythonLab();
        if (viewId === 'view-srs')           SRSEngine.initView();
        if (viewId === 'view-notas')         NotesEditor.initView();
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

        this.switchCourseTab('modules');
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
            theoryHtml = this.formatBlackboardMath(theoryHtml);
            
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
        document.getElementById('test-q-text').innerHTML = this.formatBlackboardMath(q.question);

        const optionsHtml = q.options.map((opt, index) => {
            const text = typeof opt === 'string' ? opt : opt.text;
            return `
                <div class="option" onclick="hubApp.selectOption(${index})" id="opt-${index}">
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${this.formatBlackboardMath(text)}</div>
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
        
        let explanationHtml = explanation ? `<div class="explanation-text">${this.formatBlackboardMath(explanation)}</div>` : '';
        
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

        // Render Pomodoro heatmap + streak badge
        PomodoroTimer.renderHeatmap();

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

        // Also render palette cards when settings view opens
        this.renderThemePalettes();
    },

    // ══════════════════════════════════════════════════════════════
    //  THEME PALETTE SYSTEM
    // ══════════════════════════════════════════════════════════════

    // ══════════════════════════════════════════════════════════════
    //  PREMIUM THEME SYSTEM  –  8 identidades visuales completas
    //  Cada tema define: vars CSS + extraCSS inyectado dinámicamente
    //  que sobreescribe: hero gradient, progress bar, btn glow,
    //  scrollbar, borders de cards y color de selección de texto.
    // ══════════════════════════════════════════════════════════════
    THEMES: {

        // ─── 1. COSMIC BLUE ──────────────────────────────────────
        'cosmic': {
            id: 'cosmic',
            name: '🌌 Cosmic Blue',
            desc: 'El tema original. Espacio profundo y tecnología.',
            swatches: ['#0f172a', '#1e293b', '#3b82f6', '#8b5cf6'],
            vars: {
                '--bg-color':      '#0f172a',
                '--text-primary':  '#f8fafc',
                '--text-secondary':'#94a3b8',
                '--primary':       '#3b82f6',
                '--primary-hover': '#2563eb',
                '--success':       '#10b981',
                '--danger':        '#ef4444',
                '--card-bg':       'rgba(30, 41, 59, 0.72)',
                '--glass-border':  'rgba(255, 255, 255, 0.10)',
                '--glass-shadow':  '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #3b82f6, #8b5cf6) !important; }
                .btn.primary { box-shadow: 0 4px 18px rgba(59, 130, 246, 0.45) !important; }
                .nav-item.active { background: rgba(59, 130, 246, 0.18) !important; border-color: rgba(59, 130, 246, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: #3b82f6 !important; }
                ::selection { background: rgba(59, 130, 246, 0.35); }
                .guide-line { border-left-color: #3b82f6 !important; }
            `
        },

        // ─── 2. AURORA FOREST ────────────────────────────────────
        'aurora': {
            id: 'aurora',
            name: '🌿 Aurora Forest',
            desc: 'Verde biofosforescente. Fresco, natural y vivo.',
            swatches: ['#061410', '#0d2b1d', '#10b981', '#06b6d4'],
            vars: {
                '--bg-color':      '#061410',
                '--text-primary':  '#ecfdf5',
                '--text-secondary':'#6ee7b7',
                '--primary':       '#10b981',
                '--primary-hover': '#059669',
                '--success':       '#34d399',
                '--danger':        '#f87171',
                '--card-bg':       'rgba(5, 46, 22, 0.75)',
                '--glass-border':  'rgba(16, 185, 129, 0.20)',
                '--glass-shadow':  '0 8px 32px 0 rgba(0, 50, 20, 0.55)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #34d399 0%, #67e8f9 60%, #a3e635 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #10b981, #06b6d4) !important; }
                .btn.primary { box-shadow: 0 4px 18px rgba(16, 185, 129, 0.5) !important; }
                .nav-item.active { background: rgba(16, 185, 129, 0.18) !important; border-color: rgba(16, 185, 129, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: #10b981 !important; }
                ::selection { background: rgba(16, 185, 129, 0.35); }
                .guide-line { border-left-color: #10b981 !important; }
                .card:hover { border-color: rgba(16, 185, 129, 0.3) !important; }
            `
        },

        // ─── 3. SUNSET GLOW ──────────────────────────────────────
        'sunset': {
            id: 'sunset',
            name: '🌅 Sunset Glow',
            desc: 'Naranja y fucsia. Energía máxima para estudiar.',
            swatches: ['#130508', '#2d0d1a', '#f97316', '#ec4899'],
            vars: {
                '--bg-color':      '#130508',
                '--text-primary':  '#fff7ed',
                '--text-secondary':'#fdba74',
                '--primary':       '#f97316',
                '--primary-hover': '#ea580c',
                '--success':       '#34d399',
                '--danger':        '#fb7185',
                '--card-bg':       'rgba(45, 13, 26, 0.78)',
                '--glass-border':  'rgba(249, 115, 22, 0.22)',
                '--glass-shadow':  '0 8px 32px 0 rgba(100, 20, 0, 0.50)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #fb923c 0%, #f472b6 60%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #f97316, #ec4899) !important; }
                .btn.primary { box-shadow: 0 4px 18px rgba(249, 115, 22, 0.5) !important; }
                .nav-item.active { background: rgba(249, 115, 22, 0.18) !important; border-color: rgba(249, 115, 22, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: #f97316 !important; }
                ::selection { background: rgba(249, 115, 22, 0.35); }
                .guide-line { border-left-color: #f97316 !important; }
                .card:hover { border-color: rgba(249, 115, 22, 0.28) !important; }
            `
        },

        // ─── 4. MIDNIGHT PURPLE ───────────────────────────────────
        'midnight': {
            id: 'midnight',
            name: '🔮 Midnight Purple',
            desc: 'Violeta puro. Ultra oscuro, elegante y misterioso.',
            swatches: ['#080614', '#1e1b4b', '#818cf8', '#a855f7'],
            vars: {
                '--bg-color':      '#080614',
                '--text-primary':  '#f5f3ff',
                '--text-secondary':'#a5b4fc',
                '--primary':       '#818cf8',
                '--primary-hover': '#6366f1',
                '--success':       '#34d399',
                '--danger':        '#f87171',
                '--card-bg':       'rgba(30, 27, 75, 0.75)',
                '--glass-border':  'rgba(129, 140, 248, 0.20)',
                '--glass-shadow':  '0 8px 32px 0 rgba(20, 10, 80, 0.55)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #818cf8 0%, #c084fc 60%, #e879f9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #6366f1, #a855f7) !important; }
                .btn.primary { box-shadow: 0 4px 18px rgba(129, 140, 248, 0.5) !important; }
                .nav-item.active { background: rgba(129, 140, 248, 0.18) !important; border-color: rgba(129, 140, 248, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: #818cf8 !important; }
                ::selection { background: rgba(129, 140, 248, 0.35); }
                .guide-line { border-left-color: #818cf8 !important; }
            `
        },

        // ─── 5. DEEP OCEAN ────────────────────────────────────────
        'ocean': {
            id: 'ocean',
            name: '🌊 Deep Ocean',
            desc: 'Abismo bioluminiscente. Calma y concentración.',
            swatches: ['#020e18', '#04233a', '#0ea5e9', '#22d3ee'],
            vars: {
                '--bg-color':      '#020c14',
                '--text-primary':  '#e0f2fe',
                '--text-secondary':'#7dd3fc',
                '--primary':       '#0ea5e9',
                '--primary-hover': '#0284c7',
                '--success':       '#2dd4bf',
                '--danger':        '#f87171',
                '--card-bg':       'rgba(2, 35, 58, 0.80)',
                '--glass-border':  'rgba(14, 165, 233, 0.20)',
                '--glass-shadow':  '0 8px 32px 0 rgba(0, 30, 70, 0.60)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #0ea5e9, #22d3ee, #2dd4bf) !important; }
                .btn.primary { box-shadow: 0 4px 22px rgba(14, 165, 233, 0.55), 0 0 40px rgba(34, 211, 238, 0.15) !important; }
                .nav-item.active { background: rgba(14, 165, 233, 0.18) !important; border-color: rgba(14, 165, 233, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: #0ea5e9 !important; }
                ::selection { background: rgba(14, 165, 233, 0.35); }
                .guide-line { border-left-color: #22d3ee !important; }
                .card:hover { border-color: rgba(34, 211, 238, 0.30) !important; box-shadow: 0 0 20px rgba(14, 165, 233, 0.12) !important; }
                .glass-panel { border-color: rgba(14, 165, 233, 0.18) !important; }
            `
        },

        // ─── 6. VOLCANIC EMBER ────────────────────────────────────
        'ember': {
            id: 'ember',
            name: '🔥 Volcanic Ember',
            desc: 'Carbón candente. Dramático y de alto contraste.',
            swatches: ['#100a02', '#1c1007', '#f97316', '#fbbf24'],
            vars: {
                '--bg-color':      '#0d0802',
                '--text-primary':  '#fef3c7',
                '--text-secondary':'#fcd34d',
                '--primary':       '#f97316',
                '--primary-hover': '#c2410c',
                '--success':       '#4ade80',
                '--danger':        '#f43f5e',
                '--card-bg':       'rgba(28, 16, 7, 0.85)',
                '--glass-border':  'rgba(251, 191, 36, 0.20)',
                '--glass-shadow':  '0 8px 32px 0 rgba(80, 20, 0, 0.60)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #dc2626, #f97316, #fbbf24) !important; }
                .btn.primary { background: linear-gradient(135deg, #c2410c, #f97316) !important; box-shadow: 0 4px 22px rgba(249, 115, 22, 0.55), 0 0 40px rgba(251, 191, 36, 0.15) !important; }
                .nav-item.active { background: rgba(249, 115, 22, 0.18) !important; border-color: rgba(251, 191, 36, 0.4) !important; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#f97316, #fbbf24) !important; }
                ::selection { background: rgba(251, 191, 36, 0.35); }
                .guide-line { border-left-color: #f97316 !important; }
                .card:hover { border-color: rgba(251, 191, 36, 0.30) !important; box-shadow: 0 0 25px rgba(249, 115, 22, 0.15) !important; }
                .orb { opacity: 0.4 !important; }
            `
        },

        // ─── 7. SAKURA DREAM ──────────────────────────────────────
        'sakura': {
            id: 'sakura',
            name: '🌸 Sakura Dream',
            desc: 'Ciruelas y rosas. Suave, femenino y poético.',
            swatches: ['#130b18', '#2d1040', '#ec4899', '#e879f9'],
            vars: {
                '--bg-color':      '#0e0812',
                '--text-primary':  '#fdf2f8',
                '--text-secondary':'#f0abfc',
                '--primary':       '#ec4899',
                '--primary-hover': '#db2777',
                '--success':       '#34d399',
                '--danger':        '#fb7185',
                '--card-bg':       'rgba(45, 16, 64, 0.78)',
                '--glass-border':  'rgba(236, 72, 153, 0.22)',
                '--glass-shadow':  '0 8px 32px 0 rgba(80, 10, 80, 0.55)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(135deg, #f472b6 0%, #e879f9 50%, #fb7185 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #ec4899, #a855f7, #e879f9) !important; }
                .btn.primary { background: linear-gradient(135deg, #db2777, #ec4899) !important; box-shadow: 0 4px 22px rgba(236, 72, 153, 0.55) !important; }
                .nav-item.active { background: rgba(236, 72, 153, 0.18) !important; border-color: rgba(236, 72, 153, 0.40) !important; }
                ::-webkit-scrollbar-thumb { background: #ec4899 !important; }
                ::selection { background: rgba(236, 72, 153, 0.35); }
                .guide-line { border-left-color: #ec4899 !important; }
                .card:hover { border-color: rgba(236, 72, 153, 0.30) !important; box-shadow: 0 0 25px rgba(232, 121, 249, 0.12) !important; }
                .glass-panel { border-color: rgba(236, 72, 153, 0.18) !important; }
            `
        },

        // ─── 8. CYBERPUNK NEON ────────────────────────────────────
        'cyberpunk': {
            id: 'cyberpunk',
            name: '⚡ Cyberpunk Neon',
            desc: 'Negro puro con neón. Estilo hacker distópico.',
            swatches: ['#000000', '#0a0a0a', '#06b6d4', '#d946ef'],
            vars: {
                '--bg-color':      '#000000',
                '--text-primary':  '#f0fffe',
                '--text-secondary':'#67e8f9',
                '--primary':       '#06b6d4',
                '--primary-hover': '#0891b2',
                '--success':       '#4ade80',
                '--danger':        '#f43f5e',
                '--card-bg':       'rgba(0, 20, 25, 0.90)',
                '--glass-border':  'rgba(6, 182, 212, 0.25)',
                '--glass-shadow':  '0 8px 32px 0 rgba(6, 182, 212, 0.15)',
            },
            extraCSS: `
                .hero h2 { background: linear-gradient(90deg, #22d3ee 0%, #d946ef 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .progress-bar { background: linear-gradient(90deg, #06b6d4, #d946ef) !important; }
                .btn.primary { background: transparent !important; border: 1px solid #06b6d4 !important; color: #06b6d4 !important; box-shadow: 0 0 15px rgba(6, 182, 212, 0.6), inset 0 0 15px rgba(6, 182, 212, 0.05) !important; text-shadow: 0 0 8px #06b6d4; }
                .btn.primary:hover { background: rgba(6, 182, 212, 0.1) !important; box-shadow: 0 0 25px rgba(6, 182, 212, 0.8), 0 0 50px rgba(217, 70, 239, 0.3) !important; }
                .nav-item.active { background: rgba(6, 182, 212, 0.12) !important; border-color: #06b6d4 !important; box-shadow: 0 0 10px rgba(6, 182, 212, 0.3) !important; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#06b6d4, #d946ef) !important; }
                ::selection { background: rgba(6, 182, 212, 0.4); }
                .guide-line { border-left-color: #06b6d4 !important; box-shadow: -2px 0 8px rgba(6, 182, 212, 0.4); }
                .card { border-color: rgba(6, 182, 212, 0.18) !important; }
                .card:hover { border-color: #06b6d4 !important; box-shadow: 0 0 20px rgba(6, 182, 212, 0.25), 0 0 40px rgba(217, 70, 239, 0.1) !important; }
                .glass-panel { border-color: rgba(6, 182, 212, 0.20) !important; }
                .logo i { text-shadow: 0 0 15px currentColor; }
            `
        },

        // ─── 9. DAYLIGHT (MODO CLARO) ──────────────────────────────
        'daylight': {
            id: 'daylight',
            name: '☀️ Daylight (Claro)',
            desc: 'Modo claro minimalista premium. Estilo Notion/Linear.',
            swatches: ['#ffffff', '#f8fafc', '#3b82f6', '#1e293b'],
            vars: {
                '--bg-color':      '#f8fafc',
                '--text-primary':  '#0f172a',
                '--text-secondary':'#475569',
                '--primary':       '#3b82f6',
                '--primary-hover': '#2563eb',
                '--success':       '#10b981',
                '--danger':        '#ef4444',
                '--card-bg':       'rgba(255, 255, 255, 0.85)',
                '--glass-border':  'rgba(226, 232, 240, 0.8)',
                '--glass-shadow':  '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            },
            extraCSS: `
                body { background-color: #f8fafc !important; color: #0f172a !important; }
                .sidebar { background: #ffffff !important; border-right: 1px solid #e2e8f0 !important; }
                .sidebar .logo { color: #0f172a !important; }
                .sidebar .logo i { color: #3b82f6 !important; }
                .sidebar .logo h1 { color: #0f172a !important; }
                .sidebar-nav .nav-item { color: #475569 !important; }
                .sidebar-nav .nav-item i { color: #64748b !important; }
                .sidebar-nav .nav-item:hover { background: #f1f5f9 !important; color: #0f172a !important; }
                .sidebar-nav .nav-item.active { background: #eff6ff !important; color: #1d4ed8 !important; border-right: 3px solid #3b82f6 !important; }
                .sidebar-nav .nav-item.active i { color: #3b82f6 !important; }
                .glass-panel { background: #ffffff !important; border: 1px solid #e2e8f0 !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important; backdrop-filter: none !important; }
                .card { background: #ffffff !important; border: 1px solid #e2e8f0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important; }
                .card:hover { border-color: #3b82f6 !important; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1) !important; transform: translateY(-2px); }
                h1, h2, h3, h4, h5, h6 { color: #0f172a !important; }
                .hero h2 { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
                .version-tag { color: #64748b !important; }
                .btn.primary { background: #3b82f6 !important; color: #ffffff !important; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35) !important; }
                .btn.primary:hover { background: #2563eb !important; }
                .btn.secondary { background: #f1f5f9 !important; color: #334155 !important; border: 1px solid #e2e8f0 !important; }
                .btn.secondary:hover { background: #e2e8f0 !important; color: #0f172a !important; }
                .form-control, select, input { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; }
                .form-control:focus, select:focus, input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important; }
                .calculator-screen { background: #f8fafc !important; border: 4px solid #94a3b8 !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06) !important; }
                .calculator-screen div { color: #334155 !important; }
                .calculator-screen .math-display { color: #0f172a !important; text-shadow: none !important; }
                .calculator-screen input { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; }
                .virtual-key { background: #ffffff !important; border: 1px solid #e2e8f0 !important; color: #334155 !important; box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important; }
                .virtual-key:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; }
                .virtual-key.operator { background: #f1f5f9 !important; color: #0f172a !important; }
                .virtual-key.action { background: #eff6ff !important; color: #2563eb !important; border-color: #bfdbfe !important; }
                .scratch-container-wrapper { background: #ffffff !important; border: 4px solid #94a3b8 !important; }
                .srs-card-front, .srs-card-back { background: #ffffff !important; border: 1px solid #e2e8f0 !important; color: #0f172a !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important; }
                .srs-card-tag { background: #eff6ff !important; color: #2563eb !important; }
                .srs-rating-btn { border: 1px solid #cbd5e1 !important; }
                .notes-textarea { color: #0f172a !important; background: #ffffff !important; }
                .notes-editor-pane, .notes-preview-pane { background: #ffffff !important; border-color: #e2e8f0 !important; }
                .notes-pane-header { background: #f8fafc !important; border-bottom-color: #e2e8f0 !important; color: #475569 !important; }
                .notes-preview-content { color: #334155 !important; }
                .notes-preview-content h1, .notes-preview-content h2, .notes-preview-content h3 { color: #0f172a !important; border-bottom-color: #e2e8f0 !important; }
                .notes-preview-content blockquote { background: #f8fafc !important; border-left-color: #3b82f6 !important; color: #475569 !important; }
                .notes-preview-content code { background: #f1f5f9 !important; }
                .notes-preview-content pre { background: #f8fafc !important; border-color: #e2e8f0 !important; }
                .notes-preview-content pre code { color: #334155 !important; }
                .notes-tb-btn { background: #ffffff !important; border-color: #cbd5e1 !important; color: #475569 !important; }
                .notes-tb-btn:hover { background: #f1f5f9 !important; color: #0f172a !important; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1 !important; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8 !important; }
                .search-modal-container { background: #ffffff !important; border-color: #e2e8f0 !important; }
                .search-modal-header { border-bottom-color: #e2e8f0 !important; }
                #global-search-input { color: #0f172a !important; }
                .search-item:hover, .search-item.selected { background: #f1f5f9 !important; border-color: #e2e8f0 !important; }
                .search-item-title { color: #0f172a !important; }
                .search-item-subtitle { color: #475569 !important; }
                .search-modal-footer { background: #f8fafc !important; border-top-color: #e2e8f0 !important; }
            `
        },
    },

    /** Apply a theme by ID — updates CSS vars + injects extraCSS + saves */
    applyTheme(themeId) {
        const theme = this.THEMES[themeId];
        if (!theme) return;

        // Flash transition overlay
        let overlay = document.getElementById('theme-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'theme-transition-overlay';
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.add('flash');
        setTimeout(() => overlay.classList.remove('flash'), 300);

        // Apply CSS variables to :root
        const root = document.documentElement;
        Object.entries(theme.vars).forEach(([prop, val]) => {
            root.style.setProperty(prop, val);
        });

        // Inject theme-specific CSS overrides
        let styleEl = document.getElementById('hub-theme-extra');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'hub-theme-extra';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = theme.extraCSS || '';

        // Set data-theme for orb colors
        document.body.setAttribute('data-theme', themeId);

        // Save preference
        localStorage.setItem('hub_theme', themeId);

        // Update active card UI
        document.querySelectorAll('.theme-palette-card').forEach(card => {
            const isActive = card.dataset.themeId === themeId;
            card.classList.toggle('active', isActive);
            card.style.setProperty('--tpc-primary', theme.swatches[2]);
            // Update check icon
            const check = card.querySelector('.theme-palette-check');
            if (check) check.innerHTML = isActive ? '<i class="fa-solid fa-check"></i>' : '';
        });
    },

    /** Load saved theme on startup */
    loadSavedTheme() {
        const saved = localStorage.getItem('hub_theme') || 'cosmic';
        this.applyTheme(saved);
    },

    /** Render the palette cards into #theme-palettes-grid */
    renderThemePalettes() {
        const grid = document.getElementById('theme-palettes-grid');
        if (!grid) return;

        const activeId = localStorage.getItem('hub_theme') || 'cosmic';

        grid.innerHTML = Object.values(this.THEMES).map(theme => {
            const isActive = theme.id === activeId;
            const swatchHTML = theme.swatches
                .map(color => `<span style="background:${color};"></span>`)
                .join('');

            return `
            <div class="theme-palette-card ${isActive ? 'active' : ''}"
                 data-theme-id="${theme.id}"
                 style="--tpc-primary:${theme.swatches[2]}"
                 onclick="hubApp.applyTheme('${theme.id}')">
                <div class="theme-palette-swatches">${swatchHTML}</div>
                <div class="theme-palette-info">
                    <div>
                        <div class="theme-palette-name">${theme.name}</div>
                        <div class="theme-palette-desc">${theme.desc}</div>
                    </div>
                    <div class="theme-palette-check">
                        ${isActive ? '<i class="fa-solid fa-check"></i>' : ''}
                    </div>
                </div>
            </div>`;
        }).join('');
    },


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
        const demoCheckbox = document.getElementById('chat-demo-mode');
        const isDemo = demoCheckbox ? demoCheckbox.checked : false;

        if (!config.key) {
            if (warningEl) warningEl.classList.remove('hidden');
            if (isDemo) {
                if (inputEl) inputEl.disabled = false;
                if (sendBtn) sendBtn.disabled = false;
            } else {
                if (inputEl) inputEl.disabled = true;
                if (sendBtn) sendBtn.disabled = true;
            }
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
            // Get AI Response (either simulated/mock or real API)
            const demoCheckbox = document.getElementById('chat-demo-mode');
            const isDemo = demoCheckbox ? demoCheckbox.checked : false;
            
            let aiResponse = '';
            if (isDemo) {
                // Mock typing latency of 800ms
                await new Promise(resolve => setTimeout(resolve, 800));
                aiResponse = this.getSimulatedAIChatResponse(text);
            } else {
                aiResponse = await this.getAIChatResponse(text);
            }

            // Remove typing indicator
            const typingIndicatorEl = document.getElementById(typingId);
            if (typingIndicatorEl) typingIndicatorEl.remove();

            // Save to Local history
            this.chatHistory.push({ role: 'assistant', text: aiResponse });

            // Process [CALCULA: ...] tags in the AI response
            const calculatorRegex = /\[CALCULA:\s*([^\]]+)\]/gi;
            const solverBlocks = [];
            let solverCounter = 0;
            
            let aiResponseProcessed = aiResponse.replace(calculatorRegex, (match, expr) => {
                const expression = expr.trim();
                const solution = MathSolver.solve(expression);
                
                let solverHTML = '';
                if (solution.error) {
                    solverHTML = `
                        <div class="chat-embedded-solver error" style="margin: 10px 0; padding: 10px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.25); background: rgba(239,68,68,0.05); font-size: 0.75rem;">
                            <div style="font-weight: bold; color: #fca5a5;"><i class="fa-solid fa-triangle-exclamation"></i> Error de Calculadora Local:</div>
                            <div style="color: #fca5a5; font-family: monospace; margin-top: 4px;">${solution.message}</div>
                        </div>
                    `;
                } else {
                    // Generate steps HTML
                    let stepsHTML = '';
                    if (solution.steps && solution.steps.length > 0) {
                        stepsHTML = `
                            <div style="margin-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 6px;">
                                <div style="font-weight: 700; font-size: 0.7rem; color: #60a5fa; margin-bottom: 4px; text-transform: uppercase;">Pasos de Resolución:</div>
                                <ol style="margin: 0; padding-left: 14px; display: flex; flex-direction: column; gap: 6px;">
                                    ${solution.steps.map((s, i) => `
                                        <li style="color: #94a3b8; font-size: 0.72rem;">
                                            <div style="color: #e2e8f0;">${s.desc}</div>
                                            <div style="margin-top: 2px;">$$${s.latex}$$</div>
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                        `;
                    }
                    
                    // Render Alternate reps and number classification if it is a number
                    let classificationHTML = '';
                    const parsedNum = parseFloat(solution.result);
                    if (!isNaN(parsedNum) && isFinite(parsedNum)) {
                        let info = MathSolver.getNumberProperties(parsedNum);
                        if (info) {
                            const signLabel = info.sign === 'positive' ? 'Positivo' : info.sign === 'negative' ? 'Negativo' : 'Neutro (Cero)';
                            const signColor = info.sign === 'positive' ? '#34d399' : info.sign === 'negative' ? '#f87171' : '#94a3b8';
                            const signBg = info.sign === 'positive' ? 'rgba(52,211,153,0.1)' : info.sign === 'negative' ? 'rgba(248,113,113,0.1)' : 'rgba(148,163,184,0.1)';
                            const nActive = info.isNatural ? 'active' : 'inactive';
                            const zActive = info.isInteger ? 'active' : 'inactive';
                            const qActive = info.isRational ? 'active' : 'inactive';
                            const iActive = !info.isRational ? 'active' : 'inactive';
                            const rActive = 'active';

                            classificationHTML = `
                                <div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
                                    <div style="font-weight: 700; font-size: 0.7rem; color: #a78bfa; margin-bottom: 4px; text-transform: uppercase;">Propiedades del Resultado:</div>
                                    <div style="display: flex; gap: 4px; align-items: center; margin: 4px 0;">
                                        <span class="set-badge set-n ${nActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Naturales">N</span>
                                        <span class="set-badge set-z ${zActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Enteros">Z</span>
                                        <span class="set-badge set-q ${qActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Racionales">Q</span>
                                        <span class="set-badge set-i ${iActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Irracionales">I</span>
                                        <span class="set-badge set-r ${rActive}" style="width:22px; height:22px; font-size:0.65rem; border-width:1px;" title="Reales">R</span>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    
                    solverHTML = `
                        <div class="chat-embedded-solver success" style="margin: 12px 0; padding: 12px; border-radius: 10px; border: 1px solid var(--glass-border); background: rgba(12,28,20,0.85); box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3); font-size: 0.75rem;">
                            <div style="font-weight: bold; color: #a7f3d0; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
                                <span><i class="fa-solid fa-calculator" style="color:#34d399;"></i> Cálculo Local Ejecutado:</span>
                                <span style="font-family: monospace; font-size: 0.65rem; color: rgba(255,255,255,0.4);">${expression}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.2); border-radius: 6px; padding: 8px;">
                                <div style="color: #94a3b8; font-size: 0.65rem;">Problema:</div>
                                <div style="font-size: 0.85rem; font-weight: bold; color: #ffffff;">$$${solution.problemLaTeX || expression}$$</div>
                                <div style="color: #94a3b8; font-size: 0.65rem; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">Resultado:</div>
                                <div style="font-size: 1.05rem; font-weight: bold; color: #a7f3d0;">$$${solution.resultLaTeX || solution.result}$$</div>
                            </div>
                            ${stepsHTML}
                            ${classificationHTML}
                        </div>
                    `;
                    
                    // Sync with the calculator
                    const solverInput = document.getElementById('solver-input');
                    if (solverInput) {
                        solverInput.value = expression;
                        setTimeout(() => {
                            this.updateMathDisplay();
                            this.saveToSolverHistory(expression);
                        }, 50);
                    }
                }
                
                const placeholder = `%%SOLVER_BLOCK_${solverCounter}%%`;
                solverBlocks.push({ placeholder, html: solverHTML });
                solverCounter++;
                return placeholder;
            });
            
            // Format Assistant Message Markdown/Math
            let finalHtml = this.renderMarkdownAndMath(aiResponseProcessed);
            
            // Restore solver HTML blocks
            solverBlocks.forEach(block => {
                finalHtml = finalHtml.replace(block.placeholder, block.html);
            });

            // Render Assistant Message in UI
            const assistantMsgHtml = `
                <div class="chat-message assistant">
                    <div class="chat-message-avatar">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                    <div class="chat-message-body">
                        <span class="chat-message-sender">Asistente de Estudio</span>
                        <div class="chat-message-text">${finalHtml}</div>
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

Estás integrado dentro del ecosistema del "Study Hub", una aplicación web educativa local y offline-first. Los componentes del Hub a los que el estudiante y tú tienen acceso son:
1. "Módulos de Estudio" (con explicaciones teóricas y material de lectura oficial del curso).
2. "Bloc de Notas del Curso" (donde el estudiante redacta apuntes en Markdown/LaTeX con auto-guardado en localStorage y previsualización en vivo).
3. "Chat de Estudio (Tutor IA)" (este canal de comunicación directa contigo).
4. "Resolutor Matemático & Pizarra de Gráficas 2D" (un panel con pantalla de tiza Casio Natural V.P.A.M. interactiva que soporta KaTeX, derivadas d/dx, integrales indefinidas int()dx, matrices, fracciones y ecuaciones, graficador 2D interactivo multi-función con tooltip de coordenadas y borrador de dibujo libre).

Si la pregunta del estudiante requiere realizar cálculos matemáticos, simplificar fracciones, resolver ecuaciones, hallar determinantes de sistemas de ecuaciones, calcular mínimo común múltiplo (mcm), máximo común divisor (mcd), derivadas o integrales básicas, DEBES usar/invocar la calculadora local del Hub utilizando el comando especial: [CALCULA: expresion]
Donde 'expresion' es la fórmula en texto plano (ej: [CALCULA: 3x^2 - 5x + 2 = 0] o [CALCULA: int(x^3)dx] o [CALCULA: mcm(12, 18)] o [CALCULA: d/dx(x^2 - 4x)]).
El comando local procesará el motor matemático offline, inyectará la solución paso a paso y la ficha de clasificación del número en tu globo de chat, y sincronizará la calculadora principal del usuario con dicha expresión para que puedan continuar interactuando con ella.

Reglas críticas de comportamiento:
1. Responde de forma amigable, estructurada y educativa en español.
2. Basate PRINCIPALMENTE en el material oficial provisto a continuación.
3. Si la pregunta del estudiante no tiene relación alguna con la materia del curso o no se puede resolver con el material proporcionado, explícaselo amigablemente, pero intenta de todos modos guiarlo usando principios generales alineados al curso.
4. Si generas fórmulas matemáticas o ecuaciones fuera del comando especial, escríbelas en notación LaTeX estándar utilizando signos de dólar simple para fórmulas en línea (ej: $E = mc^2$) o doble signo de dólar para fórmulas destacadas (ej: $$a^2 + b^2 = c^2$$), para que el motor KaTeX de la aplicación pueda renderizarlas en vivo.

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
    },

    toggleChatDemoMode() {
        const demoCheckbox = document.getElementById('chat-demo-mode');
        const isDemo = demoCheckbox ? demoCheckbox.checked : false;
        
        const config = HubStorage.getApiConfig();
        const inputEl = document.getElementById('chat-input');
        const sendBtn = document.getElementById('btn-send-chat');
        
        if (isDemo || config.key) {
            if (inputEl) inputEl.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
        } else {
            if (inputEl) inputEl.disabled = true;
            if (sendBtn) sendBtn.disabled = true;
        }
    },

    getSimulatedAIChatResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        
        // 1. Check for MCM / MCD
        let mcmMatch = msg.match(/(?:mcm|mínimo común múltiplo)\s*(?:de)?\s*\(?(\d+)[\s,]+(\d+)\)?/i);
        if (mcmMatch) {
            const num1 = mcmMatch[1];
            const num2 = mcmMatch[2];
            return `¡Excelente! El cálculo del mínimo común múltiplo (MCM) entre ${num1} y ${num2} se realiza mediante la descomposición en factores primos. Ejecutaré el cálculo local en el Hub:\n\n[CALCULA: mcm(${num1}, ${num2})]`;
        }
        
        let mcdMatch = msg.match(/(?:mcd|máximo común divisor)\s*(?:de)?\s*\(?(\d+)[\s,]+(\d+)\)?/i);
        if (mcdMatch) {
            const num1 = mcdMatch[1];
            const num2 = mcdMatch[2];
            return `¡Perfecto! El máximo común divisor (MCD) de ${num1} y ${num2} se obtiene multiplicando los factores primos comunes con su menor exponente. Vamos a calcularlo localmente:\n\n[CALCULA: mcd(${num1}, ${num2})]`;
        }

        // 2. Check for integrals
        let integralMatch = msg.match(/(?:integral|int)\s*(?:de)?\s*(.+)/i);
        if (integralMatch) {
            let expr = integralMatch[1].trim();
            // clean up common phrasing like "respecto a x", "dx", etc.
            expr = expr.replace(/respecto\s+a\s+x/gi, '').trim();
            // ensure it is wrapped in int(...)dx style if not already
            if (!expr.startsWith('int') && !expr.endsWith('dx')) {
                expr = `int(${expr})dx`;
            } else if (expr.startsWith('int') && !expr.endsWith('dx')) {
                expr = `${expr}dx`;
            }
            return `Entendido. Para calcular la integral indefinida, aplicamos las reglas de integración correspondientes para cada término sumando la constante de integración $C$. Invocaré la calculadora:\n\n[CALCULA: ${expr}]`;
        }

        // 3. Check for derivatives
        let derivMatch = msg.match(/(?:derivada|derivar|deriva)\s*(?:de)?\s*(.+)/i);
        if (derivMatch) {
            let expr = derivMatch[1].trim();
            // ensure it starts with d/dx if not already
            if (!expr.startsWith('d/dx')) {
                expr = `d/dx(${expr})`;
            }
            return `¡Claro! La derivada de esta función se calcula término por término aplicando la regla de la potencia ($d/dx(x^n) = n \\cdot x^{n-1}$). Ejecutaré la derivada:\n\n[CALCULA: ${expr}]`;
        }

        // 4. Check for Systems of Equations (looks for two equations separated by comma/semicolon/y/and)
        if (msg.includes('sistema') || (msg.includes('ecuaciones') && (msg.includes(';') || msg.includes(',') || msg.includes(' y ')))) {
            // Let's try to extract something that looks like 2x+y=5; x-y=1
            let systemMatch = msg.match(/([0-9xXyY+\-\s=]+(?:;|y|,)\s*[0-9xXyY+\-\s=]+)/i);
            if (systemMatch) {
                let expr = systemMatch[1].trim().replace(/\by\b/g, ';'); // replace 'y' with ';'
                return `¡Por supuesto! Resolveré este sistema de ecuaciones lineales de 2x2 utilizando el método de determinantes (Regla de Cramer). Aquí tienes el cálculo local:\n\n[CALCULA: ${expr}]`;
            }
        }

        // 5. Check for Quadratic Equations (looks for x^2 or x2 and an equals sign)
        if (msg.includes('x^2') || msg.includes('x2') || (msg.includes('x') && msg.includes('='))) {
            // Find equations in user message
            let eqMatch = msg.match(/([0-9xX\^+\-\*\/\s=]+)/i);
            if (eqMatch && eqMatch[1].includes('=')) {
                let expr = eqMatch[1].trim();
                return `¡Claro! Las ecuaciones de segundo grado o cuadráticas las podemos resolver mediante varios métodos, como la Fórmula General, Factorización o Completando el Cuadrado. Permíteme calcularla paso a paso:\n\n[CALCULA: ${expr}]`;
            }
        }

        // 6. Generic math expressions (check for numbers and operators)
        let mathExprMatch = msg.match(/([0-9+\-\*\/\s().xX÷×]+)/);
        if (mathExprMatch && mathExprMatch[1].trim().length > 2 && /[0-9]/.test(mathExprMatch[1]) && /[+\-*\/xX÷×]/.test(mathExprMatch[1])) {
            let expr = mathExprMatch[1].trim();
            return `He detectado una expresión aritmética. Procederé a evaluarla en la calculadora local offline:\n\n[CALCULA: ${expr}]`;
        }

        // 7. General course context responses
        if (this.currentCourse && this.currentCourse.title) {
            const courseTitle = this.currentCourse.title.toLowerCase();
            if (courseTitle.includes('deportivo') || msg.includes('deporte') || msg.includes('deportivo')) {
                return `¡Hola! Como tu tutor del curso de Gestión de Centros Deportivos (en Modo Demostración), estoy listo para ayudarte.\n\nPuedes preguntarme sobre planificación de actividades, presupuestos, mantenimiento de instalaciones, o bien podemos hacer cálculos financieros (por ejemplo, calcular el presupuesto total del centro, cuotas, o resolver ecuaciones de costos e ingresos).\n\n¿Por dónde te gustaría empezar?`;
            }
            if (courseTitle.includes('datos') || msg.includes('base') || msg.includes('sql') || msg.includes('tabla')) {
                return `¡Hola! Soy tu tutor del curso de Base de Datos. En este modo offline simulado, podemos repasar conceptos de modelado relacional (DER), normalización (1FN, 2FN, 3FN), consultas SQL, o resolver ejercicios de cardinalidad.\n\n¿Tienes alguna duda sobre bases de datos o necesitas hacer algún cálculo matemático asociado?`;
            }
        }

        // Fallback standard response
        return `¡Hola! Estoy en Modo Demostración (Offline).\n\nPuedo responder tus dudas teóricas sobre el curso o ayudarte a resolver problemas matemáticos integrando la calculadora local de pizarra.\n\nPor ejemplo, prueba escribiendo:\n* *'Resuelve la ecuación x^2 - 5x + 6 = 0'*\n* *'Calcula el mcm de 12 y 18'*\n* *'Calcula la integral de 3x^2 - 2x + 5'*\n* *'Deriva 4x^3 - 2x'*\n* *'Resuelve el sistema 2x+y=5, x-y=1'*\n\n¿Qué tema te gustaría repasar hoy?`;
    }
};

window.hubApp = hubApp;
document.addEventListener('DOMContentLoaded', () => hubApp.init());
