export function getClientName(ctx, employee) {
    return employee?.client_name ||
        employee?.client?.client_name ||
        '';
}

export function updateClientDisplay(ctx, clientName) {
    ctx.state.currentClientDisplayName =
        clientName || '';

    if (ctx.dom.clientInput) {
        ctx.dom.clientInput.value =
            clientName || '';
    }
}

export function clearClient(ctx) {
    const clientField =
        ctx.getField('client_id');

    if (clientField) {
        clientField.value = '';
        clientField.disabled = false;
    }

    if (ctx.dom.clientInput) {
        ctx.dom.clientInput.value = '';
    }

    if (ctx.dom.clientIdDisplay) {
        ctx.dom.clientIdDisplay.value = '';
    }

    ctx.state.currentClientDisplayName = '';
    ctx.state.currentClientPayrollConfig = null;

    ctx.hideClientDropdown();

    if (ctx.dom.clientList) {
        ctx.dom.clientList.innerHTML = '';
    }

    ctx.clearComputedRates();
}

export function populateClient(ctx, employee) {
    const clientField =
        ctx.getField('client_id');

    const clientName =
        ctx.getClientName(employee);

    const clientId =
        employee?.client_id ?? '';

    if (clientField) {
        clientField.value = clientId;
        clientField.disabled = false;
    }

    ctx.updateClientDisplay(clientName);

    if (ctx.dom.clientIdDisplay) {
        ctx.dom.clientIdDisplay.value =
            clientId;
    }

    ctx.state.currentClientPayrollConfig =
        employee?.payroll_config || null;
}

export function renderClientResults(ctx, clients) {
    if (!ctx.dom.clientList) {
        return;
    }

    if (!clients.length) {
        ctx.dom.clientList.innerHTML = `
            <div class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                No companies found.
            </div>
        `;

        return;
    }

    ctx.dom.clientList.innerHTML =
        clients.map(client => {
            const config =
                client.payroll_config || {};

            return `
                <button
                    type="button"
                    data-client-id="${ctx.escapeHtml(client.client_id)}"
                    data-client-name="${ctx.escapeHtml(client.client_name)}"
                    data-hours-per-day="${ctx.escapeHtml(config.hours_per_day ?? '')}"
                    data-working-days-per-month="${ctx.escapeHtml(config.working_days_per_month ?? '')}"
                    data-working-days-per-year="${ctx.escapeHtml(config.working_days_per_year ?? '')}"
                    class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">

                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 shrink-0 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                            <i class="fa-solid fa-building text-teal-600 dark:text-teal-400 text-sm"></i>
                        </div>

                        <div class="min-w-0">
                            <div class="text-sm font-medium text-gray-800 dark:text-white truncate">
                                ${ctx.escapeHtml(client.client_name)}
                            </div>

                            <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                Client ID: ${ctx.escapeHtml(client.client_id)}
                            </div>
                        </div>
                    </div>
                </button>
            `;
        }).join('');

    ctx.dom.clientList
        .querySelectorAll('[data-client-id]')
        .forEach(button => {
            button.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    ctx.selectClient(
                        button.dataset.clientId,
                        button.dataset.clientName,
                        {
                            hours_per_day:
                                button.dataset.hoursPerDay,

                            working_days_per_month:
                                button.dataset.workingDaysPerMonth,

                            working_days_per_year:
                                button.dataset.workingDaysPerYear
                        }
                    );
                }
            );
        });
}

export async function loadClients(ctx, query = '') {
    if (!ctx.dom.clientList) {
        return;
    }

    try {
        const trimmedQuery =
            query.trim();

        const url =
            trimmedQuery
                ? `${ctx.api.clients}?q=${encodeURIComponent(trimmedQuery)}`
                : ctx.api.clients;

        ctx.dom.clientList.innerHTML = `
            <div class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Loading companies...
            </div>
        `;

        const response = await fetch(
            url,
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

        if (!response.ok) {
            throw new Error(
                result.message ||
                'Unable to load companies.'
            );
        }

        const clients =
            Array.isArray(result.data)
                ? result.data
                : [];

        ctx.renderClientResults(clients);
    } catch (error) {
        console.error(
            'Failed to load clients:',
            error
        );

        ctx.dom.clientList.innerHTML = `
            <div class="px-4 py-4 text-sm text-center text-red-500 dark:text-red-400">
                Unable to load companies.
            </div>
        `;
    }
}

export function showClientDropdown(ctx) {
    if (
        !ctx.dom.clientDropdown ||
        !ctx.dom.clientInput ||
        ctx.dom.clientInput.disabled
    ) {
        return;
    }

    ctx.dom.clientDropdown.classList.remove(
        'hidden'
    );

    ctx.dom.clientIcon?.classList.add(
        'rotate-180'
    );
}

export function hideClientDropdown(ctx) {
    if (!ctx.dom.clientDropdown) {
        return;
    }

    ctx.dom.clientDropdown.classList.add(
        'hidden'
    );

    ctx.dom.clientIcon?.classList.remove(
        'rotate-180'
    );
}

export function selectClient(
    ctx,
    clientId,
    clientName,
    payrollConfig = null
) {
    const clientField =
        ctx.getField('client_id');

    if (
        !clientField ||
        !ctx.dom.clientInput
    ) {
        return;
    }

    clientField.value =
        clientId || '';

    clientField.disabled = false;

    ctx.dom.clientInput.value =
        clientName || '';

    ctx.state.currentClientDisplayName =
        clientName || '';

    ctx.state.currentClientPayrollConfig =
        payrollConfig;

    if (ctx.dom.clientIdDisplay) {
        ctx.dom.clientIdDisplay.value =
            clientId || '';
    }

    ctx.clearComputedRates();
    ctx.updateRateFieldState();
    ctx.hideClientDropdown();
}

export function handleClientSearchInput(ctx) {
    if (
        ctx.state.mode === 'view' ||
        ctx.dom.clientInput?.disabled
    ) {
        return;
    }

    const clientField =
        ctx.getField('client_id');

    if (clientField) {
        clientField.value = '';
    }

    if (ctx.dom.clientIdDisplay) {
        ctx.dom.clientIdDisplay.value = '';
    }

    ctx.state.currentClientDisplayName = '';
    ctx.state.currentClientPayrollConfig = null;

    clearTimeout(
        ctx.state.clientSearchTimer
    );

    ctx.showClientDropdown();

    ctx.state.clientSearchTimer =
        setTimeout(() => {
            ctx.loadClients(
                ctx.dom.clientInput?.value || ''
            );
        }, 250);
}

export async function handleClientInputFocus(ctx) {
    if (
        ctx.state.mode === 'view' ||
        ctx.dom.clientInput?.disabled
    ) {
        return;
    }

    ctx.showClientDropdown();

    await ctx.loadClients(
        ctx.dom.clientInput?.value || ''
    );
}

export function handleClientInputKeydown(
    ctx,
    event
) {
    if (event.key === 'Escape') {
        event.preventDefault();
        ctx.hideClientDropdown();
    }
}