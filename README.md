# ![screenshot](/screenshot.png)

# Financial Ticker

Implements a financials ticker grid using the CSV data provided.

**Visit the [demo](https://financial-ticker.netlify.com/).**

## Initial View

Load and parse the data in `public/data/snapshot.csv` into a model, and render a grid based on that to the DOM.

## Updates

Work through `public/data/deltas.csv` and emit update messages to parse.

When only a number exists on a line, that amount of time, in milliseconds, should be waited until processing the next set of deltas. When the last set of deltas is processed, return to the start of the file and repeat.

Each set of deltas should should be merged into the existing dataset and then propagated to the DOM in the most efficient manner possible.

Provide notification that an item has been updated via a visual flare in the UI.

## Roadmap

-   [ ] Render a chart in canvas based on the tick data to show the changes over time. It should update on each tick.

## Running locally

You will need **Node JS** and **npm** installed. To install all dependencies, navigate to within the root directory and run the following command:

```
npm install
```

There is [a simple server](https://github.com/TheJaredWilcurt/NPM-Free-Server) included to serve the files locally. To use this run:

```
npm run serve
```

## Development

To compile the TypeScript you can run either of the following commands:

```
npm run build
npm run watch
```

The second command will watch for any changes and re-compile the project.

To format or lint the TypeScript code use the following commands:

```
npm run format
npm run lint
```
