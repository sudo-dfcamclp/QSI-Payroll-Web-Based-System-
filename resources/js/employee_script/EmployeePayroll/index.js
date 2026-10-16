import { state } from './state.js';
import {
    loadClientList,
    loadCutoffList,
    initializeCutoffSearch
} from './list.js';
import { initializeClientSearch } from './search.js';
import { initializeSort } from './sort.js';

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
    const clientList = panel.querySelector('#payrollClientList');
    const clientSearch = panel.querySelector('#payrollClientSearch');
    const clientPagination = panel.querySelector('#payrollClientPagination');
    const clientSortButton = panel.querySelector('#payrollClientSortButton');
    const cutoffList = panel.querySelector('#payrollCutoffList');
    const cutoffSearch = panel.querySelector('#payrollCutoffSearch');
    const backButton = panel.querySelector('#employeeBackButton');

    if (!clientListView || !cutoffListView || !clientList || !cutoffList) {
        console.error('Employee Payroll: required elements were not found.');
        return;
    }

    const ctx = {
        panel,
        dom: {
            clientListView,
            cutoffListView,
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

            clientListView.classList.add('hidden');
            cutoffListView.classList.remove('hidden');

            cutoffListView.dataset.clientId = clientId;
            cutoffListView.dataset.clientName = clientName || '';

            if (cutoffSearch) {
                cutoffSearch.value = '';
            }

            return loadCutoffList(ctx, clientId);
        },
        showClientList() {
            cutoffListView.classList.add('hidden');
            clientListView.classList.remove('hidden');
        }
    };

    initializeClientSearch(ctx);
    initializeSort(ctx);
    initializeCutoffSearch(ctx);

    loadClientList(ctx, '', 1);

    backButton?.addEventListener('click', () => {
        ctx.showClientList();
    });
}
