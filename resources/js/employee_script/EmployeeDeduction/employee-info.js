import { setText } from './helpers.js';

export function renderEmployeeInfo(panel, data) {
    if (!data) return;

    setText(panel, 'displayEmpName', data.full_name ?? '—');
    setText(panel, 'displayEmpStatus', data.employment_status ?? '—');
    setText(panel, 'displayMonthsHired', data.month_no ?? '—');
    setText(panel, 'displayPaymentBasis', data.rate_basis ?? '—');
    setText(panel, 'displayMonthlyRate', data.monthly_rate ?? '—');
    setText(panel, 'displayDailyRate', data.daily_rate ?? '—');
    setText(panel, 'displayHourlyRate', data.hourly_rate ?? '—');
}

export function resetEmployeeInfo(panel) {
    [
        'displayEmpName',
        'displayEmpStatus',
        'displayMonthsHired',
        'displayPaymentBasis',
        'displayMonthlyRate',
        'displayDailyRate',
        'displayHourlyRate',
    ].forEach(id => {
        setText(panel, id, '—');
    });
}
