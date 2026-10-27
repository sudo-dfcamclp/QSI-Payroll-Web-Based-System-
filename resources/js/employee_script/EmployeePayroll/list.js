import { state } from './state.js';
import { initializePayrollForm } from './payrollform.js';

const API = {
    clients: '/payroll/public/api/employee-payroll/clients',
    cutoffs: '/payroll/public/api/employee-payroll/cutoffs'
};

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

function formatPayrollDate(value) {
    if (!value) return '';

    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return escapeHtml(value);

    const date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
    );

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
}

function formatCutoffPeriod(startDate, endDate) {
    if (!startDate || !endDate) return 'Date not available';

    return `${formatPayrollDate(startDate)} - ${formatPayrollDate(endDate)}`;
}

function calculatePayDate(endDate) {
    if (!endDate) return '';

    const match = String(endDate).match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return '';

    const date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
    );

    date.setDate(date.getDate() + 5);

    return formatPayrollDate(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    );
}

function formatCutoffStatus(value) {
    if (value === 0 || value === '0') return 'Open';
    if (value === 1 || value === '1') return 'Closed';

    return 'Unknown';
}

function getCutoffPagination(ctx) {
    if (ctx.dom.cutoffPagination) {
        return ctx.dom.cutoffPagination;
    }

    let pagination = document.getElementById('payroll-cutoff-pagination');

    if (!pagination && ctx.dom.cutoffList?.parentNode) {
        pagination = document.createElement('div');
        pagination.id = 'payroll-cutoff-pagination';

        pagination.className = 'mt-3';

        ctx.dom.cutoffList.insertAdjacentElement('afterend', pagination);
    }

    return pagination;
}

