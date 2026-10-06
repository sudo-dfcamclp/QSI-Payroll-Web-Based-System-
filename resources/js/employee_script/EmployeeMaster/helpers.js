export function escapeHtml(ctx, value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function getEmployeeFullName(ctx, employee) {
    const firstName = [
        employee.first_name,
        employee.middle_name,
        employee.suffix_name
    ]
        .filter(Boolean)
        .join(' ');

    return [
        employee.last_name,
        firstName
    ]
        .filter(Boolean)
        .join(', ');
}

export function getEmployeeDisplayName(ctx, employee) {
    return [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
        employee.suffix_name
    ]
        .filter(Boolean)
        .join(' ');
}