# Node-FPGrowth
[FPGrowth Algorithm](https://en.wikibooks.org/wiki/Data_Mining_Algorithms_In_R/Frequent_Pattern_Mining/The_FP-Growth_Algorithm) frequent itemset mining algorithm implementation in TypeScript / JavaScript.

## Getting Started

### Installing

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).

Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
npm install --save node-fpgrowth
```

### Example of use

In your TypeScript project, import and use `FPGrowth` as follows. Same example with a JavaScript syntax is available [here](./examples/example.js).

```js
import { FPGrowth, Itemset, IFPGrowthResults } from 'node-fpgrowth';

let transactions: number[][] = [
    [1,3,4],
    [2,3,5],
    [1,2,3,5],
    [2,5],
    [1,2,3,5]
];

// Execute FPGrowth with a minimum support of 40%. Algorithm is generic.
let fpgrowth: FPGrowth<number> = new FPGrowth<number>(.4);

// Returns itemsets 'as soon as possible' through events.
fpgrowth.on('data', (itemset: Itemset<number>) => {
    // Do something with the frequent itemset.
    let support: number = itemset.support;
    let items: number[] = itemset.items;
});

// Execute FPGrowth on a given set of transactions.
fpgrowth.exec(transactions)
    .then( (result: IFPGrowthResults<number>) => {
        // Returns both the collection of frequent itemsets and execution time in millisecond.
        let frequentItemsets: Itemset<number>[] = result.itemsets;
        let executionTime: number = result.executionTime;
    });

```

### Building from source
- Clone this repository:
  ```bash
  git clone https://github.com/alexisfacques/Node-FPGrowth.git
  cd Node-FPGrowth
  ```
- Install the project's dependencies with `npm`:
  ```bash
  npm install
  ```
- Compile the project's sources to NodeJS executable JavaScript:
  ```bash
  npm run tsc
  ```
- This should allow you to execute the given [example](./examples/example.js) as follows:
  ```bash
  npm test
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
