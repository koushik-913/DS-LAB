document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    if (form) {
        fetch('/metrics')
            .then(res => res.json())
            .then(data => {
                const precisionText = document.getElementById('global-precision-text');
                const precisionBar = document.getElementById('global-precision-bar');
                if (precisionText && data.precision) {
                    const label = data.precision_label || "Optimal";
                    precisionText.textContent = `${data.precision}% (${label})`;
                }
                if (precisionBar && data.precision) {
                    precisionBar.style.width = `${data.precision}%`;
                }
            })
            .catch(err => console.error(err));

        const inputs = form.querySelectorAll('input[type="number"]');
        if (inputs.length >= 5) {
            const [pregnancies, glucose, insulin, bmi, age] = inputs;
            const runBtn = form.querySelector('button[type="button"]');
            
            const resultElement = document.getElementById('prediction-result');
            const riskGauge = document.querySelector('.progress-ring-circle');
            const riskLevelText = document.getElementById('risk-level-text');
            const warningLabel = document.querySelector('.bg-error\\/10') || document.querySelector('.bg-secondary\\/10');
            
            if (runBtn) {
                runBtn.addEventListener('click', async () => {
                    const payload = {
                        Pregnancies: parseFloat(pregnancies.value || pregnancies.placeholder),
                        Glucose: parseFloat(glucose.value || glucose.placeholder),
                        Insulin: parseFloat(insulin.value || insulin.placeholder),
                        BMI: parseFloat(bmi.value || bmi.placeholder),
                        Age: parseFloat(age.value || age.placeholder)
                    };
                    localStorage.setItem('last_patient_data', JSON.stringify(payload));
                    
                    runBtn.disabled = true;
                    runBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Checking...';
                    
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        const response = await fetch('/predict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const data = await response.json();
                        if (resultElement) resultElement.textContent = `${Number(data.probability).toFixed(1)}%`;
                        
                        if (riskGauge) {
                            const circumference = 264; 
                            const offset = circumference - (data.probability / 100) * circumference;
                            riskGauge.style.strokeDashoffset = offset;
                            
                            if (data.is_diabetes) {
                                riskGauge.classList.remove('text-secondary');
                                riskGauge.classList.add('text-error');
                                if (resultElement) {
                                    resultElement.classList.remove('text-secondary');
                                    resultElement.classList.add('text-error');
                                }
                            } else {
                                riskGauge.classList.remove('text-error');
                                riskGauge.classList.add('text-secondary');
                                if (resultElement) {
                                    resultElement.classList.remove('text-error');
                                    resultElement.classList.add('text-secondary');
                                }
                            }
                        }
                        
                        if (riskLevelText) {
                            if (data.is_diabetes) {
                                riskLevelText.textContent = "High";
                                riskLevelText.classList.remove('text-secondary');
                                riskLevelText.classList.add('text-error');
                            } else {
                                riskLevelText.textContent = "Low";
                                riskLevelText.classList.remove('text-error');
                                riskLevelText.classList.add('text-secondary');
                            }
                        }
                        
                        if (warningLabel) {
                            if (data.is_diabetes) {
                                warningLabel.innerHTML = '<span class="material-symbols-outlined text-[14px] mr-1" data-weight="fill">warning</span> Likely Diabetes';
                                warningLabel.className = 'inline-flex px-3 py-1 rounded-full bg-error/10 text-error text-label-sm font-bold border border-error/20 mb-stack-md';
                            } else {
                                warningLabel.innerHTML = '<span class="material-symbols-outlined text-[14px] mr-1" data-weight="fill">check_circle</span> No Diabetes';
                                warningLabel.className = 'inline-flex px-3 py-1 rounded-full bg-secondary/10 text-secondary text-label-sm font-bold border border-secondary/20 mb-stack-md';
                            }
                        }
                        
                    } catch (err) {
                        console.error(err);
                    } finally {
                        runBtn.disabled = false;
                        runBtn.innerHTML = '<span class="material-symbols-outlined">analytics</span> Run Prediction';
                    }
                });
            }
        }
    }
    if (window.location.pathname.includes("performance.html")) {
        fetch('/metrics')
            .then(res => res.json())
            .then(data => {
                const metricElements = document.querySelectorAll('.text-headline-lg');
                const updateRing = (idx, val) => {
                    if (metricElements[idx]) metricElements[idx].textContent = `${val}%`;
                    const rings = document.querySelectorAll('.progress-ring__circle');
                    if (rings[idx]) {
                        const circumference = 264;
                        const offset = circumference - (val / 100) * circumference;
                        rings[idx].style.strokeDashoffset = offset;
                    }
                };
                if(data.accuracy) updateRing(0, data.accuracy);
                if(data.precision) updateRing(1, data.precision);
                if(data.recall) updateRing(2, data.recall);
                if(data.f1) updateRing(3, data.f1);
                if(data.roc_auc && metricElements[4]) updateRing(4, data.roc_auc);
            })
            .catch(err => console.error(err));
    }
    if (window.location.pathname.includes("explain.html")) {
        const storedData = localStorage.getItem('last_patient_data');
        if (storedData) {
            const payload = JSON.parse(storedData);
            fetch('/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: storedData
            })
            .then(res => res.json())
            .then(data => {
                const confElements = document.querySelectorAll('.text-on-surface-variant');
                for (let el of confElements) {
                    if (el.textContent.includes("Patient ID:")) {
                        el.textContent = `Patient ID: #GLU-8821 | Confidence: ${data.probability}%`;
                        break;
                    }
                }
                const featureNames = ["Glucose", "Insulin", "BMI", "Pregnancies", "Age"];
                const groups = document.querySelectorAll('.flex.items-center.group');
                
                featureNames.forEach(feature => {
                    let targetGroup = null;
                    groups.forEach(g => {
                        const label = g.querySelector('.w-32');
                        if (label && label.textContent.trim().toLowerCase() === feature.toLowerCase()) {
                            targetGroup = g;
                        }
                    });
                    
                    if (targetGroup) {
                        const shapVal = data.shap_values[feature];
                        const absShap = Math.abs(shapVal);
                        const isPositive = shapVal > 0;
                        const widthPct = Math.min(100, Math.max(10, (absShap / 0.5) * 100));
                        
                        const barContainer = targetGroup.querySelector('.flex-1');
                        const valueText = targetGroup.querySelector('.font-bold');
                        
                        if (barContainer) {
                            barContainer.innerHTML = '';
                            if (isPositive) {
                                barContainer.className = 'flex-1 h-8 flex items-center';
                                barContainer.innerHTML = `
                                    <div class="h-6 bg-secondary/60 rounded-r-md border-r-2 border-secondary" style="width: ${widthPct}%"></div>
                                    <span class="ml-4 text-label-md font-bold text-secondary">+${shapVal.toFixed(2)}</span>
                                `;
                            } else {
                                barContainer.className = 'flex-1 h-8 flex items-center justify-end mr-[30%]';
                                barContainer.innerHTML = `
                                    <span class="mr-4 text-label-md font-bold text-primary">${shapVal.toFixed(2)}</span>
                                    <div class="h-6 bg-primary/40 rounded-l-md border-l-2 border-primary" style="width: ${widthPct}%"></div>
                                `;
                            }
                        }
                    }
                });
            })
            .catch(err => console.error(err));
        }
    }
});
    document.querySelectorAll('.material-symbols-outlined').forEach(el => {
        if (el.textContent.trim() === 'dark_mode' || el.textContent.trim() === 'light_mode') {
            el.classList.add('cursor-pointer');
            const currentTheme = localStorage.getItem('theme') || 'dark';
            if (currentTheme === 'light') {
                document.documentElement.classList.remove('dark');
                el.textContent = 'light_mode';
            } else {
                document.documentElement.classList.add('dark');
                el.textContent = 'dark_mode';
            }

            el.addEventListener('click', () => {
                const html = document.documentElement;
                if (html.classList.contains('dark')) {
                    html.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                    el.textContent = 'light_mode';
                } else {
                    html.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                    el.textContent = 'dark_mode';
                }
                document.querySelectorAll('.material-symbols-outlined').forEach(otherEl => {
                    if (otherEl.textContent.trim() === 'dark_mode' || otherEl.textContent.trim() === 'light_mode') {
                        otherEl.textContent = el.textContent;
                    }
                });
            });
        }
    });
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('button.material-symbols-outlined');
    let themeToggle = null;
    buttons.forEach(btn => {
        if (btn.textContent.trim() === 'dark_mode' || btn.textContent.trim() === 'light_mode') {
            themeToggle = btn;
        }
    });

    if (themeToggle) {
        if (!document.getElementById('light-theme-style')) {
            const style = document.createElement('style');
            style.id = 'light-theme-style';
            style.innerHTML = `
                html.light-theme body,
                html.light-theme {
                    background-color: #ffffff !important;
                }
                html.light-theme .bg-surface {
                    background-color: #ffffff !important;
                }
                html.light-theme .bg-surface-lowest\\/80, 
                html.light-theme .bg-surface-container\\/40, 
                html.light-theme .bg-surface\\/60,
                html.light-theme aside,
                html.light-theme nav,
                html.light-theme .glass-panel {
                    background-color: #f1f5f9 !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                html.light-theme .text-on-surface, 
                html.light-theme .text-on-surface-variant {
                    color: #0f172a !important;
                }
                html.light-theme .border-white\\/12, 
                html.light-theme .border-white\\/10,
                html.light-theme .border-white\\/5,
                html.light-theme .border-white\\/20 {
                    border-color: #cbd5e1 !important;
                }
                html.light-theme .text-white\\/60, html.light-theme .text-white\\/70 {
                    color: #64748b !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.add('light-theme');
            themeToggle.textContent = 'light_mode';
        }
        
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            if (document.documentElement.classList.contains('light-theme')) {
                themeToggle.textContent = 'light_mode';
                localStorage.setItem('theme', 'light');
            } else {
                themeToggle.textContent = 'dark_mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
