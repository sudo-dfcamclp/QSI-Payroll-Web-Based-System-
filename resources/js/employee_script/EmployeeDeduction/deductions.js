import { state } from './state.js';

import {
    fetchJson,
    setHtml,
    escapeHtml,
} from './helpers.js';

import { API } from './config.js';

import Swal from 'sweetalert2';

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

// ---------------------------------------------------------
// Format Amount
// ---------------------------------------------------------

function formatAmount(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return '—';
    }

    return amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// ---------------------------------------------------------
// Format Date
// ---------------------------------------------------------

function formatDate(value, includeTime = false) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    if (!includeTime && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return escapeHtml(value);
    }

    return date.toLocaleString('en-PH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(includeTime
            ? {
                hour: '2-digit',
                minute: '2-digit',
            }
            : {}),
    });
}

// ---------------------------------------------------------
// Get Entry By
// ---------------------------------------------------------

function getEntryBy(d) {
    return (
        d.entry_by_name ||
        d.entry_by?.name ||
        d.user?.name ||
        d.entry_by ||
        '—'
    );
}

// ---------------------------------------------------------
// Load Deductions
// ---------------------------------------------------------

export async function loadDeductions(panel, empId) {
    const tbody = panel.querySelector('#deductionHeaderTableBody');

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="9"
                class="px-4 py-10 text-center text-sm text-gray-400">
                Loading deductions...
            </td>
        </tr>
    `;

    try {
        const params = new URLSearchParams({
            emp_id: String(empId),
        });

        const response = await fetchJson(
            `${API.deductions}?${params.toString()}`
        );

        state.currentDeductions = response.data || [];

        // Reset selected type when loading another employee
        state.deductionSortId = null;
        state.deductionSort = 'start_date';
        state.deductionSortDirection = 'desc';

        renderDeductions(panel);

    } catch (error) {
        console.error('Failed to load deductions:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="px-4 py-10 text-center text-sm text-red-500">
                    Failed to load deductions.
                </td>
            </tr>
        `;
    }
}

// ---------------------------------------------------------
// Update Stop Deduction Status
// ---------------------------------------------------------

async function updateDeductionStatus(panel, checkbox) {
    const deductionId = checkbox.dataset.id;
    const newStatus = checkbox.checked ? 1 : 0;

    const deduction = state.currentDeductions.find(
        d => String(d.id) === String(deductionId)
    );

    if (!deduction) {
        checkbox.checked = !checkbox.checked;
        return;
    }

    const previousStatus = Number(deduction.status) === 1 ? 1 : 0;

    checkbox.disabled = true;

    try {
        const response = await fetchJson(API.update(deductionId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        if (!response.success) {
            throw new Error(
                response.message || 'Unable to update deduction status.'
            );
        }

        deduction.status = newStatus;

        checkbox.checked = newStatus === 1;

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: newStatus === 1
                ? 'Successfully Stopped'
                : 'Successfully Activated',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            width: '380px',
            padding: '12px 18px',
            ...swalTheme(),
        });

    } catch (error) {
        console.error('Failed to update deduction status:', error);

        deduction.status = previousStatus;
        checkbox.checked = previousStatus === 1;

        await Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message || 'Unable to update deduction status.',
            confirmButtonColor: '#dc2626',
            ...swalTheme(),
        });

    } finally {
        checkbox.disabled = false;
    }
}

// ---------------------------------------------------------
// Initialize Status Checkbox Event
// ---------------------------------------------------------

function initDeductionStatusEvents(panel) {
    const tbody = panel.querySelector('#deductionHeaderTableBody');

    if (!tbody || tbody.dataset.statusInitialized === 'true') {
        return;
    }

    tbody.dataset.statusInitialized = 'true';

    tbody.addEventListener('change', event => {
        const checkbox = event.target.closest('.deduction-status-checkbox');

        if (!checkbox || checkbox.disabled) return;

        updateDeductionStatus(panel, checkbox);
    });
}

// ---------------------------------------------------------
// Render Deductions
// ---------------------------------------------------------

