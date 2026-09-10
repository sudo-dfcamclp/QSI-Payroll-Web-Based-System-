<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="auth-permissions-url" content="{{ route('api.auth.permissions') }}">
    <meta name="role-management-users-url" content="{{ route('api.admin.role-management.users') }}">
    <meta name="role-management-roles-url" content="{{ route('api.admin.role-management.roles') }}">
    <meta name="role-management-user-roles-url" content="{{ url('/api/admin/role-management/users') }}">
    <meta name="role-management-update-role-url" content="{{ url('/api/admin/role-management/users') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>ePayroll - Dashboard</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body class="bg-gray-100 dark:bg-gray-800 min-h-screen">

    <!-- Sidebar -->
    @include('includes.components.sidebar')

    <!-- Main Application Content -->
    <main id="mainContent" class="min-h-screen transition-all duration-300">

        <!-- Tab System -->
        <div id="tabSystem" class="min-h-screen">

            <!-- Tab Header -->
            <div id="tabHeader" class="sticky top-0 z-30 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-500 shadow-sm">

                <div id="tabList" class="flex items-center overflow-x-auto">

                    <!-- Dashboard Tab -->
                    <button type="button" class="tab-item active flex items-center gap-3 px-5 py-4 text-base font-semibold text-green-600 border-b-2 border-green-600 whitespace-nowrap hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" data-tab-id="dashboard" data-tab-title="Dashboard" data-tab-icon="fa-solid fa-display" data-page="/dashboard">

                        <i class="fa-solid fa-display text-lg"></i>

                        <span>Dashboard</span>

                    </button>

                </div>

            </div>

            <!-- Tab Content -->
            <div id="tabContent" class="min-h-[calc(100vh-57px)]">

                <!-- Dashboard Panel -->
                <div id="tab-dashboard" class="tab-panel">

                    <div class="container mx-auto px-6 py-10 max-w-7xl">

                        <!-- Page Header -->
                        <div class="mb-8">

                            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Dashboard
                            </h1>

                            <p class="text-gray-500 dark:text-gray-300 mt-1">
                                Welcome back! Here's your overview.
                            </p>

                        </div>

                        <!-- Dashboard Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <!-- Left Column -->
                            <div class="flex flex-col gap-6">

                                <!-- Total Employees -->
                                <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-600">

                                    <div class="flex items-center justify-between">

                                        <div>

                                            <p class="text-sm text-gray-500 dark:text-gray-300">
                                                Total Employees
                                            </p>

                                            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                                1,248
                                            </h2>

                                        </div>

                                        <div class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl">

                                            <i class="fa-solid fa-users text-xl"></i>

                                        </div>

                                    </div>

                                    <p class="text-xs text-green-600 dark:text-green-400 mt-4">
                                        ↑ 12% from last month
                                    </p>

                                </div>

                                <!-- Payroll Processed -->
                                <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-600">

                                    <div class="flex items-center justify-between">

                                        <div>

                                            <p class="text-sm text-gray-500 dark:text-gray-300">
                                                Payroll Processed
                                            </p>

                                            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                                $84,520
                                            </h2>

                                        </div>

                                        <div class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl">

                                            <i class="fa-solid fa-money-bill text-xl"></i>

                                        </div>

                                    </div>

                                    <p class="text-xs text-green-600 dark:text-green-400 mt-4">
                                        ↑ 8.2% from last month
                                    </p>

                                </div>

                                <!-- Pending Requests -->
                                <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-600">

                                    <div class="flex items-center justify-between">

                                        <div>

                                            <p class="text-sm text-gray-500 dark:text-gray-300">
                                                Pending Requests
                                            </p>

                                            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                                27
                                            </h2>

                                        </div>

                                        <div class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-xl">

                                            <i class="fa-solid fa-clock text-xl"></i>

                                        </div>

                                    </div>

                                    <p class="text-xs text-red-500 dark:text-red-400 mt-4">
                                        ↓ 3 need attention
                                    </p>

                                </div>

                            </div>

                            <!-- Right Column -->
                            <div class="lg:col-span-2 flex flex-col gap-6">

                                <!-- Recent Activity -->
                                <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-600">

                                    <div class="flex items-center justify-between mb-6">

                                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            Recent Activity
                                        </h3>

                                        <button type="button" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                            View All
                                        </button>

                                    </div>

                                    <div class="space-y-4">

                                        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition">

                                            <div class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">

                                                <i class="fa-solid fa-check"></i>

                                            </div>

                                            <div class="flex-1">

                                                <p class="font-medium text-gray-800 dark:text-gray-100">
                                                    Payroll for July processed
                                                </p>

                                                <p class="text-xs text-gray-500 dark:text-gray-300">
                                                    2 hours ago
                                                </p>

                                            </div>

                                        </div>

                                        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition">

                                            <div class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">

                                                <i class="fa-solid fa-user-plus"></i>

                                            </div>

                                            <div class="flex-1">

                                                <p class="font-medium text-gray-800 dark:text-gray-100">
                                                    New employee onboarded
                                                </p>

                                                <p class="text-xs text-gray-500 dark:text-gray-300">
                                                    5 hours ago
                                                </p>

                                            </div>

                                        </div>

                                        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition">

                                            <div class="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-lg">

                                                <i class="fa-solid fa-file-lines"></i>

                                            </div>

                                            <div class="flex-1">

                                                <p class="font-medium text-gray-800 dark:text-gray-100">
                                                    Leave request submitted
                                                </p>

                                                <p class="text-xs text-gray-500 dark:text-gray-300">
                                                    Yesterday
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <!-- Department Overview -->
                                <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-600">

                                    <div class="flex items-center justify-between mb-6">

                                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            Department Overview
                                        </h3>

                                        <button type="button" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                            Details
                                        </button>

                                    </div>

                                    <div class="space-y-4">

                                        <!-- Engineering -->
                                        <div>

                                            <div class="flex justify-between mb-1">

                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Engineering
                                                </span>

                                                <span class="text-sm text-gray-500 dark:text-gray-300">
                                                    78%
                                                </span>

                                            </div>

                                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">

                                                <div class="bg-blue-600 h-2 rounded-full" style="width: 78%"></div>

                                            </div>

                                        </div>

                                        <!-- Marketing -->
                                        <div>

                                            <div class="flex justify-between mb-1">

                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Marketing
                                                </span>

                                                <span class="text-sm text-gray-500 dark:text-gray-300">
                                                    62%
                                                </span>

                                            </div>

                                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">

                                                <div class="bg-green-600 h-2 rounded-full" style="width: 62%"></div>

                                            </div>

                                        </div>

                                        <!-- Finance -->
                                        <div>

                                            <div class="flex justify-between mb-1">

                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Finance
                                                </span>

                                                <span class="text-sm text-gray-500 dark:text-gray-300">
                                                    91%
                                                </span>

                                            </div>

                                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">

                                                <div class="bg-purple-600 h-2 rounded-full" style="width: 91%"></div>

                                            </div>

                                        </div>

                                        <!-- HR -->
                                        <div>

                                            <div class="flex justify-between mb-1">

                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    HR
                                                </span>

                                                <span class="text-sm text-gray-500 dark:text-gray-300">
                                                    45%
                                                </span>

                                            </div>

                                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">

                                                <div class="bg-orange-500 h-2 rounded-full" style="width: 45%"></div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </main>

    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</body>
</html>