import Swal from 'sweetalert2';

export async function saveEmployee(ctx) {
    const firstName =
        ctx.getField('first_name')
            ?.value.trim();

    const lastName =
        ctx.getField('last_name')
            ?.value.trim();

    if (!firstName || !lastName) {
        await Swal.fire({
            icon: 'warning',
            title: 'Required Fields',
            text: 'First Name and Last Name are required.',
            confirmButtonColor: '#0a5d3c'
        });

        return;
    }

    const isNew =
        ctx.state.mode === 'add';

    if (
        !ctx.getField('client_id')
            ?.value
    ) {
        await Swal.fire({
            icon: 'warning',
            title: 'Company Required',
            text: 'Please assign a company with payroll configuration before entering a rate.',
            confirmButtonColor: '#0a5d3c'
        });

        return;
    }

    if (
        !ctx.dom.dailyRateField?.value
    ) {
        await Swal.fire({
            icon: 'warning',
            title: 'Daily Rate Required',
            text: 'Please enter the Daily Rate.',
            confirmButtonColor: '#0a5d3c'
        });

        ctx.dom.dailyRateField?.focus();

        return;
    }

    if (!ctx.calculateRates(true)) {
        return;
    }

    const csrfToken =
        document.querySelector(
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

    const confirmation =
        await Swal.fire({
            icon: 'question',
            title: isNew
                ? 'Add Employee?'
                : 'Save Changes?',
            text: isNew
                ? 'The new employee record will be created.'
                : 'The employee information will be updated.',
            showCancelButton: true,
            confirmButtonText: isNew
                ? 'Add Employee'
                : 'Save Changes',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            confirmButtonColor: '#0a5d3c'
        });

    if (!confirmation.isConfirmed) {
        return;
    }

    try {
        const employeeId =
            ctx.state.currentEmployeeId;

        const url = isNew
            ? ctx.api.store
            : ctx.api.update(employeeId);

        const formData =
            ctx.buildFormData();

        /*
         * Explicitly add the selected rate basis.
         *
         * This prevents rate_basis from being lost if
         * buildFormData() does not pick up the dropdown
         * because of the current form/DOM structure.
         */
        const rateBasis =
            ctx.dom.rateBasisField?.value || '';

        formData.set(
            'rate_basis',
            rateBasis
        );

        if (!rateBasis) {
            await Swal.fire({
                icon: 'warning',
                title: 'Rate Basis Required',
                text: 'Please select a Rate Basis.',
                confirmButtonColor: '#0a5d3c'
            });

            ctx.dom.rateBasisField?.focus();

            return;
        }

        if (!isNew) {
            formData.append(
                '_method',
                'PUT'
            );
        }

        console.log(
            'Rate basis selected:',
            rateBasis
        );

        console.log(
            'Rate basis sent:',
            formData.get('rate_basis')
        );

        const response =
            await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN':
                            csrfToken,
                        'X-Requested-With':
                            'XMLHttpRequest',
                        'Accept':
                            'application/json'
                    },
                    credentials:
                        'same-origin',
                    body: formData
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            if (
                response.status === 422 &&
                result.errors
            ) {
                const messages =
                    Object.values(
                        result.errors
                    )
                        .flat()
                        .join('\n');

                throw new Error(
                    messages
                );
            }

            throw new Error(
                result.message ||
                'Unable to save employee.'
            );
        }

        const employee =
            result.data ||
            result.employee ||
            result;

        ctx.populateForm(employee);
        ctx.setMode('view');
        ctx.saveOriginalData();

        if (isNew) {
            ctx.state.searchItems = [
                employee
            ];

            ctx.state.currentSearchIndex = 0;
        } else {
            const existingIndex =
                ctx.state.searchItems.findIndex(
                    item =>
                        String(
                            item.emp_id
                        ) ===
                        String(
                            employee.emp_id
                        )
                );

            if (
                existingIndex >= 0
            ) {
                ctx.state.searchItems[
                    existingIndex
                ] = employee;

                ctx.state.currentSearchIndex =
                    existingIndex;
            }
        }

        if (ctx.dom.searchInput) {
            ctx.dom.searchInput.value =
                ctx.getEmployeeDisplayName(
                    employee
                );
        }

        ctx.hideSearchResults();
        ctx.updateCounter();

        await Swal.fire({
            icon: 'success',
            title: isNew
                ? 'Employee Added'
                : 'Employee Updated',
            text: isNew
                ? 'Employee record added successfully.'
                : 'Employee record updated successfully.',
            timer: 1800,
            showConfirmButton: false
        });

        ctx.showListingView();

        const listSearch =
            ctx.dom.employeeListSearch?.value ||
            '';

        await ctx.loadEmployeeList(
            listSearch,
            ctx.state.employeeListPage
        );
    } catch (error) {
        console.error(
            'Employee save error:',
            error
        );

        await Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text:
                error.message ||
                'Unable to save employee information.'
        });
    }
}


