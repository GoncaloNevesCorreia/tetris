class Queue {
    constructor() {
        this.items = new Array(0);
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        return this.items.shift();
    }

    clear() {
        this.items = new Array(0);
    }
}

export { Queue };
