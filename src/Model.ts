class Model {
    public headers: string[];
    public stocks: IStock[];
    public deltas: number[];

    private grid: Grid | undefined;
    private companies: string[];
    private updates: string[][];

    private snapshotFile: string;
    private deltasFile: string;

    constructor() {
        this.headers = [];
        this.stocks = [];
        this.deltas = [];
        this.companies = [];
        this.updates = [];
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

        const resDeltas = await fetch(this.deltasFile);
        const deltas = await resDeltas.text();
        await this.parseDeltas(deltas);

        setTimeout(() => {
            this.updateStocks();
        }, 2000);
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

    private parseDeltas(text: string) {
        const lines: string[][] = text
            .split(`\n`)
            .map((line) => line.split(`,`));

        this.deltas = lines
            .filter((line: string[]) => line.length === 1 && line[0] !== ``)
            .map((delta: string[]) => Number(delta[0]));

        this.updates = lines.filter((line: string[]) => line.length > 1);
    }

    private async updateStocks() {
        let currentCompany: number = 0;
        let currentDelta: number = 0;
        for (const update of this.updates) {
            const [, , price, change, changePercent] = update;
            if (price !== ``) {
                const stock = new Stock({
                    change: +change,
                    changePercent,
                    companyName: ``,
                    marketCap: ``,
                    name: this.companies[currentCompany],
                    price: +price,
                });
                this.grid!.updateStock(stock);
            }
            currentCompany++;
            if (currentCompany === 10) {
                currentCompany = 0;
                await this.sleep(this.deltas[currentDelta]);
                currentDelta++;
            }
        }
        // go back to the beginning and repeat
        await this.sleep(2000);
        this.stocks.map((stock: IStock) => {
            this.grid!.updateStock(stock);
        });
        await this.sleep(1500);
        this.updateStocks();
    }

    private sleep(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
