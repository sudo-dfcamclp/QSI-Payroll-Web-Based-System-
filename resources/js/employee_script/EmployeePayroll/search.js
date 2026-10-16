import { loadClientList } from './list.js';

export function initializeClientSearch(ctx) {
    const searchInput = ctx.dom.clientSearch;

    if (!searchInput || searchInput.dataset.searchInitialized) {
        return;
    }

    searchInput.dataset.searchInitialized = 'true';

    searchInput.addEventListener('input', () => {
        clearTimeout(searchInput._searchTimeout);

        searchInput._searchTimeout = setTimeout(() => {
            loadClientList(
                ctx,
                searchInput.value.trim(),
                1
            );
        }, 300);
    });
}