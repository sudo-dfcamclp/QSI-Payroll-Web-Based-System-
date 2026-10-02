import Swal from 'sweetalert2'; 
 
export async function init(panel) { 
    const listingView = panel.querySelector('#clientListingView'); 
    const formView = panel.querySelector('#clientFormView'); 
    const clientList = panel.querySelector('#clientList'); 
    const clientListSearch = panel.querySelector('#clientListSearch'); 
    const addClientButton = panel.querySelector('#clientAddButton'); 
    const backToListButton = panel.querySelector('#clientBackToListButton'); 
 
    const editButton = panel.querySelector('#clientEditButton'); 
    const saveButton = panel.querySelector('#clientSaveButton'); 
    const searchInput = panel.querySelector('#clientSearch'); 
    const searchResults = panel.querySelector('#clientSearchResults'); 
    const searchList = panel.querySelector('#clientSearchList'); 
 
    const fields = { 
        client_name: panel.querySelector('#clientName'), 
        client_address: panel.querySelector('#clientAddress'), 
        client_contact: panel.querySelector('#clientContact'), 
        client_contact2: panel.querySelector('#alternativeContact'), 
        client_owner: panel.querySelector('#clientOwner'), 
        contact_person: panel.querySelector('#contactPerson'), 
        contact_position: panel.querySelector('#contactPosition'), 
        client_assistant: panel.querySelector('#clientAssistant'), 
        assistant_position: panel.querySelector('#assistantPosition'), 
        permit_no: panel.querySelector('#permitNo'), 
        bank_name: panel.querySelector('#bankName'), 
        account_no: panel.querySelector('#accountNo') 
    }; 
 
    const configFields = { 
        payroll_frequency: panel.querySelector('#payrollFrequency'), 
        working_days_per_cutoff: panel.querySelector('#workingDaysPerCutoff'), 
        working_days_per_year: panel.querySelector('#workingDaysPerYear'), 
        working_days_per_month: panel.querySelector('#workingDaysPerMonth'), 
        hours_per_day: panel.querySelector('#hoursPerDay'), 
        include_13th_month_pay: panel.querySelector('#include13thMonth'), 
        add_13th_month_to_gross_pay: panel.querySelector('#add13thMonthGross'), 
        agency_fee_basis: panel.querySelector('#agencyFeeBasis'), 
        agency_rate: panel.querySelector('#agencyRate'), 
        client_charge_per_day: panel.querySelector('#clientChargePerDay'), 
        tardiness_rate: panel.querySelector('#tardinessRate'), 
        late_charge_per_minute: panel.querySelector('#lateChargePerMinute'), 
        regular_overtime_rate: panel.querySelector('#regularOvertimeRate'), 
        rest_day_rate: panel.querySelector('#restDayRate'), 
        rest_day_overtime_rate: panel.querySelector('#restDayOvertimeRate'), 
        special_holiday_rate: panel.querySelector('#specialHolidayRate'), 
        legal_holiday_rate: panel.querySelector('#legalHolidayRate'), 
        night_differential_rate: panel.querySelector('#nightDifferentialRate'), 
        special_holiday_overtime_rate: panel.querySelector('#specialHolidayOvertimeRate'), 
        special_holiday_rest_day_rate: panel.querySelector('#specialHolidayRestDayRate'), 
        special_holiday_rest_day_overtime_rate: panel.querySelector('#specialHolidayRestDayOvertimeRate'), 
        legal_holiday_overtime_rate: panel.querySelector('#legalHolidayOvertimeRate'), 
        legal_holiday_rest_day_rate: panel.querySelector('#legalHolidayRestDayRate'), 
        legal_holiday_rest_day_overtime_rate: panel.querySelector('#legalHolidayRestDayOvertimeRate'), 
        ecola_allowance_payment: panel.querySelector('#ecolaAllowancePayment'), 
        ecola_taxable: panel.querySelector('#ecolaTaxable'), 
        ecola_on_rest_days: panel.querySelector('#ecolaRestDays'), 
        ecola_on_holidays: panel.querySelector('#ecolaHolidays'), 
        withhold_tax: panel.querySelector('#withholdTax'), 
        use_fixed_rate_for_tax: panel.querySelector('#useFixedTaxRate'), 
        withhold_sss: panel.querySelector('#withholdSSS'), 
        half_sss_monthly_basis: panel.querySelector('#halfSSS'), 
        sss_add_on: panel.querySelector('#sssAddOn'), 
        withhold_philhealth: panel.querySelector('#withholdPhilHealth'), 
        philhealth_add_on: panel.querySelector('#philHealthAddOn'), 
        withhold_pagibig: panel.querySelector('#withholdPagibig'), 
        exclude_sss_pagibig_from_tax: panel.querySelector('#excludeGovernmentFromTax'), 
        admin_fee: panel.querySelector('#adminFee'), 
        vat: panel.querySelector('#vat'), 
        vat_reference: panel.querySelector('#vatReference'), 
        billing_schedule: panel.querySelector('#billingSchedule'), 
        billing_template: panel.querySelector('#billingTemplate'), 
        meal_on_bill: panel.querySelector('#mealOnBill'), 
        vale_on_bill: panel.querySelector('#valeOnBill'), 
        severance_pay: panel.querySelector('#severancePay'), 
        cutoff_period: panel.querySelector('#cutoffPeriod'), 
        pickup_dtr: panel.querySelector('#pickupDtr'), 
        salary_release: panel.querySelector('#salaryRelease') 
    }; 
 
    const allFields = { 
        ...fields, 
        ...configFields 
    }; 
 
    let editing = false; 
    let creating = false; 
    let currentClientId = null; 
    let originalData = {}; 
    let searchTimeout = null; 
    let listSearchTimeout = null; 
    let searchHighlightedIndex = -1; 
    let clientListPage = 1; 
 
    function isDarkMode() { 
        return document.documentElement.classList.contains('dark'); 
    } 
 
    function swalConfig(options = {}) { 
        return { 
            ...options, 
            background: isDarkMode() ? '#374151' : '#ffffff', 
            color: isDarkMode() ? '#f9fafb' : '#111827', 
            customClass: { 
                popup: isDarkMode() ? 'dark:bg-gray-700 dark:text-gray-100' : '', 
                title: isDarkMode() ? 'dark:text-gray-100' : '', 
                htmlContainer: isDarkMode() ? 'dark:text-gray-300' : '', 
                confirmButton: 'cursor-pointer', 
                cancelButton: 'cursor-pointer' 
            } 
        }; 
    } 
 
    function showListingView() { 
        listingView?.classList.remove('hidden'); 
        formView?.classList.add('hidden'); 
        loadClientList(clientListSearch?.value || '', clientListPage); 
    } 
 
    function showFormView() { 
        listingView?.classList.add('hidden'); 
        formView?.classList.remove('hidden'); 
    } 
 
    function addSearchStyles() { 
        if (panel.querySelector('#clientSearchModernStyles')) return; 
 
        const style = document.createElement('style'); 
 
        style.id = 'clientSearchModernStyles'; 
 
        style.textContent = ` 
            .client-search-scrollbar-hidden { 
                scrollbar-width: none; 
                -ms-overflow-style: none; 
                overscroll-behavior: contain; 
                scroll-behavior: smooth; 
                -webkit-overflow-scrolling: touch; 
            } 
 
            .client-search-scrollbar-hidden::-webkit-scrollbar { 
                display: none; 
                width: 0; 
                height: 0; 
            } 
 
            .client-search-result-highlight { 
                background: rgb(240 253 250); 
            } 
 
            .dark .client-search-result-highlight { 
                background: rgb(31 78 75); 
            } 
        `; 
 
        panel.appendChild(style); 
 
        searchResults?.classList.add( 
            'overflow-hidden', 
            'rounded-xl', 
            'shadow-xl' 
        ); 
 
        searchList?.classList.add( 
            'max-h-72', 
            'overflow-y-auto', 
            'client-search-scrollbar-hidden', 
            'overscroll-contain' 
        ); 
    } 
 
    function escapeHtml(value) { 
        return String(value) 
            .replaceAll('&', '&amp;') 
            .replaceAll('<', '&lt;') 
            .replaceAll('>', '&gt;') 
            .replaceAll('"', '&quot;') 
            .replaceAll("'", '&#039;'); 
    } 
 
    function normalizePayrollFrequency(value) { 
        const normalized = String(value ?? '').trim().toLowerCase(); 
 
        if ( 
            normalized === 'semi-monthly' || 
            normalized === 'semi monthly' || 
            normalized === 'semi_monthly' 
        ) { 
            return 'semi_monthly'; 
        } 
 
        if (normalized === 'weekly') { 
            return 'weekly'; 
        } 
 
        if (normalized === 'monthly') { 
            return 'monthly'; 
        } 
 
        return normalized; 
    } 
 
    function closeActionMenus() { 
        panel.querySelectorAll('.client-action-menu').forEach(menu => { 
            menu.remove(); 
        }); 
 
        panel.querySelectorAll('.client-action-button').forEach(button => { 
            button.setAttribute('aria-expanded', 'false'); 
        }); 
    } 
 
    function createActionMenu(button, clientId, clientName) { 
        closeActionMenus(); 
 
        const menu = document.createElement('div'); 
 
        menu.className = 'client-action-menu absolute right-3 top-full mt-1 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg'; 
 
        menu.innerHTML = ` 
            <button 
                type="button" 
                class="client-delete-action flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer" 
                data-client-id="${escapeHtml(clientId)}"> 
                <i class="fa-solid fa-trash text-xs"></i> 
                <span>Delete</span> 
            </button> 
        `; 
 
        button.parentElement?.appendChild(menu); 
 
        const deleteButton = menu.querySelector('.client-delete-action'); 
 
        deleteButton?.addEventListener('click', async event => { 
            event.preventDefault(); 
            event.stopPropagation(); 
 
            closeActionMenus(); 
 
            await deleteClient(clientId, clientName); 
        }); 
    } 
 
    function getClientPaginationContainer() { 
        let pagination = panel.querySelector('#clientListPagination'); 
 
        if (pagination) return pagination; 
 
        pagination = document.createElement('div'); 
 
        pagination.id = 'clientListPagination'; 
 
        pagination.className = 'flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-700'; 
 
        clientList?.parentElement?.appendChild(pagination); 
 
        return pagination; 
    } 
 
    function renderClientPagination(paginationData = {}) { 
        const pagination = getClientPaginationContainer(); 
 
        if (!pagination) return; 
 
        const currentPage = Number(paginationData.current_page || 1); 
        const lastPage = Number(paginationData.last_page || 1); 
        const total = Number(paginationData.total || 0); 
        const from = Number(paginationData.from || 0); 
        const to = Number(paginationData.to || 0); 
 
        if (total === 0) { 
            pagination.innerHTML = ''; 
            return; 
        } 
 
        if (lastPage <= 1) { 
            pagination.innerHTML = ` 
                <div class="w-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"> 
                    Showing ${from}-${to} of ${total} clients 
                </div> 
            `; 
 
            return; 
        } 
 
        const pages = []; 
 
        if (lastPage <= 7) { 
            for (let page = 1; page <= lastPage; page++) { 
                pages.push(page); 
            } 
        } else { 
            pages.push(1); 
 
            if (currentPage > 4) { 
                pages.push('...'); 
            } 
 
            const start = Math.max(2, currentPage - 1); 
            const end = Math.min(lastPage - 1, currentPage + 1); 
 
            for (let page = start; page <= end; page++) { 
                pages.push(page); 
            } 
 
            if (currentPage < lastPage - 3) { 
                pages.push('...'); 
            } 
 
            pages.push(lastPage); 
        } 
 
        pagination.innerHTML = ` 
            <div class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"> 
                Showing 
                <span class="font-semibold text-gray-700 dark:text-gray-200">${from}-${to}</span> 
                of 
                <span class="font-semibold text-gray-700 dark:text-gray-200">${total}</span> 
                clients 
            </div> 
 
            <div class="flex items-center gap-1"> 
                <button 
                    type="button" 
                    data-client-page="${currentPage - 1}" 
                    ${currentPage <= 1 ? 'disabled' : ''} 
                    class="client-pagination-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition-colors ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}" 
                    aria-label="Previous page"> 
                    <i class="fa-solid fa-chevron-left text-xs"></i> 
                </button> 
 
                ${pages.map(page => page === '...' 
                    ? ` 
                        <span class="w-9 h-9 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500"> 
                            ... 
                        </span> 
                    ` 
                    : ` 
                        <button 
                            type="button" 
                            data-client-page="${page}" 
                            class="client-pagination-button w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${ 
                                page === currentPage 
                                    ? 'bg-green-600 text-white shadow-sm' 
                                    : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white' 
                            }" 
                            aria-label="Page ${page}" 
                            aria-current="${page === currentPage ? 'page' : 'false'}"> 
                            ${page} 
                        </button> 
                    ` 
                ).join('')} 
 
                <button 
                    type="button" 
                    data-client-page="${currentPage + 1}" 
                    ${currentPage >= lastPage ? 'disabled' : ''} 
                    class="client-pagination-button w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition-colors ${currentPage >= lastPage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}" 
                    aria-label="Next page"> 
                    <i class="fa-solid fa-chevron-right text-xs"></i> 
                </button> 
            </div> 
        `; 
 
        pagination.querySelectorAll('.client-pagination-button').forEach(button => { 
            button.addEventListener('click', () => { 
                if (button.disabled) return; 
 
                const page = Number(button.dataset.clientPage); 
 
                if (!page || page < 1 || page > lastPage || page === currentPage) { 
                    return; 
                } 
 
                clientListPage = page; 
 
                loadClientList( 
                    clientListSearch?.value || '', 
                    clientListPage 
                ); 
            }); 
        }); 
    } 
 
    async function loadClientList(search = '', page = 1) { 
        if (!clientList) return; 
 
        closeActionMenus(); 
 
        clientListPage = page; 
 
        try { 
            const response = await fetch( 
                `/payroll/public/api/client-master/search?search=${encodeURIComponent(search)}&page=${page}`, 
                { 
                    method: 'GET', 
                    headers: { 
                        'Accept': 'application/json', 
                        'X-Requested-With': 'XMLHttpRequest' 
                    }, 
                    credentials: 'same-origin' 
                } 
            ); 
 
            const result = await response.json(); 
 
            if (!response.ok || !result.success) { 
                throw new Error(result.message || 'Unable to load clients.'); 
            } 
 
            const clients = result.data || []; 
 
            if (!clients.length) { 
                clientList.innerHTML = ` 
                    <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"> 
                        No clients found. 
                    </div> 
                `; 
 
                renderClientPagination(result.pagination || {}); 
                return; 
            } 
 
            clientList.innerHTML = clients.map(client => ` 
                <div 
                    class="client-list-row relative group grid grid-cols-[80px_minmax(0,1fr)_44px] sm:grid-cols-[100px_minmax(0,1fr)_52px] items-center min-h-[52px] px-4 sm:px-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-200 dark:hover:border-green-800 hover:shadow-sm transition-all duration-150 cursor-pointer" 
                    data-client-id="${escapeHtml(client.client_id)}"> 
 
                    <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate"> 
                        #${escapeHtml(client.client_id)} 
                    </div> 
 
                    <div class="min-w-0 pr-3"> 
                        <div class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate"> 
                            ${escapeHtml(client.client_name || '')} 
                        </div> 
                    </div> 
 
                    <div class="relative shrink-0 flex justify-end"> 
                        <button 
                            type="button" 
                            class="client-action-button w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer" 
                            data-client-action="${escapeHtml(client.client_id)}" 
                            aria-label="Client actions" 
                            aria-expanded="false"> 
                            <i class="fa-solid fa-ellipsis-vertical"></i> 
                        </button> 
                    </div> 
                </div> 
            `).join(''); 
 
            clientList.querySelectorAll('.client-list-row').forEach(row => { 
                row.addEventListener('click', async event => { 
                    if (event.target.closest('.client-action-button')) return; 
                    if (event.target.closest('.client-action-menu')) return; 
 
                    await loadClient(row.dataset.clientId); 
                }); 
            }); 
 
            clientList.querySelectorAll('.client-action-button').forEach(button => { 
                button.addEventListener('click', event => { 
                    event.preventDefault(); 
                    event.stopPropagation(); 
 
                    const existingMenu = button.parentElement?.querySelector('.client-action-menu'); 
 
                    if (existingMenu) { 
                        existingMenu.remove(); 
                        button.setAttribute('aria-expanded', 'false'); 
                        return; 
                    } 
 
                    const row = button.closest('.client-list-row'); 
                    const clientId = button.dataset.clientAction; 
                    const clientName = row?.querySelector('.text-sm.font-medium')?.textContent?.trim() || 'this client'; 
 
                    createActionMenu(button, clientId, clientName); 
                    button.setAttribute('aria-expanded', 'true'); 
                }); 
            }); 
 
            renderClientPagination(result.pagination || {}); 
        } catch (error) { 
            console.error('Client list error:', error); 
 
            clientList.innerHTML = ` 
                <div class="px-5 py-10 text-center text-sm text-red-500"> 
                    Unable to load clients. 
                </div> 
            `; 
 
            const pagination = getClientPaginationContainer(); 
 
            if (pagination) { 
                pagination.innerHTML = ''; 
            } 
        } 
    } 
 
    async function deleteClient(clientId, clientName) { 
        const result = await Swal.fire(swalConfig({ 
            icon: 'warning', 
            title: 'Delete Client?', 
            text: `Are you sure you want to delete ${clientName}?`, 
            showCancelButton: true, 
            confirmButtonText: 'Yes, Delete', 
            cancelButtonText: 'Cancel', 
            confirmButtonColor: '#dc2626', 
            focusCancel: true 
        })); 
 
        if (!result.isConfirmed) return; 
 
        /* Delete endpoint will be added after the controller destroy() method and route are implemented. */ 
    } 
 
    const inputClasses = { 
        normal: [ 
            'bg-gray-50', 
            'dark:bg-gray-600', 
            'border-gray-200', 
            'dark:border-gray-500', 
            'text-gray-700', 
            'dark:text-gray-100', 
            'cursor-text', 
            'focus:border-green-400', 
            'focus:ring-2', 
            'focus:ring-green-100', 
            'dark:focus:ring-green-900/30' 
        ], 
        disabled: [ 
            'bg-gray-100', 
            'dark:bg-gray-600', 
            'border-gray-200', 
            'dark:border-gray-500', 
            'text-gray-400', 
            'dark:text-gray-400', 
            'cursor-not-allowed' 
        ] 
    }; 
 
    function setFieldState(enabled) { 
        Object.values(allFields).forEach(field => { 
            if (!field) return; 
 
            const isCheckbox = field.type === 'checkbox'; 
            const isSelect = field.tagName === 'SELECT'; 
 
            if (isCheckbox || isSelect) { 
                field.disabled = !enabled; 
                field.classList.toggle('cursor-pointer', enabled); 
                field.classList.toggle('cursor-not-allowed', !enabled); 
                field.classList.toggle('opacity-60', !enabled); 
                return; 
            } 
 
            field.readOnly = !enabled; 
 
            field.classList.remove( 
                ...inputClasses.normal, 
                ...inputClasses.disabled 
            ); 
 
            field.classList.add( 
                ...(enabled ? inputClasses.normal : inputClasses.disabled) 
            ); 
        }); 
    } 
 
    function setButtonState() { 
        if (editing && creating) { 
            editButton.innerHTML = '<i class="fa-solid fa-xmark mr-2"></i>Cancel'; 
            editButton.classList.remove('bg-green-600', 'hover:bg-green-700'); 
            editButton.classList.add('bg-red-500', 'hover:bg-red-600'); 
 
            saveButton.disabled = false; 
 
            saveButton.classList.remove( 
                'bg-gray-300', 
                'dark:bg-gray-600', 
                'text-gray-500', 
                'dark:text-gray-400', 
                'cursor-not-allowed' 
            ); 
 
            saveButton.classList.add( 
                'bg-green-600', 
                'hover:bg-green-700', 
                'text-white', 
                'cursor-pointer' 
            ); 
 
            return; 
        } 
 
        if (editing) { 
            editButton.innerHTML = '<i class="fa-solid fa-xmark mr-2"></i>Cancel'; 
            editButton.classList.remove('bg-green-600', 'hover:bg-green-700'); 
            editButton.classList.add('bg-red-500', 'hover:bg-red-600'); 
 
            saveButton.disabled = false; 
 
            saveButton.classList.remove( 
                'bg-gray-300', 
                'dark:bg-gray-600', 
                'text-gray-500', 
                'dark:text-gray-400', 
                'cursor-not-allowed' 
            ); 
 
            saveButton.classList.add( 
                'bg-green-600', 
                'hover:bg-green-700', 
                'text-white', 
                'cursor-pointer' 
            ); 
 
            return; 
        } 
 
        editButton.innerHTML = currentClientId 
            ? '<i class="fa-solid fa-pen-to-square mr-2"></i>Edit' 
            : '<i class="fa-solid fa-plus mr-2"></i>Add Client'; 
 
        editButton.classList.remove('bg-red-500', 'hover:bg-red-600'); 
        editButton.classList.add('bg-green-600', 'hover:bg-green-700'); 
 
        saveButton.disabled = true; 
 
        saveButton.classList.remove( 
            'bg-green-600', 
            'hover:bg-green-700', 
            'text-white', 
            'cursor-pointer' 
        ); 
 
        saveButton.classList.add( 
            'bg-gray-300', 
            'dark:bg-gray-600', 
            'text-gray-500', 
            'dark:text-gray-400', 
            'cursor-not-allowed' 
        ); 
    } 
 
    function getFormData() { 
        const data = {}; 
 
        Object.entries(allFields).forEach(([key, field]) => { 
            if (!field) return; 
 
            data[key] = field.type === 'checkbox' 
                ? field.checked 
                : field.value; 
        }); 
 
        return data; 
    } 
 
    function setFormData(data = {}) { 
        Object.entries(allFields).forEach(([key, field]) => { 
            if (!field) return; 
 
            let value = data[key]; 
 
            if (field.type === 'checkbox') { 
                field.checked = value === true || value === 1 || value === '1'; 
                return; 
            } 
 
            if (key === 'payroll_frequency') { 
                value = normalizePayrollFrequency(value); 
 
                if (!value) { 
                    value = 'semi_monthly'; 
                } 
            } 
 
            field.value = value ?? ''; 
        }); 
    } 
 
    function clearFormData() { 
        Object.values(allFields).forEach(field => { 
            if (!field) return; 
 
            if (field.type === 'checkbox') { 
                field.checked = false; 
            } else { 
                field.value = ''; 
            } 
        }); 
 
        if (configFields.payroll_frequency) { 
            configFields.payroll_frequency.value = 'semi_monthly'; 
        } 
 
        if (configFields.agency_fee_basis) { 
            configFields.agency_fee_basis.value = 'agency_rate'; 
        } 
 
        if (configFields.billing_schedule) { 
            configFields.billing_schedule.value = ''; 
        } 
 
        if (configFields.billing_template) { 
            configFields.billing_template.value = ''; 
        } 
 
        if (configFields.pickup_dtr) { 
            configFields.pickup_dtr.value = 'Not configured'; 
        } 
 
        if (configFields.salary_release) { 
            configFields.salary_release.value = 'Not configured'; 
        } 
    } 
 
    function saveOriginalData() { 
        originalData = getFormData(); 
    } 
 
    function restoreOriginalData() { 
        setFormData(originalData); 
    } 
 
    function enterAddMode() { 
        clearFormData(); 
 
        currentClientId = null; 
        creating = true; 
        editing = true; 
 
        saveOriginalData(); 
        setFieldState(true); 
        setButtonState(); 
        showFormView(); 
 
        fields.client_name?.focus(); 
    } 
 
    function enterEditMode() { 
        if (!currentClientId) { 
            enterAddMode(); 
            return; 
        } 
 
        creating = false; 
        editing = true; 
 
        setFieldState(true); 
        setButtonState(); 
    } 
 
    async function cancelEdit() { 
        if (!editing) return; 
 
        const result = await Swal.fire(swalConfig({ 
            icon: 'question', 
            title: creating ? 'Cancel Adding Client?' : 'Cancel Editing?', 
            text: 'Any unsaved changes will be discarded.', 
            showCancelButton: true, 
            confirmButtonText: 'Yes, Cancel', 
            cancelButtonText: 'Continue', 
            confirmButtonColor: '#dc2626', 
            focusCancel: true 
        })); 
 
        if (!result.isConfirmed) return; 
 
        if (creating) { 
            clearFormData(); 
            currentClientId = null; 
            creating = false; 
            editing = false; 
            saveOriginalData(); 
            showListingView(); 
        } else { 
            restoreOriginalData(); 
            editing = false; 
            setFieldState(false); 
            setButtonState(); 
        } 
 
        setFieldState(false); 
        setButtonState(); 
    } 
 
    async function saveClient() { 
        if (!editing) return; 
 
        const data = getFormData(); 
 
        data.payroll_frequency = normalizePayrollFrequency( 
            data.payroll_frequency 
        ); 
 
        if (!data.payroll_frequency) { 
            data.payroll_frequency = 'semi_monthly'; 
        } 
 
        if (!data.client_name?.trim()) { 
            await Swal.fire(swalConfig({ 
                icon: 'warning', 
                title: 'Client Name Required', 
                text: 'Please enter the client name before saving.', 
                confirmButtonColor: '#0a5d3c' 
            })); 
 
            fields.client_name?.focus(); 
            return; 
        } 
 
        const csrfToken = document.querySelector( 
            'meta[name="csrf-token"]' 
        )?.getAttribute('content'); 
 
        if (!csrfToken) { 
            await Swal.fire(swalConfig({ 
                icon: 'error', 
                title: 'Security Token Missing', 
                text: 'CSRF token was not found. Please refresh the page.' 
            })); 
 
            return; 
        } 
 
        const clientPayload = { 
            client_name: data.client_name, 
            client_address: data.client_address, 
            client_contact: data.client_contact, 
            client_contact2: data.client_contact2, 
            client_owner: data.client_owner, 
            contact_person: data.contact_person, 
            contact_position: data.contact_position, 
            client_assistant: data.client_assistant, 
            assistant_position: data.assistant_position, 
            permit_no: data.permit_no, 
            bank_name: data.bank_name, 
            account_no: data.account_no 
        }; 
 
        const configPayload = { 
            payroll_frequency: data.payroll_frequency, 
            working_days_per_cutoff: data.working_days_per_cutoff, 
            working_days_per_year: data.working_days_per_year, 
            working_days_per_month: data.working_days_per_month, 
            hours_per_day: data.hours_per_day, 
            include_13th_month_pay: data.include_13th_month_pay, 
            add_13th_month_to_gross_pay: data.add_13th_month_to_gross_pay, 
            agency_fee_basis: data.agency_fee_basis, 
            agency_rate: data.agency_rate, 
            client_charge_per_day: data.client_charge_per_day, 
            tardiness_rate: data.tardiness_rate, 
            late_charge_per_minute: data.late_charge_per_minute, 
            regular_overtime_rate: data.regular_overtime_rate, 
            rest_day_rate: data.rest_day_rate, 
            rest_day_overtime_rate: data.rest_day_overtime_rate, 
            special_holiday_rate: data.special_holiday_rate, 
            legal_holiday_rate: data.legal_holiday_rate, 
            night_differential_rate: data.night_differential_rate, 
            special_holiday_overtime_rate: data.special_holiday_overtime_rate, 
            special_holiday_rest_day_rate: data.special_holiday_rest_day_rate, 
            special_holiday_rest_day_overtime_rate: data.special_holiday_rest_day_overtime_rate, 
            legal_holiday_overtime_rate: data.legal_holiday_overtime_rate, 
            legal_holiday_rest_day_rate: data.legal_holiday_rest_day_rate, 
            legal_holiday_rest_day_overtime_rate: data.legal_holiday_rest_day_overtime_rate, 
            ecola_allowance_payment: data.ecola_allowance_payment, 
            ecola_taxable: data.ecola_taxable, 
            ecola_on_rest_days: data.ecola_on_rest_days, 
            ecola_on_holidays: data.ecola_on_holidays, 
            withhold_tax: data.withhold_tax, 
            use_fixed_rate_for_tax: data.use_fixed_rate_for_tax, 
            withhold_sss: data.withhold_sss, 
            half_sss_monthly_basis: data.half_sss_monthly_basis, 
            sss_add_on: data.sss_add_on, 
            withhold_philhealth: data.withhold_philhealth, 
            philhealth_add_on: data.philhealth_add_on, 
            withhold_pagibig: data.withhold_pagibig, 
            exclude_sss_pagibig_from_tax: data.exclude_sss_pagibig_from_tax, 
            admin_fee: data.admin_fee, 
            vat: data.vat, 
            vat_reference: data.vat_reference, 
            billing_schedule: data.billing_schedule, 
            billing_template: data.billing_template, 
            meal_on_bill: data.meal_on_bill, 
            vale_on_bill: data.vale_on_bill, 
            severance_pay: data.severance_pay, 
            cutoff_period: data.cutoff_period, 
            pickup_dtr: data.pickup_dtr, 
            salary_release: data.salary_release 
        }; 
 
        const payload = { 
            ...clientPayload, 
            payroll_config: configPayload 
        }; 
 
        const url = currentClientId 
            ? `/payroll/public/api/client-master/${currentClientId}` 
            : '/payroll/public/api/client-master'; 
 
        const method = currentClientId ? 'PUT' : 'POST'; 
 
        try { 
            saveButton.disabled = true; 
 
            const response = await fetch(url, { 
                method, 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json', 
                    'X-CSRF-TOKEN': csrfToken, 
                    'X-Requested-With': 'XMLHttpRequest' 
                }, 
                credentials: 'same-origin', 
                body: JSON.stringify(payload) 
            }); 
 
            const result = await response.json(); 
 
            if (!response.ok || !result.success) { 
                throw new Error( 
                    result.message || 'Unable to save client.' 
                ); 
            } 
 
            if (result.data?.client_id) { 
                currentClientId = result.data.client_id; 
            } 
 
            const savedClient = result.data || {}; 
            const savedPayrollConfig = savedClient.payroll_config || {}; 
 
            setFormData({ 
                ...data, 
                ...savedClient, 
                ...savedPayrollConfig 
            }); 
 
            creating = false; 
            editing = false; 
 
            saveOriginalData(); 
            setFieldState(false); 
            setButtonState(); 
 
            await Swal.fire(swalConfig({ 
                icon: 'success', 
                title: 'Saved', 
                text: result.message || 'Client information saved successfully.', 
                timer: 1800, 
                showConfirmButton: false 
            })); 
 
            showListingView(); 
        } catch (error) { 
            console.error('Client save error:', error); 
 
            await Swal.fire(swalConfig({ 
                icon: 'error', 
                title: 'Save Failed', 
                text: error.message || 'Unable to save client information.' 
            })); 
 
            saveButton.disabled = false; 
        } 
    } 
 
    async function loadClient(clientId) { 
        if (editing) { 
            const result = await Swal.fire(swalConfig({ 
                icon: 'question', 
                title: creating ? 'Cancel New Client?' : 'Discard Changes?', 
                text: 'You have unsaved changes. Do you want to load another client?', 
                showCancelButton: true, 
                confirmButtonText: 'Yes, Continue', 
                cancelButtonText: 'Stay Here', 
                confirmButtonColor: '#dc2626', 
                focusCancel: true 
            })); 
 
            if (!result.isConfirmed) return; 
        } 
 
        closeActionMenus(); 
 
        try { 
            const response = await fetch( 
                `/payroll/public/api/client-master/${clientId}`, 
                { 
                    method: 'GET', 
                    headers: { 
                        'Accept': 'application/json', 
                        'X-Requested-With': 'XMLHttpRequest' 
                    }, 
                    credentials: 'same-origin' 
                } 
            ); 
 
            const result = await response.json(); 
 
            if (!response.ok || !result.success) { 
                throw new Error( 
                    result.message || 'Unable to load client.' 
                ); 
            } 
 
            const client = result.data; 
 
            if (!client) { 
                throw new Error('Client data was not returned.'); 
            } 
 
            const clientData = { 
                client_name: client.client_name, 
                client_address: client.client_address, 
                client_contact: client.client_contact, 
                client_contact2: client.client_contact2, 
                client_owner: client.client_owner, 
                contact_person: client.contact_person, 
                contact_position: client.contact_position, 
                client_assistant: client.client_assistant, 
                assistant_position: client.assistant_position, 
                permit_no: client.permit_no, 
                bank_name: client.bank_name, 
                account_no: client.account_no 
            }; 
 
            const payrollConfig = client.payroll_config || {}; 
 
            setFormData({ 
                ...clientData, 
                ...payrollConfig 
            }); 
 
            currentClientId = client.client_id; 
            creating = false; 
            editing = false; 
 
            setFieldState(false); 
            setButtonState(); 
            saveOriginalData(); 
            showFormView(); 
 
            searchResults?.classList.add('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'false'); 
            resetSearchHighlight(); 
        } catch (error) { 
            console.error('Load client error:', error); 
 
            await Swal.fire(swalConfig({ 
                icon: 'error', 
                title: 'Unable to Load Client', 
                text: error.message || 'An error occurred while loading the client.' 
            })); 
        } 
    } 
 
    function resetSearchHighlight() { 
        searchHighlightedIndex = -1; 
 
        if (!searchList) return; 
 
        searchList.querySelectorAll('[data-client-search-result]').forEach(button => { 
            button.classList.remove('client-search-result-highlight'); 
            button.setAttribute('aria-selected', 'false'); 
        }); 
    } 
 
    function updateSearchHighlight() { 
        if (!searchList) return; 
 
        const results = Array.from( 
            searchList.querySelectorAll('[data-client-search-result]') 
        ); 
 
        results.forEach((button, index) => { 
            const active = index === searchHighlightedIndex; 
 
            button.classList.toggle( 
                'client-search-result-highlight', 
                active 
            ); 
 
            button.setAttribute( 
                'aria-selected', 
                active ? 'true' : 'false' 
            ); 
 
            if (active) { 
                button.scrollIntoView({ 
                    block: 'nearest', 
                    behavior: 'smooth' 
                }); 
            } 
        }); 
    } 
 
    function moveSearchHighlight(direction) { 
        const results = Array.from( 
            searchList?.querySelectorAll('[data-client-search-result]') || [] 
        ); 
 
        if (!results.length) return; 
 
        if (searchHighlightedIndex === -1) { 
            searchHighlightedIndex = direction === 'down' 
                ? 0 
                : results.length - 1; 
        } else if (direction === 'down') { 
            searchHighlightedIndex = 
                (searchHighlightedIndex + 1) % results.length; 
        } else { 
            searchHighlightedIndex = 
                (searchHighlightedIndex - 1 + results.length) % results.length; 
        } 
 
        updateSearchHighlight(); 
    } 
 
    function selectHighlightedSearchResult() { 
        const results = Array.from( 
            searchList?.querySelectorAll('[data-client-search-result]') || [] 
        ); 
 
        if ( 
            searchHighlightedIndex < 0 || 
            searchHighlightedIndex >= results.length 
        ) { 
            return false; 
        } 
 
        const selected = results[searchHighlightedIndex]; 
 
        searchResults?.classList.add('hidden'); 
        searchInput?.setAttribute('aria-expanded', 'false'); 
 
        loadClient(selected.dataset.clientId); 
 
        return true; 
    } 
 
    clientListSearch?.addEventListener('input', () => { 
        clearTimeout(listSearchTimeout); 
 
        clientListPage = 1; 
 
        listSearchTimeout = setTimeout(() => { 
            loadClientList(clientListSearch.value, 1); 
        }, 300); 
    }); 
 
    addClientButton?.addEventListener('click', () => { 
        enterAddMode(); 
    }); 
 
    backToListButton?.addEventListener('click', async () => { 
        if (editing) { 
            const result = await Swal.fire(swalConfig({ 
                icon: 'question', 
                title: creating ? 'Cancel New Client?' : 'Discard Changes?', 
                text: 'Any unsaved changes will be discarded.', 
                showCancelButton: true, 
                confirmButtonText: 'Yes, Go Back', 
                cancelButtonText: 'Stay Here', 
                confirmButtonColor: '#dc2626', 
                focusCancel: true 
            })); 
 
            if (!result.isConfirmed) return; 
        } 
 
        editing = false; 
        creating = false; 
 
        setFieldState(false); 
        setButtonState(); 
        showListingView(); 
    }); 
 
    editButton?.addEventListener('click', async () => { 
        if (editing) { 
            await cancelEdit(); 
            return; 
        } 
 
        if (currentClientId) { 
            enterEditMode(); 
        } else { 
            enterAddMode(); 
        } 
    }); 
 
    saveButton?.addEventListener('click', saveClient); 
 
    searchInput?.setAttribute('role', 'combobox'); 
    searchInput?.setAttribute('aria-autocomplete', 'list'); 
    searchInput?.setAttribute('aria-expanded', 'false'); 
 
    searchInput?.addEventListener('input', () => { 
        clearTimeout(searchTimeout); 
 
        resetSearchHighlight(); 
 
        if (!searchInput.value.trim()) { 
            searchResults?.classList.add('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'false'); 
            return; 
        } 
 
        searchTimeout = setTimeout(() => { 
            searchClients(searchInput.value); 
        }, 300); 
    }); 
 
    searchInput?.addEventListener('keydown', event => { 
        if (event.key === 'Escape') { 
            event.preventDefault(); 
 
            searchResults?.classList.add('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'false'); 
 
            resetSearchHighlight(); 
 
            return; 
        } 
 
        if (event.key === 'ArrowDown') { 
            event.preventDefault(); 
 
            if (searchResults?.classList.contains('hidden')) { 
                searchClients(searchInput.value); 
                return; 
            } 
 
            moveSearchHighlight('down'); 
 
            return; 
        } 
 
        if (event.key === 'ArrowUp') { 
            event.preventDefault(); 
 
            if (searchResults?.classList.contains('hidden')) { 
                searchClients(searchInput.value); 
                return; 
            } 
 
            moveSearchHighlight('up'); 
 
            return; 
        } 
 
        if (event.key === 'Enter') { 
            if (searchHighlightedIndex >= 0) { 
                event.preventDefault(); 
                selectHighlightedSearchResult(); 
            } 
        } 
    }); 
 
    async function searchClients(query) { 
        if (!query.trim()) { 
            searchResults?.classList.add('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'false'); 
            resetSearchHighlight(); 
            return; 
        } 
 
        try { 
            const response = await fetch( 
                `/payroll/public/api/client-master/search?search=${encodeURIComponent(query)}`, 
                { 
                    headers: { 
                        'Accept': 'application/json', 
                        'X-Requested-With': 'XMLHttpRequest' 
                    }, 
                    credentials: 'same-origin' 
                } 
            ); 
 
            const result = await response.json(); 
 
            if (!response.ok || !result.success) { 
                throw new Error( 
                    result.message || 'Unable to search clients.' 
                ); 
            } 
 
            const clients = result.data || []; 
 
            resetSearchHighlight(); 
 
            searchList.innerHTML = clients.length 
                ? clients.map(client => ` 
                    <button 
                        type="button" 
                        id="clientSearchResult-${escapeHtml(client.client_id)}" 
                        data-client-id="${escapeHtml(client.client_id)}" 
                        data-client-search-result 
                        role="option" 
                        aria-selected="false" 
                        class="w-full text-left px-4 py-3.5 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors cursor-pointer group"> 
 
                        <div class="flex items-center gap-3"> 
                            <div class="w-9 h-9 shrink-0 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center"> 
                                <i class="fa-solid fa-building text-sm"></i> 
                            </div> 
 
                            <div class="min-w-0 flex-1"> 
                                <div class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate"> 
                                    ${escapeHtml(client.client_name || '')} 
                                </div> 
 
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"> 
                                    ${client.client_contact 
                                        ? escapeHtml(client.client_contact) 
                                        : `Client #${escapeHtml(client.client_id)}` 
                                    } 
                                </div> 
                            </div> 
 
                            <i class="fa-solid fa-chevron-right text-xs text-gray-300 dark:text-gray-500 group-hover:text-green-500 transition-colors"></i> 
                        </div> 
                    </button> 
                `).join('') 
                : ` 
                    <div class="px-5 py-8 text-center"> 
                        <div class="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center"> 
                            <i class="fa-solid fa-building-circle-exclamation text-gray-400 dark:text-gray-300"></i> 
                        </div> 
 
                        <div class="text-sm font-medium text-gray-600 dark:text-gray-300"> 
                            No clients found 
                        </div> 
 
                        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1"> 
                            Try a different search term. 
                        </div> 
                    </div> 
                `; 
 
            searchResults?.classList.remove('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'true'); 
 
            searchList.querySelectorAll('[data-client-search-result]').forEach(button => { 
                button.addEventListener('mouseenter', () => { 
                    const results = Array.from( 
                        searchList.querySelectorAll('[data-client-search-result]') 
                    ); 
 
                    searchHighlightedIndex = results.indexOf(button); 
                    updateSearchHighlight(); 
                }); 
 
                button.addEventListener('click', () => { 
                    searchResults?.classList.add('hidden'); 
                    searchInput?.setAttribute('aria-expanded', 'false'); 
                    resetSearchHighlight(); 
 
                    loadClient(button.dataset.clientId); 
                }); 
            }); 
        } catch (error) { 
            console.error('Client search error:', error); 
        } 
    } 
 
    document.addEventListener('click', event => { 
        if (!panel.contains(event.target)) return; 
 
        if ( 
            !event.target.closest('.client-action-button') && 
            !event.target.closest('.client-action-menu') 
        ) { 
            closeActionMenus(); 
        } 
 
        if ( 
            !event.target.closest('#clientSearch') && 
            !event.target.closest('#clientSearchResults') 
        ) { 
            searchResults?.classList.add('hidden'); 
            searchInput?.setAttribute('aria-expanded', 'false'); 
            resetSearchHighlight(); 
        } 
    }); 
 
    addSearchStyles(); 
 
    clearFormData(); 
    currentClientId = null; 
    creating = false; 
    editing = false; 
    clientListPage = 1; 
 
    setFieldState(false); 
    saveOriginalData(); 
    setButtonState(); 
 
    await loadClientList('', 1); 
}


