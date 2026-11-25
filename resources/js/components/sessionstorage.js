// components/sessionstorage.js
const STORAGE_PREFIX = 'epayroll:module:';

/**
 * Kunin ang saved state ng isang module (session-scoped).
 */
export function getModuleState(moduleName) {
    if (!moduleName) return {};

    try {
        const key = `${STORAGE_PREFIX}${moduleName}`;
        const savedData = sessionStorage.getItem(key);

        if (!savedData) return {};

        const parsedData = JSON.parse(savedData);

        return parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)
            ? parsedData
            : {};
    } catch (error) {
        console.error(`Failed to load ${moduleName} session state:`, error);
        return {};
    }
}

/**
 * I-save o i-update ang session state ng isang module.
 * Existing values na hindi kasama sa bagong data ay mapapanatili.
 */
export function saveModuleState(moduleName, newState) {
    if (
        !moduleName ||
        !newState ||
        typeof newState !== 'object' ||
        Array.isArray(newState)
    ) {
        return false;
    }

    try {
        const key = `${STORAGE_PREFIX}${moduleName}`;
        const currentState = getModuleState(moduleName);

        const updatedState = {
            ...currentState,
            ...newState,
        };

        sessionStorage.setItem(key, JSON.stringify(updatedState));

        return true;
    } catch (error) {
        console.error(`Failed to save ${moduleName} session state:`, error);
        return false;
    }
}

/**
 * Burahin lamang ang saved session state ng tinukoy na module.
 */
export function clearModuleState(moduleName) {
    if (!moduleName) return false;

    try {
        const key = `${STORAGE_PREFIX}${moduleName}`;
        sessionStorage.removeItem(key);

        return true;
    } catch (error) {
        console.error(`Failed to clear ${moduleName} session state:`, error);
        return false;
    }
}