import { FPGrowth } from './fpgrowth';

let transactions: string[][] = [
    ['f','a','c','d','g','i','m','p'],
    ['a','b','c','f','l','m','o'],
    ['b','f','h','j','o','w'],
    ['b','c','k','s','p'],
    ['a','f','c','e','l','p','m','n']
];

let t: number[][] = [
    [1,3,4],
    [2,3,5],
    [1,2,3,5],
    [2,5],
    [1,2,3,5]
];

new FPGrowth<number>(.4)
    .exec(t)
    .then( (result) => console.log(result) )
    .catch( (e) => console.log(e) );
