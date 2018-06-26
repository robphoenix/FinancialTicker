class Model {
    public headers: string[];
    public stocks: IStock[];
    public deltas: number[];

    private snapshotFile: string;
    private deltasFile: string;

    constructor() {
        this.headers = [];
        this.stocks = [];
        this.deltas = [];
        this.snapshotFile = "./data/snapshot.csv";
        this.deltasFile = "./data/deltas.csv";
    }

    public async load() {
        const resSnapshot = await fetch(this.snapshotFile);
        const snapshot = await resSnapshot.text();
        await this.parseSnapshot(snapshot);

        const resDeltas = await fetch(this.deltasFile);
        const deltas = await resDeltas.text();
        await this.parseDeltas(deltas);
    }

    private parseSnapshot(text: string) {
        const [headers, ...stocks] = text.split("\n");
        this.headers = headers.split(",");
        this.stocks = stocks.filter((stock) => stock !== "").map((stock) => {
            const [
                name,
                companyName,
                price,
                change,
                changePercent,
                marketCap,
            ] = stock.split(",");
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
        const lines = text.split("\n").map((line) => line.split(","));
        this.deltas = lines
            .filter((line) => line.length === 1 && line[0] !== "")
            .map((delta) => Number(delta[0]));
    }
}
