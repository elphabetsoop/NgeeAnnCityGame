function loadSavedGame() {
    const savedGame = localStorage.getItem('myGameSave');

    if (!savedGame) {
        alert('No saved game found.');
        return;
    }

    const gameState = JSON.parse(savedGame);

    window.playerPosition = gameState.playerPosition;
    window.score = gameState.score;
    window.inventory = gameState.inventory;

    // Update UI
    const scoreInput = document.getElementById('scoreInput');
    const inventoryInput = document.getElementById('inventoryInput');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const inventoryDisplay = document.getElementById('inventoryDisplay');

    if (scoreInput) scoreInput.value = window.score;
    if (inventoryInput) inventoryInput.value = window.inventory.join(', ');

    if (scoreDisplay) scoreDisplay.textContent = `Score: ${window.score}`;
    if (inventoryDisplay) inventoryDisplay.textContent = `Inventory: ${window.inventory.join(', ')}`;

    alert('Game loaded successfully!');
}
