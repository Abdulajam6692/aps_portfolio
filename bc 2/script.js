let sparseTable = [], log = [], chart;

function buildSparseTable(arr) {
  const n = arr.length;
  const k = Math.floor(Math.log2(n)) + 1;
  log = Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) log[i] = log[Math.floor(i / 2)] + 1;

  sparseTable = Array(n).fill().map(() => Array(k).fill(0));
  for (let i = 0; i < n; i++) sparseTable[i][0] = arr[i];

  for (let j = 1; (1 << j) <= n; j++) {
    for (let i = 0; (i + (1 << j) - 1) < n; i++) {
      sparseTable[i][j] = Math.min(
        sparseTable[i][j - 1],
        sparseTable[i + (1 << (j - 1))][j - 1]
      );
    }
  }
}

function query(L, R) {
  const j = log[R - L + 1];
  return Math.min(sparseTable[L][j], sparseTable[R - (1 << j) + 1][j]);
}

function runQuery() {
  const input = document.getElementById('sensorData').value;
  const arr = input.split(',').map(x => parseInt(x.trim()));
  const L = parseInt(document.getElementById('left').value);
  const R = parseInt(document.getElementById('right').value);

  if (L < 0 || R >= arr.length || L > R) {
    document.getElementById('output').innerText = 'Invalid range!';
    return;
  }

  buildSparseTable(arr);
  const result = query(L, R);
  document.getElementById('output').innerText =
    `Minimum value in range [${L}, ${R}] is: ${result}`;

  drawChart(arr, L, R, result);
}

function drawChart(data, L, R, minValue) {
  const labels = data.map((_, i) => i);
  const bgColors = data.map((val, i) =>
    (i >= L && i <= R)
      ? (val === minValue ? 'red' : 'rgba(75,192,192,0.6)')
      : 'rgba(200,200,200,0.4)'
  );

  if (chart) chart.destroy();

  const ctx = document.getElementById('sensorChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sensor Readings',
        data,
        backgroundColor: bgColors,
        borderColor: '#3498db',
        borderWidth: 2,
        pointBackgroundColor: bgColors,
        pointRadius: 5
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Sensor Index' }},
        y: { title: { display: true, text: 'Value' }}
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `Value: ${context.raw}`
          }
        }
      }
    }
  });
}
