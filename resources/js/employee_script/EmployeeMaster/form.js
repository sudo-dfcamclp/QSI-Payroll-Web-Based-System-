import Swal from 'sweetalert2';

export function getFields(ctx) {
    return Array.from(
        ctx.dom.form.querySelectorAll('[name]')
    ).filter(field => {
        return field.name !== 'employeeSearch';
    });
}

export function getField(ctx, name) {
    return ctx.dom.form.querySelector(`[name="${name}"]`);
}

export function getFormDataObject(ctx) {
    const data = {};

    ctx.getFields().forEach(field => {
        if (!field.name || field.name === 'profile_photo') {
            return;
        }

        if (field.type === 'checkbox') {
            data[field.name] = field.checked;
        } else {
            data[field.name] = field.value;
        }
    });

    return data;
}

export function setFieldValue(ctx, name, value) {
    const field = ctx.getField(name);

    if (!field) {
        return;
    }

    if (field.type === 'checkbox') {
        field.checked =
            value === true ||
            value === 1 ||
            value === '1';

        return;
    }

    field.value = value ?? '';
}

export function populateForm(ctx, employee) {
    if (!employee) {
        return;
    }

    const fields = [
        'emp_id',
        'client_id',
        'contact_no',
        'badge_no',
        'nickname',
        'last_name',
        'first_name',
        'middle_name',
        'suffix_name',
        'birth_date',
        'birth_place',
        'citizenship',
        'gender',
        'civil_status',
        'weight',
        'height',
        'religion',
        'house_no',
        'street',
        'barangay',
        'district',
        'city',
        'town',
        'contact',
        'phone',
        'primary_education',
        'secondary_education',
        'college',
        'degree',
        'major',
        'post_grad',
        'course',
        'sss_no',
        'philhealth_no',
        'pagibig_no',
        'tin_no',
        'employment_status',
        'remarks',
        'position',
        'branch',
        'department',
        'date_hired',
        'date_resigned',
        'start_contract',
        'end_contract',
        'rate_basis',
        'month_no',
        'hourly_rate',
        'daily_rate',
        'monthly_rate',
        'date_reg',
        'date_prob',
        'insurance_no',
        'agency_fee',
        'agency',
        'account_no',
        'expanded_tax',
        'allowance',
        'with_ecol'
    ];

    fields.forEach(name => {
        ctx.setFieldValue(name, employee[name]);
    });

    ctx.populateClient(employee);

    ctx.state.currentEmployeeId =
        employee.emp_id ?? null;

    if (ctx.dom.profileInput) {
        ctx.dom.profileInput.value = '';
    }

    if (ctx.dom.profilePreview) {
        if (employee.profile_photo_url) {
            ctx.dom.profilePreview.src =
                employee.profile_photo_url;

            ctx.dom.profilePreview.classList.remove(
                'hidden'
            );
        } else {
            ctx.dom.profilePreview.removeAttribute(
                'src'
            );

            ctx.dom.profilePreview.classList.add(
                'hidden'
            );
        }
    }

    ctx.updateEmployeeHeader(employee);
    ctx.saveOriginalData();
    ctx.updateCounter();
    ctx.updateRateFieldState();
}

export function updateEmployeeHeader(ctx, employee) {
    if (!ctx.dom.employeeSubtitle) {
        return;
    }

    if (!employee) {
        ctx.dom.employeeSubtitle.textContent =
            'Employee: None selected';

        return;
    }

    const fullName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
        employee.suffix_name
    ]
        .filter(Boolean)
        .join(' ');

    ctx.dom.employeeSubtitle.textContent =
        `Employee: ${fullName || 'Unnamed Employee'}`;
}

export function clearForm(ctx) {
    ctx.dom.form.reset();

    ctx.getFields().forEach(field => {
        if (field.type === 'checkbox') {
            field.checked = false;
        } else if (field.type !== 'file') {
            field.value = '';
        }
    });

    ctx.state.currentEmployeeId = null;
    ctx.state.originalData =
        ctx.getFormDataObject();

    ctx.state.originalClientDisplayName = '';
    ctx.state.currentClientDisplayName = '';
    ctx.state.currentClientPayrollConfig = null;
    ctx.state.originalClientPayrollConfig = null;

    ctx.clearClient();

    if (ctx.dom.profileInput) {
        ctx.dom.profileInput.value = '';
    }

    if (ctx.dom.profilePreview) {
        ctx.dom.profilePreview.removeAttribute('src');
        ctx.dom.profilePreview.classList.add('hidden');
    }

    if (ctx.dom.employeeSubtitle) {
        ctx.dom.employeeSubtitle.textContent =
            'Employee: New Employee';
    }

    ctx.clearComputedRates();
    ctx.updateRateFieldState();
    ctx.updateCounter();
}

