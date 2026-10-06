import Swal from 'sweetalert2';

export function showListingView(ctx) {
    ctx.dom.listingView?.classList.remove('hidden');
    ctx.dom.formView?.classList.add('hidden');
}

export function showFormView(ctx) {
    ctx.dom.listingView?.classList.add('hidden');
    ctx.dom.formView?.classList.remove('hidden');
}

export function updateEmployeeListPagination(ctx, pagination) {
    const container = ctx.dom.employeeListPagination;

    if (!container) {
        console.warn('Employee pagination container was not found.');
        return;
    }

    const currentPage = Number(pagination?.current_page || 1);
    const lastPage = Number(pagination?.last_page || 1);
    const total = Number(pagination?.total || 0);
    const from = Number(pagination?.from || 0);
    const to = Number(pagination?.to || 0);

    ctx.state.employeeListPage = currentPage;
    ctx.state.employeeListLastPage = lastPage;
    ctx.state.employeeListTotal = total;

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
        <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-700 dark:text-gray-200">${from}</span>
            to
            <span class="font-semibold text-gray-700 dark:text-gray-200">${to}</span>
            of
            <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span>
            employees
        </div>
        <div class="flex items-center gap-1">
            <button type="button" class="employee-pagination-button inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Previous page">
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
                    <button type="button" class="employee-pagination-button inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-green-600 text-white cursor-default' : 'border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'}" data-page="${page}" ${isActive ? 'disabled' : ''} aria-label="Go to page ${page}">
                        ${page}
                    </button>
                `;
            }).join('')}
            <button type="button" class="employee-pagination-button inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentPage >= lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-page="${currentPage + 1}" ${currentPage >= lastPage ? 'disabled' : ''} aria-label="Next page">
                <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
        </div>
    `;

    container.querySelectorAll('.employee-pagination-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            const page = Number(button.dataset.page);

            if (!page || page < 1 || page > lastPage || page === currentPage) {
                return;
            }

            ctx.loadEmployeeList(ctx.dom.employeeListSearch?.value || '', page);
        });
    });
}

export function renderEmployeeList(ctx, employees) {
    if (!ctx.dom.employeeList) {
        return;
    }

    if (!employees.length) {
        ctx.dom.employeeList.innerHTML = `
            <div class="px-5 py-10 text-center  dark:bg-gray-700">
                <div class="text-sm font-medium text-gray-600 dark:text-gray-300">
                    No employees found
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Try a different search term.
                </div>
            </div>
        `;

        return;
    }

    const isArchive = ctx.state.employeeStatus === 'archive';

    ctx.dom.employeeList.innerHTML = employees.map(employee => {
        const fullName = ctx.getEmployeeDisplayName(employee) || 'Unnamed Employee';

        return `
            <div class="employee-list-row relative group grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_52px] items-center min-h-[52px] px-4 sm:px-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-200 dark:hover:border-green-800 hover:shadow-sm transition-all duration-150 cursor-pointer" data-employee-id="${ctx.escapeHtml(employee.emp_id)}">
                <div class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">
                    ${ctx.escapeHtml(employee.emp_id || '')}
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-gray-100 pointer-events-none">
                    ${ctx.escapeHtml(fullName)}
                </div>
                <div class="relative shrink-0">
                    <button type="button" class="employee-context-button w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 cursor-pointer" data-employee-id="${ctx.escapeHtml(employee.emp_id)}" aria-label="Employee actions" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div class="employee-context-menu hidden absolute right-0 top-9 z-50 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                        <button type="button" class="employee-status-action-button w-full flex items-center gap-2 px-3 py-2.5 text-sm ${isArchive ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'} text-left cursor-pointer" data-employee-id="${ctx.escapeHtml(employee.emp_id)}">
                            <i class="fa-solid ${isArchive ? 'fa-box-open' : 'fa-box-archive'} w-4"></i>
                            <span>${isArchive ? 'Recover' : 'Archive'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    ctx.dom.employeeList.querySelectorAll('.employee-list-row').forEach(row => {
        row.addEventListener('click', event => {
            if (event.target.closest('.employee-context-button') || event.target.closest('.employee-context-menu')) {
                return;
            }

            const employeeId = row.dataset.employeeId;

            if (!employeeId) {
                return;
            }

            ctx.loadEmployeeFromList(employeeId);
        });
    });

    ctx.dom.employeeList.querySelectorAll('.employee-context-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const row = button.closest('.employee-list-row');
            const menu = row?.querySelector('.employee-context-menu');

            if (!menu) {
                return;
            }

            ctx.dom.employeeList.querySelectorAll('.employee-context-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.add('hidden');
                }
            });

            ctx.dom.employeeList.querySelectorAll('.employee-context-button').forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });

            const isHidden = menu.classList.contains('hidden');

            menu.classList.toggle('hidden', !isHidden);

            button.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        });
    });

    ctx.dom.employeeList.querySelectorAll('.employee-status-action-button').forEach(button => {
        button.addEventListener('click', async event => {
            event.preventDefault();
            event.stopPropagation();

            const employeeId = button.dataset.employeeId;

            if (!employeeId) {
                return;
            }

            const employee = employees.find(item => String(item.emp_id) === String(employeeId));
            const employeeName = employee ? ctx.getEmployeeDisplayName(employee) : `Employee ${employeeId}`;
            const isArchiveAction = ctx.state.employeeStatus === 'archive';

            const row = button.closest('.employee-list-row');
            const menu = row?.querySelector('.employee-context-menu');

            menu?.classList.add('hidden');

            const isDarkMode = document.documentElement.classList.contains('dark');

            try {
                const confirmation = await Swal.fire({
                    icon: 'warning',
                    title: isArchiveAction ? 'Recover Employee?' : 'Archive Employee?',
                    text: isArchiveAction
                        ? `${employeeName} will be moved back to the active employee list.`
                        : `${employeeName} will be moved to the employee archive.`,
                    showCancelButton: true,
                    confirmButtonText: isArchiveAction ? 'Yes, Recover' : 'Yes, Archive',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                    confirmButtonColor: isArchiveAction ? '#0a5d3c' : '#dc2626',
                    background: isDarkMode ? '#374151' : '#ffffff',
                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                });

                if (!confirmation.isConfirmed) {
                    return;
                }

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                if (!csrfToken) {
                    throw new Error('CSRF token was not found. Please refresh the page.');
                }

                const response = await fetch(`/payroll/public/api/employee-master/${encodeURIComponent(employeeId)}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || `Unable to ${isArchiveAction ? 'recover' : 'archive'} employee.`);
                }

                await Swal.fire({
                    icon: 'success',
                    title: isArchiveAction ? 'Employee Recovered' : 'Employee Archived',
                    text: isArchiveAction
                        ? `${employeeName} has been recovered successfully.`
                        : `${employeeName} has been archived successfully.`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0a5d3c',
                    background: isDarkMode ? '#374151' : '#ffffff',
                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                });

                await ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value || '',
                    ctx.state.employeeListPage || 1
                );
            } catch (error) {
                console.error(`${isArchiveAction ? 'Recover' : 'Archive'} employee error:`, error);

                await Swal.fire({
                    icon: 'error',
                    title: isArchiveAction ? 'Recovery Failed' : 'Archive Failed',
                    text: error.message || `An error occurred while ${isArchiveAction ? 'recovering' : 'archiving'} the employee.`,
                    confirmButtonColor: '#0a5d3c',
                    background: isDarkMode ? '#374151' : '#ffffff',
                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                });
            }
        });
    });
}

