let cells = [];

const table = document.getElementById("meal-grid");

document.querySelectorAll("#meal-grid td").forEach(td => {
    cells.push({ 
        name: td.querySelector(".cell-text").textContent, 
        ingredients: [], 
        stickers: [] 
    });
});

function loadCells() {
    const saved = localStorage.getItem("mealGridState");
    if (saved) {
    const savedCells = JSON.parse(saved);

    // Biztosítjuk, hogy legyen elég cella a DOM-ban
    while (savedCells.length > cells.length) {
        updateRows();    
    }

    savedCells.forEach((sc, i) => {
        cells[i].name = sc.name;
        cells[i].ingredients = sc.ingredients;
        cells[i].stickers = sc.stickers;

        const td = document.querySelectorAll("#meal-grid td")[i];
        const span = td.querySelector(".cell-text");
        span.textContent = sc.name;
    });
 
    }
};


function updateRows() {
    const tr = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
        const td = document.createElement("td");

        const span = document.createElement("span");
        span.classList.add("cell-text");
        span.textContent = "";
        td.appendChild(span);

        const input = document.createElement("input");
        input.classList.add("cell-input");
        input.type = "text";
        input.hidden = true;
        td.appendChild(input);

        tr.appendChild(td);

        // cells szinkronban bővül
        cells.push({
            name: "",
            ingredients: [],
            stickers: []
        });
    }

    table.appendChild(tr);
}
loadCells();

table.addEventListener("click", (e) => {

    const td = e.target.closest("td");
    if (!td) return;

    const span = td.querySelector(".cell-text");
    const input = td.querySelector(".cell-input");

    input.value = span.textContent;
    span.style.display = "none";
    input.style.display = "block";
    input.focus();

})


table.addEventListener("focusout", (e) => {
    if (!e.target.classList.contains("cell-input")) return;

    const input = e.target;
    const td = input.closest("td");
    const span = td.querySelector(".cell-text");
    const index = [...table.querySelectorAll("td")].indexOf(td);

    span.textContent = input.value;
    cells[index].name = input.value;
    saveCells();

    input.style.display = "none";
    span.style.display = "inline";
    if (!hasEmptyRow()) {
    updateRows();
}

    cleanupEmptyRows();
});


function saveCells() {
localStorage.setItem("mealGridState", JSON.stringify(cells));
}

function isRowEmpty(rowIndex) {
    const start = rowIndex * 7;
    for (let i = 0; i < 7; i++) {
        if (cells[start + i]?.name) return false;
    }
    return true;
}

function removeLastRow() {
    const rows = table.querySelectorAll("tr");
    table.removeChild(rows[rows.length - 1]);

    cells.splice(cells.length - 7, 7);
}

function trailingEmptyRowCount() {
    const rowCount = cells.length / 7;
    let count = 0;

    for (let r = rowCount - 1; r >= 0; r--) {
        if (isRowEmpty(r)) count++;
        else break;
    }
    return count;
}
function cleanupEmptyRows() {
    while (trailingEmptyRowCount() >= 2) {
        removeLastRow();
    }
}


function hasEmptyRow() {
    for (let i = 0; i < cells.length; i += 7) {
        const row = cells.slice(i, i + 7);
        if (row.every(c => c.name.trim() === "")) return true;
    }
    return false;
}