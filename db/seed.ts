import { loadEnvConfig } from '@next/env'
import { createClient } from '@supabase/supabase-js'

import type { Database } from './types'

loadEnvConfig(process.cwd())

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sampleCards = [
  {
    num: 706,
    title: 'Design HashMap',
    difficulty: 'easy',
    tags: ['hash-table', 'design'],
    description:
      'Design a HashMap from scratch (no built-in hash table libraries). Support put(key, value), get(key), and remove(key).',
    example:
      'Input:\n["MyHashMap","put","put","get","get","put","get","remove","get"]\n[[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]\n\nOutput:\n[null,null,null,1,-1,null,1,null,-1]',
    key_points: [
      '用固定大小的 array + hash function（key % size）',
      'Collision handling 用 chaining：每個 bucket 存 list of (key, value) tuples',
      'Size 選質數讓分布更均勻',
    ],
    complexity: 'Average O(1), worst O(n)',
    follow_ups: [
      '為什麼 size 選質數？— 減少 mod 碰撞',
      '什麼是 load factor？— 元素數 / bucket 數',
    ],
    gotchas: [
      '不能用 Python dict — 那就是 hashmap 本身',
      'get / remove 要處理 key 不存在的 edge case',
    ],
    stumbles: [],
  },
  {
    num: 146,
    title: 'LRU Cache',
    difficulty: 'medium',
    tags: ['hash-table', 'linked-list', 'design'],
    description:
      'Design a cache with O(1) get and put that evicts the least-recently-used key when it exceeds its capacity.',
    example:
      'Input:\n["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]\n\nOutput:\n[null,null,null,1,null,-1,null,-1,3,4]',
    key_points: [
      'HashMap + Doubly Linked List 組合',
      'HashMap 存 key → node reference，O(1) lookup',
      'DLL 維護 access order，最近用的放 head，最久沒用的在 tail',
    ],
    complexity: 'O(1) for get and put',
    follow_ups: [
      'LFU Cache 怎麼做？— 多一個 frequency map',
      'Thread-safe LRU？— 加 mutex 或用 ConcurrentHashMap',
    ],
    gotchas: [
      'put 時如果 key 已存在要更新 value 並 move to head',
      '容量滿時要先 evict tail 再 insert',
    ],
    stumbles: [],
  },
  {
    num: 200,
    title: 'Number of Islands',
    difficulty: 'medium',
    tags: ['graph', 'bfs', 'dfs', 'matrix'],
    description:
      'Given an m×n 2D grid of "1" (land) and "0" (water), count the number of islands — groups of land connected 4-directionally.',
    example:
      'Input:\ngrid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]\n\nOutput: 3',
    key_points: [
      '遍歷 grid，遇到 "1" 就 BFS/DFS 把整座島標記為 visited',
      '每次啟動新的 BFS/DFS 代表發現一座新島',
      '可以直接修改 grid（"1" → "0"）省掉 visited set',
    ],
    complexity: 'O(m×n) time and space',
    follow_ups: [
      '如果要算最大島面積？— 在 BFS/DFS 中計數',
      'Union-Find 解法？— 把相鄰的 "1" union 起來，最後數 connected components',
    ],
    gotchas: [
      '別忘了檢查 grid 邊界（row/col bounds）',
      'BFS 要在加入 queue 時就標記 visited，不是取出時',
    ],
    stumbles: [],
  },
]

async function seed() {
  console.log('Seeding cards...')
  const { error } = await supabase.from('cards').insert(sampleCards)
  if (error) throw error
  console.log(`Seeded ${sampleCards.length} cards.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
