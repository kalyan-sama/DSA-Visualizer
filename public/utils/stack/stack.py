# Stack implementation using python 


MAX_STACK_SIZE = 15

class Stack:
    def __init__(self):
        # Initialize empty list to store stack elements.
        self.stack_items = []

    def is_empty(self):
        # Check if stack is empty or not.
        return len(self.stack_items) == 0
    
    def is_full(self):
        # Check if stack is full
        return len(self.stack_items) >= MAX_STACK_SIZE
    
    def push(self, item):
        # Add item to stack
        if not self.is_full():
            self.stack_items.append(item)
        else:
            raise Exception(f"Stack is full, cannot push more than {MAX_STACK_SIZE} items")
        
    def pop(self):
        # Remove and return the top item from the stack
        if not self.is_empty():
            return self.stack_items.pop()
        else:
            raise Exception("Stack is empty.")
        
    def top(self):
        # Check the top element in the stack
        if not self.is_empty():
            return self.stack_items[-1]
        else:
            raise Exception("stack is empty.")
        
    def size(self):
        # Return the number of items in the stack
        return len(self.stack_items)
    

if __name__ == "__main__":
    # create a stack
    stack  = Stack()

    # pushing items into stack
    for i in range(1, 17): # pushing 16 items into stack
        try:
            stack.push(i)
            print(f"pushed {i} into stack")
        except Exception as e:
            print(f"failed to push {i} into stack with reason: {e}")

    # stack = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 15 ]

    # Print the current stack size
    print("Stack size:", stack.size())  # size: 15

    # Peek top item
    print("Top item:", stack.top())  # Top: 15

    # Pop an item from the stack
    popped_item = stack.pop()
    print("Popped item:", popped_item)  # Popped item: 15

    # stack = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]

    # Pop all items
    while True:
        try:
            print("Popped item:", stack.pop())
        except Exception as e:
            print(f"cannot pop from stack. Reason: {e}")
            break
