var fpgrowth = require("../dist/fpgrowth");

var transactions = [
    [1, 3, 4],
    [2, 3, 5],
    [1, 2, 3, 5],
    [2, 5],
    [1, 2, 3, 5]
];


// Execute FPGrowth with a minimum support of 40%.
var fpgrowth = new fpgrowth.FPGrowth(.4);
console.log(`Executing FPGrowth...`);

// Returns itemsets 'as soon as possible' through events.
fpgrowth.on('data', function (itemset) {
    // Do something with the frequent itemset.
    var support = itemset.support;
    var items = itemset.items;
    console.log(`Itemset { ${items.join(',')} } is frequent and have a support of ${support}`);
});

// Execute FPGrowth on a given set of transactions.
fpgrowth.exec(transactions)
    .then(function (result) {
      // Returns both the collection of frequent itemsets and execution time in millisecond.
      var frequentItemsets = result.itemsets;
      var executionTime = result.executionTime;
      console.log(`Finished executing FPGrowth. ${frequentItemsets.length} frequent itemsets were found in ${executionTime}ms.`);
  });