export async function startAdd(ctx) {
    ctx.clearForm();

    ctx.state.searchItems = [];
    ctx.state.currentSearchIndex = -1;
    ctx.state.highlightedIndex = -1;

    if (ctx.dom.searchInput) {
        ctx.dom.searchInput.value = '';
    }

    ctx.hideSearchResults();

    ctx.showFormView();
    ctx.setMode('add');

    ctx.getField('first_name')
        ?.focus({
            preventScroll: true
        });
}


export async function startEdit(ctx) {
    if (!ctx.state.currentEmployeeId) {
        return;
    }

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

    ctx.setMode('edit');
}


export async function cancelAction(ctx) {
    const confirmed =
        await ctx.confirmCancel();

    if (!confirmed) {
        return;
    }

    if (
        ctx.state.mode === 'edit' &&
        ctx.state.currentEmployeeId
    ) {
        ctx.restoreOriginalData();

        if (ctx.dom.profileInput) {
            ctx.dom.profileInput.value = '';
        }

        ctx.setMode('view');
        ctx.saveOriginalData();

        return;
    }

    ctx.clearForm();

    ctx.state.searchItems = [];
    ctx.state.currentSearchIndex = -1;
    ctx.state.highlightedIndex = -1;

    if (ctx.dom.searchInput) {
        ctx.dom.searchInput.value = '';
    }

    ctx.hideSearchResults();

    ctx.setMode('view');
    ctx.saveOriginalData();
}


