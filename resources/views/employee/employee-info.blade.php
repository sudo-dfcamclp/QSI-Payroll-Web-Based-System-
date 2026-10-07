<!-- Employee List --> 
<div id="employeeListingView" class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-7xl"> 
    <section class="overflow-visible"> 
        <div class="px-3 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-600"> 
            <div class="flex flex-col sm:flex-row sm:items-center gap-3"> 
                <div class="relative flex-1 min-w-0"> 
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none"></i> 
                    <input type="text" id="employeeListSearch" autocomplete="off" placeholder="Search employee..." class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 cursor-text focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-400"> 
                </div> 
                <button type="button" id="employeeAddButton" class="inline-flex items-center justify-center w-full sm:w-auto shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"><i class="fa-solid fa-plus mr-2"></i>Add Employee</button> 
            </div> 
        </div> 
 
        <!-- Employee Sort --> 
        <div class="relative grid grid-cols-[120px_1fr_auto] items-center px-3 sm:px-5 h-10 border-b border-gray-100 dark:border-gray-800"> 
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Employee ID</div> 
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Employee Name</div> 
            <button type="button" id="employeeSortButton" title="Sort employees" aria-haspopup="true" aria-expanded="false" class="inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"> 
                <span class="text-xs font-semibold uppercase">Sort</span> 
                <i class="fa-solid fa-arrow-down-a-z text-lg"></i> 
            </button> 
        </div> 
        <div id="employeeList" class="px-2 sm:px-3 md:px-4 py-3 space-y-2"></div> 
        <div id="employeeListPagination" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 md:px-5 py-4 border-t border-gray-100 dark:border-gray-700"></div> 
    </section> 
</div> 
 
