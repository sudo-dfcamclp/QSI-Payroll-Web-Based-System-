<!-- Payroll Transaction -->
<div id="employeePayrollModule" class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
<div id="employeePayrollBreadcrumbTrail" class="hidden items-center gap-2 mb-4 text-sm">
    <button
        type="button"
        id="employeeBreadcrumbClient"
        class="font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
    </button>

    <i class="fa-solid fa-angle-right text-xs text-gray-400"></i>

    <span
        id="employeeBreadcrumbCutoff"
        class="hidden items-center gap-2 font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
        Cutoff
    </span>

    <span id="employeeBreadcrumbPayroll" class="hidden items-center gap-2">
        <i class="fa-solid fa-angle-right text-xs text-gray-400"></i>
        <span class="font-semibold text-gray-800 dark:text-gray-100">Payroll</span>
    </span>
</div>
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
            <div class="mb-4 flex items-center gap-3">
        <div class="relative min-w-0 flex-1">
        <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
        <input
            type="text"
            id="payrollCutoffSearch"
            placeholder="Search cutoff..."
            class="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-colors">
        </div>

            <button
                type="button"
                id="payrollAddCutoffButton"
                class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 cursor-pointer">
                <i class="fa-solid fa-plus"></i>
                <span>Add Cutoff</span>
            </button>
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
    <!-- Payroll Form -->
    <div id="payrollTransactionView" class="hidden" data-employees-url="{{ route('payroll.employees') }}" data-compute-url="{{ route('payroll.compute.preview') }}">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <button type="button" id="payrollBackToCutoffButton" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                    <i class="fa-solid fa-arrow-left mr-2"></i>Back to Cutoff List
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="button" id="payrollRefreshButton" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <i class="fa-solid fa-rotate"></i>Refresh
                </button>
                <button type="button" id="payrollPrintButton" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <i class="fa-solid fa-print"></i>Print
                </button>
                <button type="button" id="payrollSaveButton" class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                    <i class="fa-solid fa-floppy-disk"></i>Save Payroll
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div class="min-w-0 space-y-5">
  <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
<!-- Header -->
<div class="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <i class="fa-solid fa-address-card text-lg"></i>
    </div>
    <div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Employee Details</h3>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Payroll and contract information</p>
    </div>
</div>

<!-- Details Grid -->
<dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <!-- Employee Name -->
    <div class="flex min-w-0 items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
        <i class="fa-solid fa-user mt-0.5 text-sm text-green-600 dark:text-green-400"></i>
        <div class="min-w-0 flex-1">
            <dt class="text-xs text-gray-500 dark:text-gray-400">Employee Name</dt>
            <dd id="payrollSidebarEmployee" class="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">Select an employee</dd>
        </div>
    </div>

    <!-- Contract Period -->
    <div class="flex min-w-0 items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
        <i class="fa-solid fa-file-contract mt-0.5 text-sm text-gray-500 dark:text-gray-400"></i>
        <div class="min-w-0 flex-1">
            <dt class="text-xs text-gray-500 dark:text-gray-400">Contract Period</dt>
            <dd id="payrollSidebarContractPeriod" class="mt-1 break-words text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
        </div>
    </div>

    <!-- Payroll Status -->
    <div class="flex min-w-0 items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
        <i class="fa-solid fa-circle-check mt-0.5 text-sm text-gray-500 dark:text-gray-400"></i>
        <div class="min-w-0 flex-1">
            <dt class="mb-1 text-xs text-gray-500 dark:text-gray-400">Payroll Status</dt>
            <dd>
                <span id="payrollStatus" class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    Draft
                </span>
            </dd>
        </div>
    </div>

    <!-- Added By -->
    <div class="flex min-w-0 items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
        <i class="fa-solid fa-user-pen mt-0.5 text-sm text-gray-500 dark:text-gray-400"></i>
        <div class="min-w-0 flex-1">
            <dt class="text-xs text-gray-500 dark:text-gray-400">Added By</dt>
            <dd id="payrollSidebarAddedBy" class="mt-1 break-words text-sm font-medium text-gray-800 dark:text-gray-200">—</dd>
        </div>
    </div>
</dl>
</section>
        </section>
                <!-- Earnings -->
  
