export async function init(panel) {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const userGrid = panel.querySelector('#userGrid');
    const emptyState = panel.querySelector('#emptyState');
    const userSearch = panel.querySelector('#userSearch');
    const statusFilter = panel.querySelector('#statusFilter');

    if (!userGrid) {
        console.error(
            'UserManagement: #userGrid was not found.'
        );

        return;
    }

    // =========================================================
    // API URLS
    // =========================================================

    const usersUrl = userGrid.dataset.usersUrl;
    const statusBaseUrl = userGrid.dataset.statusUrl;

    // =========================================================
    // CSRF TOKEN
    // =========================================================

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (!csrfToken) {
        console.error(
            'UserManagement: CSRF token was not found.'
        );

        await Swal.fire({
            icon: 'error',
            title: 'Security Error',
            text: 'CSRF token was not found. Please refresh the page.',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
            }
        });

        return;
    }

    // =========================================================
    // STATE
    // =========================================================

    let users = [];

    // =========================================================
    // INITIALIZE
    // =========================================================

    await loadUsers();

    // =========================================================
    // LOAD USERS
    // =========================================================

    async function loadUsers() {

        try {

            const response = await fetch(usersUrl, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to load users. HTTP ${response.status}`
                );
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.message || 'Failed to load users.'
                );
            }

            users = Array.isArray(data.users)
                ? data.users
                : [];

            renderUsers();

        } catch (error) {

            console.error(
                'UserManagement: Failed to load users:',
                error
            );

            userGrid.innerHTML = '';

            emptyState.classList.remove('hidden');

            const emptyTitle = emptyState.querySelector('h3');
            const emptyDescription = emptyState.querySelector('p');

            if (emptyTitle) {
                emptyTitle.textContent = 'Unable to load users';
            }

            if (emptyDescription) {
                emptyDescription.textContent =
                    'Please refresh the page and try again.';
            }
        }
    }

    // =========================================================
    // RENDER USERS
    // =========================================================

    function renderUsers() {

        const searchValue = (
            userSearch?.value || ''
        )
            .trim()
            .toLowerCase();

        const selectedStatus = statusFilter?.value || 'all';

        const filteredUsers = users.filter(user => {

            const username = String(
                user.username || ''
            ).toLowerCase();

            const email = String(
                user.email || ''
            ).toLowerCase();

            const status = String(
                user.status || ''
            ).toLowerCase();

            const matchesSearch =
                username.includes(searchValue) ||
                email.includes(searchValue);

            const matchesStatus =
                selectedStatus === 'all' ||
                status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        userGrid.innerHTML = '';

        if (filteredUsers.length === 0) {

            emptyState.classList.remove('hidden');

            const emptyTitle = emptyState.querySelector('h3');
            const emptyDescription = emptyState.querySelector('p');

            if (emptyTitle) {
                emptyTitle.textContent = 'No users found';
            }

            if (emptyDescription) {
                emptyDescription.textContent =
                    'Try changing your search or status filter.';
            }

            return;
        }

        emptyState.classList.add('hidden');

        filteredUsers.forEach(user => {
            userGrid.insertAdjacentHTML(
                'beforeend',
                createUserCard(user)
            );
        });
    }

    // =========================================================
    // CREATE USER CARD
    // =========================================================

    function createUserCard(user) {

        const userId = user.user_id;

        const username = escapeHtml(
            user.username || 'Unknown User'
        );

        const email = escapeHtml(
            user.email || 'No email'
        );

        const status = String(
            user.status || ''
        ).trim().toLowerCase();

        const initials = getInitials(
            user.username || ''
        );

        // =====================================================
        // DYNAMIC STATUS LABEL
        // =====================================================

        const statusLabel = formatStatusLabel(status);

        // =====================================================
        // DYNAMIC STATUS STYLE
        // =====================================================

        const statusClasses = getStatusClasses(status);

        // =====================================================
        // ACCOUNT ACTION
        // =====================================================

        const isActive = status === 'active';

        const actionLabel = isActive
            ? 'Disable Account'
            : 'Activate Account';

        const actionIcon = isActive
            ? 'fa-user-slash'
            : 'fa-user-check';

        return `
            <div
                class="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                data-user-id="${escapeHtml(String(userId))}"
            >

                <!-- =================================================
                     THREE DOT MENU
                     ================================================= -->

                <div class="absolute top-4 right-4">

                    <button
                        type="button"
                        class="user-menu-button w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                        data-user-menu-button
                        aria-label="User actions"
                    >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <!-- =================================================
                         DROPDOWN MENU
                         ================================================= -->

                    <div
                        class="user-menu hidden absolute right-0 top-10 z-50 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                    >

                        <!-- STATUS ACTION -->

                        <button
                            type="button"
                            class="user-status-action w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            data-user-action="status"
                            data-user-id="${escapeHtml(String(userId))}"
                        >
                            <i class="fa-solid ${actionIcon} w-4 text-gray-400"></i>

                            <span>
                                ${actionLabel}
                            </span>
                        </button>

                        <!-- RESET PASSWORD -->

                        <button
                            type="button"
                            class="user-reset-password w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            data-user-action="reset-password"
                            data-user-id="${escapeHtml(String(userId))}"
                        >
                            <i class="fa-solid fa-key w-4 text-gray-400"></i>

                            <span>
                                Reset Password
                            </span>
                        </button>

                        <!-- DELETE PLACEHOLDER -->

                        <button
                            type="button"
                            class="user-delete-action w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                            data-user-action="delete"
                            data-user-id="${escapeHtml(String(userId))}"
                        >
                            <i class="fa-solid fa-trash w-4"></i>

                            <span>
                                Delete User
                            </span>
                        </button>

                    </div>

                </div>

                <!-- =================================================
                     PROFILE
                     ================================================= -->

                <div class="flex items-center gap-4 pr-8">

                    <!-- PROFILE CIRCLE -->

                    <div
                        class="flex-shrink-0 w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg uppercase"
                    >
                        ${escapeHtml(initials)}
                    </div>

                    <!-- USER INFORMATION -->

                    <div class="min-w-0 flex-1">

                        <h3
                            class="font-semibold text-gray-800 truncate"
                            title="${username}"
                        >
                            ${username}
                        </h3>

                        <p
                            class="text-sm text-gray-400 truncate mt-0.5"
                            title="${email}"
                        >
                            ${email}
                        </p>

                        <div class="mt-2">

                            <span
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusClasses}"
                            >
                                <span
                                    class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"
                                ></span>

                                ${escapeHtml(statusLabel)}
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }

    // =========================================================
    // FORMAT STATUS LABEL
    // =========================================================

    function formatStatusLabel(status) {

        const value = String(status || '').trim();

        if (!value) {
            return 'Unknown';
        }

        return value
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\b\w/g, character => character.toUpperCase());
    }

    // =========================================================
    // GET STATUS CLASSES
    // =========================================================

    function getStatusClasses(status) {

        const statusClasses = {
            active:
                'bg-green-50 text-green-600 border-green-100',

            pending:
                'bg-yellow-50 text-yellow-600 border-yellow-100',

            disabled:
                'bg-red-50 text-red-600 border-red-100'
        };

        return statusClasses[status]
            || 'bg-gray-50 text-gray-600 border-gray-100';
    }

    // =========================================================
    // SEARCH
    // =========================================================

    userSearch?.addEventListener(
        'input',
        renderUsers
    );

    // =========================================================
    // STATUS FILTER
    // =========================================================

    statusFilter?.addEventListener(
        'change',
        renderUsers
    );

    // =========================================================
    // CLOSE MENUS
    // =========================================================

    function closeMenus(exceptMenu = null) {

        panel
            .querySelectorAll('.user-menu')
            .forEach(menu => {

                if (menu !== exceptMenu) {
                    menu.classList.add('hidden');
                }

            });
    }

    // =========================================================
    // DOCUMENT CLICK
    // =========================================================

    document.addEventListener(
        'click',
        handleDocumentClick
    );

    function handleDocumentClick(event) {

        const menuButton = event.target.closest(
            '[data-user-menu-button]'
        );

        if (menuButton && panel.contains(menuButton)) {

            const menu = menuButton
                .closest('.relative')
                ?.querySelector('.user-menu');

            if (!menu) {
                return;
            }

            const isHidden = menu.classList.contains('hidden');

            closeMenus(
                isHidden ? menu : null
            );

            if (isHidden) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }

            return;
        }

        if (
            !event.target.closest('.user-menu') &&
            !event.target.closest('[data-user-menu-button]')
        ) {
            closeMenus();
        }
    }

    // =========================================================
    // ACTION DELEGATION
    // =========================================================

    userGrid.addEventListener(
        'click',
        async event => {

            const actionButton = event.target.closest(
                '[data-user-action]'
            );

            if (!actionButton) {
                return;
            }

            const userId = actionButton.dataset.userId;
            const action = actionButton.dataset.userAction;

            closeMenus();

            if (!userId) {
                return;
            }

            // =====================================================
            // STATUS
            // =====================================================

            if (action === 'status') {

                await handleStatusAction(
                    userId
                );

                return;
            }

            // =====================================================
            // RESET PASSWORD
            // =====================================================

            if (action === 'reset-password') {

                await handleResetPassword(
                    userId
                );

                return;
            }

            // =====================================================
            // DELETE
            // =====================================================

            if (action === 'delete') {

                await handleDeleteAction(
                    userId
                );
            }
        }
    );

    // =========================================================
    // STATUS ACTION
    // =========================================================

    async function handleStatusAction(userId) {

        const user = users.find(
            item => String(item.user_id) === String(userId)
        );

        if (!user) {
            return;
        }

        const status = String(
            user.status || ''
        ).trim().toLowerCase();

        const isActive = status === 'active';

        const title = isActive
            ? 'Do you want to disable this user?'
            : 'Do you want to activate this user?';

        const confirmText = isActive
            ? 'Yes, Disable!'
            : 'Yes, Activate!';

        const result = await Swal.fire({

            icon: 'warning',

            title,

            text: isActive
                ? 'This account will no longer be active.'
                : 'This account will be activated again.',

            showCancelButton: true,

            confirmButtonText: confirmText,

            cancelButtonText: 'No, Cancel',

            reverseButtons: true,

            buttonsStyling: false,

            customClass: {

                actions: 'gap-3',

                confirmButton:
                    'px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium transition cursor-pointer',

                cancelButton:
                    'px-5 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition cursor-pointer'
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        await updateUserStatus(userId);
    }

    // =========================================================
    // UPDATE USER STATUS
    // =========================================================

    async function updateUserStatus(userId) {

        const statusUrl =
            `${statusBaseUrl}/${encodeURIComponent(userId)}/status`;

        try {

            Swal.fire({
                title: 'Updating account...',
                text: 'Please wait.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(
                statusUrl,
                {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken
                    }
                }
            );

            const data = await parseJsonResponse(
                response
            );

            if (!response.ok) {

                throw new Error(
                    getErrorMessage(
                        data,
                        `Request failed with HTTP ${response.status}.`
                    )
                );
            }

            if (!data.success) {

                throw new Error(
                    data.message ||
                    'Failed to update user status.'
                );
            }

            // =====================================================
            // UPDATE LOCAL USER
            // =====================================================

            const userIndex = users.findIndex(
                item =>
                    String(item.user_id) === String(userId)
            );

            if (
                userIndex !== -1 &&
                data.user
            ) {
                users[userIndex] = {
                    ...users[userIndex],
                    ...data.user
                };
            }

            renderUsers();

            await Swal.fire({

                icon: 'success',

                title: 'Success',

                text:
                    data.message ||
                    'User status updated successfully.',

                confirmButtonText: 'OK',

                buttonsStyling: false,

                customClass: {
                    confirmButton:
                        'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
                }
            });

        } catch (error) {

            console.error(
                'UserManagement: Status update failed:',
                error
            );

            await Swal.fire({

                icon: 'error',

                title: 'Update Failed',

                text:
                    error.message ||
                    'Unable to update user status.',

                confirmButtonText: 'OK',

                buttonsStyling: false,

                customClass: {
                    confirmButton:
                        'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
                }
            });
        }
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    async function handleResetPassword(userId) {

        const user = users.find(
            item => String(item.user_id) === String(userId)
        );

        if (!user) {
            return;
        }

        const username = escapeHtml(
            user.username || 'this user'
        );

        // =====================================================
        // FIRST CONFIRMATION
        // =====================================================

        const confirmation = await Swal.fire({

            icon: 'warning',

            title: 'Do you want to reset this account password?',

            html: `
                <p class="text-sm text-gray-500">
                    Account:
                    <strong>${username}</strong>
                </p>
            `,

            showCancelButton: true,

            confirmButtonText: 'Yes, Reset!',

            cancelButtonText: 'No, Cancel',

            reverseButtons: true,

            buttonsStyling: false,

            customClass: {

                actions: 'gap-3',

                confirmButton:
                    'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer',

                cancelButton:
                    'px-5 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition cursor-pointer'
            }
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        // =====================================================
        // PASSWORD FORM
        // =====================================================

        const passwordResult = await Swal.fire({

            title: 'Reset Password',

            html: `
                <div class="text-left">

                    <label
                        for="swal-new-password"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        New Password
                    </label>

                    <input
                        id="swal-new-password"
                        type="password"
                        class="swal2-input !m-0 !w-full"
                        placeholder="Enter new password"
                        autocomplete="new-password"
                    >

                    <label
                        for="swal-confirm-password"
                        class="block text-sm font-medium text-gray-700 mt-4 mb-1"
                    >
                        Confirm Password
                    </label>

                    <input
                        id="swal-confirm-password"
                        type="password"
                        class="swal2-input !m-0 !w-full"
                        placeholder="Confirm new password"
                        autocomplete="new-password"
                    >

                    <p class="text-xs text-gray-400 mt-3">
                        Password must be at least 8 characters.
                    </p>

                </div>
            `,

            showCancelButton: true,

            confirmButtonText: 'Reset Password',

            cancelButtonText: 'Cancel',

            reverseButtons: true,

            focusConfirm: false,

            buttonsStyling: false,

            customClass: {

                actions: 'gap-3',

                confirmButton:
                    'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer',

                cancelButton:
                    'px-5 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition cursor-pointer'
            },

            preConfirm: () => {

                const password = document
                    .getElementById('swal-new-password')
                    ?.value || '';

                const passwordConfirmation = document
                    .getElementById('swal-confirm-password')
                    ?.value || '';

                if (!password) {

                    Swal.showValidationMessage(
                        'Please enter a new password.'
                    );

                    return false;
                }

                if (password.length < 8) {

                    Swal.showValidationMessage(
                        'Password must be at least 8 characters.'
                    );

                    return false;
                }

                if (!passwordConfirmation) {

                    Swal.showValidationMessage(
                        'Please confirm the new password.'
                    );

                    return false;
                }

                if (
                    password !== passwordConfirmation
                ) {

                    Swal.showValidationMessage(
                        'Passwords do not match.'
                    );

                    return false;
                }

                return {
                    password,
                    passwordConfirmation
                };
            }
        });

        if (!passwordResult.isConfirmed) {
            return;
        }

        await resetUserPassword(
            userId,
            passwordResult.value.password,
            passwordResult.value.passwordConfirmation
        );
    }

    // =========================================================
    // RESET USER PASSWORD API
    // =========================================================

    async function resetUserPassword(
        userId,
        password,
        passwordConfirmation
    ) {

        const passwordUrl =
            `${statusBaseUrl}/${encodeURIComponent(userId)}/password`;

        try {

            Swal.fire({
                title: 'Resetting password...',
                text: 'Please wait.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(
                passwordUrl,
                {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        password,
                        password_confirmation:
                            passwordConfirmation
                    })
                }
            );

            const data = await parseJsonResponse(
                response
            );

            if (!response.ok) {

                throw new Error(
                    getErrorMessage(
                        data,
                        `Request failed with HTTP ${response.status}.`
                    )
                );
            }

            if (!data.success) {

                throw new Error(
                    data.message ||
                    'Failed to reset password.'
                );
            }

            await Swal.fire({

                icon: 'success',

                title: 'Password Reset',

                text:
                    data.message ||
                    'User password reset successfully.',

                confirmButtonText: 'OK',

                buttonsStyling: false,

                customClass: {
                    confirmButton:
                        'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
                }
            });

        } catch (error) {

            console.error(
                'UserManagement: Password reset failed:',
                error
            );

            await Swal.fire({

                icon: 'error',

                title: 'Reset Failed',

                text:
                    error.message ||
                    'Unable to reset user password.',

                confirmButtonText: 'OK',

                buttonsStyling: false,

                customClass: {
                    confirmButton:
                        'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
                }
            });
        }
    }

    // =========================================================
    // DELETE PLACEHOLDER
    // =========================================================

    async function handleDeleteAction(userId) {

        const user = users.find(
            item => String(item.user_id) === String(userId)
        );

        if (!user) {
            return;
        }

        await Swal.fire({

            icon: 'info',

            title: 'Delete User',

            text:
                'Delete functionality is not implemented yet.',

            confirmButtonText: 'OK',

            buttonsStyling: false,

            customClass: {
                confirmButton:
                    'px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition cursor-pointer'
            }
        });
    }

    // =========================================================
    // GET INITIALS
    // =========================================================

    function getInitials(name) {

        const value = String(name || '')
            .trim();

        if (!value) {
            return 'U';
        }

        const parts = value
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }

    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHtml(value) {

        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // =========================================================
    // PARSE JSON RESPONSE
    // =========================================================

    async function parseJsonResponse(response) {

        const contentType =
            response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {

            const text = await response.text();

            console.error(
                'UserManagement: Expected JSON but received:',
                text
            );

            throw new Error(
                'The server returned an unexpected response.'
            );
        }

        return await response.json();
    }

    // =========================================================
    // ERROR MESSAGE
    // =========================================================

    function getErrorMessage(
        data,
        fallback
    ) {

        if (
            data &&
            typeof data.message === 'string'
        ) {
            return data.message;
        }

        if (
            data &&
            data.errors &&
            typeof data.errors === 'object'
        ) {

            const messages = Object
                .values(data.errors)
                .flat()
                .filter(Boolean);

            if (messages.length > 0) {
                return messages.join(' ');
            }
        }

        return fallback;
    }
}