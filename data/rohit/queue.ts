
class queue<t> {
    private items: t[] = [];

    // Enqueue element to the queue
    enqueue(element: t): void {
        this.items.push(element);
    };

    // Dequeue element from the queue
    dequeue(): t | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    };
    // Peek front element without removing
    front(): t | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    };
    
    // Check if queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    };
    // Get queue size
    size(): number {
        return this.items.length;
    };
}

// Example usage
const queue1 = new queue<number>();
queue1.enqueue(10);
queue1.enqueue(20);
console.log(queue1.front());