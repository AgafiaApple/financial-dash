// in the future, this methodology of how to get the financial history will need to be optimized for when there are tons of records in the database 
        // e.g. creating an SQL table that updates once a day

type Snapshot = {
  client_id: number
  date: string
  current_net_income: number | null
  current_net_worth: number | null
  current_credit_score: number | null
}

type DailyMetrics = {
  date: string
  avgIncome: number
  avgNetWorth: number
  avgCreditScore: number
}

export class AdminMetricsService {
  // The constructor pre-computes the values needed for `computeDailyAverages`
  constructor(private supabase: any) {}

  async getAllSnapshots(): Promise<Snapshot[]> {
    const { data, error } = await this.supabase
      .from('financial_info')
      .select(`
        client_id,
        net_income,
        net_worth,
        credit_score,
        last_updated
      `)
      .order('last_updated', { ascending: true })

    if (error) throw error

    return data.map((d: any) => ({
        client_id: d.client_id,
        date: d.last_updated.split('T')[0], // extract date in YYYY-MM-DD format
        current_net_income: d.net_income,
        current_net_worth: d.net_worth,
        current_credit_score: d.credit_score,
    }))
  }

  /* 
   computeDailyAverages looks at the financial snapshot and metrics of each client (which is pre-computed) and 
   returns a list of JSON objects in ascending order by date

   computeDailyAverages returns an object like: 
        [
        { date: "2026-01-01", avgIncome: 5200, avgNetWorth: 120000, avgCreditScore: 680 },
        { date: "2026-01-02", avgIncome: 5300, avgNetWorth: 121500, avgCreditScore: 682 },
        ...
        ]
        
    computeDailyAverages has O(n) Time Complexity
  */
  computeDailyAverages(snapshots: Snapshot[]): DailyMetrics[] {
    const clientState = new Map<number, Snapshot>()
    const dailyBuckets = new Map<string, Snapshot[]>()

    for (const snap of snapshots) {
      // update latest known state per client
      clientState.set(snap.client_id, snap)

      const day = snap.date

      if (!dailyBuckets.has(day)) {
        dailyBuckets.set(day, [])
      }

      // snapshot of ALL current client states at this day
      dailyBuckets.set(day, Array.from(clientState.values()))
    }

    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0

    const results: DailyMetrics[] = []

    for (const [date, snaps] of dailyBuckets.entries()) {
      const incomes = snaps.map(s => s.current_net_income).filter((v): v is number => v !== null && v !== undefined)
      const worths = snaps.map(s => s.current_net_worth).filter((v): v is number => v !== null && v !== undefined)
      const credits = snaps.map(s => s.current_credit_score).filter((v): v is number => v !== null && v !== undefined)

      results.push({
        date,
        avgIncome: avg(incomes),
        avgNetWorth: avg(worths),
        avgCreditScore: avg(credits),
      })
    }

    return results.sort((a, b) => a.date.localeCompare(b.date))
  }

  // the function the user will call 
  async getTimeSeriesMetrics() {
    const snapshots = await this.getAllSnapshots()
    return this.computeDailyAverages(snapshots)
  }
}