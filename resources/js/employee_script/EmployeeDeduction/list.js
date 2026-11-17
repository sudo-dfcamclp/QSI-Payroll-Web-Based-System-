// resources/js/employee_script/EmployeeDeduction/list.js

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';
const APP_URL    = document.querySelector('meta[name="app-url"]')?.content || '';

// ---------------------------------------------------------
// State
// ---------------------------------------------------------
const state = {
    clientPage: 1,
    clientLastPage: 1,
    clientTotal: 0,
    clientSearch: '',
    clientSearchTimeout: null,

    employeePage: 1,
    employeeLastPage: 1,
    employeeTotal: 0,
    employeeSearch: '',
    employeeSearchTimeout: null,

    selectedClientId: null,
};

// ---------------------------------------------------------
// View Helpers (Toggle Client / Employee View & Header)
// ---------------------------------------------------------
function showClientView(panel) {
    panel.querySelector('#clientListContainer')?.classList.remove('hidden');
    panel.querySelector('#clientPaginationContainer')?.classList.remove('hidden');
    panel.querySelector('#employeeListContainer')?.classList.add('hidden');
    panel.querySelector('#employeePaginationContainer')?.classList.add('hidden');

    // Breadcrumb: Client >
    const backButton = panel.querySelector('#headerBackToClient');
    if (backButton) {
        backButton.textContent = 'Client';
        backButton.classList.remove('hidden');
    }

    panel.querySelector('#headerBreadcrumbSeparator')?.classList.remove('hidden');
    panel.querySelector('#headerPageTitle')?.classList.add('hidden');
}

function showEmployeeView(panel) {
    panel.querySelector('#clientListContainer')?.classList.add('hidden');
    panel.querySelector('#clientPaginationContainer')?.classList.add('hidden');
    panel.querySelector('#employeeListContainer')?.classList.remove('hidden');
    panel.querySelector('#employeePaginationContainer')?.classList.remove('hidden');

    // Breadcrumb: Back to Client > (employee name appears only after selection)
    const backButton = panel.querySelector('#headerBackToClient');
    if (backButton) {
        backButton.innerHTML = '<i class="fa-solid fa-arrow-left mr-1"></i> Back to Client';
        backButton.classList.remove('hidden');
    }

    panel.querySelector('#headerBreadcrumbSeparator')?.classList.remove('hidden');
    panel.querySelector('#headerPageTitle')?.classList.add('hidden');
}

// ---------------------------------------------------------
// API helpers
// ---------------------------------------------------------
async function fetchJson(url) {
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ---------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------
function buildPages(currentPage, lastPage) {
    const pages = [];
    if (lastPage <= 7) {
        for (let p = 1; p <= lastPage; p++) pages.push(p);
        return pages;
    }
    pages.push(1);
    if (currentPage > 4) pages.push('...');
    const start = Math.max(2, currentPage - 2);
    const end   = Math.min(lastPage - 1, currentPage + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    if (currentPage < lastPage - 3) pages.push('...');
    pages.push(lastPage);
    return pages;
}

function renderPagination(container, meta, onPageChange, label = 'items') {
    if (!container) return;

    const currentPage = Number(meta?.current_page || 1);
    const lastPage    = Number(meta?.last_page || 1);
    const total       = Number(meta?.total || 0);
    const from        = Number(meta?.from || 0);
    const to          = Number(meta?.to || 0);

    if (total <= 0) {
        container.innerHTML = '';
        return;
    }

    const pages = buildPages(currentPage, lastPage);

    container.innerHTML = `
        <div class="flex flex-col gap-2">
            <div class="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                Showing <span class="font-semibold text-gray-700 dark:text-gray-200">${from}</span>
                to <span class="font-semibold text-gray-700 dark:text-gray-200">${to}</span>
                of <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span> ${label}
            </div>
            <div class="flex items-center justify-center gap-1">
                <button type="button" class="pagination-button inline-flex items-center justify-center w-7 h-7 border border-gray-300 dark:border-gray-500 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
                        data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                </button>
                ${pages.map(page => {
                    if (page === '...') return `<span class="inline-flex items-center justify-center w-7 h-7 text-[10px] text-gray-400 dark:text-gray-500">...</span>`;
                    const isActive = page === currentPage;
                    return `
                        <button type="button" class="pagination-button inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-medium transition-colors
                            ${isActive ? 'bg-green-600 text-white cursor-default' : 'border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'}"
                            data-page="${page}" ${isActive ? 'disabled' : ''}>
                            ${page}
                        </button>`;
                }).join('')}
                <button type="button" class="pagination-button inline-flex items-center justify-center w-7 h-7 border border-gray-300 dark:border-gray-500 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
                        data-page="${currentPage + 1}" ${currentPage >= lastPage ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
            </div>
        </div>
    `;

    container.querySelectorAll('.pagination-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const page = Number(button.dataset.page);
            if (!page || page < 1 || page > lastPage || page === currentPage) return;
            onPageChange(page);
        });
    });
}

