/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    const result = []
    const swap = function (arr, i, j) {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    const DFS = function(arr, len, index) {
    if (index === len) {
        result.push(arr.slice())
        return
    }

    for (let i = index; i < len; i++) {
        swap(arr, index, i)
        DFS(arr, len, index + 1)
        swap(arr, index, i);
    }
    }

    DFS(nums, nums.length, 0)

    return result
};
