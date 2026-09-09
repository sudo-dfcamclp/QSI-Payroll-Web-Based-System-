import { initUserManagementDelete } from './UserManagementDelete';

export async function init(panel) {
    // Get elements
    const userGrid = panel.querySelector('#userGrid');
    const emptyState = panel.querySelector('#emptyState');
    const userSearch = panel.querySelector('#userSearch');
    const statusFilter = panel.querySelector('#statusFilter');
    const pagination = panel.querySelector('#pagination');
    const activeUserTab = panel.querySelector('#activeUserTab');
    const deletedUserTab = panel.querySelector('#deletedUserTab');
    const activeUsersContent = panel.querySelector('#activeUsersContent');
    const deletedUsersContent = panel.querySelector('#deletedUsersContent');

    if (!userGrid) {
        return;
    }

    // Get API URLs
    const usersUrl = userGrid.dataset.usersUrl;
    const statusBaseUrl = userGrid.dataset.statusUrl;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    let users = [];
    let currentPage = 1;
    let searchTimer = null;

    const deleteManager = initUserManagementDelete(panel);

    // Load active users
    async function loadUsers(page = 1) {
        currentPage = page;
        showLoading();

        try {
            const params = new URLSearchParams({
                page: String(page),
                search: userSearch?.value.trim() || '',
                status: statusFilter?.value || 'all'
            });

            const response = await fetch(`${usersUrl}?${params.toString()}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to load users.'));
            }

            users = Array.isArray(data.users) ? data.users : [];

            renderUsers();
            renderPagination(data.pagination);

            if (users.length === 0) {
                showEmpty();
            } else {
                showUsers();
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Render active users
    function renderUsers() {
        if (!userGrid) {
            return;
        }

        userGrid.innerHTML = users.map(createUserCard).join('');
    }

    // Render active pagination
    function renderPagination(data) {
        if (!pagination) {
            return;
        }

        if (!data || data.last_page <= 1) {
            pagination.innerHTML = '';
            return;
        }

        pagination.innerHTML = `
            <div class="flex items-center justify-between mt-6">
                <p class="text-sm text-gray-500">
                    Showing ${escapeHtml(String(data.from || 0))} to ${escapeHtml(String(data.to || 0))} of ${escapeHtml(String(data.total || 0))} users
                </p>
                <div class="flex items-center gap-2">
                    ${createPageButtons(data)}
                </div>
            </div>
        `;
    }

    // Create active pagination buttons
    function createPageButtons(data) {
        const buttons = [];
        const current = Number(data.current_page);
        const last = Number(data.last_page);

        if (current > 1) {
            buttons.push(`
                <button type="button" data-page="${current - 1}" class="user-page-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
            `);
        }

        for (let page = 1; page <= last; page++) {
            if (page === 1 || page === last || Math.abs(page - current) <= 1) {
                buttons.push(`
                    <button type="button" data-page="${page}" class="user-page-button w-9 h-9 flex items-center justify-center rounded-lg border ${page === current ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} text-sm transition cursor-pointer">
                        ${page}
                    </button>
                `);
            } else if (
                (page === current - 2 && current > 3) ||
                (page === current + 2 && current < last - 2)
            ) {
                buttons.push(`
                    <span class="w-9 h-9 flex items-center justify-center text-gray-400">
                        ...
                    </span>
                `);
            }
        }

        if (current < last) {
            buttons.push(`
                <button type="button" data-page="${current + 1}" class="user-page-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            `);
        }

        return buttons.join('');
    }

    // Create active user card
    function createUserCard(user) {
        const userId = user.user_id;
        const username = escapeHtml(user.username || '');
        const email = escapeHtml(user.email || '');
        const status = String(user.status || 'pending').toLowerCase();
        const initials = getInitials(user.username || user.email || 'U');

        let statusClass = 'bg-yellow-50 text-yellow-700';
        let statusIcon = 'fa-clock';

        if (status === 'active') {
            statusClass = 'bg-green-50 text-green-700';
            statusIcon = 'fa-circle-check';
        }

        if (status === 'disabled') {
            statusClass = 'bg-red-50 text-red-700';
            statusIcon = 'fa-circle-xmark';
        }

        return `
            <div class="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-user-card data-user-type="active" data-user-id="${escapeHtml(String(userId))}" data-username="${username}">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-semibold shrink-0">
                            ${initials}
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-sm font-semibold text-gray-800 truncate">
                                ${username}
                            </h3>
                            <p class="text-xs text-gray-500 truncate mt-1">
                                ${email}
                            </p>
                        </div>
                    </div>
                    <div class="relative">
                        <button type="button" class="user-menu-button w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition cursor-pointer" data-user-menu-button>
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="user-menu hidden absolute right-0 top-9 z-20 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
                            <button type="button" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer" data-user-action="status" data-user-id="${escapeHtml(String(userId))}">
                                <i class="fa-solid ${status === 'active' ? 'fa-user-slash' : 'fa-user-check'} w-4"></i>
                                <span>${status === 'active' ? 'Disable User' : 'Activate User'}</span>
                            </button>
                            <button type="button" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer" data-user-action="reset-password" data-user-id="${escapeHtml(String(userId))}">
                                <i class="fa-solid fa-key w-4"></i>
                                <span>Reset Password</span>
                            </button>
                            <button type="button" class="user-delete-action w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer" data-user-action="delete" data-user-id="${escapeHtml(String(userId))}">
                                <i class="fa-solid fa-trash w-4"></i>
                                <span>Delete User</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${statusClass}">
                        <i class="fa-solid ${statusIcon}"></i>
                        ${escapeHtml(status.charAt(0).toUpperCase() + status.slice(1))}
                    </span>
                </div>
            </div>
        `;
    }

    // Show loading state
    function showLoading() {
        userGrid.classList.add('opacity-50', 'pointer-events-none');

        if (emptyState) {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
        }
    }

    // Show users
    function showUsers() {
        userGrid.classList.remove('hidden', 'opacity-50', 'pointer-events-none');

        if (emptyState) {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
        }
    }

    // Show empty state
    function showEmpty() {
        userGrid.classList.add('hidden');
        userGrid.classList.remove('opacity-50', 'pointer-events-none');

        if (pagination) {
            pagination.innerHTML = '';
        }

        if (emptyState) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
        }
    }

    // Show error state
    function showError(message) {
        userGrid.innerHTML = '';
        userGrid.classList.remove('opacity-50', 'pointer-events-none');
        userGrid.classList.add('hidden');

        if (pagination) {
            pagination.innerHTML = '';
        }

        if (emptyState) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');

            const title = emptyState.querySelector('h3');
            const text = emptyState.querySelector('p');

            if (title) {
                title.textContent = 'Unable to load users';
            }

            if (text) {
                text.textContent = message || 'Something went wrong while loading the users.';
            }
        }
    }

    // Close active menus
    function closeMenus() {
        panel.querySelectorAll('.user-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    // Handle active status action
    async function handleStatusAction(userId) {
        const user = users.find(item => Number(item.user_id) === Number(userId));

        if (!user) {
            return;
        }

        const nextStatus = user.status === 'active' ? 'disabled' : 'active';
        const actionText = nextStatus === 'active' ? 'activate' : 'disable';

        if (window.Swal) {
            const result = await Swal.fire({
                title: `${nextStatus === 'active' ? 'Activate' : 'Disable'} User?`,
                text: `Are you sure you want to ${actionText} ${user.username}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: nextStatus === 'active' ? 'Activate' : 'Disable',
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) {
                return;
            }
        } else if (!window.confirm(`Are you sure you want to ${actionText} ${user.username}?`)) {
            return;
        }

        await updateUserStatus(userId);
    }

    // Update user status
    async function updateUserStatus(userId) {
        try {
            const response = await fetch(`${statusBaseUrl}/${encodeURIComponent(userId)}/status`, {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to update user status.'));
            }

            await loadUsers(currentPage);

            if (window.Swal) {
                await Swal.fire({
                    title: 'Success',
                    text: data.message || 'User status updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            if (window.Swal) {
                await Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            } else {
                window.alert(error.message);
            }
        }
    }

    // Handle password reset
    async function handleResetPassword(userId) {
        const user = users.find(item => Number(item.user_id) === Number(userId));

        if (!user) {
            return;
        }

        let password = '';
        let confirmedPassword = '';

        if (window.Swal) {
            const result = await Swal.fire({
                title: 'Reset Password',
                html: `
                    <input id="resetPassword" type="password" class="swal2-input" placeholder="New password">
                    <input id="resetPasswordConfirm" type="password" class="swal2-input" placeholder="Confirm password">
                `,
                showCancelButton: true,
                confirmButtonText: 'Reset Password',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    password = document.querySelector('#resetPassword')?.value || '';
                    confirmedPassword = document.querySelector('#resetPasswordConfirm')?.value || '';

                    if (password.length < 8) {
                        Swal.showValidationMessage('Password must be at least 8 characters.');
                        return false;
                    }

                    if (password !== confirmedPassword) {
                        Swal.showValidationMessage('Passwords do not match.');
                        return false;
                    }

                    return true;
                }
            });

            if (!result.isConfirmed) {
                return;
            }
        } else {
            password = window.prompt('Enter new password:') || '';

            if (password.length < 8) {
                window.alert('Password must be at least 8 characters.');
                return;
            }

            confirmedPassword = window.prompt('Confirm new password:') || '';

            if (password !== confirmedPassword) {
                window.alert('Passwords do not match.');
                return;
            }
        }

        await resetUserPassword(userId, password, confirmedPassword);
    }

    // Reset user password
    async function resetUserPassword(userId, password, confirmedPassword) {
        try {
            const response = await fetch(`${statusBaseUrl}/${encodeURIComponent(userId)}/password`, {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    password,
                    password_confirmation: confirmedPassword
                })
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to reset user password.'));
            }

            if (window.Swal) {
                await Swal.fire({
                    title: 'Success',
                    text: data.message || 'User password reset successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            if (window.Swal) {
                await Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            } else {
                window.alert(error.message);
            }
        }
    }

    // Handle tab switching
    function initTabs() {
        if (activeUserTab) {
            activeUserTab.addEventListener('click', async () => {
                activeUserTab.classList.add('text-green-600', 'font-semibold');
                activeUserTab.classList.remove('text-gray-500', 'font-medium');

                deletedUserTab?.classList.remove('text-green-600', 'font-semibold');
                deletedUserTab?.classList.add('text-gray-500', 'font-medium');

                activeUserTab.querySelector('span')?.classList.remove('hidden');
                deletedUserTab?.querySelector('span')?.classList.add('hidden');

                activeUsersContent?.classList.remove('hidden');
                deletedUsersContent?.classList.add('hidden');

                await loadUsers(currentPage);
            });
        }

        if (deletedUserTab) {
            deletedUserTab.addEventListener('click', async () => {
                deletedUserTab.classList.add('text-green-600', 'font-semibold');
                deletedUserTab.classList.remove('text-gray-500', 'font-medium');

                activeUserTab?.classList.remove('text-green-600', 'font-semibold');
                activeUserTab?.classList.add('text-gray-500', 'font-medium');

                deletedUserTab.querySelector('span')?.classList.remove('hidden');
                activeUserTab?.querySelector('span')?.classList.add('hidden');

                deletedUsersContent?.classList.remove('hidden');
                activeUsersContent?.classList.add('hidden');

                await deleteManager.loadDeletedUsers(1);
            });
        }
    }

    // Handle active search
    function handleSearch() {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            loadUsers(1);
        }, 300);
    }

    // Handle active pagination
    function handlePagination(event) {
        const button = event.target.closest('.user-page-button');

        if (!button) {
            return;
        }

        const page = Number(button.dataset.page);

        if (!page || page === currentPage) {
            return;
        }

        loadUsers(page);
    }

    // Handle active actions
    function handleActions(event) {
        const menuButton = event.target.closest('[data-user-menu-button]');

        if (menuButton) {
            event.stopPropagation();

            const menu = menuButton.parentElement?.querySelector('.user-menu');

            if (!menu) {
                return;
            }

            const isHidden = menu.classList.contains('hidden');

            closeMenus();

            if (isHidden) {
                menu.classList.remove('hidden');
            }

            return;
        }

        const action = event.target.closest('[data-user-action]');

        if (!action) {
            return;
        }

        const userId = action.dataset.userId;
        const userAction = action.dataset.userAction;

        closeMenus();

        if (userAction === 'status') {
            handleStatusAction(userId);
        }

        if (userAction === 'reset-password') {
            handleResetPassword(userId);
        }
    }

    // Handle delete refresh
    function handleDeleteRefresh() {
        loadUsers(currentPage);
    }

    // Escape HTML
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Get initials
    function getInitials(value) {
        const words = String(value).trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) {
            return 'U';
        }

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }

    // Parse JSON response
    async function parseJsonResponse(response) {
        const text = await response.text();

        try {
            return text ? JSON.parse(text) : {};
        } catch {
            throw new Error(
                response.status === 419
                    ? 'Your session has expired. Please refresh the page.'
                    : 'The server returned an invalid response.'
            );
        }
    }

    // Get API error message
    function getErrorMessage(data, fallback) {
        if (data?.message) {
            return data.message;
        }

        if (data?.errors) {
            const firstError = Object.values(data.errors).flat()[0];

            if (firstError) {
                return firstError;
            }
        }

        return fallback;
    }

    // Initialize events
    function initEvents() {
        userSearch?.addEventListener('input', handleSearch);
        statusFilter?.addEventListener('change', () => loadUsers(1));
        pagination?.addEventListener('click', handlePagination);
        userGrid.addEventListener('click', handleActions);
        panel.addEventListener('click', event => {
            if (!event.target.closest('[data-user-menu-button]') && !event.target.closest('.user-menu')) {
                closeMenus();
            }
        });
        panel.addEventListener('user-management:active-deleted', handleDeleteRefresh);
    }

    initTabs();
    initEvents();
    await loadUsers(1);
}