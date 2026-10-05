
<!-- Client List --> 
<div id="clientListingView" class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
    <section class="overflow-hidden">
        <div class="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-600"> 
            <div class="flex flex-col sm:flex-row sm:items-center gap-3"> 
                <div class="relative flex-1"> 
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none"></i> 
                    <input 
                        type="text" 
                        id="clientListSearch" 
                        autocomplete="off" 
                        placeholder="Search company..." 
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 cursor-text focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-400"> 
                </div> 
 
                <button 
                    type="button" 
                    id="clientAddButton" 
                    class="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"> 
                    <i class="fa-solid fa-plus mr-2"></i> 
                    Add Client 
                </button> 
            </div> 
        </div> 
 
            <div class="grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_100px] items-center px-4 sm:px-5 h-10 border-b border-gray-100 dark:border-gray-800">

                <div class="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Client ID
                </div>

                <div class="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Client Name
                </div>

                    <div class="flex items-center justify-end">
                        <button
                            type="button"
                            id="clientSortButton"
                            title="Sort clients"
                            aria-haspopup="true"
                            aria-expanded="false"
                            class="inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">

                            <span class="text-xs font-semibold uppercase">
                                Sort
                            </span>

                            <i class="fa-solid fa-arrow-down-a-z text-lg"></i>
                        </button>
                    </div>
            </div>
 
        <div id="clientList" class="px-3 sm:px-4 py-3 space-y-2"> 
        </div> 
    </section> 
</div> 
 
