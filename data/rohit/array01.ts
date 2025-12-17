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



//check if two arrays are equal
export function areArraysEqual<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}
// Example usage
const arrayX = [1, 2, 3];
const arrayY = [1, 2, 3];
const arrayZ = [1, 2, 4];
console.log(areArraysEqual(arrayX, arrayY));

