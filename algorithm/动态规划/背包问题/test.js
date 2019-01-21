import Knapsack from './Knapsack';
import KnapsackItem from './KnapsackItem';

const possibleKnapsackItems = [
  new KnapsackItem({ value: 5, weight: 4 }),
  new KnapsackItem({ value: 1, weight: 1 }),
  new KnapsackItem({ value: 7, weight: 5 }),
  new KnapsackItem({ value: 4, weight: 3 }),
];

const maxKnapsackWeight = 7;

const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

knapsack.solveZeroOneKnapsackProblem();
console.log(knapsack.selectedItems);
