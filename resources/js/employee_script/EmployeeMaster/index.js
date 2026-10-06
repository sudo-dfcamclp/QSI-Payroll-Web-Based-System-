import Swal from 'sweetalert2';
import { state } from './state.js';
import { escapeHtml, getEmployeeFullName, getEmployeeDisplayName } from './helpers.js';
import { showListingView, showFormView, updateEmployeeListPagination, renderEmployeeList, loadEmployeeList, handleEmployeeListSearch, loadEmployeeFromList } from './list.js';
import { closeEmployeeSortMenu, createEmployeeSortMenu } from './sort.js';
import { getFields, getField, getFormDataObject, setFieldValue, populateForm, updateEmployeeHeader, clearForm, setFieldState, setSearchEnabled, setMode, updateButtons, updateCounter, updateNavigationButtons, saveOriginalData, restoreOriginalData, hasChanges, confirmCancel } from './form.js';
import { updateHighlightedResult, resetHighlightedResult, hideSearchResults, showSearchResults, renderSearchResults, searchEmployees, handleSearchInput, handleSearchFocus, handleSearchKeydown, handleListSearchKeydown } from './search.js';
import { loadEmployee, navigateEmployee } from './employee.js';
import { getClientName, updateClientDisplay, clearClient, populateClient, renderClientResults, loadClients, showClientDropdown, hideClientDropdown, selectClient, handleClientSearchInput, handleClientInputFocus, handleClientInputKeydown } from './client.js';
import { clearComputedRates, getPayrollConfig, formatRate, updateRateFieldState, calculateRates, handleRateBasisChange, handleDailyRateBlur, buildFormData } from './rates.js';
import { saveEmployee, startAdd, startEdit, cancelAction, handleBackToList } from './actions.js';

