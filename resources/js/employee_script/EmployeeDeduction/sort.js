// resources/js/employee_script/EmployeeDeduction/sort.js

export function closeDeductionSortMenu(panel) {
    panel.querySelector('#deductionSortMenu')?.remove();
    panel.querySelector('#btnSortDeduction')?.setAttribute('aria-expanded', 'false');
}

export function createDeductionSortMenu(panel, state, onSortChange) {
    const existingMenu = panel.querySelector('#deductionSortMenu');

    // Kapag bukas na, isara at huwag nang gumawa ulit.
    if (existingMenu) {
        closeDeductionSortMenu(panel);
        return;
    }

    const sortButton = panel.querySelector('#btnSortDeduction');
    if (!sortButton) return;

    // Gumawa ng container
    const menu = document.createElement('div');
    menu.id = 'deductionSortMenu';
    menu.className = [
        'absolute', 'right-0', 'top-full', 'mt-2', 'w-56', 'z-50',
        'bg-white', 'dark:bg-gray-700', 'border', 'border-gray-200',
        'dark:border-gray-600', 'rounded-lg', 'shadow-lg', 'py-1'
    ].join(' ');

    const parent = sortButton.parentElement;
    if (getComputedStyle(parent).position === 'static') {
        parent.classList.add('relative');
    }

    parent.appendChild(menu);
    sortButton.setAttribute('aria-expanded', 'true');

    // Helper function para sa menu buttons
    const createMenuButton = (label, onClick, active = false, icon = '') => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = [
            'w-full', 'flex', 'items-center', 'justify-between', 'px-3', 'py-2',
            'text-sm', 'text-left', 'text-gray-700', 'dark:text-gray-200',
            'hover:bg-gray-50', 'dark:hover:bg-gray-600', 'transition-colors', 'cursor-pointer'
        ].join(' ');

        button.innerHTML = `
            <span class="flex items-center gap-3">
                <i class="${icon} w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
                <span>${label}</span>
            </span>
            ${active ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
        `;

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            onClick();
        });

        return button;
    };

    // 1. Latest Start Date
    menu.appendChild(createMenuButton('Latest Start Date', () => {
        state.deductionSort = 'start_date';
        state.deductionSortDirection = 'desc';
        closeDeductionSortMenu(panel);
        onSortChange();
    }, state.deductionSort === 'start_date' && state.deductionSortDirection === 'desc', 'fa-solid fa-calendar-days'));

    // 2. Oldest Start Date
    menu.appendChild(createMenuButton('Oldest Start Date', () => {
        state.deductionSort = 'start_date';
        state.deductionSortDirection = 'asc';
        closeDeductionSortMenu(panel);
        onSortChange();
    }, state.deductionSort === 'start_date' && state.deductionSortDirection === 'asc', 'fa-solid fa-calendar-days'));

    // 3. Highest Amount
    menu.appendChild(createMenuButton('Highest Amount', () => {
        state.deductionSort = 'total_amount';
        state.deductionSortDirection = 'desc';
        closeDeductionSortMenu(panel);
        onSortChange();
    }, state.deductionSort === 'total_amount' && state.deductionSortDirection === 'desc', 'fa-solid fa-money-bill'));

    // 4. Lowest Amount
    menu.appendChild(createMenuButton('Lowest Amount', () => {
        state.deductionSort = 'total_amount';
        state.deductionSortDirection = 'asc';
        closeDeductionSortMenu(panel);
        onSortChange();
    }, state.deductionSort === 'total_amount' && state.deductionSortDirection === 'asc', 'fa-solid fa-money-bill'));

    // Divider
    const divider = document.createElement('div');
    divider.className = 'my-1 border-t border-gray-100 dark:border-gray-600';
    menu.appendChild(divider);

    // 5. By Type (Dynamic Submenu mula sa currentDeductions)
    const typeWrapper = document.createElement('div');
    typeWrapper.className = 'relative group';

    const typeButton = document.createElement('button');
    typeButton.type = 'button';
    typeButton.className = 'w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer';
    typeButton.innerHTML = `
        <span class="flex items-center gap-3">
            <i class="fa-solid fa-list w-4 text-center text-xs text-gray-400 dark:text-gray-500"></i>
            <span>By Type</span>
        </span>
        <i class="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
    `;

    const typeMenu = document.createElement('div');
    typeMenu.className = 'absolute right-full top-0 mr-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 hidden max-h-64 overflow-y-auto';

 // Get only deduction types assigned to the selected employee
const uniqueTypes = [
    ...new Map(
        state.currentDeductions
            .filter(d => d.deduction_type?.id && d.deduction_type?.title)
            .map(d => [
                String(d.deduction_type.id),
                {
                    id: d.deduction_type.id,
                    title: d.deduction_type.title
                }
            ])
    ).values()
];

    // Sort alphabetically for better UX
    uniqueTypes.sort((a, b) => a.title.localeCompare(b.title));

    if (uniqueTypes.length > 0) {
        typeMenu.innerHTML = uniqueTypes.map(type => `
            <button type="button" data-type-id="${type.id}" class="type-submenu-item w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <span>${escapeHtml(type.title)}</span>
                ${state.deductionSort === 'type' && state.deductionSortId === type.id ? '<i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>' : ''}
            </button>
        `).join('');
    } else {
        typeMenu.innerHTML = `<div class="px-3 py-2 text-xs text-gray-500">No deductions available.</div>`;
    }

    typeWrapper.appendChild(typeButton);
    typeWrapper.appendChild(typeMenu);

    // Hover effect para lumabas ang submenu
    typeWrapper.addEventListener('mouseenter', () => typeMenu.classList.remove('hidden'));
    typeWrapper.addEventListener('mouseleave', () => typeMenu.classList.add('hidden'));
    typeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        typeMenu.classList.toggle('hidden');
    });

    // I-handle ang click sa dynamic na submenu items
    typeMenu.addEventListener('click', (e) => {
        const btn = e.target.closest('.type-submenu-item');
        if (!btn) return;

        state.deductionSort = 'type';
        state.deductionSortId = btn.dataset.typeId;
        
        closeDeductionSortMenu(panel);
        onSortChange();
    });

    menu.appendChild(typeWrapper);
    
    // Close on outside click
    document.addEventListener('click', function closeOnOutside(e) {
        if (!e.target.closest('#btnSortDeduction') && !e.target.closest('#deductionSortMenu')) {
            closeDeductionSortMenu(panel);
            document.removeEventListener('click', closeOnOutside);
        }
    });
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}