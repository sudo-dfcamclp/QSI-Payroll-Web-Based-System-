import Swal from 'sweetalert2';
import { state } from './state.js';
import { escapeHtml, swalConfig } from './helpers.js';
import { API } from './config.js'; // 🔑 Idinagdag

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
    if (!meta || !meta.total) { container.innerHTML = ''; return; }
    // ... (existing pagination code - walang binago)
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
        // 🔑 Ginamit ang API.clients mula sa config.js
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