export async function init(panel) {
const dom = {
listingView: panel.querySelector('#employeeListingView'),
formView: panel.querySelector('#employeeFormView'),
employeeList: panel.querySelector('#employeeList'),
employeeListSearch: panel.querySelector('#employeeListSearch'),
employeeListSearchResults: panel.querySelector('#employeeListSearchResults'),
employeeListSearchList: panel.querySelector('#employeeListSearchList'),
employeeAddButton: panel.querySelector('#employeeAddButton'),
employeeListPagination: panel.querySelector('#employeeListPagination'),
employeeBackButton: panel.querySelector('#employeeBackButton'),
employeeSortButton: panel.querySelector('#employeeSortButton'),
form: panel.querySelector('#employeeForm'),
clientIdDisplay: panel.querySelector('#employeeClientIdDisplay'),
searchInput: panel.querySelector('#employeeSearch'),
searchResults: panel.querySelector('#employeeSearchResults'),
searchList: panel.querySelector('#employeeSearchList'),
formAddButton: panel.querySelector('#employeeFormAddButton'),
editButton: panel.querySelector('#employeeEditButton'),
saveButton: panel.querySelector('#employeeSaveButton'),
cancelButton: panel.querySelector('#employeeCancelButton'),
previousButton: panel.querySelector('#employeePreviousButton'),
nextButton: panel.querySelector('#employeeNextButton'),
employeeCounter: panel.querySelector('#employeeRecordCounter'),
employeeSubtitle: panel.querySelector('#employeeSubtitle'),
profileInput: panel.querySelector("[name='profile_photo']"),
profilePreview: panel.querySelector('#employeeProfilePreview'),
clientInput: panel.querySelector('#employeeClientInput'),
clientDropdown: panel.querySelector('#employeeClientDropdown'),
clientList: panel.querySelector('#employeeClientList'),
clientIcon: panel.querySelector('#employeeClientIcon'),
rateBasisField: panel.querySelector("[name='rate_basis']"),
hourlyRateField: panel.querySelector("[name='hourly_rate']"),
dailyRateField: panel.querySelector("[name='daily_rate']"),
monthlyRateField: panel.querySelector("[name='monthly_rate']"),
};


if (!dom.form) {
    console.error('Employee Master form was not found.');
    return;
}

const api = {
    list: '/payroll/public/api/employee-master/search',
    search: '/payroll/public/api/employee-master/search',
    clients: '/payroll/public/api/employee-master/clients',
    store: '/payroll/public/api/employee-master',
    show: empId => `/payroll/public/api/employee-master/${empId}`,
    update: empId => `/payroll/public/api/employee-master/${empId}`
};

const ctx = { panel, dom, api, state };

ctx.escapeHtml = (...args) => escapeHtml(ctx, ...args);
ctx.getEmployeeFullName = (...args) => getEmployeeFullName(ctx, ...args);
ctx.getEmployeeDisplayName = (...args) => getEmployeeDisplayName(ctx, ...args);
ctx.showListingView = (...args) => showListingView(ctx, ...args);
ctx.showFormView = (...args) => showFormView(ctx, ...args);
ctx.updateEmployeeListPagination = (...args) => updateEmployeeListPagination(ctx, ...args);
ctx.renderEmployeeList = (...args) => renderEmployeeList(ctx, ...args);
ctx.loadEmployeeList = (...args) => loadEmployeeList(ctx, ...args);
ctx.handleEmployeeListSearch = (...args) => handleEmployeeListSearch(ctx, ...args);
ctx.loadEmployeeFromList = (...args) => loadEmployeeFromList(ctx, ...args);
ctx.closeEmployeeSortMenu = (...args) => closeEmployeeSortMenu(ctx, ...args);
ctx.createEmployeeSortMenu = (...args) => createEmployeeSortMenu(ctx, ...args);
ctx.getFields = (...args) => getFields(ctx, ...args);
ctx.getField = (...args) => getField(ctx, ...args);
ctx.getFormDataObject = (...args) => getFormDataObject(ctx, ...args);
ctx.setFieldValue = (...args) => setFieldValue(ctx, ...args);
ctx.populateForm = (...args) => populateForm(ctx, ...args);
ctx.updateEmployeeHeader = (...args) => updateEmployeeHeader(ctx, ...args);
ctx.clearForm = (...args) => clearForm(ctx, ...args);
ctx.setFieldState = (...args) => setFieldState(ctx, ...args);
ctx.setSearchEnabled = (...args) => setSearchEnabled(ctx, ...args);
ctx.setMode = (...args) => setMode(ctx, ...args);
ctx.updateButtons = (...args) => updateButtons(ctx, ...args);
ctx.updateCounter = (...args) => updateCounter(ctx, ...args);
ctx.updateNavigationButtons = (...args) => updateNavigationButtons(ctx, ...args);
ctx.saveOriginalData = (...args) => saveOriginalData(ctx, ...args);
ctx.restoreOriginalData = (...args) => restoreOriginalData(ctx, ...args);
ctx.hasChanges = (...args) => hasChanges(ctx, ...args);
ctx.confirmCancel = (...args) => confirmCancel(ctx, ...args);
ctx.updateHighlightedResult = (...args) => updateHighlightedResult(ctx, ...args);
ctx.resetHighlightedResult = (...args) => resetHighlightedResult(ctx, ...args);
ctx.hideSearchResults = (...args) => hideSearchResults(ctx, ...args);
ctx.showSearchResults = (...args) => showSearchResults(ctx, ...args);
ctx.renderSearchResults = (...args) => renderSearchResults(ctx, ...args);
ctx.searchEmployees = (...args) => searchEmployees(ctx, ...args);
ctx.handleSearchInput = (...args) => handleSearchInput(ctx, ...args);
ctx.handleSearchFocus = (...args) => handleSearchFocus(ctx, ...args);
ctx.handleSearchKeydown = (...args) => handleSearchKeydown(ctx, ...args);
ctx.handleListSearchKeydown = (...args) => handleListSearchKeydown(ctx, ...args);
ctx.loadEmployee = (...args) => loadEmployee(ctx, ...args);
ctx.navigateEmployee = (...args) => navigateEmployee(ctx, ...args);
ctx.getClientName = (...args) => getClientName(ctx, ...args);
ctx.updateClientDisplay = (...args) => updateClientDisplay(ctx, ...args);
ctx.clearClient = (...args) => clearClient(ctx, ...args);
ctx.populateClient = (...args) => populateClient(ctx, ...args);
ctx.renderClientResults = (...args) => renderClientResults(ctx, ...args);
ctx.loadClients = (...args) => loadClients(ctx, ...args);
ctx.showClientDropdown = (...args) => showClientDropdown(ctx, ...args);
ctx.hideClientDropdown = (...args) => hideClientDropdown(ctx, ...args);
ctx.selectClient = (...args) => selectClient(ctx, ...args);
ctx.handleClientSearchInput = (...args) => handleClientSearchInput(ctx, ...args);
ctx.handleClientInputFocus = (...args) => handleClientInputFocus(ctx, ...args);
ctx.handleClientInputKeydown = (...args) => handleClientInputKeydown(ctx, ...args);
ctx.clearComputedRates = (...args) => clearComputedRates(ctx, ...args);
ctx.getPayrollConfig = (...args) => getPayrollConfig(ctx, ...args);
ctx.formatRate = (...args) => formatRate(ctx, ...args);
ctx.updateRateFieldState = (...args) => updateRateFieldState(ctx, ...args);
ctx.calculateRates = (...args) => calculateRates(ctx, ...args);
ctx.handleRateBasisChange = (...args) => handleRateBasisChange(ctx, ...args);
ctx.handleDailyRateBlur = (...args) => handleDailyRateBlur(ctx, ...args);
ctx.buildFormData = (...args) => buildFormData(ctx, ...args);
ctx.saveEmployee = (...args) => saveEmployee(ctx, ...args);
ctx.startAdd = (...args) => startAdd(ctx, ...args);
ctx.startEdit = (...args) => startEdit(ctx, ...args);
ctx.cancelAction = (...args) => cancelAction(ctx, ...args);
ctx.handleBackToList = (...args) => handleBackToList(ctx, ...args);

dom.form.addEventListener('submit', event => {
    event.preventDefault();
});

dom.searchInput?.setAttribute('role', 'combobox');
dom.searchInput?.setAttribute('aria-autocomplete', 'list');
dom.searchInput?.setAttribute('aria-expanded', 'false');
dom.searchInput?.setAttribute('aria-controls', 'employeeSearchList');
dom.searchList?.setAttribute('role', 'listbox');

dom.employeeListSearch?.addEventListener('input', ctx.handleEmployeeListSearch);
dom.employeeListSearch?.addEventListener('keydown', ctx.handleListSearchKeydown);

dom.employeeSortButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    const existingMenu = panel.querySelector('#employeeSortMenu');

    if (existingMenu) {
        ctx.closeEmployeeSortMenu();
        return;
    }

    ctx.createEmployeeSortMenu();
});

