import type { Problem } from '../types'

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'p-1',
    leetcodeId: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    topics: ['Array', 'Hash Table'],
    difficulty: 'Easy',
    attempts: 3,
    status: '过关',
    notes: '哈希表存补数；边遍历边查。',
    lastPracticedAt: '2026-07-10',
    codeVersions: [
      {
        id: 'c1a',
        label: '暴力双循环',
        language: 'python',
        code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
      },
      {
        id: 'c1b',
        label: '哈希表最优',
        language: 'python',
        code: `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        isOptimal: true,
      },
    ],
  },
  {
    id: 'p-42',
    leetcodeId: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    topics: ['Array', 'Two Pointers', 'Stack'],
    difficulty: 'Hard',
    attempts: 2,
    status: '复习',
    notes: '左右最高木板取 min，再减当前高度。单调栈版本也行，但双指针更直观。',
    lastPracticedAt: '2026-07-08',
    codeVersions: [
      {
        id: 'c42a',
        label: '按列暴力',
        language: 'python',
        code: `# 对每个位置找左右最高…\n# （略）`,
        timeComplexity: 'O(n²)',
        isOptimal: false,
      },
      {
        id: 'c42b',
        label: '双指针最优',
        language: 'python',
        code: `def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = 0
    ans = 0
    while l < r:
        if height[l] < height[r]:
            left_max = max(left_max, height[l])
            ans += left_max - height[l]
            l += 1
        else:
            right_max = max(right_max, height[r])
            ans += right_max - height[r]
            r -= 1
    return ans`,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        isOptimal: true,
      },
    ],
  },
  {
    id: 'p-3',
    leetcodeId: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    topics: ['Hash Table', 'String', 'Sliding Window'],
    difficulty: 'Medium',
    attempts: 1,
    status: '做过',
    notes: '右指针扩张，左指针跳到重复字符下一位。',
    lastPracticedAt: '2026-07-12',
    codeVersions: [],
  },
  {
    id: 'p-70',
    leetcodeId: 70,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    topics: ['Dynamic Programming'],
    difficulty: 'Easy',
    attempts: 2,
    status: '过关',
    notes: '',
    lastPracticedAt: '2026-07-01',
    codeVersions: [
      {
        id: 'c70',
        label: '标准 DP',
        language: 'python',
        code: `def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
        timeComplexity: 'O(n)',
        isOptimal: true,
      },
    ],
  },
  {
    id: 'p-215',
    leetcodeId: 215,
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    topics: ['Heap', 'Quickselect'],
    difficulty: 'Medium',
    attempts: 1,
    status: '做过',
    notes: '准备对比堆和 quickselect。',
    lastPracticedAt: '2026-07-13',
    codeVersions: [],
  },
  {
    id: 'p-146',
    leetcodeId: 146,
    title: 'LRU Cache',
    slug: 'lru-cache',
    topics: ['Hash Table', 'Linked List', 'Design'],
    difficulty: 'Medium',
    attempts: 4,
    status: '复习',
    notes: 'OrderedDict / 哈希 + 双向链表。淘汰时别忘更新哈希。',
    lastPracticedAt: '2026-06-28',
    codeVersions: [
      {
        id: 'c146',
        label: '哈希 + 双向链表',
        language: 'python',
        code: `# get / put O(1)\n# （练习时手写 Node）`,
        isOptimal: true,
      },
    ],
  },
  {
    id: 'p-297',
    leetcodeId: 297,
    title: 'Serialize and Deserialize Binary Tree',
    slug: 'serialize-and-deserialize-binary-tree',
    topics: ['Tree', 'BFS', 'Design'],
    difficulty: 'Hard',
    attempts: 1,
    status: '做过',
    notes: '层序序列化时要保留 null 占位，否则无法还原形状。',
    lastPracticedAt: '2026-07-05',
    codeVersions: [],
  },
  {
    id: 'p-53',
    leetcodeId: 53,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    topics: ['Dynamic Programming', 'Divide and Conquer'],
    difficulty: 'Medium',
    attempts: 2,
    status: '过关',
    notes: 'Kadane：要么接在后面，要么从当前位置重新开。',
    lastPracticedAt: '2026-07-11',
    codeVersions: [
      {
        id: 'c53a',
        label: '前缀和暴力',
        language: 'python',
        code: `# O(n²) 枚举区间`,
      },
      {
        id: 'c53b',
        label: 'Kadane 最优',
        language: 'python',
        code: `def maxSubArray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        isOptimal: true,
      },
    ],
  },
]
