window.onload = () => {
    (async function() {
        const model = new Model();
        await model.load();
    })();
};
