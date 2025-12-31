//intersect two arrays and return the common elements
export function intersectArrays<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => set2.has(item));
}
// Example usage
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [4, 5, 6, 7, 8];
const commonElements = intersectArrays(arr1, arr2);
console.log(commonElements); // Output: [4, 5]



//remove duplicates from an array
export function removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}
// Example usage
const arrayWithDuplicates = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = removeDuplicates(arrayWithDuplicates);
console.log(uniqueArray); // Output: [1, 2, 3, 4, 5]



//merge two arrays and remove duplicates
export function mergeAndRemoveDuplicates<T>(array1: T[], array2: T[]): T[] {
    return Array.from(new Set([...array1, ...array2]));
}       
// Example usage
const arrayA = [1, 2, 3];
const arrayB = [3, 4, 5];
const mergedArray = mergeAndRemoveDuplicates(arrayA, arrayB);
console.log(mergedArray); // Output: [1, 2, 3, 4, 5]



//find difference between two arrays
export function differenceBetweenArrays<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => !set2.has(item));
}
// Example usage
const arrA = [1, 2, 3, 4, 5];
const arrB = [4, 5, 6, 7, 8];
const difference = differenceBetweenArrays(arrA, arrB);
console.log(difference); // Output: [1, 2, 3]



//rotate an array DSA
export function rotateArray<T>(array: T[], k: number): T[] {
    const n = array.length;
    k = k % n; // In case k is greater than array length
    return array.slice(n - k).concat(array.slice(0, n - k));
}
// Example usage
const arr = [1, 2, 3, 4, 5];
const k = 2;
const rotatedArray = rotateArray(arr, k);
console.log(rotatedArray); // Output: [4, 5, 1, 2, 3]


//Generate all Subarrays
export function generateSubarrays<T>(array: T[]): T[][] {
    const subarrays: T[][] = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j <= array.length; j++) {
            subarrays.push(array.slice(i, j));
        }
    }
    return subarrays;
}
// Example usage
const arr = [1, 2, 3];
const allSubarrays = generateSubarrays(arr);
console.log(allSubarrays); // Output: [[1], [1, 2], [1, 2, 3], [2], [2, 3], [3]]


//maximum subarray sum using Kadane's Algorithm
export function maxSubarraySum(array: number[]): number {
    let maxSoFar = array[0];
    let maxEndingHere = array[0];
    for (let i = 1; i < array.length; i++) {
        maxEndingHere = Math.max(array[i], maxEndingHere + array[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}

// Example usage
const arr = [-2,1,-3,4,-1,2,1,-5,4];
const maxSum = maxSubarraySum(arr);
console.log(maxSum); // Output: 6 (subarray [4,-1,2,1])


//array spiral order traversal
export function spiralOrder(matrix: number[][]): number[] {
    const result: number[] = [];
    if (matrix.length === 0) return result;
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (let i = left; i <= right; i++) {
            result.push(matrix[top][i]);
        }
        top++;
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                result.push(matrix[bottom][i]);
            }
            bottom--;
        }   
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }   
            left++;
        }
    }
    return result;
}

// Example usage
const matrix = [
    [1, 2, 3], 
    [4, 5, 6],
    [7, 8, 9]
];
const spiralTraversal = spiralOrder(matrix);
console.log(spiralTraversal); // Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]


//Array Pair Sum
export function arrayPairSum(array: number[], targetSum: number): [number, number][] {
    const seen = new Set<number>();
    const pairs: [number, number][] = [];
    for (const num of array) {
        const complement = targetSum - num;
        if (seen.has(complement)) {
            pairs.push([complement, num]);
        }
        seen.add(num);
    }
    return pairs;
}
// Example usage
const arr = [1, 2, 3, 4, 5];
const target = 6;
const pairs = arrayPairSum(arr, target);
console.log(pairs); // Output: [[1, 5], [2, 4]]