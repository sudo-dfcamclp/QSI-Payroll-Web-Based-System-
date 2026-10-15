import { state } from './state.js';

export function closeSortMenu(ctx) {
    document.querySelector('#payrollClientSortMenu')?.remove();
    ctx.dom.payrollClientSortButton?.setAttribute('aria-expanded', 'false');
}

export function applyPayrollClientSort(ctx, sort, direction) {
    state.payrollClientSort = sort;
    state.payrollClientSortDirection = direction;
    state.payrollClientListPage = 1;
    closeSortMenu(ctx);
    ctx.loadClientList(
        ctx.dom.clientSearch?.value || '',
        1,
        {
            sort,
            direction
        }
    );
}

export function createSortMenu(ctx) {
    closeSortMenu(ctx);
    const button = ctx.dom.payrollClientSortButton;
    if (!button) return;
    if (!state.payrollClientSort) state.payrollClientSort = 'name';
    if (!state.payrollClientSortDirection) state.payrollClientSortDirection = 'asc';

    const menu = document.createElement('div');
    menu.id = 'payrollClientSortMenu';
    menu.className = 'fixed z-[9999] w-52 overflow-visible rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg';

    menu.innerHTML = `
        <div class="py-1">
            <button type="button" data-payroll-client-sort="name" data-payroll-client-direction="asc" class="flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-a-z w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Default Name</span>
                </span>
                ${state.payrollClientSort === 'name' && state.payrollClientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <button type="button" data-payroll-client-sort="latest" data-payroll-client-direction="desc" class="flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-wide-short w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Latest to Oldest</span>
                </span>
                ${state.payrollClientSort === 'latest' && state.payrollClientSortDirection === 'desc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <button type="button" data-payroll-client-sort="oldest" data-payroll-client-direction="asc" class="flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-up-wide-short w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Oldest to Latest</span>
                </span>
                ${state.payrollClientSort === 'oldest' && state.payrollClientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
            <div class="my-1 border-t border-gray-100 dark:border-gray-600"></div>
            <div class="relative">
                <button type="button" class="payroll-client-sort-letter-trigger flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <span class="flex items-center gap-3">
                        <i class="fa-solid fa-font w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                        <span>By Letter</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
                </button>
                <div id="payrollClientSortLetterMenu" class="hidden absolute right-full top-0 mr-1 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-[10000]">
                    <button type="button" data-payroll-client-sort="letter" data-payroll-client-direction="asc" class="flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-arrow-down-a-z w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>A to Z</span>
                        </span>
                        ${state.payrollClientSort === 'letter' && state.payrollClientSortDirection === 'asc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                    <button type="button" data-payroll-client-sort="letter" data-payroll-client-direction="desc" class="flex w-full items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid fa-arrow-up-z-a w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                            <span>Z to A</span>
                        </span>
                        ${state.payrollClientSort === 'letter' && state.payrollClientSortDirection === 'desc' ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(menu);

    const rect = button.getBoundingClientRect();
    const menuWidth = 208;
    const menuHeight = menu.offsetHeight;
    const padding = 8;
    const left = Math.max(padding, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - padding));
    let top = rect.bottom + 8;

    if (top + menuHeight > window.innerHeight - padding) {
        top = rect.top - menuHeight - 8;
    }
    if (top < padding) top = padding;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    button.setAttribute('aria-expanded', 'true');

    menu.querySelectorAll('[data-payroll-client-sort]').forEach(option => {
        option.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            applyPayrollClientSort(
                ctx,
                option.dataset.payrollClientSort,
                option.dataset.payrollClientDirection
            );
        });
    });

    const letterTrigger = menu.querySelector('.payroll-client-sort-letter-trigger');
    const letterMenu = menu.querySelector('#payrollClientSortLetterMenu');

    letterTrigger?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        letterMenu?.classList.toggle('hidden');
    });
}

export function initializeSort(ctx) {
    const button = ctx.dom.payrollClientSortButton;
    if (!button) return;

    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (document.querySelector('#payrollClientSortMenu')) {
            closeSortMenu(ctx);
            return;
        }
        createSortMenu(ctx);
    });

    document.addEventListener('click', event => {
        const menu = document.querySelector('#payrollClientSortMenu');
        if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
            closeSortMenu(ctx);
        }
    });

    window.addEventListener('resize', () => closeSortMenu(ctx));
    window.addEventListener('scroll', () => closeSortMenu(ctx), true);
}

