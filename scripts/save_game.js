export function saveGame(gameState, saveKey = "ngeeAnnCityGameSave") {
    try {
        // Save latest game state as a snapshot
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem(saveKey, serializedState);

        // --- Append to leaderboard ---
        const leaderboardKey = "ngeeAnnCityLeaderboard";
        let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

        // Add timestamp and optionally playerName (you can set it beforehand)
        gameState.date = new Date().toISOString();

        leaderboard.push(gameState);

        // Optional: Sort by score descending and limit to top 10
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        // Save updated leaderboard
        localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

        console.log("Game and leaderboard saved:", gameState);
    } catch (error) {
        console.error("Failed to save game:", error);
    }
}