<!-- Employee Form --> 
<div id="employeeFormView" class="hidden"> 
    <div class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 max-w-7xl"> 
        <button type="button" id="employeeBackButton" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"><i class="fa-solid fa-arrow-left mr-2"></i>Back to Employee List</button> 
    </div> 
 
    <div class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-10 max-w-7xl"> 
 
        <!-- Page Header --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 px-4 sm:px-6 py-4 mb-5 sm:mb-6"> 
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"> 
                <div class="min-w-0"> 
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Employee Master</h1> 
                    <p id="employeeSubtitle" class="text-sm text-gray-500 dark:text-gray-300 mt-0.5 truncate">Employee: None selected</p> 
                </div> 
            </div> 
        </div> 
 
        <!-- Toolbar --> 
        <section class="sticky top-16.25 z-40 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-md px-2 sm:px-3 py-2 mb-5 sm:mb-6"> 
            <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0 min-h-10"> 
 
                <!-- Action Buttons --> 
                <div id="employeeActionButtons" class="flex items-center gap-2 w-full lg:w-[250px] shrink-0 overflow-x-auto lg:overflow-visible"> 
                    <button type="button" id="employeeFormAddButton" class="flex-1 lg:flex-none px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"> 
                        <i class="fa-solid fa-plus mr-1.5"></i>Add 
                    </button> 
 
                    <button type="button" id="employeeEditButton" disabled class="flex-1 lg:flex-none px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"> 
                        <i class="fa-solid fa-pen mr-1.5"></i>Edit 
                    </button> 
 
                    <button type="button" id="employeeSaveButton" class="hidden flex-1 lg:flex-none px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"> 
                        <i class="fa-solid fa-floppy-disk mr-1.5"></i>Save 
                    </button> 
 
                    <button type="button" id="employeeCancelButton" class="hidden flex-1 lg:flex-none px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"> 
                        <i class="fa-solid fa-xmark mr-1.5"></i>Cancel 
                    </button> 
                </div> 
 
                <!-- Search --> 
                <div class="relative w-full lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px] min-w-0"> 
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i> 
 
                    <input type="text" id="employeeSearch" placeholder="Search Employee..." autocomplete="off" class="w-full pl-9 pr-9 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"> 
 
                    <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i> 
 
                    <div id="employeeSearchResults" class="hidden absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"> 
                        <div id="employeeSearchList" class="max-h-64 overflow-y-auto"></div> 
                    </div> 
                </div> 
 
            </div> 
        </section> 
 
        <!-- Basic Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-5 sm:mb-6"> 
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"> 
                <div> 
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Basic Information</h2> 
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Complete list of registered employees in the system.</p> 
                </div> 
            </div> 
 
            <form id="employeeForm" enctype="multipart/form-data"> 
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"> 
 
                    <!-- Profile --> 
                    <div class="lg:col-span-3 flex flex-col items-center"> 
                        <div class="w-full max-w-sm lg:max-w-none aspect-square lg:aspect-auto lg:min-h-[280px] bg-gray-200 dark:bg-gray-600 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-500 hover:border-green-500 transition-colors cursor-pointer group relative"> 
                            <img id="employeeProfilePreview" src="" alt="Employee Profile" class="hidden absolute inset-0 w-full h-full object-cover"> 
                            <div id="employeeProfilePlaceholder" class="text-center p-4"> 
                                <i class="fa-solid fa-camera text-4xl text-gray-400 dark:text-gray-300 group-hover:text-green-500 transition-colors mb-2"></i> 
                                <p class="text-xs text-gray-500 dark:text-gray-300 font-medium">Upload Photo</p> 
                            </div> 
                            <input type="file" name="profile_photo" id="profilePhoto" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"> 
                        </div> 
                    </div> 
 
                    <!-- Employee Information --> 
                    <div class="lg:col-span-9 min-w-0"> 
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"> 
 
                            <!-- Employee No --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Employee No</label> 
                                <input type="text" name="emp_id" placeholder="..." readonly class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all"> 
                            </div> 
 
                            <!-- Client --> 
                            <div class="relative"> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Company</label> 
                                <input type="hidden" name="client_id"> 
                                <div class="relative"> 
                                    <input type="text" id="employeeClientInput" placeholder="Search or select company..." autocomplete="off" readonly class="w-full px-4 pr-10 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed"> 
                                    <i id="employeeClientIcon" class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none transition-transform"></i> 
                                </div> 
                                <input type="text" id="employeeClientIdDisplay" readonly placeholder="Client ID" class="mt-2 w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-xs text-gray-500 dark:text-gray-300 cursor-not-allowed"> 
                                <div id="employeeClientDropdown" class="hidden absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"> 
                                    <div class="p-2 border-b border-gray-100 dark:border-gray-600"> 
                                        <input type="text" id="employeeClientSearch" placeholder="Search company..." autocomplete="off" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"> 
                                    </div> 
                                    <div id="employeeClientList" class="max-h-60 overflow-y-auto"></div> 
                                </div> 
                            </div> 
 
                            <!-- Contact No --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Contact No</label> 
                                <input type="text" name="contact_no" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- Badge No --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Badge No</label> 
                                <input type="text" name="badge_no" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- Nick Name --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Nick Name</label> 
                                <input type="text" name="nickname" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- Last Name --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Last Name</label> 
                                <input type="text" name="last_name" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- First Name --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">First Name</label> 
                                <input type="text" name="first_name" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- Middle Name --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Middle Name</label> 
                                <input type="text" name="middle_name" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
 
                            <!-- Suffix Name --> 
                            <div> 
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Suffix Name</label> 
                                <input type="text" name="suffix_name" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                            </div> 
                        </div> 
                    </div> 
                </div> 
        </div> 
 
        <!-- Personal Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-5 sm:mb-6"> 
            <div class="flex items-center justify-between mb-6"> 
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-user-pen text-blue-500 mr-2"></i>Personal Information</h3> 
            </div> 
 
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6"> 
 
                <!-- Left Column --> 
                <div class="grid grid-cols-1 gap-5"> 
                    <!-- Birthday --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Birthday:</label> 
                        <input type="date" name="birth_date" class="w-full min-w-0 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Birth Place --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Birth Place:</label> 
                        <input type="text" name="birth_place" placeholder="STA. ANA MANILA" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Citizenship --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Citizenship:</label> 
                        <input type="text" name="citizenship" placeholder="FILIPINO" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Gender --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Gender:</label> 
                        <select name="gender" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"> 
                            <option value="">Select Gender</option> 
                            <option value="male">Male</option> 
                            <option value="female">Female</option> 
                        </select> 
                    </div> 
 
                    <!-- Civil Status --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Civil Status:</label> 
                        <select name="civil_status" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"> 
                            <option value="">Select Civil Status</option> 
                            <option value="single">SINGLE</option> 
                            <option value="married">MARRIED</option> 
                            <option value="widowed">WIDOWED</option> 
                            <option value="divorced">DIVORCED</option> 
                        </select> 
                    </div> 
 
                    <!-- Weight --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Weight:</label> 
                        <div class="relative min-w-0"> 
                            <input type="number" step="0.01" name="weight" placeholder="108" class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"> 
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-300 font-medium">LBS.</span> 
                        </div> 
                    </div> 
 
                    <!-- Height --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Height:</label> 
                        <input type="number" step="0.01" name="height" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Religion --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Religion:</label> 
                        <input type="text" name="religion" placeholder="CATHOLIC" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
                </div> 
 
                <!-- Right Column --> 
                <div class="grid grid-cols-1 gap-5"> 
                    <!-- House No --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">House No:</label> 
                        <input type="text" name="house_no" placeholder="356" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Street --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Street:</label> 
                        <input type="text" name="street" placeholder="D. EDANG STS." class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Barangay --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Barangay:</label> 
                        <input type="text" name="barangay" placeholder="BRGY. 149 ZONE" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- District --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">District:</label> 
                        <input type="text" name="district" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- City --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">City:</label> 
                        <input type="text" name="city" placeholder="PASAY CITY" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Town --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Town:</label> 
                        <input type="text" name="town" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Contact --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Contact:</label> 
                        <input type="text" name="contact" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
 
                    <!-- Phone --> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Phone:</label> 
                        <input type="text" name="phone" placeholder="$EA237126" class="w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                    </div> 
                </div> 
            </div> 
        </div> 
 
        <!-- Education + Mandatory Numbers --> 
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6"> 
 
            <!-- Education --> 
            <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6"> 
                <div class="flex items-center justify-between mb-6"> 
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-graduation-cap text-purple-600 dark:text-purple-400 mr-2"></i>Education</h3> 
                </div> 
 
                <div class="grid grid-cols-1 gap-4"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Primary:</label><input type="text" name="primary_education" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Secondary:</label><input type="text" name="secondary_education" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">College:</label><input type="text" name="college" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Degree:</label><input type="text" name="degree" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Major:</label><input type="text" name="major" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Post Grad:</label><input type="text" name="post_grad" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Course:</label><input type="text" name="course" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"></div> 
                </div> 
            </div> 
 
            <!-- Mandatory Numbers --> 
            <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6"> 
                <div class="flex items-center justify-between mb-6"> 
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-id-card text-blue-600 dark:text-blue-400 mr-2"></i>Mandatory Numbers</h3> 
                </div> 
 
                <div class="grid grid-cols-1 gap-4"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">SSS:</label><input type="text" name="sss_no" placeholder="3462492091" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">PhilHealth:</label><input type="text" name="philhealth_no" placeholder="620267885789" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">Pag-ibig:</label><input type="text" name="pagibig_no" placeholder="121181838232" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"><label class="text-sm font-bold text-gray-700 dark:text-gray-200">TIN:</label><input type="text" name="tin_no" placeholder="761594402" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-600 border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div> 
                </div> 
            </div> 
        </div> 
 
        <!-- Employment Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-5 sm:mb-6"> 
            <div class="flex items-center justify-between mb-6"> 
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-briefcase text-indigo-600 dark:text-indigo-400 mr-2"></i>Employment Information</h3> 
            </div> 
 
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 xl:gap-x-8 gap-y-5"> 
 
                <!-- Status --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Status:</label> 
                    <select name="employment_status" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"> 
                        <option value="">Select Status</option> 
                        <option value="regular">R-Regular</option> 
                        <option value="probationary">Probationary</option> 
                        <option value="contractual">Contractual</option> 
                    </select> 
                </div> 
 
                <!-- Remarks --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Remarks:</label> 
                    <input type="text" name="remarks" placeholder="09-1-0152" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Position --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Position:</label> 
                    <input type="text" name="position" placeholder="Enter Position" autocomplete="off" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Company --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Company:</label> 
                    <input type="text" name="company" placeholder="W GLOBAL REALTY, INC - HOUSEKEEPING" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Branch --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Branch:</label> 
                    <select name="branch" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"> 
                        <option value="">Select Branch</option> 
                        <option value="Main Branch">Main Branch</option> 
                        <option value="North Branch">North Branch</option> 
                    </select> 
                </div> 
 
                <!-- Department --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Department:</label> 
                    <select name="department" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"> 
                        <option value="">Select Department</option> 
                        <option value="Ladies Accessories">Ladies Accessories</option> 
                        <option value="Mens Wear">Mens Wear</option> 
                        <option value="Electronics">Electronics</option> 
                    </select> 
                </div> 
 
                <!-- Date Hired --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Hired:</label> 
                    <input type="date" name="date_hired" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Date Resigned --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Resigned:</label> 
                    <input type="date" name="date_resigned" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Start Contract --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Start Contract:</label> 
                    <input type="date" name="start_contract" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- End Contract --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">End Contract:</label> 
                    <input type="date" name="end_contract" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Rate Basis --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Rate Basis:</label> 
                    <select name="rate_basis" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"> 
                        <option value="">Select Rate Basis</option> 
                        <option value="Daily">Daily</option> 
                        <option value="Monthly">Monthly</option> 
                        <option value="Hourly">Hourly</option> 
                    </select> 
                </div> 
 
                <!-- Month No --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Month No:</label> 
                    <input type="number" name="month_no" placeholder="6" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Hourly Rate --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Hourly Rate:</label> 
                    <input type="number" step="0.01" name="hourly_rate" placeholder="86.63" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Daily Rate --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Daily Rate:</label> 
                    <input type="number" step="0.01" name="daily_rate" placeholder="645" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Monthly Rate --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Monthly Rate:</label> 
                    <input type="number" step="0.01" name="monthly_rate" placeholder="14821.60" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Date Reg --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Reg:</label> 
                    <input type="date" name="date_reg" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Date Prob --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Prob:</label> 
                    <input type="date" name="date_prob" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Insurance No --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Insurance No:</label> 
                    <input type="text" name="insurance_no" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Agency Fee --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Agency Fee:</label> 
                    <input type="number" step="0.01" name="agency_fee" placeholder="12" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Agency --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Agency:</label> 
                    <select name="agency" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"> 
                        <option value="">Select Agency</option> 
                        <option value="SPAI">QSI</option> 
                        <option value="None">None</option> 
                    </select> 
                </div> 
 
                <!-- Account No --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Account No:</label> 
                    <input type="text" name="account_no" placeholder="109661898696" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Expanded Tax --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Expanded Tax:</label> 
                    <input type="number" step="0.01" name="expanded_tax" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- Allowance --> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Allowance:</label> 
                    <input type="number" step="0.01" name="allowance" placeholder="0" class="w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"> 
                </div> 
 
                <!-- With Ecol --> 
                <div class="flex items-center gap-3 pt-2"> 
                    <input type="checkbox" name="with_ecol" id="withEcol" value="1" class="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"> 
                    <label for="withEcol" class="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer">With Ecol</label> 
                </div> 
            </div> 
        </div> 
 
        <!-- Employment History --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-5 sm:mb-6"> 
            <div class="flex items-center justify-between mb-6"> 
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-clock-rotate-left text-indigo-600 dark:text-indigo-400 mr-2"></i>Employment History</h3> 
            </div> 
 
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600"> 
                <table class="w-full min-w-[900px] text-sm text-left text-gray-500 dark:text-gray-300"> 
                    <thead class="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500"> 
                        <tr> 
                            <th class="px-6 py-3 font-bold">Agency</th> 
                            <th class="px-6 py-3 font-bold">ControlNo</th> 
                            <th class="px-6 py-3 font-bold">ClientName</th> 
                            <th class="px-6 py-3 font-bold">StartContract</th> 
                            <th class="px-6 py-3 font-bold">EndContract</th> 
                            <th class="px-6 py-3 font-bold text-center">Actions</th> 
                        </tr> 
                    </thead> 
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-700"> 
                        <tr> 
                            <td colspan="6" class="px-6 py-12 text-center"> 
                                <div class="flex flex-col items-center justify-center"> 
                                    <i class="fa-solid fa-inbox text-4xl text-gray-300 dark:text-gray-500 mb-3"></i> 
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-300">No employment history records found.</p> 
                                    <p class="text-xs text-gray-400 dark:text-gray-400 mt-1">Click "Add Record" to create a new entry.</p> 
                                </div> 
                            </td> 
                        </tr> 
                    </tbody> 
                </table> 
            </div> 
        </div> 
 
            </form> 
        </div> 
    </div> 
</div>