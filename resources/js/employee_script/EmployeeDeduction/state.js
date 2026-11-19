
import { getModuleState } from '../../components/localstorage.js';

// Kunin ang previously saved Employee Deduction state
const savedState = getModuleState('employeeDeduction');

export const state = {
    // Client pagination
    clientPage: savedState.clientPage ?? 1,
    clientLastPage: 1,
    clientTotal: 0,
    clientSearch: savedState.clientSearch ?? '',
    clientSearchTimeout: null,

    // Employee pagination
    employeePage: savedState.employeePage ?? 1,
    employeeLastPage: 1,
    employeeTotal: 0,
    employeeSearch: savedState.employeeSearch ?? '',
    employeeSearchTimeout: null,

    // Selected records
    selectedClientId: savedState.selectedClientId ?? null,
    selectedEmployeeId: savedState.selectedEmployeeId ?? null,

    // Current view
    currentView: savedState.currentView ?? 'client',

    // Deduction sorting
    deductionSort: savedState.deductionSort ?? 'start_date',
    deductionSortDirection: savedState.deductionSortDirection ?? 'desc',
    deductionSortId: savedState.deductionSortId ?? null,

    // Fresh data from API; do not restore from LocalStorage
    currentDeductions: [],
};
