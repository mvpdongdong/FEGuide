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
    const DFS = function(arr, index, len) {
        if (index === len) {
            result.push(arr.slice())
            return
        }

        for (let i = index; i < len; i++) {
            swap(arr, index, i)
            DFS(arr, index + 1, len)
            swap(arr, index, i);
        }
    }

    DFS(nums, 0, nums.length)

    return result
};