export async function loadClientList(ctx, search = '', page = 1, filters = {}) {
    const clientList = ctx.dom.clientList;

    if (!clientList) return;

    const sort = filters.sort ?? state.payrollClientSort ?? 'name';
    const direction = filters.direction ?? state.payrollClientSortDirection ?? 'asc';

    state.payrollClientSort = sort;
    state.payrollClientSortDirection = direction;
    state.payrollClientListPage = page;

    clientList.innerHTML = `
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
            Loading clients...
        </div>
    `;

    try {
        const params = new URLSearchParams({
            search: search.trim(),
            page: String(page),
            per_page: '20',
            sort,
            direction
        });

        const response = await fetch(`${API.clients}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Unable to load clients.');
        }

        const clients = Array.isArray(result.data) ? result.data : [];

        if (!clients.length) {
            clientList.innerHTML = `
                <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No clients found.
                </div>
            `;

            renderPagination(ctx, result.pagination || {});
            return;
        }

        clientList.innerHTML = clients.map(client => `
            <button
                type="button"
                class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group"
                data-client-id="${escapeHtml(client.client_id)}"
                data-client-name="${escapeHtml(client.client_name || '')}"
            >
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
                        ${escapeHtml(client.client_id)}
                    </div>

                    <div class="min-w-0">
                        <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">
                            ${escapeHtml(client.client_name || '')}
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>
        `).join('');

        clientList.querySelectorAll('.payroll-client-card').forEach(clientCard => {
            clientCard.addEventListener('click', async () => {
                const clientId = clientCard.dataset.clientId;
                const clientName = clientCard.dataset.clientName;

                if (!clientId) {
                    console.error('Cannot load cutoffs: client ID is missing.');
                    return;
                }

                state.payrollSelectedClientId = clientId;
                state.payrollSelectedClientName = clientName;

                state.payrollSelectedPeriodId = null;
                state.payrollSelectedCutoffNo = null;
                state.payrollSelectedCutoffStartDate = null;
                state.payrollSelectedCutoffEndDate = null;
                state.payrollSelectedCutoffStatus = null;
                state.payrollSelectedPayDate = null;

                if (ctx.dom.cutoffSearch) {
                    ctx.dom.cutoffSearch.value = '';
                }

                ctx.showCutoffList(clientId, clientName);

                await loadCutoffList(ctx, clientId, '', 1);
            });
        });

        renderPagination(ctx, result.pagination || {});

    } catch (error) {
        console.error('Employee Payroll client list error:', error);

        clientList.innerHTML = `
            <div class="px-5 py-10 text-center text-sm text-red-500 dark:text-red-400">
                Unable to load clients.
            </div>
        `;

        renderPagination(ctx, {});
    }
}

export async function loadCutoffList(ctx, clientId, search = '', page = 1) {
    const cutoffList = ctx.dom.cutoffList;
    const pagination = getCutoffPagination(ctx);

    if (!cutoffList) return;

    if (!clientId) {
        cutoffList.innerHTML = `
            <div class="px-5 py-10 text-center text-sm text-red-500 dark:text-red-400">
                Client ID is missing.
            </div>
        `;

        if (pagination) pagination.innerHTML = '';

        return;
    }

    state.payrollCutoffListPage = page;
    state.payrollCutoffSearch = search;

    cutoffList.innerHTML = `
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
            Loading payroll cutoffs...
        </div>
    `;

    if (pagination) pagination.innerHTML = '';

    try {
        const params = new URLSearchParams({
            client_id: String(clientId),
            search: search.trim(),
            page: String(page),
            per_page: '20'
        });

        const response = await fetch(`${API.cutoffs}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Unable to load payroll cutoffs.');
        }

        const cutoffs = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        if (!cutoffs.length) {
            cutoffList.innerHTML = `
                <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No payroll cutoffs found for this client.
                </div>
            `;

            renderCutoffPagination(ctx, paginationData, clientId, search);

            return;
        }

        cutoffList.innerHTML = cutoffs.map(cutoff => {
            const periodId = cutoff.period_id ?? '';
            const cutoffNo = cutoff.cutoff_no ?? '';
            const startDate = cutoff.start_date ?? '';
            const endDate = cutoff.end_date ?? '';
            const status = cutoff.status ?? null;

            const statusLabel = formatCutoffStatus(status);

            const payDate = cutoff.pay_date
                ? formatPayrollDate(cutoff.pay_date)
                : calculatePayDate(endDate);

            return `
                <button
                    type="button"
                    class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group"
                    data-period-id="${escapeHtml(periodId)}"
                    data-cutoff-no="${escapeHtml(cutoffNo)}"
                    data-start-date="${escapeHtml(startDate)}"
                    data-end-date="${escapeHtml(endDate)}"
                    data-status="${escapeHtml(status ?? '')}"
                    data-pay-date="${escapeHtml(cutoff.pay_date ?? '')}"
                >
                    <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                        <div class="min-w-0">
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                ${escapeHtml(formatCutoffPeriod(startDate, endDate))}
                            </div>

                            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Cutoff ${escapeHtml(cutoffNo)} · ${escapeHtml(statusLabel)}
                            </div>
                        </div>

                        <div class="text-sm text-gray-600 dark:text-gray-300">
                            ${escapeHtml(payDate || 'Not available')}
                        </div>

                        <div class="flex justify-end">
                            <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                        </div>
                    </div>
                </button>
            `;
        }).join('');

        cutoffList.querySelectorAll('.payroll-cutoff-card').forEach(cutoffCard => {
            cutoffCard.addEventListener('click', () => {
                const periodId = cutoffCard.dataset.periodId;

                const selectedClientId =
                    state.payrollSelectedClientId || String(clientId);

                const selectedClientName =
                    state.payrollSelectedClientName || '';

                const cutoffNo = cutoffCard.dataset.cutoffNo || '';
                const startDate = cutoffCard.dataset.startDate || '';
                const endDate = cutoffCard.dataset.endDate || '';
                const status = cutoffCard.dataset.status || '';
                const payDate = cutoffCard.dataset.payDate || '';

                if (!periodId || !selectedClientId) {
                    console.error(
                        'Payroll Transaction: client ID or period ID is missing.'
                    );
                    return;
                }

                state.payrollSelectedClientId = selectedClientId;
                state.payrollSelectedClientName = selectedClientName;
                state.payrollSelectedPeriodId = periodId;
                state.payrollSelectedCutoffNo = cutoffNo;
                state.payrollSelectedCutoffStartDate = startDate;
                state.payrollSelectedCutoffEndDate = endDate;
                state.payrollSelectedCutoffStatus = status;
                state.payrollSelectedPayDate = payDate;

                const clientView = ctx.dom.clientListView;
                const cutoffView = ctx.dom.cutoffListView;
                const payrollView = ctx.panel.querySelector('#payrollTransactionView');

                if (!payrollView) {
                    console.error(
                        'Payroll Transaction: #payrollTransactionView was not found in the Blade.'
                    );
                    return;
                }

                clientView?.classList.add('hidden');
                cutoffView?.classList.add('hidden');
                payrollView.classList.remove('hidden');

                payrollView.dataset.clientId = String(selectedClientId);
                payrollView.dataset.periodId = String(periodId);

                const setValue = (id, value) => {
                    const input = ctx.panel.querySelector(`#${id}`);

                    if (input) {
                        input.value = value ?? '';
                    }
                };

                setValue('payrollClientName', selectedClientName);
                setValue(
                    'payrollCutoffPeriod',
                    formatCutoffPeriod(startDate, endDate)
                );
                setValue('payrollCutoffNumber', cutoffNo);

                setValue(
                    'payrollPayDate',
                    payDate ? payDate.substring(0, 10) : ''
                );

                const sidebarClient =
                    ctx.panel.querySelector('#payrollSidebarClient');

                const sidebarCutoff =
                    ctx.panel.querySelector('#payrollSidebarCutoff');

                const payrollStatus =
                    ctx.panel.querySelector('#payrollStatus');

                if (sidebarClient) {
                    sidebarClient.textContent = selectedClientName || '—';
                }

                if (sidebarCutoff) {
                    sidebarCutoff.textContent =
                        formatCutoffPeriod(startDate, endDate);
                }

                if (payrollStatus) {
                    payrollStatus.textContent = formatCutoffStatus(status);
                }

                const payrollContext = {
                    clientId: selectedClientId,
                    clientName: selectedClientName,
                    periodId,
                    cutoff: {
                        period_id: periodId,
                        cutoff_no: cutoffNo,
                        start_date: startDate,
                        end_date: endDate,
                        pay_date: payDate,
                        status
                    },
                    cutoffNo,
                    startDate,
                    endDate,
                    status
                };

                console.info(
                    'Payroll Transaction opened:',
                    payrollContext
                );

                // Load employees using the selected client and cutoff.
                try {
                    initializePayrollForm(ctx, payrollContext);
                } catch (error) {
                    console.error(
                        'Failed to initialize payroll form:',
                        error
                    );
                }
            });
        });

        renderCutoffPagination(
            ctx,
            paginationData,
            clientId,
            search
        );

    } catch (error) {
        console.error('Employee Payroll cutoff list error:', error);

        cutoffList.innerHTML = `
            <div class="px-5 py-10 text-center text-sm text-red-500 dark:text-red-400">
                Unable to load payroll cutoffs.
            </div>
        `;

        if (pagination) pagination.innerHTML = '';
    }
}

