import Swal from 'sweetalert2';
import { state } from './state.js';
import {
    swalConfig,
    normalizePayrollFrequency
} from './helpers.js';

export async function saveClient(ctx) {
    const data = {};

    Object.entries(ctx.allFields).forEach(
        ([key, field]) => {
            if (!field) return;

            data[key] =
                field.type === 'checkbox'
                    ? field.checked
                    : field.value;
        }
    );

    data.payroll_frequency =
        normalizePayrollFrequency(
            data.payroll_frequency
        );

    if (!data.client_name?.trim()) {
        await Swal.fire(
            swalConfig({
                icon: 'warning',
                title: 'Client Name Required',
                text: 'Please enter the client name before saving.'
            })
        );

        ctx.fields.client_name?.focus();

        return;
    }

    const csrfToken =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.getAttribute('content');

    if (!csrfToken) {
        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Security Token Missing',
                text: 'CSRF token was not found. Please refresh the page and try again.'
            })
        );

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
        payroll_frequency:
            data.payroll_frequency,

        working_days_per_cutoff:
            data.working_days_per_cutoff,

        working_days_per_year:
            data.working_days_per_year,

        working_days_per_month:
            data.working_days_per_month,

        hours_per_day:
            data.hours_per_day,

        include_13th_month_pay:
            data.include_13th_month_pay,

        add_13th_month_to_gross_pay:
            data.add_13th_month_to_gross_pay,

        agency_fee_basis:
            data.agency_fee_basis,

        agency_rate:
            data.agency_rate,

        client_charge_per_day:
            data.client_charge_per_day,

        tardiness_rate:
            data.tardiness_rate,

        late_charge_per_minute:
            data.late_charge_per_minute,

        regular_overtime_rate:
            data.regular_overtime_rate,

        rest_day_rate:
            data.rest_day_rate,

        rest_day_overtime_rate:
            data.rest_day_overtime_rate,

        special_holiday_rate:
            data.special_holiday_rate,

        legal_holiday_rate:
            data.legal_holiday_rate,

        night_differential_rate:
            data.night_differential_rate,

        special_holiday_overtime_rate:
            data.special_holiday_overtime_rate,

        special_holiday_rest_day_rate:
            data.special_holiday_rest_day_rate,

        special_holiday_rest_day_overtime_rate:
            data.special_holiday_rest_day_overtime_rate,

        legal_holiday_overtime_rate:
            data.legal_holiday_overtime_rate,

        legal_holiday_rest_day_rate:
            data.legal_holiday_rest_day_rate,

        legal_holiday_rest_day_overtime_rate:
            data.legal_holiday_rest_day_overtime_rate,

        ecola_allowance_payment:
            data.ecola_allowance_payment,

        ecola_taxable:
            data.ecola_taxable,

        ecola_on_rest_days:
            data.ecola_on_rest_days,

        ecola_on_holidays:
            data.ecola_on_holidays,

        withhold_tax:
            data.withhold_tax,

        use_fixed_rate_for_tax:
            data.use_fixed_rate_for_tax,

        withhold_sss:
            data.withhold_sss,

        half_sss_monthly_basis:
            data.half_sss_monthly_basis,

        sss_add_on:
            data.sss_add_on,

        withhold_philhealth:
            data.withhold_philhealth,

        philhealth_add_on:
            data.philhealth_add_on,

        withhold_pagibig:
            data.withhold_pagibig,

        exclude_sss_pagibig_from_tax:
            data.exclude_sss_pagibig_from_tax,

        admin_fee:
            data.admin_fee,

        vat:
            data.vat,

        vat_reference:
            data.vat_reference,

        billing_schedule:
            data.billing_schedule,

        billing_template:
            data.billing_template,

        meal_on_bill:
            data.meal_on_bill,

        vale_on_bill:
            data.vale_on_bill,

        severance_pay:
            data.severance_pay,

        cutoff_period:
            data.cutoff_period,

        pickup_dtr:
            data.pickup_dtr,

        salary_release:
            data.salary_release
    };

    const payload = {
        ...clientPayload,
        payroll_config: configPayload
    };

    const url =
        state.currentClientId
            ? `/payroll/public/api/client-master/${state.currentClientId}`
            : '/payroll/public/api/client-master';

    const method =
        state.currentClientId
            ? 'PUT'
            : 'POST';

    try {
        ctx.dom.saveButton.disabled = true;

        const response =
            await fetch(url, {
                method,

                headers: {
                    'Content-Type':
                        'application/json',
                    'Accept':
                        'application/json',
                    'X-CSRF-TOKEN':
                        csrfToken,
                    'X-Requested-With':
                        'XMLHttpRequest'
                },

                credentials:
                    'same-origin',

                body:
                    JSON.stringify(
                        payload
                    )
            });

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                'Unable to save client.'
            );
        }

        if (
            result.data?.client_id
        ) {
            state.currentClientId =
                result.data.client_id;
        }

        const savedClient =
            result.data || {};

        const savedPayrollConfig =
            savedClient.payroll_config ||
            {};

        ctx.setFormData({
            ...data,
            ...savedClient,
            ...savedPayrollConfig
        });

        state.creating = false;
        state.editing = false;

        ctx.saveOriginalData();
        ctx.setFieldState(false);
        ctx.setButtonState();

        await Swal.fire(
            swalConfig({
                icon: 'success',
                title: 'Saved',
                text:
                    result.message ||
                    'Client information saved successfully.',
                timer: 1800,
                showConfirmButton: false
            })
        );

        ctx.showListingView();

        await ctx.loadClientList(
            '',
            1
        );
    } catch (error) {
        console.error(
            'Client save error:',
            error
        );

        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Save Failed',
                text:
                    error.message ||
                    'Unable to save client information.'
            })
        );

        ctx.dom.saveButton.disabled =
            false;
    }
}

