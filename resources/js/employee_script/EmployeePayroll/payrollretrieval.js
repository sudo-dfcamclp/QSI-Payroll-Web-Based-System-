
/**
 * payrollretrieval.js
 *
 * Retrieves a saved employee_payroll record for the selected
 * client, cutoff, and employee.
 *
 * This module DOES NOT run payroll computation.
 */

export function createPayrollRetrieval({
    panel,
    view,
    get,
    persistState = () => {}
}) {
    let requestVersion = 0;

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    const money = value => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(Number(value) || 0);
    };

    function isChecked(value) {
        return (
            value === true ||
            value === 1 ||
            value === '1' ||
            value === 'true'
        );
    }

    function showMessage(message, isError = false) {
        const element = get('payrollComputationError');

        if (!element) return;

        element.textContent = message;
        element.classList.remove('hidden');

        element.classList.toggle('text-red-600', isError);
        element.classList.toggle('dark:text-red-400', isError);

        element.classList.toggle('text-gray-500', !isError);
        element.classList.toggle('dark:text-gray-400', !isError);
    }

    function hideMessage() {
        const element = get('payrollComputationError');

        if (!element) return;

        element.textContent = '';
        element.classList.add('hidden');
    }

    function setInputValue(element, value) {
        if (!element || !('value' in element)) return;

        if (element.type === 'checkbox') {
            element.checked = isChecked(value);
            return;
        }

        element.value = value ?? '';
    }

    // ---------------------------------------------------------
    // Database Field to Existing Form Field Mapping
    // ---------------------------------------------------------

    /*
     * Database field => Existing Blade input ID
     *
     * Direct ID, name, and data-payroll-field matching
     * are also supported as fallback.
     */

    const fieldAliases = {
        // Attendance
        days_present: 'payrollDaysWorked',
        days_worked: 'payrollDaysWorked',
        days_absent: 'payrollDaysAbsent',
        absent_ded: 'payrollDaysAbsent',

        tardy_hrs: 'payrollLateHours',
        tardiness_hours: 'payrollLateHours',

        // Regular overtime
        ot_hrs: 'payrollRegularHours',
        regular_ot_hrs: 'payrollRegularHours',
        regular_ot_hours: 'payrollRegularHours',

        // Night differential
        night_diff_hrs: 'payrollNightDiffHours',
        night_diff_hours: 'payrollNightDiffHours',

        // Rest day
        rest_day_hrs: 'payrollRestDayHours',
        rest_day_hours: 'payrollRestDayHours',

        rest_day_ot_hrs: 'payrollRestDayOtHours',
        rest_day_ot_hours: 'payrollRestDayOtHours',

        // Sunday overtime
        sunday_ot_hrs: 'payrollSundayOtHours',
        sunday_ot_hours: 'payrollSundayOtHours',

        // Special holiday
        sp_hol_days: 'payrollSpecialHolidayHours',
        special_holiday_days: 'payrollSpecialHolidayHours',

        sp_hol_ot_hrs: 'payrollSpecialHolidayOtHours',
        special_holiday_ot_hrs: 'payrollSpecialHolidayOtHours',

        // Special holiday rest day
        excess_sp_hol_ot_hrs: 'payrollSpecialHolidayRestDayHours',
        excess_sun_sp_hrs: 'payrollSpecialHolidayRestDayOtHours',

        // Legal holiday
        leg_hol_days: 'payrollLegalHolidayHours',
        regular_holiday_days: 'payrollLegalHolidayHours',

        leg_hol_ot_hrs: 'payrollLegalHolidayOtHours',
        regular_holiday_ot_hrs: 'payrollLegalHolidayOtHours',

        // Legal holiday rest day
        excess_leg_hol_ot_hrs: 'payrollLegalHolidayRestDayHours',
        excess_sun_leg_ot_hrs: 'payrollLegalHolidayRestDayOtHours',

        // Overtime without premium
        ot_no_prem_hrs: 'payrollOvertimeWithoutPremiumHours',

        // Leaves
        vl_days: 'payrollVacationLeaveDays',
        vacation_leave_days: 'payrollVacationLeaveDays',

        sl_days: 'payrollSickLeaveDays',
        sick_leave_days: 'payrollSickLeaveDays',

        // Allowances
        allowance: 'payrollFixedAllowance',
        load_allow: 'payrollLoadAllowance',
        meal_allow: 'payrollMealAllowance',
        transpo_allow: 'payrollTranspoAllowance',

        // Adjustments and earnings
        salary_adj: 'payrollAdjustment',
        salary_adjustment: 'payrollAdjustment',

        incentive_pay: 'payrollIncentive',
        ecola_pay: 'payrollEcola',
        m13_pay: 'payrollThirteenthMonth',
        thirteenth_month_pay: 'payrollThirteenthMonth',

        // Deductions
        tardy_ded: 'payrollLateHoursDeduction',
        absent_deduction: 'payrollDaysAbsentDeduction',

        // Government contributions
        sss_ee: 'payrollSss',
        sss_er: 'payrollSssEmployer',

        pagibig_ee: 'payrollPagibig',
        pagibig_er: 'payrollPagibigEmployer',

        philhealth_ee: 'payrollPhilhealth',
        philhealth_er: 'payrollPhilhealthEmployer',

        wtax: 'payrollWithholdingTax'
    };

    function findFieldElements(fieldName) {
        const elements = new Set();

        // Direct ID match.
        const directId = get(fieldName);

        if (directId) {
            elements.add(directId);
        }

        // Existing Blade input alias.
        const alias = fieldAliases[fieldName];

        if (alias) {
            const aliasElement = get(alias);

            if (aliasElement) {
                elements.add(aliasElement);
            }
        }

        // Match data-payroll-field or name.
        panel.querySelectorAll(
            '[data-payroll-field], input[name], select[name], textarea[name]'
        ).forEach(element => {
            if (
                element.dataset.payrollField === fieldName ||
                element.name === fieldName
            ) {
                elements.add(element);
            }
        });

        return [...elements];
    }

    function populateFormFields(record) {
        Object.entries(record).forEach(([fieldName, value]) => {
            // Do not attempt to put objects or arrays into form inputs.
            if (
                value !== null &&
                typeof value === 'object'
            ) {
                return;
            }

            const elements = findFieldElements(fieldName);

            elements.forEach(element => {
                setInputValue(element, value);
            });
        });
    }

    // ---------------------------------------------------------
    // Contribution Switches
    // ---------------------------------------------------------

    function populateContributionSwitches(record) {
        const switches = {
            deduct_sss: 'switchSss',
            deduct_pagibig: 'switchPagibig',
            deduct_philhealth: 'switchPhilhealth'
        };

        Object.entries(switches).forEach(([field, id]) => {
            const element = get(id);

            if (!element || record[field] === undefined) {
                return;
            }

            element.checked = isChecked(record[field]);
        });
    }

    // ---------------------------------------------------------
    // Payroll Preview Mapping
    // ---------------------------------------------------------

    /*
     * Each preview supports the saved database field name
     * and the computation response field name.
     *
     * data-preview-key is also used as a fallback.
     */

    const previewMap = {
        basic_pay: 'previewDaysWorked',

        ot_pay: 'previewRegularOT',
        regular_ot_pay: 'previewRegularOT',

        night_diff_pay: 'previewNightDiff',

        rest_day_pay: 'previewRestDay',
        rest_day_ot_pay: 'previewRestDayOT',

        sunday_ot_pay: 'previewSundayOT',

        sp_hol_pay: 'previewSpecialHoliday',
        special_holiday_pay: 'previewSpecialHoliday',

        sp_hol_ot_pay: 'previewSpecialHolidayOT',
        special_holiday_ot_pay: 'previewSpecialHolidayOT',

        excess_ot_pay: 'previewSpecialHolidayRestDay',
        excess_sp_hol_ot_pay: 'previewSpecialHolidayRestDay',

        excess_sun_sp_pay: 'previewSpecialHolidayRestDayOT',
        excess_sun_special_ot_pay: 'previewSpecialHolidayRestDayOT',

        leg_hol_pay: 'previewLegalHoliday',
        regular_holiday_pay: 'previewLegalHoliday',

        leg_hol_ot_pay: 'previewLegalHolidayOT',
        regular_holiday_ot_pay: 'previewLegalHolidayOT',

        excess_leg_hol_ot_pay: 'previewLegalHolidayRestDay',

        excess_sun_leg_ot_pay: 'previewLegalHolidayRestDayOT',
        excess_sun_legal_ot_pay: 'previewLegalHolidayRestDayOT',

        sl_pay: 'previewSickLeave',
        sick_leave_pay: 'previewSickLeave',

        vl_pay: 'previewVacationLeave',
        vacation_leave_pay: 'previewVacationLeave',

        allowance: 'previewFixedAllowance',
        load_allow: 'previewLoadAllowance',
        meal_allow: 'previewMealAllowance',
        transpo_allow: 'previewTranspoAllowance',

        salary_adj: 'previewAdjustment',
        salary_adjustment: 'previewAdjustment',

        incentive_pay: 'previewIncentive',
        ecola_pay: 'previewEcola',

        m13_pay: 'preview13thMonth',
        thirteenth_month_pay: 'preview13thMonth',

        absent_ded: 'previewDaysAbsent',
        tardy_ded: 'previewLateHours',

        sss_ee: 'previewSSS',
        pagibig_ee: 'previewPagibig',
        philhealth_ee: 'previewPhilhealth',
        wtax: 'previewWithholdingTax'
    };

    function renderPreviews(record) {
        const renderedElements = new Set();

        Object.entries(previewMap).forEach(([fieldName, elementId]) => {
            const element = get(elementId);

            if (
                !element ||
                record[fieldName] === undefined ||
                renderedElements.has(element)
            ) {
                return;
            }

            element.textContent = money(record[fieldName]);
            renderedElements.add(element);
        });

        // Fallback: use Blade data-preview-key attributes.
        panel.querySelectorAll('[data-preview-key]').forEach(element => {
            const fieldName = element.dataset.previewKey;

            if (
                !fieldName ||
                record[fieldName] === undefined ||
                renderedElements.has(element)
            ) {
                return;
            }

            element.textContent = money(record[fieldName]);
            renderedElements.add(element);
        });

        // Gross pay.
        if (record.gross_pay !== undefined) {
            const grossPay = money(record.gross_pay);

            ['payrollGrossPay', 'payrollSummaryGross'].forEach(id => {
                const element = get(id);

                if (element) {
                    element.textContent = grossPay;
                }
            });
        }

        // Total deductions.
        if (record.total_ded !== undefined) {
            const totalDeductions = money(record.total_ded);

            [
                'payrollTotalDeductions',
                'payrollSummaryDeductions'
            ].forEach(id => {
                const element = get(id);

                if (element) {
                    element.textContent = totalDeductions;
                }
            });
        }

        // Net pay.
        if (record.net_pay !== undefined) {
            const netPay = get('payrollNetPay');

            if (netPay) {
                netPay.textContent = money(record.net_pay);
            }
        }
    }

    // ---------------------------------------------------------
    // Extract Saved Other Deductions
    // ---------------------------------------------------------

    function getSavedDeductions(result, record) {
        return (
            result.other_deductions ||
            result.deductions_list ||
            result.data?.other_deductions ||
            record.other_deductions ||
            record.deductions ||
            []
        );
    }

    // ---------------------------------------------------------
    // Resolve Payroll Record
    // ---------------------------------------------------------

    function resolvePayrollRecord(result) {
        return (
            result.payroll ||
            result.data?.payroll ||
            result.data ||
            result.record ||
            null
        );
    }

    // ---------------------------------------------------------
    // Retrieve Saved Payroll
    // ---------------------------------------------------------

    async function load({
        clientId,
        periodId,
        empId
    }) {
        const currentRequest = ++requestVersion;

        if (!clientId || !periodId || !empId) {
            showMessage(
                'Missing client, cutoff, or employee information.',
                true
            );

            return null;
        }

        const retrievalUrl = view.dataset.payrollRetrievalUrl;

        if (!retrievalUrl) {
            showMessage(
                'Payroll retrieval API URL is missing. Please configure data-payroll-retrieval-url.',
                true
            );

            return null;
        }

        showMessage('Loading saved payroll record...');

        try {
            const url = new URL(
                retrievalUrl,
                window.location.origin
            );

            url.searchParams.set('client_id', clientId);
            url.searchParams.set('period_id', periodId);
            url.searchParams.set('emp_id', empId);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                },
                credentials: 'same-origin'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Unable to retrieve payroll. HTTP ${response.status}`
                );
            }

            // Ignore outdated requests.
            if (currentRequest !== requestVersion) {
                return null;
            }

            // Confirm that the selected employee has not changed.
            if (
                view.dataset.clientId !== String(clientId) ||
                view.dataset.periodId !== String(periodId) ||
                view.dataset.selectedEmployeeId !== String(empId)
            ) {
                return null;
            }

            if (result.success === false) {
                throw new Error(
                    result.message ||
                    'Saved payroll record not found.'
                );
            }

            const record = resolvePayrollRecord(result);

            if (
                !record ||
                typeof record !== 'object' ||
                Array.isArray(record)
            ) {
                throw new Error(
                    'Invalid saved payroll response from the server.'
                );
            }

            // Populate saved payroll inputs.
            populateFormFields(record);

            // Restore contribution switches.
            populateContributionSwitches(record);

            // Display saved payroll amounts.
            renderPreviews(record);

            // Retrieve separately stored other deductions.
            const otherDeductions = getSavedDeductions(
                result,
                record
            );

            // Update selected payroll state.
            view.dataset.selectedPayrollStatus = 'done';

            view.dataset.savedPayrollId =
                record.payroll_id ??
                record.id ??
                '';

            // Persist the restored form state.
            persistState();

            hideMessage();

            // Notify other modules that saved payroll was loaded.
            view.dispatchEvent(
                new CustomEvent('payroll:saved-record-loaded', {
                    detail: {
                        payroll: record,
                        otherDeductions,
                        clientId,
                        periodId,
                        empId
                    }
                })
            );

            return record;

        } catch (error) {
            if (currentRequest !== requestVersion) {
                return null;
            }

            console.error(
                'Saved payroll retrieval error:',
                error
            );

            showMessage(
                error.message ||
                'Unable to retrieve saved payroll record.',
                true
            );

            return null;
        }
    }

    // ---------------------------------------------------------
    // Cancel
    // ---------------------------------------------------------

    function cancel() {
        requestVersion++;
        hideMessage();
    }

    return {
        load,
        cancel
    };
}
