import { state } from './state.js';

const CLIENT_STATUS_STORAGE_KEY = 'client_master_status';

function getClientStatus() {
    const storedStatus = localStorage.getItem(CLIENT_STATUS_STORAGE_KEY);

    if (storedStatus === 'active' || storedStatus === 'archive') {
        state.clientStatus = storedStatus;
    }

    if (state.clientStatus !== 'active' && state.clientStatus !== 'archive') {
        state.clientStatus = 'active';
    }

    return state.clientStatus;
}

export function closeSortMenu(ctx) {
    document.querySelector('#clientSortMenu')?.remove();
    ctx.dom.clientSortButton?.setAttribute('aria-expanded','false');
}

export function applyClientStatus(ctx,status) {
    if (status !== 'active' && status !== 'archive') {
        status = 'active';
    }

    state.clientStatus = status;
    localStorage.setItem(CLIENT_STATUS_STORAGE_KEY,status);
    state.clientListPage = 1;

    closeSortMenu(ctx);

    ctx.loadClientList(
        ctx.dom.clientListSearch?.value || '',
        1
    );
}

export function applyClientSort(ctx,sort,direction) {
    state.clientSort = sort;
    state.clientSortDirection = direction;
    state.clientListPage = 1;

    closeSortMenu(ctx);

    ctx.loadClientList(
        ctx.dom.clientListSearch?.value || '',
        1
    );
}

export function createSortMenu(ctx) {
    ctx.closeActionMenus();
    closeSortMenu(ctx);

    const clientSortButton = ctx.dom.clientSortButton;

    if (!clientSortButton) return;

    const currentStatus = getClientStatus();

    if (!state.clientSort) {
        state.clientSort = 'name';
    }

    if (!state.clientSortDirection) {
        state.clientSortDirection = 'asc';
    }

    const menu = document.createElement('div');

    menu.id = 'clientSortMenu';

    menu.className = 'fixed z-[9999] w-52 overflow-visible rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg';

    menu.innerHTML = `
        <div class="py-1">
            <div class="relative">
                <button
                    type="button"
                    class="client-sort-status-trigger flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <span class="flex items-center gap-3">
                        <i class="fa-solid fa-circle-half-stroke w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                        <span>Status</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
                </button>
                <div
                    id="clientSortStatusMenu"
                    class="hidden absolute right-full top-0 mr-1 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-[10000]">
                    <button
                        type="button"
                        data-client-status="active"
                        class="client-status-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-circle-check w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>Active</span>
                        </span>
                        ${currentStatus === 'active' ? '<i class="client-status-check fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                    <button
                        type="button"
                        data-client-status="archive"
                        class="client-status-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-box-archive w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>Archive</span>
                        </span>
                        ${currentStatus === 'archive' ? '<i class="client-status-check fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                </div>
            </div>
            <div class="my-1 border-t border-gray-100 dark:border-gray-600"></div>
            <button
                type="button"
                data-client-sort="name"
                data-client-direction="asc"
                class="client-sort-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-a-z w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Default Name</span>
                </span>
                ${state.clientSort === 'name' && state.clientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <button
                type="button"
                data-client-sort="latest"
                data-client-direction="desc"
                class="client-sort-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-wide-short w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Latest to Oldest</span>
                </span>
                ${state.clientSort === 'latest' && state.clientSortDirection === 'desc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <button
                type="button"
                data-client-sort="oldest"
                data-client-direction="asc"
                class="client-sort-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-up-wide-short w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Oldest to Latest</span>
                </span>
                ${state.clientSort === 'oldest' && state.clientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <div class="my-1 border-t border-gray-100 dark:border-gray-600"></div>
            <div class="relative">
                <button
                    type="button"
                    class="client-sort-letter-trigger flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <span class="flex items-center gap-3">
                        <i class="fa-solid fa-font w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                        <span>By Letter</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
                </button>
                <div
                    id="clientSortLetterMenu"
                    class="hidden absolute right-full top-0 mr-1 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-[10000]">
                    <button
                        type="button"
                        data-client-sort="letter"
                        data-client-direction="asc"
                        class="client-sort-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-arrow-down-a-z w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>A to Z</span>
                        </span>
                        ${state.clientSort === 'letter' && state.clientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                    <button
                        type="button"
                        data-client-sort="letter"
                        data-client-direction="desc"
                        class="client-sort-option flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-arrow-up-z-a w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>Z to A</span>
                        </span>
                        ${state.clientSort === 'letter' && state.clientSortDirection === 'desc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(menu);

    const buttonRect = clientSortButton.getBoundingClientRect();
    const menuWidth = 208;
    const menuHeight = menu.offsetHeight;
    const viewportPadding = 8;

    let left = buttonRect.right - menuWidth;
    let top = buttonRect.bottom + 8;

    if (left < viewportPadding) {
        left = viewportPadding;
    }

    if (left + menuWidth > window.innerWidth - viewportPadding) {
        left = window.innerWidth - menuWidth - viewportPadding;
    }

    if (top + menuHeight > window.innerHeight - viewportPadding) {
        top = buttonRect.top - menuHeight - 8;
    }

    if (top < viewportPadding) {
        top = viewportPadding;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    clientSortButton.setAttribute('aria-expanded','true');

    menu.querySelectorAll('.client-sort-option').forEach(option => {
        option.addEventListener('click',event => {
            event.preventDefault();
            event.stopPropagation();

            applyClientSort(
                ctx,
                option.dataset.clientSort,
                option.dataset.clientDirection
            );
        });
    });

    menu.querySelectorAll('.client-status-option').forEach(option => {
        option.addEventListener('click',event => {
            event.preventDefault();
            event.stopPropagation();

            applyClientStatus(
                ctx,
                option.dataset.clientStatus
            );
        });
    });

    const statusTrigger = menu.querySelector('.client-sort-status-trigger');
    const statusMenu = menu.querySelector('#clientSortStatusMenu');
    const letterTrigger = menu.querySelector('.client-sort-letter-trigger');
    const letterMenu = menu.querySelector('#clientSortLetterMenu');

    statusTrigger?.addEventListener('click',event => {
        event.preventDefault();
        event.stopPropagation();

        letterMenu?.classList.add('hidden');
        statusMenu?.classList.toggle('hidden');
    });

    letterTrigger?.addEventListener('click',event => {
        event.preventDefault();
        event.stopPropagation();

        statusMenu?.classList.add('hidden');
        letterMenu?.classList.toggle('hidden');
    });
}

export function initializeSort(ctx) {
    ctx.dom.clientSortButton?.addEventListener('click',event => {
        event.preventDefault();
        event.stopPropagation();

        const existingMenu = document.querySelector('#clientSortMenu');

        if (existingMenu) {
            closeSortMenu(ctx);
            return;
        }

        createSortMenu(ctx);
    });
}