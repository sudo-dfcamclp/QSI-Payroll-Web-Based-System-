const DEFAULT_STORAGE_KEY = 'payroll_transaction_state';

export function savePayrollState(data = {}, key = DEFAULT_STORAGE_KEY) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save payroll state for key ${key}:`, error);
    }
}

export function loadPayrollState(key = DEFAULT_STORAGE_KEY) {
    try {
        const value = localStorage.getItem(key);
        if (!value) return {};

        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
        console.error(`Failed to load payroll state for key ${key}:`, error);
        return {};
    }
}

export function clearPayrollState(key = DEFAULT_STORAGE_KEY) {
    try {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    } catch (error) {
        console.error(`Failed to clear payroll state for key ${key}:`, error);
    }
}