export function renderDeductions(panel) {
    const tbody = panel.querySelector('#deductionHeaderTableBody');

    if (!tbody) return;

    initDeductionStatusEvents(panel);

    // Start with all employee deductions
    let data = [...(state.currentDeductions || [])];

    // -----------------------------------------------------
    // FILTER BY SELECTED TYPE
    // -----------------------------------------------------

    if (
        state.deductionSort === 'type' &&
        state.deductionSortId !== null &&
        state.deductionSortId !== undefined
    ) {
        data = data.filter(d =>
            String(d.deduction_type_id) ===
            String(state.deductionSortId)
        );
    }

    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    ${
                        state.deductionSort === 'type'
                            ? 'No deductions found for the selected type.'
                            : 'No deductions found.'
                    }
                </td>
            </tr>
        `;

        return;
    }

    // -----------------------------------------------------
    // SORTING
    // -----------------------------------------------------

    data.sort((a, b) => {
        let valA;
        let valB;

        if (state.deductionSort === 'type') {
            valA = a.deduction_type?.title?.toLowerCase() || '';
            valB = b.deduction_type?.title?.toLowerCase() || '';

        } else if (state.deductionSort === 'start_date') {
            valA = new Date(a.start_date).getTime() || 0;
            valB = new Date(b.start_date).getTime() || 0;

        } else if (state.deductionSort === 'total_amount') {
            valA = parseFloat(a.total_amount) || 0;
            valB = parseFloat(b.total_amount) || 0;

        } else {
            valA = 0;
            valB = 0;
        }

        if (valA < valB) {
            return state.deductionSortDirection === 'asc' ? -1 : 1;
        }

        if (valA > valB) {
            return state.deductionSortDirection === 'asc' ? 1 : -1;
        }

        return 0;
    });

    // -----------------------------------------------------
    // TABLE ROWS
    // -----------------------------------------------------

    tbody.innerHTML = data.map(d => {
        const isStopped = Number(d.status) === 1;

        const balance = Number(d.balance ?? 0);

        const isPaid = balance <= 0;

        return `
            <tr class="border-b border-gray-100 dark:border-gray-600
                       hover:bg-gray-50 dark:hover:bg-gray-600/40
                       transition-colors">

                <!-- Stop Deduction -->
                <td class="px-3 py-3 text-center whitespace-nowrap">
                    <input
                        type="checkbox"
                        class="deduction-status-checkbox w-4 h-4
                               accent-green-600 cursor-pointer
                               disabled:opacity-50 disabled:cursor-wait"
                        data-id="${escapeHtml(d.id)}"
                        aria-label="Stop deduction"
                        title="${isStopped ? 'Activate deduction' : 'Stop deduction'}"
                        ${isStopped ? 'checked' : ''}
                    >
                </td>

                <!-- Deduction Type -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100">
                        ${escapeHtml(d.deduction_type?.title ?? 'Unknown')}
                    </span>
                </td>

                <!-- Payment -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        ${formatAmount(d.payment)}
                    </span>
                </td>

                <!-- Total Amount -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        ${formatAmount(d.total_amount)}
                    </span>
                </td>

                <!-- Balance -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs font-semibold ${
                        isPaid
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                    }">
                        ${formatAmount(d.balance)}
                    </span>

                    ${
                        isPaid
                            ? `<span class="ml-1 text-[10px] font-semibold text-green-600 dark:text-green-400">PAID</span>`
                            : ''
                    }
                </td>

                <!-- Start Payment -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        ${formatDate(d.start_date)}
                    </span>
                </td>

                <!-- End Payment -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        ${formatDate(d.end_date)}
                    </span>
                </td>

                <!-- Entry By -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        ${escapeHtml(getEntryBy(d))}
                    </span>
                </td>

                <!-- Created At -->
                <td class="px-3 py-3 whitespace-nowrap">
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        ${formatDate(d.created_at, true)}
                    </span>
                </td>

            </tr>
        `;
    }).join('');
}

// ---------------------------------------------------------
// Reset Deduction Grids
// ---------------------------------------------------------

export function resetDeductionGrids(panel) {
    state.currentDeductions = [];

    state.deductionSortId = null;
    state.deductionSort = 'start_date';
    state.deductionSortDirection = 'desc';

    setHtml(
        panel,
        'deductionHeaderTableBody',
        `
            <tr>
                <td colspan="9"
                    class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Select an employee to load deductions.
                </td>
            </tr>
        `
    );
}