export async function handleBackToList(ctx, event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (
        ctx.state.mode === 'edit' ||
        ctx.state.mode === 'add'
    ) {
        const confirmed =
            await ctx.confirmCancel();

        if (!confirmed) {
            return;
        }
    }

    ctx.clearForm();

    ctx.state.searchItems = [];
    ctx.state.currentSearchIndex = -1;
    ctx.state.highlightedIndex = -1;

    if (ctx.dom.searchInput) {
        ctx.dom.searchInput.value = '';
    }

    ctx.hideSearchResults();

    ctx.setMode('view');
    ctx.saveOriginalData();

    ctx.showListingView();


    ctx.dom.form.addEventListener(
        'submit',
        event => {
            event.preventDefault();
        }
    );

    ctx.dom.searchInput?.setAttribute(
        'role',
        'combobox'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-autocomplete',
        'list'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-expanded',
        'false'
    );

    ctx.dom.searchInput?.setAttribute(
        'aria-controls',
        'employeeSearchList'
    );

    ctx.dom.searchList?.setAttribute(
        'role',
        'listbox'
    );

    ctx.dom.employeeListSearch?.addEventListener(
        'input',
        handleEmployeeListSearch
    );

    ctx.dom.employeeListSearch?.addEventListener(
        'keydown',
        handleListSearchKeydown
    );

    ctx.dom.employeeSortButton?.addEventListener(
        'click',
        event => {
            event.preventDefault();
            event.stopPropagation();

            const existingMenu =
                panel.querySelector(
                    '#employeeSortMenu'
                );

            if (existingMenu) {
                ctx.closeEmployeeSortMenu();
                return;
            }

            ctx.createEmployeeSortMenu();
        }
    );

    ctx.dom.searchInput?.addEventListener(
        'input',
        handleSearchInput
    );

    ctx.dom.searchInput?.addEventListener(
        'focus',
        handleSearchFocus
    );

    ctx.dom.searchInput?.addEventListener(
        'keydown',
        handleSearchKeydown
    );

    ctx.dom.clientInput?.addEventListener(
        'input',
        handleClientSearchInput
    );

    ctx.dom.clientInput?.addEventListener(
        'focus',
        handleClientInputFocus
    );

    ctx.dom.clientInput?.addEventListener(
        'keydown',
        handleClientInputKeydown
    );

    ctx.dom.rateBasisField?.addEventListener(
        'change',
        handleRateBasisChange
    );

    ctx.dom.dailyRateField?.addEventListener(
        'blur',
        handleDailyRateBlur
    );

    document.addEventListener(
        'click',
        event => {
            if (!panel.contains(event.target)) {
                return;
            }

            if (
                ctx.dom.searchResults &&
                !ctx.dom.searchResults.contains(event.target) &&
                event.target !== ctx.dom.searchInput
            ) {
                ctx.hideSearchResults();
            }

            if (
                ctx.dom.clientDropdown &&
                !ctx.dom.clientDropdown.contains(event.target) &&
                event.target !== ctx.dom.clientInput
            ) {
                ctx.hideClientDropdown();
            }

            if (
                ctx.dom.employeeListSearchResults &&
                !ctx.dom.employeeListSearchResults.contains(event.target) &&
                event.target !== ctx.dom.employeeListSearch
            ) {
                ctx.dom.employeeListSearchResults.classList.add(
                    'hidden'
                );
            }

            const employeeSortMenu =
                event.target.closest(
                    '#employeeSortMenu'
                );

            const employeeSortButtonTarget =
                event.target.closest(
                    '#ctx.dom.employeeSortButton'
                );

            if (
                !employeeSortMenu &&
                !employeeSortButtonTarget
            ) {
                ctx.closeEmployeeSortMenu();
            }

            const employeeContextMenu =
                event.target.closest(
                    '.employee-context-menu'
                );

            const employeeContextButton =
                event.target.closest(
                    '.employee-context-button'
                );

            if (
                !employeeContextMenu &&
                !employeeContextButton
            ) {
                ctx.dom.employeeList
                    ?.querySelectorAll(
                        '.employee-context-menu'
                    )
                    .forEach(menu => {
                        menu.classList.add(
                            'hidden'
                        );
                    });

                ctx.dom.employeeList
                    ?.querySelectorAll(
                        '.employee-context-button'
                    )
                    .forEach(button => {
                        button.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    });
            }
        }
    );

    ctx.dom.employeeAddButton?.addEventListener(
        'click',
        startAdd
    );

    ctx.dom.employeeBackButton?.addEventListener(
        'click',
        handleBackToList
    );

    ctx.dom.editButton?.addEventListener(
        'click',
        startEdit
    );

    ctx.dom.saveButton?.addEventListener(
        'click',
        saveEmployee
    );

    ctx.dom.cancelButton?.addEventListener(
        'click',
        cancelAction
    );

    ctx.dom.previousButton?.addEventListener(
        'click',
        () => {
            ctx.navigateEmployee(
                'previous'
            );
        }
    );

    ctx.dom.nextButton?.addEventListener(
        'click',
        () => {
            ctx.navigateEmployee(
                'next'
            );
        }
    );

    ctx.dom.employeePreviousPageButton?.addEventListener(
        'click',
        () => {
            if (
                ctx.state.employeeListPage > 1
            ) {
                ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value ||
                    '',
                    ctx.state.employeeListPage - 1
                );
            }
        }
    );

    ctx.dom.employeeNextPageButton?.addEventListener(
        'click',
        () => {
            if (
                ctx.state.employeeListPage <
                ctx.state.employeeListLastPage
            ) {
                ctx.loadEmployeeList(
                    ctx.dom.employeeListSearch?.value ||
                    '',
                    ctx.state.employeeListPage + 1
                );
            }
        }
    );

    ctx.dom.profileInput?.addEventListener(
        'change',
        () => {
            if (
                !ctx.dom.profileInput.files?.length ||
                !ctx.dom.profilePreview
            ) {
                return;
            }

            const file =
                ctx.dom.profileInput.files[0];

            if (
                !file.type.startsWith(
                    'image/'
                )
            ) {
                ctx.dom.profileInput.value = '';

                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid File',
                    text: 'Please select an image file.'
                });

                return;
            }

            const reader =
                new FileReader();

            reader.onload = event => {
                ctx.dom.profilePreview.src =
                    event.target.result;

                ctx.dom.profilePreview.classList.remove(
                    'hidden'
                );
            };

            reader.readAsDataURL(file);
        }
    );


    ctx.clearForm();
    ctx.setMode('view');
    ctx.saveOriginalData();
    ctx.showListingView();

    await ctx.loadEmployeeList('', 1);
}

