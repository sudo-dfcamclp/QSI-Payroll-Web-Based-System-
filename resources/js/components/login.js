
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // AUTH VIEWS
    // =========================================================

    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const authContent = document.getElementById('authContent');

    // =========================================================
    // LOGIN ELEMENTS
    // =========================================================

    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberInput = document.getElementById('remember');

    // =========================================================
    // REGISTER ELEMENTS
    // =========================================================

    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');
    const registerUsername = document.getElementById('registerUsername');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    // =========================================================
    // PASSWORD TOGGLE
    // =========================================================

    const togglePassword = document.getElementById('togglePassword');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');

    // =========================================================
    // CHECK REQUIRED AUTH ELEMENTS
    // =========================================================

    if (!loginView || !registerView || !showRegister || !showLogin || !authContent) {
        console.error('Login/Register view elements are missing.');
        return;
    }

    // =========================================================
    // UPDATE CONTENT HEIGHT
    // =========================================================

    function updateHeight(view) {
        if (!view) {
            return;
        }

        authContent.style.height = `${view.scrollHeight}px`;
    }

    // =========================================================
    // INITIAL HEIGHT
    // =========================================================

    updateHeight(loginView);

    // =========================================================
    // LOGIN → REGISTER
    // =========================================================

    showRegister.addEventListener('click', () => {

        updateHeight(registerView);

        loginView.classList.remove(
            'translate-x-0',
            'opacity-100'
        );

        loginView.classList.add(
            '-translate-x-full',
            'opacity-0'
        );

        registerView.classList.remove(
            'translate-x-full',
            'opacity-0'
        );

        registerView.classList.add(
            'translate-x-0',
            'opacity-100'
        );
    });

    // =========================================================
    // REGISTER → LOGIN
    // =========================================================

    showLogin.addEventListener('click', () => {

        updateHeight(loginView);

        registerView.classList.remove(
            'translate-x-0',
            'opacity-100'
        );

        registerView.classList.add(
            'translate-x-full',
            'opacity-0'
        );

        loginView.classList.remove(
            '-translate-x-full',
            'opacity-0'
        );

        loginView.classList.add(
            'translate-x-0',
            'opacity-100'
        );
    });

    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================

    if (togglePassword && passwordInput && eyeOpen && eyeClosed) {

        togglePassword.addEventListener('click', () => {

            const showPassword = passwordInput.type === 'password';

            passwordInput.type = showPassword ? 'text' : 'password';

            eyeOpen.classList.toggle(
                'hidden',
                !showPassword
            );

            eyeClosed.classList.toggle(
                'hidden',
                showPassword
            );

            togglePassword.setAttribute(
                'aria-label',
                showPassword ? 'Hide password' : 'Show password'
            );
        });
    }

    // =========================================================
    // LOGIN FORM SUBMIT
    // =========================================================

    if (loginForm) {

        loginForm.addEventListener('submit', async (event) => {

            event.preventDefault();

            await login();
        });
    }

    // =========================================================
    // LOGIN
    // =========================================================

    async function login() {

        const username = usernameInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const remember = rememberInput?.checked || false;

        // -----------------------------------------------------
        // FRONTEND VALIDATION
        // -----------------------------------------------------

        if (!username) {

            Swal.fire({
                icon: 'warning',
                title: 'Username Required',
                text: 'Please enter your username.',
                confirmButtonColor: '#0a5d3c'
            });

            usernameInput?.focus();

            return;
        }

        if (!password) {

            Swal.fire({
                icon: 'warning',
                title: 'Password Required',
                text: 'Please enter your password.',
                confirmButtonColor: '#0a5d3c'
            });

            passwordInput?.focus();

            return;
        }

        // -----------------------------------------------------
        // LOADING
        // -----------------------------------------------------

        setButtonLoading(
            loginButton,
            true,
            'Signing in...'
        );

        try {

            const response = await fetch('/payroll/public/api/login', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },

                credentials: 'same-origin',

                body: JSON.stringify({
                    username: username,
                    password: password,
                    remember: remember
                })
            });

            const data = await parseJsonResponse(response);

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (response.ok && data.success) {

                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: data.message || 'You have successfully signed in.',
                    confirmButtonColor: '#0a5d3c',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                window.location.href = data.redirect || '/dashboard';

                return;
            }

            // -------------------------------------------------
            // INVALID LOGIN
            // -------------------------------------------------

            if (response.status === 401) {

                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid username or password.',
                    confirmButtonColor: '#0a5d3c'
                });

                return;
            }

            // -------------------------------------------------
            // VALIDATION ERROR
            // -------------------------------------------------

            if (response.status === 422) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Input',
                    text: getFirstValidationError(data),
                    confirmButtonColor: '#0a5d3c'
                });

                return;
            }

            throw new Error(
                data.message || `Login failed. HTTP ${response.status}.`
            );

        }
        catch (error) {

            console.error('Login Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: error.message || 'Unable to connect to the server. Please try again.',
                confirmButtonColor: '#0a5d3c'
            });

        }
        finally {

            setButtonLoading(
                loginButton,
                false,
                'Sign In'
            );
        }
    }

    // =========================================================
    // REGISTER FORM SUBMIT
    // =========================================================

    if (registerForm) {

        registerForm.addEventListener('submit', async (event) => {

            event.preventDefault();

            await register();
        });
    }

    // =========================================================
    // REGISTER
    // =========================================================

    async function register() {

        const username = registerUsername?.value.trim() || '';
        const email = registerEmail?.value.trim() || '';
        const password = registerPassword?.value || '';
        const passwordConfirmation = confirmPassword?.value || '';

        // -----------------------------------------------------
        // FRONTEND VALIDATION
        // -----------------------------------------------------

        if (!username) {

            Swal.fire({
                icon: 'warning',
                title: 'Username Required',
                text: 'Please create a username.',
                confirmButtonColor: '#0a5d3c'
            });

            registerUsername?.focus();

            return;
        }

        if (!email) {

            Swal.fire({
                icon: 'warning',
                title: 'Email Required',
                text: 'Please enter your email address.',
                confirmButtonColor: '#0a5d3c'
            });

            registerEmail?.focus();

            return;
        }

        if (!isValidEmail(email)) {

            Swal.fire({
                icon: 'warning',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
                confirmButtonColor: '#0a5d3c'
            });

            registerEmail?.focus();

            return;
        }

        if (!password) {

            Swal.fire({
                icon: 'warning',
                title: 'Password Required',
                text: 'Please create a password.',
                confirmButtonColor: '#0a5d3c'
            });

            registerPassword?.focus();

            return;
        }

        if (password.length < 8) {

            Swal.fire({
                icon: 'warning',
                title: 'Weak Password',
                text: 'Password must be at least 8 characters.',
                confirmButtonColor: '#0a5d3c'
            });

            registerPassword?.focus();

            return;
        }

        if (!passwordConfirmation) {

            Swal.fire({
                icon: 'warning',
                title: 'Confirm Password',
                text: 'Please confirm your password.',
                confirmButtonColor: '#0a5d3c'
            });

            confirmPassword?.focus();

            return;
        }

        if (password !== passwordConfirmation) {

            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match.',
                confirmButtonColor: '#0a5d3c'
            });

            confirmPassword?.focus();

            return;
        }

        // -----------------------------------------------------
        // LOADING
        // -----------------------------------------------------

        setButtonLoading(
            registerButton,
            true,
            'Creating account...'
        );

        try {

            const response = await fetch('/payroll/public/api/register', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },

                credentials: 'same-origin',

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirmation
                })
            });

            const data = await parseJsonResponse(response);

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (response.ok && data.success) {

                await Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: data.message || 'Your account has been created successfully.',
                    confirmButtonColor: '#0a5d3c'
                });

                // Clear fields

                if (registerUsername) {
                    registerUsername.value = '';
                }

                if (registerEmail) {
                    registerEmail.value = '';
                }

                if (registerPassword) {
                    registerPassword.value = '';
                }

                if (confirmPassword) {
                    confirmPassword.value = '';
                }

                // Return to login

                showLogin.click();

                setTimeout(() => {
                    usernameInput?.focus();
                }, 550);

                return;
            }

            // -------------------------------------------------
            // VALIDATION ERROR
            // -------------------------------------------------

            if (response.status === 422) {

                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: getFirstValidationError(data),
                    confirmButtonColor: '#0a5d3c'
                });

                return;
            }

            // -------------------------------------------------
            // SERVER ERROR
            // -------------------------------------------------

            throw new Error(
                data.message || `Registration failed. HTTP ${response.status}.`
            );

        }
        catch (error) {

            console.error('Registration Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: error.message || 'Unable to connect to the server. Please try again.',
                confirmButtonColor: '#0a5d3c'
            });

        }
        finally {

            setButtonLoading(
                registerButton,
                false,
                'Create Account'
            );
        }
    }

    // =========================================================
    // CSRF TOKEN
    // =========================================================

    function getCsrfToken() {

        const token = document.querySelector(
            'meta[name="csrf-token"]'
        );

        return token
            ? token.getAttribute('content') || ''
            : '';
    }

    // =========================================================
    // SAFE JSON RESPONSE
    // =========================================================

    async function parseJsonResponse(response) {

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {

            return await response.json();
        }

        const text = await response.text();

        console.error(
            'Server returned non-JSON response:',
            {
                status: response.status,
                statusText: response.statusText,
                contentType: contentType,
                response: text.substring(0, 500)
            }
        );

        if (response.status === 404) {

            throw new Error(
                'Authentication endpoint was not found. Check your Laravel routes.'
            );
        }

        if (response.status === 419) {

            throw new Error(
                'Your session or CSRF token has expired. Please refresh the page and try again.'
            );
        }

        if (response.status >= 500) {

            throw new Error(
                'Laravel encountered a server error. Check the Laravel error log.'
            );
        }

        throw new Error(
            `Server returned an unexpected response (HTTP ${response.status}).`
        );
    }

    // =========================================================
    // FIRST VALIDATION ERROR
    // =========================================================

    function getFirstValidationError(data) {

        if (data?.errors) {

            const fields = Object.keys(data.errors);

            if (fields.length > 0) {

                const firstField = fields[0];
                const errors = data.errors[firstField];

                if (Array.isArray(errors) && errors.length > 0) {

                    return errors[0];
                }
            }
        }

        return data?.message || 'Please check the information you entered.';
    }

    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // =========================================================
    // BUTTON LOADING
    // =========================================================

    function setButtonLoading(button, loading, text) {

        if (!button) {
            return;
        }

        if (loading) {

            button.disabled = true;

            button.classList.add(
                'opacity-75',
                'cursor-not-allowed'
            );

            if (!button.dataset.originalText) {

                button.dataset.originalText =
                    button.innerHTML;
            }

            button.innerHTML = `
                <svg
                    class="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>

                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>

                ${text}
            `;
        }
        else {

            button.disabled = false;

            button.classList.remove(
                'opacity-75',
                'cursor-not-allowed'
            );

            button.innerHTML =
                button.dataset.originalText || text;

            delete button.dataset.originalText;
        }
    }

    // =========================================================
    // WINDOW RESIZE
    // =========================================================

    window.addEventListener('resize', () => {

        const registerIsVisible =
            registerView.classList.contains('translate-x-0');

        updateHeight(
            registerIsVisible
                ? registerView
                : loginView
        );
    });
});

