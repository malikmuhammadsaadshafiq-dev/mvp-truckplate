'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Recipe {
  id: string
  name: string
  costPerServing: number
  suggestedPrice: number
  margin: number
  prepStation: string
  dietaryTags: string[]
  ingredients: { name: string; cost: number; unit: string }[]
  lastUpdated: string
}

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
  delay?: number
}

export function RecipeCard({ recipe, onEdit, onDelete, delay = 0 }: RecipeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(recipe.id)
    }, 300)
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-[24px] p-6 shadow-clay hover:shadow-clay-hover transition-all duration-300 hover:-translate-y-1',
        isDeleting && 'opacity-0 -translate-x-full transition-all duration-300',
        'fade-in-up'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{recipe.name}</h3>
          <p className="text-sm text-gray-500">{recipe.prepStation}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(recipe)}
            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors active:scale-95"
            aria-label="Edit recipe"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
            aria-label="Delete recipe"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-indigo-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Cost</p>
          <p className="text-lg font-bold text-indigo-600">${recipe.costPerServing.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Price</p>
          <p className="text-lg font-bold text-green-600">${recipe.suggestedPrice.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Margin</p>
          <p className="text-lg font-bold text-purple-600">{recipe.margin}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {recipe.dietaryTags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-400">
        Updated {recipe.lastUpdated}
      </div>
    </div>
  )
}