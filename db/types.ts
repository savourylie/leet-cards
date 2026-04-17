export type Card = {
  id: number
  num: number
  title: string
  difficulty: string
  tags: string[]
  description: string
  example: string
  key_points: string[]
  complexity: string
  follow_ups: string[]
  gotchas: string[]
  stumbles: string[]
  created_at: string
  last_reviewed: string | null
}

export type NewCard = Omit<Card, 'id' | 'created_at' | 'last_reviewed'>

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: Card
        Insert: NewCard & {
          id?: number
          created_at?: string
          last_reviewed?: string | null
        }
        Update: Partial<Omit<Card, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
