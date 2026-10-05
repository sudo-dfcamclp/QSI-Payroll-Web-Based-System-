import Swal from 'sweetalert2';
import { escapeHtml, swalConfig } from './helpers.js';

export function closeActionMenus(ctx) {
    ctx.closeSortMenu();

    ctx.panel
        .querySelectorAll('.client-action-menu')
        .forEach(menu => menu.remove());

    ctx.panel
        .querySelectorAll('.client-action-button')
        .forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });
}

export function createActionMenu(
    ctx,
    button,
    clientId,
    clientName
) {
    closeActionMenus(ctx);

    const menu = document.createElement('div');

    menu.className =
        'client-action-menu absolute right-3 top-full mt-1 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg';

    menu.innerHTML = `
        <button
            type="button"
            class="client-archive-action flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
            data-client-id="${escapeHtml(clientId)}">

            <i class="fa-solid fa-box-archive text-xs"></i>

            <span>Archive</span>
        </button>
    `;

    button.parentElement?.appendChild(menu);

    const archiveButton =
        menu.querySelector('.client-archive-action');

    archiveButton?.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();

        closeActionMenus(ctx);

        await archiveClient(
            ctx,
            clientId,
            clientName
        );
    });
}

export async function archiveClient(
    ctx,
    clientId,
    clientName
) {
    const result = await Swal.fire(
        swalConfig({
            icon: 'warning',
            title: 'Archive Client?',
            text: `Are you sure you want to archive ${clientName}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Archive',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d97706',
            focusCancel: true
        })
    );

    if (!result.isConfirmed) return;

    const csrfToken =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.getAttribute('content');

    try {
        const response = await fetch(
            `/payroll/public/api/client-master/${encodeURIComponent(clientId)}`,
            {
                method: 'DELETE',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },

                credentials: 'same-origin'
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                'Unable to archive client.'
            );
        }

        await Swal.fire(
            swalConfig({
                icon: 'success',
                title: 'Client Archived',
                text: `${clientName} has been archived successfully.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0a5d3c'
            })
        );

        // Refresh the active client list.
        // The archived client will disappear because
        // the list is currently filtered by status=active.
        await ctx.loadClientList(
            ctx.dom.clientListSearch?.value || '',
            1
        );

    } catch (error) {
        console.error(
            'Archive client error:',
            error
        );

        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Archive Failed',
                text:
                    error.message ||
                    'An error occurred while archiving the client.'
            })
        );
    }
}

