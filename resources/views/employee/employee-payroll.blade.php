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
        <div class="grid grid-cols-[100px_minmax(0,1fr)_auto] items-center gap-2 px-1 sm:px-5 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            <div>Client ID</div>
            <div>Client Name</div>
            <div class="flex justify-end">
                <button type="button" id="payrollClientSortButton" aria-expanded="false" aria-label="Sort and filter clients" class="inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <span class="text-xs font-semibold uppercase">Sort</span>
                    <i class="fa-solid fa-arrow-down-a-z text-lg"></i>
                </button>
            </div>
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
            <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Select a client to load payroll cutoffs.
            </div>
        </div>
    </div>
</div>
