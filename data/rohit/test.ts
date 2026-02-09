function countChar(data: string) : Record<string, number>{
    const charCount : Record<string, number> = {};
    for (const char of data)
    {
        console.log(char);
        if(charCount[char])
        {
            charCount[char] += 1;
        }
        else
        {
            charCount[char] = 1
        }
    }

    return charCount;

}

console.log(countChar("Hello Rohit Omar"));

function countChar(data) {
    const charCount = {};
    for (const char of data) {
        console.log(char);
        if (charCount[char]) {
            charCount[char] += 1;
        }
        else {
            charCount[char] = 1;
        }
    }
    return charCount;
}
console.log(countChar("Hello Rohit Omar"));


function hasDuplicateCharacters(str: string): boolean {
    const charSet: Set<string> = new Set(); // Use a Set to track unique characters

    for (const char of str) {
        if (charSet.has(char)) {
            // If character already exists in the Set, duplicate found
            return true;
        }
        charSet.add(char);
    }

    // No duplicates found
    return false;
}



class Stack <T> {
    private items : T[] = []

    push(element: T) : void {
        this.items.push(element);
    }

    pop(): T | undefined {
        if(this.items.length === 0)
            return undefined;
        return this.items.pop();
    }

    peak(): T | undefined {
        if(this.items.length === 0)
            return undefined;
        return this.items[this.items.length - 1];
    }

}

const stack1 = new Stack<number>();
stack1.push(3);
stack1.push(4);
stack1.push(5);
console.log(stack1.pop());
console.log(stack1.peak());
console.log(stack1.peak());

  

// 1. Reverse a String
function reverseString(str: string): string {
    return str.split('').reverse().join('');
}
// Usage example
console.log(reverseString("hello")); // Output: "olleh"



// 2. Check if a string is a palindrome
function isPalindrome(str: string): boolean {
    const reversed = str.split('').reverse().join('');
    return str === reversed;
}
console.log(isPalindrome("racecar")); // Output: true
console.log(isPalindrome("hello"));   // Output: false



// 3. Remove duplicates from an array
function removeDuplicates<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}
console.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // Output: [1,2,3,4]



// 4. Find the maximum value in a number array
function maxInArray(arr: number[]): number {
    return Math.max(...arr);
}
console.log(maxInArray([3,7,2,9,4])); // Output: 9


// 5. Merge two arrays and remove duplicates
function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
    return Array.from(new Set([...arr1, ...arr2]));
}
console.log(mergeArrays([1,2,3],[3,4,5])); // Output: [1,2,3,4,5]


// 6. Find the first non-repeating character in a string
function firstNonRepeatingChar(str: string): string | null {
    for (const char of str) {
        if (str.indexOf(char) === str.lastIndexOf(char)) {
            return char;
        }
    }
    return null;
}
console.log(firstNonRepeatingChar("swiss")); // Output: "w"

// 7. Flatten a nested array
function flattenArray(arr: any[]): any[] {
    return arr.flat(Infinity);
}
console.log(flattenArray([1, [2, [3, 4], 5]])); // Output: [1,2,3,4,5]

// 8. Count occurrences of each character in a string
function charCount(str: string): Record<string, number> {
    const count: Record<string, number> = {};
    for (const char of str) {
        count[char] = (count[char] || 0) + 1;
    }
    return count;
}
console.log(charCount("hello")); // Output: {h:1, e:1, l:2, o:1}


// 9. Rotate an array by k steps
function rotateArray<T>(arr: T[], k: number): T[] {
    const n = arr.length;
    k = k % n;
    return [...arr.slice(-k), ...arr.slice(0, n - k)];
}
console.log(rotateArray([1,2,3,4,5], 2)); // Output: [4,5,1,2,3]


// 10. Find common elements in two arrays
function commonElements<T>(arr1: T[], arr2: T[]): T[] {
const set2 = new Set(arr2);
return arr1.filter(item => set2.has(item));
}
console.log(commonElements([1,2,3,4], [3,4,5,6])); // Output: [3,4]
