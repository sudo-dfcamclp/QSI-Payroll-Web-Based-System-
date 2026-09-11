import { toggleTheme } from './theme-manager.js';

document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    const collapseIcon = document.getElementById('collapseIcon');
    const searchExpanded = document.getElementById('searchExpanded');
    const searchMini = document.getElementById('searchMini');

    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileCloseButton = document.getElementById('mobileCloseButton');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const desktopCollapseButton = document.getElementById('desktopCollapseButton');
    const themeToggleButton = document.getElementById('themeToggleButton');

    const SIDEBAR_STORAGE_KEY = 'qsi_sidebar_mini';

    themeToggleButton?.addEventListener('click', toggleTheme);

    if (!sidebar) return;

    let isMini = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    let isMobileOpen = true;

    const isMobile = () => window.innerWidth < 768;

    // Update main content position.
    function updateMainContent() {

        if (!mainContent) return;

        if (isMobile()) {
            mainContent.style.marginLeft = '0px';
            return;
        }

        mainContent.style.marginLeft = isMini
            ? '80px'
            : '280px';
    }

    // Close all dropdown menus.
    function closeAllDropdowns() {

        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('open');
            menu.style.maxHeight = '0px';
            menu.style.opacity = '0';
        });

        document.querySelectorAll('.dropdown-chevron').forEach(chevron => {
            chevron.classList.remove('rotate-180');
        });
    }

    // Expand the desktop sidebar.
    function expandDesktopSidebar() {

        sidebar.style.width = '280px';

        sidebar.classList.remove('sidebar-mini');

        document.querySelectorAll('.sidebar-text').forEach(el => {
            el.classList.remove('hidden');
        });

        document.querySelectorAll(
            '.sidebar-nav-link, .dropdown-container > button'
        ).forEach(el => {
            el.classList.add('gap-3');
            el.classList.remove('justify-center');
        });

        document.querySelectorAll(
            '.sidebar-nav-link i:first-child, .dropdown-container > button > i:first-child'
        ).forEach(icon => {
            icon.classList.remove('mx-auto');
        });

        document.querySelectorAll('.sidebar-separator').forEach(el => {
            el.classList.remove('mx-3');
        });

        if (searchExpanded && searchMini) {
            searchExpanded.classList.remove('hidden');

            searchMini.classList.add('hidden');
            searchMini.classList.remove('flex');
        }

        if (collapseIcon) {
            collapseIcon.classList.remove('fa-chevron-right');
            collapseIcon.classList.add('fa-chevron-left');
        }

        isMini = false;

        localStorage.setItem(SIDEBAR_STORAGE_KEY, 'false');

        updateMainContent();
    }

    // Collapse the desktop sidebar.
    function collapseDesktopSidebar() {

        if (isMobile()) return;

        isMini = true;

        localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');

        sidebar.style.width = '80px';

        sidebar.classList.add('sidebar-mini');

        document.querySelectorAll('.sidebar-text').forEach(el => {
            el.classList.add('hidden');
        });

        document.querySelectorAll(
            '.sidebar-nav-link, .dropdown-container > button'
        ).forEach(el => {
            el.classList.remove('gap-3');
            el.classList.add('justify-center');
        });

        document.querySelectorAll(
            '.sidebar-nav-link i:first-child, .dropdown-container > button > i:first-child'
        ).forEach(icon => {
            icon.classList.add('mx-auto');
        });

        document.querySelectorAll('.sidebar-separator').forEach(el => {
            el.classList.add('mx-3');
        });

        if (searchExpanded && searchMini) {
            searchExpanded.classList.add('hidden');

            searchMini.classList.remove('hidden');
            searchMini.classList.add('flex');
        }

        closeAllDropdowns();

        if (collapseIcon) {
            collapseIcon.classList.remove('fa-chevron-left');
            collapseIcon.classList.add('fa-chevron-right');
        }

        updateMainContent();
    }

    // Handle the desktop collapse button.
    if (desktopCollapseButton) {

        desktopCollapseButton.addEventListener('click', () => {

            if (isMini) {
                expandDesktopSidebar();
            } else {
                collapseDesktopSidebar();
            }

        });

    }

    // Open the mobile sidebar.
    function openMobileSidebar() {

        if (!isMobile()) return;

        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');

        sidebarOverlay?.classList.remove('hidden');

        mobileMenuButton?.classList.add('hidden');

        mobileCloseButton?.classList.remove('hidden');
        mobileCloseButton?.classList.add('flex');

        isMobileOpen = true;

        updateMainContent();
    }

    // Close the mobile sidebar.
    function closeMobileSidebar() {

        if (!isMobile()) return;

        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');

        sidebarOverlay?.classList.add('hidden');

        mobileMenuButton?.classList.remove('hidden');
        mobileMenuButton?.classList.add('flex');

        mobileCloseButton?.classList.add('hidden');
        mobileCloseButton?.classList.remove('flex');

        closeAllDropdowns();

        isMobileOpen = false;

        updateMainContent();
    }

    // Handle the mobile menu button.
    mobileMenuButton?.addEventListener(
        'click',
        openMobileSidebar
    );

    mobileCloseButton?.addEventListener(
        'click',
        closeMobileSidebar
    );

    sidebarOverlay?.addEventListener(
        'click',
        closeMobileSidebar
    );

    // Handle the mini sidebar search.
    searchMini?.addEventListener('click', () => {

        if (isMobile()) {

            openMobileSidebar();

            return;
        }

        if (isMini) {

            expandDesktopSidebar();

            setTimeout(() => {

                const input =
                    searchExpanded?.querySelector('input');

                input?.focus();

            }, 350);

        }

    });

    // Handle the sidebar logo.
    const logoButton =
        sidebar.querySelector('.sidebar-logo');

    logoButton?.addEventListener('click', () => {

        if (!isMobile() && isMini) {
            expandDesktopSidebar();
        }

    });

    // Handle dropdown buttons.
    document.querySelectorAll(
        '.dropdown-container > button'
    ).forEach(button => {

        button.addEventListener('click', () => {

            const container =
                button.closest('.dropdown-container');

            if (!container) return;

            if (!isMobile() && isMini) {

                expandDesktopSidebar();

                setTimeout(() => {
                    toggleDropdown(container);
                }, 350);

                return;
            }

            toggleDropdown(container);
        });

    });

    // Toggle a dropdown menu.
    function toggleDropdown(container) {

        const menu =
            container.querySelector('.dropdown-menu');

        const chevron =
            container.querySelector('.dropdown-chevron');

        if (!menu) return;

        document.querySelectorAll(
            '.dropdown-container'
        ).forEach(item => {

            if (item !== container) {

                const otherMenu =
                    item.querySelector('.dropdown-menu');

                const otherChevron =
                    item.querySelector('.dropdown-chevron');

                otherMenu?.classList.remove('open');

                if (otherMenu) {
                    otherMenu.style.maxHeight = '0px';
                    otherMenu.style.opacity = '0';
                }

                otherChevron?.classList.remove(
                    'rotate-180'
                );
            }

        });

        const isOpen =
            menu.classList.contains('open');

        if (isOpen) {

            menu.classList.remove('open');

            menu.style.maxHeight = '0px';
            menu.style.opacity = '0';

            chevron?.classList.remove('rotate-180');

        } else {

            menu.classList.add('open');

            menu.style.maxHeight =
                `${menu.scrollHeight}px`;

            menu.style.opacity = '1';

            chevron?.classList.add('rotate-180');
        }

    }

    // Handle responsive sidebar layout.
    function handleResponsiveLayout() {

        if (isMobile()) {

            sidebar.style.width = '280px';

            sidebar.classList.remove('sidebar-mini');

            document.querySelectorAll(
                '.sidebar-text'
            ).forEach(el => {
                el.classList.remove('hidden');
            });

            searchExpanded?.classList.remove('hidden');

            searchMini?.classList.add('hidden');
            searchMini?.classList.remove('flex');

            desktopCollapseButton?.classList.add('hidden');

            mobileCloseButton?.classList.remove('hidden');
            mobileCloseButton?.classList.add('flex');

            mobileMenuButton?.classList.add('hidden');

            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');

            sidebarOverlay?.classList.remove('hidden');

            isMobileOpen = true;
            isMini = false;

        } else {

            sidebar.style.width =
                isMini ? '80px' : '280px';

            sidebar.classList.remove(
                '-translate-x-full'
            );

            sidebar.classList.add(
                'translate-x-0'
            );

            sidebarOverlay?.classList.add('hidden');

            mobileMenuButton?.classList.add('hidden');

            mobileCloseButton?.classList.add('hidden');

            desktopCollapseButton?.classList.remove('hidden');

            if (isMini) {

                sidebar.classList.add('sidebar-mini');

                document.querySelectorAll(
                    '.sidebar-text'
                ).forEach(el => {
                    el.classList.add('hidden');
                });

                document.querySelectorAll(
                    '.sidebar-nav-link, .dropdown-container > button'
                ).forEach(el => {
                    el.classList.remove('gap-3');
                    el.classList.add('justify-center');
                });

                document.querySelectorAll(
                    '.sidebar-nav-link i:first-child, .dropdown-container > button > i:first-child'
                ).forEach(icon => {
                    icon.classList.add('mx-auto');
                });

                document.querySelectorAll('.sidebar-separator').forEach(el => {
                    el.classList.add('mx-3');
                });

                searchExpanded?.classList.add('hidden');

                searchMini?.classList.remove('hidden');
                searchMini?.classList.add('flex');

                if (collapseIcon) {
                    collapseIcon.classList.remove('fa-chevron-left');
                    collapseIcon.classList.add('fa-chevron-right');
                }

            } else {

                sidebar.classList.remove('sidebar-mini');

                document.querySelectorAll(
                    '.sidebar-text'
                ).forEach(el => {
                    el.classList.remove('hidden');
                });

                document.querySelectorAll(
                    '.sidebar-nav-link, .dropdown-container > button'
                ).forEach(el => {
                    el.classList.add('gap-3');
                    el.classList.remove('justify-center');
                });

                document.querySelectorAll(
                    '.sidebar-nav-link i:first-child, .dropdown-container > button > i:first-child'
                ).forEach(icon => {
                    icon.classList.remove('mx-auto');
                });

                document.querySelectorAll('.sidebar-separator').forEach(el => {
                    el.classList.remove('mx-3');
                });

                searchExpanded?.classList.remove('hidden');

                searchMini?.classList.add('hidden');
                searchMini?.classList.remove('flex');

                if (collapseIcon) {
                    collapseIcon.classList.remove('fa-chevron-right');
                    collapseIcon.classList.add('fa-chevron-left');
                }

            }

            isMobileOpen = true;
        }

        updateMainContent();
    }

    // Watch for responsive layout changes.
    window.addEventListener(
        'resize',
        handleResponsiveLayout
    );

    handleResponsiveLayout();

});