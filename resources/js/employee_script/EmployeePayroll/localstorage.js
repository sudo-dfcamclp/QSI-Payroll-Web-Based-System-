const STORAGE_KEY = 'payroll_transaction_state';

export function savePayrollState(updates = {}) {
    try {
        const current = loadPayrollState();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                ...current,
                ...updates
            })
        );
    } catch (error) {
        console.error('Failed to save payroll state:', error);
    }
}

export function loadPayrollState() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);

        if (!value) return {};

        const parsed = JSON.parse(value);

        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed
            : {};
    } catch (error) {
        console.error('Failed to load payroll state:', error);
        return {};
    }
}

export function clearPayrollState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear payroll state:', error);
    }
}