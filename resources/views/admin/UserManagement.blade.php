<div class="w-full px-4 sm:px-6 lg:px-8 py-5">
    <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm px-6 py-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            User Management
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            Manage system users and account access.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-6 mt-6 border-b border-gray-100 dark:border-gray-600">
            <button
                type="button"
                id="activeUserTab"
                class="relative pb-3 text-sm font-semibold text-green-600 dark:text-green-400 transition cursor-pointer"
            >
                Active Users
                <span class="absolute left-0 right-0 -bottom-px h-0.5 bg-green-500 rounded-full"></span>
            </button>

            <button
                type="button"
                id="deletedUserTab"
                class="relative pb-3 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition cursor-pointer"
            >
                Deleted Users
                <span class="hidden absolute left-0 right-0 -bottom-px h-0.5 bg-green-500 rounded-full"></span>
            </button>
        </div>
    </div>

    <div id="activeUsersContent">
        <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm px-6 py-5 mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Active Users
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                        Manage active system accounts.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-sm pointer-events-none"></i>

                        <input
                            type="text"
                            id="userSearch"
                            placeholder="Search users..."
                            class="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 transition"
                        >
                    </div>

                    <select
                        id="statusFilter"
                        class="w-full sm:w-36 px-3 py-2.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 transition cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="disabled">Disabled</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="min-h-210">
            <div
                id="userGrid"
                data-users-url="{{ route('api.admin.users') }}"
                data-status-url="{{ url('/api/admin/users') }}"
                data-delete-url="{{ url('/api/admin/users') }}"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            ></div>

            <div id="pagination"></div>

            <div
                id="emptyState"
                class="hidden flex-col items-center justify-center py-16 text-center"
            >
                <div class="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-600 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-users-slash text-gray-400 dark:text-gray-300 text-xl"></i>
                </div>

                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-100">
                    No users found
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    Try changing your search or status filter.
                </p>
            </div>
        </div>
    </div>

    <div id="deletedUsersContent" class="hidden">
        <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm px-6 py-5 mb-6">
            <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Deleted Users
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    View user accounts that have been deleted.
                </p>
            </div>
        </div>

        <div class="min-h-210">
            <div
                id="deletedUsersGrid"
                data-deleted-users-url="{{ route('api.admin.users.deleted') }}"
                data-force-delete-url="{{ url('/api/admin/users/force-delete') }}"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            ></div>

            <div id="deletedPagination"></div>

            <div
                id="deletedEmptyState"
                class="hidden flex-col items-center justify-center py-16 text-center"
            >
                <div class="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-600 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-trash-can text-gray-300 dark:text-gray-300 text-xl"></i>
                </div>

                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-100">
                    No deleted users
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    Deleted user accounts will appear here.
                </p>
            </div>
        </div>
    </div>
</div>