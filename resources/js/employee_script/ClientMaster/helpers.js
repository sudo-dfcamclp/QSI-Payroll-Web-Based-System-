export function isDarkMode() {
    return document.documentElement.classList.contains('dark');
}

export function swalConfig(options = {}) {
    return {
        ...options,
        background: isDarkMode() ? '#374151' : '#ffffff',
        color: isDarkMode() ? '#f9fafb' : '#111827',
        customClass: {
            popup: isDarkMode() ? 'dark:bg-gray-700 dark:text-gray-100' : '',
            title: isDarkMode() ? 'dark:text-gray-100' : '',
            htmlContainer: isDarkMode() ? 'dark:text-gray-300' : '',
            confirmButton: 'cursor-pointer',
            cancelButton: 'cursor-pointer'
        }
    };
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function normalizePayrollFrequency(value) {
    const normalized = String(value ?? '').trim().toLowerCase();

    if (
        normalized === 'semi-monthly' ||
        normalized === 'semi monthly' ||
        normalized === 'semi_monthly'
    ) {
        return 'semi_monthly';
    }

    if (normalized === 'weekly') return 'weekly';
    if (normalized === 'monthly') return 'monthly';

    return normalized;
}