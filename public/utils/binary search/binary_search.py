# Binary search implementation using python
# Can be implemented in 2 ways:
#   1.Iterative approach
#   2.Recursive approach    

# 1. Iterative approach
def binary_search_iterative(arr, target):
    # Retrurn the index of the target if found, otherwise -1

    left = 0
    right = len(arr) -1

    while left <= right:
        #calculate the middle index
        mid = (left + right)//2

        # Check if middle element is target
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1

    return -1

# 2.Recursive approach
def binary_search_recursive(arr, target, left, right):
    # Retrurn the index of the target if found, otherwise -1

    # Base condition
    if left > right:
        return -1
    
    # Calculate the middle index of the array
    mid = (left + right)//2

    # Check if middle element is target
    if arr[mid] == target:
        return mid
    
    # If target is greater, search in the right half
    elif arr[mid] < target:
        binary_search_recursive(arr, target, mid + 1, right)

    # If target is smaller, search in the left hal
    else:
        binary_search_recursive(arr, target, left, mid - 1)


if __name__ == "__main__":
    # Array MUST be sorted for binary search
    array = [11, 12, 22, 25, 34, 64, 90]
    
    # iterative binary search function
    target = 25
    result = binary_search_iterative(array, target)
    if result != -1:
        print(f"Iterative: Element {target} found at index {result}")
    else:
        print(f"Iterative: Element {target} not found in the array")
    
    # recursive binary search function
    result = binary_search_recursive(array, target, 0, len(array) - 1)
    if result != -1:
        print(f"Recursive: Element {target} found at index {result}")
    else:
        print(f"Recursive: Element {target} not found in the array")
    