
export function initializePayrollForm(ctx, options = {}) {
    const panel = ctx.panel;
    const get = id => panel.querySelector(`#${id}`);

    const money = value =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(Number(value) || 0);

    const view = get('payrollTransactionView');
    if (!view) return;

    const clientName =
        options.clientName ||
        get('payrollCutoffListView')?.dataset.clientName ||
        '';

    const cutoff = options.cutoff || null;

    // Selected IDs: prefer the values passed by the caller.
    const clientId =
        options.clientId ||
        view.dataset.clientId ||
        '';

    const periodId =
        options.periodId ||
        cutoff?.period_id ||
        view.dataset.periodId ||
        '';

    if (get('payrollClientName')) {
        get('payrollClientName').value = clientName;
    }

    if (get('payrollSidebarClient')) {
        get('payrollSidebarClient').textContent = clientName || '—';
    }

    if (cutoff) {
        const start = cutoff.start_date || '';
        const end = cutoff.end_date || '';
        const period = start && end ? `${start} - ${end}` : '';

        if (get('payrollCutoffPeriod')) {
            get('payrollCutoffPeriod').value = period;
        }

        if (get('payrollCutoffNumber')) {
            get('payrollCutoffNumber').value = cutoff.cutoff_no ?? '';
        }

        if (get('payrollSidebarCutoff')) {
            get('payrollSidebarCutoff').textContent = period || '—';
        }

        if (get('payrollPayDate')) {
            get('payrollPayDate').value = cutoff.pay_date || '';
        }
    }

    // Keep selected IDs available to other payroll scripts.
    if (clientId) {
        view.dataset.clientId = String(clientId);
    }

    if (periodId) {
        view.dataset.periodId = String(periodId);
    }

    const pendingTab = get('payrollPendingTab');
    const doneTab = get('payrollDoneTab');
    const pendingPanel = get('payrollPendingPanel');
    const donePanel = get('payrollDonePanel');

    function activatePayrollTab(activeTab) {
        const showPending = activeTab === pendingTab;

        pendingPanel?.classList.toggle('hidden', !showPending);
        donePanel?.classList.toggle('hidden', showPending);
        donePanel?.classList.toggle('flex', !showPending);

        pendingTab?.setAttribute('aria-selected', String(showPending));
        doneTab?.setAttribute('aria-selected', String(!showPending));

        const activeClasses = [
            'bg-white',
            'font-semibold',
            'text-green-700',
            'shadow-sm',
            'dark:bg-gray-700',
            'dark:text-green-400'
        ];

        const inactiveClasses = [
            'font-medium',
            'text-gray-500',
            'dark:text-gray-400'
        ];

        [pendingTab, doneTab].forEach((tab, index) => {
            if (!tab) return;

            const isActive = showPending ? index === 0 : index === 1;

            tab.classList.remove(
                ...activeClasses,
                ...inactiveClasses
            );

            tab.classList.add(
                ...(isActive ? activeClasses : inactiveClasses)
            );
        });
    }

    if (!view.dataset.payrollTabsInitialized) {
        view.dataset.payrollTabsInitialized = 'true';

        pendingTab?.addEventListener('click', () => {
            activatePayrollTab(pendingTab);
        });

        doneTab?.addEventListener('click', () => {
            activatePayrollTab(doneTab);
        });
    }

    activatePayrollTab(
        donePanel && !donePanel.classList.contains('hidden')
            ? doneTab
            : pendingTab
    );

    const numberInputs = [
        ...panel.querySelectorAll('.payroll-number, .payroll-money')
    ];

    function calculate() {
        const sum = selector =>
            [...panel.querySelectorAll(selector)].reduce(
                (total, input) =>
                    total + (Number(input.value) || 0),
                0
            );

        const earnings = sum(
            '.payroll-money[id^="payrollFixed"], ' +
            '#payrollAdjustment, ' +
            '#payrollIncentive, ' +
            '#payrollEcola, ' +
            '#payrollThirteenthMonth'
        );

        const deductions =
            sum(
                '#payrollSss, ' +
                '#payrollPagibig, ' +
                '#payrollPhilhealth, ' +
                '#payrollWithholdingTax'
            ) +
            sum('.payroll-other-deduction-amount');

        const gross = Math.max(0, earnings);
        const net = gross - deductions;

        if (get('payrollGrossPay')) {
            get('payrollGrossPay').textContent = money(gross);
        }

        if (get('payrollTotalDeductions')) {
            get('payrollTotalDeductions').textContent = money(deductions);
        }

        if (get('payrollSummaryGross')) {
            get('payrollSummaryGross').textContent = money(gross);
        }

        if (get('payrollSummaryDeductions')) {
            get('payrollSummaryDeductions').textContent = money(deductions);
        }

        if (get('payrollNetPay')) {
            get('payrollNetPay').textContent = money(net);
        }
    }

    function filterEmployees(input, list) {
        if (!input || !list) return;

        const query = input.value.trim().toLowerCase();

        list.querySelectorAll('[data-employee-name]').forEach(item => {
            const name = (
                item.dataset.employeeName || ''
            ).toLowerCase();

            item.classList.toggle(
                'hidden',
                !name.includes(query)
            );
        });
    }

    async function loadEmployees() {
        const list = get('payrollPendingEmployees');
        const count = get('payrollPendingCount');

        if (!list) return;

        // Avoid fetching without both selected IDs.
        if (!clientId || !periodId) {
            view.dataset.employeesLoaded = 'false';
            list.textContent =
                'Please select a client and cutoff first.';

            if (count) count.textContent = '0';
            return;
        }

        // Prevent duplicate requests for the same client and cutoff.
        const requestKey = `${clientId}:${periodId}`;

        if (
            view.dataset.employeesLoaded === 'true' &&
            view.dataset.employeeRequestKey === requestKey
        ) {
            return;
        }

        view.dataset.employeesLoaded = 'false';
        view.dataset.employeeRequestKey = requestKey;
        view.dataset.selectedEmployeeId = '';
        view.dataset.selectedEmployeeRates = '[]';

        list.replaceChildren();

        const loadingMessage = document.createElement('div');
        loadingMessage.className =
            'p-3 text-sm text-gray-500 dark:text-gray-400';
        loadingMessage.textContent = 'Loading employees...';

        list.appendChild(loadingMessage);

        if (count) count.textContent = '0';

        try {
            const employeesUrl = view.dataset.employeesUrl;

            if (!employeesUrl) {
                throw new Error(
                    'Employee API URL is missing from the payroll form.'
                );
            }

            const url = new URL(
                employeesUrl,
                window.location.origin
            );

            url.searchParams.set('client_id', clientId);
            url.searchParams.set('period_id', periodId);

            const response = await fetch(url.toString(), {
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                const errorDetails = await response.text();

                console.error(
                    'Employee API error:',
                    response.status,
                    errorDetails
                );

                throw new Error(
                    `Failed to load employees. HTTP ${response.status}`
                );
            }

            const employees = await response.json();

            // Ignore results if another client/cutoff was selected
            // while this request was still running.
            if (
                view.dataset.clientId !== String(clientId) ||
                view.dataset.periodId !== String(periodId) ||
                view.dataset.employeeRequestKey !== requestKey
            ) {
                return;
            }

            if (!Array.isArray(employees)) {
                throw new Error(
                    'Invalid employee API response. Expected an array.'
                );
            }

            list.replaceChildren();

            if (count) {
                count.textContent = String(employees.length);
            }

            if (employees.length === 0) {
                list.textContent =
                    'No employees found for the selected client and cutoff.';

                view.dataset.employeesLoaded = 'true';
                return;
            }

            employees.forEach(employee => {
                const button = document.createElement('button');

                const name = [
                    employee.last_name,
                    employee.first_name,
                    employee.middle_name
                ]
                    .filter(Boolean)
                    .join(', ');

                button.type = 'button';
                button.dataset.employeeName = name;
                button.dataset.employeeId = employee.emp_id;

                button.className =
                    'w-full rounded-lg border border-transparent p-3 ' +
                    'text-left transition hover:border-green-200 ' +
                    'hover:bg-green-50 dark:hover:border-green-800 ' +
                    'dark:hover:bg-green-900/20';

                const title = document.createElement('div');

                title.className =
                    'text-sm font-medium text-gray-800 dark:text-gray-200';

                title.textContent = name || 'Unnamed employee';

                const subtitle = document.createElement('div');

                subtitle.className =
                    'mt-1 text-xs text-gray-500 dark:text-gray-400';

                subtitle.textContent =
                    `Employee ID: ${employee.emp_id}`;

                button.append(title, subtitle);

                button.addEventListener('click', () => {
                    view.dataset.selectedEmployeeId =
                        employee.emp_id;

                    view.dataset.selectedEmployeeRates =
                        JSON.stringify(employee.basic_rates || []);

                    if (get('payrollSidebarEmployee')) {
                        get('payrollSidebarEmployee').textContent =
                            name || 'Unnamed employee';
                    }

                    list.querySelectorAll('button').forEach(item => {
                        item.classList.remove(
                            'border-green-300',
                            'bg-green-50',
                            'dark:bg-green-900/20'
                        );
                    });

                    button.classList.add(
                        'border-green-300',
                        'bg-green-50',
                        'dark:bg-green-900/20'
                    );
                });

                list.appendChild(button);
            });

            filterEmployees(
                get('payrollEmployeeSearch'),
                list
            );

            view.dataset.employeesLoaded = 'true';
        } catch (error) {
            view.dataset.employeesLoaded = 'false';

            list.replaceChildren();

            const errorMessage = document.createElement('div');
            errorMessage.className =
                'p-3 text-sm text-red-600 dark:text-red-400';
            errorMessage.textContent =
                'Unable to load employees. Please refresh and try again.';

            list.appendChild(errorMessage);

            console.error(error);
        }
    }

    loadEmployees();

    if (!view.dataset.payrollFormInitialized) {
        view.dataset.payrollFormInitialized = 'true';

        numberInputs.forEach(input => {
            input.addEventListener('input', calculate);
        });

        get('payrollAddDeductionButton')?.addEventListener(
            'click',
            () => {
                const tbody = get('payrollOtherDeductions');
                if (!tbody) return;

                get('payrollNoDeductions')?.remove();

                const row = document.createElement('tr');

                row.className =
                    'border-t border-gray-100 dark:border-gray-700';

                row.innerHTML = `
                    <td class="px-3 py-2">
                        <input
                            type="text"
                            maxlength="100"
                            placeholder="Deduction type"
                            class="w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 payroll-other-deduction-type"
                        >
                    </td>
                    <td class="px-3 py-2">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value="0"
                            class="payroll-other-deduction-amount w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                    </td>
                    <td class="px-2 py-2 text-center">
                        <button
                            type="button"
                            class="payroll-remove-deduction rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            aria-label="Remove deduction"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);

                row.querySelector('.payroll-other-deduction-amount')
                    .addEventListener('input', calculate);

                row.querySelector('.payroll-remove-deduction')
                    .addEventListener('click', () => {
                        row.remove();

                        if (!tbody.querySelector('tr')) {
                            tbody.innerHTML = `
                                <tr id="payrollNoDeductions">
                                    <td colspan="3" class="px-3 py-8 text-center text-xs text-gray-400">
                                        No additional deductions
                                    </td>
                                </tr>
                            `;
                        }

                        calculate();
                    });

                row.querySelector(
                    '.payroll-other-deduction-type'
                ).focus();

                calculate();
            }
        );

        get('payrollRefreshButton')?.addEventListener(
            'click',
            () => {
                panel
                    .querySelectorAll('.payroll-number, .payroll-money')
                    .forEach(input => {
                        input.value = '0';
                    });

                if (get('payrollOtherDeductions')) {
                    get('payrollOtherDeductions').innerHTML = `
                        <tr id="payrollNoDeductions">
                            <td colspan="3" class="px-3 py-8 text-center text-xs text-gray-400">
                                No additional deductions
                            </td>
                        </tr>
                    `;
                }

                calculate();
            }
        );

        get('payrollPrintButton')?.addEventListener(
            'click',
            () => window.print()
        );

        get('payrollEmployeeSearch')?.addEventListener(
            'input',
            event => {
                filterEmployees(
                    event.target,
                    get('payrollPendingEmployees')
                );
            }
        );

        get('payrollDoneSearch')?.addEventListener(
            'input',
            event => {
                filterEmployees(
                    event.target,
                    get('payrollDoneEmployees')
                );
            }
        );

        get('payrollSaveButton')?.addEventListener('click', () => {
            alert(
                'Static UI only. Payroll saving will be connected to the backend in a later step.'
            );
        });
    }

    calculate();
}
