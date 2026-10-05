import Swal from 'sweetalert2';

export async function init(panel) {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const listingView = panel.querySelector('#employeeListingView');
    const formView = panel.querySelector('#employeeFormView');
    const employeeList = panel.querySelector('#employeeList');
    const employeeListSearch = panel.querySelector('#employeeListSearch');
    const employeeListSearchResults = panel.querySelector('#employeeListSearchResults');
    const employeeListSearchList = panel.querySelector('#employeeListSearchList');
    const employeeAddButton = panel.querySelector('#employeeAddButton');
    const employeeListCounter = panel.querySelector('#employeeListCounter');
    const employeePreviousPageButton = panel.querySelector('#employeePreviousPageButton');
    const employeeNextPageButton = panel.querySelector('#employeeNextPageButton');
    const employeePageIndicator = panel.querySelector('#employeePageIndicator');
    const employeeBackButton = panel.querySelector('#employeeBackButton');
    const employeeSortButton = panel.querySelector('#employeeSortButton');

    const form = panel.querySelector('#employeeForm');
    const clientIdDisplay = panel.querySelector('#employeeClientIdDisplay');
    const searchInput = panel.querySelector('#employeeSearch');
    const searchResults = panel.querySelector('#employeeSearchResults');
    const searchList = panel.querySelector('#employeeSearchList');
    const editButton = panel.querySelector('#employeeEditButton');
    const saveButton = panel.querySelector('#employeeSaveButton');
    const cancelButton = panel.querySelector('#employeeCancelButton');
    const previousButton = panel.querySelector('#employeePreviousButton');
    const nextButton = panel.querySelector('#employeeNextButton');
    const employeeCounter = panel.querySelector('#employeeRecordCounter');
    const employeeSubtitle = panel.querySelector('#employeeSubtitle');
    const profileInput = panel.querySelector('[name="profile_photo"]');
    const profilePreview = panel.querySelector('#employeeProfilePreview');
    const clientInput = panel.querySelector('#employeeClientInput');
    const clientDropdown = panel.querySelector('#employeeClientDropdown');
    const clientList = panel.querySelector('#employeeClientList');
    const clientIcon = panel.querySelector('#employeeClientIcon');
    const rateBasisField = panel.querySelector('[name="rate_basis"]');
    const hourlyRateField = panel.querySelector('[name="hourly_rate"]');
    const dailyRateField = panel.querySelector('[name="daily_rate"]');
    const monthlyRateField = panel.querySelector('[name="monthly_rate"]');

    if (!form) {
        console.error('Employee Master form was not found.');
        return;
    }

    const API = {
        list: '/payroll/public/api/employee-master/search',
        search: '/payroll/public/api/employee-master/search',
        clients: '/payroll/public/api/employee-master/clients',
        store: '/payroll/public/api/employee-master',
        show: empId => `/payroll/public/api/employee-master/${empId}`,
        update: empId => `/payroll/public/api/employee-master/${empId}`
    };

    let mode = 'view';
    let currentEmployeeId = null;
    let originalData = {};
    let originalClientDisplayName = '';
    let currentClientDisplayName = '';
    let currentClientPayrollConfig = null;
    let originalClientPayrollConfig = null;
    let searchTimer = null;
    let clientSearchTimer = null;
    let searchItems = [];
    let currentSearchIndex = -1;
    let highlightedIndex = -1;
    let employeeListPage = 1;
    let employeeListLastPage = 1;
    let employeeListTotal = 0;
    let employeeSort = 'name';
    let employeeSortDirection = 'asc';
    let employeeStatus = 'active';

    function showListingView() {
        listingView?.classList.remove('hidden');
        formView?.classList.add('hidden');
    }

    function showFormView() {
        listingView?.classList.add('hidden');
        formView?.classList.remove('hidden');
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function getEmployeeFullName(employee) {
        const firstName = [
            employee.first_name,
            employee.middle_name,
            employee.suffix_name
        ].filter(Boolean).join(' ');

        return [
            employee.last_name,
            firstName
        ].filter(Boolean).join(', ');
    }

    function getEmployeeDisplayName(employee) {
        return [
            employee.first_name,
            employee.middle_name,
            employee.last_name,
            employee.suffix_name
        ].filter(Boolean).join(' ');
    }

    function updateEmployeeListPagination(pagination) {
        const currentPage = Number(pagination?.current_page || 1);
        const lastPage = Number(pagination?.last_page || 1);
        const total = Number(pagination?.total || 0);
        const from = Number(pagination?.from || 0);
        const to = Number(pagination?.to || 0);

        employeeListPage = currentPage;
        employeeListLastPage = lastPage;
        employeeListTotal = total;

        if (employeeListCounter) {
            employeeListCounter.textContent =
                total > 0
                    ? `${from}-${to} of ${total}`
                    : '0 of 0';
        }

        if (employeePageIndicator) {
            employeePageIndicator.textContent =
                `Page ${currentPage} of ${lastPage}`;
        }

        if (employeePreviousPageButton) {
            employeePreviousPageButton.disabled = currentPage <= 1;
            employeePreviousPageButton.classList.toggle(
                'opacity-50',
                currentPage <= 1
            );
            employeePreviousPageButton.classList.toggle(
                'cursor-not-allowed',
                currentPage <= 1
            );
            employeePreviousPageButton.classList.toggle(
                'cursor-pointer',
                currentPage > 1
            );
        }

        if (employeeNextPageButton) {
            employeeNextPageButton.disabled =
                currentPage >= lastPage;

            employeeNextPageButton.classList.toggle(
                'opacity-50',
                currentPage >= lastPage
            );

            employeeNextPageButton.classList.toggle(
                'cursor-not-allowed',
                currentPage >= lastPage
            );

            employeeNextPageButton.classList.toggle(
                'cursor-pointer',
                currentPage < lastPage
            );
        }
    }

    function closeEmployeeSortMenu() {
        panel.querySelector('#employeeSortMenu')?.remove();
        employeeSortButton?.setAttribute('aria-expanded', 'false');
    }

    function createEmployeeSortMenu() {
        closeEmployeeSortMenu();

        if (!employeeSortButton) return;

        const menu = document.createElement('div');

        menu.id = 'employeeSortMenu';

        menu.className = [
            'absolute',
            'right-0',
            'top-full',
            'mt-2',
            'w-52',
            'z-50',
            'bg-white',
            'dark:bg-gray-700',
            'border',
            'border-gray-200',
            'dark:border-gray-600',
            'rounded-lg',
            'shadow-lg',
            'py-1'
        ].join(' ');

        const createMenuButton = (
            label,
            onClick,
            active = false
        ) => {
            const button = document.createElement('button');

            button.type = 'button';

            button.className = [
                'w-full',
                'flex',
                'items-center',
                'justify-between',
                'px-3',
                'py-2',
                'text-sm',
                'text-left',
                'text-gray-700',
                'dark:text-gray-200',
                'hover:bg-gray-50',
                'dark:hover:bg-gray-600',
                'transition-colors',
                'cursor-pointer'
            ].join(' ');

            button.innerHTML = `
                <span>${escapeHtml(label)}</span>
                ${
                    active
                        ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>'
                        : ''
                }
            `;

            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                onClick();
            });

            return button;
        };

        // =========================================================
        // STATUS
        // =========================================================

        const statusWrapper = document.createElement('div');

        statusWrapper.className = 'relative';

        const statusButton = document.createElement('button');

        statusButton.type = 'button';

        statusButton.className = [
            'w-full',
            'flex',
            'items-center',
            'justify-between',
            'px-3',
            'py-2',
            'text-sm',
            'text-left',
            'text-gray-700',
            'dark:text-gray-200',
            'hover:bg-gray-50',
            'dark:hover:bg-gray-600',
            'transition-colors',
            'cursor-pointer'
        ].join(' ');

        statusButton.innerHTML = `
            <span>Status</span>
            <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
        `;

        const statusMenu = document.createElement('div');

        statusMenu.className = [
            'absolute',
            'right-full',
            'top-0',
            'mr-1',
            'w-40',
            'bg-white',
            'dark:bg-gray-700',
            'border',
            'border-gray-200',
            'dark:border-gray-600',
            'rounded-lg',
            'shadow-lg',
            'py-1',
            'hidden'
        ].join(' ');

        const statusOptions = [
            { label: 'Active', value: 'active' },
            { label: 'Disabled', value: 'disabled' }
        ];

        statusOptions.forEach(option => {
            statusMenu.appendChild(
                createMenuButton(
                    option.label,
                    () => {
                        employeeStatus = option.value;
                        employeeListPage = 1;

                        closeEmployeeSortMenu();

                        loadEmployeeList(
                            employeeListSearch?.value || '',
                            1
                        );
                    },
                    employeeStatus === option.value
                )
            );
        });

        statusWrapper.appendChild(statusButton);
        statusWrapper.appendChild(statusMenu);

        statusWrapper.addEventListener(
            'mouseenter',
            () => {
                statusMenu.classList.remove('hidden');
            }
        );

        statusWrapper.addEventListener(
            'mouseleave',
            () => {
                statusMenu.classList.add('hidden');
            }
        );

        statusButton.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();
                statusMenu.classList.toggle('hidden');
            }
        );

        menu.appendChild(statusWrapper);

        // =========================================================
        // DIVIDER
        // =========================================================

        const divider = document.createElement('div');

        divider.className =
            'my-1 border-t border-gray-100 dark:border-gray-600';

        menu.appendChild(divider);

        // =========================================================
        // DEFAULT NAME
        // =========================================================

        menu.appendChild(
            createMenuButton(
                'Default Name',
                () => {
                    employeeSort = 'name';
                    employeeSortDirection = 'asc';
                    employeeListPage = 1;

                    closeEmployeeSortMenu();

                    loadEmployeeList(
                        employeeListSearch?.value || '',
                        1
                    );
                },
                employeeSort === 'name' &&
                employeeSortDirection === 'asc'
            )
        );

        // =========================================================
        // LATEST TO OLDEST
        // =========================================================

        menu.appendChild(
            createMenuButton(
                'Latest to Oldest',
                () => {
                    employeeSort = 'latest';
                    employeeSortDirection = 'desc';
                    employeeListPage = 1;

                    closeEmployeeSortMenu();

                    loadEmployeeList(
                        employeeListSearch?.value || '',
                        1
                    );
                },
                employeeSort === 'latest' &&
                employeeSortDirection === 'desc'
            )
        );

        // =========================================================
        // OLDEST TO LATEST
        // =========================================================

        menu.appendChild(
            createMenuButton(
                'Oldest to Latest',
                () => {
                    employeeSort = 'oldest';
                    employeeSortDirection = 'asc';
                    employeeListPage = 1;

                    closeEmployeeSortMenu();

                    loadEmployeeList(
                        employeeListSearch?.value || '',
                        1
                    );
                },
                employeeSort === 'oldest' &&
                employeeSortDirection === 'asc'
            )
        );

        // =========================================================
        // BY LETTER
        // =========================================================

        const letterWrapper = document.createElement('div');

        letterWrapper.className = 'relative';

        const letterButton = document.createElement('button');

        letterButton.type = 'button';

        letterButton.className = [
            'w-full',
            'flex',
            'items-center',
            'justify-between',
            'px-3',
            'py-2',
            'text-sm',
            'text-left',
            'text-gray-700',
            'dark:text-gray-200',
            'hover:bg-gray-50',
            'dark:hover:bg-gray-600',
            'transition-colors',
            'cursor-pointer'
        ].join(' ');

        letterButton.innerHTML = `
            <span>By Letter</span>
            <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
        `;

        const letterMenu = document.createElement('div');

        letterMenu.className = [
            'absolute',
            'right-full',
            'top-0',
            'mr-1',
            'w-40',
            'bg-white',
            'dark:bg-gray-700',
            'border',
            'border-gray-200',
            'dark:border-gray-600',
            'rounded-lg',
            'shadow-lg',
            'py-1',
            'hidden'
        ].join(' ');

        const letterOptions = [
            { label: 'A to Z', direction: 'asc' },
            { label: 'Z to A', direction: 'desc' }
        ];

        letterOptions.forEach(option => {
            letterMenu.appendChild(
                createMenuButton(
                    option.label,
                    () => {
                        employeeSort = 'letter';
                        employeeSortDirection = option.direction;
                        employeeListPage = 1;

                        closeEmployeeSortMenu();

                        loadEmployeeList(
                            employeeListSearch?.value || '',
                            1
                        );
                    },
                    employeeSort === 'letter' &&
                    employeeSortDirection === option.direction
                )
            );
        });

        letterWrapper.appendChild(letterButton);
        letterWrapper.appendChild(letterMenu);

        letterWrapper.addEventListener(
            'mouseenter',
            () => {
                letterMenu.classList.remove('hidden');
            }
        );

        letterWrapper.addEventListener(
            'mouseleave',
            () => {
                letterMenu.classList.add('hidden');
            }
        );

        letterButton.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();
                letterMenu.classList.toggle('hidden');
            }
        );

        menu.appendChild(letterWrapper);

        // =========================================================
        // APPEND MENU
        // =========================================================

        const parent = employeeSortButton.parentElement;

        if (!parent) return;

        if (getComputedStyle(parent).position === 'static') {
            parent.classList.add('relative');
        }

        parent.appendChild(menu);

        employeeSortButton.setAttribute(
            'aria-expanded',
            'true'
        );
    }

    function renderEmployeeList(employees) {
        if (!employeeList) {
            return;
        }

        if (!employees.length) {
            employeeList.innerHTML = `
                <div class="px-5 py-12 text-center">
                    <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        <i class="fa-solid fa-users-slash text-gray-400 dark:text-gray-300"></i>
                    </div>

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

        employeeList.innerHTML = employees.map(employee => {
            const fullName =
                getEmployeeDisplayName(employee) ||
                'Unnamed Employee';

            const clientName =
                employee.client_name ||
                employee.client?.client_name ||
                '';

            return `
                <div
                    class="employee-list-row relative group grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_52px] items-center min-h-[52px] px-4 sm:px-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-200 dark:hover:border-green-800 hover:shadow-sm transition-all duration-150 cursor-pointer"
                    data-employee-id="${escapeHtml(employee.emp_id)}">

                    <div class="min-w-0 text-left">
                        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            #${escapeHtml(employee.emp_id || '')}
                        </div>
                    </div>

                    <div class="min-w-0 pr-3 text-left">
                        <div class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                            ${escapeHtml(fullName)}
                        </div>

                        <div class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                            ${employee.badge_no ? `Badge: ${escapeHtml(employee.badge_no)}` : ''}
                            ${employee.badge_no && clientName ? ' • ' : ''}
                            ${clientName ? escapeHtml(clientName) : ''}
                        </div>
                    </div>

                    <div class="relative flex justify-end">
                        <button
                            type="button"
                            class="employee-context-button w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                            data-employee-id="${escapeHtml(employee.emp_id)}"
                            aria-label="Employee actions"
                            aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        <div
                            class="employee-context-menu hidden absolute right-0 top-9 z-50 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                            <button
                                type="button"
                                class="employee-archive-button w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left cursor-pointer"
                                data-employee-id="${escapeHtml(employee.emp_id)}">
                                <i class="fa-solid fa-box-archive w-4"></i>
                                <span>Archive</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        employeeList
            .querySelectorAll('.employee-list-row')
            .forEach(row => {
                row.addEventListener('click', event => {
                    if (
                        event.target.closest('.employee-context-button') ||
                        event.target.closest('.employee-context-menu')
                    ) {
                        return;
                    }

                    loadEmployeeFromList(
                        row.dataset.employeeId
                    );
                });
            });

        employeeList
        .querySelectorAll('.employee-context-button')
        .forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();

                const row = button.closest('.employee-list-row');
                const menu = row?.querySelector('.employee-context-menu');

                if (!menu) {
                    return;
                }

                employeeList
                    .querySelectorAll('.employee-context-menu')
                    .forEach(otherMenu => {
                        if (otherMenu !== menu) {
                            otherMenu.classList.add('hidden');
                        }
                    });

                const isHidden = menu.classList.contains('hidden');

                menu.classList.toggle('hidden', !isHidden);

                button.setAttribute(
                    'aria-expanded',
                    isHidden ? 'true' : 'false'
                );
            });
        });

        employeeList
        .querySelectorAll('.employee-archive-button')
        .forEach(button => {
            button.addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();

                const employeeId =
                    button.dataset.employeeId;

                const employee =
                    employees.find(
                        item =>
                            String(item.emp_id) ===
                            String(employeeId)
                    );

                const employeeName =
                    employee
                        ? getEmployeeDisplayName(employee)
                        : `Employee ${employeeId}`;

                const row =
                    button.closest('.employee-list-row');

                const menu =
                    row?.querySelector('.employee-context-menu');

                menu?.classList.add('hidden');

                const isDarkMode =
                    document.documentElement.classList.contains('dark');

                const result = await Swal.fire({
                    icon: 'warning',
                    title: 'Archive Employee?',
                    text: `${employeeName} will be moved to the employee archive.`,
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Archive',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                    confirmButtonColor: '#dc2626',
                    background: isDarkMode ? '#374151' : '#ffffff',
                    color: isDarkMode ? '#f9fafb' : '#1f2937',
                    customClass: {
                        popup: 'rounded-xl border border-gray-200 dark:border-gray-600',
                        title: 'text-gray-800 dark:text-white',
                        htmlContainer: 'text-gray-600 dark:text-gray-300',
                        confirmButton: 'rounded-lg px-4 py-2',
                        cancelButton: 'rounded-lg px-4 py-2'
                    }
                });

                if (!result.isConfirmed) {
                    return;
                }

                console.log(
                    'Archive employee:',
                    employeeId
                );

                // Archive API will be added here later.
            });
        });
    }

        async function loadEmployeeList(search = '', page = 1) {
        if (!employeeList) {
            return;
        }

        employeeList.innerHTML = `
            <div class="px-5 py-12 text-center">
                <i class="fa-solid fa-spinner fa-spin text-green-600 text-xl"></i>

                <div class="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Loading employees...
                </div>
            </div>
        `;

        try {
            const params = new URLSearchParams();

            if (search.trim()) {
                params.set('q', search.trim());
            }

            params.set('page', String(page));
            params.set('sort', employeeSort);
            params.set('direction', employeeSortDirection);
            params.set('status', employeeStatus);

            const response = await fetch(
                `${API.list}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to load employees.'
                );
            }

            const employees = Array.isArray(result.data)
                ? result.data
                : [];

            renderEmployeeList(employees);

            updateEmployeeListPagination(
                result.pagination || {}
            );

            if (employeeListSearchResults) {
                employeeListSearchResults.classList.add('hidden');
            }

        } catch (error) {
            console.error(
                'Employee list error:',
                error
            );

            employeeList.innerHTML = `
                <div class="px-5 py-12 text-center">
                    <i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>

                    <div class="text-sm text-red-500 dark:text-red-400 mt-3">
                        Unable to load employees.
                    </div>
                </div>
            `;
        }
    }

    function handleEmployeeListSearch() {
        clearTimeout(searchTimer);

        const query = employeeListSearch?.value || '';

        searchTimer = setTimeout(() => {
            loadEmployeeList(query, 1);
        }, 300);
    }

    async function loadEmployeeFromList(employeeId) {
        if (!employeeId) {
            return;
        }

        showFormView();

        await loadEmployee(employeeId);

        if (searchInput) {
            searchInput.value =
                getEmployeeDisplayName({
                    first_name: getField('first_name')?.value,
                    middle_name: getField('middle_name')?.value,
                    last_name: getField('last_name')?.value,
                    suffix_name: getField('suffix_name')?.value
                });
        }
    }

    function getFields() {
        return Array.from(form.querySelectorAll('[name]')).filter(field => {
            return field.name !== 'employeeSearch';
        });
    }

    function getField(name) {
        return form.querySelector(`[name="${name}"]`);
    }

    function getFormDataObject() {
        const data = {};

        getFields().forEach(field => {
            if (!field.name || field.name === 'profile_photo') {
                return;
            }

            if (field.type === 'checkbox') {
                data[field.name] = field.checked;
            } else {
                data[field.name] = field.value;
            }
        });

        return data;
    }

    function setFieldValue(name, value) {
        const field = getField(name);

        if (!field) {
            return;
        }

        if (field.type === 'checkbox') {
            field.checked =
                value === true ||
                value === 1 ||
                value === '1';
            return;
        }

        field.value = value ?? '';
    }

    function getClientName(employee) {
        return employee?.client_name ||
            employee?.client?.client_name ||
            '';
    }

    function updateClientDisplay(clientName) {
        currentClientDisplayName = clientName || '';

        if (clientInput) {
            clientInput.value = clientName || '';
        }
    }

    function clearClient() {
        const clientField = getField('client_id');

        if (clientField) {
            clientField.value = '';
            clientField.disabled = false;
        }

        if (clientInput) {
            clientInput.value = '';
        }

        if (clientIdDisplay) {
            clientIdDisplay.value = '';
        }

        currentClientDisplayName = '';
        currentClientPayrollConfig = null;

        hideClientDropdown();

        if (clientList) {
            clientList.innerHTML = '';
        }

        clearComputedRates();
    }

    function populateClient(employee) {
        const clientField = getField('client_id');
        const clientName = getClientName(employee);
        const clientId = employee?.client_id ?? '';

        if (clientField) {
            clientField.value = clientId;
            clientField.disabled = false;
        }

        updateClientDisplay(clientName);

        if (clientIdDisplay) {
            clientIdDisplay.value = clientId;
        }

        currentClientPayrollConfig =
            employee?.payroll_config || null;
    }

    function populateForm(employee) {
        if (!employee) {
            return;
        }

        const fields = [
            'emp_id',
            'client_id',
            'contact_no',
            'badge_no',
            'nickname',
            'last_name',
            'first_name',
            'middle_name',
            'suffix_name',
            'birth_date',
            'birth_place',
            'citizenship',
            'gender',
            'civil_status',
            'weight',
            'height',
            'religion',
            'house_no',
            'street',
            'barangay',
            'district',
            'city',
            'town',
            'contact',
            'phone',
            'primary_education',
            'secondary_education',
            'college',
            'degree',
            'major',
            'post_grad',
            'course',
            'sss_no',
            'philhealth_no',
            'pagibig_no',
            'tin_no',
            'employment_status',
            'remarks',
            'position',
            'branch',
            'department',
            'date_hired',
            'date_resigned',
            'start_contract',
            'end_contract',
            'rate_basis',
            'month_no',
            'hourly_rate',
            'daily_rate',
            'monthly_rate',
            'date_reg',
            'date_prob',
            'insurance_no',
            'agency_fee',
            'agency',
            'account_no',
            'expanded_tax',
            'allowance',
            'with_ecol'
        ];

        fields.forEach(name => {
            setFieldValue(name, employee[name]);
        });

        populateClient(employee);

        currentEmployeeId = employee.emp_id ?? null;

        if (profileInput) {
            profileInput.value = '';
        }

        if (profilePreview) {
            if (employee.profile_photo_url) {
                profilePreview.src =
                    employee.profile_photo_url;
                profilePreview.classList.remove('hidden');
            } else {
                profilePreview.removeAttribute('src');
                profilePreview.classList.add('hidden');
            }
        }

        updateEmployeeHeader(employee);
        saveOriginalData();
        updateCounter();
        updateRateFieldState();
    }

    function updateEmployeeHeader(employee) {
        if (!employeeSubtitle) {
            return;
        }

        if (!employee) {
            employeeSubtitle.textContent =
                'Employee: None selected';
            return;
        }

        const fullName = [
            employee.first_name,
            employee.middle_name,
            employee.last_name,
            employee.suffix_name
        ].filter(Boolean).join(' ');

        employeeSubtitle.textContent =
            `Employee: ${fullName || 'Unnamed Employee'}`;
    }

    function clearForm() {
        form.reset();

        getFields().forEach(field => {
            if (field.type === 'checkbox') {
                field.checked = false;
            } else if (field.type !== 'file') {
                field.value = '';
            }
        });

        currentEmployeeId = null;
        originalData = getFormDataObject();
        originalClientDisplayName = '';
        currentClientDisplayName = '';
        currentClientPayrollConfig = null;
        originalClientPayrollConfig = null;

        clearClient();

        if (profileInput) {
            profileInput.value = '';
        }

        if (profilePreview) {
            profilePreview.removeAttribute('src');
            profilePreview.classList.add('hidden');
        }

        if (employeeSubtitle) {
            employeeSubtitle.textContent =
                'Employee: New Employee';
        }

        clearComputedRates();
        updateRateFieldState();
        updateCounter();
    }

    function setFieldState(enabled) {
        getFields().forEach(field => {
            if (!field) {
                return;
            }

            const isCheckbox = field.type === 'checkbox';
            const isSelect = field.tagName === 'SELECT';
            const isFile = field.type === 'file';
            const isHidden = field.type === 'hidden';
            const isEmployeeId = field.name === 'emp_id';
            const isClientId = field.name === 'client_id';
            const isRateField = [
                'rate_basis',
                'hourly_rate',
                'daily_rate',
                'monthly_rate'
            ].includes(field.name);

            field.classList.remove(
                'cursor-text',
                'cursor-pointer',
                'cursor-not-allowed'
            );

            if (isHidden || isClientId) {
                field.disabled = false;
                return;
            }

            if (isEmployeeId) {
                field.readOnly = true;
                field.disabled = false;
                field.classList.add('cursor-not-allowed');
                field.classList.add('opacity-60');
                return;
            }

            if (isRateField) {
                field.disabled = false;
                field.readOnly = !enabled;
                field.classList.add(
                    enabled
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                );
                field.classList.toggle(
                    'opacity-60',
                    !enabled
                );
                return;
            }

            if (isFile) {
                field.disabled = !enabled;
                field.classList.remove('opacity-60');
                field.classList.add('opacity-0');
                field.classList.add(
                    enabled
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                );
                return;
            }

            if (isCheckbox || isSelect) {
                field.disabled = !enabled;
                field.classList.add(
                    enabled
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                );
                field.classList.toggle(
                    'opacity-60',
                    !enabled
                );
                return;
            }

            field.disabled = false;
            field.readOnly = !enabled;
            field.classList.add(
                enabled
                    ? 'cursor-text'
                    : 'cursor-not-allowed'
            );
            field.classList.toggle(
                'opacity-60',
                !enabled
            );
        });

        if (clientInput) {
            clientInput.classList.remove(
                'cursor-text',
                'cursor-pointer',
                'cursor-not-allowed'
            );

            clientInput.disabled = !enabled;
            clientInput.readOnly = !enabled;

            clientInput.classList.toggle(
                'opacity-60',
                !enabled
            );

            clientInput.classList.add(
                enabled
                    ? 'cursor-text'
                    : 'cursor-not-allowed'
            );
        }

        updateRateFieldState();

        if (!enabled) {
            hideClientDropdown();
        }
    }

    function setSearchEnabled(enabled) {
        if (!searchInput) {
            return;
        }

        searchInput.classList.remove(
            'cursor-text',
            'cursor-pointer',
            'cursor-not-allowed'
        );

        searchInput.disabled = !enabled;

        searchInput.classList.toggle(
            'opacity-60',
            !enabled
        );

        searchInput.classList.add(
            enabled
                ? 'cursor-text'
                : 'cursor-not-allowed'
        );

        if (!enabled) {
            hideSearchResults();
        }
    }

    function setMode(newMode) {
        mode = newMode;

        if (newMode === 'view') {
            setFieldState(false);
            setSearchEnabled(true);
        }

        if (newMode === 'edit') {
            setFieldState(true);
            setSearchEnabled(false);
        }

        if (newMode === 'add') {
            setFieldState(true);
            setSearchEnabled(false);

            const employeeId = getField('emp_id');

            if (employeeId) {
                employeeId.value = '';
                employeeId.readOnly = true;
                employeeId.disabled = false;
                employeeId.classList.remove(
                    'cursor-text',
                    'cursor-pointer',
                    'cursor-not-allowed'
                );
                employeeId.classList.add(
                    'cursor-not-allowed'
                );
            }

            if (rateBasisField) {
                rateBasisField.value = 'Daily';
            }

            clearComputedRates();
            updateRateFieldState();
        }

        updateButtons();
        updateNavigationButtons();
    }

    function updateButtons() {
        if (mode === 'view') {
            employeeAddButton?.classList.remove('hidden');
            editButton?.classList.remove('hidden');

            employeeAddButton?.removeAttribute('disabled');

            if (currentEmployeeId) {
                editButton?.removeAttribute('disabled');
                editButton?.classList.remove(
                    'opacity-50',
                    'cursor-not-allowed'
                );
                editButton?.classList.add(
                    'cursor-pointer'
                );
            } else {
                editButton?.setAttribute(
                    'disabled',
                    'disabled'
                );
                editButton?.classList.add(
                    'opacity-50',
                    'cursor-not-allowed'
                );
                editButton?.classList.remove(
                    'cursor-pointer'
                );
            }

            saveButton?.classList.add('hidden');
            cancelButton?.classList.add('hidden');

            return;
        }

        employeeAddButton   ?.classList.add('hidden');
        editButton?.classList.add('hidden');
        saveButton?.classList.remove('hidden');
        cancelButton?.classList.remove('hidden');

        if (cancelButton) {
            cancelButton.classList.remove(
                'bg-gray-600',
                'hover:bg-gray-700'
            );
            cancelButton.classList.add(
                'bg-red-600',
                'hover:bg-red-700'
            );
        }
    }

    function updateCounter() {
        if (!employeeCounter) {
            return;
        }

        if (
            searchItems.length === 0 ||
            currentSearchIndex < 0
        ) {
            employeeCounter.textContent =
                searchItems.length > 0
                    ? `0 of ${searchItems.length}`
                    : '0 of 0';

            updateNavigationButtons();
            return;
        }

        employeeCounter.textContent =
            `${currentSearchIndex + 1} of ${searchItems.length}`;

        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const hasSelection =
            mode === 'view' &&
            currentSearchIndex >= 0 &&
            searchItems.length > 0;

        const canPrevious =
            hasSelection &&
            currentSearchIndex > 0;

        const canNext =
            hasSelection &&
            currentSearchIndex <
                searchItems.length - 1;

        if (previousButton) {
            previousButton.disabled = !canPrevious;
            previousButton.classList.toggle(
                'opacity-50',
                !canPrevious
            );
            previousButton.classList.toggle(
                'cursor-not-allowed',
                !canPrevious
            );
            previousButton.classList.toggle(
                'cursor-pointer',
                canPrevious
            );
        }

        if (nextButton) {
            nextButton.disabled = !canNext;
            nextButton.classList.toggle(
                'opacity-50',
                !canNext
            );
            nextButton.classList.toggle(
                'cursor-not-allowed',
                !canNext
            );
            nextButton.classList.toggle(
                'cursor-pointer',
                canNext
            );
        }
    }

    function saveOriginalData() {
        originalData = getFormDataObject();

        originalClientDisplayName =
            currentClientDisplayName;

        originalClientPayrollConfig =
            currentClientPayrollConfig
                ? { ...currentClientPayrollConfig }
                : null;
    }

    function restoreOriginalData() {
        Object.entries(originalData).forEach(
            ([key, value]) => {
                setFieldValue(key, value);
            }
        );

        currentClientPayrollConfig =
            originalClientPayrollConfig
                ? { ...originalClientPayrollConfig }
                : null;

        updateClientDisplay(
            originalClientDisplayName
        );

        if (clientIdDisplay) {
            clientIdDisplay.value =
                getField('client_id')?.value || '';
        }

        updateRateFieldState();
    }

    function hasChanges() {
        const currentData =
            getFormDataObject();

        return Object.keys(originalData).some(
            key => {
                return String(
                    originalData[key] ?? ''
                ) !== String(
                    currentData[key] ?? ''
                );
            }
        );
    }

    async function confirmCancel() {
        if (!hasChanges()) {
            return true;
        }

        const result = await Swal.fire({
            icon: 'question',
            title: 'Discard Changes?',
            text: 'Any unsaved changes will be lost.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Discard',
            cancelButtonText: 'Continue Editing',
            confirmButtonColor: '#dc2626'
        });

        return result.isConfirmed;
    }

    function updateHighlightedResult() {
        const results =
            searchList?.querySelectorAll(
                '[data-employee-id]'
            ) || [];

        results.forEach((result, index) => {
            const isHighlighted =
                index === highlightedIndex;

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
                searchInput?.setAttribute(
                    'aria-activedescendant',
                    result.id
                );

                result.scrollIntoView({
                    block: 'nearest'
                });
            }
        });

        if (highlightedIndex < 0) {
            searchInput?.removeAttribute(
                'aria-activedescendant'
            );
        }
    }

    function resetHighlightedResult() {
        highlightedIndex = -1;

        if (searchList) {
            searchList
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

        searchInput?.removeAttribute(
            'aria-activedescendant'
        );
    }

    function hideSearchResults() {
        if (!searchResults) {
            return;
        }

        searchResults.classList.add('hidden');

        searchInput?.setAttribute(
            'aria-expanded',
            'false'
        );

        resetHighlightedResult();
    }

    function showSearchResults() {
        if (!searchResults) {
            return;
        }

        searchResults.classList.remove('hidden');

        searchInput?.setAttribute(
            'aria-expanded',
            'true'
        );
    }

    function renderSearchResults() {
        if (!searchList || !searchResults) {
            return;
        }

        resetHighlightedResult();

        if (!searchItems.length) {
            searchList.innerHTML = `
                <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No employees found.
                </div>
            `;

            showSearchResults();
            return;
        }

        searchList.innerHTML =
            searchItems.map(
                (employee, index) => {
                    const fullName =
                        getEmployeeFullName(employee);

                    const displayName =
                        getEmployeeDisplayName(
                            employee
                        );

                    const clientName =
                        employee.client_name ||
                        employee.client?.client_name ||
                        '';

                    return `
                        <button
                            type="button"
                            id="employeeSearchOption${employee.emp_id}"
                            data-employee-id="${employee.emp_id}"
                            data-index="${index}"
                            role="option"
                            aria-selected="false"
                            class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <div class="font-medium text-sm text-gray-800 dark:text-white truncate">
                                        ${escapeHtml(fullName || displayName || 'Unnamed Employee')}
                                    </div>

                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ID: ${escapeHtml(employee.emp_id || '')}
                                        ${employee.badge_no ? ` • Badge: ${escapeHtml(employee.badge_no)}` : ''}
                                    </div>
                                </div>

                                ${clientName ? `
                                    <div class="text-xs text-gray-500 dark:text-gray-400 text-right shrink-0 max-w-[40%] truncate">
                                        ${escapeHtml(clientName)}
                                    </div>
                                ` : ''}
                            </div>
                        </button>
                    `;
                }
            ).join('');

        showSearchResults();

        searchList
            .querySelectorAll('[data-employee-id]')
            .forEach((button, index) => {
                button.addEventListener(
                    'mouseenter',
                    () => {
                        highlightedIndex = index;
                        updateHighlightedResult();
                    }
                );

                button.addEventListener(
                    'click',
                    async event => {
                        event.preventDefault();
                        event.stopPropagation();

                        currentSearchIndex = index;

                        await loadEmployee(
                            button.dataset.employeeId
                        );

                        hideSearchResults();
                        updateCounter();
                    }
                );
            });
    }

    async function searchEmployees(query) {
        const trimmedQuery =
            query.trim();

        resetHighlightedResult();

        if (!trimmedQuery) {
            searchItems = [];
            currentSearchIndex = -1;

            if (searchList) {
                searchList.innerHTML = '';
            }

            hideSearchResults();
            updateCounter();

            return;
        }

        try {
            const response = await fetch(
                `${API.search}?q=${encodeURIComponent(trimmedQuery)}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
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

            searchItems =
                Array.isArray(result.data)
                    ? result.data
                    : [];

            currentSearchIndex = -1;

            renderSearchResults();
            updateCounter();
        } catch (error) {
            console.error(
                'Employee search error:',
                error
            );

            searchItems = [];
            currentSearchIndex = -1;

            if (searchList) {
                searchList.innerHTML = `
                    <div class="px-4 py-3 text-sm text-red-500 dark:text-red-400">
                        Unable to search employees.
                    </div>
                `;

                showSearchResults();
            }

            updateCounter();
        }
    }

    async function loadEmployee(employeeId) {
        if (!employeeId) {
            return;
        }

        try {
            const response = await fetch(
                API.show(employeeId),
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to load employee.'
                );
            }

            const employee =
                result.data ||
                result.employee ||
                result;

            populateForm(employee);
            setMode('view');

            if (currentSearchIndex < 0) {
                const foundIndex =
                    searchItems.findIndex(
                        item =>
                            String(item.emp_id) ===
                            String(employee.emp_id)
                    );

                if (foundIndex >= 0) {
                    currentSearchIndex =
                        foundIndex;
                }
            }

            updateCounter();
        } catch (error) {
            console.error(
                'Employee load error:',
                error
            );

            await Swal.fire({
                icon: 'error',
                title: 'Unable to Load Employee',
                text:
                    error.message ||
                    'The employee information could not be loaded.'
            });
        }
    }

    async function navigateEmployee(direction) {
        if (
            mode !== 'view' ||
            searchItems.length === 0 ||
            currentSearchIndex < 0
        ) {
            return;
        }

        let nextIndex =
            currentSearchIndex;

        if (direction === 'next') {
            if (
                currentSearchIndex >=
                searchItems.length - 1
            ) {
                return;
            }

            nextIndex++;
        } else {
            if (
                currentSearchIndex <= 0
            ) {
                return;
            }

            nextIndex--;
        }

        const employee =
            searchItems[nextIndex];

        if (!employee?.emp_id) {
            return;
        }

        currentSearchIndex =
            nextIndex;

        await loadEmployee(
            employee.emp_id
        );

        updateCounter();
    }

    function renderClientResults(clients) {
        if (!clientList) {
            return;
        }

        if (!clients.length) {
            clientList.innerHTML = `
                <div class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    No companies found.
                </div>
            `;
            return;
        }

        clientList.innerHTML =
            clients.map(client => {
                const config =
                    client.payroll_config || {};

                return `
                    <button
                        type="button"
                        data-client-id="${escapeHtml(client.client_id)}"
                        data-client-name="${escapeHtml(client.client_name)}"
                        data-hours-per-day="${escapeHtml(config.hours_per_day ?? '')}"
                        data-working-days-per-month="${escapeHtml(config.working_days_per_month ?? '')}"
                        data-working-days-per-year="${escapeHtml(config.working_days_per_year ?? '')}"
                        class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-9 h-9 shrink-0 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                                <i class="fa-solid fa-building text-teal-600 dark:text-teal-400 text-sm"></i>
                            </div>

                            <div class="min-w-0">
                                <div class="text-sm font-medium text-gray-800 dark:text-white truncate">
                                    ${escapeHtml(client.client_name)}
                                </div>

                                <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    Client ID: ${escapeHtml(client.client_id)}
                                </div>
                            </div>
                        </div>
                    </button>
                `;
            }).join('');

        clientList
            .querySelectorAll('[data-client-id]')
            .forEach(button => {
                button.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();
                        event.stopPropagation();

                        selectClient(
                            button.dataset.clientId,
                            button.dataset.clientName,
                            {
                                hours_per_day:
                                    button.dataset.hoursPerDay,
                                working_days_per_month:
                                    button.dataset.workingDaysPerMonth,
                                working_days_per_year:
                                    button.dataset.workingDaysPerYear
                            }
                        );
                    }
                );
            });
    }

    async function loadClients(query = '') {
        if (!clientList) {
            return;
        }

        try {
            const trimmedQuery =
                query.trim();

            const url =
                trimmedQuery
                    ? `${API.clients}?q=${encodeURIComponent(trimmedQuery)}`
                    : API.clients;

            clientList.innerHTML = `
                <div class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                    Loading companies...
                </div>
            `;

            const response = await fetch(
                url,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to load companies.'
                );
            }

            const clients =
                Array.isArray(result.data)
                    ? result.data
                    : [];

            renderClientResults(clients);
        } catch (error) {
            console.error(
                'Failed to load clients:',
                error
            );

            clientList.innerHTML = `
                <div class="px-4 py-4 text-sm text-center text-red-500 dark:text-red-400">
                    Unable to load companies.
                </div>
            `;
        }
    }

    function showClientDropdown() {
        if (
            !clientDropdown ||
            !clientInput ||
            clientInput.disabled
        ) {
            return;
        }

        clientDropdown.classList.remove('hidden');
        clientIcon?.classList.add('rotate-180');
    }

    function hideClientDropdown() {
        if (!clientDropdown) {
            return;
        }

        clientDropdown.classList.add('hidden');
        clientIcon?.classList.remove('rotate-180');
    }

    function selectClient(
        clientId,
        clientName,
        payrollConfig = null
    ) {
        const clientField =
            getField('client_id');

        if (!clientField || !clientInput) {
            return;
        }

        clientField.value =
            clientId || '';

        clientField.disabled = false;

        clientInput.value =
            clientName || '';

        currentClientDisplayName =
            clientName || '';

        currentClientPayrollConfig =
            payrollConfig;

        if (clientIdDisplay) {
            clientIdDisplay.value =
                clientId || '';
        }

        clearComputedRates();
        updateRateFieldState();
        hideClientDropdown();
    }

    function handleClientSearchInput() {
        if (
            mode === 'view' ||
            clientInput?.disabled
        ) {
            return;
        }

        const clientField =
            getField('client_id');

        if (clientField) {
            clientField.value = '';
        }

        if (clientIdDisplay) {
            clientIdDisplay.value = '';
        }

        currentClientDisplayName = '';
        currentClientPayrollConfig = null;

        clearTimeout(clientSearchTimer);

        showClientDropdown();

        clientSearchTimer =
            setTimeout(() => {
                loadClients(
                    clientInput?.value || ''
                );
            }, 250);
    }

    async function handleClientInputFocus() {
        if (
            mode === 'view' ||
            clientInput?.disabled
        ) {
            return;
        }

        showClientDropdown();

        await loadClients(
            clientInput?.value || ''
        );
    }

    function handleClientInputKeydown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            hideClientDropdown();
        }
    }

    function clearComputedRates() {
        if (hourlyRateField) {
            hourlyRateField.value = '';
        }

        if (monthlyRateField) {
            monthlyRateField.value = '';
        }
    }

    function getPayrollConfig() {
        if (!currentClientPayrollConfig) {
            return null;
        }

        const hoursPerDay =
            Number(
                currentClientPayrollConfig.hours_per_day
            );

        const workingDaysPerMonth =
            Number(
                currentClientPayrollConfig.working_days_per_month
            );

        if (
            !Number.isFinite(hoursPerDay) ||
            !Number.isFinite(
                workingDaysPerMonth
            ) ||
            hoursPerDay <= 0 ||
            workingDaysPerMonth <= 0
        ) {
            return null;
        }

        return {
            hoursPerDay,
            workingDaysPerMonth
        };
    }

    function formatRate(value) {
        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return '';
        }

        return number.toFixed(2);
    }

    function updateRateFieldState() {
        const editable =
            mode === 'edit' ||
            mode === 'add';

        if (rateBasisField) {
            rateBasisField.value = 'Daily';
            rateBasisField.disabled =
                !editable;

            rateBasisField.classList.remove(
                'cursor-pointer',
                'cursor-not-allowed'
            );

            rateBasisField.classList.add(
                editable
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
            );

            rateBasisField.classList.toggle(
                'opacity-60',
                !editable
            );
        }

        if (dailyRateField) {
            dailyRateField.disabled = false;
            dailyRateField.readOnly =
                !editable;

            dailyRateField.classList.remove(
                'cursor-text',
                'cursor-not-allowed'
            );

            dailyRateField.classList.add(
                editable
                    ? 'cursor-text'
                    : 'cursor-not-allowed'
            );

            dailyRateField.classList.toggle(
                'opacity-60',
                !editable
            );
        }

        [
            hourlyRateField,
            monthlyRateField
        ].forEach(field => {
            if (!field) {
                return;
            }

            field.disabled = false;
            field.readOnly = true;

            field.classList.remove(
                'cursor-text',
                'cursor-not-allowed'
            );

            field.classList.add(
                'cursor-not-allowed'
            );

            field.classList.add(
                'opacity-60'
            );
        });
    }

    function calculateRates(showError = true) {
        const dailyRate =
            Number(
                dailyRateField?.value
            );

        if (
            !Number.isFinite(dailyRate) ||
            dailyRate <= 0
        ) {
            if (hourlyRateField) {
                hourlyRateField.value = '';
            }

            if (monthlyRateField) {
                monthlyRateField.value = '';
            }

            return false;
        }

        const config =
            getPayrollConfig();

        if (!config) {
            if (hourlyRateField) {
                hourlyRateField.value = '';
            }

            if (monthlyRateField) {
                monthlyRateField.value = '';
            }

            if (showError) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Payroll Configuration Required',
                    text: 'Assign a client with payroll config before entering a rate.',
                    confirmButtonColor: '#0a5d3c'
                });
            }

            return false;
        }

        const hourlyRate =
            dailyRate /
            config.hoursPerDay;

        const monthlyRate =
            dailyRate *
            config.workingDaysPerMonth;

        if (hourlyRateField) {
            hourlyRateField.value =
                formatRate(hourlyRate);
        }

        if (monthlyRateField) {
            monthlyRateField.value =
                formatRate(monthlyRate);
        }

        return true;
    }

    function handleRateBasisChange() {
        if (
            mode !== 'edit' &&
            mode !== 'add'
        ) {
            return;
        }

        if (rateBasisField) {
            rateBasisField.value =
                'Daily';
        }

        updateRateFieldState();
    }

    function handleDailyRateBlur() {
        if (
            mode !== 'edit' &&
            mode !== 'add'
        ) {
            return;
        }

        calculateRates(true);
    }

    function buildFormData() {
        const data =
            new FormData();

        getFields().forEach(field => {
            if (
                !field.name ||
                field.name === 'emp_id'
            ) {
                return;
            }

            if (
                field.name ===
                'profile_photo'
            ) {
                if (
                    field.files &&
                    field.files.length > 0
                ) {
                    data.append(
                        'profile_photo',
                        field.files[0]
                    );
                }

                return;
            }

            if (
                field.type === 'checkbox'
            ) {
                data.append(
                    field.name,
                    field.checked
                        ? '1'
                        : '0'
                );

                return;
            }

            data.append(
                field.name,
                field.value ?? ''
            );
        });

        return data;
    }

    async function saveEmployee() {
        const firstName =
            getField('first_name')
                ?.value.trim();

        const lastName =
            getField('last_name')
                ?.value.trim();

        if (!firstName || !lastName) {
            await Swal.fire({
                icon: 'warning',
                title: 'Required Fields',
                text: 'First Name and Last Name are required.',
                confirmButtonColor: '#0a5d3c'
            });

            return;
        }

        const isNew =
            mode === 'add';

        if (
            !getField('client_id')
                ?.value
        ) {
            await Swal.fire({
                icon: 'warning',
                title: 'Company Required',
                text: 'Please assign a company with payroll configuration before entering a rate.',
                confirmButtonColor: '#0a5d3c'
            });

            return;
        }

        if (
            !dailyRateField?.value
        ) {
            await Swal.fire({
                icon: 'warning',
                title: 'Daily Rate Required',
                text: 'Please enter the Daily Rate.',
                confirmButtonColor: '#0a5d3c'
            });

            dailyRateField?.focus();

            return;
        }

        if (!calculateRates(true)) {
            return;
        }

        if (rateBasisField) {
            rateBasisField.value =
                'Daily';
        }

        const csrfToken =
            document.querySelector(
                'meta[name="csrf-token"]'
            )?.getAttribute('content');

        if (!csrfToken) {
            await Swal.fire({
                icon: 'error',
                title: 'Security Token Missing',
                text: 'CSRF token was not found. Please refresh the page.'
            });

            return;
        }

        const confirmation =
            await Swal.fire({
                icon: 'question',
                title: isNew
                    ? 'Add Employee?'
                    : 'Save Changes?',
                text: isNew
                    ? 'The new employee record will be created.'
                    : 'The employee information will be updated.',
                showCancelButton: true,
                confirmButtonText: isNew
                    ? 'Add Employee'
                    : 'Save Changes',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                confirmButtonColor: '#0a5d3c'
            });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            const employeeId =
                currentEmployeeId;

            const url = isNew
                ? API.store
                : API.update(employeeId);

            const formData =
                buildFormData();

            if (!isNew) {
                formData.append(
                    '_method',
                    'PUT'
                );
            }

            const response =
                await fetch(
                    url,
                    {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN':
                                csrfToken,
                            'X-Requested-With':
                                'XMLHttpRequest',
                            'Accept':
                                'application/json'
                        },
                        credentials:
                            'same-origin',
                        body: formData
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                if (
                    response.status === 422 &&
                    result.errors
                ) {
                    const messages =
                        Object.values(
                            result.errors
                        )
                            .flat()
                            .join('\n');

                    throw new Error(
                        messages
                    );
                }

                throw new Error(
                    result.message ||
                    'Unable to save employee.'
                );
            }

            const employee =
                result.data ||
                result.employee ||
                result;

            populateForm(employee);
            setMode('view');
            saveOriginalData();

            if (isNew) {
                searchItems = [
                    employee
                ];

                currentSearchIndex = 0;
            } else {
                const existingIndex =
                    searchItems.findIndex(
                        item =>
                            String(
                                item.emp_id
                            ) ===
                            String(
                                employee.emp_id
                            )
                    );

                if (
                    existingIndex >= 0
                ) {
                    searchItems[
                        existingIndex
                    ] = employee;

                    currentSearchIndex =
                        existingIndex;
                }
            }

            if (searchInput) {
                searchInput.value =
                    getEmployeeDisplayName(
                        employee
                    );
            }

            hideSearchResults();
            updateCounter();

            await Swal.fire({
                icon: 'success',
                title: isNew
                    ? 'Employee Added'
                    : 'Employee Updated',
                text: isNew
                    ? 'Employee record added successfully.'
                    : 'Employee record updated successfully.',
                timer: 1800,
                showConfirmButton: false
            });

            showListingView();

            const listSearch =
                employeeListSearch?.value ||
                '';

            await loadEmployeeList(
                listSearch,
                employeeListPage
            );
        } catch (error) {
            console.error(
                'Employee save error:',
                error
            );

            await Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text:
                    error.message ||
                    'Unable to save employee information.'
            });
        }
    }

    async function startAdd() {
        clearForm();

        searchItems = [];
        currentSearchIndex = -1;
        highlightedIndex = -1;

        if (searchInput) {
            searchInput.value = '';
        }

        hideSearchResults();

        showFormView();
        setMode('add');

        getField('first_name')
            ?.focus({
                preventScroll: true
            });
    }

    async function startEdit() {
        if (!currentEmployeeId) {
            return;
        }

        originalData =
            getFormDataObject();

        originalClientDisplayName =
            currentClientDisplayName;

        originalClientPayrollConfig =
            currentClientPayrollConfig
                ? {
                    ...currentClientPayrollConfig
                }
                : null;

        setMode('edit');
    }

    async function cancelAction() {
        const confirmed =
            await confirmCancel();

        if (!confirmed) {
            return;
        }

        if (
            mode === 'edit' &&
            currentEmployeeId
        ) {
            restoreOriginalData();

            if (profileInput) {
                profileInput.value = '';
            }

            setMode('view');
            saveOriginalData();

            return;
        }

        clearForm();

        searchItems = [];
        currentSearchIndex = -1;
        highlightedIndex = -1;

        if (searchInput) {
            searchInput.value = '';
        }

        hideSearchResults();

        setMode('view');
        saveOriginalData();
    }

    function handleSearchInput() {
        if (mode !== 'view') {
            return;
        }

        clearTimeout(searchTimer);

        highlightedIndex = -1;

        searchInput?.removeAttribute(
            'aria-activedescendant'
        );

        const query =
            searchInput?.value || '';

        searchTimer =
            setTimeout(() => {
                searchEmployees(query);
            }, 300);
    }

    function handleSearchFocus() {
        if (mode !== 'view') {
            return;
        }

        if (
            searchInput?.value.trim()
        ) {
            searchEmployees(
                searchInput.value
            );
        }
    }

    async function handleSearchKeydown(event) {
        if (mode !== 'view') {
            return;
        }

        const results =
            searchList?.querySelectorAll(
                '[data-employee-id]'
            ) || [];

        if (event.key === 'Escape') {
            event.preventDefault();
            hideSearchResults();
            return;
        }

        if (!results.length) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            showSearchResults();

            highlightedIndex++;

            if (
                highlightedIndex >=
                results.length
            ) {
                highlightedIndex = 0;
            }

            updateHighlightedResult();

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            showSearchResults();

            highlightedIndex--;

            if (highlightedIndex < 0) {
                highlightedIndex =
                    results.length - 1;
            }

            updateHighlightedResult();

            return;
        }

        if (
            event.key === 'Enter'
        ) {
            if (
                highlightedIndex >= 0
            ) {
                event.preventDefault();

                const selectedResult =
                    results[
                        highlightedIndex
                    ];

                currentSearchIndex =
                    Number(
                        selectedResult
                            .dataset
                            .index
                    );

                await loadEmployee(
                    selectedResult
                        .dataset
                        .employeeId
                );

                hideSearchResults();
                updateCounter();
            }
        }
    }

    function handleListSearchKeydown(event) {
        if (
            event.key === 'Escape'
        ) {
            event.preventDefault();

            if (employeeListSearchResults) {
                employeeListSearchResults.classList.add(
                    'hidden'
                );
            }
        }
    }

    async function handleBackToList(event) {
        event?.preventDefault();
        event?.stopPropagation();

        if (mode === 'edit' || mode === 'add') {
            const confirmed =
                await confirmCancel();

            if (!confirmed) {
                return;
            }
        }

        clearForm();

        searchItems = [];
        currentSearchIndex = -1;
        highlightedIndex = -1;

        if (searchInput) {
            searchInput.value = '';
        }

        hideSearchResults();

        setMode('view');
        saveOriginalData();

        showListingView();
    }



    form.addEventListener(
        'submit',
        event => {
            event.preventDefault();
        }
    );

    searchInput?.setAttribute(
        'role',
        'combobox'
    );

    searchInput?.setAttribute(
        'aria-autocomplete',
        'list'
    );

    searchInput?.setAttribute(
        'aria-expanded',
        'false'
    );

    searchInput?.setAttribute(
        'aria-controls',
        'employeeSearchList'
    );

    searchList?.setAttribute(
        'role',
        'listbox'
    );

    employeeListSearch?.addEventListener(
        'input',
        handleEmployeeListSearch
    );

    employeeListSearch?.addEventListener(
        'keydown',
        handleListSearchKeydown
    );

    employeeSortButton?.addEventListener(
        'click',
    event => {
        event.preventDefault();
        event.stopPropagation();

        const existingMenu =
            panel.querySelector('#employeeSortMenu');

        if (existingMenu) {
            closeEmployeeSortMenu();
            return;
        }

        createEmployeeSortMenu();
        }
    );

    searchInput?.addEventListener(
        'input',
        handleSearchInput
    );

    searchInput?.addEventListener(
        'focus',
        handleSearchFocus
    );

    searchInput?.addEventListener(
        'keydown',
        handleSearchKeydown
    );

    clientInput?.addEventListener(
        'input',
        handleClientSearchInput
    );

    clientInput?.addEventListener(
        'focus',
        handleClientInputFocus
    );

    clientInput?.addEventListener(
        'keydown',
        handleClientInputKeydown
    );

    rateBasisField?.addEventListener(
        'change',
        handleRateBasisChange
    );

    dailyRateField?.addEventListener(
        'blur',
        handleDailyRateBlur
    );

    document.addEventListener(
        'click',
        event => {
            if (!panel.contains(event.target)) {
                return;
            }

            if (
                searchResults &&
                !searchResults.contains(event.target) &&
                event.target !== searchInput
            ) {
                hideSearchResults();
            }

            if (
                clientDropdown &&
                !clientDropdown.contains(event.target) &&
                event.target !== clientInput
            ) {
                hideClientDropdown();
            }

            if (
                employeeListSearchResults &&
                !employeeListSearchResults.contains(event.target) &&
                event.target !== employeeListSearch
            ) {
                employeeListSearchResults.classList.add(
                    'hidden'
                );
            }
            const employeeSortMenu =
                event.target.closest(
                    '#employeeSortMenu'
                );

            const employeeSortButtonTarget =
                event.target.closest(
                    '#employeeSortButton'
                );

            if (
                !employeeSortMenu &&
                !employeeSortButtonTarget
            ) {
                closeEmployeeSortMenu();
            }

            const employeeContextMenu =
                event.target.closest(
                    '.employee-context-menu'
                );

            const employeeContextButton =
                event.target.closest(
                    '.employee-context-button'
                );

            if (
                !employeeContextMenu &&
                !employeeContextButton
            ) {
                employeeList
                    ?.querySelectorAll(
                        '.employee-context-menu'
                    )
                    .forEach(menu => {
                        menu.classList.add('hidden');
                    });

                employeeList
                    ?.querySelectorAll(
                        '.employee-context-button'
                    )
                    .forEach(button => {
                        button.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    });
            }
        }
    );

    employeeAddButton?.addEventListener(
        'click',
        startAdd
    );

    employeeBackButton?.addEventListener(
        'click',
        handleBackToList
    );

    editButton?.addEventListener(
        'click',
        startEdit
    );

    saveButton?.addEventListener(
        'click',
        saveEmployee
    );

    cancelButton?.addEventListener(
        'click',
        cancelAction
    );

    previousButton?.addEventListener(
        'click',
        () => {
            navigateEmployee(
                'previous'
            );
        }
    );

    nextButton?.addEventListener(
        'click',
        () => {
            navigateEmployee(
                'next'
            );
        }
    );

    employeePreviousPageButton?.addEventListener(
        'click',
        () => {
            if (employeeListPage > 1) {
                loadEmployeeList(
                    employeeListSearch?.value ||
                    '',
                    employeeListPage - 1
                );
            }
        }
    );

    employeeNextPageButton?.addEventListener(
        'click',
        () => {
            if (
                employeeListPage <
                employeeListLastPage
            ) {
                loadEmployeeList(
                    employeeListSearch?.value ||
                    '',
                    employeeListPage + 1
                );
            }
        }
    );

    profileInput?.addEventListener(
        'change',
        () => {
            if (
                !profileInput.files?.length ||
                !profilePreview
            ) {
                return;
            }

            const file =
                profileInput.files[0];

            if (
                !file.type.startsWith(
                    'image/'
                )
            ) {
                profileInput.value = '';

                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid File',
                    text: 'Please select an image file.'
                });

                return;
            }

            const reader =
                new FileReader();

            reader.onload = event => {
                profilePreview.src =
                    event.target.result;

                profilePreview.classList.remove(
                    'hidden'
                );
            };

            reader.readAsDataURL(file);
        }
    );
    

clearForm();
setMode('view');
saveOriginalData();
showListingView();

await loadEmployeeList('', 1);
}

