export function createPayrollComputation({
    panel,
    view,
    get,
    getDeductions,
    persistState
}) {
    let debounceTimer = null;
    let activeController = null;
    let requestSequence = 0;

    const contributionOverrides = {
        sss: false,
        pagibig: false,
        philhealth: false
    };

    const contributionFields = {
        sss: { employee: 'payrollSss', employer: 'payrollSssEmployer' },
        pagibig: { employee: 'payrollPagibig', employer: 'payrollPagibigEmployer' },
        philhealth: { employee: 'payrollPhilhealth', employer: 'payrollPhilhealthEmployer' }
    };

    const contributionInputMap = {
        payrollSss: 'sss',
        payrollSssEmployer: 'sss',
        payrollPagibig: 'pagibig',
        payrollPagibigEmployer: 'pagibig',
        payrollPhilhealth: 'philhealth',
        payrollPhilhealthEmployer: 'philhealth'
    };

    const money = value => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(Number(value) || 0);

    const fieldMap = {
        payrollDaysWorked: 'days_present',
        payrollDaysAbsent: 'days_absent',
        payrollHoursWorked: 'hours_worked',
        payrollRegularHours: 'ot_hrs',
        payrollNightDiffHours: 'night_diff_ot',
        payrollRestDayHours: 'rest_day_ot_hrs',
        payrollRestDayOtHours: 'sunday_ot',
        payrollSpecialHolidayHours: 'sp_hol_hrs',
        payrollSpecialHolidayOtHours: 'sp_hol_ot_hrs',
        payrollSpecialHolidayRestDayHours: 'excess_ot_hrs',
        payrollSpecialHolidayRestDayOtHours: 'excess_sun_sp_ot_hrs',
        payrollLegalHolidayHours: 'leg_hol_hrs',
        payrollLegalHolidayOtHours: 'leg_hol_ot_hrs',
        payrollLegalHolidayRestDayHours: 'excess_leg_hol_ot_hrs',
        payrollLegalHolidayRestDayOtHours: 'excess_sun_leg_ot_hrs',
        payrollSickLeave: 'sl_days',
        payrollVacationLeave: 'vl_days',
        payrollFixedAllowance: 'allowance',
        payrollLoadAllowance: 'load_allow',
        payrollMealAllowance: 'meal_allow',
        payrollTranspoAllowance: 'transpo_allow',
        payrollAdjustment: 'salary_adj',
        payrollIncentive: 'incentive_pay',
        payrollEcola: 'ecola_pay',
        payrollThirteenthMonth: 'thirteenth_month_pay',
        payrollLateHours: 'tardy_hrs'
    };

    const previewMap = {
        previewDaysWorked: ['basic_pay'],
        previewRegularOT: ['regular_ot_pay'],
        previewNightDiff: ['night_diff_pay'],
        previewRestDay: ['rest_day_ot_pay'],
        previewRestDayOT: ['sunday_ot_pay'],
        previewRegularHoliday: ['regular_holiday_pay'],
        previewRegularHolidayOT: ['regular_holiday_ot_pay'],
        previewSpecialHoliday: ['special_holiday_pay'],
        previewSpecialHolidayOT: ['special_holiday_ot_pay'],
        previewSpecialHolidayRestDay: ['excess_ot_pay'],
        previewSpecialHolidayRestDayOT: ['excess_sun_special_ot_pay'],
        previewLegalHolidayRestDay: ['excess_legal_hol_ot_pay'],
        previewLegalHolidayRestDayOT: ['excess_sun_legal_ot_pay'],
        previewSickLeave: ['sick_leave_pay'],
        previewVacationLeave: ['vacation_leave_pay'],
        previewFixedAllowance: ['allowance'],
        previewLoadAllowance: ['load_allow'],
        previewMealAllowance: ['meal_allow'],
        previewTranspoAllowance: ['transpo_allow'],
        previewAdjustment: ['salary_adjustment'],
        previewIncentive: ['incentive_pay'],
        previewEcola: ['ecola_pay'],
        preview13thMonth: ['thirteenth_month_pay']
    };

    function collectInputs() {
        const inputs = {};

        // Standard inputs
        panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
            if (!input.id) return;
            const fieldName = fieldMap[input.id];
            if (fieldName) {
                inputs[fieldName] = input.value === '' ? '0' : input.value;
            }
        });

        // Contributions
        Object.entries(contributionFields).forEach(([name, fields]) => {
            const employeeInput = get(fields.employee);
            const employerInput = get(fields.employer);
            inputs[`${name}_ee`] = employeeInput?.value || '0';
            inputs[`${name}_er`] = employerInput?.value || '0';
        });

        // Checkboxes
        const ecolaHoliday = get('payrollEcolaHoliday');
        const ecolaLegal = get('payrollEcolaLegal');
        if (ecolaHoliday) inputs.ecola_hol_checked = ecolaHoliday.checked;
        if (ecolaLegal) inputs.ecola_legal_checked = ecolaLegal.checked;

        // Over/Under
        const overUnder = get('payrollOverUnderPay');
        if (overUnder) inputs.over_under_pay = overUnder.value || '0';

        // Other Deductions (Galing sa payrollform.js)
        inputs.other_deductions = typeof getDeductions === 'function'
            ? getDeductions()
            : [];

        return inputs;
    }

    function collectContributionOverrides() {
        return { ...contributionOverrides };
    }

    function getNumericValue(source, keys) {
        if (!source || typeof source !== 'object') return 0;
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && source[key] !== undefined) {
                const value = source[key];
                if (typeof value === 'object') {
                    return Number(value.amount ?? value.total ?? value.value ?? 0) || 0;
                }
                return Number(value) || 0;
            }
        }
        return 0;
    }

    function renderEarnings(earnings = {}) {
        Object.entries(previewMap).forEach(([elementId, keys]) => {
            const element = get(elementId);
            if (!element) return;
            element.textContent = money(getNumericValue(earnings, keys));
        });
    }

    function renderDeductions(deductions = {}, contributions = {}) {
        const employeeMapping = {
            payrollSss: ['sss_ee'],
            payrollPagibig: ['pagibig_ee'],
            payrollPhilhealth: ['philhealth_ee']
        };

        Object.entries(employeeMapping).forEach(([inputId, keys]) => {
            const input = get(inputId);
            if (!input) return;
            const contributionName = contributionInputMap[inputId];
            if (contributionOverrides[contributionName]) return;
            input.value = getNumericValue(deductions, keys).toFixed(2);
        });

        const employerMapping = {
            payrollSssEmployer: ['sss_er'],
            payrollPagibigEmployer: ['pagibig_er'],
            payrollPhilhealthEmployer: ['philhealth_er']
        };

        Object.entries(employerMapping).forEach(([inputId, keys]) => {
            const input = get(inputId);
            if (!input) return;
            const contributionName = contributionInputMap[inputId];
            if (contributionOverrides[contributionName]) return;
            input.value = getNumericValue(contributions, keys).toFixed(2);
        });

        const otherDeductions = {
            payrollWithholdingTax: ['wtax']
        };

        Object.entries(otherDeductions).forEach(([inputId, keys]) => {
            const input = get(inputId);
            if (!input) return;
            input.value = getNumericValue(deductions, keys).toFixed(2);
        });
    }

    function renderSummary(summary = {}) {
        const gross = Number(summary.gross_pay) || 0;
        const deductions = Number(summary.total_deductions) || 0;
        const net = Number(summary.net_pay) || 0;

        ['payrollGrossPay', 'payrollSummaryGross'].forEach(id => {
            const element = get(id);
            if (element) element.textContent = money(gross);
        });

        ['payrollTotalDeductions', 'payrollSummaryDeductions'].forEach(id => {
            const element = get(id);
            if (element) element.textContent = money(deductions);
        });

        const netElement = get('payrollNetPay');
        if (netElement) netElement.textContent = money(net);
    }

    function renderResult(result) {
        renderEarnings(result.earnings || {});
        renderDeductions(result.deductions || {}, result.contributions || {});
        renderSummary(result.summary || {});
    }

    function resetPreviews() {
        panel.querySelectorAll('[id^="preview"]').forEach(element => {
            element.textContent = money(0);
        });
        ['payrollGrossPay', 'payrollSummaryGross', 'payrollTotalDeductions', 'payrollSummaryDeductions', 'payrollNetPay'].forEach(id => {
            const element = get(id);
            if (element) element.textContent = money(0);
        });
    }

    function showError(message) {
        const errorElement = get('payrollComputationError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        } else {
            console.error(message);
        }
    }

    function clearError() {
        const errorElement = get('payrollComputationError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    function getErrorMessage(responseData) {
        if (responseData?.errors) {
            const messages = Object.values(responseData.errors).flat().filter(Boolean);
            if (messages.length) return messages.join('\n');
        }
        return responseData?.message || 'Unable to compute payroll.';
    }

    function activateContributionInputListeners() {
        panel.addEventListener('input', event => {
            const input = event.target;
            if (!input?.id) return;
            const contributionName = contributionInputMap[input.id];
            if (!contributionName) return;
            contributionOverrides[contributionName] = true;
            scheduleComputation();
        });
    }

    function resetContribution(name) {
        if (!Object.prototype.hasOwnProperty.call(contributionOverrides, name)) return;
        contributionOverrides[name] = false;
        if (typeof persistState === 'function') persistState();
        scheduleComputation(0);
    }

    function clearContributionOverride(name) {
        if (!Object.prototype.hasOwnProperty.call(contributionOverrides, name)) return;
        contributionOverrides[name] = false;
    }

    function restoreContributionOverrides(overrides = {}) {
        Object.keys(contributionOverrides).forEach(key => {
            contributionOverrides[key] = overrides[key] === true;
        });
    }

    function getContributionOverrides() {
        return { ...contributionOverrides };
    }

    async function computePayroll() {
        const computeUrl = view.dataset.computeUrl;
        const clientId = view.dataset.clientId;
        const periodId = view.dataset.periodId;
        const employeeId = view.dataset.selectedEmployeeId;

        if (!computeUrl || !clientId || !periodId || !employeeId) {
            resetPreviews();
            return;
        }

        cancelActiveRequest();
        activeController = new AbortController();
        const controller = activeController;
        const sequence = ++requestSequence;

        const payload = {
            client_id: clientId,
            period_id: periodId,
            emp_id: employeeId,
            inputs: collectInputs(),
            contribution_overrides: collectContributionOverrides()
        };

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
            try {
                responseData = await response.json();
            } catch {
                throw new Error('Invalid response received from payroll server.');
            }

            if (!response.ok || responseData.success === false) {
                throw new Error(getErrorMessage(responseData));
            }

            if (sequence !== requestSequence) return;
            if (view.dataset.selectedEmployeeId !== String(employeeId) || view.dataset.periodId !== String(periodId) || view.dataset.clientId !== String(clientId)) return;

            const result = responseData.data;
            const summary = result?.summary;

            if (!result || !summary || summary.gross_pay === undefined || summary.total_deductions === undefined || summary.net_pay === undefined) {
                throw new Error('Invalid payroll computation response.');
            }

            renderResult(result);
            if (typeof persistState === 'function') persistState();

            view.dispatchEvent(new CustomEvent('payroll:computed', {
                bubbles: true,
                detail: result
            }));

        } catch (error) {
            if (error.name === 'AbortError') return;
            if (sequence !== requestSequence) return;
            console.error('Payroll computation error:', error);
            showError(error.message || 'Payroll computation failed.');
        } finally {
            if (sequence === requestSequence) {
                loadingElement?.classList.add('hidden');
                if (activeController === controller) activeController = null;
            }
        }
    }

    function cancelActiveRequest() {
        if (activeController) {
            activeController.abort();
            activeController = null;
        }
    }

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
        cancelActiveRequest();
        get('payrollComputationLoading')?.classList.add('hidden');
    }

    activateContributionInputListeners();

    return {
        computePayroll,
        scheduleComputation,
        cancelComputation,
        resetPreviews,
        resetContribution,
        clearContributionOverride,
        getContributionOverrides,
        restoreContributionOverrides
    };
}