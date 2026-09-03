document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // LOCAL STORAGE KEY
    // =========================================================

    const STORAGE_KEY = 'laravel_epayroll_open_tabs';
    const ACTIVE_TAB_KEY = 'laravel_epayroll_active_tab';


    // =========================================================
    // PAGE JAVASCRIPT REGISTRY
    // ---------------------------------------------------------
    // Each tab can have its own JavaScript module.
    //
    // IMPORTANT:
    // The JavaScript is loaded ONLY when the tab is opened.
    // =========================================================

    const PAGE_SCRIPTS = {

        employees: () =>
            import('../pages/employee-info.js'),
         employees: () =>
            import('../pages/employee-deduction.js'),
                
            

        // Add more pages here when needed.
        //
        // reports: () =>
        //     import('../pages/reports.js'),
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
        return Array.from(
            tabList.querySelectorAll('.tab-item')
        );
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

            const lastRect =
                tab.getBoundingClientRect();

            const deltaX =
                first.left - lastRect.left;

            const deltaY =
                first.top - lastRect.top;

            if (
                Math.abs(deltaX) < 1 &&
                Math.abs(deltaY) < 1
            ) {
                return;
            }

            tab.style.transition = 'none';

            tab.style.transform =
                `translate(${deltaX}px, ${deltaY}px)`;

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    tab.style.transition =
                        'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';

                    tab.style.transform =
                        'translate(0, 0)';

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

        tab.style.transition =
            'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';

        tab.style.transform =
            'translate(0, 0) scale(1)';
    }


    // =========================================================
    // DRAG START
    // =========================================================

    function handleDragStart(event) {

        const tab = event.currentTarget;

        if (
            !tab ||
            tab.dataset.tabId === 'dashboard'
        ) {

            event.preventDefault();
            return;
        }

        draggedTab = tab;
        isDragging = true;

        const tabs = getTabs();

        dragStartIndex =
            tabs.indexOf(tab);

        tab.classList.add(
            'tab-dragging'
        );

        tab.style.transition =
            'transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease';

        tab.style.transform =
            'translateY(-3px) scale(1.04)';

        tab.style.opacity =
            '0.72';

        tab.style.zIndex =
            '1000';

        tab.style.position =
            'relative';

        tab.style.boxShadow =
            '0 12px 28px rgba(0, 0, 0, 0.18)';

        if (event.dataTransfer) {

            event.dataTransfer.effectAllowed =
                'move';

            try {

                event.dataTransfer.setData(
                    'text/plain',
                    tab.dataset.tabId
                );

            } catch (error) {

                console.warn(
                    'Unable to set drag data:',
                    error
                );

            }
        }

        requestAnimationFrame(() => {

            if (tab) {

                tab.classList.add(
                    'tab-drag-active'
                );

            }

        });
    }


    // =========================================================
    // DRAG OVER
    // =========================================================

    function handleDragOver(event) {

        event.preventDefault();

        if (
            !isDragging ||
            !draggedTab
        ) {
            return;
        }

        const targetTab =
            event.currentTarget;

        if (
            !targetTab ||
            targetTab === draggedTab
        ) {
            return;
        }

        if (
            targetTab.dataset.tabId ===
            'dashboard'
        ) {
            return;
        }

        lastPointerX =
            event.clientX;

        if (event.dataTransfer) {

            event.dataTransfer.dropEffect =
                'move';

        }

        const rect =
            targetTab.getBoundingClientRect();

        const centerX =
            rect.left +
            rect.width / 2;

        const insertBefore =
            event.clientX < centerX;


        // Capture BEFORE DOM reorder
        const firstPositions =
            captureTabPositions();


        // Prevent unnecessary DOM movement
        if (insertBefore) {

            if (
                draggedTab.nextElementSibling !==
                targetTab
            ) {

                tabList.insertBefore(
                    draggedTab,
                    targetTab
                );

                playTabFlip(
                    firstPositions
                );

            }

        } else {

            if (
                draggedTab.previousElementSibling !==
                targetTab
            ) {

                tabList.insertBefore(
                    draggedTab,
                    targetTab.nextSibling
                );

                playTabFlip(
                    firstPositions
                );
            }
        }

        dragOverTab =
            targetTab;

        updateDragOverVisuals();
    }


    // =========================================================
    // DRAG ENTER
    // =========================================================

    function handleDragEnter(event) {

        event.preventDefault();

        const targetTab =
            event.currentTarget;

        if (
            !targetTab ||
            targetTab === draggedTab ||
            targetTab.dataset.tabId ===
                'dashboard'
        ) {
            return;
        }

        dragOverTab =
            targetTab;

        updateDragOverVisuals();
    }


    // =========================================================
    // DRAG LEAVE
    // =========================================================

    function handleDragLeave(event) {

        const targetTab =
            event.currentTarget;

        if (!targetTab) {
            return;
        }

        // Huwag agad tanggalin kung pumunta
        // sa child element ng tab.
        if (
            event.relatedTarget &&
            targetTab.contains(
                event.relatedTarget
            )
        ) {
            return;
        }

        targetTab.classList.remove(
            'tab-drag-over'
        );
    }


    // =========================================================
    // UPDATE DRAG VISUALS
    // =========================================================

    function updateDragOverVisuals() {

        getTabs().forEach(tab => {

            if (
                tab === draggedTab ||
                tab === dragOverTab
            ) {

                if (tab === dragOverTab) {

                    tab.classList.add(
                        'tab-drag-over'
                    );

                }

                return;
            }

            tab.classList.remove(
                'tab-drag-over'
            );

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

            tab.classList.remove(
                'tab-drag-over'
            );

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

        const tab =
            draggedTab;

        tab.classList.remove(
            'tab-dragging',
            'tab-drag-active'
        );

        tab.style.transition =
            'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';

        tab.style.transform =
            'translateY(0) scale(1)';

        tab.style.opacity =
            '1';

        tab.style.zIndex =
            '';

        tab.style.position =
            '';

        tab.style.boxShadow =
            '';

        getTabs().forEach(item => {

            item.classList.remove(
                'tab-drag-over',
                'tab-dragging',
                'tab-drag-active'
            );

            if (item !== tab) {

                item.style.opacity =
                    '1';

                item.style.zIndex =
                    '';

                item.style.boxShadow =
                    '';

                item.style.transition =
                    'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, box-shadow 180ms ease';

                item.style.transform =
                    'translate(0, 0) scale(1)';
            }

        });

        saveTabs();

        draggedTab =
            null;

        dragOverTab =
            null;

        isDragging =
            false;

        dragStartIndex =
            -1;
    }


    // =========================================================
    // INITIALIZE DRAG
    // =========================================================

    function initializeTabDrag(tabButton) {

        if (!tabButton) {
            return;
        }

        tabButton.draggable =
            true;

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

        const savedTabs =
            getSavedTabs();

        if (savedTabs.length === 0) {
            return;
        }

        // Create ALL tabs first WITHOUT activating any
        const loadPromises = [];

        for (const tab of savedTabs) {

            const {
                tabId,
                tabTitle,
                tabIcon,
                page
            } = tab;

            // Skip if tab already exists
            const existingTab =
                document.querySelector(
                    `.tab-item[data-tab-id="${tabId}"]`
                );

            if (
                !existingTab &&
                tabId !== 'dashboard'
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

        // Wait for all tabs to finish loading
        await Promise.all(
            loadPromises
        );

        // Activate last active tab
        const lastActiveTabId =
            localStorage.getItem(
                ACTIVE_TAB_KEY
            );

        if (lastActiveTabId) {

            const activeTab =
                document.querySelector(
                    `.tab-item[data-tab-id="${lastActiveTabId}"]`
                );

            if (activeTab) {

                activateTab(
                    lastActiveTabId
                );

            } else {

                // Fallback
                const firstTab =
                    document.querySelector(
                        '.tab-item'
                    );

                if (firstTab) {

                    activateTab(
                        firstTab.dataset.tabId
                    );

                }
            }
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

        // Check again to avoid duplicates
        const existingTab =
            document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );

        if (existingTab) {
            return;
        }


        // Create tab button
        const tabButton =
            createTabButton(
                tabId,
                tabTitle,
                tabIcon,
                page
            );

        tabList.appendChild(
            tabButton
        );


        // Create content panel
        const panel =
            document.createElement(
                'div'
            );

        panel.id =
            `tab-${tabId}`;

        panel.className =
            'tab-panel hidden';

        panel.innerHTML = `
            <div class="flex items-center justify-center min-h-[300px]">
                <div class="text-center">

                    <i class="fa-solid fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>

                    <p class="text-gray-500">
                        Loading ${escapeHtml(tabTitle)}...
                    </p>

                </div>
            </div>
        `;

        tabContent.appendChild(
            panel
        );


        // Load content WITHOUT activating
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

        try {

            const data =
                localStorage.getItem(
                    STORAGE_KEY
                );

            return data
                ? JSON.parse(data)
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

        const tabs = [];

        document.querySelectorAll(
            '.tab-item'
        ).forEach(tabButton => {

            const tabId =
                tabButton.dataset.tabId;

            // Dashboard is always in HTML
            if (
                tabId === 'dashboard'
            ) {
                return;
            }

            tabs.push({

                tabId:
                    tabId,

                tabTitle:
                    tabButton.dataset.tabTitle ||
                    tabButton
                        .querySelector('span')
                        ?.textContent,

                tabIcon:
                    tabButton.dataset.tabIcon ||
                    'fa-solid fa-file',

                page:
                    tabButton.dataset.page
            });

        });

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tabs)
        );
    }


    // =========================================================
    // SAVE ACTIVE TAB
    // =========================================================

    function saveActiveTab(tabId) {

        localStorage.setItem(
            ACTIVE_TAB_KEY,
            tabId
        );
    }


    // =========================================================
    // DELEGATED CLICK HANDLER
    // Handles sidebar links AND tab buttons
    // =========================================================

    document.addEventListener(
        'click',
        event => {

            // =================================================
            // SIDEBAR TAB LINK
            // =================================================

            const link =
                event.target.closest(
                    '.tab-link'
                );

            if (link) {

                event.preventDefault();

                const page =
                    link.dataset.page;

                const tabId =
                    link.dataset.tabId;

                const tabTitle =
                    link.dataset.tabTitle;

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

                openTab(
                    tabId,
                    tabTitle,
                    tabIcon,
                    page,
                    true
                );

                return;
            }


            // =================================================
            // TAB BAR BUTTON
            // =================================================

            const tabButton =
                event.target.closest(
                    '.tab-item'
                );

            if (tabButton) {

                // Close button
                if (
                    event.target.closest(
                        '.tab-close'
                    )
                ) {

                    event.stopPropagation();

                    const tabId =
                        tabButton.dataset.tabId;

                    if (tabId) {

                        closeTab(
                            tabId
                        );
                    }

                    return;
                }


                // Activate tab
                const tabId =
                    tabButton.dataset.tabId;

                if (tabId) {

                    activateTab(
                        tabId
                    );
                }
            }

        }
    );


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

        // Check if tab already exists
        let existingTab =
            document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );


        // If already exists
        if (existingTab) {

            activateTab(
                tabId
            );

            return;
        }


        // Create new tab
        const tabButton =
            createTabButton(
                tabId,
                tabTitle,
                tabIcon,
                page
            );

        tabList.appendChild(
            tabButton
        );


        // Create content panel
        const panel =
            document.createElement(
                'div'
            );

        panel.id =
            `tab-${tabId}`;

        panel.className =
            'tab-panel hidden';

        panel.innerHTML = `
            <div class="flex items-center justify-center min-h-[300px]">
                <div class="text-center">

                    <i class="fa-solid fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>

                    <p class="text-gray-500">
                        Loading ${escapeHtml(tabTitle)}...
                    </p>

                </div>
            </div>
        `;

        tabContent.appendChild(
            panel
        );


        // Activate immediately
        activateTab(
            tabId
        );


        // Load HTML + page JavaScript
        await loadTabContent(
            panel,
            page,
            tabTitle,
            tabId
        );


        // Save to localStorage
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
            document.createElement(
                'button'
            );

        button.type =
            'button';

        button.className =
            'tab-item flex items-center gap-3 px-5 py-4 text-base font-semibold text-gray-500 border-b-2 border-transparent hover:text-green-600 hover:bg-green-50 cursor-pointer whitespace-nowrap transition-colors select-none';

        button.dataset.tabId =
            tabId;

        button.dataset.tabTitle =
            tabTitle;

        button.dataset.tabIcon =
            tabIcon;

        button.dataset.page =
            page;

        button.innerHTML = `
            <i
                class="${escapeHtml(tabIcon)} text-lg pointer-events-none">
            </i>

            <span class="pointer-events-none">
                ${escapeHtml(tabTitle)}
            </span>

            <span
                class="tab-close ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500"
                title="Close tab"
            >
                <i class="fa-solid fa-xmark text-xs pointer-events-none"></i>
            </span>
        `;


        // Initialize draggable behavior
        initializeTabDrag(
            button
        );

        return button;
    }


    // =========================================================
    // ACTIVATE TAB
    // =========================================================

    function activateTab(tabId) {

        // Remove active state
        document.querySelectorAll(
            '.tab-item'
        ).forEach(tab => {

            tab.classList.remove(
                'active',
                'text-green-600',
                'border-green-600'
            );

            tab.classList.add(
                'text-gray-500',
                'border-transparent'
            );

        });


        // Hide all panels
        document.querySelectorAll(
            '.tab-panel'
        ).forEach(panel => {

            panel.classList.add(
                'hidden'
            );

        });


        // Selected tab
        const selectedTab =
            document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );


        // Selected panel
        const selectedPanel =
            document.getElementById(
                `tab-${tabId}`
            );


        // Activate tab
        if (selectedTab) {

            selectedTab.classList.remove(
                'text-gray-500',
                'border-transparent'
            );

            selectedTab.classList.add(
                'active',
                'text-green-600',
                'border-green-600'
            );
        }


        // Show panel
        if (selectedPanel) {

            selectedPanel.classList.remove(
                'hidden'
            );
        }


        // Scroll active tab
        if (selectedTab) {

            selectedTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }


        // Save active tab
        saveActiveTab(
            tabId
        );
    }


    // =========================================================
    // LOAD TAB CONTENT
    // ---------------------------------------------------------
    // 1. Fetch Blade HTML
    // 2. Insert HTML into panel
    // 3. Load the JS module assigned to this tab
    // =========================================================

    async function loadTabContent(
        panel,
        page,
        tabTitle,
        tabId
    ) {

        try {

            // =================================================
            // LOAD BLADE HTML
            // =================================================

            const response =
                await fetch(
                    page,
                    {
                        method: 'GET',

                        headers: {
                            'X-Requested-With':
                                'XMLHttpRequest',

                            'Accept':
                                'text/html'
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            const html =
                await response.text();


            // =================================================
            // INSERT HTML
            // =================================================

            panel.innerHTML =
                html;


            // =================================================
            // LOAD PAGE-SPECIFIC JAVASCRIPT
            // =================================================

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

                    <div class="bg-white border border-red-200 rounded-xl p-8 text-center">

                        <div class="text-red-500 text-4xl mb-4">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>

                        <h2 class="text-xl font-semibold text-gray-800 mb-2">
                            Unable to Load Page
                        </h2>

                        <p class="text-gray-500 mb-4">
                            The ${escapeHtml(tabTitle)} page could not be loaded.
                        </p>

                        <button
                            type="button"
                            onclick="location.reload()"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Reload Page
                        </button>

                    </div>

                </div>
            `;
        }
    }


    // =========================================================
    // LOAD PAGE-SPECIFIC JAVASCRIPT
    // ---------------------------------------------------------
    // Dynamic import means the JS is loaded only when needed.
    // =========================================================

    async function loadPageScript(
        tabId,
        panel
    ) {

        const loader =
            PAGE_SCRIPTS[tabId];


        // Page has no JavaScript
        if (!loader) {

            return;
        }


        try {

            const module =
                await loader();


            // Preferred:
            // export function init(panel) {}

            if (
                module &&
                typeof module.init ===
                    'function'
            ) {

                await module.init(
                    panel
                );

                return;
            }


            // Alternative:
            // export default function(panel) {}

            if (
                module &&
                typeof module.default ===
                    'function'
            ) {

                await module.default(
                    panel
                );

                return;
            }


            console.warn(
                `JavaScript module for "${tabId}" was loaded, but no init() function was found.`
            );


        } catch (error) {

            console.error(
                `Failed to initialize JavaScript for "${tabId}":`,
                error
            );

        }
    }


    // =========================================================
    // CLOSE TAB
    // =========================================================

    function closeTab(tabId) {

        // Dashboard cannot be closed
        if (
            tabId ===
            'dashboard'
        ) {
            return;
        }


        const tab =
            document.querySelector(
                `.tab-item[data-tab-id="${tabId}"]`
            );


        const panel =
            document.getElementById(
                `tab-${tabId}`
            );


        if (
            !tab ||
            !panel
        ) {
            return;
        }


        // Check active
        const isActive =
            tab.classList.contains(
                'active'
            );


        // Remove tab
        tab.remove();


        // Remove content
        panel.remove();


        // Update storage
        saveTabs();


        // If active tab was closed
        if (isActive) {

            const remainingTabs =
                document.querySelectorAll(
                    '.tab-item'
                );


            if (
                remainingTabs.length > 0
            ) {

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
            document.createElement(
                'div'
            );

        div.textContent =
            value;

        return div.innerHTML;
    }


    // =========================================================
    // RESTORE TABS ON PAGE LOAD
    // =========================================================

    restoreSavedTabs();

});