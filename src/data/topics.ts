/** Shared topic options for filters and per-problem editing */
export const TOPIC_OPTIONS = [
  'Array',
  'Hash Table',
  'Dynamic Programming',
  'Two Pointers',
  'Stack',
  'Sliding Window',
  'Heap',
  'Quickselect',
  'Design',
  'Linked List',
  'Tree',
  'BFS',
  'DFS',
  'Binary Search',
  'Greedy',
  'Backtracking',
  'Graph',
  'Math',
  'Bit Manipulation',
  'Divide and Conquer',
  'String',
] as const

export type TopicOption = (typeof TOPIC_OPTIONS)[number]
