class AIHintService {
  constructor() {
    this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    this.fallbackModel = 'https://api-inference.huggingface.co/models/gpt2';
  }

  async getApiToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['hfToken'], (result) => {
        resolve(result.hfToken);
      });
    });
  }

  async generateHint(problemTitle, problemDescription = '') {
    const token = await this.getApiToken();
    
    if (!token) {
      return "Please configure your Hugging Face API token in the extension popup.";
    }

    try {
      // Create a prompt for hint generation
      const prompt = `Give a helpful coding hint for the LeetCode problem "${problemTitle}". The hint should guide without revealing the solution. Focus on algorithms, data structures, or problem-solving approaches. Keep it concise and under 50 words.

Problem: ${problemTitle}
${problemDescription ? `Description: ${problemDescription.substring(0, 200)}...` : ''}

Hint:`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error && data.error.includes('loading')) {
        // Model is loading, try fallback or return a generic hint
        return await this.getFallbackHint(problemTitle);
      }

      if (data && data[0] && data[0].generated_text) {
        let hint = data[0].generated_text.trim();
        // Clean up the response
        hint = hint.replace(/^Hint:\s*/i, '');
        hint = hint.split('\n')[0]; // Take first line only
        return hint || this.getStaticFallback(problemTitle);
      }

      return this.getStaticFallback(problemTitle);

    } catch (error) {
      console.error('AI hint generation failed:', error);
      return this.getStaticFallback(problemTitle);
    }
  }

  async getFallbackHint(problemTitle) {
    const token = await this.getApiToken();
    
    try {
      const simplePrompt = `LeetCode problem hint for ${problemTitle}:`;
      
      const response = await fetch(this.fallbackModel, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: simplePrompt,
          parameters: {
            max_length: 50,
            temperature: 0.8,
            return_full_text: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
          let hint = data[0].generated_text.trim();
          return hint.split('.')[0] + '.'; // Take first sentence
        }
      }
    } catch (error) {
      console.error('Fallback hint generation failed:', error);
    }

    return this.getStaticFallback(problemTitle);
  }

  getStaticFallback(problemTitle) {
    // Static fallbacks based on common problem patterns
    const staticHints = {
      "two-sum": "Try using a hash map to store complements.",
      "add-two-numbers": "Handle carry-over carefully in linked list addition.",
      "longest-substring-without-repeating-characters": "Use sliding window technique with a hash set.",
      "median-of-two-sorted-arrays": "Binary search on the smaller array works well.",
      "longest-palindromic-substring": "Consider dynamic programming or center expansion.",
      "zigzag-conversion": "Think about the pattern of characters in each row.",
      "reverse-integer": "Watch out for integer overflow edge cases.",
      "string-to-integer-atoi": "Handle whitespace, sign, and overflow carefully.",
      "palindrome-number": "Can you solve without converting to string?",
      "regular-expression-matching": "Dynamic programming with state transitions.",
      "container-with-most-water": "Two pointers approach from both ends.",
      "3sum": "Sort first, then use two pointers for each element.",
      "letter-combinations-of-a-phone-number": "Backtracking or iterative building works well.",
      "4sum": "Extension of 3Sum with an additional loop.",
      "remove-nth-node-from-end-of-list": "Two pointers with n+1 distance apart.",
      "valid-parentheses": "Stack data structure is perfect for this.",
      "merge-two-sorted-lists": "Compare heads and recursively merge.",
      "generate-parentheses": "Backtracking with valid parentheses constraints.",
      "merge-k-sorted-lists": "Divide and conquer or priority queue approach.",
      "swap-nodes-in-pairs": "Recursion or iterative with careful pointer management.",
      "remove-duplicates-from-sorted-array": "Two pointers for in-place modification.",
      "remove-element": "Two pointers - one for reading, one for writing.",
      "implement-strstr": "KMP algorithm or simple sliding window.",
      "divide-two-integers": "Bit manipulation without using division operator.",
      "substring-with-concatenation-of-all-words": "Sliding window with hash map counting.",
      "next-permutation": "Find pattern: find peak, swap, reverse suffix.",
      "longest-valid-parentheses": "Stack or dynamic programming approach.",
      "search-in-rotated-sorted-array": "Modified binary search with rotation detection.",
      "find-first-and-last-position-of-element-in-sorted-array": "Two binary searches for boundaries.",
      "search-insert-position": "Binary search with insertion logic.",
      "valid-sudoku": "Hash sets for rows, columns, and 3x3 boxes.",
      "sudoku-solver": "Backtracking with constraint checking.",
      "count-and-say": "Iterative string building with counting.",
      "combination-sum": "Backtracking with index tracking to avoid duplicates.",
      "combination-sum-ii": "Sort first, then backtracking with duplicate skipping.",
      "first-missing-positive": "Cycle sort or hash set for O(n) time.",
      "trapping-rain-water": "Two pointers or precompute left/right max arrays.",
      "multiply-strings": "Simulate multiplication digit by digit.",
      "wildcard-matching": "Dynamic programming with pattern matching states.",
      "jump-game-ii": "Greedy approach tracking furthest reachable position.",
      "permutations": "Backtracking or iterative with swapping.",
      "permutations-ii": "Sort first, then backtracking with duplicate handling.",
      "rotate-image": "Transpose matrix then reverse each row.",
      "group-anagrams": "Hash map with sorted string as key.",
      "maximum-subarray": "Kadane's Algorithm for optimal subarray sum.",
      "spiral-matrix": "Track boundaries and direction changes.",
      "jump-game": "Greedy approach or dynamic programming.",
      "merge-intervals": "Sort by start time, then merge overlapping.",
      "insert-interval": "Find insertion point, then merge if needed.",
      "length-of-last-word": "Traverse from end, count non-space characters.",
      "spiral-matrix-ii": "Same as spiral matrix but filling instead of reading.",
      "permutation-sequence": "Factorial number system approach.",
      "rotate-list": "Find cycle length, calculate effective rotation.",
      "unique-paths": "Dynamic programming or combinatorics formula.",
      "unique-paths-ii": "DP with obstacle handling.",
      "minimum-path-sum": "Dynamic programming with cumulative sums.",
      "plus-one": "Handle carry propagation from right to left.",
      "add-binary": "Binary addition with carry handling.",
      "text-justification": "String manipulation with space distribution.",
      "sqrt-x": "Binary search or Newton's method.",
      "climbing-stairs": "Fibonacci sequence - DP approach.",
      "simplify-path": "Stack to handle directory navigation.",
      "edit-distance": "Dynamic programming with three operations.",
      "set-matrix-zeroes": "Use first row/column as markers.",
      "search-a-2d-matrix": "Treat as 1D array or two binary searches.",
      "sort-colors": "Dutch flag algorithm or counting sort.",
      "minimum-window-substring": "Sliding window with character frequency.",
      "combinations": "Backtracking with index-based selection.",
      "subsets": "Backtracking or bit manipulation for all combinations.",
      "word-search": "DFS backtracking with visited tracking.",
      "remove-duplicates-from-sorted-array-ii": "Two pointers with count tracking.",
      "search-in-rotated-sorted-array-ii": "Modified binary search handling duplicates.",
      "remove-duplicates-from-sorted-list": "Single pass with pointer manipulation.",
      "remove-duplicates-from-sorted-list-ii": "Dummy node to handle edge cases.",
      "largest-rectangle-in-histogram": "Stack to find next/previous smaller elements.",
      "maximal-rectangle": "Extend largest rectangle in histogram to 2D.",
      "partition-list": "Two separate lists then reconnect.",
      "scramble-string": "Dynamic programming with string partitioning.",
      "merge-sorted-array": "Merge from end to avoid overwriting.",
      "gray-code": "Recursive pattern or bit manipulation.",
      "subsets-ii": "Backtracking with duplicate handling via sorting.",
      "decode-ways": "Dynamic programming counting valid decodings.",
      "reverse-linked-list-ii": "Careful pointer manipulation with dummy node.",
      "restore-ip-addresses": "Backtracking with IP validation constraints.",
      "binary-tree-inorder-traversal": "Stack-based iteration or recursion.",
      "unique-binary-search-trees": "Catalan numbers or DP with subtree counts.",
      "unique-binary-search-trees-ii": "Recursive generation with all combinations.",
      "interleaving-string": "Dynamic programming with two string indices.",
      "validate-binary-search-tree": "Inorder traversal or recursive with bounds.",
      "recover-binary-search-tree": "Inorder traversal to find swapped nodes.",
      "same-tree": "Recursive comparison or iterative with stacks.",
      "symmetric-tree": "Recursive mirror comparison or iterative.",
      "binary-tree-level-order-traversal": "BFS with queue or DFS with level tracking.",
      "binary-tree-zigzag-level-order-traversal": "Level order with alternating direction.",
      "maximum-depth-of-binary-tree": "DFS recursion or BFS with level counting.",
      "construct-binary-tree-from-preorder-and-inorder-traversal": "Recursive with index mapping.",
      "construct-binary-tree-from-inorder-and-postorder-traversal": "Similar to preorder version.",
      "binary-tree-level-order-traversal-ii": "Regular level order then reverse.",
      "convert-sorted-array-to-binary-search-tree": "Recursive with middle element as root.",
      "convert-sorted-list-to-binary-search-tree": "Find middle using slow/fast pointers.",
      "balanced-binary-tree": "Check height difference recursively.",
      "minimum-depth-of-binary-tree": "BFS for shortest path or DFS with min tracking.",
      "path-sum": "DFS with running sum tracking.",
      "path-sum-ii": "DFS with path tracking and backtracking.",
      "flatten-binary-tree-to-linked-list": "Preorder traversal with pointer manipulation.",
      "populating-next-right-pointers-in-each-node": "Level order traversal or recursive.",
      "populating-next-right-pointers-in-each-node-ii": "Modified approach for non-perfect trees.",
      "pascal-triangle": "Build row by row using previous row.",
      "pascal-triangle-ii": "Space-optimized version building single row.",
      "triangle": "Dynamic programming from bottom up.",
      "best-time-to-buy-and-sell-stock": "Track minimum price seen so far.",
      "best-time-to-buy-and-sell-stock-ii": "Greedy - buy and sell on every increase.",
      "best-time-to-buy-and-sell-stock-iii": "DP with at most 2 transactions.",
      "best-time-to-buy-and-sell-stock-iv": "DP with at most k transactions.",
      "best-time-to-buy-and-sell-stock-with-cooldown": "DP with cooldown state.",
      "valid-palindrome": "Two pointers ignoring non-alphanumeric.",
      "word-ladder-ii": "BFS to find shortest path length, then DFS for paths.",
      "word-ladder": "BFS with word transformations.",
      "longest-consecutive-sequence": "Hash set for O(1) lookups.",
      "sum-root-to-leaf-numbers": "DFS with number building.",
      "surrounded-regions": "DFS/BFS from boundary to mark safe regions.",
      "palindrome-partitioning": "Backtracking with palindrome checking.",
      "palindrome-partitioning-ii": "DP with minimum cuts.",
      "clone-graph": "DFS/BFS with visited map for node cloning.",
      "gas-station": "Greedy approach tracking total and current gas.",
      "candy": "Two passes - left to right, then right to left.",
      "single-number": "XOR operation cancels out duplicates.",
      "single-number-ii": "Bit manipulation with state tracking.",
      "copy-list-with-random-pointer": "Hash map or interweaving approach.",
      "word-break": "DP checking if string can be segmented.",
      "word-break-ii": "DFS with memoization for all combinations.",
      "linked-list-cycle": "Floyd's cycle detection (two pointers).",
      "linked-list-cycle-ii": "Extend Floyd's algorithm to find start.",
      "reorder-list": "Find middle, reverse second half, merge alternately.",
      "binary-tree-preorder-traversal": "Stack-based iteration or recursion.",
      "binary-tree-postorder-traversal": "Stack with last-visited tracking.",
      "lru-cache": "Hash map + doubly linked list combination.",
      "insertion-sort-list": "Maintain sorted portion while inserting.",
      "sort-list": "Merge sort adapted for linked lists.",
      "max-points-on-a-line": "Check all pairs and count points on same line.",
      "evaluate-reverse-polish-notation": "Stack for operand management.",
      "reverse-words-in-a-string": "Split, reverse, join or two pointers.",
      "maximum-product-subarray": "Track both max and min products.",
      "find-minimum-in-rotated-sorted-array": "Binary search with rotation handling.",
      "find-minimum-in-rotated-sorted-array-ii": "Handle duplicates in rotation.",
      "min-stack": "Two stacks or stack with min tracking.",
      "getintersection-of-two-linked-lists": "Two pointers with length difference.",
      "find-peak-element": "Binary search on local maximum.",
      "fraction-to-recurring-decimal": "Long division with remainder tracking.",
      "excel-sheet-column-title": "Base 26 conversion with offset.",
      "majority-element": "Boyer-Moore voting or hash map counting.",
      "excel-sheet-column-number": "Base 26 to decimal conversion.",
      "factorial-trailing-zeroes": "Count factors of 5 in n!.",
      "binary-search-tree-iterator": "Stack-based inorder traversal.",
      "dungeon-game": "DP from bottom-right working backwards.",
      "largest-number": "Custom comparator for string concatenation.",
      "repeated-dna-sequences": "Hash map with sliding window.",
      "best-time-to-buy-and-sell-stock-with-transaction-fee": "DP with transaction costs.",
      "rotate-array": "Three reversals or cyclic replacements.",
      "house-robber": "DP choosing between rob or skip.",
      "house-robber-ii": "Two separate linear house robber problems.",
      "house-robber-iii": "Tree DP with rob/not rob states.",
      "happy-number": "Cycle detection with slow/fast pointers.",
      "remove-linked-list-elements": "Dummy node for edge case handling.",
      "count-primes": "Sieve of Eratosthenes algorithm.",
      "isomorphic-strings": "Two hash maps for bidirectional mapping.",
      "reverse-linked-list": "Iterative or recursive pointer reversal.",
      "course-schedule": "Topological sort or DFS cycle detection.",
      "course-schedule-ii": "Topological sort with order recording.",
      "implement-trie-prefix-tree": "Tree structure with character nodes.",
      "add-and-search-word-data-structure-design": "Trie with wildcard DFS.",
      "word-search-ii": "Trie + DFS backtracking combination.",
      "house-robber-iii": "Tree DP with rob/not rob choices.",
      "contains-duplicate": "Hash set for O(1) lookup.",
      "contains-duplicate-ii": "Hash map with index tracking.",
      "contains-duplicate-iii": "Balanced BST or bucket approach.",
      "maximal-square": "DP tracking square size at each position.",
      "count-complete-tree-nodes": "Binary search on tree levels.",
      "rectangle-area": "Handle overlap calculation carefully.",
      "basic-calculator": "Stack for nested expressions.",
      "basic-calculator-ii": "Stack for operator precedence.",
      "sliding-window-maximum": "Deque for efficient window maximum.",
      "search-a-2d-matrix-ii": "Start from top-right or bottom-left.",
      "different-ways-to-add-parentheses": "Recursive with memoization.",
      "valid-anagram": "Sort strings or character frequency counting.",
      "shortest-palindrome": "KMP or find longest palindrome prefix.",
      "strobogrammatic-number": "Check valid rotated digits.",
      "strobogrammatic-number-ii": "Recursive building from center.",
      "strobogrammatic-number-iii": "Generate and count in range.",
      "group-shifted-strings": "Normalize strings by shift patterns.",
      "meeting-rooms": "Sort intervals and check overlaps.",
      "meeting-rooms-ii": "Priority queue for room management.",
      "factor-combinations": "Backtracking with factor generation.",
      "verify-preorder-serialization-of-a-binary-tree": "Stack simulation or degree counting.",
      "reconstruct-itinerary": "Hierholzer's algorithm for Eulerian path.",
      "increasing-triplet-subsequence": "Track two smallest numbers seen.",
      "self-crossing": "Check all crossing patterns.",
      "palindromic-substrings": "Expand around centers approach.",
      "coin-change": "DP with minimum coins needed.",
      "coin-change-2": "DP counting number of ways.",
      "power-of-three": "Logarithm check or recursive division.",
      "odd-even-linked-list": "Separate odd/even nodes then reconnect.",
      "longest-increasing-subsequence": "DP or binary search with patience sorting.",
      "remove-duplicate-letters": "Stack with greedy selection.",
      "maximum-product-of-word-lengths": "Bit manipulation for character sets.",
      "bulb-switcher": "Math insight: perfect squares remain on.",
      "create-maximum-number": "Monotonic stack for each array.",
      "best-time-to-buy-and-sell-stock-with-cooldown": "State machine DP.",
      "minimum-height-trees": "Topological sort from leaves inward.",
      "burst-balloons": "Interval DP thinking backwards.",
      "super-ugly-number": "Priority queue or DP with multiple factors.",
      "count-of-smaller-numbers-after-self": "Merge sort with index tracking.",
      "remove-invalid-parentheses": "BFS for minimum removals.",
      "longest-increasing-path-in-a-matrix": "DFS with memoization.",
      "patching-array": "Greedy approach tracking reachable sum.",
      "verify-preorder-sequence-in-binary-search-tree": "Stack with lower bound tracking.",
      "largest-bst-subtree": "Post-order traversal with validation.",
      "count-of-range-sum": "Merge sort with prefix sums.",
      "odd-even-linked-list": "Split into odd/even position lists.",
      "longest-absolute-file-path": "Stack tracking directory depths.",
      "integer-replacement": "Recursion with memoization or BFS.",
      "random-pick-index": "Reservoir sampling or preprocessing.",
      "evaluate-division": "Graph with weighted edges (ratios).",
      "nth-digit": "Math to find which number contains nth digit.",
      "lexicographical-numbers": "DFS in lexicographical order.",
      "first-unique-character-in-a-string": "Hash map for frequency counting.",
      "longest-absolute-file-path": "Stack for directory depth tracking.",
      "find-the-difference": "XOR or character frequency difference.",
      "elimination-game": "Recursion with direction and step tracking.",
      "perfect-rectangle": "Check area and corner point counts.",
      "is-subsequence": "Two pointers or DP for multiple queries.",
      "utf-8-validation": "Bit manipulation checking byte patterns.",
      "decode-string": "Stack for nested encoding patterns.",
      "longest-substring-with-at-most-k-distinct-characters": "Sliding window with hash map.",
      "rotate-function": "Math optimization reducing to O(n).",
      "integer-replacement": "BFS or memoized recursion.",
      "random-pick-index": "Reservoir sampling for uniform selection.",
      "evaluate-division": "Union-find or DFS on ratio graph.",
      "nth-digit": "Mathematical approach finding number boundaries.",
      "binary-watch": "Backtracking or bit counting approach.",
      "remove-k-digits": "Monotonic stack for lexicographically smallest.",
      "frog-jump": "DP or DFS with memoization.",
      "sum-of-left-leaves": "Tree traversal identifying left leaves.",
      "convert-a-number-to-hexadecimal": "Bit manipulation with grouping.",
      "queue-reconstruction-by-height": "Sort by height then insert by position.",
      "trapping-rain-water-ii": "Priority queue for 2D version.",
      "split-array-largest-sum": "Binary search on answer space.",
      "fizz-buzz": "Modulo operations with string building.",
      "third-maximum-number": "Track three largest with careful handling.",
      "add-strings": "Simulate addition digit by digit.",
      "partition-equal-subset-sum": "0/1 knapsack DP problem.",
      "pacific-atlantic-water-flow": "DFS from both coastlines.",
      "battleships-in-a-board": "Count ship starts without modification.",
      "strong-password-checker": "Greedy with multiple constraints.",
      "maximum-xor-of-two-numbers-in-an-array": "Trie for bit manipulation.",
      "reconstruct-original-digits-from-english": "Frequency counting with unique characters.",
      "valid-word-abbreviation": "Two pointers with number parsing.",
      "minimum-genetic-mutation": "BFS for shortest transformation.",
      "find-all-anagrams-in-a-string": "Sliding window with frequency matching.",
      "ternary-expression-parser": "Stack or recursive parsing.",
      "arithmetic-slices": "DP counting consecutive arithmetic sequences.",
      "third-maximum-number": "Track three largest numbers carefully.",
      "add-strings": "String addition simulation with carry.",
      "number-of-segments-in-a-string": "Count words separated by spaces.",
      "arrange-coins": "Binary search or quadratic formula.",
      "find-all-numbers-disappeared-in-an-array": "Mark indices or cycle sort.",
      "serialize-and-deserialize-bst": "Preorder with bounds.",
      "delete-node-in-a-bst": "Handle three cases: leaf, one child, two children.",
      "sort-characters-by-frequency": "Frequency counting then sorting.",
      "minimum-number-of-arrows-to-burst-balloons": "Greedy interval scheduling.",
      "4sum-ii": "Hash map with pair sums.",
      "repeated-substring-pattern": "String period detection.",
      "hamming-distance": "XOR then count set bits.",
      "island-perimeter": "Count exposed edges of land cells.",
      "find-all-duplicates-in-an-array": "Use indices as hash map.",
      "string-compression": "Two pointers with count tracking.",
      "add-two-numbers-ii": "Stack to reverse without modifying.",
      "arithmetic-slices-ii-subsequence": "DP with hash map for differences.",
      "number-of-boomerangs": "Hash map counting distances.",
      "find-right-interval": "Binary search or sorting with indices.",
      "path-sum-iii": "DFS with prefix sum tracking.",
      "find-all-anagrams-in-a-string": "Sliding window with character frequency.",
      "k-th-smallest-in-lexicographical-order": "Mathematical approach avoiding generation.",
      "poor-pigs": "Information theory with base conversion.",
      "compress-string-lcci": "Count consecutive characters.",
      "lfu-cache": "Hash map + doubly linked list with frequency.",
      "total-hamming-distance": "Bit-by-bit contribution counting.",
      "largest-palindrome-product": "Generate palindromes and test factors.",
      "sliding-window-median": "Two heaps or balanced BST.",
      "zuma-game": "DFS with game state exploration.",
      "candy-crush": "Simulation with marking and gravity.",
      "24-game": "Backtracking with all operation combinations.",
      "freedom-trail": "DP with position and character matching.",
      "unique-substrings-in-wraparound-string": "DP tracking max length ending at each char.",
      "license-key-formatting": "Process from right to left.",
      "smallest-good-base": "Binary search on base value.",
      "max-consecutive-ones": "Single pass counting consecutive ones.",
      "max-consecutive-ones-ii": "Sliding window with at most one flip.",
      "max-consecutive-ones-iii": "Sliding window with at most k flips.",
      "construct-the-rectangle": "Find factors closest to square root.",
      "teemo-attacking": "Merge overlapping intervals.",
      "next-greater-element-i": "Stack for next greater mapping.",
      "next-greater-element-ii": "Circular array with stack.",
      "diagonal-traverse": "Direction change pattern on matrix.",
      "find-mode-in-binary-search-tree": "Inorder traversal with frequency tracking."
    };

    const slug = problemTitle.toLowerCase().replace(/\s+/g, '-');
    return staticHints[slug] || "Break down the problem into smaller parts and consider common algorithms.";
  }
}

// Make service available globally
window.aiHintService = new AIHintService();