interface IStock {
    [key: string]: string | number;
    name: string;
    companyName: string;
    price: number;
    change: number;
    changePercent: string;
    marketCap: string;
}

class Stock implements IStock {
    [key: string]: string | number;

    public name: string;
    public companyName: string;
    public price: number;
    public change: number;
    public changePercent: string;
    public marketCap: string;

    constructor(data: IStock) {
        this.name = data.name;
        this.companyName = data.companyName;
        this.price = data.price;
        this.change = data.change;
        this.changePercent = data.changePercent;
        this.marketCap = data.marketCap;
    }
}
