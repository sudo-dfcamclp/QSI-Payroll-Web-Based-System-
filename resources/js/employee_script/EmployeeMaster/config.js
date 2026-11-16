// sa config.js
const APP_URL = document
    .querySelector('meta[name="app-url"]')
    ?.getAttribute('content')
    ?.replace(/\/$/, '') || '';

export const API = {
    employee: `${APP_URL}/api/employee-master`,
    list: `${APP_URL}/api/employee-master/search`,
    search: `${APP_URL}/api/employee-master/search`, 
    clients: `${APP_URL}/api/employee-master/clients`,
    store: `${APP_URL}/api/employee-master`,
    show: (employeeId) => `${APP_URL}/api/employee-master/${encodeURIComponent(employeeId)}`,
    update: (employeeId) => `${APP_URL}/api/employee-master/${encodeURIComponent(employeeId)}`
};