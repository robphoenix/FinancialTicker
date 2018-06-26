class Grid {
    private deltas: number[];
    private model: Model;
    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;
    private tbody: HTMLTableSectionElement;
    private headerRow: HTMLTableRowElement;

    constructor() {
        this.deltas = [];
        this.model = new Model();
        this.table = document.getElementById("ticker-grid") as HTMLTableElement;
        this.thead = this.table.createTHead();
        this.tbody = this.table.createTBody();
        this.headerRow = this.thead.insertRow(0);
    }

    public async render() {
        await this.model.load();

        this.deltas = this.model.deltas;

        this.model.headers.map((header, i) => {
            const cell: HTMLTableDataCellElement = this.headerRow.insertCell(i);
            cell.className = "grid__thead";
            cell.innerHTML = header;
        });

        this.tbody.className = "grid__tbody";

        this.model.stocks.map((stock, i) => {
            const row: HTMLTableRowElement = this.tbody.insertRow(i);
            if (i % 2 === 0) {
                row.className = "grid__row--even ";
            }
            row.className += "grid__row";

            Object.keys(stock).map((key, j) => {
                const cell: HTMLTableDataCellElement = row.insertCell(j);
                cell.innerHTML = stock[key];
                if (key === "name") {
                    cell.className += "grid__cell--name ";
                }
                cell.className += "grid__cell";
            });
        });
    }
}
