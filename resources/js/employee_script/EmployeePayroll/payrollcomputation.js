
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
    let activeEmployeeKey = null;

    const switchState = {
        switchSss: true,
        switchPagibig: true,
        switchPhilhealth: true
    };

    let skipBackendSwitchesOnNextCompute = false;
    let hasReceivedInitialSwitches = false;

    const money = value =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(Number(value) || 0);

    // ---------------------------------------------------------
    // Payroll Input Mapping
    // ---------------------------------------------------------

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

        // Sick Leave and Vacation Leave are not included in the UI.
        // Backend computation remains unchanged.

        payrollFixedAllowance: 'allowance',
        payrollLoadAllowance: 'load_allow',
        payrollMealAllowance: 'meal_allow',
        payrollTranspoAllowance: 'transpo_allow',

        // ECOLA is not included in the UI.
        // Backend computation remains unchanged.

        payrollAdjustment: 'salary_adj',
        payrollIncentive: 'incentive_pay',
        payrollThirteenthMonth: 'thirteenth_month_pay',
        payrollLateHours: 'tardy_hrs'
    };

    // ---------------------------------------------------------
    // Payroll Preview Mapping
    // ---------------------------------------------------------

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

        previewFixedAllowance: ['allowance'],
        previewLoadAllowance: ['load_allow'],
        previewMealAllowance: ['meal_allow'],
        previewTranspoAllowance: ['transpo_allow'],

        previewAdjustment: ['salary_adjustment'],
        previewIncentive: ['incentive_pay'],
        preview13thMonth: ['thirteenth_month_pay']
    };

    // ---------------------------------------------------------
    // Contribution Switch State
    // ---------------------------------------------------------

    function setSwitchState(newState = {}) {
        if (typeof newState.switchSss === 'boolean') {
            switchState.switchSss = newState.switchSss;
        }

        if (typeof newState.switchPagibig === 'boolean') {
            switchState.switchPagibig = newState.switchPagibig;
        }

        if (typeof newState.switchPhilhealth === 'boolean') {
            switchState.switchPhilhealth = newState.switchPhilhealth;
        }

        applySwitchStateToDOM();
    }

    function getSwitchState() {
        return {
            switchSss: switchState.switchSss,
            switchPagibig: switchState.switchPagibig,
            switchPhilhealth: switchState.switchPhilhealth
        };
    }

    function skipBackendSwitchesOnce() {
        skipBackendSwitchesOnNextCompute = true;
    }

    // ---------------------------------------------------------
    // Collect Payroll Inputs
    // ---------------------------------------------------------

    function collectInputs() {
        const inputs = {};

        panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
            if (!input.id) return;

            const fieldName = fieldMap[input.id];

            if (fieldName) {
                inputs[fieldName] = input.value === ''
                    ? '0'
                    : input.value;
            }
        });

        // Contribution switches
        inputs.deduct_sss = switchState.switchSss;
        inputs.deduct_pagibig = switchState.switchPagibig;
        inputs.deduct_philhealth = switchState.switchPhilhealth;

        // Manual contribution overrides
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

        // Over / Under Pay
        const overUnder = get('payrollOverUnderPay');

        if (overUnder) {
            inputs.over_under_pay = overUnder.value || '0';
        }

        // -----------------------------------------------------
        // Other Deductions
        // Send MANUAL deductions only.
        // Automatic/database deductions are retrieved by backend.
        // -----------------------------------------------------

        inputs.other_deductions = typeof getDeductions === 'function'
            ? getDeductions()
            : [];

        return inputs;
    }

    // ---------------------------------------------------------
    // Numeric Value Helper
    // ---------------------------------------------------------

    function getNumericValue(source, keys) {
        if (!source || typeof source !== 'object') {
            return 0;
        }

        for (const key of keys) {
            if (
                Object.prototype.hasOwnProperty.call(source, key) &&
                source[key] !== null &&
                source[key] !== undefined
            ) {
                const value = source[key];

                if (typeof value === 'object') {
                    return Number(
                        value.amount ??
                        value.total ??
                        value.value ??
                        0
                    ) || 0;
                }

                return Number(value) || 0;
            }
        }

        return 0;
    }

    // ---------------------------------------------------------
    // Render Earnings
    // ---------------------------------------------------------

    function renderEarnings(earnings = {}) {
        Object.entries(previewMap).forEach(([elementId, keys]) => {
            const element = get(elementId);

            if (element) {
                element.textContent = money(
                    getNumericValue(earnings, keys)
                );
            }
        });
    }

    // ---------------------------------------------------------
    // Render Contributions and Deductions
    // ---------------------------------------------------------

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

            // Do not overwrite the field currently being edited.
            if (document.activeElement === input) return;

            // Manual contribution values should remain untouched.
            if (!switchState[switchKey]) return;

            const source = inputId.includes('Employer')
                ? contributions
                : deductions;

            input.value = getNumericValue(source, [key]).toFixed(2);
        });

        const wtaxInput = get('payrollWithholdingTax');

        if (wtaxInput && document.activeElement !== wtaxInput) {
            wtaxInput.value = getNumericValue(
                deductions,
                ['wtax']
            ).toFixed(2);
        }
    }

    // ---------------------------------------------------------
    // Render Payroll Summary
    // ---------------------------------------------------------

    function renderSummary(summary = {}) {
        const gross = Number(summary.gross_pay) || 0;
        const deductions = Number(summary.total_deductions) || 0;
        const net = Number(summary.net_pay) || 0;

        [
            'payrollGrossPay',
            'payrollSummaryGross'
        ].forEach(id => {
            const element = get(id);

            if (element) {
                element.textContent = money(gross);
            }
        });

        [
            'payrollTotalDeductions',
            'payrollSummaryDeductions'
        ].forEach(id => {
            const element = get(id);

            if (element) {
                element.textContent = money(deductions);
            }
        });

        const netElement = get('payrollNetPay');

        if (netElement) {
            netElement.textContent = money(net);
        }
    }

    // ---------------------------------------------------------
    // Apply Contribution Switches to DOM
    // ---------------------------------------------------------

    function applySwitchStateToDOM() {
        const mapping = [
            {
                switchId: 'switchSss',
                empId: 'payrollSss',
                emprId: 'payrollSssEmployer',
                stateKey: 'switchSss'
            },
            {
                switchId: 'switchPagibig',
                empId: 'payrollPagibig',
                emprId: 'payrollPagibigEmployer',
                stateKey: 'switchPagibig'
            },
            {
                switchId: 'switchPhilhealth',
                empId: 'payrollPhilhealth',
                emprId: 'payrollPhilhealthEmployer',
                stateKey: 'switchPhilhealth'
            }
        ];

        mapping.forEach(({ switchId, empId, emprId, stateKey }) => {
            const switchEl = get(switchId);
            const empEl = get(empId);
            const emprEl = get(emprId);

            const isChecked = switchState[stateKey];

            if (switchEl) {
                switchEl.checked = isChecked;
            }

            [empEl, emprEl].forEach(element => {
                if (!element) return;

                element.disabled = isChecked;
                element.readOnly = isChecked;

                element.classList.remove(
                    'bg-gray-100',
                    'dark:bg-gray-800',
                    'text-gray-400',
                    'cursor-not-allowed',
                    'bg-white',
                    'dark:bg-gray-900',
                    'text-gray-900',
                    'dark:text-gray-200',
                    'cursor-default'
                );

                if (isChecked) {
                    element.classList.add(
                        'bg-gray-100',
                        'dark:bg-gray-800',
                        'text-gray-400',
                        'cursor-not-allowed'
                    );
                } else {
                    element.classList.add(
                        'bg-white',
                        'dark:bg-gray-900',
                        'text-gray-900',
                        'dark:text-gray-200',
                        'cursor-default'
                    );
                }
            });
        });
    }

    // ---------------------------------------------------------
    // Render Complete Computation Result
    // ---------------------------------------------------------

    function renderResult(result) {
        renderEarnings(result.earnings || {});
        renderSummary(result.summary || {});

        applySwitchStateToDOM();

        renderDeductions(
            result.deductions || {},
            result.contributions || {}
        );
    }

    // ---------------------------------------------------------
    // Reset Payroll Previews
    // ---------------------------------------------------------

    function resetPreviews() {
        panel.querySelectorAll('[id^="preview"]').forEach(element => {
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

            if (element) {
                element.textContent = money(0);
            }
        });
    }

    // ---------------------------------------------------------
    // Error Handling
    // ---------------------------------------------------------

    function showError(message) {
        const element = get('payrollComputationError');

        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        } else {
            console.error(message);
        }
    }

    function clearError() {
        const element = get('payrollComputationError');

        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
    }

    function getErrorMessage(responseData) {
        if (responseData?.errors) {
            const messages = Object.values(responseData.errors)
                .flat()
                .filter(Boolean);

            if (messages.length) {
                return messages.join('\n');
            }
        }

        return responseData?.message || 'Unable to compute payroll.';
    }

    // ---------------------------------------------------------
    // Cancel Active Request
    // ---------------------------------------------------------

    function cancelActiveRequest() {
        if (activeController) {
            activeController.abort();
            activeController = null;
        }
    }

    // ---------------------------------------------------------
    // Compute Payroll
    // ---------------------------------------------------------

    async function computePayroll() {
        const computeUrl = view.dataset.computeUrl;
        const clientId = view.dataset.clientId;
        const periodId = view.dataset.periodId;
        const employeeId = view.dataset.selectedEmployeeId;

        if (!computeUrl || !clientId || !periodId || !employeeId) {
            resetPreviews();
            return;
        }

        // Identify the current employee and period.
        const employeeKey = `${clientId}-${periodId}-${employeeId}`;

        // Reset backend switch initialization for a new employee.
        if (activeEmployeeKey !== employeeKey) {
            activeEmployeeKey = employeeKey;
            hasReceivedInitialSwitches = false;
        }

        // Cancel any previous request.
        cancelActiveRequest();

        activeController = new AbortController();

        const controller = activeController;
        const sequence = ++requestSequence;

        // Remember switch values when the request was sent.
        const sentSwitchState = {
            sss: switchState.switchSss,
            pagibig: switchState.switchPagibig,
            philhealth: switchState.switchPhilhealth
        };

        // Check whether restored switch settings should be preserved.
        const shouldSkipBackendSwitches = skipBackendSwitchesOnNextCompute;

        skipBackendSwitchesOnNextCompute = false;

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
                throw new Error('Invalid response received.');
            }

            if (!response.ok || responseData.success === false) {
                throw new Error(getErrorMessage(responseData));
            }

            // Ignore outdated requests.
            if (sequence !== requestSequence) {
                return;
            }

            // Verify that the selected employee and period are still the same.
            if (
                view.dataset.selectedEmployeeId !== String(employeeId) ||
                view.dataset.periodId !== String(periodId) ||
                view.dataset.clientId !== String(clientId)
            ) {
                return;
            }

            const result = responseData.data;

            if (!result || !result.summary) {
                throw new Error('Invalid payroll computation response.');
            }

            // -------------------------------------------------
            // Initialize Contribution Switches from Backend
            // -------------------------------------------------

            if (
                !hasReceivedInitialSwitches &&
                result.switches &&
                !shouldSkipBackendSwitches
            ) {
                if (typeof result.switches.deduct_sss === 'boolean') {
                    switchState.switchSss = result.switches.deduct_sss;
                }

                if (typeof result.switches.deduct_pagibig === 'boolean') {
                    switchState.switchPagibig = result.switches.deduct_pagibig;
                }

                if (typeof result.switches.deduct_philhealth === 'boolean') {
                    switchState.switchPhilhealth = result.switches.deduct_philhealth;
                }

                hasReceivedInitialSwitches = true;
            } else if (shouldSkipBackendSwitches) {
                hasReceivedInitialSwitches = true;
            }

            // Check if switches changed while the request was running.
            const switchChangedSinceSend =
                sentSwitchState.sss !== switchState.switchSss ||
                sentSwitchState.pagibig !== switchState.switchPagibig ||
                sentSwitchState.philhealth !== switchState.switchPhilhealth;

            // -------------------------------------------------
            // Render Result
            // -------------------------------------------------

            if (shouldSkipBackendSwitches || switchChangedSinceSend) {
                renderEarnings(result.earnings || {});
                renderSummary(result.summary || {});

                applySwitchStateToDOM();

                renderDeductions(
                    result.deductions || {},
                    result.contributions || {}
                );
            } else {
                renderResult(result);
            }

            // -------------------------------------------------
            // Persist Current State
            // -------------------------------------------------

            if (typeof persistState === 'function') {
                persistState();
            }

            // -------------------------------------------------
            // Notify Payroll Form / Other Deduction Manager
            // -------------------------------------------------

            view.dispatchEvent(
                new CustomEvent('payroll:computed', {
                    bubbles: true,
                    detail: result
                })
            );

        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }

            if (sequence !== requestSequence) {
                return;
            }

            showError(
                error.message || 'Payroll computation failed.'
            );

        } finally {
            if (sequence === requestSequence) {
                loadingElement?.classList.add('hidden');

                if (activeController === controller) {
                    activeController = null;
                }
            }
        }
    }

    // ---------------------------------------------------------
    // Schedule Computation
    // ---------------------------------------------------------

    function scheduleComputation(delay = 400) {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            if (typeof persistState === 'function') {
                persistState();
            }

            computePayroll();
        }, delay);
    }

    // ---------------------------------------------------------
    // Cancel Computation
    // ---------------------------------------------------------

    function cancelComputation() {
        clearTimeout(debounceTimer);

        requestSequence++;

        skipBackendSwitchesOnNextCompute = false;

        cancelActiveRequest();

        get('payrollComputationLoading')?.classList.add('hidden');
    }

    // ---------------------------------------------------------
    // Contribution Switch Event Listeners
    // ---------------------------------------------------------

    ['switchSss', 'switchPagibig', 'switchPhilhealth'].forEach(id => {
        const element = get(id);

        if (!element) return;

        element.addEventListener('change', event => {
            switchState[id] = event.target.checked;

            hasReceivedInitialSwitches = true;

            applySwitchStateToDOM();

            if (typeof persistState === 'function') {
                persistState();
            }

            scheduleComputation(50);
        });
    });

    // ---------------------------------------------------------
    // Manual Contribution Input Listeners
    // ---------------------------------------------------------

    const inputMapping = [
        { inputId: 'payrollSss', stateKey: 'switchSss' },
        { inputId: 'payrollSssEmployer', stateKey: 'switchSss' },

        { inputId: 'payrollPagibig', stateKey: 'switchPagibig' },
        { inputId: 'payrollPagibigEmployer', stateKey: 'switchPagibig' },

        { inputId: 'payrollPhilhealth', stateKey: 'switchPhilhealth' },
        { inputId: 'payrollPhilhealthEmployer', stateKey: 'switchPhilhealth' }
    ];

    inputMapping.forEach(({ inputId, stateKey }) => {
        const element = get(inputId);

        if (!element) return;

        element.addEventListener('input', () => {
            if (!switchState[stateKey]) {
                if (typeof persistState === 'function') {
                    persistState();
                }

                scheduleComputation(400);
            }
        });
    });

    // ---------------------------------------------------------
    // General Payroll Input Listeners
    // ---------------------------------------------------------

    panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
        const contributionInputs = [
            'payrollSss',
            'payrollSssEmployer',
            'payrollPagibig',
            'payrollPagibigEmployer',
            'payrollPhilhealth',
            'payrollPhilhealthEmployer'
        ];

        if (contributionInputs.includes(input.id)) {
            return;
        }

        input.addEventListener('input', () => {
            if (typeof persistState === 'function') {
                persistState();
            }

            scheduleComputation(400);
        });
    });

    // ---------------------------------------------------------
    // Initial DOM State
    // ---------------------------------------------------------

    applySwitchStateToDOM();

    // ---------------------------------------------------------
    // Public API
    // ---------------------------------------------------------

    return {
        computePayroll,
        scheduleComputation,
        cancelComputation,
        resetPreviews,
        setSwitchState,
        getSwitchState,
        skipBackendSwitchesOnce
    };
}
