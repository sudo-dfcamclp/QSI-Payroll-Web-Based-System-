<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ePayroll | Login</title>

    @vite(['resources/css/app.css', 'resources/js/components/login.js'])
</head>

<body class="min-h-screen bg-slate-100">
    <main class="flex min-h-screen items-center justify-center px-4 py-8">

        <!-- AUTH CARD -->
        <div id="authCard" class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            <!-- BRAND HEADER -->
            <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <div class="flex items-center gap-3">

                    <!-- Logo -->
                    <div class="flex h-11 w-11 items-center justify-center">
                        <img src="{{ asset('assets/logo/logo.png') }}" alt="QSI Logo" class="pointer-events-none h-12 w-12 object-contain">
                    </div>

                    <!-- Brand -->
                    <div>
                        <h1 class="text-lg font-bold tracking-tight text-slate-900">ePayroll</h1>
                        <p class="text-xs text-slate-500">Payroll Web Based System</p>
                    </div>

                </div>
            </div>

            <!-- CONTENT WRAPPER -->
            <div id="authContent"class="relative mt-8 overflow-hidden transition-[height] duration-500 ease-in-out">

                <!-- LOGIN VIEW -->
                <section id="loginView" class="px-8 pb-8 transition-all duration-500 ease-in-out sm:px-10 sm:pb-10">

                    <!-- Heading -->
                    <div class="mb-7">
                        <p class="mb-2 text-xs font-semibold tracking-[0.18em] text-[#0a5d3c]">ACCOUNT ACCESS</p>
                        <h2 class="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500">Enter your credentials to access your account.</p>
                    </div>

                    <!-- LOGIN FORM -->
                    <form id="loginForm" class="space-y-5" autocomplete="off">

                        <!-- Username -->
                        <div>
                            <label for="username" class="mb-2 block text-sm font-medium text-slate-700">Username</label>

                            <div class="relative">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0" />
                                    </svg>
                                </div>

                                <input id="username" name="username" type="text" autocomplete="username" placeholder="Enter your username" class="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">
                            </div>
                        </div>

                        <!-- Password -->
                        <div>
                            <div class="mb-2 flex items-center justify-between">
                                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                                <button type="button" class="cursor-pointer text-sm font-medium text-[#0a5d3c] transition hover:text-[#0d9488]">Forgot password?</button>
                            </div>

                            <div class="relative">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11V7a3 3 0 00-6 0v4m-2 0h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                                    </svg>
                                </div>

                                <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" class="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">

                                <!-- Toggle Password -->
                                <button type="button" id="togglePassword" aria-label="Show password" class="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[#0a5d3c]">

                                    <!-- Eye Open -->
                                    <svg id="eyeOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>

                                    <!-- Eye Closed -->
                                    <svg id="eyeClosed" xmlns="http://www.w3.org/2000/svg" class="hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.477 10.477a3 3 0 004.243 4.243" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 5.09A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.132 5.168M6.18 6.18A9.97 9.97 0 002.458 12c1.274 4.057 5.064 7 9.542 7a9.97 9.97 0 004.13-.894" />
                                    </svg>

                                </button>
                            </div>
                        </div>

                        <!-- Remember Me -->
                        <div class="flex items-center">
                            <label class="flex cursor-pointer items-center gap-3">
                                <input id="remember" name="remember" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#0a5d3c] focus:ring-2 focus:ring-[#0a5d3c]">
                                <span class="text-sm text-slate-600">Remember me</span>
                            </label>
                        </div>

                        <!-- Login Button -->
                        <button id="loginButton" type="submit" class="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a5d3c] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0a5d3c]/20 transition duration-200 hover:bg-[#0d9488] hover:shadow-[#0a5d3c]/30 focus:outline-none focus:ring-4 focus:ring-[#0a5d3c]/20 active:scale-[0.99]">
                            <span id="loginButtonText">Sign In</span>

                            <svg id="loginButtonIcon" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5l5 5-5 5" />
                            </svg>
                        </button>

                    </form>

                    <!-- Register -->
                    <div class="mt-8 border-t border-slate-200 pt-6 text-center">
                        <p class="text-sm text-slate-500">
                            Don't have an account?
                            <button id="showRegister" type="button" class="ml-1 cursor-pointer font-semibold text-[#0a5d3c] transition hover:text-[#0d9488]">Create an account</button>
                        </p>
                    </div>

                    <!-- Security -->
                    <div class="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 01-2-2H6a2 2 0 01-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure payroll system</span>
                    </div>

                </section>

                <!-- REGISTRATION VIEW -->
                <section id="registerView" class="absolute inset-x-0 top-0 translate-x-full px-8 pb-8 opacity-0 transition-all duration-500 ease-in-out sm:px-10 sm:pb-10">

                    <!-- Heading -->
                    <div class="mb-7">
                        <p class="mb-2 text-xs font-semibold tracking-[0.18em] text-[#0a5d3c]">NEW ACCOUNT</p>
                        <h2 class="text-3xl font-bold tracking-tight text-slate-900">Create account</h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500">Create your account to get started with ePayroll.</p>
                    </div>

                    <!-- Registration Form -->
                    <form id="registerForm" class="space-y-4" autocomplete="off">

                        <!-- Username -->
                        <div>
                            <label for="registerUsername" class="mb-2 block text-sm font-medium text-slate-700">Username</label>
                            <input id="registerUsername" name="username" type="text" autocomplete="username" placeholder="Create a username" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="registerEmail" class="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                            <input id="registerEmail" name="email" type="email" autocomplete="email" placeholder="Enter your email" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="registerPassword" class="mb-2 block text-sm font-medium text-slate-700">Password</label>
                            <input id="registerPassword" name="password" type="password" autocomplete="new-password" placeholder="Create a password" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label for="confirmPassword" class="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                            <input id="confirmPassword" name="password_confirmation" type="password" autocomplete="new-password" placeholder="Confirm your password" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0a5d3c] focus:ring-4 focus:ring-[#0a5d3c]/10">
                        </div>

                        <!-- Register Button -->
                        <button id="registerButton" type="submit" class="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a5d3c] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0a5d3c]/20 transition duration-200 hover:bg-[#0d9488] hover:shadow-[#0a5d3c]/30 focus:outline-none focus:ring-4 focus:ring-[#0a5d3c]/20 active:scale-[0.99]">
                            <span id="registerButtonText">Create Account</span>

                            <svg id="registerButtonIcon" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5l5 5-5 5" />
                            </svg>
                        </button>

                    </form>

                    <!-- Back -->
                    <div class="mt-7 border-t border-slate-200 pt-6 text-center">
                        <p class="text-sm text-slate-500">
                            Already have an account?
                            <button id="showLogin" type="button" class="ml-1 cursor-pointer font-semibold text-[#0a5d3c] transition hover:text-[#0d9488]">Sign in</button>
                        </p>
                    </div>

                </section>

            </div>

            <!-- CARD FOOTER -->
            <div class="border-t border-slate-100 bg-slate-50 px-8 py-4 text-center sm:px-10">
                <p class="text-xs text-slate-400">© 2026 Quest Serv Inc. All rights reserved.</p>
            </div>

        </div>

    </main>
</body>
</html>