export function closeEmployeeSortMenu(ctx) {
    ctx.dom.employeeSortButton
        ?.parentElement
        ?.querySelector('#employeeSortMenu')
        ?.remove();

    ctx.dom.employeeSortButton?.setAttribute('aria-expanded', 'false');
}

export function createEmployeeSortMenu(ctx) {
    ctx.closeEmployeeSortMenu();

    if (!ctx.dom.employeeSortButton) {
        return;
    }

    if (!ctx.state.employeeStatus) {
        ctx.state.employeeStatus = 'active';
    }

    if (!ctx.state.employeeSort) {
        ctx.state.employeeSort = 'name';
    }

    if (!ctx.state.employeeSortDirection) {
        ctx.state.employeeSortDirection = 'asc';
    }

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
        active = false,
        icon = ''
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
            <span class="flex items-center gap-3">
                <i class="${icon} w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                <span>${ctx.escapeHtml(label)}</span>
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
        <span class="flex items-center gap-3">
            <i class="fa-solid fa-circle-half-stroke w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
            <span>Status</span>
        </span>
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
        {
            label: 'Active',
            value: 'active',
            icon: 'fa-solid fa-circle-check'
        },
        {
            label: 'Archive',
            value: 'archive',
            icon: 'fa-solid fa-box-archive'
        }
    ];

    statusOptions.forEach(option => {
        statusMenu.appendChild(
            createMenuButton(
                option.label,
                () => {
                    ctx.state.employeeStatus = option.value;
                    ctx.state.employeeListPage = 1;

                    ctx.closeEmployeeSortMenu();

                    ctx.loadEmployeeList(
                        ctx.dom.employeeListSearch?.value || '',
                        1
                    );
                },
                ctx.state.employeeStatus === option.value,
                option.icon
            )
        );
    });

    statusWrapper.appendChild(statusButton);
    statusWrapper.appendChild(statusMenu);

    statusWrapper.addEventListener('mouseenter', () => {
        statusMenu.classList.remove('hidden');
    });

    statusWrapper.addEventListener('mouseleave', () => {
        statusMenu.classList.add('hidden');
    });

    statusButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        statusMenu.classList.toggle('hidden');
    });

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
                ctx.state.employeeSort = 'name';
                ctx.state.employeeSortDirection = 'asc';
                ctx.state.employeeListPage = 1;

                ctx.closeEmployeeSortMenu();

                ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value || '',
                    1
                );
            },
            ctx.state.employeeSort === 'name' &&
            ctx.state.employeeSortDirection === 'asc',
            'fa-solid fa-arrow-down-a-z'
        )
    );

    // =========================================================
    // LATEST TO OLDEST
    // =========================================================

    menu.appendChild(
        createMenuButton(
            'Latest to Oldest',
            () => {
                ctx.state.employeeSort = 'latest';
                ctx.state.employeeSortDirection = 'desc';
                ctx.state.employeeListPage = 1;

                ctx.closeEmployeeSortMenu();

                ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value || '',
                    1
                );
            },
            ctx.state.employeeSort === 'latest' &&
            ctx.state.employeeSortDirection === 'desc',
            'fa-solid fa-arrow-down-wide-short'
        )
    );

    // =========================================================
    // OLDEST TO LATEST
    // =========================================================

    menu.appendChild(
        createMenuButton(
            'Oldest to Latest',
            () => {
                ctx.state.employeeSort = 'oldest';
                ctx.state.employeeSortDirection = 'asc';
                ctx.state.employeeListPage = 1;

                ctx.closeEmployeeSortMenu();

                ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value || '',
                    1
                );
            },
            ctx.state.employeeSort === 'oldest' &&
            ctx.state.employeeSortDirection === 'asc',
            'fa-solid fa-arrow-up-wide-short'
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
        <span class="flex items-center gap-3">
            <i class="fa-solid fa-arrow-down-a-z w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
            <span>By Letter</span>
        </span>
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
        {
            label: 'A to Z',
            direction: 'asc',
            icon: 'fa-solid fa-arrow-down-a-z'
        },
        {
            label: 'Z to A',
            direction: 'desc',
            icon: 'fa-solid fa-arrow-up-z-a'
        }
    ];

    letterOptions.forEach(option => {
        letterMenu.appendChild(
            createMenuButton(
                option.label,
                () => {
                    ctx.state.employeeSort = 'letter';
                    ctx.state.employeeSortDirection = option.direction;
                    ctx.state.employeeListPage = 1;

                    ctx.closeEmployeeSortMenu();

                    ctx.loadEmployeeList(
                        ctx.dom.employeeListSearch?.value || '',
                        1
                    );
                },
                ctx.state.employeeSort === 'letter' &&
                ctx.state.employeeSortDirection === option.direction,
                option.icon
            )
        );
    });

    letterWrapper.appendChild(letterButton);
    letterWrapper.appendChild(letterMenu);

    letterWrapper.addEventListener('mouseenter', () => {
        letterMenu.classList.remove('hidden');
    });

    letterWrapper.addEventListener('mouseleave', () => {
        letterMenu.classList.add('hidden');
    });

    letterButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        letterMenu.classList.toggle('hidden');
    });

    menu.appendChild(letterWrapper);

    // =========================================================
    // APPEND MENU
    // =========================================================

    const parent =
        ctx.dom.employeeSortButton.parentElement;

    if (!parent) {
        return;
    }

    if (getComputedStyle(parent).position === 'static') {
        parent.classList.add('relative');
    }

    parent.appendChild(menu);

    ctx.dom.employeeSortButton.setAttribute(
        'aria-expanded',
        'true'
    );
}

