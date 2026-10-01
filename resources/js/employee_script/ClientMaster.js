import Swal from 'sweetalert2';

export async function init(panel) {
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
    let highlightedIndex = -1;

    if (searchInput) {
        searchInput.setAttribute('role', 'combobox');
        searchInput.setAttribute('aria-autocomplete', 'list');
        searchInput.setAttribute('aria-expanded', 'false');
        searchInput.setAttribute('aria-controls', 'clientSearchList');
    }

    if (searchList) {
        searchList.setAttribute('role', 'listbox');
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

            editButton.classList.remove(
                'bg-green-600',
                'hover:bg-green-700'
            );

            editButton.classList.add(
                'bg-red-500',
                'hover:bg-red-600'
            );

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

            editButton.classList.remove(
                'bg-green-600',
                'hover:bg-green-700'
            );

            editButton.classList.add(
                'bg-red-500',
                'hover:bg-red-600'
            );

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

        if (currentClientId) {
            editButton.innerHTML = '<i class="fa-solid fa-pen-to-square mr-2"></i>Edit';
        } else {
            editButton.innerHTML = '<i class="fa-solid fa-plus mr-2"></i>Add Client';
        }

        editButton.classList.remove(
            'bg-red-500',
            'hover:bg-red-600'
        );

        editButton.classList.add(
            'bg-green-600',
            'hover:bg-green-700'
        );

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

            if (field.type === 'checkbox') {
                data[key] = field.checked;
            } else {
                data[key] = field.value;
            }
        });

        return data;
    }

    function setFormData(data = {}) {
        Object.entries(allFields).forEach(([key, field]) => {
            if (!field) return;

            const value = data[key];

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 1 || value === '1';
                return;
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

        const result = await Swal.fire({
            icon: 'question',
            title: creating ? 'Cancel Adding Client?' : 'Cancel Editing?',
            text: 'Any unsaved changes will be discarded.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'Continue',
            confirmButtonColor: '#dc2626'
        });

        if (!result.isConfirmed) return;

        if (creating) {
            clearFormData();
            currentClientId = null;
            creating = false;
            editing = false;

            if (searchInput) {
                searchInput.value = '';
            }

            saveOriginalData();
        } else {
            restoreOriginalData();
            editing = false;
        }

        setFieldState(false);
        setButtonState();
    }

    async function saveClient() {
        if (!editing) return;

        const data = getFormData();

        if (!data.client_name?.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'Client Name Required',
                text: 'Please enter the client name before saving.',
                confirmButtonColor: '#0a5d3c'
            });

            fields.client_name?.focus();
            return;
        }

        const csrfToken = document.querySelector(
            'meta[name="csrf-token"]'
        )?.getAttribute('content');

        if (!csrfToken) {
            await Swal.fire({
                icon: 'error',
                title: 'Security Token Missing',
                text: 'CSRF token was not found. Please refresh the page.'
            });

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
            special_holiday_rest_day_overtime_rate: data.special_holiday_rest_day_over_time_rate,
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

        const method = currentClientId
            ? 'PUT'
            : 'POST';

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

            setFormData({
                ...data,
                ...(result.data?.client || {}),
                ...(result.data?.payroll_config || {})
            });

            creating = false;
            editing = false;

            saveOriginalData();

            setFieldState(false);
            setButtonState();

            if (searchInput) {
                searchInput.value = result.data?.client?.client_name || data.client_name || '';
            }

            await Swal.fire({
                icon: 'success',
                title: 'Saved',
                text: result.message || 'Client information saved successfully.',
                timer: 1800,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Client save error:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: error.message || 'Unable to save client information.'
            });

            saveButton.disabled = false;
        }
    }

    async function loadClient(clientId) {
        if (editing) {
            const result = await Swal.fire({
                icon: 'question',
                title: creating ? 'Cancel New Client?' : 'Discard Changes?',
                text: 'You have unsaved changes. Do you want to load another client?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Continue',
                cancelButtonText: 'Stay Here',
                confirmButtonColor: '#dc2626'
            });

            if (!result.isConfirmed) return;
        }

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

            if (searchInput) {
                searchInput.value = client.client_name || '';
                searchInput.setAttribute('aria-expanded', 'false');
            }

            searchResults.classList.add('hidden');
            resetHighlightedResult();
        } catch (error) {
            console.error('Load client error:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Unable to Load Client',
                text: error.message || 'An error occurred while loading the client.'
            });
        }
    }

    function updateHighlightedResult() {
        const results = searchList?.querySelectorAll('[data-client-id]') || [];

        results.forEach((result, index) => {
            const isHighlighted = index === highlightedIndex;

            result.classList.toggle('bg-gray-100', isHighlighted);
            result.classList.toggle('dark:bg-gray-600', isHighlighted);

            result.setAttribute(
                'aria-selected',
                isHighlighted ? 'true' : 'false'
            );

            if (isHighlighted) {
                searchInput?.setAttribute(
                    'aria-activedescendant',
                    result.id
                );

                result.scrollIntoView({
                    block: 'nearest'
                });
            }
        });

        if (highlightedIndex < 0) {
            searchInput?.removeAttribute('aria-activedescendant');
        }
    }

    function resetHighlightedResult() {
        highlightedIndex = -1;

        if (searchList) {
            searchList.querySelectorAll('[data-client-id]').forEach(result => {
                result.classList.remove(
                    'bg-gray-100',
                    'dark:bg-gray-600'
                );

                result.setAttribute('aria-selected', 'false');
            });
        }

        searchInput?.removeAttribute('aria-activedescendant');
    }

    async function selectHighlightedResult() {
        const results = searchList?.querySelectorAll('[data-client-id]') || [];

        if (
            highlightedIndex < 0 ||
            highlightedIndex >= results.length
        ) {
            return;
        }

        const selectedResult = results[highlightedIndex];

        await loadClient(selectedResult.dataset.clientId);
    }

    async function searchClients(query) {
        resetHighlightedResult();

        if (!query.trim()) {
            if (searchList) {
                searchList.innerHTML = '';
            }

            searchResults.classList.add('hidden');
            searchInput?.setAttribute('aria-expanded', 'false');
            return;
        }

        try {
            const response = await fetch(
                `/payroll/public/api/client-master/search?search=${encodeURIComponent(query)}`,
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
                    result.message || 'Unable to search clients.'
                );
            }

            const clients = result.data || [];

            if (!clients.length) {
                searchList.innerHTML = `
                    <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        No clients found.
                    </div>
                `;

                searchResults.classList.remove('hidden');
                searchInput?.setAttribute('aria-expanded', 'true');
                return;
            }

            searchList.innerHTML = clients.map(client => `
                <button
                    type="button"
                    id="clientSearchOption${client.client_id}"
                    data-client-id="${client.client_id}"
                    role="option"
                    aria-selected="false"
                    class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <div class="font-medium text-sm text-gray-800 dark:text-white">
                        ${escapeHtml(client.client_name || '')}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${escapeHtml(client.client_contact || '')}
                    </div>
                </button>
            `).join('');

            searchResults.classList.remove('hidden');
            searchInput?.setAttribute('aria-expanded', 'true');

            searchList.querySelectorAll('[data-client-id]').forEach((button, index) => {
                button.addEventListener('mouseenter', () => {
                    highlightedIndex = index;
                    updateHighlightedResult();
                });

                button.addEventListener('click', async event => {
                    event.preventDefault();
                    event.stopPropagation();

                    await loadClient(button.dataset.clientId);
                });
            });
        } catch (error) {
            console.error('Client search error:', error);

            searchList.innerHTML = `
                <div class="px-4 py-3 text-sm text-red-500">
                    Unable to search clients.
                </div>
            `;

            searchResults.classList.remove('hidden');
            searchInput?.setAttribute('aria-expanded', 'true');
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);

        searchInput.removeAttribute('aria-activedescendant');
        highlightedIndex = -1;

        searchTimeout = setTimeout(() => {
            searchClients(searchInput.value);
        }, 300);
    });

    searchInput?.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchClients(searchInput.value);
        }
    });

    searchInput?.addEventListener('keydown', async event => {
        const results = searchList?.querySelectorAll('[data-client-id]') || [];

        if (event.key === 'Escape') {
            event.preventDefault();

            searchResults.classList.add('hidden');
            searchInput.setAttribute('aria-expanded', 'false');
            resetHighlightedResult();
            return;
        }

        if (!results.length) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (searchResults.classList.contains('hidden')) {
                searchResults.classList.remove('hidden');
                searchInput.setAttribute('aria-expanded', 'true');
            }

            highlightedIndex++;

            if (highlightedIndex >= results.length) {
                highlightedIndex = 0;
            }

            updateHighlightedResult();
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (searchResults.classList.contains('hidden')) {
                searchResults.classList.remove('hidden');
                searchInput.setAttribute('aria-expanded', 'true');
            }

            highlightedIndex--;

            if (highlightedIndex < 0) {
                highlightedIndex = results.length - 1;
            }

            updateHighlightedResult();
            return;
        }

        if (event.key === 'Enter') {
            if (highlightedIndex >= 0) {
                event.preventDefault();
                await selectHighlightedResult();
            }
        }
    });

    document.addEventListener('click', event => {
        if (!panel.contains(event.target)) return;

        if (
            searchResults &&
            !searchResults.contains(event.target) &&
            event.target !== searchInput
        ) {
            searchResults.classList.add('hidden');
            searchInput?.setAttribute('aria-expanded', 'false');
            resetHighlightedResult();
        }
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

    clearFormData();

    currentClientId = null;
    creating = false;
    editing = false;

    setFieldState(false);
    saveOriginalData();
    setButtonState();
}