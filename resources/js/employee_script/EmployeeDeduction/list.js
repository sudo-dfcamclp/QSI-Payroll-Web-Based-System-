
// resources/js/employee_script/EmployeeDeduction/list.js

import { state } from './state.js';

import {
    showClientView,
    showEmployeeView,
    loadClients,
} from './clients.js';

import {
    loadEmployees,
} from './employees.js';

import {
    resetEmployeeInfo,
} from './employee-info.js';

import {
    resetDeductionGrids,
    renderDeductions,
} from './deductions.js';

import {
    resetPaymentDetails,
} from './payment-history.js';

import {
    initSearch,
} from './search.js';

import {
    createDeductionSortMenu,
} from './sort.js';

import {
    saveModuleState,
} from '../../components/localstorage.js';

// ---------------------------------------------------------
// Save State
// ---------------------------------------------------------

function saveEmployeeDeductionState() {
    saveModuleState('employeeDeduction', {
        currentView: state.currentView,
        clientPage: state.clientPage,
        employeePage: state.employeePage,
        selectedClientId: state.selectedClientId,
        selectedEmployeeId: state.selectedEmployeeId,
        deductionSort: state.deductionSort,
        deductionSortDirection: state.deductionSortDirection,
        deductionSortId: state.deductionSortId,
    });
}

// ---------------------------------------------------------
// Navigation
// ---------------------------------------------------------

function initBackToClient(panel) {
    const backButton = panel.querySelector('#headerBackToClient');

    if (!backButton) return;

    backButton.addEventListener('click', event => {
        event.preventDefault();

        if (!state.selectedClientId) return;

        state.selectedClientId = null;
        state.selectedEmployeeId = null;

        state.currentView = 'client';

        state.employeeSearch = '';
        state.employeePage = 1;

        const searchInput = panel.querySelector('#searchInput');

        if (searchInput) {
            searchInput.value = state.clientSearch;
        }

        showClientView(panel);

        resetEmployeeInfo(panel);
        resetDeductionGrids(panel);
        resetPaymentDetails(panel);

        panel.querySelectorAll('.client-box.active').forEach(box => {
            box.classList.remove('active');
        });

        panel.querySelectorAll('.employee-box.active').forEach(box => {
            box.classList.remove(
                'active',
                'bg-green-600',
                'dark:bg-green-600',
                'border-green-500',
                'text-white',
                'font-semibold'
            );

            box.classList.add(
                'bg-white',
                'dark:bg-gray-700',
                'border-gray-100',
                'dark:border-gray-600',
                'text-gray-800',
                'dark:text-gray-100'
            );
        });

        saveEmployeeDeductionState();

        loadClients(panel, state.clientPage, state.clientSearch);
    });
}

// ---------------------------------------------------------
// Sorting
// ---------------------------------------------------------

function initDeductionSort(panel) {
    const sortButton = panel.querySelector('#btnSortDeduction');

    if (!sortButton) return;

    sortButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        createDeductionSortMenu(
            panel,
            state,
            () => {
                renderDeductions(panel);
                saveEmployeeDeductionState();
            }
        );
    });
}

// ---------------------------------------------------------
// Restore Previous View
// ---------------------------------------------------------

async function restorePreviousView(panel) {
    const searchInput = panel.querySelector('#searchInput');

    // No saved client or previous view is client list.
    if (
        !state.selectedClientId ||
        state.currentView !== 'employee'
    ) {
        state.currentView = 'client';
        state.selectedClientId = null;
        state.selectedEmployeeId = null;

        if (searchInput) {
            searchInput.value = state.clientSearch;
        }

        showClientView(panel);

        return;
    }

    // Check if the saved client exists in the loaded client list.
    const selectedClient = [
        ...panel.querySelectorAll('.client-box')
    ].find(box =>
        String(box.dataset.clientId) ===
        String(state.selectedClientId)
    );

    // Saved client is no longer available in the current result.
    if (!selectedClient) {
        state.selectedClientId = null;
        state.selectedEmployeeId = null;
        state.currentView = 'client';

        if (searchInput) {
            searchInput.value = state.clientSearch;
        }

        showClientView(panel);

        return;
    }

    // Restore client selection highlight.
    selectedClient.classList.add('active');

    // Restore employee view.
    showEmployeeView(
        panel,
        selectedClient.dataset.clientName
    );

    if (searchInput) {
        searchInput.value = state.employeeSearch;
    }

    // Clear old UI data before fetching fresh API data.
    resetEmployeeInfo(panel);
    resetDeductionGrids(panel);
    resetPaymentDetails(panel);

    // Load employees and restore selected employee if available.
    await loadEmployees(
        panel,
        state.selectedClientId,
        state.employeePage,
        state.employeeSearch
    );
}

// ---------------------------------------------------------
// Initialization
// ---------------------------------------------------------

export async function initList(panel) {
    // Fresh API data only.
    state.currentDeductions = [];

    // Initialize event listeners.
    initSearch(panel);
    initDeductionSort(panel);
    initBackToClient(panel);

    // Load clients first.
    await loadClients(
        panel,
        state.clientPage,
        state.clientSearch
    );

    // Restore previous screen and selection.
    await restorePreviousView(panel);

    // Save the final restored state.
    saveEmployeeDeductionState();
}
