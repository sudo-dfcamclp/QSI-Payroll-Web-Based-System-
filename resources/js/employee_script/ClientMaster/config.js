const APP_URL = document
    .querySelector('meta[name="app-url"]')
    ?.getAttribute('content')
    ?.replace(/\/$/, '') || '';

export const API = {
    clients: `${APP_URL}/api/client-master/search`,
    client: (id) => `${APP_URL}/api/client-master/${encodeURIComponent(id)}`,
    clientStore: `${APP_URL}/api/client-master`,
};