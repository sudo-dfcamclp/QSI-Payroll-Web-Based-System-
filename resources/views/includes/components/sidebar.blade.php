<!-- External Fonts / Icons -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Role Permissions -->
@php
    use App\Models\Role;

    $user = auth()->user();

    $isSuperAdmin = $user->hasRoleId(Role::SUPER_ADMIN);

    $canHR = $user->hasAnyRoleId([
        Role::SUPER_ADMIN,
        Role::HR,
    ]);

    $canAdmin = $user->hasAnyRoleId([
        Role::SUPER_ADMIN,
        Role::ADMIN,
    ]);

    $canPayroll = $user->hasAnyRoleId([
        Role::SUPER_ADMIN,
        Role::PAYROLL,
    ]);
@endphp

<!-- Mobile Hamburger -->
<button id="mobileMenuButton" type="button" class="fixed top-4 left-4 z-[60] hidden w-11 h-11 items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-100 shadow-md border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
    <i class="fa-solid fa-bars text-lg pointer-events-none"></i>
</button>

<!-- Mobile Overlay -->
<div id="sidebarOverlay" class="fixed inset-0 z-40 hidden bg-black/40 md:hidden cursor-pointer"></div>

<!-- Sidebar -->
<aside id="sidebar" class="fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-500 flex flex-col z-50 shadow-lg overflow-hidden font-['Inter'] transition-all duration-300 ease-in-out">

    <!-- Header -->
    <div class="p-5 flex items-center gap-3 border-b border-gray-100 dark:border-gray-500 min-h-[72px] shrink-0">

        <button type="button" class="sidebar-logo w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 hover:bg-gray-100 transition-colors cursor-pointer">
            <img src="{{ asset('assets/logo/logo.png') }}" alt="QSI Logo" class="w-9 h-9 object-contain pointer-events-none">
        </button>

        <h1 class="sidebar-text whitespace-nowrap text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight select-none">QSI ePayroll</h1>

        <button id="desktopCollapseButton" type="button" class="sidebar-text ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-all shrink-0 cursor-pointer">
            <i id="collapseIcon" class="fa-solid fa-chevron-left text-lg pointer-events-none"></i>
        </button>

        <button id="mobileCloseButton" type="button" class="hidden ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-all shrink-0 cursor-pointer">
            <i class="fa-solid fa-xmark text-xl pointer-events-none"></i>
        </button>

    </div>

    <!-- Search -->
    <div id="sidebarSearch" class="px-5 py-3 shrink-0">

        <div id="searchExpanded" class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-300 pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-sm"></i>
            </span>

            <input type="text" placeholder="Search..." class="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-600 border-none rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-500 transition-all outline-none">
        </div>

        <button id="searchMini" type="button" class="hidden w-10 h-10 mx-auto items-center justify-center text-gray-500 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            <i class="fa-solid fa-magnifying-glass text-lg pointer-events-none"></i>
        </button>

    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 space-y-1">

        <div class="sidebar-separator my-2 border-t border-gray-200 dark:border-gray-500 mx-2"></div>

        <!-- Human Resource -->
        @if($canHR)
            <div class="dropdown-container relative">

                <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                    <i class="fa-regular fa-user text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                    <span class="sidebar-text whitespace-nowrap font-medium select-none">Human Resource</span>
                    <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
                </button>

                <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">
                    <a href="{{ route('employee.info') }}" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/employee-info') }}" data-tab-id="employee-info" data-tab-title="Employee Info" data-tab-icon="fa-regular fa-user">Employee Info</a>
                </div>

            </div>
        @endif

        <!-- Administrative -->
        @if($canAdmin)
            <div class="dropdown-container relative">

                <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                    <i class="fa-solid fa-shield text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                    <span class="sidebar-text whitespace-nowrap font-medium select-none">Administrative</span>
                    <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
                </button>

                <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">

                    <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/deduction-type') }}" data-tab-id="deduction-type" data-tab-title="Deduction Type" data-tab-icon="fa-solid fa-shield">Deduction Type</a>

                    <a href="{{ route('employee.deduction') }}" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/employee-deduction') }}" data-tab-id="employee-deduction" data-tab-title="Employee Deduction" data-tab-icon="fa-solid fa-user-minus">Employee Deduction</a>

                    <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/client-master') }}" data-tab-id="client-master" data-tab-title="Client Master" data-tab-icon="fa-solid fa-building">Client Master</a>

                </div>

            </div>
        @endif

        <!-- Payroll -->
        @if($canPayroll)
            <div class="dropdown-container relative">

                <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                    <i class="fa-regular fa-calendar text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                    <span class="sidebar-text whitespace-nowrap font-medium select-none">Payroll</span>
                    <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
                </button>

                <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">

                    <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/employee-payroll') }}" data-tab-id="employee-payroll" data-tab-title="Payroll Transaction" data-tab-icon="fa-regular fa-calendar">Payroll Transaction</a>

                    <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/first-last-cutoff') }}" data-tab-id="first-last-cutoff" data-tab-title="First / Last Cut-Off" data-tab-icon="fa-solid fa-calendar-days">First / Last Cut-Off</a>

                </div>

            </div>
        @endif

        <!-- Maintenance -->
        <div class="dropdown-container relative">

            <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                <i class="fa-solid fa-screwdriver-wrench text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                <span class="sidebar-text whitespace-nowrap font-medium select-none">Maintenance</span>
                <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
            </button>

            <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/branch') }}" data-tab-id="branch" data-tab-title="Branch" data-tab-icon="fa-solid fa-code-branch">Branch</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/department') }}" data-tab-id="department" data-tab-title="Department" data-tab-icon="fa-solid fa-building">Department</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/position') }}" data-tab-id="position" data-tab-title="Position" data-tab-icon="fa-solid fa-briefcase">Position</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/tax-table') }}" data-tab-id="tax-table" data-tab-title="Tax Table" data-tab-icon="fa-solid fa-table">Tax Table</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/pagibig-table') }}" data-tab-id="pagibig-table" data-tab-title="Pagibig Table" data-tab-icon="fa-solid fa-table">Pagibig Table</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/phealth-table') }}" data-tab-id="phealth-table" data-tab-title="P-Health Table" data-tab-icon="fa-solid fa-table">P-Health Table</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/sss-table') }}" data-tab-id="sss-table" data-tab-title="SSS Table" data-tab-icon="fa-solid fa-table">SSS Table</a>

            </div>

        </div>

        <!-- Billing -->
        <div class="dropdown-container relative">

            <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                <i class="fa-solid fa-file-invoice text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                <span class="sidebar-text whitespace-nowrap font-medium select-none">Billing</span>
                <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
            </button>

            <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">
                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/billing-transaction') }}" data-tab-id="billing-transaction" data-tab-title="Billing Transaction" data-tab-icon="fa-solid fa-file-invoice">Billing Transaction</a>
            </div>

        </div>

        <!-- Benefits -->
        <div class="dropdown-container relative">

            <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                <i class="fa-regular fa-handshake text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                <span class="sidebar-text whitespace-nowrap font-medium select-none">Benefits</span>
                <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
            </button>

            <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/old-deduction') }}" data-tab-id="old-deduction" data-tab-title="Old Deduction" data-tab-icon="fa-solid fa-money-bill-transfer">Old Deduction</a>

                <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/employee/mandatory') }}" data-tab-id="mandatory" data-tab-title="Mandatory" data-tab-icon="fa-solid fa-handshake">Mandatory</a>

            </div>

        </div>

        <!-- Configuration -->
        @if($isSuperAdmin)
            <div class="dropdown-container relative">

                <button type="button" class="sidebar-menu-btn w-full flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group cursor-pointer">
                    <i class="fa-solid fa-sliders text-gray-500 dark:text-gray-300 group-hover:text-green-600 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                    <span class="sidebar-text whitespace-nowrap font-medium select-none">Configuration</span>
                    <i class="dropdown-chevron fa-solid fa-chevron-down text-gray-400 dark:text-gray-300 ml-auto text-sm shrink-0 transition-transform duration-300 pointer-events-none"></i>
                </button>

                <div class="dropdown-menu max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out">

                    <a href="{{ route('UserManagement') }}" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/admin/user-management') }}" data-tab-id="user-management" data-tab-title="User Management" data-tab-icon="fa-solid fa-users">User Management</a>

                    <a href="{{ route('RoleManagement') }}" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/admin/role-management') }}" data-tab-id="role-management" data-tab-title="Role Management" data-tab-icon="fa-solid fa-user-shield">Role Management</a>

                    <a href="#" class="tab-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md cursor-pointer" data-page="{{ url('/configuration/system-settings') }}" data-tab-id="system-settings" data-tab-title="System Settings" data-tab-icon="fa-solid fa-sliders">System Settings</a>

                </div>

            </div>
        @endif

    </nav>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 shrink-0">

        <!-- Theme Toggle -->
        <button id="themeToggleButton" type="button" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors mb-1 cursor-pointer text-left">
            <i id="themeToggleIcon" class="fa-solid fa-moon text-gray-500 dark:text-gray-300 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
            <span id="themeToggleText" class="sidebar-text whitespace-nowrap font-medium text-sm select-none">Dark Mode</span>
        </button>

        <!-- Settings -->
        <a href="#" class="tab-link flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors mb-1 cursor-pointer" data-page="{{ url('/employee/settings') }}" data-tab-id="settings" data-tab-title="Settings" data-tab-icon="fa-solid fa-gear">
            <i class="fa-solid fa-gear text-gray-500 dark:text-gray-300 text-lg shrink-0 w-5 text-center pointer-events-none"></i>
            <span class="sidebar-text whitespace-nowrap font-medium text-sm select-none">Settings</span>
        </a>

        <!-- Logout -->
        <form action="{{ route('api.logout') }}" method="POST" class="m-0">
            @csrf

            <button type="submit" class="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer text-left">
                <i class="fa-solid fa-right-from-bracket text-lg shrink-0 w-5 text-center pointer-events-none"></i>
                <span class="sidebar-text whitespace-nowrap font-medium text-sm select-none">Logout</span>
            </button>

        </form>

    </div>

</aside>

<!-- Mini Sidebar -->
<style>
    #sidebar.sidebar-mini .dropdown-chevron {
        display: none !important;
    }
</style>