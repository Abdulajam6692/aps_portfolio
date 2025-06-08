function processMatrix() {
  const input = document.getElementById("matrixInput").value.trim();
  const rows = input.split("\n").map(row => row.trim().split(" ").map(Number));
  if (!rows.length) return;

  const { maxSum, left, right, top, bottom } = kadane2D(rows);
  drawHeatmap(rows, left, right, top, bottom);
}

function kadane2D(matrix) {
  const row = matrix.length, col = matrix[0].length;
  let maxSum = -Infinity;
  let finalLeft = 0, finalRight = 0, finalTop = 0, finalBottom = 0;

  for (let left = 0; left < col; left++) {
    let temp = Array(row).fill(0);
    for (let right = left; right < col; right++) {
      for (let i = 0; i < row; i++) {
        temp[i] += matrix[i][right];
      }

      let { max, start, end } = kadane1D(temp);
      if (max > maxSum) {
        maxSum = max;
        finalLeft = left;
        finalRight = right;
        finalTop = start;
        finalBottom = end;
      }
    }
  }

  return {
    maxSum,
    left: finalLeft,
    right: finalRight,
    top: finalTop,
    bottom: finalBottom
  };
}

function kadane1D(arr) {
  let max = arr[0], sum = arr[0], start = 0, tempStart = 0, end = 0;

  for (let i = 1; i < arr.length; i++) {
    if (sum < 0) {
      sum = arr[i];
      tempStart = i;
    } else {
      sum += arr[i];
    }

    if (sum > max) {
      max = sum;
      start = tempStart;
      end = i;
    }
  }

  return { max, start, end };
}

function drawHeatmap(matrix, left, right, top, bottom) {
  const container = document.getElementById("heatmapContainer");
  container.innerHTML = "";

  const rows = matrix.length;
  const cols = matrix[0].length;
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

  const flatValues = matrix.flat();
  const minVal = Math.min(...flatValues);
  const maxVal = Math.max(...flatValues);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      const value = matrix[i][j];
      const norm = (value - minVal) / (maxVal - minVal || 1);
      const red = Math.floor(255 * norm);
      const blue = 255 - red;
      cell.style.backgroundColor = `rgb(${red}, 50, ${blue})`;
      cell.textContent = value;

      if (i >= top && i <= bottom && j >= left && j <= right) {
        cell.classList.add("highlight");
      }

      grid.appendChild(cell);
    }
  }

  container.appendChild(grid);
}
