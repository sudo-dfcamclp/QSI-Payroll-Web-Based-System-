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

// BARREL EXPORTS
export {
    loadClientList,
    loadCutoffList,
    initializeClientSearch,
    initializeCutoffSearch,
    initializeSort
};

export { createPayrollComputation } from './payrollcomputation.js';

// INITIALIZE PAYROLL MODULE
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

    // BREADCRUMB ELEMENTS
    const breadcrumbTrail = panel.querySelector('#employeePayrollBreadcrumbTrail');
    const breadcrumbClient = panel.querySelector('#employeeBreadcrumbClient');
    const breadcrumbCutoff = panel.querySelector('#employeeBreadcrumbCutoff');
    const breadcrumbPayroll = panel.querySelector('#employeeBreadcrumbPayroll');

    if (!clientListView || !cutoffListView || !clientList || !cutoffList) {
        console.error('Employee Payroll: required elements were not found.');
        return;
    }

    if (panel.dataset.payrollNavigationInitialized === 'true') {
        return;
    }

    panel.dataset.payrollNavigationInitialized = 'true';

    // FORMAT CUTOFF DATE
    function formatCutoffDate(value) {
        if (!value) return '';

        const date = String(value).split('T')[0];
        const [year, month, day] = date.split('-');

        if (!year || !month || !day) return date;

        return `${month}/${day}/${year}`;
    }

    // GET CUTOFF BREADCRUMB LABEL
    function getCutoffBreadcrumbName(cutoff) {
        if (!cutoff) return 'Cutoff';

        if (cutoff.month_name) return String(cutoff.month_name);
        if (cutoff.cutoff_month) return String(cutoff.cutoff_month);
        if (cutoff.month_year) return String(cutoff.month_year);
        if (cutoff.period_name) return String(cutoff.period_name);

        if (cutoff.start_date && cutoff.end_date) {
            return `${formatCutoffDate(cutoff.start_date)} - ${formatCutoffDate(cutoff.end_date)}`;
        }

        if (cutoff.start_date) {
            return formatCutoffDate(cutoff.start_date);
        }

        return cutoff.cutoff_no
            ? `Cutoff ${cutoff.cutoff_no}`
            : 'Cutoff';
    }

    // UPDATE BREADCRUMB
    function updatePayrollBreadcrumb(
        stage,
        clientName = state.payrollSelectedClientName || '',
        cutoffName = ''
    ) {
        if (!breadcrumbTrail) return;

        const isClientList = stage === 'clients';
        const isPayroll = stage === 'payroll';

        breadcrumbTrail.classList.toggle('hidden', isClientList);
        breadcrumbTrail.classList.toggle('flex', !isClientList);

        if (breadcrumbClient) {
            breadcrumbClient.textContent = clientName || 'Client';
            breadcrumbClient.dataset.clientId = String(
                state.payrollSelectedClientId || ''
            );
            breadcrumbClient.dataset.clientName = clientName || '';
            breadcrumbClient.classList.add('cursor-pointer');
        }

        if (breadcrumbCutoff) {
            breadcrumbCutoff.textContent = cutoffName || 'Cutoff';
            breadcrumbCutoff.classList.toggle('hidden', !isPayroll);
            breadcrumbCutoff.classList.toggle('inline-flex', isPayroll);

            breadcrumbCutoff.dataset.clientId = String(
                state.payrollSelectedClientId || ''
            );

            breadcrumbCutoff.dataset.clientName = clientName || '';
        }

        if (breadcrumbPayroll) {
            breadcrumbPayroll.classList.toggle('hidden', !isPayroll);
            breadcrumbPayroll.classList.toggle('inline-flex', isPayroll);
        }
    }

    // RESET EMPLOYEE FORM CACHE
    function resetPayrollEmployeeState() {
        if (!payrollTransactionView) return;

        payrollTransactionView.dataset.employeesLoaded = 'false';
        payrollTransactionView.dataset.employeeRequestKey = '';
        payrollTransactionView.dataset.selectedEmployeeId = '';
        payrollTransactionView.dataset.selectedEmployeeRates = '[]';
        payrollTransactionView.dataset.selectedPayrollStatus = '';
    }

    // PAYROLL CONTEXT
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

        // LOAD CLIENT LIST
        loadClientList(search = '', page = 1, filters = {}) {
            return loadClientList(ctx, search, page, filters);
        },

        // LOAD CUTOFF LIST
        loadCutoffList(clientId, search = '', page = 1) {
            return loadCutoffList(ctx, clientId, search, page);
        },

        // SHOW CUTOFF LIST
        showCutoffList(clientId, clientName) {
            if (!clientId) {
                console.error('Employee Payroll: client ID is missing.');
                return;
            }

            state.payrollSelectedClientId = String(clientId);
            state.payrollSelectedClientName = clientName || '';
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
            cutoffListView.classList.remove('hidden');
            clientListView.classList.add('hidden');

            cutoffListView.dataset.clientId = String(clientId);
            cutoffListView.dataset.clientName = clientName || '';

            if (cutoffSearch) {
                cutoffSearch.value = '';
            }

            state.payrollCutoffListPage = 1;
            state.payrollCutoffSearch = '';

            updatePayrollBreadcrumb('cutoffs', clientName);

            return ctx.loadCutoffList(clientId, '', 1);
        },

        // SHOW CLIENT LIST
        showClientList() {
            savePayrollState({
                currentStep: 'client-list'
            });

            state.payrollSelectedClientId = null;
            state.payrollSelectedClientName = '';
            state.payrollSelectedPeriodId = null;
            state.payrollSelectedCutoff = null;

            payrollTransactionView?.classList.add('hidden');
            cutoffListView.classList.add('hidden');
            clientListView.classList.remove('hidden');

            updatePayrollBreadcrumb('clients');
        },

        // SHOW PAYROLL FORM
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

            updatePayrollBreadcrumb(
                'payroll',
                clientName,
                getCutoffBreadcrumbName(cutoff)
            );

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

    // CLICK CLIENT NAME - BACK TO CLIENT LIST
    if (breadcrumbClient) {
        breadcrumbClient.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            ctx.showClientList();
        };
    }

    // CLICK CUTOFF DATE - BACK TO CUTOFF LIST
    if (breadcrumbCutoff) {
        breadcrumbCutoff.onclick = async event => {
            event.preventDefault();
            event.stopPropagation();

            const clientId = String(
                state.payrollSelectedClientId || ''
            );

            const clientName = state.payrollSelectedClientName || '';

            if (!clientId) {
                console.error('Cannot navigate to cutoff list: client ID is missing.');
                return;
            }

            resetPayrollEmployeeState();

            await ctx.showCutoffList(clientId, clientName);
        };
    }

    // INITIALIZE SEARCH AND SORT
    initializeClientSearch(ctx);
    initializeSort(ctx);
    initializeCutoffSearch(ctx);

    // INITIALIZE PAYROLL FORM
    // Actual form initialization happens when a cutoff is selected.
    // This avoids initializing the form before client and period IDs exist.

    // RESTORE NAVIGATION
    async function restoreNavigation() {
        const saved = loadPayrollState();

        await ctx.loadClientList('', 1);

        if (
            !saved ||
            !saved.currentStep ||
            saved.currentStep === 'client-list'
        ) {
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

        await ctx.loadCutoffList(saved.clientId, '', 1);

        const cutoff = ctx.currentCutoffs.find(
            item => String(item.period_id) === String(saved.periodId)
        );

        if (saved.currentStep === 'payroll-form') {
            if (!cutoff) {
                savePayrollState({
                    currentStep: 'cutoff',
                    clientId: String(saved.clientId),
                    clientName: saved.clientName || '',
                    periodId: null,
                    cutoff: null
                });

                await ctx.showCutoffList(
                    saved.clientId,
                    saved.clientName
                );

                return;
            }

            ctx.showPayrollTransaction(cutoff);
            return;
        }

        // RESTORE CUTOFF LIST
        state.payrollSelectedPeriodId = null;
        state.payrollSelectedCutoff = null;

        updatePayrollBreadcrumb(
            'cutoffs',
            saved.clientName || ''
        );

        payrollTransactionView?.classList.add('hidden');
        clientListView.classList.add('hidden');
        cutoffListView.classList.remove('hidden');
    }

    // BACK TO CLIENT LIST BUTTON
    backButton?.addEventListener('click', () => {
        ctx.showClientList();
    });

    // BACK TO CUTOFF LIST BUTTON
    backToCutoffButton?.addEventListener('click', async () => {
        const clientId = String(
            state.payrollSelectedClientId || ''
        );

        const clientName = state.payrollSelectedClientName || '';

        if (!clientId) {
            console.error('Cannot return to cutoff list: client ID is missing.');
            return;
        }

        resetPayrollEmployeeState();

        await ctx.showCutoffList(clientId, clientName);
    });

    // START NAVIGATION RESTORE
    restoreNavigation().catch(error => {
        console.error('Failed to restore payroll navigation:', error);
        ctx.showClientList();
    });
}