<!-- Earnings -->
<section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-4 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <i class="fa-solid fa-wallet"></i>
        </div>
        <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Earnings</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Working hours, holidays, allowances, and adjustments</p>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">

        <!-- LEFT COLUMN: WORK HOURS AND PREMIUMS -->
        <div class="space-y-3">

            <!-- Days Worked -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollDaysWorked" class="text-sm text-gray-600 dark:text-gray-300">Days Worked</label>
                <input id="payrollDaysWorked" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewDaysWorked" data-preview-key="basic_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Regular OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollRegularHours" class="text-sm text-gray-600 dark:text-gray-300">Regular OT Hours</label>
                <input id="payrollRegularHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewRegularOT" data-preview-key="regular_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Night Differential -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollNightDiffHours" class="text-sm text-gray-600 dark:text-gray-300">Night Differential Hours</label>
                <input id="payrollNightDiffHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewNightDiff" data-preview-key="night_diff_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Rest Day Hours -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollRestDayHours" class="text-sm text-gray-600 dark:text-gray-300">RD Hours</label>
                <input id="payrollRestDayHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewRestDay" data-preview-key="rest_day_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Rest Day OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollRestDayOtHours" class="text-sm text-gray-600 dark:text-gray-300">RD OT Hours</label>
                <input id="payrollRestDayOtHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewRestDayOT" data-preview-key="rest_day_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Special Holiday Hours -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollSpecialHolidayHours" class="text-sm text-gray-600 dark:text-gray-300">SH Hours</label>
                <input id="payrollSpecialHolidayHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewSpecialHoliday" data-preview-key="special_holiday_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Special Holiday OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollSpecialHolidayOtHours" class="text-sm text-gray-600 dark:text-gray-300">SH OT Hours</label>
                <input id="payrollSpecialHolidayOtHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewSpecialHolidayOT" data-preview-key="special_holiday_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Special Holiday Rest Day -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollSpecialHolidayRestDayHours" class="text-sm text-gray-600 dark:text-gray-300">SH RD Hours</label>
                <input id="payrollSpecialHolidayRestDayHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewSpecialHolidayRestDay" data-preview-key="excess_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Special Holiday Rest Day OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollSpecialHolidayRestDayOtHours" class="text-sm text-gray-600 dark:text-gray-300">SH RD OT Hrs</label>
                <input id="payrollSpecialHolidayRestDayOtHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewSpecialHolidayRestDayOT" data-preview-key="excess_sun_special_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

                        <!-- Legal Holiday Hours -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollLegalHolidayHours" class="text-sm text-gray-600 dark:text-gray-300">LH Hours</label>
                <input id="payrollLegalHolidayHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewLegalHoliday" data-preview-key="regular_holiday_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

        </div>

        <!-- RIGHT COLUMN: OTHER EARNINGS -->
        <div class="space-y-3">


            <!-- Legal Holiday OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollLegalHolidayOtHours" class="text-sm text-gray-600 dark:text-gray-300">LH OT Hours</label>
                <input id="payrollLegalHolidayOtHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewLegalHolidayOT" data-preview-key="regular_holiday_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Legal Holiday Rest Day -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollLegalHolidayRestDayHours" class="text-sm text-gray-600 dark:text-gray-300">LH RD Hours</label>
                <input id="payrollLegalHolidayRestDayHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewLegalHolidayRestDay" data-preview-key="excess_legal_hol_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Legal Holiday Rest Day OT -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollLegalHolidayRestDayOtHours" class="text-sm text-gray-600 dark:text-gray-300">LH RD OT Hrs</label>
                <input id="payrollLegalHolidayRestDayOtHours" type="number" min="0" step="0.01" value="0"
                    class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewLegalHolidayRestDayOT" data-preview-key="excess_sun_legal_ot_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Fixed Allowance -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollFixedAllowance" class="text-sm text-gray-600 dark:text-gray-300">Fixed Allowance</label>
                <input id="payrollFixedAllowance" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewFixedAllowance" data-preview-key="allowance"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Load Allowance -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollLoadAllowance" class="text-sm text-gray-600 dark:text-gray-300">Load Allowance (L)</label>
                <input id="payrollLoadAllowance" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewLoadAllowance" data-preview-key="load_allow"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Meal Allowance -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollMealAllowance" class="text-sm text-gray-600 dark:text-gray-300">Meal Allowance (M)</label>
                <input id="payrollMealAllowance" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewMealAllowance" data-preview-key="meal_allow"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Transportation Allowance -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollTranspoAllowance" class="text-sm text-gray-600 dark:text-gray-300">Transportation Allowance (T)</label>
                <input id="payrollTranspoAllowance" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewTranspoAllowance" data-preview-key="transpo_allow"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Adjustment -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollAdjustment" class="text-sm text-gray-600 dark:text-gray-300">Adjustment</label>
                <input id="payrollAdjustment" type="number" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewAdjustment" data-preview-key="salary_adjustment"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- Incentive -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollIncentive" class="text-sm text-gray-600 dark:text-gray-300">Incentive / Remittance</label>
                <input id="payrollIncentive" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="previewIncentive" data-preview-key="incentive_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

            <!-- 13th Month -->
            <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                <label for="payrollThirteenthMonth" class="text-sm text-gray-600 dark:text-gray-300">13th Month Pay</label>
                <input id="payrollThirteenthMonth" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <div id="preview13thMonth" data-preview-key="thirteenth_month_pay"
                    class="payroll-preview rounded-lg border border-green-200 bg-green-50 px-2 py-2 text-right text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">₱0.00</div>
            </div>

        </div>
    </div>
