<!-- Employee Information -->
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 px-6 py-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Employee Master</h1>
                <p class="text-sm text-gray-500 dark:text-gray-300 mt-0.5">Employee: Juan Dela Cruz</p>
            </div>
        </div>
    </div>
    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 px-6 py-3 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
                <button type="button" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer"><i class="fa-solid fa-pen mr-1"></i>Edit</button>
                <button type="button" class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium cursor-pointer"><i class="fa-solid fa-plus mr-1"></i>New</button>
                <button type="button" class="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium cursor-pointer"><i class="fa-solid fa-floppy-disk mr-1"></i>Save</button>
            </div>
            <!-- Search -->
            <div class="relative flex-1 max-w-xs mx-2">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm"></i>
                <input type="text" placeholder="Search..." class="pl-9 pr-4 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full transition">
            </div>
            <!-- Navigation -->
            <div class="flex items-center gap-2">
                <button type="button" class="px-2.5 py-1.5 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-200 text-sm cursor-pointer"><i class="fa-solid fa-angles-left"></i></button>
                <span class="text-sm text-gray-600 dark:text-gray-200 px-2 font-medium whitespace-nowrap">1 of 1,248</span>
                <button type="button" class="px-2.5 py-1.5 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-200 text-sm cursor-pointer"><i class="fa-solid fa-angles-right"></i></button>
            </div>
        </div>
    </div>
    <!-- Basic Information -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Basic Information</h2>
                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Complete list of registered employees in the system.</p>
            </div>
        </div>
        <form>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Profile -->
                <div class="lg:col-span-3 flex flex-col items-center lg:items-stretch">
                    <div class="w-full h-full min-h-[220px] bg-gray-200 dark:bg-gray-600 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-500 hover:border-green-500 transition-colors cursor-pointer group relative">
                        <div class="text-center p-4">
                            <i class="fa-solid fa-camera text-4xl text-gray-400 dark:text-gray-300 group-hover:text-green-500 transition-colors mb-2"></i>
                            <p class="text-xs text-gray-500 dark:text-gray-300 font-medium">Upload Photo</p>
                        </div>
                        <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    </div>
                </div>
                <!-- Employee Information -->
                <div class="lg:col-span-9 flex flex-col gap-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Left Column -->
                        <div class="space-y-4">
                            <!-- Employee No -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Employee No</label>
                                <input type="text" name="employee_no" placeholder="..." class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
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
                        </div>
                        <!-- Right Column -->
                        <div class="space-y-4">
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
        </form>
    </div>
    <!-- Personal Information -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-user-pen text-blue-500 mr-2"></i>Personal Information</h3>
        </div>
        <form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <!-- Left Column -->
                <div class="space-y-5">
                    <!-- Birthday -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Birthday:</label>
                        <div class="flex gap-2 flex-1">
                            <input type="number" placeholder="34" class="w-16 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center">
                            <input type="date" class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        </div>
                    </div>
                    <!-- Birth Place -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Birth Place:</label>
                        <input type="text" placeholder="STA. ANA MANILA" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Citizenship -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Citizenship:</label>
                        <input type="text" placeholder="FILIPINO" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Gender -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Gender:</label>
                        <select class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <!-- Civil Status -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Civil Status:</label>
                        <select class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer">
                            <option value="single">SINGLE</option>
                            <option value="married">MARRIED</option>
                            <option value="widowed">WIDOWED</option>
                            <option value="divorced">DIVORCED</option>
                        </select>
                    </div>
                    <!-- Weight -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Weight:</label>
                        <div class="relative flex-1">
                            <input type="text" placeholder="108" class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-300 font-medium">LBS.</span>
                        </div>
                    </div>
                    <!-- Height -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Height:</label>
                        <input type="text" placeholder="52" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Religion -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Religion:</label>
                        <input type="text" placeholder="CATHOLIC" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                </div>
                <!-- Right Column -->
                <div class="space-y-5">
                    <!-- House No -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">House No:</label>
                        <input type="text" placeholder="356" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Street -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Street:</label>
                        <input type="text" placeholder="D. EDANG STS." class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Barangay -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Barangay:</label>
                        <input type="text" placeholder="BRGY. 149 ZONE" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- District -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">District:</label>
                        <input type="text" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- City -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">City:</label>
                        <input type="text" placeholder="PASAY CITY" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Town -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Town:</label>
                        <input type="text" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Contact -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Contact:</label>
                        <input type="text" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                    <!-- Phone -->
                    <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Phone:</label>
                        <input type="text" placeholder="$EA237126" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- Education + Mandatory Numbers -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Education -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-graduation-cap text-purple-600 dark:text-purple-400 mr-2"></i>Education</h3>
            </div>
            <div class="space-y-4">
                <!-- Primary -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Primary:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- Secondary -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Secondary:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- College -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">College:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- Degree -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Degree:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- Major -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Major:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- Post Grad -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Post Grad:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
                <!-- Course -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Course:</label>
                    <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                </div>
            </div>
        </div>
        <!-- Mandatory Numbers -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-id-card text-blue-600 dark:text-blue-400 mr-2"></i>Mandatory Numbers</h3>
            </div>
            <div class="space-y-4">
                <!-- SSS -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">SSS:</label>
                    <input type="text" placeholder="3462492091" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                <!-- PhilHealth -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">PhilHealth:</label>
                    <input type="text" placeholder="620267885789" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                <!-- Pag-ibig -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Pag-ibig:</label>
                    <input type="text" placeholder="121181838232" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                <!-- TIN -->
                <div class="flex items-center gap-4">
                    <label class="w-24 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">TIN:</label>
                    <input type="text" placeholder="761594402" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
            </div>
        </div>
    </div>
    <!-- Employment Information -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-briefcase text-indigo-600 dark:text-indigo-400 mr-2"></i>Employment Information</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            <!-- Status -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Status:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option value="regular">R-Regular</option>
                    <option value="probationary">Probationary</option>
                    <option value="contractual">Contractual</option>
                </select>
            </div>
            <!-- Remarks -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Remarks:</label>
                <input type="text" placeholder="09-1-0152" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Position -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Position:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option>SUPERVISOR</option>
                    <option>MANAGER</option>
                    <option>STAFF</option>
                </select>
            </div>
            <!-- Company -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Company:</label>
                <input type="text" placeholder="W GLOBAL REALTY, INC - HOUSEKEEPING" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Branch -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Branch:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option>Select Branch</option>
                    <option>Main Branch</option>
                    <option>North Branch</option>
                </select>
            </div>
            <!-- Department -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Department:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option>Ladies Accessories</option>
                    <option>Mens Wear</option>
                    <option>Electronics</option>
                </select>
            </div>
            <!-- Date Hired -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Date Hired:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Date Resigned -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Date Resigned:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Start Contract -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Start Contract:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- End Contract -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">End Contract:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Rate Basis -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Rate Basis:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option>Daily</option>
                    <option>Monthly</option>
                    <option>Hourly</option>
                </select>
            </div>
            <!-- Month No -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Month No:</label>
                <input type="number" placeholder="6" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Hourly Rate -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Hourly Rate:</label>
                <input type="number" step="0.01" placeholder="86.63" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Daily Rate -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Daily Rate:</label>
                <input type="number" step="0.01" placeholder="645" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Monthly Rate -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Monthly Rate:</label>
                <input type="number" step="0.01" placeholder="14821.60" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Date Reg -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Date Reg:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Date Prob -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Date Prob:</label>
                <input type="date" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Insurance No -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Insurance No:</label>
                <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Agency Fee -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Agency Fee:</label>
                <input type="number" step="0.01" placeholder="12" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Agency -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Agency:</label>
                <select class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-600 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer">
                    <option>SPAI</option>
                    <option>None</option>
                </select>
            </div>
            <!-- Account No -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Account No:</label>
                <input type="text" placeholder="109661898696" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Expanded Tax -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Expanded Tax:</label>
                <input type="text" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- Allowance -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="sm:w-32 text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">Allowance:</label>
                <input type="number" step="0.01" placeholder="0" class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-transparent dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            </div>
            <!-- With Ecol -->
            <div class="flex items-center gap-3 pt-2">
                <input type="checkbox" id="withEcol" class="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer">
                <label for="withEcol" class="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer">With Ecol</label>
            </div>
        </div>
    </div>
    <!-- Employment History -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"><i class="fa-solid fa-clock-rotate-left text-indigo-600 dark:text-indigo-400 mr-2"></i>Employment History</h3>
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-300">
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