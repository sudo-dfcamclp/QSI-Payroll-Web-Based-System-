
// resources/js/employee_script/EmployeeDeduction/config.js

const APP_URL = (
    document
        .querySelector('meta[name="app-url"]')
        ?.getAttribute('content') || ''
).replace(/\/+$/, '');

export const API = {
    // Client list
    clients: `${APP_URL}/api/employee-deduction/clients`,

    // Employees under selected client
    employees: (clientId) =>
        `${APP_URL}/api/employee-deduction/clients/${encodeURIComponent(clientId)}/employees`,

    // Employee information
    employee: (empId) =>
        `${APP_URL}/api/employee-deduction/employees/${encodeURIComponent(empId)}`,

    // Active deduction types
    types: `${APP_URL}/api/employee-deduction/types`,

    // Employee deductions list
    deductions: `${APP_URL}/api/employee-deduction/deductions`,

    // Create deduction
    store: `${APP_URL}/api/employee-deduction/deductions`,

    // Update deduction
    update: (id) =>
        `${APP_URL}/api/employee-deduction/deductions/${encodeURIComponent(id)}`,

    // Delete deduction
    destroy: (id) =>
        `${APP_URL}/api/employee-deduction/deductions/${encodeURIComponent(id)}`,

    // Deduction payment history
    payments: `${APP_URL}/api/employee-deduction/payments`,
};