</section>

                    <!-- Deductions -->
        <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-800">
            <!-- Header -->
            <div class="mb-4 flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <i class="fa-solid fa-file-invoice-dollar"></i>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Deductions</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Attendance, contributions, and tax deductions</p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <!-- Attendance Deductions - Left -->
                <div class="space-y-3">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Attendance Deductions</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Absences and tardiness</p>
                    </div>

                    <div class="space-y-3">
                        <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                            <label for="payrollDaysAbsent" class="text-sm text-gray-600 dark:text-gray-300">Days Absent</label>
                            <input id="payrollDaysAbsent" type="number" min="0" step="0.01" value="0"
                                class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <div id="previewDaysAbsent" class="rounded-lg bg-red-50 px-3 py-2 text-right text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">₱0.00</div>
                        </div>

                        <div class="grid grid-cols-[minmax(0,1fr)_90px_115px] items-center gap-2">
                            <label for="payrollLateHours" class="text-sm text-gray-600 dark:text-gray-300">Late Hours</label>
                            <input id="payrollLateHours" type="number" min="0" step="0.01" value="0"
                                class="payroll-number w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <div id="previewLateHours" class="rounded-lg bg-red-50 px-3 py-2 text-right text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">₱0.00</div>
                        </div>
                    </div>
                </div>

                <!-- Government Contributions - Right -->
                <div class="space-y-3">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Government Contributions</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Employee and employer shares</p>
                    </div>

                    <div class="space-y-3">
                        <!-- SSS -->
                        <div class="grid grid-cols-[minmax(0,1fr)_90px_90px_32px] items-center gap-2">
                            <label class="text-sm text-gray-600 dark:text-gray-300">SSS</label>
                            <input id="payrollSss" type="number" min="0" step="0.01" value="0"
                                title="SSS Employee Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <input id="payrollSssEmployer" type="number" min="0" step="0.01" value="0"
                                title="SSS Employer Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <button type="button" data-reset-contribution="sss"
                                class="flex h-9 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                                title="Reset SSS shares">
                                <i class="fa-solid fa-arrow-rotate-left"></i>
                            </button>
                        </div>

                        <!-- Pag-IBIG -->
                        <div class="grid grid-cols-[minmax(0,1fr)_90px_90px_32px] items-center gap-2">
                            <label class="text-sm text-gray-600 dark:text-gray-300">Pag-IBIG</label>
                            <input id="payrollPagibig" type="number" min="0" step="0.01" value="0"
                                title="Pag-IBIG Employee Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <input id="payrollPagibigEmployer" type="number" min="0" step="0.01" value="0"
                                title="Pag-IBIG Employer Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <button type="button" data-reset-contribution="pagibig"
                                class="flex h-9 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                                title="Reset Pag-IBIG shares">
                                <i class="fa-solid fa-arrow-rotate-left"></i>
                            </button>
                        </div>

                        <!-- PhilHealth -->
                        <div class="grid grid-cols-[minmax(0,1fr)_90px_90px_32px] items-center gap-2">
                            <label class="text-sm text-gray-600 dark:text-gray-300">PhilHealth</label>
                            <input id="payrollPhilhealth" type="number" min="0" step="0.01" value="0"
                                title="PhilHealth Employee Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <input id="payrollPhilhealthEmployer" type="number" min="0" step="0.01" value="0"
                                title="PhilHealth Employer Share"
                                class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            <button type="button" data-reset-contribution="philhealth"
                                class="flex h-9 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                                title="Reset PhilHealth shares">
                                <i class="fa-solid fa-arrow-rotate-left"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Contribution Column Labels -->
                    <div class="grid grid-cols-[minmax(0,1fr)_90px_90px_32px] gap-2">
                        <span></span>
                        <span class="text-center text-[10px] text-gray-400">Employee</span>
                        <span class="text-center text-[10px] text-gray-400">Employer</span>
                        <span></span>
                    </div>
                </div>
            </div>

            <!-- Withholding Tax -->
            <div class="mt-5 grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <label for="payrollWithholdingTax" class="text-sm font-medium text-gray-600 dark:text-gray-300">Withholding Tax</label>
                <input id="payrollWithholdingTax" type="number" min="0" step="0.01" value="0"
                    class="payroll-money w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            </div>
        </section>
        
