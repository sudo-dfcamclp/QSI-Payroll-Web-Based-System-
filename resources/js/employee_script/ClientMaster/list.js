import Swal from 'sweetalert2';
import { state } from './state.js';
import { escapeHtml, swalConfig } from './helpers.js';
import { API } from './config.js';

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
    let container = ctx.panel.querySelector('#clientPaginationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clientPaginationContainer';
        container.className = 'px-4 py-4 border-t border-gray-100 dark:border-gray-600';
        ctx.dom.clientList?.parentElement?.appendChild(container);
    }
    return container;
}

function renderClientPagination(ctx, meta) {
    const container = getClientPaginationContainer(ctx);

    if (!container) {
        console.warn('Client pagination container was not found.');
        return;
    }

    const currentPage = Number(meta?.current_page || 1);
    const lastPage = Number(meta?.last_page || 1);
    const total = Number(meta?.total || 0);
    const from = Number(meta?.from || 0);
    const to = Number(meta?.to || 0);

    state.clientListPage = currentPage;
    state.clientListLastPage = lastPage;
    state.clientListTotal = total;

    if (total <= 0) {
        container.innerHTML = '';
        return;
    }

    const pages = [];

    if (lastPage <= 7) {
        for (let page = 1; page <= lastPage; page++) {
            pages.push(page);
        }
    } else {
        pages.push(1);

        if (currentPage > 4) {
            pages.push('...');
        }

        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(lastPage - 1, currentPage + 2);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        if (currentPage < lastPage - 3) {
            pages.push('...');
        }

        pages.push(lastPage);
    }

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="text-xs text-gray-500 dark:text-gray-400 text-left">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-200">${from}</span>
                to
                <span class="font-semibold text-gray-700 dark:text-gray-200">${to}</span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span>
                clients
            </div>
            <div class="flex items-center gap-1 sm:ml-auto">
                <button type="button" class="client-pagination-button inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Previous page">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                ${pages.map(page => {
                    if (page === '...') {
                        return `
                            <span class="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-400 dark:text-gray-500">...</span>
                        `;
                    }

                    const isActive = page === currentPage;

                    return `
                        <button type="button" class="client-pagination-button inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-green-600 text-white cursor-default' : 'border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'}" data-page="${page}" ${isActive ? 'disabled' : ''} aria-label="Go to page ${page}">
                            ${page}
                        </button>
                    `;
                }).join('')}
                <button type="button" class="client-pagination-button inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-page="${currentPage + 1}" ${currentPage >= lastPage ? 'disabled' : ''} aria-label="Next page">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    `;

    container.querySelectorAll('.client-pagination-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            const page = Number(button.dataset.page);

            if (!page || page < 1 || page > lastPage || page === currentPage) {
                return;
            }

            loadClientList(ctx, ctx.dom.clientListSearch?.value || '', page);
        });
    });
}
export async function loadClientList(ctx, search = '', page = 1) {
    state.clientListPage = page;
    if (!state.clientStatus) state.clientStatus = 'active';

    const params = new URLSearchParams({
        search: search || '',
        page: String(page),
        sort: state.clientSort || 'name',
        direction: state.clientSortDirection || 'asc',
        status: state.clientStatus
    });

    try {
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

        const clients = result.data || [];
        const meta = result.meta || result.pagination || null;

        if (!ctx.dom.clientList) return;

        if (!clients.length) {
            ctx.dom.clientList.innerHTML = `
                <div class="px-5 py-10 text-center dark:bg-gray-700">
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-300">No clients found</div>
                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different search term.</div>
                </div>
            `;
            renderClientPagination(ctx, meta);
            return;
        }

        ctx.dom.clientList.innerHTML = clients.map(client => `
            <div class="client-list-row relative group grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_52px] items-center min-h-[52px] px-4 sm:px-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-200 dark:hover:border-green-800 hover:shadow-sm transition-all duration-150 cursor-pointer" data-client-id="${escapeHtml(client.client_id)}">
                <div class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">${escapeHtml(client.client_id || '')}</div>
                <div class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">${escapeHtml(client.client_name || '')}</div>
                <div class="relative shrink-0">
                    <button type="button" class="client-action-button w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 cursor-pointer" data-client-id="${escapeHtml(client.client_id)}" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
            </div>
        `).join('');

        ctx.dom.clientList.querySelectorAll('.client-list-row').forEach(row => {
            row.addEventListener('click', event => {
                if (event.target.closest('.client-action-button')) return;
                const clientId = row.dataset.clientId;
                if (!clientId) return;
                ctx.loadClient(clientId);
            });
        });

        ctx.dom.clientList.querySelectorAll('.client-action-button').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const existingMenu = ctx.panel.querySelector('.client-action-menu');
                if (existingMenu && existingMenu.parentElement === button.parentElement) {
                    ctx.closeActionMenus();
                    return;
                }
                const clientRow = button.closest('.client-list-row');
                const clientName = clientRow?.children?.[1]?.innerText?.trim() || 'this client';
                ctx.createActionMenu(button, button.dataset.clientId, clientName);
                button.setAttribute('aria-expanded', 'true');
            });
        });

        renderClientPagination(ctx, meta);
    } catch (error) {
        console.error('Client list error:', error);
        await Swal.fire(swalConfig({
            icon: 'error',
            title: 'Unable to Load Clients',
            text: error.message || 'An error occurred while loading clients.'
        }));
    }
}

export function initializeList(ctx) {
    ctx.dom.clientListSearch?.addEventListener('input', () => {
        clearTimeout(state.listSearchTimeout);
        state.clientListPage = 1;
        state.listSearchTimeout = setTimeout(() => {
            loadClientList(ctx, ctx.dom.clientListSearch.value, 1);
        }, 300);
    });

    ctx.dom.addClientButton?.addEventListener('click', () => {
        ctx.enterAddMode();
    });
}