import {
    loadClientList
} from './list.js';

export function initializeClientSearch(ctx) {
    const searchInput =
        ctx.dom.clientSearch;

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        'input',
        () => {
            clearTimeout(
                searchInput._searchTimeout
            );

            searchInput._searchTimeout =
                setTimeout(() => {
                    loadClientList(
                        ctx,
                        searchInput.value,
                        1
                    );
                }, 300);
        }
    );
}