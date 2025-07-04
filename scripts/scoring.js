function isNextTo(gameBoard, x, y, buildingType) {
    //returns true if the building being placed is next to the building type specified, false otherwise
    
    if (!gameBoard) {
        return false; // gameBoard not available
    }
    
    const gridSize = gameBoard.length;
    
    // Check up (y-1)
    if (y > 0 && gameBoard[y-1][x] === buildingType) { 
        return true; 
    }
    
    // Check down (y+1)
    if (y < gridSize-1 && gameBoard[y+1][x] === buildingType) { 
        return true; 
    }
    
    // Check left (x-1)
    if (x > 0 && gameBoard[y][x-1] === buildingType) { 
        return true; 
    }
    
    // Check right (x+1)
    if (x < gridSize-1 && gameBoard[y][x+1] === buildingType) { 
        return true; 
    }
    
    return false;
}

function adjacentTo(gameBoard, x, y, buildingType) {
    // returns true if there is an adjacent building of the specified type connected via roads

    if (!gameBoard) {
        return false; // gameBoard not available
    }
    
    const gridSize = gameBoard.length;
    
    // Check all four directions for road connections
    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 }   // right
    ];
    
    for (const dir of directions) {
        const adjacentX = x + dir.dx;
        const adjacentY = y + dir.dy;
        
        // Check if adjacent position is within bounds and has a road
        if (adjacentX >= 0 && adjacentX < gridSize && 
            adjacentY >= 0 && adjacentY < gridSize && 
            gameBoard[adjacentY][adjacentX] === "Road") {
            
            // Follow the road in this direction to find a building
            let currentX = adjacentX;
            let currentY = adjacentY;
            
            // Continue in the same direction while there are roads
            while (currentX >= 0 && currentX < gridSize && 
                   currentY >= 0 && currentY < gridSize && 
                   gameBoard[currentY][currentX] === "Road") {
                currentX += dir.dx;
                currentY += dir.dy;
            }
            
            // Check if we found a building of the specified type at the end of the road
            if (currentX >= 0 && currentX < gridSize && 
                currentY >= 0 && currentY < gridSize && 
                gameBoard[currentY][currentX] === buildingType) {
                
                return true; // Found adjacent building of specified type
            }
        }
    }
    
    return false; // No building of specified type found at the end of any road connection
}   



export function calculateScore(gameBoard, score, coinCount, x, y, building) {
    let newScore = score;
    let newCoinCount = coinCount;
    
    if (building === "Residential"){ 
        if (isNextTo(gameBoard, x, y, "Industry")) {
            newScore++; // +1 if next to Industry
        }
        else if (adjacentTo(gameBoard, x, y, "Residential") || adjacentTo(gameBoard, x, y, "Commercial")) {
            newScore++; // +1 for each adjacent Residential or Commercial
        }
        else if (adjacentTo(gameBoard, x, y, "Park")) {
            newScore += 2; // +2 per Park
        }
    }
    else if (building === "Industry") {
        // Count all industries in the city
        let industryCount = 0;
        for (let row of gameBoard) {
            for (let cell of row) {
                if (cell === "Industry") {
                    industryCount++;
                }
            }
        }
        newScore += industryCount; // +1 for each Industry in city
        
        if (adjacentTo(gameBoard, x, y, "Residential")) {
            newCoinCount++; // Generates 1 coin per adjacent Residential
        }
    }
    else if (building === "Commercial") {
        if (adjacentTo(gameBoard, x, y, "Commercial")) {
            newScore++; // +1 for each adjacent Commercial
        }
        if (adjacentTo(gameBoard, x, y, "Residential")) {
            newCoinCount++; // Generates 1 coin per adjacent Residential
        }
    }
    else if (building === "Park") {
        if (adjacentTo(gameBoard, x, y, "Park")) {
            newScore++; // +1 for each adjacent Park
        }
    }
    else if (building === "Road") {
        // +1 for each connected Road in same row
        const row = gameBoard[y];
        const roadCount = row.filter(b => b === "Road").length;
        newScore += roadCount; // Add the count of roads in the same row
    }
    
    return { score: newScore, coinCount: newCoinCount };
}