// ---------------------------------------------------------
// Client List
// ---------------------------------------------------------
async function loadClients(panel, page = 1, search = '') {
    const container = panel.querySelector('#clientListContainer');
    if (!container) return;

    state.clientPage   = page;
    state.clientSearch = search;

    container.innerHTML = `<p class="text-gray-400 text-[10px] text-center py-2">Loading clients...</p>`;

    try {
        const params = new URLSearchParams({ page: String(page), search: search || '' });
        const { data, meta, pagination } = await fetchJson(`${APP_URL}/api/employee-deduction/clients?${params.toString()}`);
        const paginationMeta = meta || pagination || null;

        state.clientLastPage = Number(paginationMeta?.last_page || 1);
        state.clientTotal    = Number(paginationMeta?.total || 0);

        renderClients(panel, data);
        renderClientPagination(panel, paginationMeta);
    } catch (e) {
        container.innerHTML = `<p class="text-red-500 text-xs text-center py-2">Failed to load clients.</p>`;
    }
}

function renderClients(panel, clients) {
    const container = panel.querySelector('#clientListContainer');
    if (!container) return;

    if (!clients.length) {
        container.innerHTML = `<p class="text-gray-400 text-[10px] text-center py-2">No clients found.</p>`;
        return;
    }

    container.className = 'flex flex-col gap-1.5 w-full';

    container.innerHTML = clients.map(c => `
        <div class="client-box bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100
                    dark:border-gray-600 px-3 h-9 flex items-center cursor-pointer
                    text-xs font-medium text-gray-800 dark:text-gray-100 truncate"
             data-client-id="${c.client_id}" title="${escapeHtml(c.client_name)}">
            ${escapeHtml(c.client_name)}
        </div>
    `).join('');

    container.querySelectorAll('.client-box').forEach(box => {
        box.addEventListener('click', () => onClientClick(panel, box));
    });
}

function renderClientPagination(panel, meta) {
    const container = panel.querySelector('#clientPaginationContainer');
    renderPagination(container, meta, (page) => loadClients(panel, page, state.clientSearch), 'clients');
}

async function onClientClick(panel, box) {
    panel.querySelectorAll('.client-box.active').forEach(b => b.classList.remove('active'));
    box.classList.add('active');

    const clientId = box.dataset.clientId;
    state.selectedClientId = clientId;
    state.employeePage = 1;
    state.employeeSearch = '';

    // Palitan ang view bago mag load
    showEmployeeView(panel);
    await loadEmployees(panel, clientId, 1);

    resetEmployeeInfo(panel);
    resetDeductionGrids(panel);
}

// ---------------------------------------------------------
// Employee List
// ---------------------------------------------------------
async function loadEmployees(panel, clientId, page = 1, search = '') {
    const container = panel.querySelector('#employeeListContainer');
    if (!container) return;

    state.employeePage   = page;
    state.employeeSearch = search;

    container.innerHTML = `<p class="text-gray-400 text-[10px] text-center py-2">Loading employees...</p>`;

    try {
        const params = new URLSearchParams({ page: String(page), search: search || '' });
        const { data, meta, pagination } = await fetchJson(`${APP_URL}/api/employee-deduction/clients/${clientId}/employees?${params.toString()}`);
        const paginationMeta = meta || pagination || null;

        state.employeeLastPage = Number(paginationMeta?.last_page || 1);
        state.employeeTotal    = Number(paginationMeta?.total || 0);

        renderEmployees(panel, data);
        renderEmployeePagination(panel, paginationMeta, clientId);
    } catch (e) {
        container.innerHTML = `<p class="text-red-500 text-xs text-center py-2">Failed to load employees.</p>`;
    }
}

function renderEmployees(panel, employees) {
    const container = panel.querySelector('#employeeListContainer');
    if (!container) return;

    if (!employees.length) {
        container.innerHTML = `<p class="text-gray-400 text-[10px] text-center py-2">No employees found.</p>`;
        return;
    }

    container.className = 'flex flex-col gap-1.5 w-full';

    container.innerHTML = employees.map(e => `
        <div class="employee-box bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100
                    dark:border-gray-600 px-3 h-9 flex items-center cursor-pointer list-item-pressable
                    text-xs font-medium text-gray-800 dark:text-gray-100 truncate"
             data-emp-id="${e.emp_id}">
            ${escapeHtml(e.full_name)}
        </div>
    `).join('');

    container.querySelectorAll('.employee-box').forEach(box => {
        box.addEventListener('click', () => onEmployeeClick(panel, box));
    });
}

