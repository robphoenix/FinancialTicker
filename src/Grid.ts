class Grid {
    private snapshot: string;

    constructor() {
        this.snapshot = "./data/snapshot.csv";
    }

    public async render() {
        const model: Model = new Model();
        await model.load(this.snapshot);

        const table: HTMLTableElement = document.getElementById(
            "ticker-grid",
        ) as HTMLTableElement;

        const thead: HTMLTableSectionElement = table.createTHead();
        const rowHead: HTMLTableRowElement = thead.insertRow(0);
        model.headers.map((header, i) => {
            const cell: HTMLTableDataCellElement = rowHead.insertCell(i);
            cell.className = "grid__thead";
            cell.innerHTML = header;
        });

        const tbody: HTMLTableSectionElement = table.createTBody();
        tbody.className = "grid__tbody";
        model.stocks.map((stock, i) => {
            const rowBody: HTMLTableRowElement = tbody.insertRow(i);
            if (i % 2 === 0) {
                rowBody.className = "grid__row--even ";
            }
            rowBody.className += "grid__row";
            Object.keys(stock).map((key, j) => {
                const cell: HTMLTableDataCellElement = rowBody.insertCell(j);
                cell.innerHTML = stock[key];
                if (key === "name") {
                    cell.className += "grid__cell--name ";
                }
                cell.className += "grid__cell";
            });
        });
    }
}
