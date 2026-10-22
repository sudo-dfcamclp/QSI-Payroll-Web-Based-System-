export function initializePayrollForm(ctx, options = {}) {
    const panel = ctx.panel;
    const get = id => panel.querySelector(`#${id}`);
    const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(Number(value) || 0);
    const view = get('payrollTransactionView');
    if (!view) return;
    const clientName = options.clientName || get('payrollCutoffListView')?.dataset.clientName || '';
    const cutoff = options.cutoff || null;
    if (get('payrollClientName')) get('payrollClientName').value = clientName;
    if (get('payrollSidebarClient')) get('payrollSidebarClient').textContent = clientName || '—';
    if (cutoff) {
        const start = cutoff.start_date || '';
        const end = cutoff.end_date || '';
        const period = start && end ? `${start} - ${end}` : '';
        if (get('payrollCutoffPeriod')) get('payrollCutoffPeriod').value = period;
        if (get('payrollCutoffNumber')) get('payrollCutoffNumber').value = cutoff.cutoff_no ?? '';
        if (get('payrollSidebarCutoff')) get('payrollSidebarCutoff').textContent = period || '—';
        if (get('payrollPayDate')) get('payrollPayDate').value = cutoff.pay_date || '';
    }
    const pendingTab = get('payrollPendingTab');
    const doneTab = get('payrollDoneTab');
    const pendingPanel = get('payrollPendingPanel');
    const donePanel = get('payrollDonePanel');
    function activatePayrollTab(activeTab) {
        const showPending = activeTab === pendingTab;
        pendingPanel?.classList.toggle('hidden', !showPending);
        donePanel?.classList.toggle('hidden', showPending);
        pendingTab?.setAttribute('aria-selected', String(showPending));
        doneTab?.setAttribute('aria-selected', String(!showPending));
        const activeClasses = ['bg-white', 'font-semibold', 'text-green-700', 'shadow-sm', 'dark:bg-gray-700', 'dark:text-green-400'];
        const inactiveClasses = ['font-medium', 'text-gray-500', 'dark:text-gray-400'];
        [pendingTab, doneTab].forEach((tab, index) => {
            if (!tab) return;
            const isActive = showPending ? index === 0 : index === 1;
            tab.classList.remove(...activeClasses, ...inactiveClasses);
            tab.classList.add(...(isActive ? activeClasses : inactiveClasses));
        });
    }
    if (!view.dataset.payrollTabsInitialized) {
        view.dataset.payrollTabsInitialized = 'true';
        pendingTab?.addEventListener('click', () => activatePayrollTab(pendingTab));
        doneTab?.addEventListener('click', () => activatePayrollTab(doneTab));
    }
    activatePayrollTab(donePanel && !donePanel.classList.contains('hidden') ? doneTab : pendingTab);
    const numberInputs = [...panel.querySelectorAll('.payroll-number, .payroll-money')];
    function calculate() {
        const sum = selector => [...panel.querySelectorAll(selector)].reduce((total, input) => total + (Number(input.value) || 0), 0);
        const earnings = sum('.payroll-money[id^="payrollFixed"], #payrollAdjustment, #payrollIncentive, #payrollEcola, #payrollThirteenthMonth');
        const deductions = sum('#payrollSss, #payrollPagibig, #payrollPhilhealth, #payrollWithholdingTax') + sum('.payroll-other-deduction-amount');
        const gross = Math.max(0, earnings);
        const net = gross - deductions;
        if (get('payrollGrossPay')) get('payrollGrossPay').textContent = money(gross);
        if (get('payrollTotalDeductions')) get('payrollTotalDeductions').textContent = money(deductions);
        if (get('payrollSummaryGross')) get('payrollSummaryGross').textContent = money(gross);
        if (get('payrollSummaryDeductions')) get('payrollSummaryDeductions').textContent = money(deductions);
        if (get('payrollNetPay')) get('payrollNetPay').textContent = money(net);
    }
    function filterEmployees(input, list) {
        if (!input || !list) return;
        const query = input.value.trim().toLowerCase();
        list.querySelectorAll('[data-employee-name]').forEach(item => {
            const name = (item.dataset.employeeName || '').toLowerCase();
            item.classList.toggle('hidden', !name.includes(query));
        });
    }
    if (!view.dataset.payrollFormInitialized) {
        view.dataset.payrollFormInitialized = 'true';
        numberInputs.forEach(input => input.addEventListener('input', calculate));
        get('payrollAddDeductionButton')?.addEventListener('click', () => {
            const tbody = get('payrollOtherDeductions');
            if (!tbody) return;
            get('payrollNoDeductions')?.remove();
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-100 dark:border-gray-700';
            row.innerHTML = `<td class="px-3 py-2"><input type="text" maxlength="100" placeholder="Deduction type" class="w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 payroll-other-deduction-type"></td><td class="px-3 py-2"><input type="number" min="0" step="0.01" value="0" class="payroll-other-deduction-amount w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"></td><td class="px-2 py-2 text-center"><button type="button" class="payroll-remove-deduction rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" aria-label="Remove deduction"><i class="fa-solid fa-trash"></i></button></td>`;
            tbody.appendChild(row);
            row.querySelector('.payroll-other-deduction-amount').addEventListener('input', calculate);
            row.querySelector('.payroll-remove-deduction').addEventListener('click', () => {
                row.remove();
                if (!tbody.querySelector('tr')) tbody.innerHTML = '<tr id="payrollNoDeductions"><td colspan="3" class="px-3 py-8 text-center text-xs text-gray-400">No additional deductions</td></tr>';
                calculate();
            });
            row.querySelector('.payroll-other-deduction-type').focus();
            calculate();
        });
        get('payrollRefreshButton')?.addEventListener('click', () => {
            panel.querySelectorAll('.payroll-number, .payroll-money').forEach(input => { input.value = '0'; });
            if (get('payrollOtherDeductions')) get('payrollOtherDeductions').innerHTML = '<tr id="payrollNoDeductions"><td colspan="3" class="px-3 py-8 text-center text-xs text-gray-400">No additional deductions</td></tr>';
            calculate();
        });
        get('payrollPrintButton')?.addEventListener('click', () => window.print());
        get('payrollEmployeeSearch')?.addEventListener('input', event => filterEmployees(event.target, get('payrollPendingEmployees')));
        get('payrollDoneSearch')?.addEventListener('input', event => filterEmployees(event.target, get('payrollDoneEmployees')));
        get('payrollSaveButton')?.addEventListener('click', () => alert('Static UI only. Payroll saving will be connected to the backend in a later step.'));
    }
    calculate();
}