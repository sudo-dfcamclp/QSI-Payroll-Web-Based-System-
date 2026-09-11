document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // LOCAL STORAGE KEY
    // =========================================================
    const STORAGE_KEY = 'laravel_epayroll_open_tabs';
    const ACTIVE_TAB_KEY = 'laravel_epayroll_active_tab';

    // =========================================================
    // AUTHORIZATION
    // =========================================================
    let currentUserId = null;
    let allowedTabs = new Set();

    // =========================================================
    // PAGE JAVASCRIPT REGISTRY
    // =========================================================
    const PAGE_SCRIPTS = {
        'employee-info': () => import('../pages/employee-info.js'),
        'employee-deduction': () => import('../pages/employee-deduction.js'),
        'user-management': () => import('../admin_script/UserManagement.js'),
        'role-management': () => import('../admin_script/RoleManagement.js'),
        'system-settings': () => import('../admin_script/SystemSetting.js'),
    };

    // =========================================================
    // ELEMENTS
    // =========================================================
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');

    if (!tabList || !tabContent) {
        return;
    }

    // =========================================================
    // LOAD CURRENT USER PERMISSIONS
    // =========================================================
    async function loadCurrentUserPermissions() {
        try {
            const permissionsUrl = document
                .querySelector('meta[name="auth-permissions-url"]')
                ?.getAttribute('content');

            if (!permissionsUrl) {
                throw new Error('Auth permissions URL is not configured.');
            }

            console.log('Permissions URL:', permissionsUrl);

            const response = await fetch(permissionsUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            console.log('Permissions response:', data);

            if (
                !data ||
                data.success !== true ||
                !data.user ||
                !Array.isArray(data.allowed_tabs)
            ) {
                throw new Error('Invalid permissions response.');
            }

            currentUserId = data.user.user_id;
            allowedTabs = new Set(data.allowed_tabs);
            allowedTabs.add('dashboard');

            return true;
        } catch (error) {
            console.error(
                'Failed to load current user permissions:',
                error
            );

            currentUserId = null;
            allowedTabs = new Set();

            return false;
        }
    }

    // =========================================================
    // CHECK TAB AUTHORIZATION
    // =========================================================
    function isTabAllowed(tabId) {
        if (!tabId) {
            return false;
        }

        if (tabId === 'dashboard') {
            return true;
        }

        return allowedTabs.has(tabId);
    }

    // =========================================================
    // GET USER-SPECIFIC STORAGE KEY
    // =========================================================
    function getStorageKey() {
        if (!currentUserId) {
            return null;
        }

        return `${STORAGE_KEY}_user_${currentUserId}`;
    }

    // =========================================================
    // GET ACTIVE TAB STORAGE KEY
    // =========================================================
    function getActiveTabKey() {
        if (!currentUserId) {
            return null;
        }

        return `${ACTIVE_TAB_KEY}_user_${currentUserId}`;
    }

    // =========================================================
    // DRAGGABLE TAB + ANIMATION
    // =========================================================
    let draggedTab = null;
    let dragOverTab = null;
    let isDragging = false;
    let dragStartIndex = -1;
    let lastPointerX = 0;

    // =========================================================
    // GET TABS
    // =========================================================
    function getTabs() {
        return Array.from(tabList.querySelectorAll('.tab-item'));
    }

    // =========================================================
    // FLIP — CAPTURE POSITIONS
    // =========================================================
    function captureTabPositions() {
        const positions = new Map();

        getTabs().forEach(tab => {
            const rect = tab.getBoundingClientRect();

            positions.set(tab, {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
        });

        return positions;
    }

    // =========================================================
    // FLIP — PLAY ANIMATION
    // =========================================================
    function playTabFlip(firstPositions) {
        const tabs = getTabs();

        tabs.forEach(tab => {
            if (tab === draggedTab) {
                return;
            }

            const first = firstPositions.get(tab);

            if (!first) {
                return;
            }

            const lastRect = tab.getBoundingClientRect();
            const deltaX = first.left - lastRect.left;
            const deltaY = first.top - lastRect.top;

            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
                return;
            }

            tab.style.transition = 'none';
            tab.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    tab.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';
                    tab.style.transform = 'translate(0, 0)';
                });
            });
        });
    }

    // =========================================================
    // RESET TAB TRANSFORM
    // =========================================================
    function resetTabAnimation(tab) {
        if (!tab) {
            return;
        }

        tab.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';
        tab.style.transform = 'translate(0, 0) scale(1)';
    }

    // =========================================================
    // DRAG START
    // =========================================================
    function handleDragStart(event) {
        const tab = event.currentTarget;

        if (!tab || tab.dataset.tabId === 'dashboard') {
            event.preventDefault();
            return;
        }

        draggedTab = tab;
        isDragging = true;

        const tabs = getTabs();
        dragStartIndex = tabs.indexOf(tab);

        tab.classList.add('tab-dragging');
        tab.style.transition = 'transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease';
        tab.style.transform = 'translateY(-3px) scale(1.04)';
        tab.style.opacity = '0.72';
        tab.style.zIndex = '1000';
        tab.style.position = 'relative';
        tab.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.18)';

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';

            try {
                event.dataTransfer.setData(
                    'text/plain',
                    tab.dataset.tabId
                );
            } catch (error) {
                console.warn('Unable to set drag data:', error);
            }
        }

        requestAnimationFrame(() => {
            if (tab) {
                tab.classList.add('tab-drag-active');
            }
        });
    }

    // =========================================================
    // DRAG OVER
    // =========================================================
    function handleDragOver(event) {
        event.preventDefault();

        if (!isDragging || !draggedTab) {
            return;
        }

        const targetTab = event.currentTarget;

        if (!targetTab || targetTab === draggedTab) {
            return;
        }

        if (targetTab.dataset.tabId === 'dashboard') {
            return;
        }

        lastPointerX = event.clientX;

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }

        const rect = targetTab.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const insertBefore = event.clientX < centerX;
        const firstPositions = captureTabPositions();

        if (insertBefore) {
            if (draggedTab.nextElementSibling !== targetTab) {
                tabList.insertBefore(draggedTab, targetTab);
                playTabFlip(firstPositions);
            }
        } else {
            if (draggedTab.previousElementSibling !== targetTab) {
                tabList.insertBefore(
                    draggedTab,
                    targetTab.nextSibling
                );
                playTabFlip(firstPositions);
            }
        }

        dragOverTab = targetTab;
        updateDragOverVisuals();
    }

    // =========================================================
    // DRAG ENTER
    // =========================================================
    function handleDragEnter(event) {
        event.preventDefault();

        const targetTab = event.currentTarget;

        if (
            !targetTab ||
            targetTab === draggedTab ||
            targetTab.dataset.tabId === 'dashboard'
        ) {
            return;
        }

        dragOverTab = targetTab;
        updateDragOverVisuals();
    }

    // =========================================================
    // DRAG LEAVE
    // =========================================================
    function handleDragLeave(event) {
        const targetTab = event.currentTarget;

        if (!targetTab) {
            return;
        }

        if (
            event.relatedTarget &&
            targetTab.contains(event.relatedTarget)
        ) {
            return;
        }

        targetTab.classList.remove('tab-drag-over');
    }

    // =========================================================
    // UPDATE DRAG VISUALS
    // =========================================================
    function updateDragOverVisuals() {
        getTabs().forEach(tab => {
            if (tab === draggedTab || tab === dragOverTab) {
                if (tab === dragOverTab) {
                    tab.classList.add('tab-drag-over');
                }

                return;
            }

            tab.classList.remove('tab-drag-over');
        });
    }

    // =========================================================
    // DROP
    // =========================================================
    function handleDrop(event) {
        event.preventDefault();

        if (!draggedTab) {
            return;
        }

        getTabs().forEach(tab => {
            tab.classList.remove('tab-drag-over');
        });

        saveTabs();
    }

    // =========================================================
    // DRAG END
    // =========================================================
    function handleDragEnd() {
        if (!draggedTab) {
            return;
        }

        const tab = draggedTab;

        tab.classList.remove(
            'tab-dragging',
            'tab-drag-active'
        );

        tab.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';
        tab.style.transform = 'translateY(0) scale(1)';
        tab.style.opacity = '1';
        tab.style.zIndex = '';
        tab.style.position = '';
        tab.style.boxShadow = '';

        getTabs().forEach(item => {
            item.classList.remove(
                'tab-drag-over',
                'tab-dragging',
                'tab-drag-active'
            );

            if (item !== tab) {
                item.style.opacity = '1';
                item.style.zIndex = '';
                item.style.boxShadow = '';
                item.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';
                item.style.transform = 'translate(0, 0) scale(1)';
            }
        });

        saveTabs();

        draggedTab = null;
        dragOverTab = null;
        isDragging = false;
        dragStartIndex = -1;
    }

    // =========================================================
    // INITIALIZE DRAG
    // =========================================================
    function initializeTabDrag(tabButton) {
        if (!tabButton) {
            return;
        }

        tabButton.draggable = true;

        tabButton.addEventListener(
            'dragstart',
            handleDragStart
        );

        tabButton.addEventListener(
            'dragover',
            handleDragOver
        );

        tabButton.addEventListener(
            'dragenter',
            handleDragEnter
        );

        tabButton.addEventListener(
            'dragleave',
            handleDragLeave
        );

        tabButton.addEventListener(
            'drop',
            handleDrop
        );

        tabButton.addEventListener(
            'dragend',
            handleDragEnd
        );
    }

    // =========================================================
    // RESTORE TABS FROM LOCAL STORAGE
    // =========================================================
    async function restoreSavedTabs() {
        if (!currentUserId) {
            return;
        }

        const savedTabs = getSavedTabs();

        if (savedTabs.length === 0) {
            return;
        }

        // =====================================================
        // FILTER UNAUTHORIZED TABS
        // =====================================================
        const authorizedTabs = savedTabs.filter(tab => {
            if (!tab || !tab.tabId) {
                return false;
            }

            return isTabAllowed(tab.tabId);
        });

        // =====================================================
        // REMOVE UNAUTHORIZED TABS FROM STORAGE
        // =====================================================
        if (authorizedTabs.length !== savedTabs.length) {
            localStorage.setItem(
                getStorageKey(),
                JSON.stringify(authorizedTabs)
            );
        }

        if (authorizedTabs.length === 0) {
            localStorage.removeItem(getActiveTabKey());
            return;
        }

        // =====================================================
        // CREATE ALL AUTHORIZED TABS FIRST
        // WITHOUT ACTIVATING ANY
        // =====================================================
        const loadPromises = [];

        for (const tab of authorizedTabs) {
            const {
                tabId,
                tabTitle,
                tabIcon,
                page
            } = tab;

            const existingTab = document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );

            if (
                !existingTab &&
                isTabAllowed(tabId)
            ) {
                loadPromises.push(
                    createTabWithoutActivating(
                        tabId,
                        tabTitle,
                        tabIcon,
                        page
                    )
                );
            }
        }

        // =====================================================
        // WAIT FOR ALL TABS TO FINISH LOADING
        // =====================================================
        await Promise.all(loadPromises);

        // =====================================================
        // ACTIVATE LAST ACTIVE TAB
        // =====================================================
        const activeTabKey = getActiveTabKey();
        const lastActiveTabId = activeTabKey
            ? localStorage.getItem(activeTabKey)
            : null;

        if (
            lastActiveTabId &&
            isTabAllowed(lastActiveTabId)
        ) {
            const activeTab = document.querySelector(
                `.tab-item[data-tab-id="${lastActiveTabId}"]`
            );

            if (activeTab) {
                activateTab(lastActiveTabId);
                return;
            }
        }

        // =====================================================
        // FALLBACK
        // =====================================================
        const firstTab = document.querySelector('.tab-item');

        if (firstTab) {
            activateTab(firstTab.dataset.tabId);
        }
    }

    // =========================================================
    // CREATE TAB WITHOUT ACTIVATING
    // =========================================================
    async function createTabWithoutActivating(
        tabId,
        tabTitle,
        tabIcon,
        page
    ) {
        if (!isTabAllowed(tabId)) {
            return;
        }

        const existingTab = document.querySelector(
            `.tab-item[data-tab-id="${tabId}"]`
        );

        if (existingTab) {
            return;
        }

        const tabButton = createTabButton(
            tabId,
            tabTitle,
            tabIcon,
            page
        );

        tabList.appendChild(tabButton);

        const panel = document.createElement('div');

        panel.id = `tab-${tabId}`;
        panel.className = 'tab-panel hidden';

        panel.innerHTML = `
            <div class="flex items-center justify-center min-h-[300px]">
                <div class="text-center">
                    <i class="fa-solid fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-300">
                        Loading ${escapeHtml(tabTitle)}...
                    </p>
                </div>
            </div>
        `;

        tabContent.appendChild(panel);

        await loadTabContent(
            panel,
            page,
            tabTitle,
            tabId
        );
    }

    // =========================================================
    // GET SAVED TABS
    // =========================================================
    function getSavedTabs() {
        const storageKey = getStorageKey();

        if (!storageKey) {
            return [];
        }

        try {
            const data = localStorage.getItem(storageKey);

            if (!data) {
                return [];
            }

            const parsed = JSON.parse(data);

            return Array.isArray(parsed)
                ? parsed
                : [];
        } catch (error) {
            console.error(
                'Error reading saved tabs:',
                error
            );

            return [];
        }
    }

    // =========================================================
    // SAVE TABS
    // =========================================================
    function saveTabs() {
        const storageKey = getStorageKey();

        if (!storageKey || !currentUserId) {
            return;
        }

        const tabs = [];

        document.querySelectorAll('.tab-item').forEach(
            tabButton => {
                const tabId = tabButton.dataset.tabId;

                if (
                    !tabId ||
                    tabId === 'dashboard'
                ) {
                    return;
                }

                if (!isTabAllowed(tabId)) {
                    return;
                }

                tabs.push({
                    tabId: tabId,
                    tabTitle:
                        tabButton.dataset.tabTitle ||
                        tabButton
                            .querySelector('span')
                            ?.textContent,
                    tabIcon:
                        tabButton.dataset.tabIcon ||
                        'fa-solid fa-file',
                    page: tabButton.dataset.page
                });
            }
        );

        localStorage.setItem(
            storageKey,
            JSON.stringify(tabs)
        );
    }

    // =========================================================
    // SAVE ACTIVE TAB
    // =========================================================
    function saveActiveTab(tabId) {
        const activeTabKey = getActiveTabKey();

        if (!activeTabKey || !currentUserId) {
            return;
        }

        if (!isTabAllowed(tabId)) {
            return;
        }

        localStorage.setItem(
            activeTabKey,
            tabId
        );
    }

    // =========================================================
    // DELEGATED CLICK HANDLER
    // =========================================================
    document.addEventListener('click', event => {
        // =====================================================
        // SIDEBAR TAB LINK
        // =====================================================
        const link = event.target.closest('.tab-link');

        if (link) {
            event.preventDefault();

            const page = link.dataset.page;
            const tabId = link.dataset.tabId;
            const tabTitle = link.dataset.tabTitle;
            const tabIcon =
                link.dataset.tabIcon ||
                'fa-solid fa-file';

            if (
                !page ||
                !tabId ||
                !tabTitle
            ) {
                console.error(
                    'Missing tab data attributes.',
                    link
                );

                return;
            }

            // =================================================
            // AUTHORIZATION CHECK
            // =================================================
            if (!isTabAllowed(tabId)) {
                console.warn(
                    `Access denied for tab: ${tabId}`
                );

                return;
            }

            openTab(
                tabId,
                tabTitle,
                tabIcon,
                page,
                true
            );

            return;
        }

        // =====================================================
        // TAB BAR BUTTON
        // =====================================================
        const tabButton =
            event.target.closest('.tab-item');

        if (tabButton) {
            if (
                event.target.closest('.tab-close')
            ) {
                event.stopPropagation();

                const tabId =
                    tabButton.dataset.tabId;

                if (tabId) {
                    closeTab(tabId);
                }

                return;
            }

            const tabId =
                tabButton.dataset.tabId;

            if (
                tabId &&
                isTabAllowed(tabId)
            ) {
                activateTab(tabId);
            }
        }
    });

    // =========================================================
    // OPEN TAB
    // =========================================================
    async function openTab(
        tabId,
        tabTitle,
        tabIcon,
        page,
        saveToStorage = true
    ) {
        if (!isTabAllowed(tabId)) {
            console.warn(
                `Access denied for tab: ${tabId}`
            );

            return;
        }

        let existingTab = document.querySelector(
            `.tab-item[data-tab-id="${tabId}"]`
        );

        if (existingTab) {
            activateTab(tabId);
            return;
        }

        const tabButton = createTabButton(
            tabId,
            tabTitle,
            tabIcon,
            page
        );

        tabList.appendChild(tabButton);

        const panel =
            document.createElement('div');

        panel.id = `tab-${tabId}`;
        panel.className = 'tab-panel hidden';

        panel.innerHTML = `
            <div class="flex items-center justify-center min-h-[300px]">
                <div class="text-center">
                    <i class="fa-solid fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-300">
                        Loading ${escapeHtml(tabTitle)}...
                    </p>
                </div>
            </div>
        `;

        tabContent.appendChild(panel);

        activateTab(tabId);

        await loadTabContent(
            panel,
            page,
            tabTitle,
            tabId
        );

        if (saveToStorage) {
            saveTabs();
        }
    }

    // =========================================================
    // CREATE TAB BUTTON
    // =========================================================
    function createTabButton(
        tabId,
        tabTitle,
        tabIcon,
        page
    ) {
        const button =
            document.createElement('button');

        button.type = 'button';

        button.className =
            'tab-item flex items-center gap-3 px-5 py-4 text-base font-semibold text-gray-500 dark:text-gray-300 border-b-2 border-transparent hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer whitespace-nowrap transition-colors select-none';

        button.dataset.tabId = tabId;
        button.dataset.tabTitle = tabTitle;
        button.dataset.tabIcon = tabIcon;
        button.dataset.page = page;

        button.innerHTML = `
            <i class="${escapeHtml(tabIcon)} text-lg pointer-events-none"></i>
            <span class="pointer-events-none">
                ${escapeHtml(tabTitle)}
            </span>
            <span class="tab-close ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Close tab">
                <i class="fa-solid fa-xmark text-xs pointer-events-none"></i>
            </span>
        `;

        initializeTabDrag(button);

        return button;
    }

    // =========================================================
    // ACTIVATE TAB
    // =========================================================
    function activateTab(tabId) {
        if (!isTabAllowed(tabId)) {
            return;
        }

        document.querySelectorAll('.tab-item').forEach(
            tab => {
                tab.classList.remove(
                    'active',
                    'text-green-600',
                    'text-green-400',
                    'border-green-600'
                );

                tab.classList.add(
                    'text-gray-400',
                    'border-transparent'
                );
            }
        );

        document.querySelectorAll('.tab-panel').forEach(
            panel => {
                panel.classList.add('hidden');
            }
        );

        const selectedTab =
            document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );

        const selectedPanel =
            document.getElementById(
                `tab-${tabId}`
            );

        if (selectedTab) {
            selectedTab.classList.remove(
                'text-gray-400',
                'border-transparent'
            );

            selectedTab.classList.add(
                'active',
                'text-green-400',
                'border-green-500'
            );
        }

        if (selectedPanel) {
            selectedPanel.classList.remove(
                'hidden'
            );
        }

        if (selectedTab) {
            selectedTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        saveActiveTab(tabId);
    }

    // =========================================================
    // LOAD TAB CONTENT
    // =========================================================
    async function loadTabContent(
        panel,
        page,
        tabTitle,
        tabId
    ) {
        try {
            const response = await fetch(page, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html'
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }

            const html = await response.text();

            panel.innerHTML = html;

            await loadPageScript(
                tabId,
                panel
            );
        } catch (error) {
            console.error(
                `Failed to load tab "${tabId}":`,
                error
            );

            panel.innerHTML = `
                <div class="container mx-auto px-6 py-10">
                    <div class="bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <div class="text-red-500 text-4xl mb-4">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Unable to Load Page
                        </h2>
                        <p class="text-gray-500 dark:text-gray-300 mb-4">
                            The ${escapeHtml(tabTitle)} page could not be loaded.
                        </p>
                        <button type="button" onclick="location.reload()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // =========================================================
    // LOAD PAGE-SPECIFIC JAVASCRIPT
    // =========================================================
    async function loadPageScript(tabId, panel) {
        const loader = PAGE_SCRIPTS[tabId];

        if (!loader) {
            return;
        }

        try {
            const module = await loader();

            if (
                !module ||
                typeof module.init !== 'function'
            ) {
                throw new Error(
                    `Page module "${tabId}" must export an init(panel) function.`
                );
            }

            await module.init(panel);
        } catch (error) {
            console.error(
                `Failed to initialize page "${tabId}":`,
                error
            );
        }
    }

    // =========================================================
    // CLOSE TAB
    // =========================================================
    function closeTab(tabId) {
        if (tabId === 'dashboard') {
            return;
        }

        const tab = document.querySelector(
            `.tab-item[data-tab-id="${tabId}"]`
        );

        const panel =
            document.getElementById(
                `tab-${tabId}`
            );

        if (!tab || !panel) {
            return;
        }

        const isActive =
            tab.classList.contains('active');

        tab.remove();
        panel.remove();

        saveTabs();

        if (isActive) {
            const remainingTabs =
                document.querySelectorAll(
                    '.tab-item'
                );

            if (remainingTabs.length > 0) {
                const lastTab =
                    remainingTabs[
                        remainingTabs.length - 1
                    ];

                activateTab(
                    lastTab.dataset.tabId
                );
            }
        }
    }

    // =========================================================
    // ESCAPE HTML
    // =========================================================
    function escapeHtml(value) {
        const div =
            document.createElement('div');

        div.textContent = value ?? '';

        return div.innerHTML;
    }

    // =========================================================
    // INITIALIZE TAB MANAGER
    // =========================================================
    async function initializeTabManager() {
        const authenticated =
            await loadCurrentUserPermissions();

        if (!authenticated) {
            console.warn(
                'Tab Manager stopped because current user permissions could not be verified.'
            );

            return;
        }

        await restoreSavedTabs();
    }

    // =========================================================
    // INITIALIZE
    // =========================================================
    initializeTabManager();
});