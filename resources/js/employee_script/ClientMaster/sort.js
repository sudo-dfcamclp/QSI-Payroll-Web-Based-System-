import { state } from './state.js';

export function closeSortMenu(ctx) {
    ctx.panel
        .querySelector('#clientSortMenu')
        ?.remove();

    ctx.dom.clientSortButton
        ?.setAttribute('aria-expanded', 'false');
}

export function applyClientSort(
    ctx,
    sort,
    direction
) {
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

    const clientSortButton =
        ctx.dom.clientSortButton;

    if (!clientSortButton) return;

    const menu = document.createElement('div');

    menu.id = 'clientSortMenu';

    menu.className =
        'absolute right-0 top-full mt-2 z-50 w-52 overflow-visible rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg';

    menu.innerHTML = `
        <div class="py-1">

            <button
                type="button"
                data-client-sort="name"
                data-client-direction="asc"
                class="client-sort-option flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-a-z w-4 text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Default Name</span>
                </span>

                ${
                    state.clientSort === 'name' &&
                    state.clientSortDirection === 'asc'
                        ? '<i class="fa-solid fa-check text-xs text-green-600 dark:text-green-400"></i>'
                        : ''
                }
            </button>

            <button
                type="button"
                data-client-sort="latest"
                data-client-direction="desc"
                class="client-sort-option flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-down-wide-short w-4 text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Latest to Oldest</span>
                </span>

                ${
                    state.clientSort === 'latest' &&
                    state.clientSortDirection === 'desc'
                        ? '<i class="fa-solid fa-check text-xs text-green-600 dark:text-green-400"></i>'
                        : ''
                }
            </button>

            <button
                type="button"
                data-client-sort="oldest"
                data-client-direction="asc"
                class="client-sort-option flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                <span class="flex items-center gap-3">
                    <i class="fa-solid fa-arrow-up-wide-short w-4 text-xs text-gray-400 dark:text-gray-500"></i>
                    <span>Oldest to Latest</span>
                </span>

                ${
                    state.clientSort === 'oldest' &&
                    state.clientSortDirection === 'asc'
                        ? '<i class="fa-solid fa-check text-xs text-green-600 dark:text-green-400"></i>'
                        : ''
                }
            </button>

            <div class="my-1 border-t border-gray-100 dark:border-gray-600"></div>

            <div class="relative">

                <button
                    type="button"
                    class="client-sort-letter-trigger flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                    <span class="flex items-center gap-3">
                        <i class="fa-solid fa-font w-4 text-xs text-gray-400 dark:text-gray-500"></i>
                        <span>By Letter</span>
                    </span>

                    <i class="fa-solid fa-chevron-right text-[10px] text-gray-400 dark:text-gray-500"></i>
                </button>

               <div 
                    id="clientSortLetterMenu" 
                    class="hidden absolute right-full top-1/2 mr-1 w-44 -translate-y-1/2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg z-50">

                    <button
                        type="button"
                        data-client-sort="letter"
                        data-client-direction="asc"
                        class="client-sort-option flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                        <span>A to Z</span>

                        ${
                            state.clientSort === 'letter' &&
                            state.clientSortDirection === 'asc'
                                ? '<i class="fa-solid fa-check text-xs text-green-600 dark:text-green-400"></i>'
                                : ''
                        }
                    </button>

                    <button
                        type="button"
                        data-client-sort="letter"
                        data-client-direction="desc"
                        class="client-sort-option flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">

                        <span>Z to A</span>

                        ${
                            state.clientSort === 'letter' &&
                            state.clientSortDirection === 'desc'
                                ? '<i class="fa-solid fa-check text-xs text-green-600 dark:text-green-400"></i>'
                                : ''
                        }
                    </button>

                </div>
            </div>
        </div>
    `;

    clientSortButton.parentElement
        ?.classList.add('relative');

    clientSortButton.parentElement
        ?.appendChild(menu);

    clientSortButton.setAttribute(
        'aria-expanded',
        'true'
    );

    menu
        .querySelectorAll('.client-sort-option')
        .forEach(option => {
            option.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();

                applyClientSort(
                    ctx,
                    option.dataset.clientSort,
                    option.dataset.clientDirection
                );
            });
        });

    const letterTrigger =
        menu.querySelector(
            '.client-sort-letter-trigger'
        );

    const letterMenu =
        menu.querySelector(
            '#clientSortLetterMenu'
        );

    letterTrigger?.addEventListener(
        'click',
        event => {
            event.preventDefault();
            event.stopPropagation();

            letterMenu?.classList.toggle('hidden');
        }
    );

    menu.addEventListener(
        'mouseenter',
        () => {
            if (state.clientSort === 'letter') {
                letterMenu?.classList.remove(
                    'hidden'
                );
            }
        }
    );
}

export function initializeSort(ctx) {
    ctx.dom.clientSortButton?.addEventListener(
        'click',
        event => {
            event.preventDefault();
            event.stopPropagation();

            const existingMenu =
                ctx.panel.querySelector(
                    '#clientSortMenu'
                );

            if (existingMenu) {
                closeSortMenu(ctx);
                return;
            }

            createSortMenu(ctx);
        }
    );
}