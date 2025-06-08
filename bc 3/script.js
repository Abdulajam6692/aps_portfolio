let arr = [];
let blockMax = [];
let blockSize = 0;
let chart;

function preprocess(inputArr) {
  arr = inputArr;
  blockSize = Math.floor(Math.sqrt(arr.length));
  const numBlocks = Math.ceil(arr.length / blockSize);
  blockMax = new Array(numBlocks).fill(-Infinity);

  for (let i = 0; i < arr.length; i++) {
    const blockIndex = Math.floor(i / blockSize);
    blockMax[blockIndex] = Math.max(blockMax[blockIndex], arr[i]);
  }
}

function queryMax(L, R) {
  let maxVal = -Infinity;

  while (L <= R) {
    if (L % blockSize === 0 && L + blockSize - 1 <= R) {
      // Whole block can be used
      maxVal = Math.max(maxVal, blockMax[Math.floor(L / blockSize)]);
      L += blockSize;
    } else {
      maxVal = Math.max(maxVal, arr[L]);
      L++;
    }
  }

  return maxVal;
}

function performMaxQuery() {
  const input = document.getElementById("arrayInput").value.trim();
  const inputArray = input.split(",").map(Number);
  const L = parseInt(document.getElementById("rangeL").value);
  const R = parseInt(document.getElementById("rangeR").value);

  if (
    inputArray.some(isNaN) || isNaN(L) || isNaN(R) ||
    L < 0 || R >= inputArray.length || L > R
  ) {
    document.getElementById("output").innerText = "Invalid input.";
    return;
  }

  preprocess(inputArray);
  const result = queryMax(L, R);

  document.getElementById("output").innerText =
    `Max value in range [${L}, ${R}] is: ${result}`;

  drawChart(inputArray, L, R, result);
}

function drawChart(array, L, R, maxVal) {
  const labels = array.map((_, idx) => `Index ${idx}`);
  const dataColors = array.map((val, idx) => {
    if (idx >= L && idx <= R && val === maxVal) return "#e74c3c"; // max
    else if (idx >= L && idx <= R) return "#f39c12"; // in range
    else return "#3498db"; // default
  });

  const ctx = document.getElementById("visualChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Sensor Values',
        data: array,
        backgroundColor: dataColors,
        borderRadius: 5,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}
