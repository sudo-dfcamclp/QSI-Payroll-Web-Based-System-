const API = {
    clients: '/payroll/public/api/employee-payroll/clients'
};

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

export async function loadClientList(ctx, search = '', page = 1) {
    const clientList = ctx.dom.clientList;

    if (!clientList) {
        return;
    }

    clientList.innerHTML = `
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading clients...
        </div>
    `;

    try {
        const params = new URLSearchParams({
            search: search.trim(),
            page: String(page)
        });

        const response = await fetch(
            `${API.clients}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || 'Unable to load clients.'
            );
        }

        const clients = result.data || [];

        if (!clients.length) {
            clientList.innerHTML = `
                <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No clients found.
                </div>
            `;

            renderPagination(
                ctx,
                result.pagination || {}
            );

            return;
        }

        clientList.innerHTML = clients.map(client => `
            <button
                type="button"
                class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group"
                data-client-id="${escapeHtml(client.client_id)}"
                data-client-name="${escapeHtml(client.client_name || '')}">

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

        clientList.querySelectorAll('.payroll-client-card').forEach(
            clientCard => {
                clientCard.addEventListener('click', () => {
                    const clientId =
                        clientCard.dataset.clientId;

                    const clientName =
                        clientCard.dataset.clientName;

                    ctx.showCutoffList(
                        clientId,
                        clientName
                    );
                });
            }
        );

        renderPagination(
            ctx,
            result.pagination || {}
        );

    } catch (error) {
        console.error(
            'Employee Payroll client list error:',
            error
        );

        clientList.innerHTML = `
            <div class="px-5 py-10 text-center text-sm text-red-500 dark:text-red-400">
                Unable to load clients.
            </div>
        `;

        renderPagination(
            ctx,
            {}
        );
    }
}

function renderPagination(ctx, paginationData = {}) {
    const pagination =
        ctx.dom.clientPagination;

    if (!pagination) {
        return;
    }

    const currentPage =
        Number(paginationData.current_page || 1);

    const lastPage =
        Number(paginationData.last_page || 1);

    const total =
        Number(paginationData.total || 0);

    const from =
        Number(paginationData.from || 0);

    const to =
        Number(paginationData.to || 0);

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
        for (
            let page = 1;
            page <= lastPage;
            page++
        ) {
            pages.push(page);
        }
    } else {
        pages.push(1);

        if (currentPage > 4) {
            pages.push('...');
        }

        const start =
            Math.max(2, currentPage - 1);

        const end =
            Math.min(
                lastPage - 1,
                currentPage + 1
            );

        for (
            let page = start;
            page <= end;
            page++
        ) {
            pages.push(page);
        }

        if (currentPage < lastPage - 3) {
            pages.push('...');
        }

        pages.push(lastPage);
    }

    pagination.innerHTML = `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">

            <div class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-200">
                    ${from}-${to}
                </span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-200">
                    ${total}
                </span>
                clients
            </div>

            <div class="flex items-center gap-1">

                <button
                    type="button"
                    data-client-page="${currentPage - 1}"
                    ${currentPage <= 1 ? 'disabled' : ''}
                    class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                ${pages.map(page => page === '...'
                    ? `
                        <span class="w-9 h-9 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                            ...
                        </span>
                    `
                    : `
                        <button
                            type="button"
                            data-client-page="${page}"
                            class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                page === currentPage
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }">
                            ${page}
                        </button>
                    `
                ).join('')}

                <button
                    type="button"
                    data-client-page="${currentPage + 1}"
                    ${currentPage >= lastPage ? 'disabled' : ''}
                    class="payroll-client-page w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>

            </div>

        </div>
    `;

    pagination
        .querySelectorAll('.payroll-client-page')
        .forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled) {
                    return;
                }

                const page =
                    Number(button.dataset.clientPage);

                if (
                    !page ||
                    page < 1 ||
                    page > lastPage ||
                    page === currentPage
                ) {
                    return;
                }

                loadClientList(
                    ctx,
                    ctx.dom.clientSearch?.value || '',
                    page
                );
            });
        });
}