class Node {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function build(arr, l, r) {
  if (l === r) return new Node(arr[l]);
  let m = Math.floor((l + r) / 2);
  let left = build(arr, l, m);
  let right = build(arr, m + 1, r);
  return new Node(left.val + right.val, left, right);
}

function update(prevNode, l, r, idx, val) {
  if (l === r) return new Node(val);
  let m = Math.floor((l + r) / 2);
  let newLeft = prevNode.left, newRight = prevNode.right;
  if (idx <= m)
    newLeft = update(prevNode.left, l, m, idx, val);
  else
    newRight = update(prevNode.right, m + 1, r, idx, val);
  return new Node(newLeft.val + newRight.val, newLeft, newRight);
}

function query(node, l, r, ql, qr) {
  if (!node || r < ql || l > qr) return 0;
  if (ql <= l && r <= qr) return node.val;
  let m = Math.floor((l + r) / 2);
  return query(node.left, l, m, ql, qr) + query(node.right, m + 1, r, ql, qr);
}

let versions = [];
let size = 0;

function buildTree() {
  const input = document.getElementById("arrayInput").value;
  const arr = input.split(',').map(Number);
  size = arr.length;
  versions = [build(arr, 0, size - 1)];
  document.getElementById("output").innerText = "Version 0 built!";
}

function applyUpdate() {
  const idx = parseInt(document.getElementById("updateIndex").value);
  const val = parseInt(document.getElementById("updateValue").value);
  const newVersion = update(versions[versions.length - 1], 0, size - 1, idx, val);
  versions.push(newVersion);
  document.getElementById("output").innerText = "Update applied! New version: " + (versions.length - 1);
}

function performQuery() {
  const v = parseInt(document.getElementById("queryVersion").value);
  const l = parseInt(document.getElementById("queryL").value);
  const r = parseInt(document.getElementById("queryR").value);
  const result = query(versions[v], 0, size - 1, l, r);
  document.getElementById("output").innerText = "Query result on version " + v + ": " + result;
}
