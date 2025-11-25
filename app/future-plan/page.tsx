import BudgetManager from '@/components/Budget/BudgetManager'
import SavingsGoalManager from '@/components/SavingsGoal/SavingsGoalManager'
import React from 'react'

export default function FuturePlan() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Future Planning</h1>
        <p className="text-muted-foreground">Manage your budgets and savings goals</p>
      </div>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
          <BudgetManager />
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Savings Goals</h2>
          <SavingsGoalManager />
        </section>
      </div>
    </div>
  )
}
