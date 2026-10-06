export function updateHighlightedResult(ctx) {
    const results =
        ctx.dom.searchList?.querySelectorAll(
            '[data-employee-id]'
        ) || [];

    results.forEach((result, index) => {
        const isHighlighted =
            index ===
            ctx.state.highlightedIndex;

        result.classList.toggle(
            'bg-gray-100',
            isHighlighted
        );

        result.classList.toggle(
            'dark:bg-gray-600',
            isHighlighted
        );

        result.setAttribute(
            'aria-selected',
            isHighlighted
                ? 'true'
                : 'false'
        );

        if (isHighlighted) {
            ctx.dom.searchInput?.setAttribute(
                'aria-activedescendant',
                result.id
            );

            result.scrollIntoView({
                block: 'nearest'
            });
        }
    });

    if (
        ctx.state.highlightedIndex < 0
    ) {
        ctx.dom.searchInput?.removeAttribute(
            'aria-activedescendant'
        );
    }
}

export function resetHighlightedResult(ctx) {
    ctx.state.highlightedIndex = -1;

    if (ctx.dom.searchList) {
        ctx.dom.searchList
            .querySelectorAll(
                '[data-employee-id]'
            )
            .forEach(result => {
                result.classList.remove(
                    'bg-gray-100',
                    'dark:bg-gray-600'
                );

                result.setAttribute(
                    'aria-selected',
                    'false'
                );
            });
    }

    ctx.dom.searchInput?.removeAttribute(
        'aria-activedescendant'
    );
}

export function hideSearchResults(ctx) {
    if (!ctx.dom.searchResults) {
        return;
    }

    ctx.dom.searchResults.classList.add(
        'hidden'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-expanded',
        'false'
    );

    ctx.resetHighlightedResult();
}

export function showSearchResults(ctx) {
    if (!ctx.dom.searchResults) {
        return;
    }

    ctx.dom.searchResults.classList.remove(
        'hidden'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-expanded',
        'true'
    );
}

export function renderSearchResults(ctx) {
    if (
        !ctx.dom.searchList ||
        !ctx.dom.searchResults
    ) {
        return;
    }

    ctx.resetHighlightedResult();

    if (
        !ctx.state.searchItems.length
    ) {
        ctx.dom.searchList.innerHTML = `
            <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No employees found.
            </div>
        `;

        ctx.showSearchResults();

        return;
    }

    ctx.dom.searchList.innerHTML =
        ctx.state.searchItems
            .map(
                (employee, index) => {
                    const fullName =
                        ctx.getEmployeeFullName(
                            employee
                        );

                    const displayName =
                        ctx.getEmployeeDisplayName(
                            employee
                        );

                    const clientName =
                        employee.client_name ||
                        employee.client?.client_name ||
                        '';

                    return `
                        <button
                            type="button"
                            id="employeeSearchOption${ctx.escapeHtml(employee.emp_id)}"
                            data-employee-id="${ctx.escapeHtml(employee.emp_id)}"
                            data-index="${index}"
                            role="option"
                            aria-selected="false"
                            class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">

                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <div class="font-medium text-sm text-gray-800 dark:text-white truncate">
                                        ${ctx.escapeHtml(
                                            fullName ||
                                            displayName ||
                                            'Unnamed Employee'
                                        )}
                                    </div>

                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ID: ${ctx.escapeHtml(
                                            employee.emp_id ||
                                            ''
                                        )}

                                        ${
                                            employee.badge_no
                                                ? ` • Badge: ${ctx.escapeHtml(
                                                      employee.badge_no
                                                  )}`
                                                : ''
                                        }
                                    </div>
                                </div>

                                ${
                                    clientName
                                        ? `
                                    <div class="text-xs text-gray-500 dark:text-gray-400 text-right shrink-0 max-w-[40%] truncate">
                                        ${ctx.escapeHtml(
                                            clientName
                                        )}
                                    </div>
                                `
                                        : ''
                                }
                            </div>
                        </button>
                    `;
                }
            )
            .join('');

    ctx.showSearchResults();

    ctx.dom.searchList
        .querySelectorAll(
            '[data-employee-id]'
        )
        .forEach((button, index) => {
            button.addEventListener(
                'mouseenter',
                () => {
                    ctx.state.highlightedIndex =
                        index;

                    ctx.updateHighlightedResult();
                }
            );

            button.addEventListener(
                'click',
                async event => {
                    event.preventDefault();
                    event.stopPropagation();

                    ctx.state.currentSearchIndex =
                        index;

                    await ctx.loadEmployee(
                        button.dataset.employeeId
                    );

                    ctx.hideSearchResults();
                    ctx.updateCounter();
                }
            );
        });
}

