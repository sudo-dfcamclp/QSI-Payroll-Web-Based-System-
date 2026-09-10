<!-- ROLE MANAGEMENT -->
<div class="w-full px-4 sm:px-6 lg:px-8 py-5">
    <!-- PAGE HEADER -->
    <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm px-6 py-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Role Management
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    Manage user roles and access levels.
                </p>
            </div>

            <!-- CONTROLS -->
            <div class="flex flex-col sm:flex-row gap-3">
                <!-- SEARCH -->
                <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm pointer-events-none"></i>
                    <input
                        type="text"
                        class="role-search w-full sm:w-64 pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition"
                        placeholder="Search users..."
                    >
                </div>

                <!-- ROLE FILTER -->
                <select
                    class="role-filter w-full sm:w-40 px-3 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition cursor-pointer"
                >
                    <option value="all">
                        All Roles
                    </option>
                </select>
            </div>
        </div>
    </div>

    <!-- ROLE MANAGEMENT BODY -->
    <div class="min-h-210">
        <!-- LOADING STATE -->
        <div class="role-loading flex items-center justify-center py-16">
            <div class="flex items-center gap-3 text-gray-500 dark:text-gray-300">
                <i class="fa-solid fa-spinner fa-spin text-green-500 dark:text-green-400"></i>
                <span class="text-sm">
                    Loading users...
                </span>
            </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="role-empty hidden flex-col items-center justify-center py-16 text-center">
            <div class="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-600 flex items-center justify-center mb-4">
                <i class="fa-solid fa-users text-gray-400 dark:text-gray-300 text-xl"></i>
            </div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-100">
                No users found
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                There are currently no users to display.
            </p>
        </div>

        <!-- ERROR STATE -->
        <div class="role-error hidden flex-col items-center justify-center py-16 text-center">
            <div class="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 text-xl"></i>
            </div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-100">
                Unable to load users
            </h3>
            <p class="role-error-message text-sm text-gray-500 dark:text-gray-300 mt-1">
                Something went wrong while loading the users.
            </p>
        </div>

        <!-- USERS GRID -->
        <div
            class="role-users-grid hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
        </div>

        <!-- PAGINATION -->
        <div class="role-pagination hidden">
        </div>
    </div>
</div>