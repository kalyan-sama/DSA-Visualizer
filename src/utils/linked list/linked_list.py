# Implementing Linked List using python

# Define a Node class
# Each node contains 2 elements. 
# One is to store the data value and the other is to store the reference to the next node
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Create Linked List class
class LinkedList:
    def __init__(self):
        # Initialize an empty linked list with head pointer
        self.head = None

    def is_empty(self):
        # Check if the linked list is empty
        return self.head is None
    
    def length(self):
         # Return the number of nodes in the list
        length = 0
        current_node = self.head
        while current_node is not None:
            current_node = current_node.next
            length += 1
        return length
    
    def display(self):
        # Display the linked list 
        current_node = self.head
        print("HEAD -> ", end="")
        while current_node is not None:
            print(current_node.data, end="")
            print(" -> ", end="")
            current_node = current_node.next
        print("NULL")
    
    def insert(self, data):
        # Insert the data at the end of the list
        new_node = Node(data)

        # If list is empty, insert the node at HEAD
        if self.is_empty():
            self.head = new_node

        # else insert the node at the end of the list
        else:
            # start from head
            current_node = self.head
            # Traverse till the end of the list
            while current_node.next:
                current_node = current_node.next
            # Set the 'next' of the current_node node to new node
            current_node.next = new_node

    def insert_at_index(self, data, index):
        # Insert new node at a specified index
        if index < 0:
            raise Exception("Invalid index for insertion")
        
        # Create a new node
        new_node = Node(data)
        
        if index == 0:
            # Insert the node at the beginning

            # set the pointer to new_node to the first element in list i.e., the element which HEAD is pointing to
            new_node.next = self.head
            # update the HEAD pointer to point to the newly inserted node
            self.head = new_node
            return
        
        # Inserting at a specified index

        #Start traversing from the HEAD
        current_node = self.head

        #Iterate till one node before insertion point
        for i in range(index - 1):
            if current_node is None:
                raise Exception("Invalid index to insert. Index out of range")
            current_node = current_node.next # Move to next node

        if current_node is None:
            raise Exception("Invalid index to insert. Index out of range")
        
        # Copy the current node pointer to the new node pointer, so that new node points to the correct next node
        new_node.next = current_node.next
        #update the current node pointer to point to the newly inserted node
        current_node.next = new_node

    def delete_head(self):
        # Delete the first node (head) of the list and return its value
        if self.is_empty():
            raise Exception("Linked List is empty")
        current_node = self.head
        self.head = current_node.next

        return current_node.data

    def delete_tail(self):
        # Delete the last node (tail) of the list and return its value
        if self.is_empty():
            raise Exception("Linked List is empty")
        
        # If list has only one element, delete and return it
        if self.head.next is None:
            deleted_node = self.head
            return deleted_node.data
        
        # Start from HEAD and traverse till last but one element
        current_node = self.head
        while current_node.next.next is not None:
            current_node = current_node.next
        
        deleted_node = current_node.next

        # Remove reference to the last node
        current_node.next = None
        return deleted_node.data

    def delete_at_index(self, index):
        # Delete node at a particular index
        if self.is_empty():
            raise Exception("Linked List is empty")
        
        if index < 0:
            raise Exception("Invalid index for insertion")
        
        if index == 0:
            return self.delete_head()
        
        # start from HEAD
        current_node = self.head

        # Iterate till one node before the deletion point
        for i in range(index - 1):
            if current_node is None:
                raise Exception("Invalid index for deletion. Index out of range")
            current_node = current_node.next
        if current_node.next is None:
            raise Exception("Invalid index for deletion. Index out of range")
        
        deleted_node = current_node.next
        current_node.next = deleted_node.next

        return deleted_node.data
    
    def search(self, search_input):
        # Return the index of node if found

        if self.is_empty():
            raise Exception("List is empty")
        index = 0

        # Start from HEAD
        current_node = self.head

        # Iterate until None

        while current_node is not None:
            if current_node.data == search_input:
                return index
            index += 1
            current_node = current_node.next

        return -1 # Not found
    

if __name__ == "__main__":
    #Initialize the linked list
    ll = LinkedList()

    #Insert few elements into the linked list
    ll.insert(1)
    ll.insert(2)
    ll.insert(3)
    ll.insert(4)

    #Display the linked list
    ll.display()

    print("Linked list length: ", ll.length())
    
    #Search for an element
    print("Index of 4: ", ll.search(4))

    #Insset at index
    ll.insert_at_index(5, 4)
    ll.display()

    # Delete elements
    print("Deleted head:", ll.delete_head())  # 1
    print("Deleted tail:", ll.delete_tail())  # 4
    ll.display()
    print("Deleted at index 1:", ll.delete_at_index(1))
    ll.display()      