class Grid {
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

        this.model.headers.map((header: string, i: number) => {
            const cell: HTMLTableDataCellElement = this.headerRow.insertCell(i);
            cell.className = `grid__thead`;
            cell.innerHTML = header;
        });
        this.tbody.className = `grid__tbody`;
        this.model.stocks.map((stock: IStock, i: number) => {
            const row: HTMLTableRowElement = this.tbody.insertRow(i);
            if ((i + 1) % 2 === 0) {
                row.className = `grid__row--even `;
            }
            row.className += `grid__row`;
            row.id = stock.name;

            Object.keys(stock).map((key: string, j: number) => {
                const cell: HTMLTableDataCellElement = row.insertCell(j);
                cell.innerHTML = stock[key];
                cell.id = `${stock.name}-${key}`;
                cell.className += `grid__cell cell__${key}`;
            });
        });
    }

    public updateStock(update: IStock | undefined) {
        if (update === undefined) {
            return;
        }
        const currentRow: HTMLElement | null = document.getElementById(
            update.name,
        );
        if (currentRow !== null) {
            const updatedRow: HTMLElement = currentRow;
            const cells: Element[] = [];

            const priceCell: Element | null = updatedRow.querySelector(
                `#${update.name}-price`,
            );
            cells.push(priceCell!);
            const currentPrice: number = +priceCell!.innerHTML;
            priceCell!.innerHTML = `${update.price}`;

            const changeCell: Element | null = updatedRow.querySelector(
                `#${update.name}-change`,
            );
            cells.push(changeCell!);
            changeCell!.innerHTML = `${update.change}`;

            const changePercentCell: Element | null = updatedRow.querySelector(
                `#${update.name}-changePercent`,
            );
            cells.push(changePercentCell!);
            changePercentCell!.innerHTML = `${update.changePercent}`;

            let addClass: string = `inc`;
            let removeClass: string = `dec`;
            if (update.price < currentPrice) {
                addClass = `dec`;
                removeClass = `inc`;
            }
            cells.map((cell: Element) => {
                const cellClassList = cell!.classList;
                if (cellClassList.contains(`cell--${removeClass}`)) {
                    cellClassList.remove(`cell--${removeClass}`);
                }
                cellClassList.toggle(`cell--${addClass}`, true);
            });

            currentRow.parentNode!.replaceChild(updatedRow, currentRow);
        }
    }
}
