function isNextTo(gameBoard, x, y, buildingType) {
    //returns true if the building being placed is next to the building type specified, false otherwise
    
    if (!gameBoard) {
        return false;
    }
    
    const gridSize = gameBoard.length;
    
    // Check up (y-1)
    if (y > 0 && getBuildingType(gameBoard[y-1][x]) === buildingType) { 
        return true; 
    }
    
    // Check down (y+1)
    if (y < gridSize-1 && getBuildingType(gameBoard[y+1][x]) === buildingType) { 
        return true; 
    }
    
    // Check left (x-1)
    if (x > 0 && getBuildingType(gameBoard[y][x-1]) === buildingType) { 
        return true; 
    }
    
    // Check right (x+1)
    if (x < gridSize-1 && getBuildingType(gameBoard[y][x+1]) === buildingType) { 
        return true; 
    }
    
    return false;
}

function adjacentTo(gameBoard, x, y, buildingType) {
    // returns true if there is an adjacent building of the specified type connected via roads

    if (!gameBoard) {
        return false;
    }
    
    const gridSize = gameBoard.length;
    
    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 }   // right
    ];
    
    for (const dir of directions) {
        const adjacentX = x + dir.dx;
        const adjacentY = y + dir.dy;
        
        // check if adjacent position is within bounds and has a road
        if (adjacentX >= 0 && adjacentX < gridSize && 
            adjacentY >= 0 && adjacentY < gridSize && 
            getBuildingType(gameBoard[adjacentY][adjacentX]) === "Road") {
            
            let currentX = adjacentX;
            let currentY = adjacentY;
            
            // continue in the same direction while there are roads
            while (currentX >= 0 && currentX < gridSize && 
                   currentY >= 0 && currentY < gridSize && 
                   getBuildingType(gameBoard[currentY][currentX]) === "Road") {
                currentX += dir.dx;
                currentY += dir.dy;
            }
            
            // check for building type at the end of the road
            if (currentX >= 0 && currentX < gridSize && 
                currentY >= 0 && currentY < gridSize && 
                getBuildingType(gameBoard[currentY][currentX]) === buildingType) {
                
                return true;
            }
        }
    }
    
    return false;
}   

function getBuildingType(cell) {
    return typeof cell === 'string' ? cell : (cell ? cell.type : null);
}

export function calculateScore(gameBoard, score, coinCount, x, y, building, buildingStats) {
    let newScore = score;
    let newCoinCount = coinCount;
    
    if (building === "Residential"){ 
        if (isNextTo(gameBoard, x, y, "Industry")) {
            newScore++; // +1 if next to Industry
            buildingStats.i_score += 1;
        }
        else if (adjacentTo(gameBoard, x, y, "Residential") || adjacentTo(gameBoard, x, y, "Commercial")) {
            newScore++; // +1 for each adjacent Residential or Commercial
            buildingStats.i_score += 1;
        }
        else if (adjacentTo(gameBoard, x, y, "Park")) {
            newScore += 2; // +2 for each adjacent Park
            buildingStats.i_score += 2;
        }
    }
    else if (building === "Industry") {
        newScore++; // +1 for per Industry
        buildingStats.i_score += 1;
        
        if (adjacentTo(gameBoard, x, y, "Residential")) {
            newCoinCount++; // +1 coin per adjacent Residential
            buildingStats.i_coin += 1;
        }
    }
    else if (building === "Commercial") {
        if (adjacentTo(gameBoard, x, y, "Commercial")) {
            newScore++; // +1 for each adjacent Commercial
            buildingStats.i_score += 1;
        }
        if (adjacentTo(gameBoard, x, y, "Residential")) {
            newCoinCount++; // +1 coin per adjacent Residential
            buildingStats.i_coin += 1;
        }
    }
    else if (building === "Park") {
        if (adjacentTo(gameBoard, x, y, "Park")) {
            newScore++; // +1 for each adjacent Park
            buildingStats.i_score += 1;
        }
    }
    else if (building === "Road") {
        const row = gameBoard[y];
        const existingRoadCount = row.filter(cell => getBuildingType(cell) === "Road").length;
        console.log(`DEBUGG:: Existing roads in row ${y}: ${existingRoadCount}`);
        const roadPoints = existingRoadCount > 1 ? 1 : 0; //+1 for each connected Road in same row
        newScore += roadPoints;
        buildingStats.i_score += roadPoints;
    }
    
    return { score: newScore, coinCount: newCoinCount };
}