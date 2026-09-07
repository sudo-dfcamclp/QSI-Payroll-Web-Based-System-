<!-- =========================================================
     USER MANAGEMENT CONTAINER
     ========================================================= -->
<div class="w-full px-4 sm:px-6 lg:px-8 py-5">
    <!-- =====================================================
         MAIN CONTAINER
         ===================================================== -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <!-- =================================================
             HEADER
             ================================================= -->
        <div class="px-6 py-5 border-b border-gray-100">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <!-- PAGE TITLE -->
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <i class="fa-solid fa-users"></i>
                        </div>

                        <div>
                            <h2 class="text-lg font-bold text-gray-800">
                                User Management
                            </h2>

                            <p class="text-sm text-gray-400 mt-0.5">
                                Manage system users and account access.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- CONTROLS -->
                <div class="flex flex-col sm:flex-row gap-3">

                    <!-- SEARCH -->
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>

                        <input
                            type="text"
                            id="userSearch"
                            placeholder="Search users..."
                            class="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                        >
                    </div>

                    <!-- STATUS FILTER -->
                    <select
                        id="statusFilter"
                        class="w-full sm:w-36 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- =================================================
             USER CONTENT
             ================================================= -->
        <div class="p-6">

            <!-- =================================================
                 USER GRID
                 ================================================= -->
            <div
                id="userGrid"
                data-users-url="{{ route('api.admin.users') }}"
                data-status-url="{{ url('/api/admin/users') }}"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            ></div>

            <!-- =================================================
                 EMPTY STATE
                 ================================================= -->
            <div id="emptyState" class="hidden py-16 text-center">
                <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-users-slash text-gray-400 text-xl"></i>
                </div>

                <h3 class="text-base font-semibold text-gray-700">
                    No users found
                </h3>

                <p class="text-sm text-gray-400 mt-1">
                    Try changing your search or status filter.
                </p>
            </div>

        </div>
    </div>
</div>