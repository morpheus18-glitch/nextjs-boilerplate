import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    inventory: { new: 120, used: 80, total: 200 },
    sales: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      numbers: [25, 30, 20, 35, 28, 32, 26, 30, 40, 38, 45, 50],
      total: 399
    },
    financing: {
      financedRate: 0.7,
      averageAPR: 4.5,
      totalFinanced: 1250000
    },
    profitLoss: {
      revenue: 5000000,
      expenses: 4200000,
      net: 800000
    }
  }
  return NextResponse.json(data)
}
