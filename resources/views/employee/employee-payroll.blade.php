<!-- Payroll Transaction -->
<div id="employeePayrollModule" class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">

    <!-- Client List -->
    <div id="payrollClientListView">

        <div class="mb-4">
            <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
                <input
                    type="text"
                    id="payrollClientSearch"
                    placeholder="Search company..."
                    class="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                >
            </div>
        </div>

        <div class="grid grid-cols-[100px_minmax(0,1fr)] items-center px-1 sm:px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            <div>Client ID</div>
            <div>Client Name</div>
        </div>

        <div class="space-y-2">

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="76" data-client-name="(WHOUSE) UNIVERSAL GAMEPLAY INT., CORP.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">76</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">(WHOUSE) UNIVERSAL GAMEPLAY INT., CORP.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="87" data-client-name="168 MARKETING CORP.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">87</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">168 MARKETING CORP.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="171" data-client-name="20B ENTERPRISES, INC.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">171</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">20B ENTERPRISES, INC.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="211" data-client-name="A.N.S. ICE PLANT, INC.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">211</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">A.N.S. ICE PLANT, INC.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="51" data-client-name="AGUAS DE MARCO UNLIMITED INC.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">51</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">AGUAS DE MARCO UNLIMITED INC.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="18" data-client-name="AMERICAN HEARING CENTER">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">18</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">AMERICAN HEARING CENTER</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="22" data-client-name="AMERICAN HEARING CENTER CORP. (MONTHLY)">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">22</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">AMERICAN HEARING CENTER CORP. (MONTHLY)</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="189" data-client-name="ANJO FARMS, INC.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">189</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">ANJO FARMS, INC.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="9" data-client-name="ANSI CORP.">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">9</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">ANSI CORP.</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-client-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-client-id="107" data-client-name="ANTHEM SHOPPE (MONTHLY)">
                <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">107</div>
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">ANTHEM SHOPPE (MONTHLY)</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

        </div>
    </div>


    <!-- Cutoff List -->
    <div id="payrollCutoffListView" class="hidden">

        <div class="mb-4">
            <button type="button" id="employeeBackButton" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                <i class="fa-solid fa-arrow-left mr-2"></i>Back to Client List
            </button>
        </div>

        <div class="mb-4 flex items-center gap-3">
            <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
                <input
                    type="text"
                    id="payrollCutoffSearch"
                    placeholder="Search cutoff..."
                    class="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                >
            </div>

            <button
                type="button"
                id="payrollAddCutoffButton"
                class="inline-flex items-center justify-center gap-2 h-11 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
                <i class="fa-solid fa-plus"></i>
                <span>Add Cutoff</span>
            </button>
        </div>

        <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center px-1 sm:px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            <div>Cutoff Period</div>
            <div>Pay Date</div>
            <div></div>
        </div>

        <div class="space-y-2">

            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="1">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        September 26 – October 10, 2026
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">October 15, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="2">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        September 11 – September 25, 2026
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">September 30, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="3">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        August 26 – September 10, 2026
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">September 15, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

        </div>
    </div>


    <!-- Payroll Transaction -->
    <div id="payrollTransactionView" class="hidden">

        <!-- Back to Cutoff -->
        <div class="mb-4">
            <button type="button" id="payrollTransactionBackButton" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                <i class="fa-solid fa-arrow-left mr-2"></i>Back to Cutoff List
            </button>
        </div>

        <!-- Payroll Header -->
        <section class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden mb-6">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 class="text-base font-semibold text-gray-800 dark:text-gray-100">
                            Payroll Transaction
                        </h2>
                        <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            Selected payroll cutoff
                        </p>
                    </div>

                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        Pending
                    </span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                <div>
                    <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Client</div>
                    <div id="payrollSelectedClientName" class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        AMERICAN HEARING CENTER
                    </div>
                </div>

                <div>
                    <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Cutoff Period</div>
                    <div id="payrollSelectedCutoffPeriod" class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        September 26 – October 10, 2026
                    </div>
                </div>

                <div>
                    <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Pay Date</div>
                    <div id="payrollSelectedPayDate" class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        October 15, 2026
                    </div>
                </div>

                <div>
                    <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Employees</div>
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        5 Employees
                    </div>
                </div>
            </div>
        </section>


        <!-- Employee Payroll List -->
        <section class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-visible mb-6">

            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">

                    <!-- Title -->
                    <div class="shrink-0">
                        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Employees for Payroll
                        </h3>
                        <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            Select an employee to view the payroll transaction.
                        </p>
                    </div>

                    <!-- Search -->
                    <div class="relative w-full sm:w-72 sm:mx-auto">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-xs"></i>

                        <input
                            type="text"
                            id="payrollEmployeeSearch"
                            placeholder="Search employee..."
                            class="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                        >
                    </div>

                    <!-- Sort -->
                    <div class="relative shrink-0">
                        <button
                            type="button"
                            id="payrollEmployeeSortButton"
                            aria-expanded="false"
                            class="h-10 px-3 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <i class="fa-solid fa-arrow-down-a-z text-xs"></i>
                            <span>Sort</span>
                            <i class="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                        </button>
                    </div>

                </div>
            </div>

            <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide border-b border-gray-100 dark:border-gray-600">
                <div>Emp. No.</div>
                <div>Employee Name</div>
                <div>Status</div>
                <div class="text-right">Action</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-600">

                <button type="button" class="payroll-employee-row w-full text-left px-5 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer" data-employee-id="10001">
                    <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center gap-4">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">10001</div>
                        <div>
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">Juan Dela Cruz</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Regular Employee</div>
                        </div>
                        <div>
                            <span class="inline-flex px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[11px] font-medium">
                                Pending
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-medium text-green-600 dark:text-green-400">
                                Process
                            </span>
                        </div>
                    </div>
                </button>

                <button type="button" class="payroll-employee-row w-full text-left px-5 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer" data-employee-id="10002">
                    <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center gap-4">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">10002</div>
                        <div>
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">Pedro Santos</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Regular Employee</div>
                        </div>
                        <div>
                            <span class="inline-flex px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[11px] font-medium">
                                Done
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                                View
                            </span>
                        </div>
                    </div>
                </button>

                <button type="button" class="payroll-employee-row w-full text-left px-5 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer" data-employee-id="10003">
                    <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center gap-4">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">10003</div>
                        <div>
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">Maria Santos</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Regular Employee</div>
                        </div>
                        <div>
                            <span class="inline-flex px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[11px] font-medium">
                                Pending
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-medium text-green-600 dark:text-green-400">
                                Process
                            </span>
                        </div>
                    </div>
                </button>

                <button type="button" class="payroll-employee-row w-full text-left px-5 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer" data-employee-id="10004">
                    <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center gap-4">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">10004</div>
                        <div>
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">Ana Reyes</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Regular Employee</div>
                        </div>
                        <div>
                            <span class="inline-flex px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[11px] font-medium">
                                Pending
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-medium text-green-600 dark:text-green-400">
                                Process
                            </span>
                        </div>
                    </div>
                </button>

                <button type="button" class="payroll-employee-row w-full text-left px-5 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer" data-employee-id="10005">
                    <div class="grid grid-cols-[100px_minmax(0,1fr)_120px_90px] items-center gap-4">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">10005</div>
                        <div>
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">Jose Cruz</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Regular Employee</div>
                        </div>
                        <div>
                            <span class="inline-flex px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[11px] font-medium">
                                Pending
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-medium text-green-600 dark:text-green-400">
                                Process
                            </span>
                        </div>
                    </div>
                </button>

            </div>
        </section>


        <!-- Selected Employee Payroll -->
        <section id="selectedEmployeePayrollCard" class="hidden">

            <!-- Employee Information -->
            <div class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden mb-6">

                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Employee Information
                    </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">

                    <div>
                        <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Employee No.</div>
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">10001</div>
                    </div>

                    <div>
                        <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Employee Name</div>
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">Juan Dela Cruz</div>
                    </div>

                    <div>
                        <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Position</div>
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">Regular Employee</div>
                    </div>

                    <div>
                        <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Employment Status</div>
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">Active</div>
                    </div>

                </div>
            </div>


            <!-- Earnings and Deductions -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                <!-- Earnings -->
                <section class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">

                    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <i class="fa-solid fa-arrow-trend-up text-green-600 dark:text-green-400 text-sm"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Earnings</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Payroll earnings</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 space-y-4">

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Basic Pay</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 12,000.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Allowances</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 1,500.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Overtime</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 850.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Holiday Pay</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 500.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Other Earnings</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 0.00</span>
                        </div>

                        <div class="pt-4 border-t border-gray-100 dark:border-gray-600">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">Gross Pay</span>
                                <span class="text-base font-bold text-green-600 dark:text-green-400">₱ 14,850.00</span>
                            </div>
                        </div>

                    </div>
                </section>


                <!-- Deductions -->
                <section class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">

                    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <i class="fa-solid fa-arrow-trend-down text-red-600 dark:text-red-400 text-sm"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Deductions</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Payroll deductions</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 space-y-4">

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Absences</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 500.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Tardiness</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 150.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">SSS</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 500.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">PhilHealth</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 250.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Pag-IBIG</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 100.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Loans</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 300.00</span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <span class="text-sm text-gray-600 dark:text-gray-300">Other Deductions</span>
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-100">₱ 0.00</span>
                        </div>

                        <div class="pt-4 border-t border-gray-100 dark:border-gray-600">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">Total Deductions</span>
                                <span class="text-base font-bold text-red-600 dark:text-red-400">₱ 1,800.00</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>


            <!-- Payroll Summary -->
            <section class="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden mb-6">

                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Payroll Summary
                    </h3>
                </div>

                <div class="p-5">

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-600 p-4">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Gross Pay</div>
                            <div class="text-lg font-bold text-gray-800 dark:text-gray-100">₱ 14,850.00</div>
                        </div>

                        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-600 p-4">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Deductions</div>
                            <div class="text-lg font-bold text-red-600 dark:text-red-400">₱ 1,800.00</div>
                        </div>

                    </div>

                    <div class="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 p-5">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div class="text-xs uppercase tracking-wide text-green-700 dark:text-green-400 font-medium">
                                    Net Pay
                                </div>
                                <div class="text-xs text-green-600 dark:text-green-500 mt-1">
                                    Gross Pay less Total Deductions
                                </div>
                            </div>

                            <div class="text-2xl font-bold text-green-700 dark:text-green-400">
                                ₱ 13,050.00
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            <!-- Payroll Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pb-6">

                <button
                    type="button"
                    id="payrollSaveButton"
                    class="inline-flex items-center justify-center gap-2 h-11 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>Save Payroll</span>
                </button>

                <button
                    type="button"
                    id="payrollDoneButton"
                    class="inline-flex items-center justify-center gap-2 h-11 px-5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                    <i class="fa-solid fa-check"></i>
                    <span>Mark as Done</span>
                </button>

            </div>

        </section>

    </div>

</div>