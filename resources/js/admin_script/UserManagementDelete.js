export function initUserManagementDelete(panel) {
    // Get elements
    const userGrid = panel.querySelector('#userGrid');
    const deletedUsersGrid = panel.querySelector('#deletedUsersGrid');
    const deletedEmptyState = panel.querySelector('#deletedEmptyState');
    const deletedPagination = panel.querySelector('#deletedPagination');

    if (!userGrid || !deletedUsersGrid) {
        return {
            loadDeletedUsers: async () => {}
        };
    }

    // Get API URLs
    const deleteUrl = userGrid.dataset.deleteUrl;
    const deletedUsersUrl = deletedUsersGrid.dataset.deletedUsersUrl;
    const forceDeleteUrl = deletedUsersGrid.dataset.forceDeleteUrl;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    let deletedUsers = [];
    let deletedCurrentPage = 1;

    // Check dark mode
    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    // Get SweetAlert theme
    function getSwalTheme() {
        return isDarkMode()
            ? {
                background: '#374151',
                color: '#f3f4f6',
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#4b5563'
            }
            : {
                background: '#ffffff',
                color: '#1f2937',
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280'
            };
    }

    // Load deleted users
    async function loadDeletedUsers(page = 1) {
        deletedCurrentPage = page;
        showDeletedLoading();

        try {
            const params = new URLSearchParams({
                page: String(page)
            });

            const response = await fetch(`${deletedUsersUrl}?${params.toString()}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to load deleted users.'));
            }

            deletedUsers = Array.isArray(data.users) ? data.users : [];

            renderDeletedUsers();
            renderDeletedPagination(data.pagination);

            if (deletedUsers.length === 0) {
                showDeletedEmpty();
            } else {
                showDeletedUsers();
            }
        } catch (error) {
            showDeletedError(error.message);
        }
    }

    // Render deleted users
    function renderDeletedUsers() {
        deletedUsersGrid.innerHTML = deletedUsers.map(createDeletedUserCard).join('');
    }

    // Create deleted user card
    function createDeletedUserCard(user) {
        const userId = user.user_id;
        const username = escapeHtml(user.username || '');
        const email = escapeHtml(user.email || '');
        const initials = getInitials(user.username || user.email || 'U');

        return `
            <div class="relative bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm p-5" data-user-card data-user-type="deleted" data-user-id="${escapeHtml(String(userId))}" data-username="${username}">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center font-semibold shrink-0">
                            ${initials}
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                ${username}
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-300 truncate mt-1">
                                ${email}
                            </p>
                        </div>
                    </div>
                    <div class="relative">
                        <button type="button" class="deleted-menu-button w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-100 transition cursor-pointer" data-deleted-menu-button>
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="deleted-user-menu hidden absolute right-0 top-9 z-20 w-48 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-lg overflow-hidden">
                            <button type="button" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition cursor-pointer" data-deleted-action="force-delete" data-user-id="${escapeHtml(String(userId))}">
                                <i class="fa-solid fa-trash w-4"></i>
                                <span>Delete User</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">
                        <i class="fa-solid fa-trash-can"></i>
                        Deleted
                    </span>
                </div>
            </div>
        `;
    }

    // Render deleted pagination
    function renderDeletedPagination(data) {
        if (!deletedPagination) {
            return;
        }

        if (!data || data.last_page <= 1) {
            deletedPagination.innerHTML = '';
            return;
        }

        deletedPagination.innerHTML = `
            <div class="flex items-center justify-between mt-6">
                <p class="text-sm text-gray-500 dark:text-gray-300">
                    Showing ${escapeHtml(String(data.from || 0))} to ${escapeHtml(String(data.to || 0))} of ${escapeHtml(String(data.total || 0))} deleted users
                </p>
                <div class="flex items-center gap-2">
                    ${createDeletedPageButtons(data)}
                </div>
            </div>
        `;
    }

    // Create deleted pagination buttons
    function createDeletedPageButtons(data) {
        const buttons = [];
        const current = Number(data.current_page);
        const last = Number(data.last_page);

        if (current > 1) {
            buttons.push(`
                <button type="button" data-deleted-page="${current - 1}" class="deleted-page-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition cursor-pointer">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
            `);
        }

        for (let page = 1; page <= last; page++) {
            if (page === 1 || page === last || Math.abs(page - current) <= 1) {
                buttons.push(`
                    <button type="button" data-deleted-page="${page}" class="deleted-page-button w-9 h-9 flex items-center justify-center rounded-lg border ${page === current ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'} text-sm transition cursor-pointer">
                        ${page}
                    </button>
                `);
            } else if (
                (page === current - 2 && current > 3) ||
                (page === current + 2 && current < last - 2)
            ) {
                buttons.push(`
                    <span class="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-400">
                        ...
                    </span>
                `);
            }
        }

        if (current < last) {
            buttons.push(`
                <button type="button" data-deleted-page="${current + 1}" class="deleted-page-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition cursor-pointer">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            `);
        }

        return buttons.join('');
    }

    // Handle active user delete
    async function handleSoftDelete(userId) {
        const card = userGrid.querySelector(`[data-user-id="${CSS.escape(String(userId))}"]`);

        if (!card) {
            return;
        }

        const username = card.dataset.username || 'this user';

        if (window.Swal) {
            const theme = getSwalTheme();

            const result = await Swal.fire({
                title: 'Delete User?',
                text: `${username} will be moved to Deleted Users.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete User',
                cancelButtonText: 'Cancel',
                background: theme.background,
                color: theme.color,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: theme.cancelButtonColor
            });

            if (!result.isConfirmed) {
                return;
            }
        } else if (!window.confirm(`${username} will be moved to Deleted Users. Continue?`)) {
            return;
        }

        try {
            const response = await fetch(`${deleteUrl}/${encodeURIComponent(userId)}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to delete user.'));
            }

            panel.dispatchEvent(new CustomEvent('user-management:active-deleted'));

            if (window.Swal) {
                const theme = getSwalTheme();

                await Swal.fire({
                    title: 'Deleted',
                    text: data.message || 'User account deleted successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: theme.background,
                    color: theme.color,
                    confirmButtonColor: theme.confirmButtonColor,
                    cancelButtonColor: theme.cancelButtonColor
                });
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Handle permanent delete
    async function handleForceDelete(userId) {
        const card = deletedUsersGrid.querySelector(`[data-user-id="${CSS.escape(String(userId))}"]`);

        if (!card) {
            return;
        }

        const username = card.dataset.username || 'this user';

        if (window.Swal) {
            const theme = getSwalTheme();

            const result = await Swal.fire({
                title: 'Permanently Delete User?',
                html: `This will permanently delete <strong>${escapeHtml(username)}</strong>.<br>This action cannot be undone.`,
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Permanently Delete',
                cancelButtonText: 'Cancel',
                background: theme.background,
                color: theme.color,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: theme.cancelButtonColor
            });

            if (!result.isConfirmed) {
                return;
            }
        } else if (!window.confirm(`Permanently delete ${username}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`${forceDeleteUrl}/${encodeURIComponent(userId)}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await parseJsonResponse(response);

            if (!response.ok || !data.success) {
                throw new Error(getErrorMessage(data, 'Unable to permanently delete user.'));
            }

            await loadDeletedUsers(deletedCurrentPage);

            if (window.Swal) {
                const theme = getSwalTheme();

                await Swal.fire({
                    title: 'Permanently Deleted',
                    text: data.message || 'User account permanently deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: theme.background,
                    color: theme.color,
                    confirmButtonColor: theme.confirmButtonColor,
                    cancelButtonColor: theme.cancelButtonColor
                });
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Handle deleted actions
    function handleDeletedActions(event) {
        const menuButton = event.target.closest('[data-deleted-menu-button]');

        if (menuButton) {
            event.stopPropagation();

            const menu = menuButton.parentElement?.querySelector('.deleted-user-menu');

            if (!menu) {
                return;
            }

            const isHidden = menu.classList.contains('hidden');

            closeDeletedMenus();

            if (isHidden) {
                menu.classList.remove('hidden');
            }

            return;
        }

        const action = event.target.closest('[data-deleted-action]');

        if (!action) {
            return;
        }

        const userId = action.dataset.userId;
        const deletedAction = action.dataset.deletedAction;

        closeDeletedMenus();

        if (deletedAction === 'force-delete') {
            handleForceDelete(userId);
        }
    }

    // Handle deleted pagination
    function handleDeletedPagination(event) {
        const button = event.target.closest('.deleted-page-button');

        if (!button) {
            return;
        }

        const page = Number(button.dataset.deletedPage);

        if (!page || page === deletedCurrentPage) {
            return;
        }

        loadDeletedUsers(page);
    }

    // Close deleted menus
    function closeDeletedMenus() {
        panel.querySelectorAll('.deleted-user-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    // Show deleted loading
    function showDeletedLoading() {
        deletedUsersGrid.classList.remove('hidden');
        deletedUsersGrid.classList.add('opacity-50', 'pointer-events-none');

        if (deletedEmptyState) {
            deletedEmptyState.classList.add('hidden');
            deletedEmptyState.classList.remove('flex');
        }
    }

    // Show deleted users
    function showDeletedUsers() {
        deletedUsersGrid.classList.remove('hidden', 'opacity-50', 'pointer-events-none');

        if (deletedEmptyState) {
            deletedEmptyState.classList.add('hidden');
            deletedEmptyState.classList.remove('flex');
        }
    }

    // Show deleted empty state
    function showDeletedEmpty() {
        deletedUsersGrid.classList.add('hidden');
        deletedUsersGrid.classList.remove('opacity-50', 'pointer-events-none');

        if (deletedPagination) {
            deletedPagination.innerHTML = '';
        }

        if (deletedEmptyState) {
            deletedEmptyState.classList.remove('hidden');
            deletedEmptyState.classList.add('flex');
        }
    }

    // Show deleted error
    function showDeletedError(message) {
        deletedUsersGrid.innerHTML = '';
        deletedUsersGrid.classList.add('hidden');
        deletedUsersGrid.classList.remove('opacity-50', 'pointer-events-none');

        if (deletedPagination) {
            deletedPagination.innerHTML = '';
        }

        if (deletedEmptyState) {
            deletedEmptyState.classList.remove('hidden');
            deletedEmptyState.classList.add('flex');

            const title = deletedEmptyState.querySelector('h3');
            const text = deletedEmptyState.querySelector('p');

            if (title) {
                title.textContent = 'Unable to load deleted users';
            }

            if (text) {
                text.textContent = message || 'Something went wrong while loading deleted users.';
            }
        }
    }

    // Show delete error
    function showError(message) {
        if (window.Swal) {
            const theme = getSwalTheme();

            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                background: theme.background,
                color: theme.color,
                confirmButtonColor: theme.confirmButtonColor,
                cancelButtonColor: theme.cancelButtonColor
            });
        } else {
            window.alert(message);
        }
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
        userGrid.addEventListener('click', event => {
            const action = event.target.closest('[data-user-action="delete"]');

            if (!action) {
                return;
            }

            event.stopPropagation();
            closeDeletedMenus();
            handleSoftDelete(action.dataset.userId);
        });

        deletedUsersGrid.addEventListener('click', handleDeletedActions);
        deletedPagination?.addEventListener('click', handleDeletedPagination);

        panel.addEventListener('click', event => {
            if (!event.target.closest('[data-deleted-menu-button]') && !event.target.closest('.deleted-user-menu')) {
                closeDeletedMenus();
            }
        });
    }

    initEvents();

    return {
        loadDeletedUsers
    };
}