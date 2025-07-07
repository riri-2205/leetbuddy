const leetHints = {
  "two-sum": "Try using a hash map to store complements.",
  "merge-k-sorted-lists": "Can you use a min-heap (priority queue)?",
  "maximum-subarray": "Kadane’s Algorithm helps here.",
  "longest-palindromic-substring": "Consider dynamic programming or center expansion.",
  "median-of-two-sorted-arrays": "Binary search on the smaller array works well."
};

function getHintFromTitle(title) {
  return leetHints[title.toLowerCase()] || "Try breaking the problem into smaller parts.";
}