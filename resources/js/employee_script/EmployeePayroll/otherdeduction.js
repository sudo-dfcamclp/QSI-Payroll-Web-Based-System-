
import Swal from 'sweetalert2';
import { API } from './config.js';

export function createOtherDeductionManager({
    panel,
    get,
    persistState,
    scheduleComputation
}) {
    const getTbody = () => get('payrollOtherDeductions');
    const addButton = get('payrollAddDeductionButton');
    const view = get('payrollTransactionView');

    if (!panel || !getTbody()) {
        console.error('[OTHER DEDUCTION] Required elements not found.');

        return {
            getDeductions: () => [],
            render: () => {},
            reset: () => {},
            restoreManualDeductions: () => {},
            openAddDeduction: () => {}
        };
    }

    let cachedTypes = null;
    let isSubmitting = false;
    let renderedEmployeeId = null;

    // -----------------------------------------------------
    // THEME
    // -----------------------------------------------------

    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    function swalTheme() {
        const dark = isDarkMode();

        return {
            background: dark ? '#1f2937' : '#ffffff',
            color: dark ? '#e5e7eb' : '#111827'
        };
    }

    function swalFormTheme() {
        const dark = isDarkMode();

        return {
            ...swalTheme(),

            didOpen: () => {
                if (!dark) return;

                const popup = Swal.getPopup();
                if (!popup) return;

                popup.querySelectorAll('input, select').forEach(el => {
                    el.style.backgroundColor = '#111827';
                    el.style.borderColor = '#374151';
                    el.style.color = '#e5e7eb';
                });

                popup.querySelectorAll('label').forEach(el => {
                    el.style.color = '#d1d5db';
                });

                const addedAt = popup.querySelector('#swalDeductionAddedAt');

                if (addedAt) {
                    addedAt.style.backgroundColor = '#1f2937';
                    addedAt.style.color = '#9ca3af';
                }
            }
        };
    }

    // -----------------------------------------------------
    // HELPERS
    // -----------------------------------------------------

    const money = value =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(Number(value) || 0);

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[char]);
    }

    function getCsrfToken() {
        return document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';
    }

    function localDateTimeValue() {
        const now = new Date();

        const pad = value => String(value).padStart(2, '0');

        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    function normalizeArray(value) {
        if (Array.isArray(value)) return value;

        if (value && typeof value === 'object') {
            return Object.values(value);
        }

        return [];
    }

    // -----------------------------------------------------
    // TABLE STRUCTURE
    // -----------------------------------------------------

    function ensureScrollableTable() {
        const tbody = getTbody();

        if (!tbody) return null;

        let wrapper = tbody.closest('.payroll-deduction-scroll-wrapper');

        if (wrapper) return wrapper;

        wrapper = document.createElement('div');

        wrapper.className =
            'payroll-deduction-scroll-wrapper max-h-64 overflow-y-auto overflow-x-hidden rounded-md';

        const table = tbody.closest('table');

        if (table && table.parentNode) {
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }

        return wrapper;
    }

    function ensureTableStructure() {
        const tbody = getTbody();

        if (!tbody) return;

        const table = tbody.closest('table');

        if (!table) return;

        let thead = table.querySelector('thead');

        if (!thead) {
            thead = document.createElement('thead');

            thead.innerHTML = `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Deduction Type
                    </th>

                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Amount
                    </th>

                    <th class="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Action
                    </th>
                </tr>
            `;

            table.insertBefore(thead, table.firstChild);
        }

        thead.className =
            'sticky top-0 z-10 bg-white dark:bg-gray-800';
    }

    function initScrollableLayout() {
        ensureTableStructure();
        ensureScrollableTable();
    }

    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    function showEmptyRow() {
        const tbody = getTbody();

        if (!tbody) return;

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

                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    No additional deductions
                </span>

                <span class="text-xs text-gray-400 dark:text-gray-500">
                    Click "Add Deduction" to add an item
                </span>

            </div>
        `;

        row.appendChild(cell);
        tbody.appendChild(row);
    }

    // -----------------------------------------------------
    // DEDUCTION TYPES
    // -----------------------------------------------------

    async function loadDeductionTypes() {
        if (Array.isArray(cachedTypes) && cachedTypes.length) {
            return cachedTypes;
        }

        if (!API?.types) {
            throw new Error('Deduction types endpoint is not configured.');
        }

        const response = await fetch(API.types, {
            headers: {
                Accept: 'application/json'
            },
            credentials: 'same-origin'
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            throw new Error(
                result?.message || 'Unable to load deduction types.'
            );
        }

        const types = Array.isArray(result.data) ? result.data : [];

        if (!types.length) {
            throw new Error('No active deduction types are available.');
        }

        cachedTypes = types;

        return types;
    }

    // -----------------------------------------------------
    // GET MANUAL DEDUCTIONS
    // -----------------------------------------------------

    function getDeductions() {
        const tbody = getTbody();

        if (!tbody) return [];

        return [
            ...tbody.querySelectorAll(
                'tr[data-deduction-row="true"][data-deduction-kind="manual"]'
            )
        ].map(row => {
            const type =
                row.querySelector('.payroll-other-deduction-type')
                    ?.value?.trim() || '';

            const amountValue =
                row.querySelector('.payroll-other-deduction-amount')
                    ?.value;

            const amount = Number(amountValue);

            return {
                type,
                amount: Number.isFinite(amount)
                    ? Math.max(0, amount)
                    : 0
            };
        });
    }

    // -----------------------------------------------------
    // CREATE DEDUCTION ROW
    // -----------------------------------------------------

    function createDeductionRow(deduction, kind = 'manual') {
        const row = document.createElement('tr');

        row.dataset.deductionRow = 'true';
        row.dataset.deductionKind = kind;

        if (deduction.id) {
            row.dataset.deductionId = String(deduction.id);
        }

        row.className =
            'border-t border-gray-100 dark:border-gray-700';

        // Type
        const typeCell = document.createElement('td');

        typeCell.className = 'px-3 py-2';

        const typeInput = document.createElement('input');

        typeInput.type = 'text';
        typeInput.maxLength = 255;
        typeInput.value = deduction.type || '';
        typeInput.readOnly = true;

        typeInput.className =
            'payroll-other-deduction-type w-full min-w-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200';

        typeCell.appendChild(typeInput);

        // Amount
        const amountCell = document.createElement('td');

        amountCell.className = 'px-3 py-2';

        const amountInput = document.createElement('input');

        amountInput.type = 'number';
        amountInput.min = '0';
        amountInput.step = '0.01';
        amountInput.value = Number(deduction.amount || 0).toFixed(2);

        amountInput.className =
            'payroll-other-deduction-amount w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200';

        if (kind === 'database' && deduction.balance !== undefined) {
            amountInput.max = String(Number(deduction.balance));

            amountInput.title =
                `Remaining balance: ${money(deduction.balance)}`;
        }

        amountCell.appendChild(amountInput);

        // Action
        const actionCell = document.createElement('td');

        actionCell.className = 'px-2 py-2 text-center';

        if (kind === 'manual') {
            const removeButton = document.createElement('button');

            removeButton.type = 'button';

            removeButton.className =
                'payroll-remove-deduction rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20';

            removeButton.setAttribute(
                'aria-label',
                'Remove manual deduction'
            );

            removeButton.innerHTML =
                '<i class="fa-solid fa-trash"></i>';

            actionCell.appendChild(removeButton);

        } else {
            const label = document.createElement('span');

            label.className = 'text-xs text-gray-400';
            label.textContent = 'Auto';

            label.title =
                'Retrieved automatically from employee deductions.';

            actionCell.appendChild(label);
        }

        row.append(typeCell, amountCell, actionCell);

        return row;
    }

    // -----------------------------------------------------
    // APPEND ROW
    // -----------------------------------------------------

    function appendDeduction(deduction, kind = 'manual') {
        const tbody = getTbody();

        if (!tbody) return;

        tbody.querySelector('#payrollNoDeductions')?.remove();

        const row = createDeductionRow(deduction, kind);

        tbody.appendChild(row);

        return row;
    }

    // -----------------------------------------------------
    // RESTORE MANUAL DEDUCTIONS
    // -----------------------------------------------------

    function restoreManualDeductions(deductions = []) {
        const tbody = getTbody();

        if (!tbody) return;

        initScrollableLayout();

        // Restore only manual deductions.
        // Database deductions will be loaded again from computation.
        const manualDeductions = normalizeArray(deductions)
            .filter(deduction => deduction && !deduction.id);

        tbody.replaceChildren();

        manualDeductions.forEach(deduction => {
            const amount = Number(deduction.amount || 0);

            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            appendDeduction({
                type: deduction.type || 'Other Deduction',
                amount
            }, 'manual');
        });

        const renderedRows = tbody.querySelectorAll(
            'tr[data-deduction-row="true"]'
        ).length;

        if (renderedRows === 0) {
            showEmptyRow();
        }

        console.log('[OTHER DEDUCTION] Manual deductions restored:', {
            count: renderedRows
        });
    }

    // -----------------------------------------------------
    // RENDER COMPUTATION RESULT
    // -----------------------------------------------------

    function render(result) {
        const tbody = getTbody();

        if (!tbody) {
            console.error('[OTHER DEDUCTION] Table body not found.');
            return;
        }

        const data = result?.data || result || {};

        const employeeId = String(
            data.employee?.emp_id ?? ''
        );

        const selectedEmployeeId = String(
            view?.dataset.selectedEmployeeId ?? ''
        );

        // Prevent rendering data belonging to another employee.
        if (
            !employeeId ||
            !selectedEmployeeId ||
            employeeId !== selectedEmployeeId
        ) {
            console.warn('[OTHER DEDUCTION] Employee mismatch.', {
                employeeId,
                selectedEmployeeId
            });

            return;
        }

        initScrollableLayout();

        const databaseDeductions = normalizeArray(
            data.other_deduction_details
        );

        const manualDeductions = normalizeArray(
            data.manual_other_deduction_details
        );

        tbody.replaceChildren();

        renderedEmployeeId = employeeId;

        // Database deductions.
        databaseDeductions.forEach(deduction => {
            if (!deduction) return;

            const amount = Number(deduction.amount || 0);

            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            appendDeduction({
                id: deduction.id,
                type:
                    deduction.type ||
                    deduction.deduction_type_title ||
                    'Other Deduction',
                amount,
                balance: deduction.balance
            }, 'database');
        });

        // Manual deductions.
        manualDeductions.forEach(deduction => {
            if (!deduction) return;

            const amount = Number(deduction.amount || 0);

            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            appendDeduction({
                type: deduction.type || 'Other Deduction',
                amount
            }, 'manual');
        });

        const renderedRows = tbody.querySelectorAll(
            'tr[data-deduction-row="true"]'
        ).length;

        if (renderedRows === 0) {
            showEmptyRow();
        }

        console.log('[OTHER DEDUCTION] Render complete:', {
            employeeId,
            databaseCount: databaseDeductions.length,
            manualCount: manualDeductions.length,
            renderedRows
        });
    }

    // -----------------------------------------------------
    // RESET
    // -----------------------------------------------------

    function reset() {
        const tbody = getTbody();

        if (!tbody) return;

        tbody.replaceChildren();

        renderedEmployeeId = null;

        initScrollableLayout();
        showEmptyRow();
    }

    // -----------------------------------------------------
    // ADD DEDUCTION
    // -----------------------------------------------------

    async function openAddDeduction() {
        if (isSubmitting) return;

        const employeeId = view?.dataset.selectedEmployeeId;
        const clientId = view?.dataset.clientId;

        if (!employeeId) {
            await Swal.fire({
                icon: 'info',
                title: 'Select an Employee',
                text: 'Please select an employee before adding a deduction.',
                confirmButtonColor: '#16a34a',
                ...swalTheme()
            });

            return;
        }

        if (!clientId) {
            await Swal.fire({
                icon: 'info',
                title: 'Missing Client',
                text: 'Please reload the payroll cutoff.',
                confirmButtonColor: '#16a34a',
                ...swalTheme()
            });

            return;
        }

        let types = [];

        try {
            types = await loadDeductionTypes();

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Load Deduction Types',
                text: error.message,
                confirmButtonColor: '#16a34a',
                ...swalTheme()
            });

            return;
        }

        const typeOptions = types.map(type => `
            <option value="${escapeHtml(type.id)}">
                ${escapeHtml(type.title)}
            </option>
        `).join('');

        const result = await Swal.fire({
            title: 'Add Other Deduction',

            html: `
                <div class="mt-4 space-y-3 text-left">

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            Deduction Type
                        </label>

                        <select id="swalDeductionType"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
                            ${typeOptions}
                        </select>
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            Total Amount
                        </label>

                        <input id="swalDeductionTotal"
                            type="number" min="0" step="0.01"
                            placeholder="0.00"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            Partial Payment (per cutoff)
                        </label>

                        <input id="swalDeductionPayment"
                            type="number" min="0" step="0.01"
                            placeholder="0.00"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            Start Payment Date
                        </label>

                        <input id="swalDeductionStart"
                            type="date"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            End Payment Date (optional)
                        </label>

                        <input id="swalDeductionEnd"
                            type="date"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium">
                            Added At
                        </label>

                        <input id="swalDeductionAddedAt"
                            type="datetime-local"
                            readonly
                            value="${localDateTimeValue()}"
                            class="w-full rounded-lg border px-3 py-2 text-sm">
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

                const deductionTypeId =
                    popup.querySelector('#swalDeductionType').value;

                const totalValue =
                    popup.querySelector('#swalDeductionTotal').value;

                const paymentValue =
                    popup.querySelector('#swalDeductionPayment').value;

                const startDate =
                    popup.querySelector('#swalDeductionStart').value;

                const endDate =
                    popup.querySelector('#swalDeductionEnd').value;

                const totalAmount = Number(totalValue);
                const payment = Number(paymentValue);

                if (!deductionTypeId) {
                    Swal.showValidationMessage(
                        'Please select a deduction type.'
                    );
                    return false;
                }

                if (
                    totalValue === '' ||
                    !Number.isFinite(totalAmount) ||
                    totalAmount <= 0
                ) {
                    Swal.showValidationMessage(
                        'Please enter a valid total amount.'
                    );
                    return false;
                }

                if (
                    paymentValue === '' ||
                    !Number.isFinite(payment) ||
                    payment <= 0
                ) {
                    Swal.showValidationMessage(
                        'Please enter a valid partial payment amount.'
                    );
                    return false;
                }

                if (payment > totalAmount) {
                    Swal.showValidationMessage(
                        'Partial payment cannot exceed total amount.'
                    );
                    return false;
                }

                if (!startDate) {
                    Swal.showValidationMessage(
                        'Please select a start payment date.'
                    );
                    return false;
                }

                if (endDate && endDate < startDate) {
                    Swal.showValidationMessage(
                        'End date cannot be earlier than start date.'
                    );
                    return false;
                }

                return {
                    deductionTypeId: Number(deductionTypeId),
                    totalAmount: Number(totalAmount.toFixed(2)),
                    payment: Number(payment.toFixed(2)),
                    startDate,
                    endDate: endDate || null
                };
            }
        });

        if (!result.isConfirmed) return;

        // Ensure employee has not changed while the form was open.
        if (
            String(view?.dataset.selectedEmployeeId) !== String(employeeId)
        ) {
            return;
        }

        isSubmitting = true;

        try {
            if (!API?.store) {
                throw new Error(
                    'Deduction store endpoint is not configured.'
                );
            }

            const response = await fetch(API.store, {
                method: 'POST',

                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },

                credentials: 'same-origin',

                body: JSON.stringify({
                    emp_id: Number(employeeId),
                    client_id: Number(clientId),
                    deduction_type_id: result.value.deductionTypeId,
                    payment: result.value.payment,
                    total_amount: result.value.totalAmount,
                    start_date: result.value.startDate,
                    end_date: result.value.endDate
                })
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok || !payload?.success) {
                throw new Error(
                    payload?.message ||
                    payload?.errors?.deduction_type_id?.[0] ||
                    'Unable to add deduction.'
                );
            }

            persistState?.();

            scheduleComputation?.(0);

            await Swal.fire({
                icon: 'success',
                title: 'Deduction Added',
                text: 'Employee deduction saved successfully.',
                timer: 1500,
                showConfirmButton: false,
                ...swalTheme()
            });

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Add Deduction',
                text: error.message || 'Please try again.',
                confirmButtonColor: '#16a34a',
                ...swalTheme()
            });

        } finally {
            isSubmitting = false;
        }
    }

    // -----------------------------------------------------
    // REMOVE MANUAL DEDUCTION
    // -----------------------------------------------------

    async function removeManualDeduction(row) {
        if (row.dataset.deductionKind !== 'manual') return;

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Remove Deduction?',
            text: 'This manual deduction will be removed from the payroll preview.',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            ...swalTheme()
        });

        if (!result.isConfirmed) return;

        row.remove();

        const tbody = getTbody();

        if (
            tbody &&
            !tbody.querySelector('tr[data-deduction-row="true"]')
        ) {
            showEmptyRow();
        }

        persistState?.();
        scheduleComputation?.(0);
    }

    // -----------------------------------------------------
    // TABLE EVENTS
    // -----------------------------------------------------

    function attachTableEvents() {
        const tbody = getTbody();

        if (!tbody || tbody.dataset.otherDeductionInitialized === 'true') {
            return;
        }

        tbody.dataset.otherDeductionInitialized = 'true';

        tbody.addEventListener('input', event => {
            if (
                event.target.matches('.payroll-other-deduction-amount')
            ) {
                persistState?.();
                scheduleComputation?.(400);
            }
        });

        tbody.addEventListener('click', event => {
            const removeButton = event.target.closest(
                '.payroll-remove-deduction'
            );

            if (!removeButton) return;

            const row = removeButton.closest('tr');

            if (row) {
                removeManualDeduction(row);
            }
        });
    }

    // -----------------------------------------------------
    // ADD BUTTON
    // -----------------------------------------------------

    if (
        addButton &&
        addButton.dataset.otherDeductionInitialized !== 'true'
    ) {
        addButton.dataset.otherDeductionInitialized = 'true';

        addButton.addEventListener('click', () => {
            openAddDeduction();
        });
    }

    // -----------------------------------------------------
    // INITIALIZATION
    // -----------------------------------------------------

    initScrollableLayout();
    attachTableEvents();

    // -----------------------------------------------------
    // PUBLIC METHODS
    // -----------------------------------------------------

    return {
        getDeductions,
        render,
        reset,
        restoreManualDeductions,
        openAddDeduction
    };
}
