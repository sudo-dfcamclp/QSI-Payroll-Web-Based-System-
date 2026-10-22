import { state } from './state.js';
import { loadClientList, loadCutoffList, initializeCutoffSearch } from './list.js';
import { initializeClientSearch } from './search.js';
import { initializeSort } from './sort.js';
import { initializePayrollForm } from './payrollform.js';

export { loadClientList, loadCutoffList, initializeClientSearch, initializeCutoffSearch, initializeSort };

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
        loadClientList(search = '', page = 1, filters = {}) {
            return loadClientList(ctx, search, page, filters);
        },
        loadCutoffList(clientId, search = '') {
            return loadCutoffList(ctx, clientId, search);
        },
        showCutoffList(clientId, clientName) {
            if (!clientId) {
                console.error('Employee Payroll: client ID is missing.');
                return;
            }

            state.payrollSelectedClientId = clientId;
            state.payrollSelectedClientName = clientName || '';

            payrollTransactionView?.classList.add('hidden');
            clientListView.classList.add('hidden');
            cutoffListView.classList.remove('hidden');

            cutoffListView.dataset.clientId = clientId;
            cutoffListView.dataset.clientName = clientName || '';

            if (cutoffSearch) cutoffSearch.value = '';

            return loadCutoffList(ctx, clientId);
        },
        showClientList() {
            payrollTransactionView?.classList.add('hidden');
            cutoffListView.classList.add('hidden');
            clientListView.classList.remove('hidden');
        },
        showPayrollTransaction(cutoff) {
            if (!cutoff) return;

            state.payrollSelectedCutoff = cutoff;
            state.payrollSelectedPeriodId = cutoff.period_id;

            clientListView.classList.add('hidden');
            cutoffListView.classList.add('hidden');
            payrollTransactionView?.classList.remove('hidden');

            if (!payrollTransactionView) {
                console.error('Employee Payroll: payroll transaction view was not found.');
                return;
            }

            initializePayrollForm(ctx, {
                clientId: state.payrollSelectedClientId,
                clientName: state.payrollSelectedClientName,
                cutoff
            });
        }
    };

    initializeClientSearch(ctx);
    initializeSort(ctx);
    initializeCutoffSearch(ctx);
    initializePayrollForm(ctx);
    loadClientList(ctx, '', 1);

    backButton?.addEventListener('click', () => ctx.showClientList());

    backToCutoffButton?.addEventListener('click', () => {
        payrollTransactionView?.classList.add('hidden');
        cutoffListView.classList.remove('hidden');
    });

    cutoffList?.addEventListener('click', event => {
        const card = event.target.closest('[data-period-id]');
        if (!card) return;

        const periodId = card.dataset.periodId;
        const cutoff = (ctx.currentCutoffs || []).find(item => String(item.period_id) === String(periodId));

        if (cutoff) ctx.showPayrollTransaction(cutoff);
    });
}