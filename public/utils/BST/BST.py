#Implementation of Binary search Tree (BST) using python

# Define a node class for the tree
# Each node contains 3 :
#   data: data stored in the node
#   left: Pointer to the left child
#   right: Pointer to the right child

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None  # Initialize the root node of BST

    def insert(self, data):
        # Base condition: if tree is empty, insert at root
        if self.root is None:
            self.root = Node(data)
            return
        
        #start traversing from the root node
        current_node = self.root
        while True:
            # If the data is less than current node. Check if current_node.left is empty or not
            #   If current_node.left is empty, insert node as the left child of current_node
            #   else move to left child of current_node and repeat
            if data < current_node.data:
                if current_node.left is None:
                    current_node.left = Node(data)
                    break
                current_node = current_node.left

            # Similarly for right node
            elif data > current_node.data:
                if current_node.right is None:
                    current_node.right = Node(data)
                    break
                current_node = current_node.right

            elif data == current_node.data:
                raise Exception(f'Node with data {data} already exists in the tree. Cannot insert duplicate data')
            
    def search(self, data):
        # search for the node in the current tree
        # start from root node
        current_node = self.root
        while current_node:
            if current_node.data == data:
                return current_node
            elif data < current_node.data:
                current_node = current_node.left
            elif data > current_node.data:
                current_node = current_node.right
        return None # data not found
    
    # Inorder successsor for a given node
    def inorder_successor(self, node):
        current_node = node
        while current_node.left:
            current_node = current_node.left
        return current_node
    
    def delete(self, data):
        # Search for the element in the current tree and delete if found

        parent = None
        node_to_delete = self.root

        # Find the node to be deleted and its parent
        while node_to_delete and node_to_delete.data != data:
            parent = node_to_delete
            if data < node_to_delete.data:
                node_to_delete = node_to_delete.left
            else:
                node_to_delete = node_to_delete.right

        if node_to_delete == None:
            raise Exception(f"Node with data {data} does not exists in the tree.")
        
        # Case 1: node_to_delete has no childres
        #       Delete the node directly

        if node_to_delete.left is None and node_to_delete.right is None:   
            print(f"Node {data} has no children. Deleting directly")
            if node_to_delete != self.root:
                # Check whether node_to_delete is left or right child to its parent. Remove the reference accordingly.
                if parent.left == node_to_delete:
                    parent.left = None
                else:
                    parent.right = None
            else:
                self.root = None

        # Case 2: node_to_delete has 2 children
        #       find the inorder successor of the node_to_delete.
        #       Inorder succcessor will be the leaf node which is smallest after node_to_delete
        #       Replace the node_to_delete with the inorder successor

        elif node_to_delete.left and node_to_delete.right:
            print(f"Node {data} has two children, {node_to_delete.left.data} and {node_to_delete.right.data}. \
                  \nReplacing with the inorder successor and deleting the inorder successor")
            successor = self.inorder_successor(node_to_delete.right)
            print("Inorder successor: ", successor.data)
            successor_data = successor.data
            self.delete(successor.data)
            node_to_delete.data = successor_data


        # Case 3: node_to_delete has exactly one child
        #       Child should replace the node_to_delete
        #       check whether node_to_delete is left or right child to its parent.
        #           update the reference of parent with the child of node_to_delete

        elif node_to_delete.left or node_to_delete.right:
            child = node_to_delete.left if node_to_delete.left else node_to_delete.right
            print(f"Node {data} has one child. Replacing with child {child.data}")
            if node_to_delete != self.root:
                if node_to_delete == parent.left:
                    parent.left = child
                else:
                    parent.right = child
            else:
                self.root = child


    def inorder_traversal(self): # Print inorder traversal of nodes in tree
        if self.root is None:
            return
        self._inorder(self.root)
        print()

    def _inorder(self, node):
        if node:
            self._inorder(node.left)
            print(node.data, end = " ")
            self._inorder(node.right)
        
                
if __name__ == "__main__":
    bst = BinarySearchTree()
    bst.insert(10)
    bst.insert(8)
    bst.insert(12)
    bst.insert(6)
    bst.insert(9)
    bst.insert(11)
    bst.insert(14)
    bst.insert(4)
    bst.insert(5)
    bst.insert(15)

    bst.inorder_traversal()

    try:
        bst.delete(10)
    except Exception as e:
        print("Cannot delete, " + str(e))
    
    bst.inorder_traversal()
