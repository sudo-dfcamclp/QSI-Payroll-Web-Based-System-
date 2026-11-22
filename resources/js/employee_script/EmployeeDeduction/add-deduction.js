import Swal from 'sweetalert2';

import { state } from './state.js';
import { API } from './config.js';
import { fetchJson, escapeHtml } from './helpers.js';
import { loadDeductions } from './deductions.js';

// ---------------------------------------------------------
// DARK MODE HELPERS
// ---------------------------------------------------------

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
            popup.querySelectorAll('p').forEach(el => { el.style.color = '#9ca3af'; });
            const addedAt = popup.querySelector('#swalAddedAt');
            if (addedAt) { addedAt.style.backgroundColor = '#1f2937'; addedAt.style.color = '#9ca3af'; }
        },
    };
}

function getLocalDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getLocalDate() {
    return getLocalDateTime().split('T')[0];
}

async function loadDeductionTypes() {
    const response = await fetchJson(API.types);
    if (!response.success) throw new Error(response.message || 'Unable to load deduction types.');
    return response.data || [];
}

function renderDeductionTypeOptions(types) {
    return types.map(type => `<option value="${escapeHtml(type.id)}">${escapeHtml(type.title)}</option>`).join('');
}

async function openAddDeduction(panel) {
    const employeeId = state.selectedEmployeeId;
    const clientId = state.selectedClientId;

    if (!employeeId || !clientId) {
        await Swal.fire({ icon: 'info', title: 'Select an Employee', text: 'Please select an employee before adding a deduction.', confirmButtonColor: '#16a34a', ...swalTheme() });
        return;
    }

    let types = [];
    try {
        types = await loadDeductionTypes();
    } catch (error) {
        console.error('Failed to load deduction types:', error);
        await Swal.fire({ icon: 'error', title: 'Unable to Load Deduction Types', text: error.message || 'Something went wrong while loading deduction types.', confirmButtonColor: '#dc2626', ...swalTheme() });
        return;
    }

    if (!types.length) {
        await Swal.fire({ icon: 'warning', title: 'No Deduction Types', text: 'There are currently no active deduction types available.', confirmButtonColor: '#16a34a', ...swalTheme() });
        return;
    }

    const today = getLocalDate();
    const addedAt = getLocalDateTime();

    const result = await Swal.fire({
        title: 'Add Deduction',
        html: `
            <div class="text-left space-y-3 mt-4">
                <div>
                    <label for="swalDeductionType" class="block text-sm font-medium text-gray-700 mb-1">Deduction Type</label>
                    <select id="swalDeductionType" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">Select deduction type</option>
                        ${renderDeductionTypeOptions(types)}
                    </select>
                </div>
                <div>
                    <label for="swalTotalAmount" class="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                    <input id="swalTotalAmount" type="number" min="0" step="0.01" placeholder="Enter total amount" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <div>
                    <label for="swalPartialPayment" class="block text-sm font-medium text-gray-700 mb-1">Partial Payment</label>
                    <input id="swalPartialPayment" type="number" min="0" step="0.01" placeholder="Enter partial payment" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <div>
                    <label for="swalStartDate" class="block text-sm font-medium text-gray-700 mb-1">Start Payment Date</label>
                    <input id="swalStartDate" type="date" value="${today}" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <div>
                    <label for="swalEndDate" class="block text-sm font-medium text-gray-700 mb-1">End Payment Date</label>
                    <input id="swalEndDate" type="date" min="${today}" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <p class="text-xs text-gray-500 mt-1">Optional</p>
                </div>
                <div>
                    <label for="swalAddedAt" class="block text-sm font-medium text-gray-700 mb-1">Added At</label>
                    <input id="swalAddedAt" type="datetime-local" value="${addedAt}" readonly class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        ...swalFormTheme(),
        preConfirm: async () => {
            const popup = Swal.getPopup();
            const deductionTypeId = popup.querySelector('#swalDeductionType').value;
            const totalAmount = popup.querySelector('#swalTotalAmount').value;
            const payment = popup.querySelector('#swalPartialPayment').value;
            const startDate = popup.querySelector('#swalStartDate').value;
            const endDate = popup.querySelector('#swalEndDate').value;

            if (!deductionTypeId) { Swal.showValidationMessage('Please select a deduction type.'); return false; }
            if (totalAmount === '' || !Number.isFinite(Number(totalAmount)) || Number(totalAmount) < 0) { Swal.showValidationMessage('Please enter a valid total amount.'); return false; }
            if (payment === '' || !Number.isFinite(Number(payment)) || Number(payment) < 0) { Swal.showValidationMessage('Please enter a valid partial payment.'); return false; }
            if (!startDate) { Swal.showValidationMessage('Please select a start payment date.'); return false; }
            if (endDate && endDate < startDate) { Swal.showValidationMessage('End Payment Date must be on or after Start Payment Date.'); return false; }

            const payload = {
                emp_id: employeeId,
                client_id: clientId,
                deduction_type_id: Number(deductionTypeId),
                payment: Number(payment),
                total_amount: Number(totalAmount),
                start_date: startDate,
                end_date: endDate || null,
            };

            try {
                const response = await fetchJson(API.store, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.success) throw new Error(response.message || 'Failed to save deduction.');
                return response;
            } catch (error) {
                console.error('Failed to save deduction:', error);
                Swal.showValidationMessage(error.message || 'Something went wrong while saving.');
                return false;
            }
        },
    });

    if (!result.isConfirmed) return;

    await Swal.fire({ icon: 'success', title: 'Deduction Added!', text: result.value?.message || 'The deduction has been successfully saved.', confirmButtonColor: '#16a34a', ...swalTheme() });

    try {
        await loadDeductions(panel, employeeId);
    } catch (error) {
        console.error('Failed to refresh deductions:', error);
    }
}

export function initAddDeduction(panel) {
    if (!panel) return;
    const button = panel.querySelector('#btnAddDeduction');
    if (!button) { console.error('Add Deduction button not found.'); return; }
    if (button.dataset.addDeductionInitialized === 'true') return;
    button.dataset.addDeductionInitialized = 'true';
    button.addEventListener('click', () => { openAddDeduction(panel); });
}