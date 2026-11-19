
// resources/js/employee_script/EmployeeDeduction/clients.js

import { state } from './state.js';

import {
    fetchJson,
    renderPagination,
    escapeHtml,
} from './helpers.js';

import { API } from './config.js';

import { loadEmployees } from './employees.js';

import {
    resetEmployeeInfo,
} from './employee-info.js';

import {
    resetDeductionGrids,
} from './deductions.js';

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
// Client / Employee View
// ---------------------------------------------------------


export function showClientView(panel) {
    panel.querySelector('#clientListContainer')
        ?.classList.remove('hidden');

    panel.querySelector('#clientPaginationContainer')
        ?.classList.remove('hidden');

    panel.querySelector('#employeeListContainer')
        ?.classList.add('hidden');

    panel.querySelector('#employeePaginationContainer')
        ?.classList.add('hidden');

    const backButton = panel.querySelector('#headerBackToClient');

    if (backButton) {
        backButton.innerHTML = `
            <span>Client</span>
        `;

        backButton.classList.remove('hidden');
    }

    panel.querySelector('#headerBreadcrumbSeparator')
        ?.classList.add('hidden');

    panel.querySelector('#headerPageTitle')
        ?.classList.add('hidden');
}

export function showEmployeeView(panel, clientName = '') {
    panel.querySelector('#clientListContainer')
        ?.classList.add('hidden');

    panel.querySelector('#clientPaginationContainer')
        ?.classList.add('hidden');

    panel.querySelector('#employeeListContainer')
        ?.classList.remove('hidden');

    panel.querySelector('#employeePaginationContainer')
        ?.classList.remove('hidden');

    const backButton = panel.querySelector('#headerBackToClient');

    if (backButton) {
        backButton.innerHTML = `
            <i class="fa-solid fa-arrow-left mr-2"></i>
            ${escapeHtml(clientName || 'Client')}
        `;

        backButton.classList.remove('hidden');
    }

    panel.querySelector('#headerBreadcrumbSeparator')
        ?.classList.remove('hidden');

    const pageTitle = panel.querySelector('#headerPageTitle');

    if (pageTitle) {
        pageTitle.textContent = 'Employee Deduction';
        pageTitle.classList.remove('hidden');
    }
}


// ---------------------------------------------------------
// Load Clients
// ---------------------------------------------------------

export async function loadClients(panel, page = 1, search = '') {
    const container = panel.querySelector('#clientListContainer');

    if (!container) return;

    state.clientPage = page;
    state.clientSearch = search;

    // Save persistent state only.
    // Search is runtime-only and is not saved.
    saveEmployeeDeductionState();

    container.innerHTML = `
        <p class="text-gray-400 text-[10px] text-center py-2">
            Loading clients...
        </p>
    `;

    try {
        const params = new URLSearchParams({
            page: String(page),
            search: search || '',
        });

        const response = await fetchJson(
            `${API.clients}?${params.toString()}`
        );

        const { data, meta, pagination } = response;
        const paginationMeta = meta || pagination || null;

        state.clientLastPage = Number(
            paginationMeta?.last_page || 1
        );

        state.clientTotal = Number(
            paginationMeta?.total || 0
        );

        renderClients(panel, data || []);
        renderClientPagination(panel, paginationMeta);

    } catch (error) {
        console.error('Failed to load clients:', error);

        container.innerHTML = `
            <p class="text-red-500 text-xs text-center py-2">
                Failed to load clients.
            </p>
        `;
    }
}

// ---------------------------------------------------------
// Render Clients
// ---------------------------------------------------------

function renderClients(panel, clients) {
    const container = panel.querySelector('#clientListContainer');

    if (!container) return;

    if (!clients.length) {
        container.innerHTML = `
            <p class="text-gray-400 text-[10px] text-center py-2">
                No clients found.
            </p>
        `;

        return;
    }

    container.className = 'flex flex-col gap-1.5 w-full';

    container.innerHTML = clients.map(client => `
        <div
            class="client-box bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 px-3 h-9 flex items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-100 truncate ${String(client.client_id) === String(state.selectedClientId) ? 'active' : ''}"
            data-client-id="${client.client_id}"
            data-client-name="${escapeHtml(client.client_name)}"
            title="${escapeHtml(client.client_name)}"
        >
            ${escapeHtml(client.client_name)}
        </div>
    `).join('');

    container.querySelectorAll('.client-box').forEach(box => {
        box.addEventListener('click', () => {
            onClientClick(panel, box);
        });
    });
}

// ---------------------------------------------------------
// Client Pagination
// ---------------------------------------------------------

function renderClientPagination(panel, meta) {
    const container = panel.querySelector(
        '#clientPaginationContainer'
    );

    renderPagination(
        container,
        meta,
        page => loadClients(panel, page, state.clientSearch),
        'clients'
    );
}

// ---------------------------------------------------------
// Client Selection
// ---------------------------------------------------------

async function onClientClick(panel, box) {
    panel.querySelectorAll('.client-box.active').forEach(item => {
        item.classList.remove('active');
    });

    box.classList.add('active');

    const clientId = box.dataset.clientId;
    const clientName = box.dataset.clientName;

    state.selectedClientId = clientId;
    state.selectedEmployeeId = null;

    state.currentView = 'employee';

    state.employeePage = 1;
    state.employeeSearch = '';

    // Save selection before loading employees.
    saveEmployeeDeductionState();

    const searchInput = panel.querySelector('#searchInput');

    if (searchInput) {
        searchInput.value = '';
    }

    // Show selected client name in breadcrumb.
    showEmployeeView(panel, clientName);

    await loadEmployees(panel, clientId, 1);

    resetEmployeeInfo(panel);
    resetDeductionGrids(panel);
}
