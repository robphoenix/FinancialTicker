class Model {
    public headers: string[];
    public stocks: IStock[];
    public deltas: number[];

    private grid: Grid | undefined;
    private companies: string[];
    private snapshotFile: string;
    private deltasFile: string;

    constructor() {
        this.headers = [];
        this.stocks = [];
        this.deltas = [2000];
        this.companies = [];
        this.grid = undefined;
        this.snapshotFile = `./data/snapshot.csv`;
        this.deltasFile = `./data/deltas.csv`;
    }

    public parentGrid(grid: Grid) {
        this.grid = grid;
    }

    public async load() {
        const resSnapshot = await fetch(this.snapshotFile);
        const snapshot = await resSnapshot.text();
        await this.parseSnapshot(snapshot);

        fetch(this.deltasFile)
            .then((res) => res.text())
            .then((deltas) => this.parseDeltas(deltas));
    }

    private parseSnapshot(text: string) {
        const [headers, ...stocks] = text.split(`\n`);
        this.headers = headers.split(`,`);
        this.stocks = stocks.filter((stock) => stock !== ``).map((stock) => {
            const [
                name,
                companyName,
                price,
                change,
                changePercent,
                marketCap,
            ] = stock.split(`,`);

            this.companies.push(name);

            return new Stock({
                change: +change,
                changePercent,
                companyName,
                marketCap,
                name,
                price: +price,
            });
        });
    }

    private async parseDeltas(text: string) {
        const lines: string[][] = text
            .split(`\n`)
            .map((line) => line.split(`,`));

        // pull out the deltas
        lines
            .filter((line: string[]) => line.length === 1 && line[0] !== ``)
            .map((delta: string[]) => this.deltas.push(Number(delta[0])));

        // pause before starting updates
        await this.sleep(1500);

        // pull out the stock updates
        const updates = lines.filter((line: string[]) => line.length > 1);
        // ignore the first value currently in this.deltas
        // it's there for the initial snapshot data
        let [currentCompany, currentDelta] = [0, 1];
        // add updates to existing data, updating the grid as we go
        for (const update of updates) {
            const [, , price, change, changePercent] = update;
            const stock = new Stock({
                change: +change,
                changePercent,
                companyName: ``,
                marketCap: ``,
                name: this.companies[currentCompany],
                price: +price,
            });

            this.stocks.push(stock);
            this.grid!.updateStock(stock);

            currentCompany++;
            // pause before next set of updates
            if (currentCompany === this.companies.length) {
                currentCompany = 0;
                await this.sleep(this.deltas[currentDelta]);
                currentDelta++;
            }
        }
        // restart updating with complete set of stock data
        this.updateStocks();
    }

    private async updateStocks() {
        let [currentCompany, currentDelta] = [0, 0];
        for (const stock of this.stocks) {
            this.grid!.updateStock(stock);
            currentCompany++;
            if (currentCompany === this.companies.length) {
                currentCompany = 0;
                await this.sleep(this.deltas[currentDelta]);
                currentDelta++;
            }
        }
        // let's take it back to the start
        this.updateStocks();
    }

    private sleep(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
