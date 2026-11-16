const APP_URL = document
    .querySelector('meta[name="app-url"]')
    ?.getAttribute('content')
    ?.replace(/\/$/, '') || '';

export const API = {
    clients: `${APP_URL}/api/employee-payroll/clients`,
    cutoffs: `${APP_URL}/api/employee-payroll/cutoffs`
};