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
        payrollRegularHolidayHours: 'leg_hol_days',
        payrollRegularHolidayOtHours: 'leg_hol_ot_hrs',
        payrollSpecialHolidayHours: 'sp_hol_days',
        payrollSpecialHolidayOtHours: 'sp_hol_ot_hrs',
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
        previewRegularOT: ['regular_ot_pay', 'ot_pay'],
        previewNightDiff: ['night_diff_pay'],
        previewRegularHoliday: ['regular_holiday_pay'],
        previewRegularHolidayOT: ['regular_holiday_ot_pay'],
        previewSpecialHoliday: ['special_holiday_pay'],
        previewSpecialHolidayOT: ['special_holiday_ot_pay'],
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

        panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
            if (!input.id) return;

            const fieldName = fieldMap[input.id];
            if (!fieldName) return;

            inputs[fieldName] = input.value === '' ? '0' : input.value;
        });

        inputs.other_deductions = typeof getDeductions === 'function'
            ? getDeductions()
            : [];

        return inputs;
    }

    function getNumericValue(source, keys) {
        if (!source || typeof source !== 'object') return 0;

        for (const key of keys) {
            if (
                Object.prototype.hasOwnProperty.call(source, key) &&
                source[key] !== null &&
                source[key] !== undefined
            ) {
                const value = source[key];

                if (typeof value === 'object') {
                    return Number(
                        value.amount ?? value.total ?? value.value ?? 0
                    ) || 0;
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

            element.textContent = money(
                getNumericValue(earnings, keys)
            );
        });
    }

    function renderDeductions(deductions = {}) {
        const mapping = {
            payrollSss: ['sss_ee'],
            payrollPagibig: ['pagibig_ee'],
            payrollPhilhealth: ['philhealth_ee'],
            payrollWithholdingTax: ['wtax']
        };

        Object.entries(mapping).forEach(([inputId, keys]) => {
            const input = get(inputId);
            if (!input) return;

            input.value = getNumericValue(deductions, keys).toFixed(2);
        });
    }

    function renderSummary(summary = {}) {
        const gross = Number(summary.gross_pay) || 0;
        const deductions = Number(summary.total_deductions) || 0;
        const net = Number(summary.net_pay) || 0;

        [
            'payrollGrossPay',
            'payrollSummaryGross'
        ].forEach(id => {
            const element = get(id);
            if (element) element.textContent = money(gross);
        });

        [
            'payrollTotalDeductions',
            'payrollSummaryDeductions'
        ].forEach(id => {
            const element = get(id);
            if (element) element.textContent = money(deductions);
        });

        const netElement = get('payrollNetPay');
        if (netElement) netElement.textContent = money(net);
    }

    function renderResult(result) {
        renderEarnings(result.earnings || {});
        renderDeductions(result.deductions || {});
        renderSummary(result.summary || {});
    }

    function resetPreviews() {
        panel.querySelectorAll('.payroll-preview').forEach(element => {
            element.textContent = money(0);
        });

        [
            'payrollGrossPay',
            'payrollSummaryGross',
            'payrollTotalDeductions',
            'payrollSummaryDeductions',
            'payrollNetPay'
        ].forEach(id => {
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
            const messages = Object.values(responseData.errors)
                .flat()
                .filter(Boolean);

            if (messages.length) return messages.join('\n');
        }

        return responseData?.message || 'Unable to compute payroll.';
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
            inputs: collectInputs()
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
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]')?.content || ''
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

            if (
                view.dataset.selectedEmployeeId !== String(employeeId) ||
                view.dataset.periodId !== String(periodId) ||
                view.dataset.clientId !== String(clientId)
            ) {
                return;
            }

            const result = responseData.data;
            const summary = result?.summary;

            if (
                !result ||
                !summary ||
                summary.gross_pay === undefined ||
                summary.total_deductions === undefined ||
                summary.net_pay === undefined
            ) {
                throw new Error('Invalid payroll computation response.');
            }

            renderResult(result);

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

                if (activeController === controller) {
                    activeController = null;
                }
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
            if (typeof persistState === 'function') {
                persistState();
            }

            computePayroll();
        }, delay);
    }

    function cancelComputation() {
        clearTimeout(debounceTimer);
        requestSequence++;
        cancelActiveRequest();

        get('payrollComputationLoading')?.classList.add('hidden');
    }

    return {
        computePayroll,
        scheduleComputation,
        cancelComputation,
        resetPreviews
    };
}