export async function loadClient(
    ctx,
    clientId
) {
    if (state.editing) {
        const result =
            await Swal.fire(
                swalConfig({
                    icon: 'question',
                    title: state.creating
                        ? 'Cancel New Client?'
                        : 'Discard Changes?',
                    text: 'You have unsaved changes. Do you want to load another client?',
                    showCancelButton: true,
                    confirmButtonText:
                        'Yes, Continue',
                    cancelButtonText:
                        'Stay Here',
                    confirmButtonColor:
                        '#dc2626',
                    focusCancel: true
                })
            );

        if (!result.isConfirmed) {
            return;
        }
    }

    ctx.closeActionMenus();

    try {
        const response =
            await fetch(
                `/payroll/public/api/client-master/${clientId}`,
                {
                    method: 'GET',

                    headers: {
                        'Accept':
                            'application/json',
                        'X-Requested-With':
                            'XMLHttpRequest'
                    },

                    credentials:
                        'same-origin'
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                'Unable to load client.'
            );
        }

        const client =
            result.data;

        if (!client) {
            throw new Error(
                'Client data was not returned.'
            );
        }

        const clientData = {
            client_name:
                client.client_name,

            client_address:
                client.client_address,

            client_contact:
                client.client_contact,

            client_contact2:
                client.client_contact2,

            client_owner:
                client.client_owner,

            contact_person:
                client.contact_person,

            contact_position:
                client.contact_position,

            client_assistant:
                client.client_assistant,

            assistant_position:
                client.assistant_position,

            permit_no:
                client.permit_no,

            bank_name:
                client.bank_name,

            account_no:
                client.account_no
        };

        const payrollConfig =
            client.payroll_config ||
            {};

        ctx.setFormData({
            ...clientData,
            ...payrollConfig
        });

        state.currentClientId =
            client.client_id;

        state.creating = false;
        state.editing = false;

        ctx.setFieldState(false);
        ctx.setButtonState();
        ctx.saveOriginalData();

        ctx.showFormView();

        ctx.dom.searchResults?.classList.add(
            'hidden'
        );

        ctx.dom.searchInput?.setAttribute(
            'aria-expanded',
            'false'
        );

        ctx.resetSearchHighlight();
    } catch (error) {
        console.error(
            'Load client error:',
            error
        );

        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Unable to Load Client',
                text:
                    error.message ||
                    'An error occurred while loading the client.'
            })
        );
    }
}