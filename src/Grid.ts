class Grid {
    // private deltas: number[];

    private model: Model;

    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;
    private tbody: HTMLTableSectionElement;
    private headerRow: HTMLTableRowElement;

    constructor() {
        this.model = new Model();
        this.model.parentGrid(this);

        this.table = document.getElementById(`ticker-grid`) as HTMLTableElement;
        this.thead = this.table.createTHead();
        this.headerRow = this.thead.insertRow(0);
        this.tbody = this.table.createTBody();
    }

    public async render() {
        await this.model.load();

        this.model.headers.map((header, i) => {
            const cell: HTMLTableDataCellElement = this.headerRow.insertCell(i);
            cell.className = `grid__thead`;
            cell.innerHTML = header;
        });
        this.tbody.className = `grid__tbody`;
        this.model.stocks.map((stock, i) => {
            const row: HTMLTableRowElement = this.tbody.insertRow(i);
            if (i % 2 === 0) {
                row.className = `grid__row--even `;
            }
            row.className += `grid__row`;
            row.id = stock.name;

            Object.keys(stock).map((key, j) => {
                const cell: HTMLTableDataCellElement = row.insertCell(j);
                cell.innerHTML = stock[key];
                cell.id = `${stock.name}-${key}`;
                if (key === `name`) {
                    cell.className += `grid__cell--name `;
                }
                cell.className += `grid__cell`;
            });
        });
    }

    public updateStock(update: IStock | undefined) {
        // TODO: if (current price !== updated price) { add visual flare }
        if (update !== undefined) {
            const currentRow: HTMLElement | null = document.getElementById(
                update.name,
            );
            if (currentRow !== null) {
                const updatedRow: HTMLElement = currentRow;
                updatedRow.querySelector(
                    `#${update.name}-price`,
                )!.innerHTML = `${update.price}`;
                updatedRow.querySelector(
                    `#${update.name}-change`,
                )!.innerHTML = `${update.change}`;
                updatedRow.querySelector(
                    `#${update.name}-changePercent`,
                )!.innerHTML = `${update.changePercent}`;

                currentRow.parentNode!.replaceChild(updatedRow, currentRow);
            }
        }
    }
}
