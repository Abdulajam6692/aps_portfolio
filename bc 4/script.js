class KDNode {
  constructor(point, axis, left = null, right = null) {
    this.point = point;
    this.axis = axis;
    this.left = left;
    this.right = right;
  }
}

function buildKDTree(points, depth = 0) {
  if (!points.length) return null;
  const axis = depth % 2;
  points.sort((a, b) => a[axis] - b[axis]);
  const median = Math.floor(points.length / 2);
  return new KDNode(
    points[median],
    axis,
    buildKDTree(points.slice(0, median), depth + 1),
    buildKDTree(points.slice(median + 1), depth + 1)
  );
}

function rangeQuery(node, x1, x2, y1, y2, result = []) {
  if (!node) return result;
  const [x, y] = node.point;
  if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
    result.push(node.point);
  }
  const axisVal = node.point[node.axis];
  if ((node.axis === 0 && x1 <= axisVal) || (node.axis === 1 && y1 <= axisVal)) {
    rangeQuery(node.left, x1, x2, y1, y2, result);
  }
  if ((node.axis === 0 && x2 >= axisVal) || (node.axis === 1 && y2 >= axisVal)) {
    rangeQuery(node.right, x1, x2, y1, y2, result);
  }
  return result;
}

function nearestNeighbor(node, target, best = { point: null, dist: Infinity }) {
  if (!node) return best;
  const [x, y] = node.point;
  const dist = Math.hypot(target[0] - x, target[1] - y);
  if (dist < best.dist) best = { point: node.point, dist };
  const axis = node.axis;
  const diff = target[axis] - node.point[axis];
  const [first, second] = diff < 0 ? [node.left, node.right] : [node.right, node.left];
  best = nearestNeighbor(first, target, best);
  if (Math.abs(diff) < best.dist) {
    best = nearestNeighbor(second, target, best);
  }
  return best;
}

function parsePoints(text) {
  const regex = /\((\d+),\s*(\d+)\)/g;
  const points = [];
  let match;
  while ((match = regex.exec(text))) {
    points.push([parseInt(match[1]), parseInt(match[2])]);
  }
  return points;
}

function runKDTree() {
  const points = parsePoints(document.getElementById("pointInput").value);
  const tree = buildKDTree(points);
  const queryType = document.getElementById("queryType").value;
  const output = document.getElementById("output");

  if (queryType === "range") {
    const x1 = parseFloat(document.getElementById("x1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const y2 = parseFloat(document.getElementById("y2").value);
    const results = rangeQuery(tree, x1, x2, y1, y2);
    output.innerText = "Points in range: " + JSON.stringify(results);
  } else {
    const tx = parseFloat(document.getElementById("tx").value);
    const ty = parseFloat(document.getElementById("ty").value);
    const nearest = nearestNeighbor(tree, [tx, ty]);
    output.innerText = "Nearest neighbor: " + JSON.stringify(nearest.point);
  }
}

// Show/hide fields based on query type
document.getElementById("queryType").addEventListener("change", () => {
  const container = document.getElementById("queryFields");
  const type = document.getElementById("queryType").value;
  if (type === "range") {
    container.innerHTML = `
      <input type="number" id="x1" placeholder="x1 (min x)" />
      <input type="number" id="x2" placeholder="x2 (max x)" />
      <input type="number" id="y1" placeholder="y1 (min y)" />
      <input type="number" id="y2" placeholder="y2 (max y)" />
    `;
  } else {
    container.innerHTML = `
      <input type="number" id="tx" placeholder="Target x" />
      <input type="number" id="ty" placeholder="Target y" />
    `;
  }
});

// Set default fields
document.getElementById("queryType").dispatchEvent(new Event("change"));
