<!-- Payroll Transaction -->
<div id="employeePayrollModule" class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
    <!-- Client List -->
    <div id="payrollClientListView">
        <div class="mb-4">
            <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
                <input type="text" id="payrollClientSearch" placeholder="Search company..." class="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-colors">
            </div>
        </div>

        <div class="grid grid-cols-[100px_minmax(0,1fr)_24px] items-center px-1 sm:px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            <div>Client ID</div>
            <div>Client Name</div>
            <div></div>
        </div>

        <div id="payrollClientList" class="space-y-2">
            <div id="payrollClientLoading" class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading clients...
            </div>
        </div>

        <div id="payrollClientPagination" class="mt-4"></div>
    </div>

    <!-- Cutoff List -->
    <div id="payrollCutoffListView" class="hidden">
        <div class="mb-4">
            <button type="button" id="employeeBackButton" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                <i class="fa-solid fa-arrow-left mr-2"></i>Back to Client List
            </button>
        </div>

        <div class="mb-4">
            <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
                <input type="text" id="payrollCutoffSearch" placeholder="Search cutoff..." class="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-colors">
            </div>
        </div>

        <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center px-1 sm:px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            <div>Cutoff Period</div>
            <div>Pay Date</div>
            <div></div>
        </div>

        <div id="payrollCutoffList" class="space-y-2">
            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="1">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">September 26 – October 10, 2026</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">October 15, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="2">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">September 11 – September 25, 2026</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">September 30, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>

            <button type="button" class="payroll-cutoff-card w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer group" data-cutoff-id="3">
                <div class="grid grid-cols-[minmax(0,1fr)_180px_24px] items-center gap-4">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">August 26 – September 10, 2026</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">September 15, 2026</div>
                    <div class="flex justify-end">
                        <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xs"></i>
                    </div>
                </div>
            </button>
        </div>
    </div>
</div>