class Model {
    public headers: string[];
    public stocks: IStock[];

    constructor() {
        this.headers = [];
        this.stocks = [];
    }

    public async load(snapshotFile: string) {
        const res = await fetch(snapshotFile);
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
