// load_saved_game.js
/**
 * Load saved game state from localStorage
 * @param {string} saveKey - key used in localStorage
 * @returns {Object|null} - parsed game state or null if none found
 */

// Export the loadGame function to be used in other modules
export function loadGame(saveKey = "ngeeAnnCityGameSave") {
    try {
        // Retrieve saved game state from localStorage using saveKey
        const serializedState = localStorage.getItem(saveKey);

        // If there's nothing saved under that key, return null
        if (!serializedState) return null;

        // Parse the JSON string back into JS object
        return JSON.parse(serializedState);
    } catch (error) {
        // If an error occurs during loading or parsing, log the error for debugging
        console.error("Failed to load game:", error);

        // Return null when game state cannot be loaded
        return null;
    }
}