<!-- Client Form --> 
<div id="clientFormView" class="hidden"> 
 
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl"> 
        <button 
            type="button" 
            id="clientBackToListButton" 
            class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"> 
            <i class="fa-solid fa-arrow-left mr-2"></i> 
            Back to Client List 
        </button> 
    </div> 
 
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5"> 
        <div class="space-y-6"> 
 
            <section class="sticky top-16.25 z-40 min-h-16 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-md px-3 sm:px-4 py-3"> 
                <div class="relative flex flex-col gap-3 md:flex-row md:items-center"> 
                    <div class="flex w-full items-center gap-2 sm:gap-3 md:w-auto md:shrink-0"> 
                        <button type="button" id="clientEditButton" class="flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"> 
                            <i class="fa-solid fa-plus mr-2"></i>Add Client 
                        </button> 
 
                        <button type="button" id="clientSaveButton" disabled class="flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl transition-colors cursor-not-allowed"> 
                            <i class="fa-solid fa-floppy-disk mr-2"></i>Save 
                        </button> 
                    </div> 
 
                    <div class="relative w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-120 lg:w-140"> 
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i> 
 
                        <input type="text" id="clientSearch" placeholder="Search or select client..." autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="clientSearchList" class="w-full pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"> 
 
                        <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i> 
 
                        <div id="clientSearchResults" class="hidden absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden"> 
                            <div id="clientSearchList" class="max-h-64 overflow-y-auto" role="listbox"></div> 
                        </div> 
                    </div> 
                </div> 
            </section> 
 
            <section class="min-h-40 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8"> 
                <div class="flex items-center gap-4 mb-6"> 
                    <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center"> 
                        <i class="fa-solid fa-user-group text-xl text-green-600 dark:text-green-400"></i> 
                    </div> 
                    <div> 
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Client Information</h2> 
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Client profile and company information.</p> 
                    </div> 
                </div> 
 
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div> 
                        <label for="clientName" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Name</label> 
                        <input type="text" id="clientName" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="clientAddress" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Address</label> 
                        <input type="text" id="clientAddress" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="clientContact" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Contact</label> 
                        <input type="text" id="clientContact" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="alternativeContact" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Alternative Contact</label> 
                        <input type="text" id="alternativeContact" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="clientOwner" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Owner</label> 
                        <input type="text" id="clientOwner" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="contactPerson" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Contact Person</label> 
                        <input type="text" id="contactPerson" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="contactPosition" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Contact Position</label> 
                        <input type="text" id="contactPosition" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="clientAssistant" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Client Assistant</label> 
                        <input type="text" id="clientAssistant" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="assistantPosition" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Assistant Position</label> 
                        <input type="text" id="assistantPosition" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="permitNo" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Permit No.</label> 
                        <input type="text" id="permitNo" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="bankName" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Bank Name</label> 
                        <input type="text" id="bankName" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
 
                    <div> 
                        <label for="accountNo" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Account No.</label> 
                        <input type="text" id="accountNo" readonly class="client-field w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-400 dark:text-gray-400 outline-none cursor-not-allowed transition"> 
                    </div> 
                </div> 
            </section> 
 
            <section class="min-h-80 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8"> 
                <div class="flex items-center gap-4"> 
                    <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center"> 
                        <i class="fa-solid fa-gears text-xl text-green-600 dark:text-green-400"></i> 
                    </div> 
                    <div> 
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Payroll Configuration</h2> 
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure client-specific payroll settings.</p> 
                    </div> 
                </div> 
 
                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> 
                    <div> 
                        <label for="payrollFrequency" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payroll Frequency / Cutoff</label> 
                        <select id="payrollFrequency" disabled class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                            <option value="semi_monthly">Semi-Monthly</option> 
                            <option value="monthly">Monthly</option> 
                            <option value="weekly">Weekly</option> 
                        </select> 
                    </div> 
 
                    <div> 
                        <label for="workingDaysPerCutoff" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Cutoff</label> 
                        <input type="number" id="workingDaysPerCutoff" min="0" step="0.01" placeholder="e.g. 13" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="workingDaysPerYear" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Year</label> 
                        <input type="number" id="workingDaysPerYear" min="0" step="0.01" placeholder="e.g. 312" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="workingDaysPerMonth" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Working Days per Month</label> 
                        <input type="number" id="workingDaysPerMonth" min="0" step="0.01" placeholder="e.g. 26" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="hoursPerDay" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Hours per Day</label> 
                        <input type="number" id="hoursPerDay" min="0" step="0.01" placeholder="e.g. 8" readonly class="config-field w-full rounded-lg border border-gray-300 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div class="flex items-center gap-3 pt-7"> 
                        <input type="checkbox" id="include13thMonth" disabled class="config-field w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                        <label for="include13thMonth" class="text-sm font-medium text-gray-700 dark:text-gray-200">Include 13th Month Pay</label> 
                    </div> 
 
                    <div class="flex items-center gap-3 pt-7"> 
                        <input type="checkbox" id="add13thMonthGross" disabled class="config-field w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
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
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Client-specific payroll and agency settings.</p> 
                    </div> 
                </div> 
 
                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> 
                    <div> 
                        <label for="agencyFeeBasis" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Agency Fee Basis</label> 
                        <select id="agencyFeeBasis" disabled class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                            <option value="agency_rate">Agency Rate</option> 
                            <option value="client_charge_per_day">Client Charge per Day</option> 
                        </select> 
                    </div> 
 
                    <div> 
                        <label for="agencyRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Agency Rate (%)</label> 
                        <input type="number" id="agencyRate" min="0" step="0.01" placeholder="e.g. 10.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="clientChargePerDay" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Client Charge per Day</label> 
                        <input type="number" id="clientChargePerDay" min="0" step="0.01" placeholder="e.g. 100.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="tardinessRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tardiness Rate</label> 
                        <input type="number" id="tardinessRate" min="0" step="0.01" placeholder="e.g. 1.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="lateChargePerMinute" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Late Charge per Minute</label> 
                        <input type="number" id="lateChargePerMinute" min="0" step="0.01" placeholder="e.g. 1.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
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
                        <label for="regularOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Regular Overtime</label> 
                        <input type="number" id="regularOvertimeRate" min="0" step="0.01" placeholder="e.g. 1.25" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="restDayRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Rest Day</label> 
                        <input type="number" id="restDayRate" min="0" step="0.01" placeholder="e.g. 1.30" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="restDayOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Rest Day Overtime</label> 
                        <input type="number" id="restDayOvertimeRate" min="0" step="0.01" placeholder="e.g. 1.69" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="specialHolidayRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday</label> 
                        <input type="number" id="specialHolidayRate" min="0" step="0.01" placeholder="e.g. 1.30" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="legalHolidayRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday</label> 
                        <input type="number" id="legalHolidayRate" min="0" step="0.01" placeholder="e.g. 2.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="nightDifferentialRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Night Differential</label> 
                        <input type="number" id="nightDifferentialRate" min="0" step="0.01" placeholder="e.g. 0.10" readonly class="config-field w-full rounded-lg border border-gray-300 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="specialHolidayOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday Overtime</label> 
                        <input type="number" id="specialHolidayOvertimeRate" min="0" step="0.01" placeholder="e.g. 1.69" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="specialHolidayRestDayRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday on Rest Day</label> 
                        <input type="number" id="specialHolidayRestDayRate" min="0" step="0.01" placeholder="e.g. 1.50" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="specialHolidayRestDayOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Special Holiday on Rest Day, Overtime</label> 
                        <input type="number" id="specialHolidayRestDayOvertimeRate" min="0" step="0.01" placeholder="e.g. 1.95" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="legalHolidayOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday Overtime</label> 
                        <input type="number" id="legalHolidayOvertimeRate" min="0" step="0.01" placeholder="e.g. 2.60" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="legalHolidayRestDayRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday on Rest Day</label> 
                        <input type="number" id="legalHolidayRestDayRate" min="0" step="0.01" placeholder="e.g. 2.60" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
 
                    <div> 
                        <label for="legalHolidayRestDayOvertimeRate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Legal Holiday on Rest Day, Overtime</label> 
                        <input type="number" id="legalHolidayRestDayOvertimeRate" min="0" step="0.01" placeholder="e.g. 3.38" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                    </div> 
                </div> 
            </section> 
 
            <section class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8"> 
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
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure ECOLA amount and payment rules.</p> 
 
                    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> 
                        <div> 
                            <label for="ecolaAllowancePayment" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">ECOLA / Allowance Payment</label> 
                            <input type="number" id="ecolaAllowancePayment" min="0" step="0.01" placeholder="e.g. 100.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
                    </div> 
 
                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
                        <label for="ecolaTaxable" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                            <input type="checkbox" id="ecolaTaxable" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                            <span> 
                                <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA is Taxable</span> 
                                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Include ECOLA in taxable income.</span> 
                            </span> 
                        </label> 
 
                        <label for="ecolaRestDays" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                            <input type="checkbox" id="ecolaRestDays" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                            <span> 
                                <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA on Rest Days</span> 
                                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Apply ECOLA payment to rest-day work.</span> 
                            </span> 
                        </label> 
 
                        <label for="ecolaHolidays" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                            <input type="checkbox" id="ecolaHolidays" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                            <span> 
                                <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">ECOLA on Holidays</span> 
                                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Apply ECOLA payment to holiday work.</span> 
                            </span> 
                        </label> 
                    </div> 
                </div> 
 
                <div class="my-8 border-t border-gray-200 dark:border-gray-600"></div> 
 
                <div> 
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Statutory Deductions</h3> 
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure government deductions, add-ons, and tax treatment.</p> 
 
                    <div class="mt-5"> 
                        <div class="mb-4"> 
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tax Treatment</h4> 
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure how withholding tax is applied.</p> 
                        </div> 
 
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
                            <label for="withholdTax" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                                <input type="checkbox" id="withholdTax" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                <span> 
                                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Withhold Tax</span> 
                                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Enable withholding tax calculation.</span> 
                                </span> 
                            </label> 
 
                            <label for="useFixedTaxRate" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                                <input type="checkbox" id="useFixedTaxRate" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                <span> 
                                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Use Fixed Rate for Tax</span> 
                                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Use a fixed tax rate instead of the standard calculation.</span> 
                                </span> 
                            </label> 
 
                            <label for="excludeGovernmentFromTax" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                                <input type="checkbox" id="excludeGovernmentFromTax" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                <span> 
                                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Exclude SSS, Pag-IBIG from Tax</span> 
                                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Exclude selected government contributions from taxable income.</span> 
                                </span> 
                            </label> 
                        </div> 
                    </div> 
 
                    <div class="mt-7"> 
                        <div class="mb-4"> 
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Government Contributions</h4> 
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure contribution withholding and client-specific add-ons.</p> 
                        </div> 
 
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
                            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"> 
                                <label for="withholdSSS" class="flex items-center gap-3 cursor-pointer"> 
                                    <input type="checkbox" id="withholdSSS" disabled class="config-field w-4 h-4 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold SSS</span> 
                                </label> 
 
                                <div class="mt-4"> 
                                    <label for="sssAddOn" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">SSS Add-On</label> 
                                    <input type="number" id="sssAddOn" min="0" step="0.01" placeholder="e.g. 0.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                                </div> 
                            </div> 
 
                            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"> 
                                <label for="withholdPhilHealth" class="flex items-center gap-3 cursor-pointer"> 
                                    <input type="checkbox" id="withholdPhilHealth" disabled class="config-field w-4 h-4 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold PhilHealth</span> 
                                </label> 
 
                                <div class="mt-4"> 
                                    <label for="philHealthAddOn" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">PhilHealth Add-On</label> 
                                    <input type="number" id="philHealthAddOn" min="0" step="0.01" placeholder="e.g. 0.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                                </div> 
                            </div> 
 
                            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"> 
                                <label for="withholdPagibig" class="flex items-center gap-3 cursor-pointer"> 
                                    <input type="checkbox" id="withholdPagibig" disabled class="config-field w-4 h-4 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Withhold Pag-IBIG</span> 
                                </label> 
 
                                <div class="mt-4"> 
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Government contribution is applied according to the configured payroll rules.</p> 
                                </div> 
                            </div> 
                        </div> 
 
                        <div class="mt-4"> 
                            <label for="halfSSS" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer max-w-xl"> 
                                <input type="checkbox" id="halfSSS" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                                <span> 
                                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Half SSS</span> 
                                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Apply half SSS for monthly-basis employees only.</span> 
                                </span> 
                            </label> 
                        </div> 
                    </div> 
                </div> 
            </section> 
 
            <section class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-6 sm:p-8"> 
                <div class="flex items-center gap-4"> 
                    <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center"> 
                        <i class="fa-solid fa-file-invoice text-xl text-green-600 dark:text-green-400"></i> 
                    </div> 
                    <div> 
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Billing & Administration</h2> 
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure billing values, schedules, templates, and billing options.</p> 
                    </div> 
                </div> 
 
                <div class="mt-8"> 
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Billing Settings</h3> 
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Configure the client's billing and administrative charges.</p> 
 
                    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> 
                        <div> 
                            <label for="adminFee" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Admin Fee</label> 
                            <input type="number" id="adminFee" min="0" step="0.01" placeholder="e.g. 10.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="vat" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">VAT</label> 
                            <input type="number" id="vat" min="0" step="0.01" placeholder="e.g. 12.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="vatReference" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">VAT Reference</label> 
                            <input type="text" id="vatReference" placeholder="e.g. VAT Inclusive" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="billingSchedule" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Billing Schedule</label> 
                            <select id="billingSchedule" disabled class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                                <option value="">Select Billing Schedule</option> 
                                <option value="semi_monthly">Semi-Monthly</option> 
                                <option value="monthly">Monthly</option> 
                            </select> 
                        </div> 
 
                        <div> 
                            <label for="billingTemplate" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Billing Template</label> 
                            <select id="billingTemplate" disabled class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                                <option value="">Select Billing Template</option> 
                                <option value="standard">Standard</option> 
                                <option value="detailed">Detailed</option> 
                            </select> 
                        </div> 
 
                        <div> 
                            <label for="cutoffPeriod" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cut-off Period</label> 
                            <input type="text" id="cutoffPeriod" placeholder="e.g. 1-15 / 16-30" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="pickupDtr" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Pick-up of DTR</label> 
                            <input type="text" id="pickupDtr" value="Not configured" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="salaryRelease" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Salary Release</label> 
                            <input type="text" id="salaryRelease" value="Not configured" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
 
                        <div> 
                            <label for="severancePay" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Severance Pay</label> 
                            <input type="number" id="severancePay" min="0" step="0.01" placeholder="e.g. 0.00" readonly class="config-field w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 px-3 py-2.5 cursor-not-allowed"> 
                        </div> 
                    </div> 
                </div> 
 
                <div class="my-8 border-t border-gray-200 dark:border-gray-600"></div> 
 
                <div> 
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Billing Options</h3> 
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Select which employee-related items should be included on the client bill.</p> 
 
                    <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> 
                        <label for="mealOnBill" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                            <input type="checkbox" id="mealOnBill" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                            <span> 
                                <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Meal on Bill</span> 
                                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Include meal charges on the client bill.</span> 
                            </span> 
                        </label> 
 
                        <label for="valeOnBill" class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer"> 
                            <input type="checkbox" id="valeOnBill" disabled class="config-field w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-not-allowed"> 
                            <span> 
                                <span class="block text-sm font-medium text-gray-700 dark:text-gray-200">Vale on Bill</span> 
                                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Include employee vale charges on the client bill.</span> 
                            </span> 
                        </label> 
                    </div> 
                </div> 
            </section> 
 
        </div> 
    </div> 
</div>