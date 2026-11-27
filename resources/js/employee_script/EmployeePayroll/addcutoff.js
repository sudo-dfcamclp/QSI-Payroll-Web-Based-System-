import Swal from 'sweetalert2';
import { state } from './state.js';
import { API } from './config.js';

// Initialize add cutoff button
export function initializeAddCutoff(ctx) {
    const button = ctx.panel.querySelector('#payrollAddCutoffButton');
    if (!button || button.dataset.initialized === 'true') return;
    button.dataset.initialized = 'true';
    button.addEventListener('click', () => {
        openAddCutoffModal(ctx);
    });
}

// Add cutoff modal
export async function openAddCutoffModal(ctx) {
    const clientId = state.payrollSelectedClientId;

    if (!clientId) {
        await Swal.fire({
            icon: 'warning',
            title: 'No Client Selected',
            text: 'Please select a client first.',
        });
        return;
    }

    const isDark = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
        title: 'Add New Cutoff',
        html: `
            <div class="text-left space-y-5">
                <div>
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Cutoff Basic</h3>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payroll Period</label>
                        <input type="text" id="newCutoffPayrollPeriod" readonly placeholder="Select From and To dates" class="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm cursor-not-allowed">
                    </div>
                    <div class="mb-4">
                        <label for="newCutoffFrom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
                        <input type="date" id="newCutoffFrom" class="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="newCutoffTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
                        <input type="date" id="newCutoffTo" class="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
            </div>
        `,
        width: 450,
        padding: '1.5rem',
        background: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#e5e7eb' : '#111827',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#dc2626',
        reverseButtons: true,
        focusConfirm: false,
        didOpen: () => {
            const fromInput = document.getElementById('newCutoffFrom');
            const toInput = document.getElementById('newCutoffTo');
            const periodInput = document.getElementById('newCutoffPayrollPeriod');

            const formatDate = (value) => {
                if (!value) return '';
                const [year, month, day] = value.split('-');
                return new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day)
                ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                });
            };

            const updatePayrollPeriod = () => {
                const from = fromInput.value;
                const to = toInput.value;
                if (from && to) {
                    periodInput.value = `${formatDate(from)} - ${formatDate(to)}`;
                } else if (from) {
                    periodInput.value = `${formatDate(from)} -`;
                } else if (to) {
                    periodInput.value = `- ${formatDate(to)}`;
                } else {
                    periodInput.value = '';
                }
                toInput.min = from || '';
            };

            fromInput.addEventListener('change', updatePayrollPeriod);
            toInput.addEventListener('change', updatePayrollPeriod);
        },
        preConfirm: () => {
            const from = document.getElementById('newCutoffFrom').value;
            const to = document.getElementById('newCutoffTo').value;
            if (!from || !to) {
                Swal.showValidationMessage('Please select both From and To dates.');
                return false;
            }
            if (to < from) {
                Swal.showValidationMessage('The To date must not be earlier than the From date.');
                return false;
            }
            return {
                client_id: clientId,
                start_date: from,
                end_date: to,
            };
        },
    });

    if (!result.isConfirmed) return;
    await saveCutoff(ctx, result.value);
}

// Save cutoff
async function saveCutoff(ctx, data) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const isDark = document.documentElement.classList.contains('dark');

    try {
        Swal.fire({
            title: 'Saving Cutoff...',
            text: 'Please wait.',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#e5e7eb' : '#111827',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await fetch(API.cutoffs, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
            },
            credentials: 'same-origin',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Unable to save payroll cutoff.');
        }

        await Swal.fire({
            icon: 'success',
            title: 'Cutoff Added',
            text: result.message || 'Payroll cutoff has been saved successfully.',
            timer: 1500,
            showConfirmButton: false,
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#e5e7eb' : '#111827',
        });

        // Refresh cutoff list for the currently selected client
        await ctx.loadCutoffList(
            state.payrollSelectedClientId,
            state.payrollCutoffSearch || '',
            1
        );
    } catch (error) {
        console.error('Save cutoff error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: error.message || 'Something went wrong while saving cutoff.',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#e5e7eb' : '#111827',
        });
    }
}