function renderEmployeePagination(panel, meta, clientId) {
    const container = panel.querySelector('#employeePaginationContainer');
    renderPagination(container, meta, (page) => loadEmployees(panel, clientId, page, state.employeeSearch), 'employees');
}

// ---------------------------------------------------------
// Employee Details & Deductions
// ---------------------------------------------------------
async function onEmployeeClick(panel, box) {
    panel.querySelectorAll('.employee-box.active').forEach(b => b.classList.remove('active'));
    box.classList.add('active');

    const empId = box.dataset.empId;

    // Show selected employee name in the breadcrumb.
    const pageTitle = panel.querySelector('#headerPageTitle');
    if (pageTitle) {
        pageTitle.textContent = box.textContent.trim();
        pageTitle.classList.remove('hidden');
    }

    try {
        const { data } = await fetchJson(`${APP_URL}/api/employee-deduction/employees/${empId}`);
        renderEmployeeInfo(panel, data);

        await loadDeductions(panel, empId);
        resetPaymentDetails(panel);
    } catch (e) {
        console.error('Failed to load employee info', e);
    }
}

function renderEmployeeInfo(panel, data) {
    setText(panel, 'displayEmpName',      data.full_name ?? '—');
    setText(panel, 'displayEmpStatus',    data.employment_status ?? '—');
    setText(panel, 'displayMonthsHired',  data.month_no ?? '—');
    setText(panel, 'displayPaymentBasis', data.rate_basis ?? '—');
    setText(panel, 'displayMonthlyRate',  data.monthly_rate ?? '—');
    setText(panel, 'displayDailyRate',    data.daily_rate ?? '—');
    setText(panel, 'displayHourlyRate',   data.hourly_rate ?? '—');
}

function resetEmployeeInfo(panel) {
    ['displayEmpName','displayEmpStatus','displayMonthsHired',
     'displayPaymentBasis','displayMonthlyRate','displayDailyRate','displayHourlyRate']
        .forEach(id => setText(panel, id, '—'));
}

function resetDeductionGrids(panel) {
    setHtml(panel, 'deductionHeaderTableBody',
        '<tr><td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Select an employee to load deductions.</td></tr>');
    resetPaymentDetails(panel);
}

function resetPaymentDetails(panel) {
    setHtml(panel, 'paymentDetailsTableBody',
        '<tr><td colspan="5" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Select a deduction to view payment history.</td></tr>');
}

async function loadDeductions(panel, empId) {
    const tbody = panel.querySelector('#deductionHeaderTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-10 text-center text-sm text-gray-400">Loading deductions...</td></tr>`;

    try {
        const { data } = await fetchJson(`${APP_URL}/api/employee-deduction/deductions?emp_id=${empId}`);
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No deductions found.</td></tr>`;
            return;
        }
        tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">${data.length} deduction(s) loaded. (Rendering to be built)</td></tr>`;
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-10 text-center text-sm text-red-500">Failed to load deductions.</td></tr>`;
    }
}

// ---------------------------------------------------------
// Search handlers
// ---------------------------------------------------------
function initSearch(panel) {
    const searchInput = panel.querySelector('#searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        clearTimeout(state.clientSearchTimeout);
        clearTimeout(state.employeeSearchTimeout);

        const value = searchInput.value.trim();

        if (state.selectedClientId) {
            state.employeeSearchTimeout = setTimeout(() => {
                loadEmployees(panel, state.selectedClientId, 1, value);
            }, 300);
        } else {
            state.clientSearchTimeout = setTimeout(() => {
                loadClients(panel, 1, value);
            }, 300);
        }
    });
}

// ---------------------------------------------------------
// Utility & Init
// ---------------------------------------------------------
function setText(panel, id, value) {
    const el = panel.querySelector(`#${id}`);
    if (el) el.textContent = value;
}

function setHtml(panel, id, html) {
    const el = panel.querySelector(`#${id}`);
    if (el) el.innerHTML = html;
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function initList(panel) {
    showClientView(panel);
    loadClients(panel, 1, '');
    initSearch(panel);

    // Header breadcrumb / Back to Client navigation
    panel.querySelector('#headerBackToClient')?.addEventListener('click', (e) => {
        e.preventDefault();

        // Bumalik sa Client view kapag nasa Employee List.
        if (state.selectedClientId) {
            state.selectedClientId = null;

            panel.querySelector('#searchInput').value = '';

            showClientView(panel);
            resetEmployeeInfo(panel);
            resetDeductionGrids(panel);
        }
    });
}