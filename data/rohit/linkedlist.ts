//linked list implementation in TypeScript
class Node<T> {
    data: T
    next: Node<T> | null

    constructor(data: T) {
        this.data = data
        this.next = null
    }
}

export class LinkedList<T> {
    head: Node<T> | null
    tail: Node<T> | null
    size: number

    constructor() {
        this.head = null
        this.tail = null
        this.size = 0
    }
    
    // Add a new node at the end of the list
    append(data: T): void {
        const newNode = new Node(data)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            if (this.tail) {
                this.tail.next = newNode
                this.tail = newNode
            }
        }
        this.size++
    }
    
    // Remove a node from the list
    remove(data: T): boolean {
        if (!this.head) return false
        if (this.head.data === data) {
            this.head = this.head.next
            this.size--
            return true
        }
        let current = this.head
        while (current.next) {
            if (current.next.data === data) {
                current.next = current.next.next
                this.size--
                return true
            }
            current = current.next
        }
        return false
    }

    // Find a node in the list
    find(data: T): Node<T> | null {
        let current = this.head
        while (current) {
            if (current.data === data) {
                return current
            }
            current = current.next
        }
        return null
    }

    // Get the size of the list
    getSize(): number {
        return this.size
    }

    // Convert the list to an array
    toArray(): T[] {
        const array: T[] = []
        let current = this.head
        while (current) {
            array.push(current.data)
            current = current.next
        }
        return array
    }

    // Clear the list
    clear(): void {
        this.head = null
        this.tail = null
        this.size = 0
    }
}

// Example usage    
const list = new LinkedList<number>()
list.append(1)
list.append(2)
list.append(3)
console.log(list.toArray()) // [1, 2, 3]
list.remove(2)
console.log(list.toArray()) // [1, 3]   
console.log(list.find(3)) // Node { data: 3, next: null }
console.log(list.getSize()) // 2
list.clear()
console.log(list.toArray()) // []   
