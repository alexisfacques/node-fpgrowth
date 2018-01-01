import { EventEmitter } from 'events';
import { FPTree, IPrefixPath } from './fptree';
import { FPNode } from './fpnode';
import { ItemsCount } from './items-count';

export interface IFPGrowthEvents<T> {
    on(event: 'data', listener: (itemset: Itemset<T>) => void): this;
    on(event: string, listener: Function): this;
}

export interface IFPGrowthResults<T> {
    itemsets: Itemset<T>[],
    executionTime: number
}

export interface Itemset<T> {
    items: T[],
    support: number
}

export class FPGrowth<T> extends EventEmitter implements IFPGrowthEvents<T> {
    private _transactions: T[][];
    private _supports: ItemsCount;

    private _itemsets: Itemset<T>[] = [];

    constructor( private _support: number /*, private _confidence: number*/ ) {
        super();
    }

    public exec( transactions: T[][], cb?: (result: IFPGrowthResults<T>) => any ): Promise<IFPGrowthResults<T>> {
        this._transactions = transactions;
        // Relative support
        this._support = Math.ceil(this._support * transactions.length);
        // First scan to determine the occurence of each unique item.
        this._supports = this._getDistinctItemsCount(this._transactions);

        return new Promise<IFPGrowthResults<T>>( (resolve, reject) => {
            let time = process.hrtime();

            // Building the FP-Tree...
            let tree: FPTree<T> = new FPTree<T>(this._supports,this._support).fromTransactions(this._transactions);

            console.log(this._fpGrowth(tree,this._transactions.length));
        });
    }

    private _fpGrowth( tree: FPTree<T>, prefixSupport: number, prefix: T[] = [] ): Itemset<T>[] {
        // Test whether or not the FP-Tree is single path.
        // If it is, we can short-cut the mining process pretty efficiently.
        //let singlePath: FPNode<T>[] = tree.getSinglePath();
        //if(singlePath) return this._handleSinglePathTree(singlePath); //TODO.

        return tree.headers.reduce<Itemset<T>[]>( (itemsets: Itemset<T>[], item: T) => {
            console.log(`Support of item ${item}: ${tree.supports[JSON.stringify(item)]} VS. Prefix support: ${prefixSupport}`);

            let support: number = Math.min(tree.supports[JSON.stringify(item)],prefixSupport);

            let currentPrefix: T[] = prefix.slice(0);
            currentPrefix.push(item);

            itemsets.push(this._getFrequentItemset(currentPrefix,support));

            let childTree: FPTree<T> = tree.getConditionalFPTree(item);
            if(childTree) return itemsets.concat(this._fpGrowth(childTree,support,currentPrefix));
            return itemsets;
        }, []);
    }

    private _handleSinglePathTree( singlePath: FPNode<T>[] ): void {

    }

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
