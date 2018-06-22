class Model {
    constructor() {}

    public load = (filePath: string) => {
        fetch(filePath)
            .then((res) => res.text())
            .then((text) => this.parseCSV(text));
    }

    private parseCSV = (text: string) => {
        console.log(text);
    }
}
