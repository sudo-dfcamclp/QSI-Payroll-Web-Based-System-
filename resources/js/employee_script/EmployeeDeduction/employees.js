
// resources/js/employee_script/EmployeeDeduction/employees.js

import { state } from './state.js';

import {
    fetchJson,
    renderPagination,
    escapeHtml,
} from './helpers.js';

import { API } from './config.js';

import {
    renderEmployeeInfo,
} from './employee-info.js';

import {
    loadDeductions,
} from './deductions.js';

import {
    resetPaymentDetails,
} from './payment-history.js';

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
        clientSearch: state.clientSearch,
        employeePage: state.employeePage,
        employeeSearch: state.employeeSearch,
        selectedClientId: state.selectedClientId,
        selectedEmployeeId: state.selectedEmployeeId,
        deductionSort: state.deductionSort,
        deductionSortDirection: state.deductionSortDirection,
        deductionSortId: state.deductionSortId,
    });
}

// ---------------------------------------------------------
// Load Employees
// ---------------------------------------------------------

export async function loadEmployees(
    panel,
    clientId,
    page = 1,
    search = ''
) {
    const container = panel.querySelector('#employeeListContainer');

    if (!container) return;

    state.employeePage = page;
    state.employeeSearch = search;

    saveEmployeeDeductionState();

    container.innerHTML = `
        <p class="text-gray-400 text-[10px] text-center py-2">
            Loading employees...
        </p>
    `;

    try {
        const params = new URLSearchParams({
            page: String(page),
            search: search || '',
        });

        const response = await fetchJson(
            `${API.employees(clientId)}?${params.toString()}`
        );

        const { data, meta, pagination } = response;
        const paginationMeta = meta || pagination || null;

        state.employeeLastPage = Number(
            paginationMeta?.last_page || 1
        );

        state.employeeTotal = Number(
            paginationMeta?.total || 0
        );

        renderEmployees(panel, data || []);
        renderEmployeePagination(panel, paginationMeta, clientId);

        // Restore selected employee if it exists on this page.
        if (state.selectedEmployeeId) {
            const selectedBox = [
                ...container.querySelectorAll('.employee-box')
            ].find(box =>
                String(box.dataset.empId) ===
                String(state.selectedEmployeeId)
            );

            if (selectedBox) {
                await selectEmployee(panel, selectedBox, false);
            }
        }

    } catch (error) {
        console.error('Failed to load employees:', error);

        container.innerHTML = `
            <p class="text-red-500 text-xs text-center py-2">
                Failed to load employees.
            </p>
        `;
    }
}

// ---------------------------------------------------------
// Render Employees
// ---------------------------------------------------------

function renderEmployees(panel, employees) {
    const container = panel.querySelector('#employeeListContainer');

    if (!container) return;

    if (!employees.length) {
        container.innerHTML = `
            <p class="text-gray-400 text-[10px] text-center py-2">
                No employees found.
            </p>
        `;

        return;
    }

    container.className = 'flex flex-col gap-1.5 w-full';

    container.innerHTML = employees.map(employee => `
        <div
            class="employee-box bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 px-3 h-9 flex items-center cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-100 truncate transition-all duration-200 ease-in-out"
            data-emp-id="${employee.emp_id}"
        >
            ${escapeHtml(employee.full_name)}
        </div>
    `).join('');

    container.querySelectorAll('.employee-box').forEach(box => {
        box.addEventListener('click', () => {
            selectEmployee(panel, box, true);
        });
    });
}

// ---------------------------------------------------------
// Employee Pagination
// ---------------------------------------------------------

function renderEmployeePagination(panel, meta, clientId) {
    const container = panel.querySelector(
        '#employeePaginationContainer'
    );

    renderPagination(
        container,
        meta,
        page => loadEmployees(
            panel,
            clientId,
            page,
            state.employeeSearch
        ),
        'employees'
    );
}

// ---------------------------------------------------------
// Employee Selection
// ---------------------------------------------------------

async function selectEmployee(panel, box, saveState = true) {
    // Remove previous active selection.
    panel.querySelectorAll('.employee-box.active').forEach(item => {
        item.classList.remove(
            'active',
            'bg-green-600',
            'dark:bg-green-600',
            'border-green-500',
            'text-white',
            'font-semibold'
        );

        item.classList.add(
            'bg-white',
            'dark:bg-gray-700',
            'border-gray-100',
            'dark:border-gray-600',
            'text-gray-800',
            'dark:text-gray-100'
        );
    });

    // Highlight selected employee.
    box.classList.add(
        'active',
        'bg-green-600',
        'dark:bg-green-600',
        'border-green-500',
        'text-white',
        'font-semibold'
    );

    box.classList.remove(
        'bg-white',
        'dark:bg-gray-700',
        'border-gray-100',
        'dark:border-gray-600',
        'text-gray-800',
        'dark:text-gray-100'
    );

    const empId = box.dataset.empId;

    state.selectedEmployeeId = empId;
    state.currentView = 'employee';

    if (saveState) {
        saveEmployeeDeductionState();
    }

    const pageTitle = panel.querySelector('#headerPageTitle');

    if (pageTitle) {
        pageTitle.textContent = box.textContent.trim();
        pageTitle.classList.remove('hidden');
    }

    try {
        const response = await fetchJson(
            API.employee(empId)
        );

        renderEmployeeInfo(panel, response.data);

        await loadDeductions(panel, empId);

        resetPaymentDetails(panel);

    } catch (error) {
        console.error('Failed to load employee info:', error);
    }
}
