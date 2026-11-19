<body class="bg-gray-100 dark:bg-gray-800 min-h-screen">

    <!-- Main Application Content -->
    <main id="mainContent" class="min-h-screen transition-all duration-300">

        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <!-- 1. DYNAMIC HEADER (Breadcrumbs / Back Button) -->
            <div class="pt-6 pb-4 flex items-center gap-2">
                <!-- Back to Client Link (Clickable) -->
                <a href="#" id="headerBackToClient" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                    <i class="fa-solid fa-arrow-left mr-2"></i>Back to Client
                </a>

                <!-- Page Title (Lalabas lang pag nasa Employee View) -->
                <span id="headerBreadcrumbSeparator" class="hidden text-gray-400 dark:text-gray-500 text-sm mx-1">></span>
                <span id="headerPageTitle" class="hidden text-sm font-semibold text-gray-800 dark:text-gray-100">Employee Deduction</span>
            </div>

            <!-- 2. STICKY CONTAINER (Search Bar + Add Deduction Button) -->
            <div class="sticky top-16 z-30 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-sm">

                <div class="flex flex-col sm:flex-row sm:items-center gap-3">

                    <!-- Search Bar -->
                    <div class="relative flex-1 w-full">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none"></i>
                        <input type="text" id="searchInput" placeholder="Search..." autocomplete="off" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                    </div>

                    <!-- Add Deduction Button (Right side) -->
                    <button type="button" id="btnAddDeduction" class="inline-flex items-center justify-center w-full sm:w-auto shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm">
                        <i class="fa-solid fa-plus mr-2"></i>Add Deduction
                    </button>

                </div>

            </div>

            <!-- 3. DIVIDER (Inihiwalay sa sticky, nasa taas na ng grid) -->
            <div class="w-full border-t border-gray-300 dark:border-gray-600 mt-2 mb-4"></div>

            <!-- 4. DASHBOARD GRID (Pantay ang height, nag-a-adjust base sa content) -->
            <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[330px_1fr] gap-4 sm:gap-5 lg:gap-6 pb-10 items-stretch">

                <!-- LEFT COLUMN (Box List + Pagination) -->
                <div class="w-full max-w-full md:max-w-none flex flex-col h-full justify-between">

                    <!-- Dynamic Box List: Client + Employee (WALANG SCROLL, NATURAL HEIGHT) -->
                    <div class="flex flex-col gap-1 w-full relative">

                        <!-- Client list (JS renders here) -->
                        <div id="clientListContainer" class="flex flex-col gap-1.5 w-full">
                            <p class="text-gray-400 text-[10px] text-center py-2">Loading clients...</p>
                        </div>

                        <!-- Employee list (HIDDEN by default, JS renders here) -->
                        <div id="employeeListContainer" class="hidden flex-col gap-1.5 w-full"></div>

                    </div>

                    <!-- Dynamic Pagination Containers -->
                    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">

                        <!-- Client pagination (JS renders here) -->
                        <div id="clientPaginationContainer"></div>

                        <!-- Employee pagination (HIDDEN by default, JS renders here) -->
                        <div id="employeePaginationContainer" class="hidden mt-2"></div>

                    </div>

                </div>

                <!-- RIGHT COLUMN (Top, Middle, Bottom) -->
                <div class="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full min-w-0 h-full">

                    <!-- RIGHT TOP BOX (Employee Information) -->
                    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-4">
                        <!-- Header -->
                        <div class="flex items-center border-b border-gray-100 dark:border-gray-600 pb-3 mb-3">
                            <!-- Left Side: Name and Contract -->
                            <div class="flex items-center gap-3 min-w-0 flex-1">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <i class="fa-solid fa-user-tie text-base"></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 id="displayEmpName" class="font-semibold text-gray-900 dark:text-white text-sm truncate">—</h3>
                                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Start and End Contract Date</p>
                                </div>
                            </div>

                            <!-- Right Side: naka-center sa natitirang espasyo -->
                            <div class="flex flex-1 justify-center">
                                <div class="flex flex-col gap-1.5 shrink-0 border-l border-gray-200 dark:border-gray-600 pl-4 min-w-[160px]">
                                    <div class="flex items-center justify-between">
                                        <p class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 leading-tight">Employment Status</p>
                                        <p id="displayEmpStatus" class="text-xs font-semibold text-gray-800 dark:text-gray-100 ml-2">—</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 leading-tight">Months Hired</p>
                                        <p id="displayMonthsHired" class="text-xs font-semibold text-gray-800 dark:text-gray-100 ml-2">—</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Details Grid -->
                        <dl class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-1.5">
                                <dt class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment Basis</dt>
                                <dd id="displayPaymentBasis" class="mt-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 truncate">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-1.5">
                                <dt class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Monthly Rate</dt>
                                <dd id="displayMonthlyRate" class="mt-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 truncate">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-1.5">
                                <dt class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Daily Rate</dt>
                                <dd id="displayDailyRate" class="mt-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 truncate">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-1.5">
                                <dt class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Hourly Rate</dt>
                                <dd id="displayHourlyRate" class="mt-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 truncate">—</dd>
                            </div>
                        </dl>
                    </div>
                    <!-- RIGHT MIDDLE BOX (Deduction Header) -->
                    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-5 flex-1 flex flex-col min-w-0 w-full">
                        
                        <!-- Header Row -->
                        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-600 pb-4 mb-4">
                            
                            <!-- Left Side: Icon & Title -->
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <i class="fa-solid fa-list-check text-lg"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 dark:text-white">Deductions</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Employee loan and deduction schedules</p>
                                </div>
                            </div>

                            <!-- Right Side: Sort Button (Hover effect sa text/icon lang) -->
                            <div class="relative shrink-0">
                                <button type="button" id="btnSortDeduction" class="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 bg-transparent hover:bg-transparent border-none outline-none transition-colors cursor-pointer" aria-expanded="false">
                                    <i class="fa-solid fa-arrow-down-short-wide text-xs text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"></i>
                                    <span class="text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Sort</span>
                                </button>
                            </div>

                        </div>

                        <!-- Deduction Table Container -->
                        <div class="w-full min-w-0 max-w-full flex-1">

                            <!-- SCROLL AREA: DEDUCTION TABLE LANG -->
                            <div class="w-full max-w-full min-w-0 overflow-x-auto overflow-y-auto max-h-[450px]">

                                <table class="w-full min-w-[1130px] table-fixed text-left text-sm">

                            <colgroup>
                                <col style="width: 90px;">
                                <col style="width: 130px;">
                                <col style="width: 130px;">
                                <col style="width: 150px;">
                                <col style="width: 150px;">
                                <col style="width: 140px;">
                                <col style="width: 140px;">
                                <col style="width: 130px;">
                                <col style="width: 180px;">
                            </colgroup>

                            <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th class="px-3 py-3 font-semibold">Stop Ded</th>
                                    <th class="px-3 py-3 font-semibold">Type</th>
                                    <th class="px-3 py-3 font-semibold">Payment</th>
                                    <th class="px-3 py-3 font-semibold">Total Amount</th>
                                    <th class="px-3 py-3 font-semibold">Balance</th>
                                    <th class="px-3 py-3 font-semibold">Start Payment</th>
                                    <th class="px-3 py-3 font-semibold">End Payment</th>
                                    <th class="px-3 py-3 font-semibold">Entry By</th>
                                    <th class="px-3 py-3 font-semibold">Created At</th>
                                </tr>
                            </thead>

                                    <tbody id="deductionHeaderTableBody" class="divide-y divide-gray-100 dark:divide-gray-600">
                                        <tr>
                                            <td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                                Select an employee to load deductions.
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>

                            </div>
                        </div>
                        </div>

                    <!-- RIGHT BOTTOM BOX (Payment Details) -->
                    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-5 flex-1 flex flex-col">
                        <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-600 pb-4 mb-4">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <i class="fa-solid fa-receipt text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Payment history for the selected deduction</p>
                            </div>
                        </div>
                        <div class="w-full min-w-0 max-h-[300px] overflow-auto">
                                <table class="w-full min-w-[650px] text-left text-sm">
                                <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th class="px-3 py-3 text-right font-semibold">Amount</th>
                                        <th class="px-3 py-3 font-semibold">Start Date</th>
                                        <th class="px-3 py-3 font-semibold">End Date</th>
                                        <th class="px-3 py-3 font-semibold">Enter By</th>
                                        <th class="px-3 py-3 font-semibold">Created At</th>
                                    </tr>
                                </thead>
                                <tbody id="paymentDetailsTableBody" class="divide-y divide-gray-100 dark:divide-gray-600">
                                    <tr>
                                        <td colspan="5" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Select a deduction to view payment history.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </main>
</body>