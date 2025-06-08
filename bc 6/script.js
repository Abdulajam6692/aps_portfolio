function parseGrid(text) {
  return text.trim()
    .split(';')
    .map(row => row.trim().split(/\s+/).map(Number));
}

function aStar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Helper functions
  const key = (x, y) => `${x},${y}`;
  const heuristic = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  
  // Initialize data structures
  const openSet = new Set([key(start[0], start[1])]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  
  // Initialize scores
  gScore[key(start[0], start[1])] = 0;
  fScore[key(start[0], start[1])] = heuristic(start[0], start[1], end[0], end[1]);

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentKey = null;
    let lowestFScore = Infinity;
    
    for (const key of openSet) {
      if (fScore[key] < lowestFScore) {
        lowestFScore = fScore[key];
        currentKey = key;
      }
    }
    
    const [x, y] = currentKey.split(',').map(Number);
    openSet.delete(currentKey);
    
    // Check if we've reached the goal
    if (x === end[0] && y === end[1]) {
      // Reconstruct path
      const path = [[x, y]];
      let current = currentKey;
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current.split(',').map(Number));
      }
      return path;
    }
    
    // Check neighbors (up, down, left, right)
    const neighbors = [
      [x-1, y], [x+1, y],
      [x, y-1], [x, y+1]
    ];
    
    for (const [nx, ny] of neighbors) {
      // Skip out-of-bounds or walls (assuming 1 is a wall)
      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === 1) {
        continue;
      }
      
      const neighborKey = key(nx, ny);
      const tentativeG = gScore[currentKey] + 1; // Using 1 as movement cost
      
      if (tentativeG < (gScore[neighborKey] ?? Infinity)) {
        cameFrom[neighborKey] = currentKey;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] = tentativeG + heuristic(nx, ny, end[0], end[1]);
        
        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        }
      }
    }
  }
  
  return null; // No path found
}

function runAStar() {
  try {
    const gridText = document.getElementById('gridInput').value;
    const start = document.getElementById('start').value.split(',').map(Number);
    const end = document.getElementById('end').value.split(',').map(Number);
    const output = document.getElementById('output');
    
    const grid = parseGrid(gridText);
    const path = aStar(grid, start, end);
    
    if (!path) {
      output.textContent = "No valid path found!";
    } else {
      output.textContent = `Optimal Path:\n${path.map(p => `(${p[0]},${p[1]})`).join(' → ')}\n\nTotal steps: ${path.length - 1}`;
    }
  } catch (error) {
    document.getElementById('output').textContent = `Error: ${error.message}`;
  }
}