function renderCutoffPagination(ctx, paginationData = {}, clientId, search = '') {
    const pagination = getCutoffPagination(ctx);

    if (!pagination) return;

    const currentPage = Number(paginationData.current_page || 1);
    const lastPage = Number(paginationData.last_page || 1);
    const total = Number(paginationData.total || 0);
    const from = Number(paginationData.from || 0);
    const to = Number(paginationData.to || 0);

    if (!total) {
        pagination.innerHTML = '';
        return;
    }

    if (lastPage <= 1) {
        pagination.innerHTML = `
            <div class="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
                Showing ${from}-${to} of ${total} payroll cutoffs
            </div>
        `;
        return;
    }

    const pages = [];

    if (lastPage <= 7) {
        for (let page = 1; page <= lastPage; page++) {
            pages.push(page);
        }
    } else {
        pages.push(1);

        if (currentPage > 4) pages.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(lastPage - 1, currentPage + 1);

        for (let page = start; page <= end; page++) {
            pages.push(page);
        }

        if (currentPage < lastPage - 3) pages.push('...');

        pages.push(lastPage);
    }

    pagination.innerHTML = `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-200">${from}-${to}</span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span>
                payroll cutoffs
            </div>

            <div class="flex items-center gap-1">
                <button
                    type="button"
                    data-cutoff-page="${currentPage - 1}"
                    ${currentPage <= 1 ? 'disabled' : ''}
                    class="payroll-cutoff-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
                >
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                ${pages.map(page => page === '...'
                    ? `<span class="w-9 h-9 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">...</span>`
                    : `<button type="button" data-cutoff-page="${page}" class="payroll-cutoff-page w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${page === currentPage ? 'bg-green-600 text-white shadow-sm' : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}">${page}</button>`
                ).join('')}

                <button
                    type="button"
                    data-cutoff-page="${currentPage + 1}"
                    ${currentPage >= lastPage ? 'disabled' : ''}
                    class="payroll-cutoff-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
                >
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    `;

    pagination.querySelectorAll('.payroll-cutoff-page').forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;

            const page = Number(button.dataset.cutoffPage);

            if (!page || page < 1 || page > lastPage || page === currentPage) {
                return;
            }

            loadCutoffList(ctx, clientId, search, page);
        });
    });
}

