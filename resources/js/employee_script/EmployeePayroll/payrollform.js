import { savePayrollState, loadPayrollState } from './localstorage.js';

export function initializePayrollForm(ctx, options = {}) {
    const panel = ctx.panel;
    const get = id => panel.querySelector(`#${id}`);
    const view = get('payrollTransactionView');

    if (!view) return;

    const clientName =
        options.clientName ||
        get('payrollCutoffListView')?.dataset.clientName ||
        '';

    const cutoff = options.cutoff || null;

    const clientId = String(
        options.clientId ||
        cutoff?.client_id ||
        view.dataset.clientId ||
        ''
    );

    const periodId = String(
        options.periodId ||
        cutoff?.period_id ||
        view.dataset.periodId ||
        ''
    );

    const storageKey = `payroll_form_${clientId}_${periodId}`;

    const money = value =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(Number(value) || 0);

    if (clientId) {
        view.dataset.clientId = clientId;
    }

    if (periodId) {
        view.dataset.periodId = periodId;
    }

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

            tab.classList.remove(...activeClasses, ...inactiveClasses);
            tab.classList.add(...(isActive ? activeClasses : inactiveClasses));
        });

        if (view.dataset.payrollFormInitialized === 'true') {
            persistState();
        }
    }

    const numberInputs = [
        ...panel.querySelectorAll('.payroll-number, .payroll-money')
    ];

    function getDeductions() {
        return [...panel.querySelectorAll('#payrollOtherDeductions tr')]
            .filter(row => row.querySelector('.payroll-other-deduction-type'))
            .map(row => ({
                type: row.querySelector('.payroll-other-deduction-type')?.value || '',
                amount: row.querySelector('.payroll-other-deduction-amount')?.value || '0'
            }));
    }

    function persistState() {
        if (!clientId || !periodId) return;

        const fields = {};

        panel.querySelectorAll(
            'input[id], select[id], textarea[id]'
        ).forEach(input => {
            if (
                input.id === 'payrollClientName' ||
                input.id === 'payrollCutoffPeriod' ||
                input.id === 'payrollCutoffNumber' ||
                input.id === 'payrollPayDate'
            ) {
                return;
            }

            fields[input.id] = input.value;
        });

        const activeTab =
            donePanel && !donePanel.classList.contains('hidden')
                ? 'done'
                : 'pending';

        const data = {
            clientId,
            clientName,
            periodId,
            cutoff: cutoff ? {
                period_id: cutoff.period_id,
                cutoff_no: cutoff.cutoff_no,
                start_date: cutoff.start_date,
                end_date: cutoff.end_date,
                pay_date: cutoff.pay_date
            } : null,
            fields,
            deductions: getDeductions(),
            activeTab,
            selectedEmployeeId: view.dataset.selectedEmployeeId || '',
            selectedEmployeeRates: view.dataset.selectedEmployeeRates || '[]',
            selectedPayrollStatus: view.dataset.selectedPayrollStatus || '',
            savedAt: new Date().toISOString()
        };

        try {
            savePayrollState(storageKey, data);
        } catch (error) {
            console.error('Unable to save payroll state:', error);
        }
    }

    function restoreState() {
        let saved;

        try {
            saved = loadPayrollState(storageKey);
        } catch (error) {
            console.error('Unable to restore payroll state:', error);
            return null;
        }

        if (!saved || typeof saved !== 'object') return null;

        if (
            String(saved.clientId) !== clientId ||
            String(saved.periodId) !== periodId
        ) {
            return null;
        }

        Object.entries(saved.fields || {}).forEach(([id, value]) => {
            const input = get(id);

            if (input && 'value' in input) {
                input.value = value ?? '';
            }
        });

        const tbody = get('payrollOtherDeductions');

        if (tbody) {
            tbody.replaceChildren();

            const deductions = Array.isArray(saved.deductions)
                ? saved.deductions
                : [];

            if (!deductions.length) {
                const row = document.createElement('tr');
                row.id = 'payrollNoDeductions';

                const cell = document.createElement('td');
                cell.colSpan = 3;
                cell.className = 'px-3 py-8 text-center text-xs text-gray-400';
                cell.textContent = 'No additional deductions';

                row.appendChild(cell);
                tbody.appendChild(row);
            } else {
                deductions.forEach(deduction => {
                    addDeductionRow(deduction.type, deduction.amount, false);
                });
            }
        }

        view.dataset.selectedEmployeeId = saved.selectedEmployeeId || '';
        view.dataset.selectedEmployeeRates = saved.selectedEmployeeRates || '[]';
        view.dataset.selectedPayrollStatus = saved.selectedPayrollStatus || '';

        return saved;
    }

    function calculate() {
        const sum = selector =>
            [...panel.querySelectorAll(selector)].reduce(
                (total, input) => total + (Number(input.value) || 0),
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
            item.classList.toggle(
                'hidden',
                !(item.dataset.employeeName || '').toLowerCase().includes(query)
            );
        });
    }

    function addDeductionRow(type = '', amount = '0', shouldCalculate = true) {
        const tbody = get('payrollOtherDeductions');
        if (!tbody) return;

        get('payrollNoDeductions')?.remove();

        const row = document.createElement('tr');
        row.className = 'border-t border-gray-100 dark:border-gray-700';

        const typeCell = document.createElement('td');
        typeCell.className = 'px-3 py-2';

        const typeInput = document.createElement('input');
        typeInput.type = 'text';
        typeInput.maxLength = 100;
        typeInput.placeholder = 'Deduction type';
        typeInput.className =
            'payroll-other-deduction-type w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200';
        typeInput.value = type;

        typeCell.appendChild(typeInput);

        const amountCell = document.createElement('td');
        amountCell.className = 'px-3 py-2';

        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.min = '0';
        amountInput.step = '0.01';
        amountInput.className =
            'payroll-other-deduction-amount w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200';
        amountInput.value = amount ?? '0';

        amountCell.appendChild(amountInput);

        const actionCell = document.createElement('td');
        actionCell.className = 'px-2 py-2 text-center';

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className =
            'payroll-remove-deduction rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20';
        removeButton.setAttribute('aria-label', 'Remove deduction');
        removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        actionCell.appendChild(removeButton);
        row.append(typeCell, amountCell, actionCell);
        tbody.appendChild(row);

        typeInput.addEventListener('input', persistState);

        amountInput.addEventListener('input', () => {
            calculate();
            persistState();
        });

        removeButton.addEventListener('click', () => {
            row.remove();

            if (!tbody.querySelector('.payroll-other-deduction-type')) {
                const emptyRow = document.createElement('tr');
                emptyRow.id = 'payrollNoDeductions';

                const cell = document.createElement('td');
                cell.colSpan = 3;
                cell.className = 'px-3 py-8 text-center text-xs text-gray-400';
                cell.textContent = 'No additional deductions';

                emptyRow.appendChild(cell);
                tbody.appendChild(emptyRow);
            }

            calculate();
            persistState();
        });

        if (shouldCalculate) calculate();
    }

    async function loadEmployees() {
        const pendingList = get('payrollPendingEmployees');
        const doneList = get('payrollDoneEmployees');
        const pendingCount = get('payrollPendingCount');
        const doneCount = get('payrollDoneCount');

        if (!pendingList || !doneList) return;

        if (!clientId || !periodId) {
            view.dataset.employeesLoaded = 'false';
            pendingList.textContent = 'Please select a client and cutoff first.';
            doneList.replaceChildren();

            if (pendingCount) pendingCount.textContent = '0';
            if (doneCount) doneCount.textContent = '0';

            return;
        }

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
        view.dataset.selectedPayrollStatus = '';

        pendingList.replaceChildren();
        doneList.replaceChildren();

        const loading = document.createElement('div');
        loading.className = 'p-3 text-sm text-gray-500 dark:text-gray-400';
        loading.textContent = 'Loading employees...';

        pendingList.appendChild(loading);
        doneList.appendChild(loading.cloneNode(true));

        if (pendingCount) pendingCount.textContent = '0';
        if (doneCount) doneCount.textContent = '0';

        try {
            const employeesUrl = view.dataset.employeesUrl;

            if (!employeesUrl) {
                throw new Error('Employee API URL is missing.');
            }

            const url = new URL(employeesUrl, window.location.origin);
            url.searchParams.set('client_id', clientId);
            url.searchParams.set('period_id', periodId);

            const response = await fetch(url.toString(), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`Failed to load employees. HTTP ${response.status}`);
            }

            const result = await response.json();

            if (
                view.dataset.clientId !== clientId ||
                view.dataset.periodId !== periodId ||
                view.dataset.employeeRequestKey !== requestKey
            ) {
                return;
            }

            if (
                !result ||
                !Array.isArray(result.pending) ||
                !Array.isArray(result.done)
            ) {
                throw new Error('Invalid Pending/Done API response.');
            }

            pendingList.replaceChildren();
            doneList.replaceChildren();

            if (pendingCount) {
                pendingCount.textContent = String(
                    result.pending_count ?? result.pending.length
                );
            }

            if (doneCount) {
                doneCount.textContent = String(
                    result.done_count ?? result.done.length
                );
            }

            function renderEmployee(employee, list) {
                const button = document.createElement('button');

                const name = [
                    employee.last_name,
                    employee.first_name,
                    employee.middle_name
                ].filter(Boolean).join(', ');

                button.type = 'button';
                button.dataset.employeeName = name;
                button.dataset.employeeId = employee.emp_id;
                button.className =
                    'w-full rounded-lg border border-transparent p-3 text-left transition hover:border-green-200 hover:bg-green-50 dark:hover:border-green-800 dark:hover:bg-green-900/20';

                const title = document.createElement('div');
                title.className =
                    'text-sm font-medium text-gray-800 dark:text-gray-200';
                title.textContent = name || 'Unnamed employee';

                const subtitle = document.createElement('div');
                subtitle.className =
                    'mt-1 text-xs text-gray-500 dark:text-gray-400';
                subtitle.textContent = `Employee ID: ${employee.emp_id}`;

                button.append(title, subtitle);

                button.addEventListener('click', () => {
                    view.dataset.selectedEmployeeId = String(employee.emp_id);
                    view.dataset.selectedEmployeeRates =
                        JSON.stringify(employee.basic_rates || []);
                    view.dataset.selectedPayrollStatus =
                        employee.payroll_status || '';

                    if (get('payrollSidebarEmployee')) {
                        get('payrollSidebarEmployee').textContent =
                            name || 'Unnamed employee';
                    }

                    panel.querySelectorAll(
                        '#payrollPendingEmployees button, #payrollDoneEmployees button'
                    ).forEach(item => {
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

                    persistState();
                });

                list.appendChild(button);
            }

            function renderList(employees, list, message) {
                if (!employees.length) {
                    const empty = document.createElement('div');
                    empty.className =
                        'p-3 text-sm text-gray-500 dark:text-gray-400';
                    empty.textContent = message;
                    list.appendChild(empty);
                    return;
                }

                employees.forEach(employee => renderEmployee(employee, list));
            }

            renderList(
                result.pending,
                pendingList,
                'No pending employees for this cutoff.'
            );

            renderList(
                result.done,
                doneList,
                'No completed payroll records for this cutoff.'
            );

            filterEmployees(get('payrollEmployeeSearch'), pendingList);
            filterEmployees(get('payrollDoneSearch'), doneList);

            view.dataset.employeesLoaded = 'true';

            const selectedId = view.dataset.selectedEmployeeId;

            if (selectedId) {
                const selectedButton = panel.querySelector(
                    `[data-employee-id="${CSS.escape(selectedId)}"]`
                );

                selectedButton?.click();
            }
        } catch (error) {
            if (view.dataset.employeeRequestKey !== requestKey) return;

            view.dataset.employeesLoaded = 'false';
            pendingList.replaceChildren();
            doneList.replaceChildren();

            const message = document.createElement('div');
            message.className = 'p-3 text-sm text-red-600 dark:text-red-400';
            message.textContent =
                'Unable to load employees. Please refresh and try again.';

            pendingList.appendChild(message);
            doneList.appendChild(message.cloneNode(true));

            console.error('Payroll employee loading error:', error);
        }
    }

    if (!view.dataset.payrollTabsInitialized) {
        view.dataset.payrollTabsInitialized = 'true';

        pendingTab?.addEventListener('click', () => activatePayrollTab(pendingTab));
        doneTab?.addEventListener('click', () => activatePayrollTab(doneTab));
    }

    const savedState = restoreState();

    if (!view.dataset.payrollFormInitialized) {
        view.dataset.payrollFormInitialized = 'true';

        numberInputs.forEach(input => {
            input.addEventListener('input', () => {
                calculate();
                persistState();
            });
        });

        get('payrollAddDeductionButton')?.addEventListener('click', () => {
            addDeductionRow('', '0');
            persistState();
        });

        get('payrollRefreshButton')?.addEventListener('click', () => {
            panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => {
                input.value = '0';
            });

            const tbody = get('payrollOtherDeductions');

            if (tbody) {
                tbody.replaceChildren();

                const row = document.createElement('tr');
                row.id = 'payrollNoDeductions';

                const cell = document.createElement('td');
                cell.colSpan = 3;
                cell.className = 'px-3 py-8 text-center text-xs text-gray-400';
                cell.textContent = 'No additional deductions';

                row.appendChild(cell);
                tbody.appendChild(row);
            }

            calculate();
            persistState();
        });

        get('payrollPrintButton')?.addEventListener('click', () => window.print());

        get('payrollEmployeeSearch')?.addEventListener('input', event => {
            filterEmployees(event.target, get('payrollPendingEmployees'));
        });

        get('payrollDoneSearch')?.addEventListener('input', event => {
            filterEmployees(event.target, get('payrollDoneEmployees'));
        });

        get('payrollSaveButton')?.addEventListener('click', () => {
            persistState();

            alert(
                'Payroll form saved locally in this browser. This does not submit payroll data to the server.'
            );
        });

        panel.addEventListener('input', event => {
            if (
                event.target.matches(
                    'input[id], select[id], textarea[id], .payroll-other-deduction-type'
                )
            ) {
                persistState();
            }
        });

        panel.addEventListener('change', event => {
            if (event.target.matches('input, select, textarea')) {
                persistState();
            }
        });
    }

    activatePayrollTab(
        savedState?.activeTab === 'done' ? doneTab : pendingTab
    );

    calculate();
    loadEmployees();
}