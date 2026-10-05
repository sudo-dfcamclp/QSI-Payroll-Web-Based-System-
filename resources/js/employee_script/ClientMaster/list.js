import Swal from 'sweetalert2';
import { state } from './state.js';
import { escapeHtml, swalConfig } from './helpers.js';

export function showListingView(ctx) {
    ctx.dom.formView?.classList.add('hidden');
    ctx.dom.listingView?.classList.remove('hidden');

    ctx.dom.clientListSearch?.focus();
}

export function showFormView(ctx) {
    ctx.dom.listingView?.classList.add('hidden');
    ctx.dom.formView?.classList.remove('hidden');
}

function getClientPaginationContainer(ctx) {
    let container =
        ctx.panel.querySelector(
            '#clientPaginationContainer'
        );

    if (!container) {
        container = document.createElement('div');

        container.id =
            'clientPaginationContainer';

        container.className =
            'px-4 py-4 border-t border-gray-100 dark:border-gray-600';

        ctx.dom.clientList?.parentElement
            ?.appendChild(container);
    }

    return container;
}

function renderClientPagination(ctx, meta) {
    const container =
        getClientPaginationContainer(ctx);

    if (!meta || !meta.total) {
        container.innerHTML = '';
        return;
    }

    const currentPage =
        Number(meta.current_page || 1);

    const lastPage =
        Number(meta.last_page || 1);

    const total =
        Number(meta.total || 0);

    const from =
        Number(meta.from || 0);

    const to =
        Number(meta.to || 0);

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-medium text-gray-700 dark:text-gray-200">
                    ${from}
                </span>
                to
                <span class="font-medium text-gray-700 dark:text-gray-200">
                    ${to}
                </span>
                of
                <span class="font-medium text-gray-700 dark:text-gray-200">
                    ${total}
                </span>
                clients
            </div>

            <div class="flex items-center gap-1">

                <button
                    type="button"
                    data-client-page="${currentPage - 1}"
                    class="client-page-button px-3 py-1.5 rounded-md text-xs border border-gray-200 dark:border-gray-600 ${
                        currentPage <= 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
                    }"
                    ${currentPage <= 1 ? 'disabled' : ''}>
                    Previous
                </button>

                <span class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
                    Page ${currentPage} of ${lastPage}
                </span>

                <button
                    type="button"
                    data-client-page="${currentPage + 1}"
                    class="client-page-button px-3 py-1.5 rounded-md text-xs border border-gray-200 dark:border-gray-600 ${
                        currentPage >= lastPage
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
                    }"
                    ${currentPage >= lastPage ? 'disabled' : ''}>
                    Next
                </button>

            </div>
        </div>
    `;

    container
        .querySelectorAll('.client-page-button')
        .forEach(button => {
            button.addEventListener(
                'click',
                () => {
                    const page =
                        Number(
                            button.dataset.clientPage
                        );

                    if (!page || page < 1) return;

                    if (page > lastPage) return;

                    state.clientListPage = page;

                    loadClientList(
                        ctx,
                        ctx.dom.clientListSearch?.value || '',
                        page
                    );
                }
            );
        });
}

export async function loadClientList(
    ctx,
    search = '',
    page = 1
) {
    state.clientListPage = page;

    const params = new URLSearchParams({
        search: search || '',
        page: String(page),
        sort: state.clientSort,
        direction: state.clientSortDirection,
        status: 'active'
    });

    try {
        const response = await fetch(
            `/payroll/public/api/client-master/search?${params.toString()}`,
            {
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },

                credentials: 'same-origin'
            }
        );

        const result =
            await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                'Unable to load clients.'
            );
        }

        const clients =
            result.data || [];

        const meta =
            result.meta ||
            result.pagination ||
            null;

        if (!ctx.dom.clientList) return;

        if (!clients.length) {
            ctx.dom.clientList.innerHTML = `
                <div class="px-5 py-10 text-center bg-white dark:bg-gray-700">

                    <div class="text-sm font-medium text-gray-600 dark:text-gray-300">
                        No clients found
                    </div>

                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Try a different search term.
                    </div>

                </div>
            `;

            renderClientPagination(
                ctx,
                meta
            );

            return;
        }

        ctx.dom.clientList.innerHTML =
            clients.map(client => `
                <div
                    class="client-list-row relative group grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_52px] items-center min-h-[52px] px-4 sm:px-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-200 dark:hover:border-green-800 hover:shadow-sm transition-all duration-150 cursor-pointer"
                    data-client-id="${escapeHtml(client.client_id)}">

                    <!-- Client ID -->
                    <div
                        class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">
                        ${escapeHtml(client.client_id || '')}
                    </div>

                    <!-- Client Name -->
                    <div
                        class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">
                        ${escapeHtml(client.client_name || '')}
                    </div>

                    <!-- Action Button -->
                    <div class="relative shrink-0">

                        <button
                            type="button"
                            class="client-action-button w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 cursor-pointer"
                            data-client-id="${escapeHtml(client.client_id)}"
                            aria-expanded="false">

                            <i class="fa-solid fa-ellipsis-vertical"></i>

                        </button>

                    </div>

                </div>
            `).join('');

        /*
         * Entire client card is clickable.
         *
         * Clicking anywhere on the card opens the client,
         * except when the action button is clicked.
         */
        ctx.dom.clientList
            .querySelectorAll('.client-list-row')
            .forEach(row => {

                row.addEventListener(
                    'click',
                    event => {

                        /*
                         * Do not open the client when
                         * clicking the action menu button.
                         */
                        if (
                            event.target.closest(
                                '.client-action-button'
                            )
                        ) {
                            return;
                        }

                        const clientId =
                            row.dataset.clientId;

                        if (!clientId) return;

                        ctx.loadClient(
                            clientId
                        );
                    }
                );
            });

        /*
         * Action menu buttons.
         */
        ctx.dom.clientList
            .querySelectorAll(
                '.client-action-button'
            )
            .forEach(button => {

                button.addEventListener(
                    'click',
                    event => {

                        /*
                         * Prevent the card click event.
                         */
                        event.preventDefault();
                        event.stopPropagation();

                        const existingMenu =
                            ctx.panel.querySelector(
                                '.client-action-menu'
                            );

                        /*
                         * If this button already has
                         * an open menu, close it.
                         */
                        if (
                            existingMenu &&
                            existingMenu.parentElement ===
                                button.parentElement
                        ) {
                            ctx.closeActionMenus();
                            return;
                        }

                        /*
                         * Get the client row.
                         */
                        const clientRow =
                            button.closest(
                                '.client-list-row'
                            );

                        /*
                         * Get the client name directly
                         * from the second column.
                         */
                        const clientName =
                            clientRow
                                ?.children?.[1]
                                ?.innerText
                                ?.trim() ||
                            'this client';

                        /*
                         * Create Archive menu.
                         */
                        ctx.createActionMenu(
                            button,
                            button.dataset.clientId,
                            clientName
                        );

                        button.setAttribute(
                            'aria-expanded',
                            'true'
                        );
                    }
                );
            });

        renderClientPagination(
            ctx,
            meta
        );

    } catch (error) {

        console.error(
            'Client list error:',
            error
        );

        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Unable to Load Clients',
                text:
                    error.message ||
                    'An error occurred while loading clients.'
            })
        );
    }
}

export function initializeList(ctx) {

    ctx.dom.clientListSearch?.addEventListener(
        'input',
        () => {

            clearTimeout(
                state.listSearchTimeout
            );

            state.clientListPage = 1;

            state.listSearchTimeout =
                setTimeout(() => {

                    loadClientList(
                        ctx,
                        ctx.dom.clientListSearch.value,
                        1
                    );

                }, 300);
        }
    );

    ctx.dom.addClientButton?.addEventListener(
        'click',
        () => {
            ctx.enterAddMode();
        }
    );
}