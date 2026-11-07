export function createPayrollComputation({
    panel, view, get, getDeductions, persistState
}) {
    let debounceTimer = null;
    let activeController = null;
    let requestSequence = 0;

    const switchState = { switchSss: true, switchPagibig: true, switchPhilhealth: true };
    let skipBackendSwitchesOnNextCompute = false;
    let hasReceivedInitialSwitches = false;

    const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(Number(value) || 0);

    const fieldMap = {
        payrollDaysWorked: 'days_present', payrollDaysAbsent: 'days_absent', payrollHoursWorked: 'hours_worked',
        payrollRegularHours: 'ot_hrs', payrollNightDiffHours: 'night_diff_ot', payrollRestDayHours: 'rest_day_ot_hrs', payrollRestDayOtHours: 'sunday_ot',
        payrollSpecialHolidayHours: 'sp_hol_hrs', payrollSpecialHolidayOtHours: 'sp_hol_ot_hrs', payrollSpecialHolidayRestDayHours: 'excess_ot_hrs', payrollSpecialHolidayRestDayOtHours: 'excess_sun_sp_ot_hrs',
        payrollLegalHolidayHours: 'leg_hol_hrs', payrollLegalHolidayOtHours: 'leg_hol_ot_hrs', payrollLegalHolidayRestDayHours: 'excess_leg_hol_ot_hrs', payrollLegalHolidayRestDayOtHours: 'excess_sun_leg_ot_hrs',
        payrollSickLeave: 'sl_days', payrollVacationLeave: 'vl_days', payrollFixedAllowance: 'allowance', payrollLoadAllowance: 'load_allow', payrollMealAllowance: 'meal_allow', payrollTranspoAllowance: 'transpo_allow',
        payrollAdjustment: 'salary_adj', payrollIncentive: 'incentive_pay', payrollEcola: 'ecola_pay', payrollThirteenthMonth: 'thirteenth_month_pay', payrollLateHours: 'tardy_hrs'
    };

    const previewMap = {
        previewDaysWorked: ['basic_pay'], previewRegularOT: ['regular_ot_pay'], previewNightDiff: ['night_diff_pay'],
        previewRestDay: ['rest_day_ot_pay'], previewRestDayOT: ['sunday_ot_pay'],
        previewRegularHoliday: ['regular_holiday_pay'], previewRegularHolidayOT: ['regular_holiday_ot_pay'], previewSpecialHoliday: ['special_holiday_pay'], previewSpecialHolidayOT: ['special_holiday_ot_pay'],
        previewSpecialHolidayRestDay: ['excess_ot_pay'], previewSpecialHolidayRestDayOT: ['excess_sun_special_ot_pay'], previewLegalHolidayRestDay: ['excess_legal_hol_ot_pay'], previewLegalHolidayRestDayOT: ['excess_sun_legal_ot_pay'],
        previewSickLeave: ['sick_leave_pay'], previewVacationLeave: ['vacation_leave_pay'], previewFixedAllowance: ['allowance'], previewLoadAllowance: ['load_allow'], previewMealAllowance: ['meal_allow'], previewTranspoAllowance: ['transpo_allow'],
        previewAdjustment: ['salary_adjustment'], previewIncentive: ['incentive_pay'], previewEcola: ['ecola_pay'], preview13thMonth: ['thirteenth_month_pay']
    };

    function setSwitchState(newState = {}) {
        if (typeof newState.switchSss === 'boolean') switchState.switchSss = newState.switchSss;
        if (typeof newState.switchPagibig === 'boolean') switchState.switchPagibig = newState.switchPagibig;
        if (typeof newState.switchPhilhealth === 'boolean') switchState.switchPhilhealth = newState.switchPhilhealth;
        applySwitchStateToDOM();
    }

    function getSwitchState() {
        return { switchSss: switchState.switchSss, switchPagibig: switchState.switchPagibig, switchPhilhealth: switchState.switchPhilhealth };
    }

    function skipBackendSwitchesOnce() { skipBackendSwitchesOnNextCompute = true; }

    function collectInputs() {
        const inputs = {};
        panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
            if (!input.id) return;
            const fieldName = fieldMap[input.id];
            if (fieldName) inputs[fieldName] = input.value === '' ? '0' : input.value;
        });

        inputs.deduct_sss = switchState.switchSss;
        inputs.deduct_pagibig = switchState.switchPagibig;
        inputs.deduct_philhealth = switchState.switchPhilhealth;

        if (!switchState.switchSss) {
            inputs.sss_ee = get('payrollSss')?.value || '0';
            inputs.sss_er = get('payrollSssEmployer')?.value || '0';
        }
        if (!switchState.switchPagibig) {
            inputs.pagibig_ee = get('payrollPagibig')?.value || '0';
            inputs.pagibig_er = get('payrollPagibigEmployer')?.value || '0';
        }
        if (!switchState.switchPhilhealth) {
            inputs.philhealth_ee = get('payrollPhilhealth')?.value || '0';
            inputs.philhealth_er = get('payrollPhilhealthEmployer')?.value || '0';
        }

        const ecolaHoliday = get('payrollEcolaHoliday');
        const ecolaLegal = get('payrollEcolaLegal');
        if (ecolaHoliday) inputs.ecola_hol_checked = ecolaHoliday.checked;
        if (ecolaLegal) inputs.ecola_legal_checked = ecolaLegal.checked;

        const overUnder = get('payrollOverUnderPay');
        if (overUnder) inputs.over_under_pay = overUnder.value || '0';

        inputs.other_deductions = typeof getDeductions === 'function' ? getDeductions() : [];
        return inputs;
    }

    function getNumericValue(source, keys) {
        if (!source || typeof source !== 'object') return 0;
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && source[key] !== undefined) {
                const value = source[key];
                if (typeof value === 'object') return Number(value.amount ?? value.total ?? value.value ?? 0) || 0;
                return Number(value) || 0;
            }
        }
        return 0;
    }

    function renderEarnings(earnings = {}) {
        Object.entries(previewMap).forEach(([elementId, keys]) => {
            const element = get(elementId);
            if (element) element.textContent = money(getNumericValue(earnings, keys));
        });
    }

    function renderDeductions(deductions = {}, contributions = {}) {
        const mapping = {
            payrollSss: ['sss_ee', 'switchSss'], 
            payrollPagibig: ['pagibig_ee', 'switchPagibig'], 
            payrollPhilhealth: ['philhealth_ee', 'switchPhilhealth'],
            payrollSssEmployer: ['sss_er', 'switchSss'], 
            payrollPagibigEmployer: ['pagibig_er', 'switchPagibig'], 
            payrollPhilhealthEmployer: ['philhealth_er', 'switchPhilhealth']
        };

        Object.entries(mapping).forEach(([inputId, [key, switchKey]]) => {
            const input = get(inputId);
            if (!input) return;

            // Kung ang user ay nagta-type pa lang sa input na ito, wag galawin.
            if (document.activeElement === input) return;

            // 🔑 KUNG NAKA-UNCHECK (Manual Mode), HUWAG GALAWIN ANG INPUT.
            // Hahayaan lang natin kung ano ang nakalagay (e.g. 900), para hindi mabura.
            if (!switchState[switchKey]) return;

            // Kung naka-check (Auto Mode), i-update base sa response.
            const source = inputId.includes('Employer') ? contributions : deductions;
            input.value = getNumericValue(source, [key]).toFixed(2);
        });

        const wtaxInput = get('payrollWithholdingTax');
        if (wtaxInput) wtaxInput.value = getNumericValue(deductions, ['wtax']).toFixed(2);
    }

    function renderSummary(summary = {}) {
        const gross = Number(summary.gross_pay) || 0;
        const deductions = Number(summary.total_deductions) || 0;
        const net = Number(summary.net_pay) || 0;
        ['payrollGrossPay', 'payrollSummaryGross'].forEach(id => { const el = get(id); if (el) el.textContent = money(gross); });
        ['payrollTotalDeductions', 'payrollSummaryDeductions'].forEach(id => { const el = get(id); if (el) el.textContent = money(deductions); });
        const netElement = get('payrollNetPay');
        if (netElement) netElement.textContent = money(net);
    }

    function applySwitchStateToDOM() {
        const mapping = [
            { switchId: 'switchSss', empId: 'payrollSss', emprId: 'payrollSssEmployer', stateKey: 'switchSss' },
            { switchId: 'switchPagibig', empId: 'payrollPagibig', emprId: 'payrollPagibigEmployer', stateKey: 'switchPagibig' },
            { switchId: 'switchPhilhealth', empId: 'payrollPhilhealth', emprId: 'payrollPhilhealthEmployer', stateKey: 'switchPhilhealth' }
        ];

        mapping.forEach(({ switchId, empId, emprId, stateKey }) => {
            const switchEl = get(switchId);
            const empEl = get(empId);
            const emprEl = get(emprId);
            const isChecked = switchState[stateKey];

            if (switchEl) switchEl.checked = isChecked;

            [empEl, emprEl].forEach(el => {
                if (!el) return;
                const shouldDisable = isChecked;

                el.disabled = shouldDisable;
                el.readOnly = shouldDisable;

                el.classList.remove(
                    'bg-gray-100', 'dark:bg-gray-800', 'text-gray-400', 'cursor-not-allowed',
                    'bg-white', 'dark:bg-gray-900', 'text-gray-900', 'dark:text-gray-200', 'cursor-default'
                );

                if (shouldDisable) {
                    el.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
                } else {
                    el.classList.add('bg-white', 'dark:bg-gray-900', 'text-gray-900', 'dark:text-gray-200', 'cursor-default');
                }
            });
        });
    }

    function renderResult(result) {
        renderEarnings(result.earnings || {});
        renderSummary(result.summary || {});
        applySwitchStateToDOM();
        renderDeductions(result.deductions || {}, result.contributions || {});
    }

    function resetPreviews() {
        panel.querySelectorAll('[id^="preview"]').forEach(el => { el.textContent = money(0); });
        ['payrollGrossPay', 'payrollSummaryGross', 'payrollTotalDeductions', 'payrollSummaryDeductions', 'payrollNetPay'].forEach(id => {
            const el = get(id);
            if (el) el.textContent = money(0);
        });
    }

    function showError(message) {
        const el = get('payrollComputationError');
        if (el) { el.textContent = message; el.classList.remove('hidden'); } else console.error(message);
    }

    function clearError() {
        const el = get('payrollComputationError');
        if (el) { el.textContent = ''; el.classList.add('hidden'); }
    }

    function getErrorMessage(responseData) {
        if (responseData?.errors) {
            const messages = Object.values(responseData.errors).flat().filter(Boolean);
            if (messages.length) return messages.join('\n');
        }
        return responseData?.message || 'Unable to compute payroll.';
    }

    async function computePayroll(options = {}) {
        const computeUrl = view.dataset.computeUrl;
        const clientId = view.dataset.clientId;
        const periodId = view.dataset.periodId;
        const employeeId = view.dataset.selectedEmployeeId;

        if (!computeUrl || !clientId || !periodId || !employeeId) { resetPreviews(); return; }

        cancelActiveRequest();
        activeController = new AbortController();
        const controller = activeController;
        const sequence = ++requestSequence;

        const sentSwitchState = { sss: switchState.switchSss, pagibig: switchState.switchPagibig, philhealth: switchState.switchPhilhealth };
        const shouldSkipBackendSwitches = skipBackendSwitchesOnNextCompute;
        skipBackendSwitchesOnNextCompute = false;

        const payload = { client_id: clientId, period_id: periodId, emp_id: employeeId, inputs: collectInputs() };

        clearError();
        const loadingElement = get('payrollComputationLoading');
        loadingElement?.classList.remove('hidden');

        try {
            const response = await fetch(computeUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                credentials: 'same-origin',
                signal: controller.signal,
                body: JSON.stringify(payload)
            });

            let responseData;
            try { responseData = await response.json(); } catch { throw new Error('Invalid response received.'); }
            if (!response.ok || responseData.success === false) throw new Error(getErrorMessage(responseData));
            if (sequence !== requestSequence) return;
            if (view.dataset.selectedEmployeeId !== String(employeeId) || view.dataset.periodId !== String(periodId) || view.dataset.clientId !== String(clientId)) return;

            const result = responseData.data;
            if (!result || !result.summary) throw new Error('Invalid payroll computation response.');

            if (!hasReceivedInitialSwitches && result.switches && !shouldSkipBackendSwitches) {
                if (typeof result.switches.deduct_sss === 'boolean') switchState.switchSss = result.switches.deduct_sss;
                if (typeof result.switches.deduct_pagibig === 'boolean') switchState.switchPagibig = result.switches.deduct_pagibig;
                if (typeof result.switches.deduct_philhealth === 'boolean') switchState.switchPhilhealth = result.switches.deduct_philhealth;
                hasReceivedInitialSwitches = true;
            }

            const switchChangedSinceSend = sentSwitchState.sss !== switchState.switchSss || sentSwitchState.pagibig !== switchState.switchPagibig || sentSwitchState.philhealth !== switchState.switchPhilhealth;

            if (shouldSkipBackendSwitches || switchChangedSinceSend) {
                renderEarnings(result.earnings || {});
                renderSummary(result.summary || {});
                applySwitchStateToDOM();
                renderDeductions(result.deductions || {}, result.contributions || {});
            } else {
                renderResult(result);
            }

            // 🔑 Tinanggal ang parameter (getSwitchState()) para hindi mag-error at tumuloy sa dispatchEvent
            if (typeof persistState === 'function') persistState();
            view.dispatchEvent(new CustomEvent('payroll:computed', { bubbles: true, detail: result }));

        } catch (error) {
            if (error.name === 'AbortError') return;
            if (sequence !== requestSequence) return;
            showError(error.message || 'Payroll computation failed.');
        } finally {
            if (sequence === requestSequence) {
                loadingElement?.classList.add('hidden');
                if (activeController === controller) activeController = null;
            }
        }
    }

    function cancelActiveRequest() { if (activeController) { activeController.abort(); activeController = null; } }

    function scheduleComputation(delay = 400) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (typeof persistState === 'function') persistState();
            computePayroll();
        }, delay);
    }

    function cancelComputation() {
        clearTimeout(debounceTimer);
        requestSequence++;
        skipBackendSwitchesOnNextCompute = false;
        cancelActiveRequest();
        get('payrollComputationLoading')?.classList.add('hidden');
    }

    ['switchSss', 'switchPagibig', 'switchPhilhealth'].forEach(id => {
        const el = get(id);
        if (!el) return;
        el.addEventListener('change', (e) => {
            switchState[id] = e.target.checked;
            hasReceivedInitialSwitches = true;
            applySwitchStateToDOM();
            if (typeof persistState === 'function') persistState();
            scheduleComputation(50);
        });
    });

    const inputMapping = [
        { inputId: 'payrollSss', stateKey: 'switchSss' }, { inputId: 'payrollSssEmployer', stateKey: 'switchSss' },
        { inputId: 'payrollPagibig', stateKey: 'switchPagibig' }, { inputId: 'payrollPagibigEmployer', stateKey: 'switchPagibig' },
        { inputId: 'payrollPhilhealth', stateKey: 'switchPhilhealth' }, { inputId: 'payrollPhilhealthEmployer', stateKey: 'switchPhilhealth' }
    ];

    inputMapping.forEach(({ inputId, stateKey }) => {
        const el = get(inputId);
        if (!el) return;
        el.addEventListener('input', () => {
            if (!switchState[stateKey]) {
                if (typeof persistState === 'function') persistState();
                scheduleComputation(400);
            }
        });
    });

    panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
        if (['payrollSss', 'payrollSssEmployer', 'payrollPagibig', 'payrollPagibigEmployer', 'payrollPhilhealth', 'payrollPhilhealthEmployer'].includes(input.id)) return;
        input.addEventListener('input', () => {
            if (typeof persistState === 'function') persistState();
            scheduleComputation(400);
        });
    });

    applySwitchStateToDOM();

    return { computePayroll, scheduleComputation, cancelComputation, resetPreviews, setSwitchState, getSwitchState, skipBackendSwitchesOnce };
}