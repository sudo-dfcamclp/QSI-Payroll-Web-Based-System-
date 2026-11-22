import Swal from 'sweetalert2';
import { API } from './config.js';

export function createOtherDeductionManager({ panel, get, persistState, scheduleComputation }) {
    const tbody = get('payrollOtherDeductions');
    const addButton = get('payrollAddDeductionButton');

    if (!panel || !tbody) {
        console.error('Other Deductions: required elements were not found.');
        return { getDeductions: () => [], render: () => {}, reset: () => {}, openAddDeduction: () => {} };
    }

    let cachedTypes = null;
    let isSubmitting = false;

    // -----------------------------------------------------
    // DARK MODE HELPERS
    // -----------------------------------------------------

    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    function swalTheme() {
        const dark = isDarkMode();
        return {
            background: dark ? '#1f2937' : '#ffffff',
            color: dark ? '#e5e7eb' : '#111827',
        };
    }

    function swalFormTheme() {
        const dark = isDarkMode();
        return {
            background: dark ? '#1f2937' : '#ffffff',
            color: dark ? '#e5e7eb' : '#111827',
            didOpen: () => {
                if (!dark) return;
                const popup = Swal.getPopup();
                if (!popup) return;
                popup.querySelectorAll('input, select').forEach(el => {
                    el.style.backgroundColor = '#111827';
                    el.style.borderColor = '#374151';
                    el.style.color = '#e5e7eb';
                });
                popup.querySelectorAll('label').forEach(el => { el.style.color = '#d1d5db'; });
                const addedAt = popup.querySelector('#swalDeductionAddedAt');
                if (addedAt) { addedAt.style.backgroundColor = '#1f2937'; addedAt.style.color = '#9ca3af'; }
            },
        };
    }

    // -----------------------------------------------------
    // HELPERS
    // -----------------------------------------------------

    const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(Number(value) || 0);

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
    }

    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    function localDateTimeValue() {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    // -----------------------------------------------------
    // SCROLLABLE TABLE WRAPPER
    // -----------------------------------------------------

    function ensureScrollableTable() {
        let wrapper = tbody.closest('.payroll-deduction-scroll-wrapper');

        if (wrapper) return wrapper;

        wrapper = document.createElement('div');
        wrapper.className = 'payroll-deduction-scroll-wrapper max-h-64 overflow-y-auto overflow-x-hidden rounded-md';

        const table = tbody.closest('table');

        if (table && table.parentNode) {
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }

        return wrapper;
    }

    function ensureTableStructure() {
        const table = tbody.closest('table');

        if (!table) return;

        let thead = table.querySelector('thead');

        if (!thead) {
            thead = document.createElement('thead');
            thead.className = 'sticky top-0 z-10 bg-white dark:bg-gray-800';
            thead.innerHTML = `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Deduction Type</th>
                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                    <th class="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Action</th>
                </tr>
            `;
            table.insertBefore(thead, table.firstChild);
        } else {
            thead.className = 'sticky top-0 z-10 bg-white dark:bg-gray-800';
        }
    }

    function initScrollableLayout() {
        ensureTableStructure();
        ensureScrollableTable();
    }

    // -----------------------------------------------------
    // EMPTY ROW
    // -----------------------------------------------------

    function showEmptyRow() {
        tbody.replaceChildren();
        const row = document.createElement('tr');
        row.id = 'payrollNoDeductions';
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.className = 'px-4 py-10 text-center';
        cell.innerHTML = `
            <div class="flex flex-col items-center gap-2">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700">
                    <i class="fa-solid fa-receipt text-lg"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">No additional deductions</span>
                <span class="text-xs text-gray-400 dark:text-gray-500">Click "Add Deduction" to add an item</span>
            </div>
        `;
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    // -----------------------------------------------------
    // DEDUCTION TYPES
    // -----------------------------------------------------

    async function loadDeductionTypes() {
        if (Array.isArray(cachedTypes) && cachedTypes.length) return cachedTypes;
        if (!API?.types) throw new Error('Deduction types endpoint is not configured.');
        const response = await fetch(API.types, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) throw new Error(result?.message || 'Unable to load deduction types.');
        const types = Array.isArray(result.data) ? result.data : [];
        if (!types.length) throw new Error('No active deduction types are available.');
        cachedTypes = types;
        return types;
    }

    // -----------------------------------------------------
    // GET DEDUCTIONS
    // -----------------------------------------------------

    function getDeductions() {
        return [...tbody.querySelectorAll('tr[data-deduction-row="true"]')].map(row => {
            const id = row.dataset.deductionId || null;
            const type = row.querySelector('.payroll-other-deduction-type')?.value?.trim() || '';
            const amountValue = row.querySelector('.payroll-other-deduction-amount')?.value;
            const amount = Number(amountValue);
            const deduction = { type, amount: Number.isFinite(amount) ? Math.max(0, amount) : 0 };
            if (id) deduction.id = Number(id);
            return deduction;
        });
    }

    // -----------------------------------------------------
    // CREATE DEDUCTION ROW
    // -----------------------------------------------------

    function createDeductionRow(deduction, kind = 'manual') {
        const row = document.createElement('tr');
        row.dataset.deductionRow = 'true';
        row.dataset.deductionKind = kind;
        if (deduction.id) row.dataset.deductionId = String(deduction.id);
        row.className = 'border-t border-gray-100 dark:border-gray-700';

        // Deduction type
        const typeCell = document.createElement('td');
        typeCell.className = 'px-3 py-2';
        const typeInput = document.createElement('input');
        typeInput.type = 'text';
        typeInput.maxLength = 255;
        typeInput.value = deduction.type || '';
        typeInput.readOnly = true;
        typeInput.className = `payroll-other-deduction-type w-full min-w-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200`;
        typeCell.appendChild(typeInput);

        // Amount
        const amountCell = document.createElement('td');
        amountCell.className = 'px-3 py-2';
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.min = '0';
        amountInput.step = '0.01';
        amountInput.value = Number(deduction.amount || 0).toFixed(2);
        amountInput.className = `payroll-other-deduction-amount w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200`;
        if (kind === 'database' && deduction.balance !== undefined) {
            amountInput.max = String(Number(deduction.balance));
            amountInput.title = `Remaining balance: ${money(deduction.balance)}`;
        }
        amountCell.appendChild(amountInput);

        // Action
        const actionCell = document.createElement('td');
        actionCell.className = 'px-2 py-2 text-center';
        if (kind === 'manual') {
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = `payroll-remove-deduction rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20`;
            removeButton.setAttribute('aria-label', 'Remove manual deduction');
            removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            actionCell.appendChild(removeButton);
        } else {
            const automaticLabel = document.createElement('span');
            automaticLabel.className = 'text-xs text-gray-400';
            automaticLabel.textContent = 'Auto';
            automaticLabel.title = 'Retrieved automatically from employee deductions.';
            actionCell.appendChild(automaticLabel);
        }

        row.append(typeCell, amountCell, actionCell);
        return row;
    }

    // -----------------------------------------------------
    // ADD ROW TO TABLE
    // -----------------------------------------------------

    function appendDeduction(deduction, kind = 'manual') {
        tbody.querySelector('#payrollNoDeductions')?.remove();
        const row = createDeductionRow(deduction, kind);
        tbody.appendChild(row);
        return row;
    }

    // -----------------------------------------------------
    // RENDER BACKEND COMPUTATION RESULT
    // -----------------------------------------------------

    function render(result) {
        initScrollableLayout();

        const data = result?.data || result || {};
        const databaseDeductions = Array.isArray(data.other_deduction_details) ? data.other_deduction_details : [];
        const manualDeductions = Array.isArray(data.manual_other_deduction_details) ? data.manual_other_deduction_details : [];
        tbody.replaceChildren();
        databaseDeductions.forEach(deduction => {
            appendDeduction({ id: deduction.id, type: deduction.type || deduction.deduction_type_title || 'Other Deduction', amount: deduction.amount, balance: deduction.balance }, 'database');
        });
        manualDeductions.forEach(deduction => {
            appendDeduction({ type: deduction.type, amount: deduction.amount }, 'manual');
        });
        if (!databaseDeductions.length && !manualDeductions.length) showEmptyRow();
    }

    // -----------------------------------------------------
    // RESET TABLE
    // -----------------------------------------------------

    function reset() {
        showEmptyRow();
    }

    // -----------------------------------------------------
    // ADD DEDUCTION
    // -----------------------------------------------------

    async function openAddDeduction() {
        if (isSubmitting) return;

        const view = get('payrollTransactionView');
        const employeeId = view?.dataset.selectedEmployeeId;
        const clientId = view?.dataset.clientId;

        if (!employeeId) {
            await Swal.fire({ icon: 'info', title: 'Select an Employee', text: 'Please select an employee before adding a deduction.', confirmButtonColor: '#16a34a', ...swalTheme() });
            return;
        }

        if (!clientId) {
            await Swal.fire({ icon: 'info', title: 'Missing Client', text: 'The payroll client could not be resolved. Please reload the payroll cutoff.', confirmButtonColor: '#16a34a', ...swalTheme() });
            return;
        }

        let types = [];
        try {
            types = await loadDeductionTypes();
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'Unable to Load Deduction Types', text: error.message || 'Please try again.', confirmButtonColor: '#16a34a', ...swalTheme() });
            return;
        }

        const typeOptions = types.map(type => `<option value="${escapeHtml(type.id)}">${escapeHtml(type.title)}</option>`).join('');

        const result = await Swal.fire({
            title: 'Add Other Deduction',
            html: `
                <div class="mt-4 space-y-3 text-left">
                    <div>
                        <label for="swalDeductionType" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deduction Type</label>
                        <select id="swalDeductionType" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">${typeOptions}</select>
                    </div>
                    <div>
                        <label for="swalDeductionTotal" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
                        <input id="swalDeductionTotal" type="number" min="0" step="0.01" placeholder="0.00" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    <div>
                        <label for="swalDeductionPayment" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Partial Payment (per cutoff)</label>
                        <input id="swalDeductionPayment" type="number" min="0" step="0.01" placeholder="0.00" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    <div>
                        <label for="swalDeductionStart" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Payment Date</label>
                        <input id="swalDeductionStart" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    <div>
                        <label for="swalDeductionEnd" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End Payment Date (optional)</label>
                        <input id="swalDeductionEnd" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    <div>
                        <label for="swalDeductionAddedAt" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Added At</label>
                        <input id="swalDeductionAddedAt" type="datetime-local" readonly value="${localDateTimeValue()}" class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus:outline-none">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Deduction',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            focusConfirm: false,
            ...swalFormTheme(),
            preConfirm: () => {
                const popup = Swal.getPopup();
                const deductionTypeId = popup.querySelector('#swalDeductionType').value;
                const totalValue = popup.querySelector('#swalDeductionTotal').value;
                const paymentValue = popup.querySelector('#swalDeductionPayment').value;
                const startDate = popup.querySelector('#swalDeductionStart').value;
                const endDate = popup.querySelector('#swalDeductionEnd').value;
                const totalAmount = Number(totalValue);
                const payment = Number(paymentValue);

                if (!deductionTypeId) { Swal.showValidationMessage('Please select a deduction type.'); return false; }
                if (totalValue === '' || !Number.isFinite(totalAmount) || totalAmount <= 0) { Swal.showValidationMessage('Please enter a valid total amount.'); return false; }
                if (paymentValue === '' || !Number.isFinite(payment) || payment <= 0) { Swal.showValidationMessage('Please enter a valid partial payment amount.'); return false; }
                if (payment > totalAmount) { Swal.showValidationMessage('Partial payment cannot exceed the total amount.'); return false; }
                if (!startDate) { Swal.showValidationMessage('Please select a start payment date.'); return false; }
                if (endDate && endDate < startDate) { Swal.showValidationMessage('End payment date must not be earlier than the start payment date.'); return false; }

                return {
                    deductionTypeId: Number(deductionTypeId),
                    totalAmount: Number(totalAmount.toFixed(2)),
                    payment: Number(payment.toFixed(2)),
                    startDate,
                    endDate: endDate || null,
                };
            },
        });

        if (!result.isConfirmed) return;
        isSubmitting = true;

        try {
            if (!API?.store) throw new Error('Deduction store endpoint is not configured.');
            const response = await fetch(API.store, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
                credentials: 'same-origin',
                body: JSON.stringify({
                    emp_id: Number(employeeId),
                    client_id: Number(clientId),
                    deduction_type_id: Number(result.value.deductionTypeId),
                    payment: result.value.payment,
                    total_amount: result.value.totalAmount,
                    start_date: result.value.startDate,
                    end_date: result.value.endDate,
                }),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.message || payload?.errors?.deduction_type_id?.[0] || 'Unable to add deduction.');
            }
            persistState?.();
            scheduleComputation?.(0);
            await Swal.fire({ icon: 'success', title: 'Deduction Added', text: 'The employee deduction was saved and the payroll preview will refresh.', timer: 1500, showConfirmButton: false, ...swalTheme() });
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'Unable to Add Deduction', text: error.message || 'Please try again.', confirmButtonColor: '#16a34a', ...swalTheme() });
        } finally {
            isSubmitting = false;
        }
    }

    // -----------------------------------------------------
    // REMOVE MANUAL DEDUCTION
    // -----------------------------------------------------

    async function removeManualDeduction(row) {
        if (row.dataset.deductionKind !== 'manual') return;
        const result = await Swal.fire({ icon: 'warning', title: 'Remove Deduction?', text: 'This manual deduction will be removed from the payroll preview.', showCancelButton: true, confirmButtonText: 'Yes, remove it', cancelButtonText: 'Cancel', confirmButtonColor: '#dc2626', cancelButtonColor: '#6b7280', ...swalTheme() });
        if (!result.isConfirmed) return;
        row.remove();
        if (!tbody.querySelector('tr[data-deduction-row="true"]')) showEmptyRow();
        persistState?.();
        scheduleComputation?.(0);
    }

    // -----------------------------------------------------
    // TABLE EVENTS
    // -----------------------------------------------------

    if (tbody.dataset.otherDeductionInitialized !== 'true') {
        tbody.dataset.otherDeductionInitialized = 'true';
        tbody.addEventListener('input', event => {
            if (event.target.matches('.payroll-other-deduction-amount')) {
                persistState?.();
                scheduleComputation?.(400);
            }
        });
        tbody.addEventListener('click', event => {
            const removeButton = event.target.closest('.payroll-remove-deduction');
            if (!removeButton) return;
            const row = removeButton.closest('tr');
            if (row) removeManualDeduction(row);
        });
    }

    // -----------------------------------------------------
    // ADD BUTTON EVENT
    // -----------------------------------------------------

    if (addButton && addButton.dataset.otherDeductionInitialized !== 'true') {
        addButton.dataset.otherDeductionInitialized = 'true';
        addButton.addEventListener('click', () => { openAddDeduction(); });
    }

    // -----------------------------------------------------
    // INIT LAYOUT ON LOAD
    // -----------------------------------------------------

    initScrollableLayout();

    // -----------------------------------------------------
    // PUBLIC METHODS
    // -----------------------------------------------------

    return { getDeductions, render, reset, openAddDeduction };
}