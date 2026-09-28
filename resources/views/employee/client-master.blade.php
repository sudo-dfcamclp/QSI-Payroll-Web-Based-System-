<div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
    <div class="space-y-6">
        <section class="min-h-20 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="relative flex flex-col lg:flex-row lg:items-center gap-4">
                <div class="flex items-center gap-3 shrink-0">
                    <button type="button" id="clientEditButton" class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
                        <i class="fa-solid fa-pen-to-square mr-2"></i>Edit
                    </button>
                    <button type="button" id="clientSaveButton" class="px-4 py-2.5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
                        <i class="fa-solid fa-floppy-disk mr-2"></i>Save
                    </button>
                </div>
                <div class="lg:absolute lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-auto">
                    <div class="relative w-full lg:w-96">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="clientSearch" placeholder="Search or select client..." autocomplete="off" class="w-full pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                        <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <div id="clientSearchResults" class="hidden absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden">
                            <div class="max-h-64 overflow-y-auto">
                                <button type="button" class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Client 1</button>
                                <button type="button" class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Client 2</button>
                                <button type="button" class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Client 3</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="min-h-40 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            
            <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-building text-xl text-green-600 dark:text-green-400"></i>
                </div>
                
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Client Information</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Client profile and company information.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="clientName" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Name</label>
                    <input type="text" id="clientName" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="clientAddress" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Address</label>
                    <input type="text" id="clientAddress" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="clientContact" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Contact</label>
                    <input type="text" id="clientContact" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="alternativeContact" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Alternative Contact</label>
                    <input type="text" id="alternativeContact" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="clientOwner" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Owner</label>
                    <input type="text" id="clientOwner" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="contactPerson" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Contact Person</label>
                    <input type="text" id="contactPerson" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>

                <div>
                    <label for="contactPosition" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Contact Position</label>
                    <input type="text" id="contactPosition" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                </div>
            </div>
        </section>

        <section class="min-h-80 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-building text-xl text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Payroll Configuration</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Client profile and company information.</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payroll Frequency / Cutoff</label>
                    <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="semi_monthly">Semi-Monthly</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Cutoff</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 13"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Year</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 312"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Month</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 26"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Hours per Day</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 8"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div class="flex items-center gap-3 pt-7">
                    <input type="checkbox" id="include13thMonth" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                    <label for="include13thMonth" class="text-sm font-medium text-gray-700 dark:text-gray-200">Include 13th Month Pay</label>
                </div>

                <div class="flex items-center gap-3 pt-7">
                    <input type="checkbox" id="add13thMonthGross" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                    <label for="add13thMonthGross" class="text-sm font-medium text-gray-700 dark:text-gray-200">Add 13th Month to Gross Pay</label>
                </div>
            </div>
        </section>

        <section class="min-h-60 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-sliders text-xl text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Payroll Rates</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Client settings and payroll configuration.</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Agency Fee Basis</label>
                    <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="agency_rate">Agency Rate</option>
                        <option value="client_charge_per_day">Client Charge per Day</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Agency Rate (%)</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 10.00"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Client Charge per Day</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 100.00"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tardiness Rate</label>
                    <input type="number" min="0" step="0.01" placeholder="Unused"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Late Charge per Minute</label>
                    <input type="number" min="0" step="0.01" placeholder="Unused"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>
            </div>
        </section>

        <section class="min-h-120 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-sliders text-xl text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Overtime & Premium Rates</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Multipliers applied to the hourly rate.</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Regular Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 1.25"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Rest Day</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 1.30"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Rest Day Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 1.69"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 1.30"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 2.00"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Night Differential</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 0.10"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday on Rest Day</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday on Rest Day, Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday on Rest Day</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday on Rest Day, Overtime</label>
                    <input type="number" min="0" step="0.01" placeholder="Not in your list"
                        disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>
            </div>
        </section>

        
        <section class="min-h-120 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-coins text-xl text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">ECOLA / Allowance Payment & Statutory Deductions</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure allowance payments, statutory deductions, and tax treatment.</p>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">ECOLA / Allowance Payment</h3>
                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure ECOLA and allowance payment rules.</p>

                <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">ECOLA / Allowance Payment</label>
                        <input type="number" min="0" step="0.01" placeholder="e.g. 100.00" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="ecolaTaxable" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="ecolaTaxable" class="text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA is Taxable</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="ecolaRestDays" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="ecolaRestDays" class="text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA on Rest Days</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="ecolaHolidays" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="ecolaHolidays" class="text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA on Holidays</label>
                    </div>
                </div>
            </div>

            <div class="my-8 border-t border-gray-200 dark:border-gray-600"></div>

            <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Statutory Deductions</h3>
                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure mandatory government deductions and tax treatment.</p>

                <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="withholdTax" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="withholdTax" class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold Tax</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="useFixedTaxRate" disabled class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="useFixedTaxRate" class="text-sm font-medium text-gray-400 dark:text-gray-500">Use Fixed Rate for Tax</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="withholdSSS" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="withholdSSS" class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold SSS</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="halfSSS" disabled class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="halfSSS" class="text-sm font-medium text-gray-400 dark:text-gray-500">Half SSS (Monthly-Basis Employees Only)</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="sssAddOn" disabled class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="sssAddOn" class="text-sm font-medium text-gray-400 dark:text-gray-500">SSS Add-On</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="withholdPhilHealth" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="withholdPhilHealth" class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold PhilHealth</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="philHealthAddOn" disabled class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="philHealthAddOn" class="text-sm font-medium text-gray-400 dark:text-gray-500">PhilHealth Add-On</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="withholdPagibig" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="withholdPagibig" class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold Pag-IBIG</label>
                    </div>

                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="excludeGovernmentFromTax" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="excludeGovernmentFromTax" class="text-sm font-medium text-gray-700 dark:text-gray-200">Exclude SSS, Pag-IBIG from Tax</label>
                    </div>
                </div>
            </div>
        </section>
                

        <section class="min-h-120 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="fa-solid fa-file-invoice text-xl text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Billing & Administration</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure billing, administrative fees, and payroll billing options.</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Admin Fee</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 10.00"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">VAT</label>
                    <input type="number" min="0" step="0.01" placeholder="e.g. 12.00"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">VAT Reference</label>
                    <input type="text" placeholder="Not in your list" disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Billing Schedule</label>
                    <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="">Select Billing Schedule</option>
                        <option value="semi_monthly">Semi-Monthly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Billing Template</label>
                    <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="">Select Billing Template</option>
                    </select>
                </div>

                <div class="flex items-center gap-3">
                    <input type="checkbox" id="mealOnBill" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                    <label for="mealOnBill" class="text-sm font-medium text-gray-700 dark:text-gray-200">Meal on Bill</label>
                </div>

                <div class="flex items-center gap-3">
                    <input type="checkbox" id="valeOnBill" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                    <label for="valeOnBill" class="text-sm font-medium text-gray-700 dark:text-gray-200">Vale on Bill</label>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Severance Pay</label>
                    <input type="text" placeholder="Not in your list" disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cut-off Period</label>
                    <input type="text" placeholder="Not in your list" disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Pick-up of DTR</label>
                    <input type="text" placeholder="Not in your list" disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Salary Release</label>
                    <input type="text" placeholder="Not in your list" disabled
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 px-3 py-2.5 cursor-not-allowed">
                </div>
            </div>
        </section>

    </div>
</div>