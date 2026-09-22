<div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
    <div class="bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm px-5 sm:px-6 py-5">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Profile Settings</h2>
            <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">Manage your profile information, profile picture, and password.</p>
        </div>
        <div class="space-y-5">
            <div class="bg-gray-50 dark:bg-gray-600 rounded-2xl border border-gray-100 dark:border-gray-500 p-5 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div class="relative isolate w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 flex items-center justify-center shrink-0 mx-auto sm:mx-0 overflow-hidden">
                        <img id="settingsProfileImage" src="" alt="Profile Picture" class="hidden absolute inset-0 block w-full h-full object-cover rounded-full">
                        <i id="settingsProfileFallback" class="fa-solid fa-user text-3xl sm:text-4xl text-green-600 dark:text-green-400"></i>
                    </div>
                    <input type="file" id="settingsProfileInput" accept="image/jpeg,image/png,image/webp" class="hidden">
                    <div class="flex flex-col gap-3 w-full sm:w-auto">
                        <button type="button" id="settingsChangeProfileButton" class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
                            <i class="fa-solid fa-camera mr-2"></i>Change Profile
                        </button>
                        <button type="button" id="settingsDeleteProfileButton" class="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 border border-gray-200 dark:border-gray-500 hover:border-red-200 dark:hover:border-red-800 text-sm font-medium rounded-xl transition-colors cursor-pointer">
                            <i class="fa-solid fa-trash-can mr-2"></i>Delete Profile
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-600 rounded-2xl border border-gray-100 dark:border-gray-500 p-5 sm:p-6">
                <div class="flex items-center justify-between gap-3 mb-5">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Information</h3>
                    <button type="button" id="settingsEditInfoButton" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors">
                        <i class="fa-solid fa-pen-to-square mr-2"></i>Edit
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Last Update</p>
                        <p id="settingsLastUpdate" class="text-sm text-gray-700 dark:text-gray-100">Loading...</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="settingsUsername" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Username</label>
                            <input type="text" id="settingsUsername" disabled class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 disabled:opacity-70 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                        </div>
                        <div>
                            <label for="settingsEmail" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Email</label>
                            <input type="email" id="settingsEmail" disabled class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 disabled:opacity-70 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-600 rounded-2xl border border-gray-100 dark:border-gray-500 p-5 sm:p-6">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-5">Change Password</h3>
                <form id="settingsPasswordForm" class="space-y-4">
                    <div>
                        <label for="settingsCurrentPassword" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Current Password</label>
                        <input type="password" id="settingsCurrentPassword" name="current_password" autocomplete="current-password" required class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition" placeholder="Enter current password">
                    </div>
                    <div>
                        <label for="settingsNewPassword" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">New Password</label>
                        <input type="password" id="settingsNewPassword" name="new_password" autocomplete="new-password" minlength="8" required class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition" placeholder="Enter new password">
                    </div>
                    <div>
                        <label for="settingsConfirmPassword" class="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">Confirm Password</label>
                        <input type="password" id="settingsConfirmPassword" name="new_password_confirmation" autocomplete="new-password" required class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition" placeholder="Confirm new password">
                    </div>
                    <div class="pt-1 flex justify-end">
                        <button type="submit" id="settingsChangePasswordButton" class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>