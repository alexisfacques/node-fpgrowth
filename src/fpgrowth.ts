import { EventEmitter } from 'events';
import { FPTree, IPrefixPath, ItemsCount } from './fptree';
import { FPNode } from './fpnode';

export interface IFPGrowthEvents<T> {
    on(event: 'data', listener: (itemset: Itemset<T>) => void): this;
    on(event: string, listener: Function): this;
}

export interface Itemset<T> {
    items: T[],
    support: number
}

export class FPGrowth<T> extends EventEmitter implements IFPGrowthEvents<T> {
    /**
     * The transactions from which you want to mine itemsets.
     */
    private _transactions: T[][];

    /**
     * Output of the algorithm: The mined frequent itemsets.
     */
    private _itemsets: Itemset<T>[] = [];

    /**
     * FPGrowth is an algorithm for frequent item set mining and association rule
     * earning over transactional databases.
     * It was proposed by Han et al. (2000). FPGrowth is a very fast and memory efficient algorithm. It uses a special internal structure called an FP-Tree.
     *
     * @param  {number} _support 0 < _support < 1. Minimum support of itemsets to mine.
     */
    constructor( private _support: number /*, private _confidence: number*/ ) {
        super();
    }

    /**
     * Executes the FPGrowth Algorithm.
     * You can keep track of frequent itemsets as they are mined by listening to the 'data' event on the FPGrowth object.
     * All mined itemsets, as well as basic execution stats, are returned at the end of the execution through a callback function or a Promise.
     *
     * @param  {T[][]}              transactions The transactions from which you want to mine itemsets.
     * @param  {IAprioriResults<T>} cb           Callback function returning the results.
     * @return {Promise<IAprioriResults<T>>}     Promise returning the results.
     */
    public exec( transactions: T[][], cb?: (result: Itemset<T>[]) => any ): Promise<Itemset<T>[]> {
        this._transactions = transactions;
        // Relative support.
        this._support = Math.ceil(this._support * transactions.length);

        // First scan to determine the occurence of each unique item.
        let supports: ItemsCount = this._getDistinctItemsCount(this._transactions);

        return new Promise<Itemset<T>[]>( (resolve, reject) => {
            // Building the FP-Tree...
            let tree: FPTree<T> = new FPTree<T>(supports,this._support).fromTransactions(this._transactions);

            // Running the algorithm on the main tree.
            // All the frequent itemsets are returned at the end of the execution.
            let result: Itemset<T>[] = this._fpGrowth(tree,this._transactions.length);

            if(cb) cb(result);
            resolve(result);
        });
    }

    /**
     * RECURSIVE CALL - Returns mined itemset from each conditional sub-FPTree of the given FPtree.
     *
     * @param  {FPTree<T>}  tree          The FPTree you want to mine.
     * @param  {number}     prefixSupport The support of the FPTree's current prefix.
     * @param  {T[]}        prefix        The current prefix associated with the FPTree.
     * @return {Itemset<T>}               The mined itemsets.
     */
    private _fpGrowth( tree: FPTree<T>, prefixSupport: number, prefix: T[] = [] ): Itemset<T>[] {
        // Test whether or not the FP-Tree is single path.
        // If it is, we can short-cut the mining process pretty efficiently.
        // TODO: let singlePath: FPNode<T>[] = tree.getSinglePath();
        // TODO: if(singlePath) return this._handleSinglePath(singlePath, prefix);

        // For each header, ordered ascendingly by their support, determining the prefix paths.
        // These prefix paths represent new transactions to mine in a new FPTree.
        // If no prefix path can be mined, the algorithm stops.
        return tree.headers.reduce<Itemset<T>[]>( (itemsets: Itemset<T>[], item: T) => {
            let support: number = Math.min(tree.supports[JSON.stringify(item)],prefixSupport);
            // Array copy.
            let currentPrefix: T[] = prefix.slice(0);
            currentPrefix.push(item);

            // Prefix is a mined itemset.
            itemsets.push(this._getFrequentItemset(currentPrefix,support));

            // Method below generates the prefix paths of the current item, as well as the support of
            // each item composing the prefix paths, and returns a new conditional FPTree if one can be created.
            let childTree: FPTree<T> = tree.getConditionalFPTree(item);
            // If a conditional tree can be mined... mine it recursively.
            if(childTree) return itemsets.concat(this._fpGrowth(childTree,support,currentPrefix));
            return itemsets;
        }, []);
    }

    /**
     * Handles the mining of frequent itemsets over a single path tree.
     *
     * @param  {FPNode<T>[]} singlePath The given single path.
     * @param  {T[]}         prefix     The prefix associated with the path.
     * @return {Itemset<T>}             The mined itemsets.
     */
    private _handleSinglePath( singlePath: FPNode<T>[], prefix: T[] ): Itemset<T>[] {
        // TODO
        return [];
    }

    /**
     * Returns and emit through an event a formatted mined frequent itemset.
     *
     * @param  {T[]}        itemset The items of the frequent itemset.
     * @param  {number}     support The support of the itemset.
     * @return {Itemset<T>}         The formatted itemset.
     */
    private _getFrequentItemset( itemset: T[], support: number ): Itemset<T> {
        let ret: Itemset<T> = {
            items: itemset,
            support: support
        };
        this.emit('data', ret);
        return ret;
    }

    /**
     * Returns the occurence of single items in a given set of transactions.
     *
     * @param  {T[][]}      transactions The set of transaction.
     * @return {ItemsCount}              Count of items (stringified items as keys).
     */
    private _getDistinctItemsCount( transactions: T[][] ): ItemsCount {
        return transactions.reduce<ItemsCount>( (count: ItemsCount, arr: T[]) => {
            return arr.reduce<ItemsCount>( (count: ItemsCount, item: T) => {
                count[JSON.stringify(item)] = (count[JSON.stringify(item)] || 0) + 1;
                return count;
            }, count);
        }, {});
    }

}
