import React from 'react'
import { FinanceChatbot } from '../../components/ChatPage/FinanceChatbot'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function AICoachPage() {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Left side - Info cards */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Financial Coach</h1>
            <p className="text-gray-700">
              Your personal assistant for financial advice and planning
            </p>
          </div>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">What I Can Help With</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Personalized budgeting advice based on your spending</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Savings strategies to reach your financial goals</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Investment recommendations for your financial situation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Debt management and reduction plans</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Topics You Can Ask About</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Budgeting</Badge>
              <Badge variant="secondary">Saving</Badge>
              <Badge variant="secondary">Investments</Badge>
              <Badge variant="secondary">Retirement</Badge>
              <Badge variant="secondary">Debt Management</Badge>
              <Badge variant="secondary">Tax Planning</Badge>
              <Badge variant="secondary">Emergency Funds</Badge>
              <Badge variant="secondary">Financial Goals</Badge>
            </div>
          </Card>
        </div>
        
        {/* Right side - Chatbot */}
        <div className="lg:w-2/3">
          <FinanceChatbot />
        </div>
      </div>
    </div>
  )
}