export function setFieldState(ctx, enabled) {
    ctx.getFields().forEach(field => {
        if (!field) {
            return;
        }

        const isCheckbox =
            field.type === 'checkbox';

        const isSelect =
            field.tagName === 'SELECT';

        const isFile =
            field.type === 'file';

        const isHidden =
            field.type === 'hidden';

        const isEmployeeId =
            field.name === 'emp_id';

        const isClientId =
            field.name === 'client_id';

        const isRateField = [
            'rate_basis',
            'hourly_rate',
            'daily_rate',
            'monthly_rate'
        ].includes(field.name);

        field.classList.remove(
            'cursor-text',
            'cursor-pointer',
            'cursor-not-allowed'
        );

        if (isHidden || isClientId) {
            field.disabled = false;
            return;
        }

        if (isEmployeeId) {
            field.readOnly = true;
            field.disabled = false;

            field.classList.add(
                'cursor-not-allowed'
            );

            field.classList.add('opacity-60');

            return;
        }

        if (isRateField) {
            field.disabled = false;
            field.readOnly = !enabled;

            field.classList.add(
                enabled
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
            );

            field.classList.toggle(
                'opacity-60',
                !enabled
            );

            return;
        }

        if (isFile) {
            field.disabled = !enabled;
            field.classList.remove('opacity-60');

            field.classList.add('opacity-0');

            field.classList.add(
                enabled
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
            );

            return;
        }

        if (isCheckbox || isSelect) {
            field.disabled = !enabled;

            field.classList.add(
                enabled
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
            );

            field.classList.toggle(
                'opacity-60',
                !enabled
            );

            return;
        }

        field.disabled = false;
        field.readOnly = !enabled;

        field.classList.add(
            enabled
                ? 'cursor-text'
                : 'cursor-not-allowed'
        );

        field.classList.toggle(
            'opacity-60',
            !enabled
        );
    });

    if (ctx.dom.clientInput) {
        ctx.dom.clientInput.classList.remove(
            'cursor-text',
            'cursor-pointer',
            'cursor-not-allowed'
        );

        ctx.dom.clientInput.disabled = !enabled;
        ctx.dom.clientInput.readOnly = !enabled;

        ctx.dom.clientInput.classList.toggle(
            'opacity-60',
            !enabled
        );

        ctx.dom.clientInput.classList.add(
            enabled
                ? 'cursor-text'
                : 'cursor-not-allowed'
        );
    }

    ctx.updateRateFieldState();

    if (!enabled) {
        ctx.hideClientDropdown();
    }
}

export function setSearchEnabled(ctx, enabled) {
    if (!ctx.dom.searchInput) {
        return;
    }

    ctx.dom.searchInput.classList.remove(
        'cursor-text',
        'cursor-pointer',
        'cursor-not-allowed'
    );

    ctx.dom.searchInput.disabled = !enabled;

    ctx.dom.searchInput.classList.toggle(
        'opacity-60',
        !enabled
    );

    ctx.dom.searchInput.classList.add(
        enabled
            ? 'cursor-text'
            : 'cursor-not-allowed'
    );

    if (!enabled) {
        ctx.hideSearchResults();
    }
}

export function setMode(ctx, newMode) {
    ctx.state.mode = newMode;

    if (newMode === 'view') {
        ctx.setFieldState(false);
        ctx.setSearchEnabled(true);
    }

    if (newMode === 'edit') {
        ctx.setFieldState(true);
        ctx.setSearchEnabled(false);
    }

    if (newMode === 'add') {
        ctx.setFieldState(true);
        ctx.setSearchEnabled(false);

        const employeeId =
            ctx.getField('emp_id');

        if (employeeId) {
            employeeId.value = '';
            employeeId.readOnly = true;
            employeeId.disabled = false;

            employeeId.classList.remove(
                'cursor-text',
                'cursor-pointer',
                'cursor-not-allowed'
            );

            employeeId.classList.add(
                'cursor-not-allowed'
            );
        }

        if (ctx.dom.rateBasisField) {
            ctx.dom.rateBasisField.value = 'Daily';
        }

        ctx.clearComputedRates();
        ctx.updateRateFieldState();
    }

    ctx.updateButtons();
    ctx.updateNavigationButtons();
}

