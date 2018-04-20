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

```typescript
import { FPGrowth, Itemset } from 'node-fpgrowth';

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
    .then( (itemsets: Itemset<number>[]) => {
      // Returns an array representing the frequent itemsets.
    });

```

**Node-FPGrowth** is compatible with [browserify](http://browserify.org/) and [webpack](https://webpack.js.org/).
Alternatively, you can import/serve the browserified `fpgrowth-client.js` file found in the `dist` folder:

```html
<script src="./dist/fpgrowth-client.js"></script>
<script>
  var transactions = [
      [1, 3, 4],
      [2, 3, 5],
      [1, 2, 3, 5],
      [2, 5],
      [1, 2, 3, 5]
  ];

  var fpg = new fpgrowth.FPGrowth(.4);

  fpg.exec(transactions, function (itemsets) {
      console.log(`Finished executing FPGrowth. ${itemsets.length} frequent itemset(s) were found.`);
  });
</script>
```

### Building from source
- Clone this repository:
  ```bash
  git clone https://github.com/alexisfacques/Node-FPGrowth.git
  cd Node-FPGrowth
  ```
- Install the project's dependencies with:
  ```bash
  npm install
  ```
- Compile the module's sources to executable JavaScript:
  ```bash
  npm run tsc
  ```
- This should run the [example](./examples/example.js) bundled with the module:
  ```bash
  npm test
  ```
- This should recreate a browserified version, `./dist/fpgrowth-client.js`, of the module:
  ```bash
  npm run browserify
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
