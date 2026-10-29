
import { state } from './state.js';
import {
    loadClientList,
    loadCutoffList,
    initializeCutoffSearch
} from './list.js';
import { initializeClientSearch } from './search.js';
import { initializeSort } from './sort.js';
import { initializePayrollForm } from './payrollform.js';

import {
    savePayrollState,
    loadPayrollState,
    clearPayrollState
} from './localstorage.js';

export {
    loadClientList,
    loadCutoffList,
    initializeClientSearch,
    initializeCutoffSearch,
    initializeSort
};

export function init(panel) {
    const clientListView = panel.querySelector('#payrollClientListView');
    const cutoffListView = panel.querySelector('#payrollCutoffListView');
    const payrollTransactionView = panel.querySelector('#payrollTransactionView');

    const clientList = panel.querySelector('#payrollClientList');
    const clientSearch = panel.querySelector('#payrollClientSearch');
    const clientPagination = panel.querySelector('#payrollClientPagination');
    const clientSortButton = panel.querySelector('#payrollClientSortButton');

    const cutoffList = panel.querySelector('#payrollCutoffList');
    const cutoffSearch = panel.querySelector('#payrollCutoffSearch');

    const backButton = panel.querySelector('#employeeBackButton');
    const backToCutoffButton = panel.querySelector('#payrollBackToCutoffButton');

    if (!clientListView || !cutoffListView || !clientList || !cutoffList) {
        console.error('Employee Payroll: required elements were not found.');
        return;
    }

    // Prevent duplicate initialization on the same panel.
    if (panel.dataset.payrollNavigationInitialized === 'true') {
        return;
    }

    panel.dataset.payrollNavigationInitialized = 'true';

    const ctx = {
        panel,

        dom: {
            clientListView,
            cutoffListView,
            payrollTransactionView,
            clientList,
            clientSearch,
            clientPagination,
            payrollClientSortButton: clientSortButton,
            cutoffList,
            cutoffSearch,
            backButton
        },

        currentCutoffs: [],

        loadClientList(search = '', page = 1, filters = {}) {
            return loadClientList(ctx, search, page, filters);
        },

        loadCutoffList(clientId, search = '', page = 1) {
            return loadCutoffList(ctx, clientId, search, page);
        },

        showCutoffList(clientId, clientName) {
            if (!clientId) {
                console.error('Employee Payroll: client ID is missing.');
                return;
            }

            state.payrollSelectedClientId = String(clientId);
            state.payrollSelectedClientName = clientName || '';

            // A new client means the previous cutoff is no longer selected.
            state.payrollSelectedPeriodId = null;
            state.payrollSelectedCutoff = null;

            savePayrollState({
                currentStep: 'cutoff',
                clientId: String(clientId),
                clientName: clientName || '',
                periodId: null,
                cutoff: null
            });

            payrollTransactionView?.classList.add('hidden');
            clientListView.classList.add('hidden');
            cutoffListView.classList.remove('hidden');

            cutoffListView.dataset.clientId = String(clientId);
            cutoffListView.dataset.clientName = clientName || '';

            if (cutoffSearch) {
                cutoffSearch.value = '';
            }

            return ctx.loadCutoffList(clientId, '', 1);
        },

        showClientList() {
            savePayrollState({
                currentStep: 'client-list'
            });

            payrollTransactionView?.classList.add('hidden');
            cutoffListView.classList.add('hidden');
            clientListView.classList.remove('hidden');
        },

        showPayrollTransaction(cutoff) {
            if (!cutoff || !cutoff.period_id) {
                console.error('Employee Payroll: cutoff or period ID is missing.');
                return;
            }

            const clientId = state.payrollSelectedClientId;
            const clientName = state.payrollSelectedClientName || '';

            if (!clientId) {
                console.error('Employee Payroll: selected client is missing.');
                return;
            }

            state.payrollSelectedCutoff = cutoff;
            state.payrollSelectedPeriodId = cutoff.period_id;
            state.payrollSelectedCutoffNo = cutoff.cutoff_no ?? null;
            state.payrollSelectedCutoffStartDate = cutoff.start_date ?? null;
            state.payrollSelectedCutoffEndDate = cutoff.end_date ?? null;
            state.payrollSelectedCutoffStatus = cutoff.status ?? null;
            state.payrollSelectedPayDate = cutoff.pay_date ?? null;

            savePayrollState({
                currentStep: 'payroll-form',
                clientId: String(clientId),
                clientName,
                periodId: String(cutoff.period_id),
                cutoff
            });

            if (payrollTransactionView) {
                payrollTransactionView.dataset.clientId = String(clientId);
                payrollTransactionView.dataset.periodId = String(cutoff.period_id);
            }

            clientListView.classList.add('hidden');
            cutoffListView.classList.add('hidden');
            payrollTransactionView?.classList.remove('hidden');

            if (!payrollTransactionView) {
                console.error('Employee Payroll: payroll transaction view was not found.');
                return;
            }

            initializePayrollForm(ctx, {
                clientId: String(clientId),
                clientName,
                periodId: String(cutoff.period_id),
                cutoff
            });
        }
    };

    initializeClientSearch(ctx);
    initializeSort(ctx);
    initializeCutoffSearch(ctx);

    // Initialize form event handlers once. Actual employee loading happens
    // when a valid client and cutoff are selected.
    initializePayrollForm(ctx);

    async function restoreNavigation() {
        const saved = loadPayrollState();

        // Always load the client list first.
        await ctx.loadClientList('', 1);

        if (!saved || !saved.currentStep || saved.currentStep === 'client-list') {
            ctx.showClientList();
            return;
        }

        if (!saved.clientId) {
            clearPayrollState();
            ctx.showClientList();
            return;
        }

        state.payrollSelectedClientId = String(saved.clientId);
        state.payrollSelectedClientName = saved.clientName || '';

        cutoffListView.dataset.clientId = String(saved.clientId);
        cutoffListView.dataset.clientName = saved.clientName || '';

        // Load cutoffs before attempting to restore the selected period.
        await ctx.loadCutoffList(saved.clientId, '', 1);

        const cutoff = ctx.currentCutoffs.find(
            item => String(item.period_id) === String(saved.periodId)
        );

        if (saved.currentStep === 'payroll-form') {
            if (!cutoff) {
                // Saved cutoff may have been deleted or is no longer available.
                savePayrollState({
                    currentStep: 'cutoff',
                    periodId: null,
                    cutoff: null
                });

                ctx.showCutoffList(saved.clientId, saved.clientName);
                return;
            }

            ctx.showPayrollTransaction(cutoff);
            return;
        }

        // Restore the cutoff screen even if no cutoff was previously selected.
        payrollTransactionView?.classList.add('hidden');
        clientListView.classList.add('hidden');
        cutoffListView.classList.remove('hidden');
    }

    backButton?.addEventListener('click', () => {
        ctx.showClientList();
    });

    backToCutoffButton?.addEventListener('click', () => {
        savePayrollState({
            currentStep: 'cutoff'
        });

        payrollTransactionView?.classList.add('hidden');
        cutoffListView.classList.remove('hidden');
    });

    restoreNavigation().catch(error => {
        console.error('Failed to restore payroll navigation:', error);
        ctx.showClientList();
    });
}
