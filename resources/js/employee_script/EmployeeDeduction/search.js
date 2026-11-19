
import { state } from './state.js';

import { loadClients } from './clients.js';
import { loadEmployees } from './employees.js';

export function initSearch(panel) {
    const searchInput = panel.querySelector('#searchInput');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        clearTimeout(state.clientSearchTimeout);
        clearTimeout(state.employeeSearchTimeout);

        const value = searchInput.value.trim();

        if (state.selectedClientId) {
            state.employeeSearchTimeout = setTimeout(() => {
                loadEmployees(
                    panel,
                    state.selectedClientId,
                    1,
                    value
                );
            }, 300);
        } else {
            state.clientSearchTimeout = setTimeout(() => {
                loadClients(panel, 1, value);
            }, 300);
        }
    });
}
