# Linear search implementation using python

def linear_search(arr, target):
    # Return index of target if found, otherwise return -1
    #If there are multiple occurences of target, return index of first occurence

    # Iterate through each element of the array
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

def linear_search_all_occurences(arr, target):
    # Return list of indices of all occurences of target, if not found, return []
    occurences = []

    for index, element in enumerate(arr):
        if element == target:
            occurences.append(index)

    return occurences


if __name__ == '__main__':
    
    array = [64, 34, 25, 12, 22, 11, 90, 25]
    
    target = 25
    result = linear_search(array, target)
    if result != -1:
        print(f"Element {target} found at index {result}")
    else:
        print(f"Element {target} not found in the array")

    
    all_occurences = linear_search_all_occurences(array, target)
    if all_occurences:
        print(f"Element {target} found at indices: {all_occurences}")
    else:
        print(f"Element {target} not found in the array")