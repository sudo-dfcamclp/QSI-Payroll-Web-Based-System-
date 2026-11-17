import { initList } from './list.js';

export function init(panel) {
    if (!panel) {
        console.error('[EmployeeDeduction] init() called without panel element.');
        return;
    }

    initList(panel);
}