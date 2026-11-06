// localstorage.js
const DEFAULT_STORAGE_KEY = 'payroll_transaction_state';

export function savePayrollState(data = {}, key = DEFAULT_STORAGE_KEY) {
    try {
        // Kung walang key na ipinasa, ibig sabihin navigation state ang ise-save (galing sa index.js)
        // Kung may key (tulad ng payroll_form_1_2), yung form data ang ise-save
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
            localStorage.clear(); // Danger: clears all
        }
    } catch (error) {
        console.error(`Failed to clear payroll state for key ${key}:`, error);
    }
}