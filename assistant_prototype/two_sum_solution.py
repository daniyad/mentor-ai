def two_sum(nums, target):
    # Create a dictionary to store the potential matches
    potential_matches = {}

    for i, num in enumerate(nums):
        complement = target - num

        # Check if the complement exists in the potential_matches
        if complement in potential_matches:
            return [potential_matches[complement], i]

        # Add the number to the dictionary
        potential_matches[num] = i

    return []