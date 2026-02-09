
def countChar(data):
    charCount = {}
    for i in data:
        if i in charCount:
            charCount[i] += 1
        else:
            charCount[i] = 1
    return charCount

print(countChar("Hello Rohit Omar"))



def has_duplicate_characters(s: str) -> bool:
    # Using a set to track seen characters for efficient lookup
    seen_chars = set()
    for char in s:
        if char in seen_chars:
            return True  # Duplicate found
        seen_chars.add(char)
    return False  # No duplicates found



from typing import TypeVar, Generic, List

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self):
        self.items: List[T] = []
    
    def push(self, element: T) -> None:
        self.items.append(element)
    
    def pop(self) -> T:
        if self.is_empty():
            raise IndexError("Pop from an empty stack")
        return self.items.pop()
    
    def peek(self) -> T:
        if self.is_empty():
            raise IndexError("Peek from an empty stack")
        return self.items[-1]
    
    def is_empty(self) -> bool:
        return len(self.items) == 0
    
    def size(self) -> int:
         return len(self.items)


# Usage example
if __name__ == "__main__":
    stack = Stack[int]()  # Stack of integers
    stack.push(10)
    stack.push(20)
    stack.push(30)
    print(stack.peek())   # Output: 20
    print(stack.pop()) 
    print(stack.pop())# Output: 20


#reverse string and check palindrome
def funct(data : str) -> str:
    reversedStr = ""
    for i in data:
       reversedStr = i + reversedStr;
    if(reversedStr == data):
        return True;
    else:
        return False;
    
print (funct(["aabbcbbaab"]))

#remove duplicates from array
def funct(arr):
    seen = set()
    result = []
    for item in arr:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

print (funct([1, 2, 3, 3, 4, 9, 3]))

#find largest number in array
def findLargestNumber(arr):
    if not arr:
        return None
    largest = arr[0]
    for num in arr:
        if num > largest:
            largest = num
    return largest

print(findLargestNumber([3, 5, 7, 2, 8]))  # Output: 8

#find second largest number in array
def findSecondLargestNumber(arr):   
    first = second = float('-inf')
    for num in arr:
        if num > first:
            second = first
            first = num
        elif first > num > second:
            second = num
    return second if second != float('-inf') else None

print(findSecondLargestNumber([3, 5, 7, 2, 8]))  # Output: 7


#merge two sorted arrays
def mergeSortedArrays(arr1, arr2):
    merged = []
    i = j = 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            merged.append(arr1[i])
            i += 1
        else:
            merged.append(arr2[j])
            j += 1
    merged.extend(arr1[i:])
    merged.extend(arr2[j:])
    return merged


#6. Find the first non-repeating character in a string
def firstNonRepeatingChar(s: str) -> str:
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    for char in s:
        if char_count[char] == 1:
            return char
    return ""

#9. Rotate an array by k steps
def rotateArray(arr, k):
    n = len(arr)
    k = k % n  # Handle cases where k > n
    return arr[-k:] + arr[:-k]

#10. Find common elements in two arrays
def findCommonElements(arr1, arr2):
    set1 = set(arr1)
    set2 = set(arr2)
    return list(set1 & set2)