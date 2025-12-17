class Stack<T> {
    private items: T[] = [];

    // Push element onto stack
    push(element: T): void {
        this.items.push(element);
    }

    // Remove and return top element
    pop(): T | undefined {
        return this.items.pop();
    }

    // Peek top element without removing
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    // Check if stack is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get stack size
    size(): number {
        return this.items.length;
    }
}

// Example usage
const stack = new Stack<number>();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
console.log(stack.pop());  // 20
console.log(stack.size()); // 1