export function updateButtons(ctx) {
    if (ctx.state.mode === 'view') {
        ctx.dom.employeeAddButton?.classList.remove(
            'hidden'
        );

        ctx.dom.editButton?.classList.remove(
            'hidden'
        );

        ctx.dom.employeeAddButton?.removeAttribute(
            'disabled'
        );

        if (ctx.state.currentEmployeeId) {
            ctx.dom.editButton?.removeAttribute(
                'disabled'
            );

            ctx.dom.editButton?.classList.remove(
                'opacity-50',
                'cursor-not-allowed'
            );

            ctx.dom.editButton?.classList.add(
                'cursor-pointer'
            );
        } else {
            ctx.dom.editButton?.setAttribute(
                'disabled',
                'disabled'
            );

            ctx.dom.editButton?.classList.add(
                'opacity-50',
                'cursor-not-allowed'
            );

            ctx.dom.editButton?.classList.remove(
                'cursor-pointer'
            );
        }

        ctx.dom.saveButton?.classList.add(
            'hidden'
        );

        ctx.dom.cancelButton?.classList.add(
            'hidden'
        );

        return;
    }

    ctx.dom.employeeAddButton?.classList.add(
        'hidden'
    );

    ctx.dom.editButton?.classList.add(
        'hidden'
    );

    ctx.dom.saveButton?.classList.remove(
        'hidden'
    );

    ctx.dom.cancelButton?.classList.remove(
        'hidden'
    );

    if (ctx.dom.cancelButton) {
        ctx.dom.cancelButton.classList.remove(
            'bg-gray-600',
            'hover:bg-gray-700'
        );

        ctx.dom.cancelButton.classList.add(
            'bg-red-600',
            'hover:bg-red-700'
        );
    }
}

export function updateCounter(ctx) {
    if (!ctx.dom.employeeCounter) {
        return;
    }

    if (
        ctx.state.searchItems.length === 0 ||
        ctx.state.currentSearchIndex < 0
    ) {
        ctx.dom.employeeCounter.textContent =
            ctx.state.searchItems.length > 0
                ? `0 of ${ctx.state.searchItems.length}`
                : '0 of 0';

        ctx.updateNavigationButtons();

        return;
    }

    ctx.dom.employeeCounter.textContent =
        `${ctx.state.currentSearchIndex + 1} of ${ctx.state.searchItems.length}`;

    ctx.updateNavigationButtons();
}

export function updateNavigationButtons(ctx) {
    const hasSelection =
        ctx.state.mode === 'view' &&
        ctx.state.currentSearchIndex >= 0 &&
        ctx.state.searchItems.length > 0;

    const canPrevious =
        hasSelection &&
        ctx.state.currentSearchIndex > 0;

    const canNext =
        hasSelection &&
        ctx.state.currentSearchIndex <
            ctx.state.searchItems.length - 1;

    if (ctx.dom.previousButton) {
        ctx.dom.previousButton.disabled =
            !canPrevious;

        ctx.dom.previousButton.classList.toggle(
            'opacity-50',
            !canPrevious
        );

        ctx.dom.previousButton.classList.toggle(
            'cursor-not-allowed',
            !canPrevious
        );

        ctx.dom.previousButton.classList.toggle(
            'cursor-pointer',
            canPrevious
        );
    }

    if (ctx.dom.nextButton) {
        ctx.dom.nextButton.disabled =
            !canNext;

        ctx.dom.nextButton.classList.toggle(
            'opacity-50',
            !canNext
        );

        ctx.dom.nextButton.classList.toggle(
            'cursor-not-allowed',
            !canNext
        );

        ctx.dom.nextButton.classList.toggle(
            'cursor-pointer',
            canNext
        );
    }
}

export function saveOriginalData(ctx) {
    ctx.state.originalData =
        ctx.getFormDataObject();

    ctx.state.originalClientDisplayName =
        ctx.state.currentClientDisplayName;

    ctx.state.originalClientPayrollConfig =
        ctx.state.currentClientPayrollConfig
            ? {
                ...ctx.state.currentClientPayrollConfig
            }
            : null;
}

export function restoreOriginalData(ctx) {
    Object.entries(
        ctx.state.originalData
    ).forEach(([key, value]) => {
        ctx.setFieldValue(key, value);
    });

    ctx.state.currentClientPayrollConfig =
        ctx.state.originalClientPayrollConfig
            ? {
                ...ctx.state.originalClientPayrollConfig
            }
            : null;

    ctx.updateClientDisplay(
        ctx.state.originalClientDisplayName
    );

    if (ctx.dom.clientIdDisplay) {
        ctx.dom.clientIdDisplay.value =
            ctx.getField('client_id')?.value || '';
    }

    ctx.updateRateFieldState();
}

export function hasChanges(ctx) {
    const currentData =
        ctx.getFormDataObject();

    return Object.keys(
        ctx.state.originalData
    ).some(key => {
        return String(
            ctx.state.originalData[key] ?? ''
        ) !== String(
            currentData[key] ?? ''
        );
    });
}

export async function confirmCancel(ctx) {
    if (!ctx.hasChanges()) {
        return true;
    }

    const result = await Swal.fire({
        icon: 'question',
        title: 'Discard Changes?',
        text: 'Any unsaved changes will be lost.',
        showCancelButton: true,
        confirmButtonText: 'Yes, Discard',
        cancelButtonText: 'Continue Editing',
        confirmButtonColor: '#dc2626'
    });

    return result.isConfirmed;
}