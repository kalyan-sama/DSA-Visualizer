# Merge sort implementation usinq python

def merge_sort(arr): # returns a sorted array

    # Base condition
    if len(arr) <= 1:
        return arr
    
    # calculate the middle index of the array
    mid = len(arr) // 2

    # Divide the array at middle index and recursively sort the 2 halves
    left_array = merge_sort(arr[:mid]) 
    right_array = merge_sort(arr[mid:])

    # Return the sorted array
    return merge(left_array, right_array)

def merge(left, right): # Merge 2 sorted arrays into one sorted array
    result = []
    left_index, right_index = 0, 0

    # Compare elements from left and right and add the smaller one to the result
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1

    # Add remaining elements from left and right arrays to result
    while left_index < len(left) :
        result.append(left[left_index])
        left_index += 1

    while right_index < len(right):
        result.append(right[right_index])
        right_index += 1

    # Return the sorted merged array 
    return result


if __name__ == "__main__":

    unsorted_array = [64, 34, 25, 12, 22, 11, 90]
    print("Unsorted array:", unsorted_array)
    
    sorted_array = merge_sort(unsorted_array)
    print("Sorted array:", sorted_array)
