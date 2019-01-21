class Knapsack {
  constructor (possibleItems, weightLimit) {
    this.possibleItems = possibleItems;
    this.weightLimit = weightLimit;
    this.selectedItems = [];
  }

  solveZeroOneKnapsackProblem () {
    const numberOfRows = this.possibleItems.length + 1;
    const numberOfColumns = this.weightLimit + 1;
    const knapsackMatrix = Array(numberOfRows).fill(null).map(() => {
      return Array(numberOfColumns).fill(null);
    });

    for (let i = 0; i < numberOfRows; i++) {
      knapsackMatrix[i][0] = 0;
    }

    for (let i = 0; i < numberOfColumns; i++) {
      knapsackMatrix[0][i] = 0;
    }

    for (let itemIndex = 1; itemIndex <= this.possibleItems.length; itemIndex++) {
      for (let weightIndex = 1; weightIndex <= this.weightLimit; weightIndex++) {
        const currentItemWeight = this.possibleItems[itemIndex - 1].weight;
        const currentItemValue = this.possibleItems[itemIndex - 1].value;
        if (currentItemWeight > weightIndex) {
          knapsackMatrix[itemIndex][weightIndex] = knapsackMatrix[itemIndex - 1][weightIndex];
        } else {
          knapsackMatrix[itemIndex][weightIndex] = Math.max(
            knapsackMatrix[itemIndex - 1][weightIndex],
            currentItemValue + knapsackMatrix[itemIndex - 1][weightIndex - currentItemWeight]
          )
        }
      }
    }

    for (let i = this.possibleItems.length, j = this.weightLimit; i > 0; i--) {
      if (knapsackMatrix[i][j] - knapsackMatrix[i - 1][j]) {
        this.selectedItems.push(this.possibleItems[i - 1]);
        j = this.weightLimit - this.possibleItems[i - 1].weight;
      }
    }
  }
}

export default Knapsack;