dom.searchInput?.addEventListener('input', ctx.handleSearchInput);
dom.searchInput?.addEventListener('focus', ctx.handleSearchFocus);
dom.searchInput?.addEventListener('keydown', ctx.handleSearchKeydown);

dom.clientInput?.addEventListener('input', ctx.handleClientSearchInput);
dom.clientInput?.addEventListener('focus', ctx.handleClientInputFocus);
dom.clientInput?.addEventListener('keydown', ctx.handleClientInputKeydown);

dom.rateBasisField?.addEventListener('change', ctx.handleRateBasisChange);
dom.dailyRateField?.addEventListener('blur', ctx.handleDailyRateBlur);

document.addEventListener('click', event => {
    if (!panel.contains(event.target)) {
        return;
    }

    if (dom.searchResults && !dom.searchResults.contains(event.target) && event.target !== dom.searchInput) {
        ctx.hideSearchResults();
    }

    if (dom.clientDropdown && !dom.clientDropdown.contains(event.target) && event.target !== dom.clientInput) {
        ctx.hideClientDropdown();
    }

    if (dom.employeeListSearchResults && !dom.employeeListSearchResults.contains(event.target) && event.target !== dom.employeeListSearch) {
        dom.employeeListSearchResults.classList.add('hidden');
    }

    const employeeSortMenu = event.target.closest('#employeeSortMenu');
    const employeeSortButtonTarget = event.target.closest('#employeeSortButton');

    if (!employeeSortMenu && !employeeSortButtonTarget) {
        ctx.closeEmployeeSortMenu();
    }

    const employeeContextMenu = event.target.closest('.employee-context-menu');
    const employeeContextButton = event.target.closest('.employee-context-button');

    if (!employeeContextMenu && !employeeContextButton) {
        dom.employeeList?.querySelectorAll('.employee-context-menu').forEach(menu => {
            menu.classList.add('hidden');
        });

        dom.employeeList?.querySelectorAll('.employee-context-button').forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });
    }
});

dom.employeeAddButton?.addEventListener('click', ctx.startAdd);
dom.formAddButton?.addEventListener('click', ctx.startAdd);
dom.employeeBackButton?.addEventListener('click', ctx.handleBackToList);
dom.editButton?.addEventListener('click', ctx.startEdit);
dom.saveButton?.addEventListener('click', ctx.saveEmployee);
dom.cancelButton?.addEventListener('click', ctx.cancelAction);

dom.previousButton?.addEventListener('click', () => ctx.navigateEmployee('previous'));
dom.nextButton?.addEventListener('click', () => ctx.navigateEmployee('next'));

dom.employeePreviousPageButton?.addEventListener('click', () => {
    if (state.employeeListPage > 1) {
        ctx.loadEmployeeList(
            dom.employeeListSearch?.value || '',
            state.employeeListPage - 1
        );
    }
});

dom.employeeNextPageButton?.addEventListener('click', () => {
    if (state.employeeListPage < state.employeeListLastPage) {
        ctx.loadEmployeeList(
            dom.employeeListSearch?.value || '',
            state.employeeListPage + 1
        );
    }
});

dom.profileInput?.addEventListener('change', () => {
    if (!dom.profileInput.files?.length || !dom.profilePreview) {
        return;
    }

    const file = dom.profileInput.files[0];

    if (!file.type.startsWith('image/')) {
        dom.profileInput.value = '';

        Swal.fire({
            icon: 'warning',
            title: 'Invalid File',
            text: 'Please select an image file.'
        });

        return;
    }

    const reader = new FileReader();

    reader.onload = event => {
        dom.profilePreview.src = event.target.result;
        dom.profilePreview.classList.remove('hidden');
    };

    reader.readAsDataURL(file);
});

state.mode = 'view';
state.currentEmployeeId = null;
state.originalData = {};
state.originalClientDisplayName = '';
state.currentClientDisplayName = '';
state.currentClientPayrollConfig = null;
state.originalClientPayrollConfig = null;
state.searchTimer = null;
state.clientSearchTimer = null;
state.searchItems = [];
state.currentSearchIndex = -1;
state.highlightedIndex = -1;
state.employeeListPage = 1;
state.employeeListLastPage = 1;
state.employeeListTotal = 0;
state.employeeSort = 'name';
state.employeeSortDirection = 'asc';
state.employeeStatus = 'active';

ctx.clearForm();
ctx.setMode('view');
ctx.saveOriginalData();
ctx.showListingView();

await ctx.loadEmployeeList('', 1);


}
