const PAPER_SIZE = {
  a3: { h: 4961, w: 3508 },
  a4: { h: 3508, w: 2480 },
  a5: { h: 2480, w: 1748 },
  letter: { h: 3295, w: 2551 },
  n: { h: 0, w: 0 },
};

const title = document.querySelector("#titleInput");
const desc = document.querySelector("#descInput");
const table = document.querySelector("#tableInput");
const selectSize = document.querySelector("#sizeSelect");

const refresh = document.querySelector("#refresh");
const reset = document.querySelector("#reset");
const download = document.querySelector("#download");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

[title, desc, selectSize].forEach((inp) => {
  inp.addEventListener("input", draw);
});

refresh.addEventListener("click", draw);
selectSize.addEventListener("change", draw);
download.addEventListener("click", downloadImage);
draw();

function setSize() {
  const { h, w } = PAPER_SIZE[selectSize.value];
  canvas.height = h;
  canvas.width = w;
  ctx.fillStyle = "hsl(0, 0%, 90%)";
  ctx.fillRect(0, 0, w, h);
}

function draw() {
  setSize();
  const cw = canvas.width;
  const unit = canvas.width / 100;
  const margin = unit * 8;
  const maxW = cw - margin * 2;
  let y = margin;
  ctx.fillStyle = "#000";
  ctx.font = `bold ${unit * 5}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(title.value, unit * 8, unit * 8);

  y += unit * 5 * 1.4;

  if (desc.value.trim()) {
    ctx.font = `${unit * 3}px sans-serif`;
    for (const line of wrapText(desc.value, maxW)) {
      ctx.fillText(line, unit * 8, y);
      y += unit * 3 * 1.4;
    }
    y += unit * 3;
  }

  const rows = table.value
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => {
      const i = l.lastIndexOf(",");
      return i < 0
        ? [l.trim(), ""]
        : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    });

  ctx.font = `${unit * 3}px san-serif`;

  const rowH = unit * 3 * 1;

  for (const [label, value] of rows) {
    ctx.textAlign = "left";
    ctx.fillText(label, margin, y);
    ctx.textAlign = "right";
    ctx.fillText(value, cw - margin, y);
    y += rowH;
  }

  ctx.textAlign = "left";
}

function wrapText(txt, maxWidth) {
  const words = txt.split(" ");
  const lines = [];
  var line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  return lines;
}

function downloadImage() {
  blob = canvas.toBlob(function (blob) {
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "image.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
