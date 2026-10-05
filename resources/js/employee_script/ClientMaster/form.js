import Swal from 'sweetalert2';
import { state } from './state.js';
import { swalConfig, normalizePayrollFrequency } from './helpers.js';

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

export function setFieldState(ctx, enabled) {
    Object.values(ctx.allFields).forEach(field => {
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
        field.classList.remove(...inputClasses.normal, ...inputClasses.disabled);
        field.classList.add(
            ...(enabled ? inputClasses.normal : inputClasses.disabled)
        );
    });
}

export function setButtonState(ctx) {
    const { editButton, saveButton } = ctx.dom;

    if (!editButton || !saveButton) return;

    if (state.editing && state.creating) {
        editButton.innerHTML =
            '<i class="fa-solid fa-xmark mr-2"></i>Cancel';

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

    if (state.editing) {
        editButton.innerHTML =
            '<i class="fa-solid fa-xmark mr-2"></i>Cancel';

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

    editButton.innerHTML = state.currentClientId
        ? '<i class="fa-solid fa-pen-to-square mr-2"></i>Edit'
        : '<i class="fa-solid fa-plus mr-2"></i>Add Client';

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

export function getFormData(ctx) {
    const data = {};

    Object.entries(ctx.allFields).forEach(([key, field]) => {
        if (!field) return;

        data[key] = field.type === 'checkbox'
            ? field.checked
            : field.value;
    });

    return data;
}

export function setFormData(ctx, data = {}) {
    Object.entries(ctx.allFields).forEach(([key, field]) => {
        if (!field) return;

        let value = data[key];

        if (field.type === 'checkbox') {
            field.checked =
                value === true ||
                value === 1 ||
                value === '1';

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

export function clearFormData(ctx) {
    Object.values(ctx.allFields).forEach(field => {
        if (!field) return;

        if (field.type === 'checkbox') {
            field.checked = false;
        } else {
            field.value = '';
        }
    });

    if (ctx.configFields.payroll_frequency) {
        ctx.configFields.payroll_frequency.value = 'semi_monthly';
    }

    if (ctx.configFields.agency_fee_basis) {
        ctx.configFields.agency_fee_basis.value = 'agency_rate';
    }

    if (ctx.configFields.billing_schedule) {
        ctx.configFields.billing_schedule.value = '';
    }

    if (ctx.configFields.billing_template) {
        ctx.configFields.billing_template.value = '';
    }

    if (ctx.configFields.pickup_dtr) {
        ctx.configFields.pickup_dtr.value = 'Not configured';
    }

    if (ctx.configFields.salary_release) {
        ctx.configFields.salary_release.value = 'Not configured';
    }
}

export function saveOriginalData(ctx) {
    state.originalData = getFormData(ctx);
}

export function restoreOriginalData(ctx) {
    setFormData(ctx, state.originalData);
}

export function enterAddMode(ctx) {
    clearFormData(ctx);

    state.currentClientId = null;
    state.creating = true;
    state.editing = true;

    saveOriginalData(ctx);

    setFieldState(ctx, true);
    setButtonState(ctx);

    ctx.showFormView();

    ctx.fields.client_name?.focus();
}

export function enterEditMode(ctx) {
    if (!state.currentClientId) {
        enterAddMode(ctx);
        return;
    }

    state.creating = false;
    state.editing = true;

    setFieldState(ctx, true);
    setButtonState(ctx);
}

export async function cancelEdit(ctx) {
    if (!state.editing) return;

    const result = await Swal.fire(
        swalConfig({
            icon: 'question',
            title: state.creating
                ? 'Cancel Adding Client?'
                : 'Cancel Editing?',
            text: 'Any unsaved changes will be discarded.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'Continue',
            confirmButtonColor: '#dc2626',
            focusCancel: true
        })
    );

    if (!result.isConfirmed) return;

    if (state.creating) {
        clearFormData(ctx);

        state.currentClientId = null;
        state.creating = false;
        state.editing = false;

        saveOriginalData(ctx);

        ctx.showListingView();
    } else {
        restoreOriginalData(ctx);

        state.editing = false;

        setFieldState(ctx, false);
        setButtonState(ctx);
    }

    setFieldState(ctx, false);
    setButtonState(ctx);
}