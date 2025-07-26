// save_game.js
// Exported function to save game state into browser's localStorage
export function saveGame(gameState, saveKey = "ngeeAnnCityGameSave") {
    try {
        // Convert the gameState object into JSON string to be stored in localStorage
        const serializedState = JSON.stringify(gameState);

        // Save the serialized state under the specified key in localStorage
        localStorage.setItem(saveKey, serializedState);

        // Log success and the actual game state for debugging purposes
        console.log("Game saved:", gameState);
    } catch (error) {

        // Ccatch & report the error without crashing the game
        console.error("Failed to save game:", error);
    }
}

