import Swal from 'sweetalert2';

const initializedPanels = new WeakSet();

export async function init(panel) {
    if (!panel || initializedPanels.has(panel)) return;
    initializedPanels.add(panel);

    const profileImage = panel.querySelector('#settingsProfileImage');
    const profileFallback = panel.querySelector('#settingsProfileFallback');
    const profileInput = panel.querySelector('#settingsProfileInput');
    const changeProfileButton = panel.querySelector('#settingsChangeProfileButton');
    const deleteProfileButton = panel.querySelector('#settingsDeleteProfileButton');

    const editInfoButton = panel.querySelector('#settingsEditInfoButton');
    const usernameInput = panel.querySelector('#settingsUsername');
    const emailInput = panel.querySelector('#settingsEmail');
    const lastUpdate = panel.querySelector('#settingsLastUpdate');

    const passwordForm = panel.querySelector('#settingsPasswordForm');
    const changePasswordButton = panel.querySelector('#settingsChangePasswordButton');
    const currentPasswordInput = panel.querySelector('#settingsCurrentPassword');
    const newPasswordInput = panel.querySelector('#settingsNewPassword');
    const confirmPasswordInput = panel.querySelector('#settingsConfirmPassword');

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    // Supports both root hosting and subdirectory hosting such as /payroll/public.
    const pathname = window.location.pathname;
    const publicIndex = pathname.indexOf('/public');
    const appBase = publicIndex >= 0
        ? pathname.slice(0, publicIndex + '/public'.length)
        : '';

    const API = {
        profile: `${appBase}/api/settings/profile`,
        updateProfile: `${appBase}/api/settings/profile`,
        changeProfile: `${appBase}/api/settings/profile/picture`,
        deleteProfile: `${appBase}/api/settings/profile/picture`,
        changePassword: `${appBase}/api/settings/password`,
    };

    let editingInfo = false;
    let originalInfo = {
        username: '',
        email: '',
    };

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    function showSuccess(message) {
        toast.fire({
            icon: 'success',
            title: message,
        });
    }

    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Unable to complete',
            text: message,
            confirmButtonColor: '#0a5d3c',
        });
    }

    function getErrorMessage(data, fallback) {
        if (data?.errors) {
            const firstError = Object.values(data.errors).flat()[0];
            if (firstError) return firstError;
        }

        return data?.message || fallback;
    }

    async function request(url, options = {}) {
        const headers = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(options.headers || {}),
        };

        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'same-origin',
        });

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (response.status === 401 || response.status === 419) {
            throw new Error(
                response.status === 419
                    ? 'Your session expired. Refresh the page and try again.'
                    : 'Your session has expired. Please log in again.'
            );
        }

        if (!response.ok) {
            throw new Error(
                getErrorMessage(data, 'The request failed. Please try again.')
            );
        }

        return data;
    }

    function formatDate(value) {
        if (!value) return 'Not available';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat('en-PH', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    function setLastUpdate(value) {
        if (lastUpdate) {
            lastUpdate.textContent = formatDate(value);
        }
    }

    function setProfilePicture(profile) {
        if (!profileImage || !profileFallback) return;

        if (!profile) {
            profileImage.src = '';
            profileImage.classList.add('hidden');
            profileFallback.classList.remove('hidden');
            return;
        }

        const imageUrl = `${appBase}/storage/${String(profile)
            .replace(/^\/+/, '')
            .split('/')
            .map(encodeURIComponent)
            .join('/')}`;

        profileImage.onload = () => {
            profileImage.classList.remove('hidden');
            profileFallback.classList.add('hidden');
        };

        profileImage.onerror = () => {
            profileImage.classList.add('hidden');
            profileFallback.classList.remove('hidden');
        };

        profileImage.src = imageUrl;
    }

    function setInfoEditable(editable) {
        usernameInput.disabled = !editable;
        emailInput.disabled = !editable;

        editInfoButton.innerHTML = editable
            ? '<i class="fa-solid fa-floppy-disk mr-2"></i>Save'
            : '<i class="fa-solid fa-pen-to-square mr-2"></i>Edit';
    }

    function setButtonLoading(button, loading, loadingText, normalText) {
        if (!button) return;

        button.disabled = loading;
        button.classList.toggle('opacity-70', loading);
        button.classList.toggle('cursor-not-allowed', loading);
        button.innerHTML = loading ? loadingText : normalText;
    }

    async function loadProfile() {
        try {
            const data = await request(API.profile);

            const user = data.user || data;

            usernameInput.value = user.username || '';
            emailInput.value = user.email || '';

            originalInfo = {
                username: usernameInput.value,
                email: emailInput.value,
            };

            setProfilePicture(user.profile);
            setLastUpdate(user.updated_at);
        } catch (error) {
            showError(error.message);
        }
    }

    changeProfileButton?.addEventListener('click', () => {
        profileInput?.click();
    });

    profileInput?.addEventListener('change', async () => {
        const file = profileInput.files?.[0];

        if (!file) return;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            showError('Please select a JPG, PNG, or WEBP image.');
            profileInput.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError('The profile picture must not exceed 5 MB.');
            profileInput.value = '';
            return;
        }

        const confirmation = await Swal.fire({
            title: 'Change profile picture?',
            text: 'This will replace your current profile picture.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Upload',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0a5d3c',
        });

        if (!confirmation.isConfirmed) {
            profileInput.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('profile', file);

        const normalText =
            '<i class="fa-solid fa-camera mr-2"></i>Change Profile';

        try {
            setButtonLoading(
                changeProfileButton,
                true,
                '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Uploading...',
                normalText
            );

            const data = await request(API.changeProfile, {
                method: 'POST',
                body: formData,
            });

            setProfilePicture(data.profile);
            setLastUpdate(data.updated_at);

            showSuccess(data.message || 'Profile picture updated.');
        } catch (error) {
            showError(error.message);
        } finally {
            setButtonLoading(
                changeProfileButton,
                false,
                '',
                normalText
            );

            profileInput.value = '';
        }
    });

    deleteProfileButton?.addEventListener('click', async () => {
        const confirmation = await Swal.fire({
            title: 'Delete profile picture?',
            text: 'Your profile picture will be removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
        });

        if (!confirmation.isConfirmed) return;

        const normalText =
            '<i class="fa-solid fa-trash-can mr-2"></i>Delete Profile';

        try {
            setButtonLoading(
                deleteProfileButton,
                true,
                '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Deleting...',
                normalText
            );

            const data = await request(API.deleteProfile, {
                method: 'DELETE',
            });

            setProfilePicture(null);
            setLastUpdate(data.updated_at);

            showSuccess(data.message || 'Profile picture deleted.');
        } catch (error) {
            showError(error.message);
        } finally {
            setButtonLoading(
                deleteProfileButton,
                false,
                '',
                normalText
            );
        }
    });

    editInfoButton?.addEventListener('click', async () => {
        if (!editingInfo) {
            originalInfo = {
                username: usernameInput.value,
                email: emailInput.value,
            };

            editingInfo = true;
            setInfoEditable(true);
            usernameInput.focus();
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        if (!username || !email) {
            showError('Username and email are required.');
            return;
        }

        const confirmation = await Swal.fire({
            title: 'Save profile information?',
            text: 'Your username and email will be updated.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0a5d3c',
        });

        if (!confirmation.isConfirmed) return;

        const normalText =
            '<i class="fa-solid fa-floppy-disk mr-2"></i>Save';

        try {
            setButtonLoading(
                editInfoButton,
                true,
                '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Saving...',
                normalText
            );

            const data = await request(API.updateProfile, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                }),
            });

            const user = data.user || {};

            usernameInput.value = user.username || username;
            emailInput.value = user.email || email;

            originalInfo = {
                username: usernameInput.value,
                email: emailInput.value,
            };

            editingInfo = false;
            setInfoEditable(false);
            setLastUpdate(user.updated_at);

            showSuccess(data.message || 'Profile information updated.');
        } catch (error) {
            showError(error.message);
        } finally {
            setButtonLoading(
                editInfoButton,
                false,
                '',
                editingInfo
                    ? '<i class="fa-solid fa-floppy-disk mr-2"></i>Save'
                    : '<i class="fa-solid fa-pen-to-square mr-2"></i>Edit'
            );
        }
    });

    passwordForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('Please complete all password fields.');
            return;
        }

        if (newPassword.length < 8) {
            showError('Your new password must be at least 8 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('The new password and confirmation do not match.');
            return;
        }

        const confirmation = await Swal.fire({
            title: 'Change password?',
            text: 'You will need to use your new password next time you log in.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Change Password',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0a5d3c',
        });

        if (!confirmation.isConfirmed) return;

        const normalText = 'Change Password';

        try {
            setButtonLoading(
                changePasswordButton,
                true,
                '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Updating...',
                normalText
            );

            const data = await request(API.changePassword, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });

            passwordForm.reset();
            setLastUpdate(data.updated_at);

            showSuccess(data.message || 'Password changed successfully.');
        } catch (error) {
            showError(error.message);
        } finally {
            setButtonLoading(
                changePasswordButton,
                false,
                '',
                normalText
            );
        }
    });

    await loadProfile();
}