<!-- Other Deductions -->
<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-700 dark:bg-gray-800">
    <!-- Header -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <i class="fa-solid fa-list-check"></i>
            </div>
            <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Other Deductions</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Additional employee deductions and adjustments</p>
            </div>
        </div>

        <button type="button" id="payrollAddDeductionButton"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            <i class="fa-solid fa-plus"></i>
            Add Deduction
        </button>
    </div>

    <!-- Deductions Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                    <th class="px-4 py-3 font-semibold">Deduction Type</th>
                    <th class="px-4 py-3 text-right font-semibold">Amount</th>
                    <th class="w-12 px-3 py-3 text-center font-semibold">Action</th>
                </tr>
            </thead>
            <tbody id="payrollOtherDeductions" class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr id="payrollNoDeductions">
                    <td colspan="3" class="px-4 py-10 text-center">
                        <div class="flex flex-col items-center gap-2">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700">
                                <i class="fa-solid fa-receipt text-lg"></i>
                            </div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">No additional deductions</span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">Click "Add Deduction" to add an item</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</section>


                    <!-- Payroll Summary -->
        <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-center justify-between gap-2">
                <div class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Payroll Summary
                </div>
                <div class="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                    <span class="h-2 w-2 rounded-full bg-green-500"></span>
                    Realtime Computation
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Gross Pay</div>
                    <div id="payrollSummaryGross" class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        ₱0.00
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Total Deductions</div>
                    <div id="payrollSummaryDeductions" class="mt-1 text-xl font-bold text-red-600 dark:text-red-400">
                        ₱0.00
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Net Pay</div>
                    <div id="payrollNetPay" class="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                        ₱0.00
                    </div>
                </div>
            </div>
        </section>

        
            </div>
         <!-- Employee Sidebar -->
            <aside class="space-y-5 lg:sticky lg:top-16 lg:self-start">
                <section class="flex max-h-210 min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div class="mb-4 flex shrink-0 items-center justify-between">
                        <div><h3 class="font-semibold text-gray-900 dark:text-white">Employees</h3><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Manage payroll employees</p></div>
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"><i class="fa-solid fa-users"></i></div>
                    </div>
                    <div class="mb-4 grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900" role="tablist" aria-label="Employee payroll status">
                        <button type="button" id="payrollPendingTab" role="tab" aria-selected="true" aria-controls="payrollPendingPanel" class="payroll-employee-tab inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md bg-white px-2 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-colors dark:bg-gray-700 dark:text-green-400 cursor-pointer"><i class="fa-solid fa-clock text-xs"></i><span>Pending</span><span id="payrollPendingCount" class="rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/50 dark:text-green-300">0</span></button>
                        <button type="button" id="payrollDoneTab" role="tab" aria-selected="false" aria-controls="payrollDonePanel" class="payroll-employee-tab inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"><i class="fa-solid fa-circle-check text-xs"></i><span>Done</span><span id="payrollDoneCount" class="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">0</span></button>
                    </div>
                    <div id="payrollPendingPanel" role="tabpanel" aria-labelledby="payrollPendingTab" class="flex min-h-0 flex-1 flex-col">
                        <div class="relative mb-3 shrink-0"><i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i><input id="payrollEmployeeSearch" type="text" placeholder="Search employee..." autocomplete="off" class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"></div>
                        <div id="payrollPendingEmployees" class="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain"><div class="py-8 text-center text-xs text-gray-400">No employees loaded</div></div>
                    </div>
                    <div id="payrollDonePanel" role="tabpanel" aria-labelledby="payrollDoneTab" class="hidden min-h-0 flex-1 flex-col">
                        <div class="relative mb-3 shrink-0"><i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i><input id="payrollDoneSearch" type="text" placeholder="Search completed payroll..." autocomplete="off" class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"></div>
                        <div id="payrollDoneEmployees" class="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain"><div class="py-8 text-center text-xs text-gray-400">No completed payroll</div></div>
                    </div>
                </section>
            </aside>
        </div>
    </div>
</div>