export async function searchEmployees(
    ctx,
    query
) {
    const trimmedQuery =
        query.trim();

    ctx.resetHighlightedResult();

    if (!trimmedQuery) {
        ctx.state.searchItems = [];
        ctx.state.currentSearchIndex = -1;

        if (ctx.dom.searchList) {
            ctx.dom.searchList.innerHTML =
                '';
        }

        ctx.hideSearchResults();
        ctx.updateCounter();

        return;
    }

    try {
        const response =
            await fetch(
                `${ctx.api.search}?q=${encodeURIComponent(
                    trimmedQuery
                )}`,
                {
                    method: 'GET',
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

        if (!response.ok) {
            throw new Error(
                result.message ||
                'Unable to search employees.'
            );
        }

        ctx.state.searchItems =
            Array.isArray(result.data)
                ? result.data
                : [];

        ctx.state.currentSearchIndex =
            -1;

        ctx.renderSearchResults();
        ctx.updateCounter();
    } catch (error) {
        console.error(
            'Employee search error:',
            error
        );

        ctx.state.searchItems = [];
        ctx.state.currentSearchIndex = -1;

        if (ctx.dom.searchList) {
            ctx.dom.searchList.innerHTML = `
                <div class="px-4 py-3 text-sm text-red-500 dark:text-red-400">
                    Unable to search employees.
                </div>
            `;

            ctx.showSearchResults();
        }

        ctx.updateCounter();
    }
}

export function handleSearchInput(ctx) {
    if (
        ctx.state.mode !== 'view'
    ) {
        return;
    }

    clearTimeout(
        ctx.state.searchTimer
    );

    ctx.state.highlightedIndex = -1;

    ctx.dom.searchInput?.removeAttribute(
        'aria-activedescendant'
    );

    const query =
        ctx.dom.searchInput?.value ||
        '';

    ctx.state.searchTimer =
        setTimeout(() => {
            ctx.searchEmployees(
                query
            );
        }, 300);
}

export function handleSearchFocus(ctx) {
    if (
        ctx.state.mode !== 'view'
    ) {
        return;
    }

    if (
        ctx.dom.searchInput?.value.trim()
    ) {
        ctx.searchEmployees(
            ctx.dom.searchInput.value
        );
    }
}

export async function handleSearchKeydown(
    ctx,
    event
) {
    if (
        ctx.state.mode !== 'view'
    ) {
        return;
    }

    const results =
        ctx.dom.searchList?.querySelectorAll(
            '[data-employee-id]'
        ) || [];

    if (event.key === 'Escape') {
        event.preventDefault();

        ctx.hideSearchResults();

        return;
    }

    if (!results.length) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();

        ctx.showSearchResults();

        ctx.state.highlightedIndex++;

        if (
            ctx.state.highlightedIndex >=
            results.length
        ) {
            ctx.state.highlightedIndex =
                0;
        }

        ctx.updateHighlightedResult();

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();

        ctx.showSearchResults();

        ctx.state.highlightedIndex--;

        if (
            ctx.state.highlightedIndex < 0
        ) {
            ctx.state.highlightedIndex =
                results.length - 1;
        }

        ctx.updateHighlightedResult();

        return;
    }

    if (event.key === 'Enter') {
        if (
            ctx.state.highlightedIndex >= 0
        ) {
            event.preventDefault();

            const selectedResult =
                results[
                    ctx.state.highlightedIndex
                ];

            ctx.state.currentSearchIndex =
                Number(
                    selectedResult
                        .dataset
                        .index
                );

            await ctx.loadEmployee(
                selectedResult
                    .dataset
                    .employeeId
            );

            ctx.hideSearchResults();
            ctx.updateCounter();
        }
    }
}

export function handleListSearchKeydown(
    ctx,
    event
) {
    if (
        event.key === 'Escape'
    ) {
        event.preventDefault();

        if (
            ctx.dom.employeeListSearchResults
        ) {
            ctx.dom.employeeListSearchResults.classList.add(
                'hidden'
            );
        }
    }
}