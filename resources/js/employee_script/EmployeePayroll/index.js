import {
    loadClientList
} from './list.js';

import {
    initializeClientSearch
} from './search.js';

import {
    initializeSort
} from './sort.js';

export {
    loadClientList,
    initializeClientSearch,
    initializeSort
};

export function init(panel) {
    const clientListView =
        panel.querySelector('#payrollClientListView');

    const cutoffListView =
        panel.querySelector('#payrollCutoffListView');

    const clientList =
        panel.querySelector('#payrollClientList');

    const clientSearch =
        panel.querySelector('#payrollClientSearch');

    const clientPagination =
        panel.querySelector('#payrollClientPagination');

    const clientSortButton =
        panel.querySelector('#payrollClientSortButton');

    const backButton =
        panel.querySelector('#employeeBackButton');

    if (
        !clientListView ||
        !cutoffListView ||
        !clientList
    ) {
        console.error(
            'Employee Payroll: required elements were not found.'
        );

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
            backButton
        },

        loadClientList(search = '', page = 1, filters = {}) {
            return loadClientList(
                ctx,
                search,
                page,
                filters
            );
        },

        showCutoffList(clientId, clientName) {
            clientListView.classList.add('hidden');
            cutoffListView.classList.remove('hidden');

            cutoffListView.dataset.clientId =
                clientId || '';

            cutoffListView.dataset.clientName =
                clientName || '';
        },

        showClientList() {
            cutoffListView.classList.add('hidden');
            clientListView.classList.remove('hidden');
        }
    };

    initializeClientSearch(ctx);

    initializeSort(ctx);

    loadClientList(
        ctx,
        '',
        1
    );

    backButton?.addEventListener(
        'click',
        () => {
            ctx.showClientList();
        }
    );
}

