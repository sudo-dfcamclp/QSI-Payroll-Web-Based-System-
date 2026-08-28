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

    if (!sidebar) return;

    let isMini = false;
    let isMobileOpen = true;

    const isMobile = () => window.innerWidth < 768;

    // ==========================================
    // RESPONSIVE CONTENT
    // ==========================================

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

    // ==========================================
    // CLOSE DROPDOWNS
    // ==========================================

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

    // ==========================================
    // EXPAND DESKTOP SIDEBAR
    // ==========================================

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

        updateMainContent();
    }

    // ==========================================
    // COLLAPSE DESKTOP SIDEBAR
    // ==========================================

    function collapseDesktopSidebar() {

        if (isMobile()) return;

        isMini = true;

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

    // ==========================================
    // DESKTOP COLLAPSE BUTTON
    // ==========================================

    if (desktopCollapseButton) {

        desktopCollapseButton.addEventListener('click', () => {

            if (isMini) {
                expandDesktopSidebar();
            } else {
                collapseDesktopSidebar();
            }

        });

    }

    // ==========================================
    // MOBILE OPEN
    // ==========================================

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

    // ==========================================
    // MOBILE CLOSE
    // ==========================================

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

    // ==========================================
    // MOBILE BUTTON
    // ==========================================

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

    // ==========================================
    // SEARCH
    // ==========================================

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

    // ==========================================
    // LOGO
    // ==========================================

    const logoButton =
        sidebar.querySelector('.sidebar-logo');

    logoButton?.addEventListener('click', () => {

        if (!isMobile() && isMini) {
            expandDesktopSidebar();
        }

    });

    // ==========================================
    // DROPDOWNS
    // ==========================================

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

    // ==========================================
    // RESPONSIVE
    // ==========================================

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
            } else {
                sidebar.classList.remove('sidebar-mini');
            }

            isMobileOpen = true;
        }

        updateMainContent();
    }

    window.addEventListener(
        'resize',
        handleResponsiveLayout
    );

    handleResponsiveLayout();

});