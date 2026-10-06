import Swal from 'sweetalert2';


export function clearComputedRates(ctx) {
    if (ctx.dom.hourlyRateField) {
        ctx.dom.hourlyRateField.value = '';
    }

    if (ctx.dom.monthlyRateField) {
        ctx.dom.monthlyRateField.value = '';
    }
}


export function getPayrollConfig(ctx) {
    if (!ctx.state.currentClientPayrollConfig) {
        return null;
    }

    const hoursPerDay =
        Number(
            ctx.state.currentClientPayrollConfig
                .hours_per_day
        );

    const workingDaysPerMonth =
        Number(
            ctx.state.currentClientPayrollConfig
                .working_days_per_month
        );

    if (
        !Number.isFinite(hoursPerDay) ||
        !Number.isFinite(
            workingDaysPerMonth
        ) ||
        hoursPerDay <= 0 ||
        workingDaysPerMonth <= 0
    ) {
        return null;
    }

    return {
        hoursPerDay,
        workingDaysPerMonth
    };
}


export function formatRate(ctx, value) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return '';
    }

    return number.toFixed(2);
}


export function updateRateFieldState(ctx) {
    const editable =
        ctx.state.mode === 'edit' ||
        ctx.state.mode === 'add';

    if (ctx.dom.rateBasisField) {
        ctx.dom.rateBasisField.disabled =
            !editable;

        ctx.dom.rateBasisField.classList.remove(
            'cursor-pointer',
            'cursor-not-allowed'
        );

        ctx.dom.rateBasisField.classList.add(
            editable
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
        );

        ctx.dom.rateBasisField.classList.toggle(
            'opacity-60',
            !editable
        );
    }

    if (ctx.dom.dailyRateField) {
        ctx.dom.dailyRateField.disabled =
            false;

        ctx.dom.dailyRateField.readOnly =
            !editable;

        ctx.dom.dailyRateField.classList.remove(
            'cursor-text',
            'cursor-not-allowed'
        );

        ctx.dom.dailyRateField.classList.add(
            editable
                ? 'cursor-text'
                : 'cursor-not-allowed'
        );

        ctx.dom.dailyRateField.classList.toggle(
            'opacity-60',
            !editable
        );
    }

    [
        ctx.dom.hourlyRateField,
        ctx.dom.monthlyRateField
    ].forEach(field => {
        if (!field) {
            return;
        }

        field.disabled = false;
        field.readOnly = true;

        field.classList.remove(
            'cursor-text',
            'cursor-not-allowed'
        );

        field.classList.add(
            'cursor-not-allowed'
        );

        field.classList.add(
            'opacity-60'
        );
    });
}


export function calculateRates(
    ctx,
    showError = true
) {
    const dailyRate =
        Number(
            ctx.dom.dailyRateField?.value
        );

    if (
        !Number.isFinite(dailyRate) ||
        dailyRate <= 0
    ) {
        if (ctx.dom.hourlyRateField) {
            ctx.dom.hourlyRateField.value =
                '';
        }

        if (ctx.dom.monthlyRateField) {
            ctx.dom.monthlyRateField.value =
                '';
        }

        return false;
    }

    const config =
        ctx.getPayrollConfig();

    if (!config) {
        if (ctx.dom.hourlyRateField) {
            ctx.dom.hourlyRateField.value =
                '';
        }

        if (ctx.dom.monthlyRateField) {
            ctx.dom.monthlyRateField.value =
                '';
        }

        if (showError) {
            Swal.fire({
                icon: 'warning',
                title:
                    'Payroll Configuration Required',
                text:
                    'Assign a client with payroll config before entering a rate.',
                confirmButtonColor:
                    '#0a5d3c'
            });
        }

        return false;
    }

    const hourlyRate =
        dailyRate /
        config.hoursPerDay;

    const monthlyRate =
        dailyRate *
        config.workingDaysPerMonth;

    if (ctx.dom.hourlyRateField) {
        ctx.dom.hourlyRateField.value =
            ctx.formatRate(
                hourlyRate
            );
    }

    if (ctx.dom.monthlyRateField) {
        ctx.dom.monthlyRateField.value =
            ctx.formatRate(
                monthlyRate
            );
    }

    return true;
}


export function handleRateBasisChange(ctx) {
    if (
        ctx.state.mode !== 'edit' &&
        ctx.state.mode !== 'add'
    ) {
        return;
    }

    /*
     * Do not force the value back to Daily.
     * Keep the user's selected:
     * Daily / Monthly / Hourly
     */

    ctx.updateRateFieldState();
}


export function handleDailyRateBlur(ctx) {
    if (
        ctx.state.mode !== 'edit' &&
        ctx.state.mode !== 'add'
    ) {
        return;
    }

    ctx.calculateRates(true);
}


export function buildFormData(ctx) {
    const data =
        new FormData();

    /*
     * Collect the normal employee fields.
     */
    ctx.getFields().forEach(field => {
        if (
            !field.name ||
            field.name === 'emp_id'
        ) {
            return;
        }

        if (
            field.name ===
            'profile_photo'
        ) {
            if (
                field.files &&
                field.files.length > 0
            ) {
                data.append(
                    'profile_photo',
                    field.files[0]
                );
            }

            return;
        }

        if (
            field.type === 'checkbox'
        ) {
            data.append(
                field.name,
                field.checked
                    ? '1'
                    : '0'
            );

            return;
        }

        data.append(
            field.name,
            field.value ?? ''
        );
    });


    /*
     * Explicitly append the rate fields.
     *
     * These fields are outside the employee form
     * in the current live DOM, so getFields()
     * does not collect them.
     */
    if (ctx.dom.rateBasisField) {
        data.set(
            'rate_basis',
            ctx.dom.rateBasisField.value ?? ''
        );
    }

    if (ctx.dom.dailyRateField) {
        data.set(
            'daily_rate',
            ctx.dom.dailyRateField.value ?? ''
        );
    }

    if (ctx.dom.hourlyRateField) {
        data.set(
            'hourly_rate',
            ctx.dom.hourlyRateField.value ?? ''
        );
    }

    if (ctx.dom.monthlyRateField) {
        data.set(
            'monthly_rate',
            ctx.dom.monthlyRateField.value ?? ''
        );
    }


    /*
     * Temporary debugging.
     * This lets us confirm that the computed
     * values are actually entering FormData.
     */
    console.log(
        'Rate FormData:',
        {
            rate_basis:
                data.get('rate_basis'),

            daily_rate:
                data.get('daily_rate'),

            hourly_rate:
                data.get('hourly_rate'),

            monthly_rate:
                data.get('monthly_rate')
        }
    );

    return data;
}

