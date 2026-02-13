'use client'

import { TrendingUp, DollarSign, ChefHat, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Recipe {
  id: string
  ingredients: { cost: number; amount: number }[]
  servings: number
}

interface Invoice {
  id: string
  total: number
  date: string
}

interface DashboardStatsProps {
  recipes: Recipe[]
  invoices: Invoice[]
}

export function DashboardStats({ recipes, invoices }: DashboardStatsProps) {
  const totalRecipes = recipes.length
  const totalInvoices = invoices.length
  const avgMargin = recipes.length > 0 
    ? recipes.reduce((acc, r) => {
        const cost = r.ingredients.reduce((sum, i) => sum + (i.cost * i.amount), 0) / r.servings
        const price = cost * 3.5
        return acc + ((price - cost) / price * 100)
      }, 0) / recipes.length 
    : 0

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  return (
    <div className="bento-grid">
      <div className="feature bg-[#141414] rounded-[20px] border border-white/[.08] p-6 card-hover fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Profit Margin Overview</h3>
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold text-white">{avgMargin.toFixed(1)}%</span>
          <span className="text-sm text-green-500 flex items-center mb-1">
            <ArrowUpRight className="w-4 h-4" />
            2.4%
          </span>
        </div>
        <p className="text-sm text-muted mb-6">Average margin across all active recipes</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Target Margin</span>
            <span className="text-white font-medium">65%</span>
          </div>
          <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(avgMargin, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="tall bg-[#141414] rounded-[20px] border border-white/[.08] p-6 card-hover fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Receipt className="w-5 h-5 text-accent" />
        </div>
        <div className="space-y-4">
          {recentInvoices.length === 0 ? (
            <p className="text-muted text-sm">No recent invoices</p>
          ) : (
            recentInvoices.map((inv, idx) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-white/[.05]">
                <div>
                  <p className="text-sm font-medium text-white">Invoice #{inv.id.slice(-4)}</p>
                  <p className="text-xs text-muted">{new Date(inv.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold text-white">{formatCurrency(inv.total)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6 card-hover fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Active Recipes</h3>
          <ChefHat className="w-5 h-5 text-accent" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{totalRecipes}</p>
        <p className="text-sm text-muted">Recipes in rotation</p>
      </div>

      <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6 card-hover fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Total Spent</h3>
          <DollarSign className="w-5 h-5 text-accent" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{formatCurrency(totalSpent)}</p>
        <p className="text-sm text-red-500 flex items-center gap-1">
          <ArrowDownRight className="w-4 h-4" />
          This month
        </p>
      </div>

      <div className="wide bg-[#141414] rounded-[20px] border border-white/[.08] p-6 card-hover fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-lg font-semibold text-white mb-4">Cost Trends</h3>
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div 
                className="bg-accent/20 rounded-t-lg transition-all duration-300 hover:bg-accent/40"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  )
}