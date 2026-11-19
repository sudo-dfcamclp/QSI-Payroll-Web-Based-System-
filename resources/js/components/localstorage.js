
const STORAGE_PREFIX = 'epayroll:module:';

/**
 * Kunin ang saved state ng isang module.
 */
export function getModuleState(moduleName) {
    if (!moduleName) return {};

    try {
        const key = `${STORAGE_PREFIX}${moduleName}`;
        const savedData = localStorage.getItem(key);

        if (!savedData) return {};

        const parsedData = JSON.parse(savedData);

        return parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)
            ? parsedData
            : {};
    } catch (error) {
        console.error(`Failed to load ${moduleName} state:`, error);
        return {};
    }
}

/**
 * I-save o i-update ang state ng isang module.
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

        localStorage.setItem(key, JSON.stringify(updatedState));

        return true;
    } catch (error) {
        console.error(`Failed to save ${moduleName} state:`, error);
        return false;
    }
}

/**
 * Burahin lamang ang saved state ng tinukoy na module.
 */
export function clearModuleState(moduleName) {
    if (!moduleName) return false;

    try {
        const key = `${STORAGE_PREFIX}${moduleName}`;
        localStorage.removeItem(key);

        return true;
    } catch (error) {
        console.error(`Failed to clear ${moduleName} state:`, error);
        return false;
    }
}
