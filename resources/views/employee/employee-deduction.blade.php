<body class="bg-gray-100 dark:bg-gray-800 min-h-screen">

    <!-- Main Application Content -->
    <main id="mainContent" class="min-h-screen transition-all duration-300">

        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <!-- 1. BACK BUTTON (Hindi na sticky, normal scroll) -->
            <div class="pt-6 pb-4">
                <button type="button" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                    <i class="fa-solid fa-arrow-left mr-2"></i>Back to Client
                </button>
            </div>

            <!-- 2. STICKY CONTAINER (Search Bar + Add Deduction Button) -->
            <div class="sticky top-16 z-50 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-sm">
                
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    
                    <!-- Search Bar -->
                    <div class="relative flex-1 w-full">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none"></i>
                        <input type="text" placeholder="Search..." autocomplete="off" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                    </div>

                    <!-- Add Deduction Button (Right side) -->
                    <button type="button" id="btnAddDeduction" class="inline-flex items-center justify-center w-full sm:w-auto shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm">
                        <i class="fa-solid fa-plus mr-2"></i>Add Deduction
                    </button>

                </div>

            </div>

            <!-- 3. DIVIDER (Inihiwalay sa sticky, nasa taas na ng grid) -->
            <div class="w-full border-t border-gray-300 dark:border-gray-600 mt-2 mb-4"></div>

            <!-- 4. DASHBOARD GRID (Pantay ang height) -->
            <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[300px_1fr] gap-4 sm:gap-5 lg:gap-6 pb-10 items-stretch">

                <!-- LEFT COLUMN (Box List + Pagination) - WALANG BINAGO DITO -->
                <div class="w-full max-w-full md:max-w-none flex flex-col h-full justify-between">
                    
                    <!-- Modern Box List -->
                    <div class="flex flex-col gap-2 w-full flex-1">
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 py-3 h-10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"></div>
                    </div>

                    <!-- STATIC PAGINATION (Gaya sa script mo) -->
                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div class="flex flex-col gap-3">
                            <!-- Text Info -->
                            <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Showing <span class="font-semibold text-gray-700 dark:text-gray-200">1</span> to <span class="font-semibold text-gray-700 dark:text-gray-200">15</span> of <span class="font-semibold text-gray-700 dark:text-gray-200">120</span> clients
                            </div>
                            
                            <!-- Buttons -->
                            <div class="flex items-center justify-center gap-1">
                                <!-- Previous Button -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors opacity-50 cursor-not-allowed" disabled aria-label="Previous page">
                                    <i class="fa-solid fa-chevron-left text-xs"></i>
                                </button>
                                
                                <!-- Page 1 (Active) -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium bg-green-600 text-white cursor-default" disabled aria-label="Go to page 1">
                                    1
                                </button>
                                
                                <!-- Page 2 -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors" aria-label="Go to page 2">
                                    2
                                </button>
                                
                                <!-- Page 3 -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors" aria-label="Go to page 3">
                                    3
                                </button>
                                
                                <!-- Ellipsis -->
                                <span class="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-400 dark:text-gray-500">...</span>
                                
                                <!-- Last Page -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors" aria-label="Go to page 8">
                                    8
                                </button>
                                
                                <!-- Next Button -->
                                <button type="button" class="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer" aria-label="Next page">
                                    <i class="fa-solid fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- RIGHT COLUMN (Top, Middle, Bottom) - BAGO ANG DESIGN -->
                <div class="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full h-full">

                    <!-- RIGHT TOP BOX (Employee Information) -->
                    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-5">
                        <!-- Header -->
                        <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-600 pb-4 mb-4">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <i class="fa-solid fa-user-tie text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Employee Information</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Personal and contract details</p>
                            </div>
                        </div>

                        <!-- Details Grid -->
                        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Employee Name</dt>
                                <dd id="displayEmpName" class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Employment Status</dt>
                                <dd id="displayEmpStatus" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Payment Basis</dt>
                                <dd id="displayPaymentBasis" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Monthly Rate</dt>
                                <dd id="displayMonthlyRate" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Daily Rate</dt>
                                <dd id="displayDailyRate" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Hourly Rate</dt>
                                <dd id="displayHourlyRate" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">Start Contract</dt>
                                <dd id="displayStartContract" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">End Contract</dt>
                                <dd id="displayEndContract" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <dt class="text-xs text-gray-500 dark:text-gray-400">No. of Months Hired</dt>
                                <dd id="displayMonthsHired" class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- RIGHT MIDDLE BOX (Deduction Header) -->
                    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-5 flex-1 flex flex-col">
                        <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-600 pb-4 mb-4">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                <i class="fa-solid fa-list-check text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Deductions</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Employee loan and deduction schedules</p>
                            </div>
                        </div>
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th class="px-3 py-3 font-semibold">Stop Ded</th>
                                        <th class="px-3 py-3 font-semibold">Type</th>
                                        <th class="px-3 py-3 text-right font-semibold">Payment</th>
                                        <th class="px-3 py-3 text-right font-semibold">Total Amount</th>
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
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
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