export function initializeCutoffSearch(ctx) {
    const cutoffSearch = ctx.dom.cutoffSearch;

    if (!cutoffSearch || cutoffSearch.dataset.initialized === 'true') {
        return;
    }

    cutoffSearch.dataset.initialized = 'true';

    let searchTimeout;

    cutoffSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const clientId = state.payrollSelectedClientId;

            if (clientId) {
                loadCutoffList(
                    ctx,
                    clientId,
                    cutoffSearch.value || '',
                    1
                );
            }
        }, 300);
    });
}

function renderPagination(ctx, paginationData = {}) {
    const pagination = ctx.dom.clientPagination;

    if (!pagination) return;

    const currentPage = Number(paginationData.current_page || 1);
    const lastPage = Number(paginationData.last_page || 1);
    const total = Number(paginationData.total || 0);
    const from = Number(paginationData.from || 0);
    const to = Number(paginationData.to || 0);

    if (!total) {
        pagination.innerHTML = '';
        return;
    }

    if (lastPage <= 1) {
        pagination.innerHTML = `
            <div class="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
                Showing ${from}-${to} of ${total} clients
            </div>
        `;
        return;
    }

    const pages = [];

    if (lastPage <= 7) {
        for (let page = 1; page <= lastPage; page++) {
            pages.push(page);
        }
    } else {
        pages.push(1);

        if (currentPage > 4) pages.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(lastPage - 1, currentPage + 1);

        for (let page = start; page <= end; page++) {
            pages.push(page);
        }

        if (currentPage < lastPage - 3) pages.push('...');

        pages.push(lastPage);
    }

    pagination.innerHTML = `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-200">${from}-${to}</span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span>
                clients
            </div>

            <div class="flex items-center gap-1">
                <button
                    type="button"
                    data-client-page="${currentPage - 1}"
                    ${currentPage <= 1 ? 'disabled' : ''}
                    class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
                >
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                ${pages.map(page => page === '...'
                    ? `<span class="w-9 h-9 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">...</span>`
                    : `<button type="button" data-client-page="${page}" class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${page === currentPage ? 'bg-green-600 text-white shadow-sm' : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}">${page}</button>`
                ).join('')}

                <button
                    type="button"
                    data-client-page="${currentPage + 1}"
                    ${currentPage >= lastPage ? 'disabled' : ''}
                    class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
                >
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    `;

    pagination.querySelectorAll('.payroll-client-page').forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;

            const page = Number(button.dataset.clientPage);

            if (!page || page < 1 || page > lastPage || page === currentPage) {
                return;
            }

            loadClientList(
                ctx,
                ctx.dom.clientSearch?.value || '',
                page,
                {
                    sort: state.payrollClientSort,
                    direction: state.payrollClientSortDirection
                }
            );
        });
    });
}
