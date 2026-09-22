const payrollCutoffs = {
    "1": [
        { value: "2026-09-01_2026-09-15", label: "September 1–15, 2026", start: "2026-09-01", end: "2026-09-15" },
        { value: "2026-09-16_2026-09-30", label: "September 16–30, 2026", start: "2026-09-16", end: "2026-09-30" }
    ],
    "2": [
        { value: "2026-09-01_2026-09-15", label: "September 1–15, 2026", start: "2026-09-01", end: "2026-09-15" },
        { value: "2026-09-16_2026-09-30", label: "September 16–30, 2026", start: "2026-09-16", end: "2026-09-30" }
    ]
};

function init(panel) {
    const module = panel.querySelector('#employeePayrollModule');
    if (!module || module.dataset.initialized === 'true') return;

    const selection = module.querySelector('#payrollSelection');
    const normalSelection = module.querySelector('#payrollNormalSelection');
    const content = module.querySelector('#payrollContent');
    const clientSelect = module.querySelector('#payrollClientSelection');
    const cutoffSelect = module.querySelector('#payrollCutoffSelection');
    const continueButton = module.querySelector('#payrollContinueButton');
    const changeButton = module.querySelector('#payrollChangeSelectionButton');
    const errorMessage = module.querySelector('#payrollSelectionError');
    const clientDisplay = module.querySelector('#payrollClientDisplay');
    const startDate = module.querySelector('#payrollStartDate');
    const endDate = module.querySelector('#payrollEndDate');
    const addCutoffButton = module.querySelector('#payrollAddCutoffButton');
    const newCutoffForm = module.querySelector('#payrollNewCutoffForm');
    const newCutoffClient = module.querySelector('#payrollNewCutoffClient');
    const newCutoffStart = module.querySelector('#payrollNewCutoffStart');
    const newCutoffEnd = module.querySelector('#payrollNewCutoffEnd');
    const cancelCutoffButton = module.querySelector('#payrollCancelCutoffButton');
    const saveCutoffButton = module.querySelector('#payrollSaveCutoffButton');
    const newCutoffError = module.querySelector('#payrollNewCutoffError');

    if (!selection || !normalSelection || !content || !clientSelect || !cutoffSelect || !continueButton || !addCutoffButton || !newCutoffForm || !newCutoffClient || !newCutoffStart || !newCutoffEnd || !cancelCutoffButton || !saveCutoffButton) return;

    module.dataset.initialized = 'true';

    function clearError() {
        if (!errorMessage) return;
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }

    function showError(message) {
        if (!errorMessage) return;
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function clearCutoffError() {
        if (!newCutoffError) return;
        newCutoffError.textContent = '';
        newCutoffError.classList.add('hidden');
    }

    function showCutoffError(message) {
        if (!newCutoffError) return;
        newCutoffError.textContent = message;
        newCutoffError.classList.remove('hidden');
    }

    function formatCutoffLabel(start, end) {
        const startDateValue = new Date(`${start}T00:00:00`);
        const endDateValue = new Date(`${end}T00:00:00`);
        const sameMonth = startDateValue.getMonth() === endDateValue.getMonth() && startDateValue.getFullYear() === endDateValue.getFullYear();

        if (sameMonth) {
            const month = startDateValue.toLocaleDateString('en-US', { month: 'long' });
            return `${month} ${startDateValue.getDate()}–${endDateValue.getDate()}, ${endDateValue.getFullYear()}`;
        }

        return `${startDateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – ${endDateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }

    function populateCutoffs(clientId, selectedValue = '') {
        cutoffSelect.innerHTML = '<option value="">Select Payroll Cutoff</option>';
        cutoffSelect.disabled = !clientId;

        if (!clientId || !payrollCutoffs[clientId]) return;

        payrollCutoffs[clientId].forEach(cutoff => {
            const option = document.createElement('option');
            option.value = cutoff.value;
            option.textContent = cutoff.label;
            cutoffSelect.appendChild(option);
        });

        cutoffSelect.value = selectedValue;
    }

    function openNewCutoffForm() {
        clearError();
        clearCutoffError();
        newCutoffClient.value = clientSelect.value || '';
        newCutoffStart.value = '';
        newCutoffEnd.value = '';
        normalSelection.classList.add('hidden');
        newCutoffForm.classList.remove('hidden');
        newCutoffClient.focus();
    }

    function closeNewCutoffForm() {
        newCutoffForm.classList.add('hidden');
        normalSelection.classList.remove('hidden');
        newCutoffStart.value = '';
        newCutoffEnd.value = '';
        clearCutoffError();
    }

    function saveNewCutoff() {
        clearCutoffError();

        const clientId = newCutoffClient.value;
        const start = newCutoffStart.value;
        const end = newCutoffEnd.value;

        if (!clientId) {
            showCutoffError('Please select a client.');
            return;
        }

        if (!start || !end) {
            showCutoffError('Please select both Payroll Period From and Payroll Period To.');
            return;
        }

        if (start > end) {
            showCutoffError('Payroll Period From cannot be later than Payroll Period To.');
            return;
        }

        if (!payrollCutoffs[clientId]) {
            payrollCutoffs[clientId] = [];
        }

        const existingCutoff = payrollCutoffs[clientId].find(cutoff => cutoff.start === start && cutoff.end === end);

        if (existingCutoff) {
            showCutoffError('This payroll cutoff already exists for the selected client.');
            return;
        }

        const newCutoff = {
            value: `${start}_${end}`,
            label: formatCutoffLabel(start, end),
            start,
            end
        };

        payrollCutoffs[clientId].push(newCutoff);

        clientSelect.value = clientId;
        populateCutoffs(clientId, newCutoff.value);
        closeNewCutoffForm();
        clearError();
    }

    function showPayroll() {
        selection.classList.add('opacity-0', '-translate-y-4');
        selection.classList.remove('opacity-100', 'translate-y-0');

        window.setTimeout(() => {
            selection.classList.add('hidden');
            content.classList.remove('hidden');

            requestAnimationFrame(() => {
                content.classList.remove('opacity-0', 'translate-y-4');
                content.classList.add('opacity-100', 'translate-y-0');
            });
        }, 200);
    }

    function showSelection() {
        content.classList.add('opacity-0', 'translate-y-4');
        content.classList.remove('opacity-100', 'translate-y-0');

        window.setTimeout(() => {
            content.classList.add('hidden');
            selection.classList.remove('hidden');

            requestAnimationFrame(() => {
                selection.classList.remove('opacity-0', '-translate-y-4');
                selection.classList.add('opacity-100', 'translate-y-0');
            });
        }, 200);
    }

    clientSelect.addEventListener('change', () => {
        clearError();
        populateCutoffs(clientSelect.value);
    });

    addCutoffButton.addEventListener('click', openNewCutoffForm);
    cancelCutoffButton.addEventListener('click', closeNewCutoffForm);
    saveCutoffButton.addEventListener('click', saveNewCutoff);

    continueButton.addEventListener('click', () => {
        clearError();

        const clientId = clientSelect.value;
        const cutoffValue = cutoffSelect.value;

        if (!clientId) {
            showError('Please select a client.');
            return;
        }

        if (!cutoffValue) {
            showError('Please select a payroll cutoff.');
            return;
        }

        const selectedCutoff = (payrollCutoffs[clientId] || []).find(cutoff => cutoff.value === cutoffValue);

        if (!selectedCutoff) {
            showError('The selected payroll cutoff is invalid.');
            return;
        }

        if (clientDisplay) clientDisplay.value = clientId;
        if (startDate) startDate.value = selectedCutoff.start;
        if (endDate) endDate.value = selectedCutoff.end;

        showPayroll();
    });

    if (changeButton) {
        changeButton.addEventListener('click', showSelection);
    }

    populateCutoffs(clientSelect.value);
}

export { init };