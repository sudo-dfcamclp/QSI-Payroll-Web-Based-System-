export const state = {
    editing: false,
    creating: false,
    currentClientId: null,
    originalData: {},
    searchTimeout: null,
    listSearchTimeout: null,
    searchHighlightedIndex: -1,
    clientListPage: 1,
    clientSort: 'name',
    clientSortDirection: 'asc'
};