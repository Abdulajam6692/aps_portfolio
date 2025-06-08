document.getElementById('find-path').addEventListener('click', () => {
  // Parse user input
  const nodes = document.getElementById('nodes').value.split(',').map(node => node.trim());
  const edgesInput = document.getElementById('edges').value.split(',').map(edge => edge.trim());
  
  const edges = edgesInput.map(edge => {
    const [u, v, w] = edge.split('-');
    return { u: u.trim(), v: v.trim(), w: parseInt(w.trim()) };
  });
  
  const start = document.getElementById('start').value.trim();
  const goal = document.getElementById('goal').value.trim();

  // Validate input
  if (!nodes.includes(start) || !nodes.includes(goal)) {
    document.getElementById('result').innerHTML = "Error: Start or goal node not in the graph!";
    return;
  }

  // Build graph
  const graph = {};
  nodes.forEach(node => { graph[node] = []; });
  edges.forEach(edge => {
    if (!graph[edge.u]) graph[edge.u] = [];
    graph[edge.u].push({ node: edge.v, cost: edge.w });
  });

  // Run UCS
  const { path, cost } = uniformCostSearch(graph, start, goal);

  // Display results
  const resultDiv = document.getElementById('result');
  if (path) {
    resultDiv.innerHTML = `Optimal Path: <strong>${path.join(' → ')}</strong><br>Total Cost: <strong>${cost}</strong>`;
  } else {
    resultDiv.innerHTML = "No path exists between the start and goal nodes!";
  }
});

function uniformCostSearch(graph, start, goal) {
  const queue = [{ cost: 0, node: start, path: [start] }];
  const visited = new Set();

  while (queue.length > 0) {
    // Sort queue to simulate priority (min-heap)
    queue.sort((a, b) => a.cost - b.cost);
    const { cost, node, path } = queue.shift();

    if (node === goal) return { path, cost };
    if (visited.has(node)) continue;

    visited.add(node);
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        queue.push({
          cost: cost + neighbor.cost,
          node: neighbor.node,
          path: [...path, neighbor.node]
        });
      }
    }
  }
  return { path: null, cost: Infinity };
}