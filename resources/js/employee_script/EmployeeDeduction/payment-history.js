
import { setHtml } from './helpers.js';

export function resetPaymentDetails(panel) {
    setHtml(
        panel,
        'paymentDetailsTableBody',
        `
            <tr>
                <td colspan="5"
                    class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Select a deduction to view payment history.
                </td>
            </tr>
        `
    );
}