export async function loadEmployeeList(ctx, search = '', page = 1) {
    if (!ctx.dom.employeeList) {
        return;
    }

    ctx.dom.employeeList.innerHTML = `
        <div class="px-5 py-10 text-center  dark:bg-gray-700">
            <i class="fa-solid fa-spinner fa-spin text-green-600 text-xl"></i>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Loading employees...
            </div>
        </div>
    `;

    if (ctx.dom.employeeListPagination) {
        ctx.dom.employeeListPagination.innerHTML = '';
    }

    try {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set('q', search.trim());
        }

        params.set('page', String(page));
        params.set('sort', ctx.state.employeeSort);
        params.set('direction', ctx.state.employeeSortDirection);
        params.set('status', ctx.state.employeeStatus);

        const response = await fetch(`${ctx.api.list}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to load employees.');
        }

        const employees = Array.isArray(result.data) ? result.data : [];

        ctx.renderEmployeeList(employees);
        ctx.updateEmployeeListPagination(result.pagination || {});

        if (ctx.dom.employeeListSearchResults) {
            ctx.dom.employeeListSearchResults.classList.add('hidden');
        }
    } catch (error) {
        console.error('Employee list error:', error);

        if (ctx.dom.employeeListPagination) {
            ctx.dom.employeeListPagination.innerHTML = '';
        }

        ctx.dom.employeeList.innerHTML = `
            <div class="px-5 py-10 text-center  dark:bg-gray-700">
                <i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
                <div class="text-sm text-red-500 dark:text-red-400 mt-3">
                    Unable to load employees.
                </div>
            </div>
        `;
    }
}

export function handleEmployeeListSearch(ctx) {
    clearTimeout(ctx.state.searchTimer);

    const query = ctx.dom.employeeListSearch?.value || '';

    ctx.state.searchTimer = setTimeout(() => {
        ctx.loadEmployeeList(query, 1);
    }, 300);
}

export async function loadEmployeeFromList(ctx, employeeId) {
    if (!employeeId) {
        return;
    }

    ctx.showFormView();

    await ctx.loadEmployee(employeeId);

    if (ctx.dom.searchInput) {
        ctx.dom.searchInput.value = ctx.getEmployeeDisplayName({
            first_name: ctx.getField('first_name')?.value,
            middle_name: ctx.getField('middle_name')?.value,
            last_name: ctx.getField('last_name')?.value,
            suffix_name: ctx.getField('suffix_name')?.value
        });
    }
}

