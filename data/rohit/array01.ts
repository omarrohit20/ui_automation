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