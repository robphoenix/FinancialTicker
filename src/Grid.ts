class Grid {
    private model: Model;

    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;
    private tbody: HTMLTableSectionElement;
    private headerRow: HTMLTableRowElement;
    private history: { [key: string]: number };

    constructor() {
        this.model = new Model();
        this.model.parentGrid(this);

        this.table = document.getElementById(`ticker-grid`) as HTMLTableElement;
        this.thead = this.table.createTHead();
        this.headerRow = this.thead.insertRow(0);
        this.tbody = this.table.createTBody();
        this.history = {};
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
            this.history[stock.name] = stock.price;

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

    public async updateStock(update: IStock) {
        const currentRow: HTMLElement = document.getElementById(update.name)!;
        const updatedRow: HTMLElement = currentRow;
        const cells: Element[] = [];

        const priceCell: Element | null = updatedRow.querySelector(
            `#${update.name}-price`,
        );
        cells.push(priceCell!);
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

        let [addClass, removeClass] = [`inc`, `dec`];
        if (update.price < this.history[update.name]) {
            [addClass, removeClass] = [removeClass, addClass];
        }
        cells.map((cell: Element) => {
            cell!.classList.remove(`cell--${removeClass}`);
            cell!.classList.add(`cell--${addClass}`);
        });

        this.history[update.name] = update.price;

        currentRow.parentNode!.replaceChild(updatedRow, currentRow);
    }
}
