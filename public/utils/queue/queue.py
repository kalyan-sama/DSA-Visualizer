#Queue implementation using python

MAX_QUEUE_SIZE = 15

class Queue:
    def __init__(self):
        # Initialize empty list to store queue elements.
        self.queue_items = []

    def is_empty(self):
        # Check if queue is empty or not.
        return len(self.queue_items) == 0
    
    def is_full(self):
        # Check if queue is full
        return len(self.queue_items) >= MAX_QUEUE_SIZE
    
    def insert_front(self, item):
        # Add item to the front of the queue
        if not self.is_full():
            self.queue_items.insert(0, item)
        else:
            raise Exception(f"Queue is full, cannot insert more than {MAX_QUEUE_SIZE} items")
        
    def delete_rear(self):
        # Remove and return the rear item from the queue
        if not self.is_empty():
            return self.queue_items.pop()
        else:
            raise Exception("Queue is empty.")
        
    def front(self):
        # Check the front element in the queue
        if not self.is_empty():
            return self.queue_items[0]
        else:
            raise Exception("Queue is empty.")
        
    def rear(self):
        # Check the rear element in the queue
        if not self.is_empty():
            return self.queue_items[-1]
        else:
            raise Exception("Queue is empty.")
        
    def size(self):
        # Return the number of items in the queue
        return len(self.queue_items)
    

if __name__ == "__main__":
    # Create a queue
    queue = Queue()

    # Inserting items at the front of the queue
    for i in range(1, 17):  # Inserting 16 items into queue
        try:
            queue.insert_front(i)
            print(f"Inserted {i} at the front of the queue")
        except Exception as e:
            print(f"Failed to insert {i} into queue with reason: {e}")

    # Print the current queue size
    print("Queue size:", queue.size())  # size: 15

    # Check front and rear items
    print("Front item:", queue.front())  # Front: 15
    print("Rear item:", queue.rear())   # Rear: 1

    # Delete an item from the rear of the queue
    deleted_item = queue.delete_rear()
    print("Deleted item from rear:", deleted_item)  # Deleted item: 1

    # Dequeue all items from the queue
    while True:
        try:
            print("Deleted item from rear:", queue.delete_rear())
        except Exception as e:
            print(f"Cannot delete from queue. Reason: {e}")
            break