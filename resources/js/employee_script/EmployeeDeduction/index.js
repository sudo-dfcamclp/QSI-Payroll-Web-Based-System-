
import { initList } from './list.js';
import { initAddDeduction } from './add-deduction.js';

export async function init(panel) {
    if (!panel) {
        console.error('Employee Deduction panel not found.');
        return;
    }

    initList(panel);
    initAddDeduction(panel);
}
