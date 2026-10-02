<!-- Employee Information --> 
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl"> 
    <!-- Toolbar --> 
    <section class="sticky top-16.25 z-40 min-h-16 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-md px-3 sm:px-4 py-3 mb-6"> 
        <div class="relative flex flex-col gap-3 md:flex-row md:items-center"> 
            <div id="employeeActionButtons" class="flex w-full items-center gap-2 sm:gap-3 md:w-auto md:shrink-0"> 
                <button type="button" id="employeeAddButton" class="flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"> 
                    <i class="fa-solid fa-plus mr-2"></i>Add 
                </button> 
                <button type="button" id="employeeEditButton" disabled class="flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed"> 
                    <i class="fa-solid fa-pen mr-2"></i>Edit 
                </button> 
                <button type="button" id="employeeSaveButton" class="hidden flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"> 
                    <i class="fa-solid fa-floppy-disk mr-2"></i>Save 
                </button> 
                <button type="button" id="employeeCancelButton" class="hidden flex-1 md:flex-none px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"> 
                    <i class="fa-solid fa-xmark mr-2"></i>Cancel 
                </button> 
            </div> 
 
            <div id="employeeSearchContainer" class="relative w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-120 lg:w-140"> 
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i> 
                <input type="text" id="employeeSearch" placeholder="Search or select employee..." autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="employeeSearchList" class="w-full pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition cursor-text"> 
                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i> 
                <div id="employeeSearchResults" class="hidden absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden"> 
                    <div id="employeeSearchList" class="max-h-64 overflow-y-auto" role="listbox"></div> 
                </div> 
            </div> 
 
            <div class="flex w-full items-center justify-center gap-2 md:ml-auto md:w-auto md:shrink-0"> 
                <button type="button" id="employeePreviousButton" disabled class="px-2.5 py-2.5 border border-gray-300 dark:border-gray-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-200 text-sm opacity-50 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed"> 
                    <i class="fa-solid fa-angles-left"></i> 
                </button> 
                <span id="employeeRecordCounter" class="text-sm text-gray-600 dark:text-gray-200 px-2 font-medium whitespace-nowrap">0 of 0</span> 
                <button type="button" id="employeeNextButton" disabled class="px-2.5 py-2.5 border border-gray-300 dark:border-gray-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-200 text-sm opacity-50 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed"> 
                    <i class="fa-solid fa-angles-right"></i> 
                </button> 
            </div> 
        </div> 
    </section> 
 
    <form id="employeeForm" enctype="multipart/form-data"> 
        <!-- Basic Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-6"> 
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"> 
                <div> 
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Basic Information</h2> 
                    <p id="employeeSubtitle" class="text-sm text-gray-500 dark:text-gray-300 mt-1">Complete list of registered employees in the system.</p> 
                </div> 
            </div> 
 
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"> 
                <!-- Profile --> 
                <div class="lg:col-span-3 flex flex-col items-center"> 
                    <div id="employeeProfileUpload" class="w-full max-w-sm lg:max-w-none aspect-square lg:aspect-auto lg:min-h-[280px] bg-gray-100 dark:bg-gray-600 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-500 transition-colors group relative cursor-not-allowed opacity-60"> 
                        <img id="employeeProfilePreview" src="" alt="Employee Profile" class="hidden absolute inset-0 w-full h-full object-cover"> 
                        <div id="employeeProfilePlaceholder" class="text-center p-4"> 
                            <i class="fa-solid fa-camera text-4xl text-gray-400 dark:text-gray-300 transition-colors mb-2"></i> 
                            <p class="text-xs text-gray-500 dark:text-gray-300 font-medium">Upload Photo</p> 
                        </div> 
                        <input type="file" name="profile_photo" id="profilePhoto" accept="image/*" disabled class="absolute inset-0 w-full h-full opacity-0 cursor-not-allowed"> 
                    </div> 
                </div> 
 
                <!-- Employee Information --> 
                <div class="lg:col-span-9"> 
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"> 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Employee No</label> 
                            <input type="text" name="emp_id" placeholder="Employee No" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Client ID</label>
                            <input type="text" id="employeeClientIdDisplay" readonly value="" placeholder="Automatically assigned" class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                        </div>
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Contact No</label> 
                            <input type="text" name="contact_no" placeholder="Contact No" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Badge No</label> 
                            <input type="text" name="badge_no" placeholder="Badge No" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Nick Name</label> 
                            <input type="text" name="nickname" placeholder="Nickname" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Last Name</label> 
                            <input type="text" name="last_name" placeholder="Last Name" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">First Name</label> 
                            <input type="text" name="first_name" placeholder="First Name" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Middle Name</label> 
                            <input type="text" name="middle_name" placeholder="Middle Name" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
 
                        <div> 
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Suffix Name</label> 
                            <input type="text" name="suffix_name" placeholder="Suffix" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        </div> 
                    </div> 
                </div> 
            </div> 
        </div> 
 
        <!-- Personal Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-6"> 
            <div class="flex items-center justify-between mb-6"> 
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-user-pen text-blue-500 mr-2"></i>Personal Information</h3> 
            </div> 
 
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6"> 
                <div class="grid grid-cols-1 gap-5"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Birthday:</label> 
                        <input type="date" name="birth_date" readonly class="employee-field w-full min-w-0 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Birth Place:</label> 
                        <input type="text" name="birth_place" placeholder="Birth Place" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Citizenship:</label> 
                        <input type="text" name="citizenship" placeholder="Citizenship" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Gender:</label> 
                        <select name="gender" disabled class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                            <option value="">Select Gender</option> 
                            <option value="male">Male</option> 
                            <option value="female">Female</option> 
                        </select> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Civil Status:</label> 
                        <select name="civil_status" disabled class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                            <option value="">Select Civil Status</option> 
                            <option value="single">SINGLE</option> 
                            <option value="married">MARRIED</option> 
                            <option value="widowed">WIDOWED</option> 
                            <option value="divorced">DIVORCED</option> 
                        </select> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Weight:</label> 
                        <div class="relative min-w-0"> 
                            <input type="number" step="0.01" name="weight" placeholder="Weight" readonly class="employee-field w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all pr-12 cursor-not-allowed opacity-60"> 
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-300 font-medium">LBS.</span> 
                        </div> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Height:</label> 
                        <input type="number" step="0.01" name="height" placeholder="Height" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Religion:</label> 
                        <input type="text" name="religion" placeholder="Religion" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                </div> 
 
                <div class="grid grid-cols-1 gap-5"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">House No:</label> 
                        <input type="text" name="house_no" placeholder="House No" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Street:</label> 
                        <input type="text" name="street" placeholder="Street" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Barangay:</label> 
                        <input type="text" name="barangay" placeholder="Barangay" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">District:</label> 
                        <input type="text" name="district" placeholder="District" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">City:</label> 
                        <input type="text" name="city" placeholder="City" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Town:</label> 
                        <input type="text" name="town" placeholder="Town" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Contact:</label> 
                        <input type="text" name="contact" placeholder="Contact" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
 
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Phone:</label> 
                        <input type="text" name="phone" placeholder="Phone" readonly class="employee-field w-full min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                </div> 
            </div> 
        </div> 
 
        <!-- Education + Mandatory Numbers --> 
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"> 
            <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6"> 
                <div class="flex items-center justify-between mb-6"> 
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-graduation-cap text-purple-600 dark:text-purple-400 mr-2"></i>Education</h3> 
                </div> 
                <div class="grid grid-cols-1 gap-4"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Primary:</label> 
                        <input type="text" name="primary_education" placeholder="Primary Education" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Secondary:</label> 
                        <input type="text" name="secondary_education" placeholder="Secondary Education" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">College:</label> 
                        <input type="text" name="college" placeholder="College" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Degree:</label> 
                        <input type="text" name="degree" placeholder="Degree" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Major:</label> 
                        <input type="text" name="major" placeholder="Major" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Post Grad:</label> 
                        <input type="text" name="post_grad" placeholder="Post Graduate" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Course:</label> 
                        <input type="text" name="course" placeholder="Course" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                </div> 
            </div> 
 
            <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6"> 
                <div class="flex items-center justify-between mb-6"> 
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-id-card text-blue-600 dark:text-blue-400 mr-2"></i>Mandatory Numbers</h3> 
                </div> 
                <div class="grid grid-cols-1 gap-4"> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">SSS:</label> 
                        <input type="text" name="sss_no" placeholder="SSS No." readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">PhilHealth:</label> 
                        <input type="text" name="philhealth_no" placeholder="PhilHealth No." readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Pag-ibig:</label> 
                        <input type="text" name="pagibig_no" placeholder="Pag-IBIG No." readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                    <div class="grid grid-cols-1 sm:grid-cols-[90px_minmax(0,1fr)] items-center gap-2 sm:gap-4"> 
                        <label class="text-sm font-bold text-gray-700 dark:text-gray-200">TIN:</label> 
                        <input type="text" name="tin_no" placeholder="TIN" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                    </div> 
                </div> 
            </div> 
        </div> 
 
        <!-- Employment Information --> 
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-6"> 
            <div class="flex items-center justify-between mb-6"> 
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-briefcase text-indigo-600 dark:text-indigo-400 mr-2"></i>Employment Information</h3> 
            </div> 
 
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 xl:gap-x-8 gap-y-5"> 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Status:</label> 
                    <select name="employment_status" disabled class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        <option value="">Select Status</option> 
                        <option value="regular">R-Regular</option> 
                        <option value="probationary">Probationary</option> 
                        <option value="contractual">Contractual</option> 
                    </select> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Remarks:</label> 
                    <input type="text" name="remarks" placeholder="Remarks" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Position:</label> 
                    <input type="text" name="position" disabled placeholder="Enter Position" class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Company:</label>
                    <div class="relative min-w-0">
                        <input type="hidden" name="client_id" value="">
                        <input type="text" id="employeeClientInput" autocomplete="off" placeholder="Select Company" disabled class="employee-field w-full min-w-0 px-4 py-2.5 pr-10 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-500 dark:text-gray-300 transition-all cursor-not-allowed opacity-60 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <i id="employeeClientIcon" class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-transform pointer-events-none"></i>
                        <div id="employeeClientDropdown" class="hidden absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl">
                            <div id="employeeClientList" class="max-h-60 overflow-y-auto"></div>
                        </div>
                    </div>
                </div>
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Branch:</label> 
                    <select name="branch" disabled class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        <option value="">Select Branch</option> 
                        <option value="Main Branch">Main Branch</option> 
                        <option value="North Branch">North Branch</option> 
                    </select> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Department:</label> 
                    <select name="department" disabled class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        <option value="">Select Department</option> 
                        <option value="Ladies Accessories">Ladies Accessories</option> 
                        <option value="Mens Wear">Mens Wear</option> 
                        <option value="Electronics">Electronics</option> 
                    </select> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Hired:</label> 
                    <input type="date" name="date_hired" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Resigned:</label> 
                    <input type="date" name="date_resigned" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Start Contract:</label> 
                    <input type="date" name="start_contract" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">End Contract:</label> 
                    <input type="date" name="end_contract" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <!-- Rate Basis -->
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Rate Basis:</label>
                    <select name="rate_basis" disabled class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                        <option value="">Select Rate Basis</option>
                        <option value="Daily">Daily</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Hourly">Hourly</option>
                    </select>
                </div>

                <!-- Month No -->
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Month No:</label>
                    <input type="number" name="month_no" placeholder="Month No" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                </div>

                <!-- Hourly Rate -->
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Hourly Rate:</label>
                    <input type="number" step="0.01" name="hourly_rate" placeholder="Automatically computed" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                </div>

                <!-- Daily Rate -->
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Daily Rate:</label>
                    <input type="number" step="0.01" name="daily_rate" placeholder="Daily Rate" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                </div>

                <!-- Monthly Rate -->
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0">
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Monthly Rate:</label>
                    <input type="number" step="0.01" name="monthly_rate" placeholder="Automatically computed" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60">
                </div>
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Reg:</label> 
                    <input type="date" name="date_reg" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Date Prob:</label> 
                    <input type="date" name="date_prob" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Insurance No:</label> 
                    <input type="text" name="insurance_no" placeholder="Insurance No." readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Agency Fee:</label> 
                    <input type="number" step="0.01" name="agency_fee" placeholder="Agency Fee" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Agency:</label> 
                    <select name="agency" disabled class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                        <option value="">Select Agency</option> 
                        <option value="SPAI">QSI</option> 
                        <option value="None">None</option> 
                    </select> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Account No:</label> 
                    <input type="text" name="account_no" placeholder="Account No." readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Expanded Tax:</label> 
                    <input type="number" step="0.01" name="expanded_tax" placeholder="Expanded Tax" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-center gap-2 sm:gap-4 min-w-0"> 
                    <label class="text-sm font-bold text-gray-700 dark:text-gray-200">Allowance:</label> 
                    <input type="number" step="0.01" name="allowance" placeholder="Allowance" readonly class="employee-field w-full min-w-0 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 transition-all cursor-not-allowed opacity-60"> 
                </div> 
 
                <div class="flex items-center gap-3 pt-2"> 
                    <input type="checkbox" name="with_ecol" id="withEcol" value="1" disabled class="employee-field w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 focus:ring-2 cursor-not-allowed opacity-60"> 
                    <label for="withEcol" class="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-not-allowed">With Ecol</label> 
                </div> 
            </div> 
        </div> 
    </form> 
 
    <!-- Employment History --> 
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 mb-6"> 
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
</div>