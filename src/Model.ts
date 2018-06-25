class Model {
    public headers: string[];
    public stocks: IStock[];

    private snapshot: string;

    constructor() {
        this.snapshot = "./data/snapshot.csv";
        this.headers = [];
        this.stocks = [];
    }

    public async load() {
        const res = await fetch(this.snapshot);
        const data = await res.text();
        await this.parseCSV(data);
    }

    private parseCSV(text: string) {
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
}
