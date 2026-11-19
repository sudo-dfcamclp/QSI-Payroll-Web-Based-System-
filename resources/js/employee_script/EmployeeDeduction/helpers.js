
const CSRF_TOKEN =
    document.querySelector('meta[name="csrf-token"]')?.content || '';

export const APP_URL =
    document.querySelector('meta[name="app-url"]')?.content || '';

export async function fetchJson(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
        },
        credentials: 'same-origin',
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
}

export function buildPages(currentPage, lastPage) {
    const pages = [];

    if (lastPage <= 7) {
        for (let p = 1; p <= lastPage; p++) {
            pages.push(p);
        }

        return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
        pages.push('...');
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(lastPage - 1, currentPage + 2);

    for (let p = start; p <= end; p++) {
        pages.push(p);
    }

    if (currentPage < lastPage - 3) {
        pages.push('...');
    }

    pages.push(lastPage);

    return pages;
}

export function renderPagination(
    container,
    meta,
    onPageChange,
    label = 'items'
) {
    if (!container) return;

    const currentPage = Number(meta?.current_page || 1);
    const lastPage = Number(meta?.last_page || 1);
    const total = Number(meta?.total || 0);
    const from = Number(meta?.from || 0);
    const to = Number(meta?.to || 0);

    if (total <= 0) {
        container.innerHTML = '';
        return;
    }

    const pages = buildPages(currentPage, lastPage);

    container.innerHTML = `
        <div class="flex flex-col gap-2">
            <div class="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-200">${from}</span>
                to
                <span class="font-semibold text-gray-700 dark:text-gray-200">${to}</span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span>
                ${label}
            </div>

            <div class="flex items-center justify-center gap-1">
                <button
                    type="button"
                    class="pagination-button inline-flex items-center justify-center w-7 h-7 border border-gray-300 dark:border-gray-500 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
                    data-page="${currentPage - 1}"
                    ${currentPage <= 1 ? 'disabled' : ''}
                >
                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                </button>

                ${pages.map(page => {
                    if (page === '...') {
                        return `
                            <span class="inline-flex items-center justify-center w-7 h-7 text-[10px] text-gray-400 dark:text-gray-500">
                                ...
                            </span>
                        `;
                    }

                    const isActive = page === currentPage;

                    return `
                        <button
                            type="button"
                            class="pagination-button inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-medium transition-colors
                            ${isActive
                                ? 'bg-green-600 text-white cursor-default'
                                : 'border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'}"
                            data-page="${page}"
                            ${isActive ? 'disabled' : ''}
                        >
                            ${page}
                        </button>
                    `;
                }).join('')}

                <button
                    type="button"
                    class="pagination-button inline-flex items-center justify-center w-7 h-7 border border-gray-300 dark:border-gray-500 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
                    data-page="${currentPage + 1}"
                    ${currentPage >= lastPage ? 'disabled' : ''}
                >
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
            </div>
        </div>
    `;

    container.querySelectorAll('.pagination-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            const page = Number(button.dataset.page);

            if (
                !page ||
                page < 1 ||
                page > lastPage ||
                page === currentPage
            ) {
                return;
            }

            onPageChange(page);
        });
    });
}

export function setText(panel, id, value) {
    const element = panel.querySelector(`#${id}`);

    if (element) {
        element.textContent = value;
    }
}

export function setHtml(panel, id, html) {
    const element = panel.querySelector(`#${id}`);

    if (element) {
        element.innerHTML = html;
    }
}

export function escapeHtml(str) {
    if (str == null) return '';

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
