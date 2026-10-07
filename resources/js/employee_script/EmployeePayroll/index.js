export function init(panel) {
    const payrollClientListView =
        panel.querySelector('#payrollClientListView');

    const payrollCutoffListView =
        panel.querySelector('#payrollCutoffListView');

    const payrollTransactionView =
        panel.querySelector('#payrollTransactionView');

    const employeeBackButton =
        panel.querySelector('#employeeBackButton');

    const payrollTransactionBackButton =
        panel.querySelector('#payrollTransactionBackButton');

    const payrollClientCards =
        panel.querySelectorAll('.payroll-client-card');

    const payrollCutoffCards =
        panel.querySelectorAll('.payroll-cutoff-card');

    const payrollEmployeeRows =
        panel.querySelectorAll('.payroll-employee-row');

    const selectedEmployeePayrollCard =
        panel.querySelector('#selectedEmployeePayrollCard');

    const payrollEmployeeSearch =
        panel.querySelector('#payrollEmployeeSearch');

    const payrollEmployeeSortButton =
        panel.querySelector('#payrollEmployeeSortButton');

    const payrollSaveButton =
        panel.querySelector('#payrollSaveButton');

    if (
        !payrollClientListView ||
        !payrollCutoffListView ||
        !payrollTransactionView
    ) {
        return;
    }

    // =========================================================
    // PAYROLL EMPLOYEE STATE
    // =========================================================

    let payrollEmployeeStatus = 'all';
    let payrollEmployeeSort = 'name';
    let payrollEmployeeSortDirection = 'asc';

    // =========================================================
    // CLOSE SORT MENU
    // =========================================================

    const closePayrollEmployeeSortMenu = () => {
        const existingMenu =
            panel.querySelector('#payrollEmployeeSortMenu');

        if (existingMenu) {
            existingMenu.remove();
        }

        payrollEmployeeSortButton?.setAttribute(
            'aria-expanded',
            'false'
        );
    };

    // =========================================================
    // EMPLOYEE ROW DATA
    // =========================================================

    const getEmployeeRowData = (employeeRow) => {
        const cells = employeeRow.querySelectorAll('td');

        const employeeId =
            employeeRow.dataset.employeeId ||
            cells[0]?.textContent.trim() ||
            '';

        const employeeName =
            cells[1]?.textContent.trim() ||
            '';

        const employeeType =
            cells[2]?.textContent.trim() ||
            '';

        const status =
            cells[3]?.textContent.trim().toLowerCase() ||
            '';

        return {
            row: employeeRow,
            employeeId,
            employeeName,
            employeeType,
            status
        };
    };

    // =========================================================
    // APPLY EMPLOYEE FILTER / SORT
    // =========================================================

    const applyPayrollEmployeeFilter = () => {
        const searchValue =
            payrollEmployeeSearch?.value
                ?.trim()
                .toLowerCase() || '';

        const employees = Array.from(
            payrollEmployeeRows
        ).map(getEmployeeRowData);

        employees.forEach(employee => {
            const matchesSearch =
                !searchValue ||
                employee.employeeId
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.employeeName
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.employeeType
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                payrollEmployeeStatus === 'all' ||
                employee.status === payrollEmployeeStatus;

            employee.row.classList.toggle(
                'hidden',
                !(matchesSearch && matchesStatus)
            );
        });

        // =====================================================
        // SORT VISIBLE EMPLOYEES
        // =====================================================

        const employeeContainer =
            payrollEmployeeRows[0]?.parentElement;

        if (!employeeContainer) {
            return;
        }

        const visibleEmployees = employees.filter(employee => {
            const searchMatches =
                !searchValue ||
                employee.employeeId
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.employeeName
                    .toLowerCase()
                    .includes(searchValue) ||
                employee.employeeType
                    .toLowerCase()
                    .includes(searchValue);

            const statusMatches =
                payrollEmployeeStatus === 'all' ||
                employee.status === payrollEmployeeStatus;

            return searchMatches && statusMatches;
        });

        visibleEmployees.sort((a, b) => {
            const nameA =
                a.employeeName.toLowerCase();

            const nameB =
                b.employeeName.toLowerCase();

            if (nameA < nameB) {
                return payrollEmployeeSortDirection === 'asc'
                    ? -1
                    : 1;
            }

            if (nameA > nameB) {
                return payrollEmployeeSortDirection === 'asc'
                    ? 1
                    : -1;
            }

            return 0;
        });

        visibleEmployees.forEach(employee => {
            employeeContainer.appendChild(
                employee.row
            );
        });
    };

    // =========================================================
    // CREATE MENU BUTTON
    // =========================================================

    const createMenuButton = (
        label,
        onClick,
        active = false,
        icon = ''
    ) => {
        const button =
            document.createElement('button');

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
            <span class="flex items-center gap-3">
                <i class="${icon} w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                <span>${label}</span>
            </span>

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
    // CREATE SORT MENU
    // =========================================================

    const createPayrollEmployeeSortMenu = () => {
        closePayrollEmployeeSortMenu();

        if (!payrollEmployeeSortButton) {
            return;
        }

        const menu =
            document.createElement('div');

        menu.id = 'payrollEmployeeSortMenu';

        menu.className = [
            'absolute',
            'right-0',
            'top-full',
            'mt-2',
            'w-48',
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

        // =====================================================
        // STATUS
        // =====================================================

        const statusWrapper =
            document.createElement('div');

        statusWrapper.className =
            'relative';

        const statusButton =
            document.createElement('button');

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
            <span class="flex items-center gap-3">
                <i class="fa-solid fa-circle-half-stroke w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                <span>Status</span>
            </span>

            <i class="fa-solid fa-chevron-left text-[10px] text-gray-400"></i>
        `;

        const statusMenu =
            document.createElement('div');

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

        // =====================================================
        // STATUS OPTIONS
        // =====================================================

        const statusOptions = [
            {
                label: 'Done',
                value: 'done',
                icon: 'fa-solid fa-circle-check'
            },
            {
                label: 'Pending',
                value: 'pending',
                icon: 'fa-solid fa-clock'
            }
        ];

        statusOptions.forEach(option => {
            statusMenu.appendChild(
                createMenuButton(
                    option.label,
                    () => {
                        payrollEmployeeStatus =
                            option.value;

                        closePayrollEmployeeSortMenu();

                        applyPayrollEmployeeFilter();
                    },
                    payrollEmployeeStatus ===
                        option.value,
                    option.icon
                )
            );
        });

        statusWrapper.appendChild(
            statusButton
        );

        statusWrapper.appendChild(
            statusMenu
        );

        statusWrapper.addEventListener(
            'mouseenter',
            () => {
                statusMenu.classList.remove(
                    'hidden'
                );
            }
        );

        statusWrapper.addEventListener(
            'mouseleave',
            () => {
                statusMenu.classList.add(
                    'hidden'
                );
            }
        );

        statusButton.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();

                statusMenu.classList.toggle(
                    'hidden'
                );
            }
        );

        menu.appendChild(statusWrapper);

        // =====================================================
        // DIVIDER
        // =====================================================

        const divider =
            document.createElement('div');

        divider.className =
            'my-1 border-t border-gray-100 dark:border-gray-600';

        menu.appendChild(divider);

        // =====================================================
        // A TO Z
        // =====================================================

        menu.appendChild(
            createMenuButton(
                'A to Z',
                () => {
                    payrollEmployeeSort =
                        'name';

                    payrollEmployeeSortDirection =
                        'asc';

                    closePayrollEmployeeSortMenu();

                    applyPayrollEmployeeFilter();
                },
                payrollEmployeeSort === 'name' &&
                    payrollEmployeeSortDirection ===
                        'asc',
                'fa-solid fa-arrow-down-a-z'
            )
        );

        // =====================================================
        // Z TO A
        // =====================================================

        menu.appendChild(
            createMenuButton(
                'Z to A',
                () => {
                    payrollEmployeeSort =
                        'name';

                    payrollEmployeeSortDirection =
                        'desc';

                    closePayrollEmployeeSortMenu();

                    applyPayrollEmployeeFilter();
                },
                payrollEmployeeSort === 'name' &&
                    payrollEmployeeSortDirection ===
                        'desc',
                'fa-solid fa-arrow-up-z-a'
            )
        );

        // =====================================================
        // APPEND MENU
        // =====================================================

        const parent =
            payrollEmployeeSortButton.parentElement;

        if (!parent) {
            return;
        }

        if (
            getComputedStyle(parent).position ===
            'static'
        ) {
            parent.classList.add('relative');
        }

        parent.appendChild(menu);

        payrollEmployeeSortButton.setAttribute(
            'aria-expanded',
            'true'
        );
    };

    // =========================================================
    // SORT BUTTON
    // =========================================================

    if (payrollEmployeeSortButton) {
        payrollEmployeeSortButton.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();

                const existingMenu =
                    panel.querySelector(
                        '#payrollEmployeeSortMenu'
                    );

                if (existingMenu) {
                    closePayrollEmployeeSortMenu();
                } else {
                    createPayrollEmployeeSortMenu();
                }
            }
        );
    }

    // =========================================================
    // CLOSE SORT MENU WHEN CLICKING OUTSIDE
    // =========================================================

    document.addEventListener(
        'click',
        event => {
            if (
                payrollEmployeeSortButton &&
                !payrollEmployeeSortButton.contains(
                    event.target
                ) &&
                !panel
                    .querySelector(
                        '#payrollEmployeeSortMenu'
                    )
                    ?.contains(event.target)
            ) {
                closePayrollEmployeeSortMenu();
            }
        }
    );

    // =========================================================
    // EMPLOYEE SEARCH
    // =========================================================

    if (payrollEmployeeSearch) {
        payrollEmployeeSearch.addEventListener(
            'input',
            () => {
                applyPayrollEmployeeFilter();
            }
        );
    }

    // =========================================================
    // CLIENT → CUTOFF
    // =========================================================

    payrollClientCards.forEach(clientCard => {
        clientCard.addEventListener(
            'click',
            () => {
                payrollClientListView.classList.add(
                    'hidden'
                );

                payrollCutoffListView.classList.remove(
                    'hidden'
                );

                payrollTransactionView.classList.add(
                    'hidden'
                );
            }
        );
    });

    // =========================================================
    // CUTOFF → PAYROLL TRANSACTION
    // =========================================================

    payrollCutoffCards.forEach(cutoffCard => {
        cutoffCard.addEventListener(
            'click',
            () => {
                payrollCutoffListView.classList.add(
                    'hidden'
                );

                payrollTransactionView.classList.remove(
                    'hidden'
                );

                if (selectedEmployeePayrollCard) {
                    selectedEmployeePayrollCard.classList.add(
                        'hidden'
                    );
                }

                applyPayrollEmployeeFilter();

                panel.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        );
    });

    // =========================================================
    // CUTOFF → CLIENT LIST
    // =========================================================

    if (employeeBackButton) {
        employeeBackButton.addEventListener(
            'click',
            () => {
                payrollCutoffListView.classList.add(
                    'hidden'
                );

                payrollClientListView.classList.remove(
                    'hidden'
                );

                payrollTransactionView.classList.add(
                    'hidden'
                );

                closePayrollEmployeeSortMenu();
            }
        );
    }

    // =========================================================
    // PAYROLL TRANSACTION → CUTOFF
    // =========================================================

    if (payrollTransactionBackButton) {
        payrollTransactionBackButton.addEventListener(
            'click',
            () => {
                payrollTransactionView.classList.add(
                    'hidden'
                );

                payrollCutoffListView.classList.remove(
                    'hidden'
                );

                if (selectedEmployeePayrollCard) {
                    selectedEmployeePayrollCard.classList.add(
                        'hidden'
                    );
                }

                closePayrollEmployeeSortMenu();
            }
        );
    }

    // =========================================================
    // SELECT EMPLOYEE
    // =========================================================

    payrollEmployeeRows.forEach(employeeRow => {
        employeeRow.addEventListener(
            'click',
            () => {
                if (selectedEmployeePayrollCard) {
                    selectedEmployeePayrollCard.classList.remove(
                        'hidden'
                    );

                    selectedEmployeePayrollCard.scrollIntoView(
                        {
                            behavior: 'smooth',
                            block: 'start'
                        }
                    );
                }
            }
        );
    });

    // =========================================================
    // SAVE PAYROLL
    // =========================================================

    if (payrollSaveButton) {
        payrollSaveButton.addEventListener(
            'click',
            () => {
                panel.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        );
    }

    // =========================================================
    // INITIAL EMPLOYEE LIST
    // =========================================================

    applyPayrollEmployeeFilter();
}