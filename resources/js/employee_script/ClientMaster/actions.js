import Swal from 'sweetalert2';
import { state } from './state.js';
import { escapeHtml, swalConfig } from './helpers.js';

export function closeActionMenus(ctx) {
    ctx.closeSortMenu();

    ctx.panel
        .querySelectorAll('.client-action-menu')
        .forEach(menu => menu.remove());

    ctx.panel
        .querySelectorAll('.client-action-button')
        .forEach(button => {
            button.setAttribute(
                'aria-expanded',
                'false'
            );
        });
}

export function createActionMenu(
    ctx,
    button,
    clientId,
    clientName
) {
    closeActionMenus(ctx);

    const isArchive =
        state.clientStatus === 'archive';

    const menu = document.createElement('div');

    menu.className =
        'client-action-menu absolute right-3 top-full mt-1 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg';

    /*
     * Active clients:
     *     Archive
     *
     * Archived clients:
     *     Restore
     */
    if (isArchive) {

        menu.innerHTML = `
            <button
                type="button"
                class="client-restore-action flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
                data-client-id="${escapeHtml(clientId)}">

                <i class="fa-solid fa-box-open text-xs"></i>

                <span>Restore</span>
            </button>
        `;

    } else {

        menu.innerHTML = `
            <button
                type="button"
                class="client-archive-action flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
                data-client-id="${escapeHtml(clientId)}">

                <i class="fa-solid fa-box-archive text-xs"></i>

                <span>Archive</span>
            </button>
        `;
    }

    button.parentElement?.appendChild(menu);

    /*
     * Archive action
     */
    const archiveButton =
        menu.querySelector(
            '.client-archive-action'
        );

    archiveButton?.addEventListener(
        'click',
        async event => {

            event.preventDefault();
            event.stopPropagation();

            closeActionMenus(ctx);

            await archiveClient(
                ctx,
                clientId,
                clientName
            );
        }
    );

    /*
     * Restore action
     */
    const restoreButton =
        menu.querySelector(
            '.client-restore-action'
        );

    restoreButton?.addEventListener(
        'click',
        async event => {

            event.preventDefault();
            event.stopPropagation();

            closeActionMenus(ctx);

            await restoreClient(
                ctx,
                clientId,
                clientName
            );
        }
    );
}


/*
 * Archive Client
 */
export async function archiveClient(
    ctx,
    clientId,
    clientName
) {
    const result = await Swal.fire(
        swalConfig({
            icon: 'warning',
            title: 'Archive Client?',
            text:
                `Are you sure you want to archive ${clientName}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Archive',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d97706',
            focusCancel: true
        })
    );

    if (!result.isConfirmed) return;

    const csrfToken =
        document
            .querySelector(
                'meta[name="csrf-token"]'
            )
            ?.getAttribute('content');

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

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                'Unable to archive client.'
            );
        }

        await Swal.fire(
            swalConfig({
                icon: 'success',
                title: 'Client Archived',
                text:
                    `${clientName} has been archived successfully.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0a5d3c'
            })
        );

        /*
         * Reload the current status list.
         *
         * If we are viewing Active clients,
         * the archived client disappears.
         */
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


/*
 * Restore Client
 */
export async function restoreClient(
    ctx,
    clientId,
    clientName
) {
    const result = await Swal.fire(
        swalConfig({
            icon: 'question',
            title: 'Restore Client?',
            text:
                `Are you sure you want to restore ${clientName}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Restore',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0a5d3c',
            focusCancel: true
        })
    );

    if (!result.isConfirmed) return;

    const csrfToken =
        document
            .querySelector(
                'meta[name="csrf-token"]'
            )
            ?.getAttribute('content');

    try {

        /*
         * Same endpoint.
         *
         * The controller toggles:
         *
         * archive -> active
         */
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

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                'Unable to restore client.'
            );
        }

        await Swal.fire(
            swalConfig({
                icon: 'success',
                title: 'Client Restored',
                text:
                    `${clientName} has been restored successfully.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0a5d3c'
            })
        );

        /*
         * Reload the current status list.
         *
         * Since we are viewing Archive,
         * the restored client disappears
         * from the archive list.
         */
        await ctx.loadClientList(
            ctx.dom.clientListSearch?.value || '',
            1
        );

    } catch (error) {

        console.error(
            'Restore client error:',
            error
        );

        await Swal.fire(
            swalConfig({
                icon: 'error',
                title: 'Restore Failed',
                text:
                    error.message ||
                    'An error occurred while restoring the client.'
            })
        );
    }
}

