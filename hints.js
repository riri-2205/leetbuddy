// Enhanced hint service with AI capabilities
const leetHints = {
  "two-sum": "Try using a hash map to store complements.",
  "merge-k-sorted-lists": "Can you use a min-heap (priority queue)?",
  "maximum-subarray": "Kadane's Algorithm helps here.",
  "longest-palindromic-substring": "Consider dynamic programming or center expansion.",
  "median-of-two-sorted-arrays": "Binary search on the smaller array works well."
};

async function getHintFromTitle(problemSlug) {
  try {
    // Check if AI service is available
    if (window.aiHintService) {
      // Try to get problem description for better context
      const problemDescription = getProblemDescription();
      
      // Use AI service to generate hint
      const aiHint = await window.aiHintService.generateHint(problemSlug, problemDescription);
      return aiHint;
    }
  } catch (error) {
    console.log('AI hint generation failed, falling back to static hints:', error);
  }
  
  // Fallback to static hints if AI fails
  return leetHints[problemSlug.toLowerCase()] || "Try breaking the problem into smaller parts.";
}

function getProblemDescription() {
  try {
    // Try to extract problem description from the page
    const contentDiv = document.querySelector('[data-track-load="description_content"]');
    if (contentDiv) {
      return contentDiv.textContent.trim();
    }
    
    // Alternative selectors for problem description
    const alternatives = [
      '.content__u3I1',
      '.question-content',
      '[data-cy="question-detail-main-tabs"]',
      '.description__24sA'
    ];
    
    for (const selector of alternatives) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    
    return '';
  } catch (error) {
    console.log('Could not extract problem description:', error);
    return '';
  }
}

// For backward compatibility
function getHintFromTitleSync(title) {
  return leetHints[title.toLowerCase()] || "Try breaking the problem into smaller parts.";
}