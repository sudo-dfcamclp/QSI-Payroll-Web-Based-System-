import Swal from 'sweetalert2';

import { state } from './state.js';

import {
    swalConfig
} from './helpers.js';

import {
    setFieldState,
    setButtonState,
    clearFormData,
    saveOriginalData,
    setFormData,
    enterAddMode,
    enterEditMode,
    cancelEdit
} from './form.js';

import {
    showListingView,
    showFormView,
    loadClientList,
    initializeList
} from './list.js';

import {
    initializeSort,
    closeSortMenu,
    createSortMenu
} from './sort.js';

import {
    addSearchStyles,
    initializeSearch,
    resetSearchHighlight
} from './search.js';

import {
    saveClient,
    loadClient
} from './client.js';

import {
    closeActionMenus,
    createActionMenu
} from './actions.js';

export async function init(panel) {

    const listingView =
        panel.querySelector(
            '#clientListingView'
        );

    const formView =
        panel.querySelector(
            '#clientFormView'
        );

    const clientList =
        panel.querySelector(
            '#clientList'
        );

    const clientListSearch =
        panel.querySelector(
            '#clientListSearch'
        );

    const clientSortButton =
        panel.querySelector(
            '#clientSortButton'
        );

    const addClientButton =
        panel.querySelector(
            '#clientAddButton'
        );

    const backToListButton =
        panel.querySelector(
            '#clientBackToListButton'
        );

    const editButton =
        panel.querySelector(
            '#clientEditButton'
        );

    const saveButton =
        panel.querySelector(
            '#clientSaveButton'
        );

    const searchInput =
        panel.querySelector(
            '#clientSearch'
        );

    const searchResults =
        panel.querySelector(
            '#clientSearchResults'
        );

    const searchList =
        panel.querySelector(
            '#clientSearchList'
        );

    const fields = {
        client_name:
            panel.querySelector(
                '#clientName'
            ),

        client_address:
            panel.querySelector(
                '#clientAddress'
            ),

        client_contact:
            panel.querySelector(
                '#clientContact'
            ),

        client_contact2:
            panel.querySelector(
                '#alternativeContact'
            ),

        client_owner:
            panel.querySelector(
                '#clientOwner'
            ),

        contact_person:
            panel.querySelector(
                '#contactPerson'
            ),

        contact_position:
            panel.querySelector(
                '#contactPosition'
            ),

        client_assistant:
            panel.querySelector(
                '#clientAssistant'
            ),

        assistant_position:
            panel.querySelector(
                '#assistantPosition'
            ),

        permit_no:
            panel.querySelector(
                '#permitNo'
            ),

        bank_name:
            panel.querySelector(
                '#bankName'
            ),

        account_no:
            panel.querySelector(
                '#accountNo'
            )
    };

    const configFields = {

        payroll_frequency:
            panel.querySelector(
                '#payrollFrequency'
            ),

        working_days_per_cutoff:
            panel.querySelector(
                '#workingDaysPerCutoff'
            ),

        working_days_per_year:
            panel.querySelector(
                '#workingDaysPerYear'
            ),

        working_days_per_month:
            panel.querySelector(
                '#workingDaysPerMonth'
            ),

        hours_per_day:
            panel.querySelector(
                '#hoursPerDay'
            ),

        include_13th_month_pay:
            panel.querySelector(
                '#include13thMonth'
            ),

        add_13th_month_to_gross_pay:
            panel.querySelector(
                '#add13thMonthGross'
            ),

        agency_fee_basis:
            panel.querySelector(
                '#agencyFeeBasis'
            ),

        agency_rate:
            panel.querySelector(
                '#agencyRate'
            ),

        client_charge_per_day:
            panel.querySelector(
                '#clientChargePerDay'
            ),

        tardiness_rate:
            panel.querySelector(
                '#tardinessRate'
            ),

        late_charge_per_minute:
            panel.querySelector(
                '#lateChargePerMinute'
            ),

        regular_overtime_rate:
            panel.querySelector(
                '#regularOvertimeRate'
            ),

        rest_day_rate:
            panel.querySelector(
                '#restDayRate'
            ),

        rest_day_overtime_rate:
            panel.querySelector(
                '#restDayOvertimeRate'
            ),

        special_holiday_rate:
            panel.querySelector(
                '#specialHolidayRate'
            ),

        legal_holiday_rate:
            panel.querySelector(
                '#legalHolidayRate'
            ),

        night_differential_rate:
            panel.querySelector(
                '#nightDifferentialRate'
            ),

        special_holiday_overtime_rate:
            panel.querySelector(
                '#specialHolidayOvertimeRate'
            ),

        special_holiday_rest_day_rate:
            panel.querySelector(
                '#specialHolidayRestDayRate'
            ),

        special_holiday_rest_day_overtime_rate:
            panel.querySelector(
                '#specialHolidayRestDayOvertimeRate'
            ),

        legal_holiday_overtime_rate:
            panel.querySelector(
                '#legalHolidayOvertimeRate'
            ),

        legal_holiday_rest_day_rate:
            panel.querySelector(
                '#legalHolidayRestDayRate'
            ),

        legal_holiday_rest_day_overtime_rate:
            panel.querySelector(
                '#legalHolidayRestDayOvertimeRate'
            ),

        ecola_allowance_payment:
            panel.querySelector(
                '#ecolaAllowancePayment'
            ),

        ecola_taxable:
            panel.querySelector(
                '#ecolaTaxable'
            ),

        ecola_on_rest_days:
            panel.querySelector(
                '#ecolaRestDays'
            ),

        ecola_on_holidays:
            panel.querySelector(
                '#ecolaHolidays'
            ),

        withhold_tax:
            panel.querySelector(
                '#withholdTax'
            ),

        use_fixed_rate_for_tax:
            panel.querySelector(
                '#useFixedTaxRate'
            ),

        withhold_sss:
            panel.querySelector(
                '#withholdSSS'
            ),

        half_sss_monthly_basis:
            panel.querySelector(
                '#halfSSS'
            ),

        sss_add_on:
            panel.querySelector(
                '#sssAddOn'
            ),

        withhold_philhealth:
            panel.querySelector(
                '#withholdPhilHealth'
            ),

        philhealth_add_on:
            panel.querySelector(
                '#philHealthAddOn'
            ),

        withhold_pagibig:
            panel.querySelector(
                '#withholdPagibig'
            ),

        exclude_sss_pagibig_from_tax:
            panel.querySelector(
                '#excludeGovernmentFromTax'
            ),

        admin_fee:
            panel.querySelector(
                '#adminFee'
            ),

        vat:
            panel.querySelector(
                '#vat'
            ),

        vat_reference:
            panel.querySelector(
                '#vatReference'
            ),

        billing_schedule:
            panel.querySelector(
                '#billingSchedule'
            ),

        billing_template:
            panel.querySelector(
                '#billingTemplate'
            ),

        meal_on_bill:
            panel.querySelector(
                '#mealOnBill'
            ),

        vale_on_bill:
            panel.querySelector(
                '#valeOnBill'
            ),

        severance_pay:
            panel.querySelector(
                '#severancePay'
            ),

        cutoff_period:
            panel.querySelector(
                '#cutoffPeriod'
            ),

        pickup_dtr:
            panel.querySelector(
                '#pickupDtr'
            ),

        salary_release:
            panel.querySelector(
                '#salaryRelease'
            )
    };

    const allFields = {
        ...fields,
        ...configFields
    };

    const ctx = {
        panel,

        dom: {
            listingView,
            formView,
            clientList,
            clientListSearch,
            clientSortButton,
            addClientButton,
            backToListButton,
            editButton,
            saveButton,
            searchInput,
            searchResults,
            searchList
        },

        fields,
        configFields,
        allFields,
        state,

        showListingView: () =>
            showListingView(ctx),

        showFormView: () =>
            showFormView(ctx),

        loadClientList:
            (search = '', page = 1) =>
                loadClientList(
                    ctx,
                    search,
                    page
                ),

        loadClient:
            clientId =>
                loadClient(
                    ctx,
                    clientId
                ),

        saveClient:
            () =>
                saveClient(ctx),

        enterAddMode:
            () =>
                enterAddMode(ctx),

        enterEditMode:
            () =>
                enterEditMode(ctx),

        cancelEdit:
            () =>
                cancelEdit(ctx),

        closeActionMenus:
            () =>
                closeActionMenus(ctx),

        createActionMenu:
            (
                button,
                clientId,
                clientName
            ) =>
                createActionMenu(
                    ctx,
                    button,
                    clientId,
                    clientName
                ),

        closeSortMenu:
            () =>
                closeSortMenu(ctx),

        createSortMenu:
            () =>
                createSortMenu(ctx),

        swalConfig,

        resetSearchHighlight:
            () =>
                resetSearchHighlight(ctx),

        setFieldState:
            enabled =>
                setFieldState(
                    ctx,
                    enabled
                ),

        setButtonState:
            () =>
                setButtonState(ctx),

        clearFormData:
            () =>
                clearFormData(ctx),

        saveOriginalData:
            () =>
                saveOriginalData(ctx),

        setFormData:
            data =>
                setFormData(
                    ctx,
                    data
                )
    };

    if (searchInput) {
        searchInput.setAttribute(
            'role',
            'combobox'
        );

        searchInput.setAttribute(
            'aria-autocomplete',
            'list'
        );

        searchInput.setAttribute(
            'aria-expanded',
            'false'
        );
    }

    if (searchList) {
        searchList.setAttribute(
            'role',
            'listbox'
        );
    }

    state.editing = false;
    state.creating = false;
    state.currentClientId = null;
    state.originalData = {};
    state.searchHighlightedIndex = -1;
    state.clientListPage = 1;
    state.clientSort = 'name';
    state.clientSortDirection = 'asc';

    addSearchStyles(ctx);

    initializeSort(ctx);
    initializeList(ctx);
    initializeSearch(ctx);

    editButton?.addEventListener(
        'click',
        async () => {

            if (state.editing) {
                await cancelEdit(ctx);
                return;
            }

            if (state.currentClientId) {
                enterEditMode(ctx);
            } else {
                enterAddMode(ctx);
            }
        }
    );

    saveButton?.addEventListener(
        'click',
        () => saveClient(ctx)
    );

    backToListButton?.addEventListener(
        'click',
        async () => {

            if (state.editing) {

                const result =
                    await Swal.fire(
                        swalConfig({
                            icon: 'question',

                            title:
                                state.creating
                                    ? 'Cancel New Client?'
                                    : 'Discard Changes?',

                            text:
                                'Any unsaved changes will be discarded.',

                            showCancelButton:
                                true,

                            confirmButtonText:
                                'Yes, Go Back',

                            cancelButtonText:
                                'Stay Here',

                            confirmButtonColor:
                                '#dc2626',

                            focusCancel:
                                true
                        })
                    );

                if (!result.isConfirmed) {
                    return;
                }
            }

            state.editing = false;
            state.creating = false;

            setFieldState(
                ctx,
                false
            );

            setButtonState(ctx);

            showListingView(ctx);
        }
    );

    panel.addEventListener(
        'click',
        event => {

            if (
                !event.target.closest(
                    '.client-action-button'
                ) &&
                !event.target.closest(
                    '.client-action-menu'
                )
            ) {
                closeActionMenus(ctx);
            }

            if (
                !event.target.closest(
                    '#clientSortButton'
                ) &&
                !event.target.closest(
                    '#clientSortMenu'
                )
            ) {
                closeSortMenu(ctx);
            }

            if (
                !event.target.closest(
                    '#clientSearch'
                ) &&
                !event.target.closest(
                    '#clientSearchResults'
                )
            ) {

                searchResults?.classList.add(
                    'hidden'
                );

                searchInput?.setAttribute(
                    'aria-expanded',
                    'false'
                );

                resetSearchHighlight(ctx);
            }
        }
    );

    clearFormData(ctx);

    setFieldState(
        ctx,
        false
    );

    saveOriginalData(ctx);

    setButtonState(ctx);

    await loadClientList(
        ctx,
        '',
        1
    );
}