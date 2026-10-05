import { state } from './state.js';
import { escapeHtml } from './helpers.js';

export function addSearchStyles(ctx) {
    if (
        ctx.panel.querySelector(
            '#clientSearchDynamicStyles'
        )
    ) {
        return;
    }

    const style =
        document.createElement('style');

    style.id =
        'clientSearchDynamicStyles';

    style.textContent = `
        .client-search-result-highlight {
            background-color: rgba(16, 185, 129, 0.10) !important;
        }

        .dark .client-search-result-highlight {
            background-color: rgba(16, 185, 129, 0.15) !important;
        }
    `;

    ctx.panel.appendChild(style);
}

export function resetSearchHighlight(ctx) {
    state.searchHighlightedIndex = -1;

    if (!ctx.dom.searchList) return;

    ctx.dom.searchList
        .querySelectorAll(
            '[data-client-search-result]'
        )
        .forEach(button => {
            button.classList.remove(
                'client-search-result-highlight'
            );

            button.setAttribute(
                'aria-selected',
                'false'
            );
        });
}

export function updateSearchHighlight(ctx) {
    if (!ctx.dom.searchList) return;

    const results =
        Array.from(
            ctx.dom.searchList.querySelectorAll(
                '[data-client-search-result]'
            )
        );

    results.forEach(
        (button, index) => {
            const active =
                index ===
                state.searchHighlightedIndex;

            button.classList.toggle(
                'client-search-result-highlight',
                active
            );

            button.setAttribute(
                'aria-selected',
                active
                    ? 'true'
                    : 'false'
            );

            if (active) {
                button.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    );
}

export function moveSearchHighlight(
    ctx,
    direction
) {
    const results =
        Array.from(
            ctx.dom.searchList
                ?.querySelectorAll(
                    '[data-client-search-result]'
                ) || []
        );

    if (!results.length) return;

    if (
        state.searchHighlightedIndex === -1
    ) {
        state.searchHighlightedIndex =
            direction === 'down'
                ? 0
                : results.length - 1;
    } else if (
        direction === 'down'
    ) {
        state.searchHighlightedIndex =
            (
                state.searchHighlightedIndex +
                1
            ) % results.length;
    } else {
        state.searchHighlightedIndex =
            (
                state.searchHighlightedIndex -
                1 +
                results.length
            ) % results.length;
    }

    updateSearchHighlight(ctx);
}

export function selectHighlightedSearchResult(
    ctx
) {
    const results =
        Array.from(
            ctx.dom.searchList
                ?.querySelectorAll(
                    '[data-client-search-result]'
                ) || []
        );

    if (
        state.searchHighlightedIndex < 0 ||
        state.searchHighlightedIndex >=
            results.length
    ) {
        return false;
    }

    const selected =
        results[
            state.searchHighlightedIndex
        ];

    ctx.dom.searchResults?.classList.add(
        'hidden'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-expanded',
        'false'
    );

    ctx.loadClient(
        selected.dataset.clientId
    );

    return true;
}

export async function searchClients(
    ctx,
    query
) {
    if (!query.trim()) {
        ctx.dom.searchResults?.classList.add(
            'hidden'
        );

        ctx.dom.searchInput?.setAttribute(
            'aria-expanded',
            'false'
        );

        resetSearchHighlight(ctx);

        return;
    }

    try {
        const response =
            await fetch(
                `/payroll/public/api/client-master/search?search=${encodeURIComponent(query)}&status=active`,
                {
                    headers: {
                        'Accept':
                            'application/json',
                        'X-Requested-With':
                            'XMLHttpRequest'
                    },
                    credentials:
                        'same-origin'
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                'Unable to search clients.'
            );
        }

        const clients =
            result.data || [];

        resetSearchHighlight(ctx);

        ctx.dom.searchList.innerHTML =
            clients.length
                ? clients
                      .map(
                          client => `
                            <button
                                type="button"
                                id="clientSearchResult-${escapeHtml(client.client_id)}"
                                data-client-id="${escapeHtml(client.client_id)}"
                                data-client-search-result
                                role="option"
                                aria-selected="false"
                                class="w-full text-left px-4 py-3.5 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors cursor-pointer group">

                                <div class="flex items-center gap-3">

                                    <div class="w-9 h-9 shrink-0 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center">
                                        <i class="fa-solid fa-building text-sm"></i>
                                    </div>

                                    <div class="min-w-0 flex-1">

                                        <div class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">
                                            ${escapeHtml(client.client_name || '')}
                                        </div>

                                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            ${
                                                client.client_contact
                                                    ? escapeHtml(client.client_contact)
                                                    : `Client #${escapeHtml(client.client_id)}`
                                            }
                                        </div>

                                    </div>

                                    <i class="fa-solid fa-chevron-right text-xs text-gray-300 dark:text-gray-500 group-hover:text-green-500 transition-colors"></i>

                                </div>
                            </button>
                        `
                      )
                      .join('')
                : `
                    <div class="px-5 py-8 text-center">

                        <div class="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                            <i class="fa-solid fa-building-circle-exclamation text-gray-400 dark:text-gray-300"></i>
                        </div>

                        <div class="text-sm font-medium text-gray-600 dark:text-gray-300">
                            No clients found
                        </div>

                        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Try a different search term.
                        </div>

                    </div>
                `;

        ctx.dom.searchResults?.classList.remove(
            'hidden'
        );

        ctx.dom.searchInput?.setAttribute(
            'aria-expanded',
            'true'
        );

        ctx.dom.searchList
            .querySelectorAll(
                '[data-client-search-result]'
            )
            .forEach(button => {

                button.addEventListener(
                    'mouseenter',
                    () => {
                        const results =
                            Array.from(
                                ctx.dom.searchList.querySelectorAll(
                                    '[data-client-search-result]'
                                )
                            );

                        state.searchHighlightedIndex =
                            results.indexOf(
                                button
                            );

                        updateSearchHighlight(
                            ctx
                        );
                    }
                );

                button.addEventListener(
                    'click',
                    () => {
                        ctx.dom.searchResults?.classList.add(
                            'hidden'
                        );

                        ctx.dom.searchInput?.setAttribute(
                            'aria-expanded',
                            'false'
                        );

                        resetSearchHighlight(
                            ctx
                        );

                        ctx.loadClient(
                            button.dataset.clientId
                        );
                    }
                );
            });
    } catch (error) {
        console.error(
            'Client search error:',
            error
        );
    }
}

export function initializeSearch(ctx) {
    const searchInput =
        ctx.dom.searchInput;

    if (!searchInput) return;

    searchInput.addEventListener(
        'input',
        () => {
            clearTimeout(
                state.searchTimeout
            );

            resetSearchHighlight(ctx);

            if (
                !searchInput.value.trim()
            ) {
                ctx.dom.searchResults?.classList.add(
                    'hidden'
                );

                searchInput.setAttribute(
                    'aria-expanded',
                    'false'
                );

                return;
            }

            state.searchTimeout =
                setTimeout(() => {
                    searchClients(
                        ctx,
                        searchInput.value
                    );
                }, 300);
        }
    );

    searchInput.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Escape'
            ) {
                event.preventDefault();

                ctx.dom.searchResults?.classList.add(
                    'hidden'
                );

                searchInput.setAttribute(
                    'aria-expanded',
                    'false'
                );

                resetSearchHighlight(ctx);

                return;
            }

            if (
                event.key === 'ArrowDown'
            ) {
                event.preventDefault();

                if (
                    ctx.dom.searchResults?.classList.contains(
                        'hidden'
                    )
                ) {
                    searchClients(
                        ctx,
                        searchInput.value
                    );

                    return;
                }

                moveSearchHighlight(
                    ctx,
                    'down'
                );

                return;
            }

            if (
                event.key === 'ArrowUp'
            ) {
                event.preventDefault();

                if (
                    ctx.dom.searchResults?.classList.contains(
                        'hidden'
                    )
                ) {
                    searchClients(
                        ctx,
                        searchInput.value
                    );

                    return;
                }

                moveSearchHighlight(
                    ctx,
                    'up'
                );

                return;
            }

            if (
                event.key === 'Enter'
            ) {
                if (
                    state.searchHighlightedIndex >=
                    0
                ) {
                    event.preventDefault();

                    selectHighlightedSearchResult(
                        ctx
                    );
                }
            }
        }
    );
}