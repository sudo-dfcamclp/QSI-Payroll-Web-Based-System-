<!-- Payroll Transaction -->
<div id="employeePayrollModule" class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
    <!-- Client Selection -->
    <div id="payrollSelection" class="transition-all duration-300 opacity-100 translate-y-0">
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 px-6 py-5 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Payroll Transaction</h1>
            <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Select a client and payroll cutoff to continue.</p>
        </div>
        <!-- Normal Payroll Selection -->
        <div id="payrollNormalSelection" class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-6 lg:p-8">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <i class="fa-solid fa-calendar-days text-blue-600 dark:text-blue-400 text-lg"></i>
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Payroll Selection</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Choose the client and payroll period.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label for="payrollClientSelection" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Client</label>
                    <select id="payrollClientSelection" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer">
                        <option value="">Select Client</option>
                        <option value="1">ECOLIA</option>
                        <option value="2">Sample Client B</option>
                    </select>
                </div>
                <div>
                    <label for="payrollCutoffSelection" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Payroll Cutoff</label>
                    <select id="payrollCutoffSelection" disabled class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer disabled:opacity-60">
                        <option value="">Select Payroll Cutoff</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex justify-start">
                <button type="button" id="payrollAddCutoffButton" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 text-sm font-semibold transition cursor-pointer">
                    <i class="fa-solid fa-plus"></i>
                    Add New Cut-Off
                </button>
            </div>
            <div id="payrollSelectionError" class="hidden mt-4 text-sm text-red-600 dark:text-red-400" role="alert"></div>
            <div class="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button type="button" id="payrollContinueButton" class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition cursor-pointer">
                    Continue
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
        <!-- New Cut-Off Form -->
        <div id="payrollNewCutoffForm" class="hidden bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-6 lg:p-8">
            <div class="flex items-start justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <i class="fa-solid fa-calendar-plus text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Create New Payroll Cut-Off</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Select a client and set the payroll period.</p>
                    </div>
                </div>
                <button type="button" id="payrollCancelCutoffButton" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-semibold transition cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                    Cancel
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="md:col-span-2">
                    <label for="payrollNewCutoffClient" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Client</label>
                    <select id="payrollNewCutoffClient" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer">
                        <option value="">Select Client</option>
                        <option value="1">ECOLIA</option>
                        <option value="2">Sample Client B</option>
                    </select>
                </div>
                <div>
                    <label for="payrollNewCutoffStart" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Payroll Period From</label>
                    <input type="date" id="payrollNewCutoffStart" class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
                <div>
                    <label for="payrollNewCutoffEnd" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Payroll Period To</label>
                    <input type="date" id="payrollNewCutoffEnd" class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
            </div>
            <div id="payrollNewCutoffError" class="hidden mt-4 text-sm text-red-600 dark:text-red-400" role="alert"></div>
            <div class="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-600">
                <button type="button" id="payrollSaveCutoffButton" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-semibold shadow-sm transition cursor-pointer">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Cut-Off
                </button>
            </div>
        </div>
    </div>
    <!-- Payroll Content -->
    <div id="payrollContent" class="hidden opacity-0 translate-y-4 transition-all duration-300">
        <!-- Page Header -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 px-6 py-5 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Payroll Transaction</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Manage employee payroll details and earnings.</p>
                </div>
                <button type="button" id="payrollChangeSelectionButton" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-semibold transition cursor-pointer">
                    <i class="fa-solid fa-arrow-left"></i>
                    Change Selection
                </button>
            </div>
        </div>
        <!-- Container 1: Payroll Information -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-6 lg:p-8 mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <i class="fa-solid fa-file-invoice-dollar text-blue-600 dark:text-blue-400 text-lg"></i>
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Payroll Information</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Employee and payroll period details.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Control No</label>
                    <input type="text" name="control_no" placeholder="Enter control number" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Employee No</label>
                    <input type="text" name="employee_no" placeholder="Enter employee number" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Employee Name</label>
                    <input type="text" name="employee_name" placeholder="Employee name" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Client</label>
                    <select name="client_id" id="payrollClientDisplay" class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer" disabled>
                        <option value="">Select Client</option>
                        <option value="1">ECOLIA</option>
                        <option value="2">Sample Client B</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Start Pay Date</label>
                    <input type="date" name="start_pay_date" id="payrollStartDate" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">End Pay Date</label>
                    <input type="date" name="end_pay_date" id="payrollEndDate" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                </div>
            </div>
        </div>
        <!-- Container 2: Earnings -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-6 lg:p-8 mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <i class="fa-solid fa-money-bill-wave text-green-600 dark:text-green-400 text-lg"></i>
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Earnings</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Enter workdays, hours, and applicable payroll earnings.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Days Worked</label>
                    <input type="number" name="days_worked" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Regular OT Hrs</label>
                    <input type="number" name="regular_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Night Diff Hrs</label>
                    <input type="number" name="night_diff_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">RD Hrs</label>
                    <input type="number" name="rd_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">RD OT Hrs</label>
                    <input type="number" name="rd_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">SH Hrs</label>
                    <input type="number" name="sh_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">SH OT Hrs</label>
                    <input type="number" name="sh_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">SH RD Hrs</label>
                    <input type="number" name="sh_rd_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">SH RD OT Hrs</label>
                    <input type="number" name="sh_rd_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">LH Hrs</label>
                    <input type="number" name="lh_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">LH OT Hrs</label>
                    <input type="number" name="lh_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">LH RD Hrs</label>
                    <input type="number" name="lh_rd_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">LH RD OT Hrs</label>
                    <input type="number" name="lh_rd_ot_hours" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Basic Pay</label>
                    <input type="number" name="basic_pay" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Total Earnings</label>
                    <input type="number" name="total_earnings" min="0" step="0.01" placeholder="0.00" readonly class="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm font-bold text-green-700 dark:text-green-300 placeholder-green-400 dark:placeholder-green-500 focus:outline-none">
                </div>
            </div>
        </div>
        <!-- Container 3: Payroll Summary -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-6 lg:p-8">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    <i class="fa-solid fa-calculator text-purple-600 dark:text-purple-400 text-lg"></i>
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Payroll Summary</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Payroll totals and final amount.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Gross Pay</label>
                    <input type="number" name="gross_pay" min="0" step="0.01" placeholder="0.00" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Total Deductions</label>
                    <input type="number" name="total_deductions" min="0" step="0.01" placeholder="0.00" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Net Pay</label>
                    <input type="number" name="net_pay" min="0" step="0.01" placeholder="0.00" readonly class="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl text-sm font-bold text-purple-700 dark:text-purple-300 placeholder-purple-400 dark:placeholder-purple-500 focus:outline-none">
                </div>
            </div>
        </div>
    </div>
</div>