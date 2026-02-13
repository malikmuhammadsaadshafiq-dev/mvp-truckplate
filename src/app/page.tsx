'use client'

import { useState, useEffect } from 'react'
import { 
  ChefHat, 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Moon,
  Sun,
  Download,
  User,
  LogOut
} from 'lucide-react'
import { RecipeCard } from '@/components/RecipeCard'
import { InvoiceUploader } from '@/components/InvoiceUploader'
import { DashboardStats } from '@/components/DashboardStats'
import { Toast } from '@/components/Toast'
import { cn, formatCurrency } from '@/lib/utils'

interface Ingredient {
  id: string
  name: string
  cost: number
  unit: string
  amount: number
}

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: Ingredient[]
  prepStation: string
  dietaryTags: string[]
  servings: number
  prepTime: number
  imageUrl?: string
}

interface Invoice {
  id: string
  supplier: string
  date: string
  total: number
  items: { name: string; price: number; quantity: number }[]
  imageUrl?: string
  status: 'pending' | 'processed' | 'archived'
}

const initialRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Korean BBQ Beef Bowl',
    description: 'Marinated beef short ribs served over jasmine rice with pickled vegetables and gochujang aioli.',
    ingredients: [
      { id: 'i1', name: 'Beef Short Ribs', cost: 12.50, unit: 'lb', amount: 2 },
      { id: 'i2', name: 'Jasmine Rice', cost: 0.80, unit: 'lb', amount: 1 },
      { id: 'i3', name: 'Gochujang', cost: 6.00, unit: 'jar', amount: 0.2 },
      { id: 'i4', name: 'Pickled Veggies', cost: 4.50, unit: 'lb', amount: 0.5 },
    ],
    prepStation: 'Grill',
    dietaryTags: ['Gluten-Free', 'Dairy-Free'],
    servings: 8,
    prepTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Smoked Brisket Tacos',
    description: '12-hour smoked brisket with corn tortillas, cilantro, onion, and salsa verde.',
    ingredients: [
      { id: 'i5', name: 'Beef Brisket', cost: 8.99, unit: 'lb', amount: 3 },
      { id: 'i6', name: 'Corn Tortillas', cost: 3.50, unit: 'pack', amount: 2 },
      { id: 'i7', name: 'Cilantro', cost: 1.99, unit: 'bunch', amount: 2 },
      { id: 'i8', name: 'Salsa Verde', cost: 5.00, unit: 'jar', amount: 1 },
    ],
    prepStation: 'Smoker',
    dietaryTags: ['Dairy-Free'],
    servings: 12,
    prepTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Truffle Mushroom Flatbread',
    description: 'Wild mushroom medley with truffle oil, ricotta, and fresh thyme on house-made dough.',
    ingredients: [
      { id: 'i9', name: 'Mixed Mushrooms', cost: 7.50, unit: 'lb', amount: 1.5 },
      { id: 'i10', name: 'Pizza Dough', cost: 2.50, unit: 'ball', amount: 4 },
      { id: 'i11', name: 'Truffle Oil', cost: 18.00, unit: 'bottle', amount: 0.1 },
      { id: 'i12', name: 'Ricotta', cost: 6.50, unit: 'tub', amount: 1 },
    ],
    prepStation: 'Oven',
    dietaryTags: ['Vegetarian'],
    servings: 4,
    prepTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Cajun Shrimp Po Boy',
    description: 'Louisiana-style fried shrimp with remoulade sauce on crispy French bread.',
    ingredients: [
      { id: 'i13', name: 'Shrimp', cost: 14.00, unit: 'lb', amount: 2 },
      { id: 'i14', name: 'French Bread', cost: 3.00, unit: 'loaf', amount: 2 },
      { id: 'i15', name: 'Cajun Spice', cost: 4.00, unit: 'jar', amount: 0.3 },
      { id: 'i16', name: 'Lettuce', cost: 2.50, unit: 'head', amount: 1 },
    ],
    prepStation: 'Fryer',
    dietaryTags: ['Dairy-Free'],
    servings: 6,
    prepTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Vegan Buddha Bowl',
    description: 'Quinoa base with roasted chickpeas, avocado, tahini dressing, and fresh greens.',
    ingredients: [
      { id: 'i17', name: 'Quinoa', cost: 5.50, unit: 'lb', amount: 1 },
      { id: 'i18', name: 'Chickpeas', cost: 1.20, unit: 'can', amount: 3 },
      { id: 'i19', name: 'Avocado', cost: 1.50, unit: 'each', amount: 4 },
      { id: 'i20', name: 'Tahini', cost: 7.00, unit: 'jar', amount: 0.5 },
    ],
    prepStation: 'Cold Prep',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    servings: 4,
    prepTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Nashville Hot Chicken Sandwich',
    description: 'Spicy fried chicken thigh with pickles and coleslaw on brioche bun.',
    ingredients: [
      { id: 'i21', name: 'Chicken Thighs', cost: 4.50, unit: 'lb', amount: 2 },
      { id: 'i22', name: 'Brioche Buns', cost: 4.00, unit: 'pack', amount: 1 },
      { id: 'i23', name: 'Cayenne Pepper', cost: 3.00, unit: 'jar', amount: 0.2 },
      { id: 'i24', name: 'Pickles', cost: 3.50, unit: 'jar', amount: 0.5 },
    ],
    prepStation: 'Fryer',
    dietaryTags: ['Dairy-Free'],
    servings: 4,
    prepTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop'
  },
  {
    id: '7',
    name: 'Lobster Roll',
    description: 'Maine lobster with lemon butter on toasted split-top bun.',
    ingredients: [
      { id: 'i25', name: 'Lobster Meat', cost: 45.00, unit: 'lb', amount: 1 },
      { id: 'i26', name: 'Split-top Buns', cost: 4.50, unit: 'pack', amount: 1 },
      { id: 'i27', name: 'Butter', cost: 4.00, unit: 'lb', amount: 0.5 },
      { id: 'i28', name: 'Lemon', cost: 0.50, unit: 'each', amount: 3 },
    ],
    prepStation: 'Cold Prep',
    dietaryTags: ['Gluten-Free option'],
    servings: 4,
    prepTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d8f0a9fd7f99?w=400&h=300&fit=crop'
  },
  {
    id: '8',
    name: 'Pork Belly Bao Buns',
    description: 'Steamed buns with braised pork belly, hoisin, and cucumber.',
    ingredients: [
      { id: 'i29', name: 'Pork Belly', cost: 9.00, unit: 'lb', amount: 2 },
      { id: 'i30', name: 'Bao Buns', cost: 6.00, unit: 'pack', amount: 2 },
      { id: 'i31', name: 'Hoisin Sauce', cost: 3.50, unit: 'bottle', amount: 1 },
      { id: 'i32', name: 'Cucumber', cost: 1.00, unit: 'each', amount: 2 },
    ],
    prepStation: 'Steam',
    dietaryTags: ['Dairy-Free'],
    servings: 8,
    prepTime: 30,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop'
  },
  {
    id: '9',
    name: 'Fish Tacos',
    description: 'Beer-battered cod with cabbage slaw and chipotle crema on flour tortillas.',
    ingredients: [
      { id: 'i33', name: 'Cod Fillet', cost: 11.00, unit: 'lb', amount: 1.5 },
      { id: 'i34', name: 'Flour Tortillas', cost: 3.00, unit: 'pack', amount: 1 },
      { id: 'i35', name: 'Cabbage', cost: 1.50, unit: 'head', amount: 1 },
      { id: 'i36', name: 'Chipotle Mayo', cost: 4.00, unit: 'bottle', amount: 0.5 },
    ],
    prepStation: 'Fryer',
    dietaryTags: ['Dairy-Free'],
    servings: 6,
    prepTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop'
  },
  {
    id: '10',
    name: 'Impossible Burger',
    description: 'Plant-based patty with caramelized onions, vegan cheese, and special sauce.',
    ingredients: [
      { id: 'i37', name: 'Impossible Patties', cost: 12.00, unit: 'pack', amount: 1 },
      { id: 'i38', name: 'Vegan Cheese', cost: 6.00, unit: 'pack', amount: 1 },
      { id: 'i39', name: 'Brioche Buns', cost: 4.00, unit: 'pack', amount: 1 },
      { id: 'i40', name: 'Onions', cost: 1.00, unit: 'lb', amount: 1 },
    ],
    prepStation: 'Grill',
    dietaryTags: ['Vegan', 'Dairy-Free'],
    servings: 4,
    prepTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
  },
  {
    id: '11',
    name: 'Elote (Mexican Street Corn)',
    description: 'Grilled corn with mayo, cotija cheese, chili powder, and lime.',
    ingredients: [
      { id: 'i41', name: 'Corn Cobs', cost: 0.75, unit: 'each', amount: 12 },
      { id: 'i42', name: 'Cotija Cheese', cost: 5.50, unit: 'lb', amount: 0.5 },
      { id: 'i43', name: 'Mayonnaise', cost: 3.00, unit: 'jar', amount: 0.3 },
      { id: 'i44', name: 'Chili Powder', cost: 2.50, unit: 'jar', amount: 0.1 },
    ],
    prepStation: 'Grill',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    servings: 12,
    prepTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2071?w=400&h=300&fit=crop'
  },
  {
    id: '12',
    name: 'Poke Bowl',
    description: 'Fresh ahi tuna with sushi rice, edamame, seaweed salad, and spicy mayo.',
    ingredients: [
      { id: 'i45', name: 'Ahi Tuna', cost: 24.00, unit: 'lb', amount: 1 },
      { id: 'i46', name: 'Sushi Rice', cost: 2.50, unit: 'lb', amount: 1 },
      { id: 'i47', name: 'Edamame', cost: 4.00, unit: 'bag', amount: 1 },
      { id: 'i48', name: 'Seaweed Salad', cost: 6.00, unit: 'lb', amount: 0.5 },
    ],
    prepStation: 'Cold Prep',
    dietaryTags: ['Gluten-Free', 'Dairy-Free'],
    servings: 4,
    prepTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }
]

const initialInvoices: Invoice[] = [
  { id: 'inv1', supplier: 'Sysco Food Services', date: '2024-03-15', total: 1245.50, items: [], status: 'processed' },
  { id: 'inv2', supplier: 'US Foods', date: '2024-03-12', total: 890.25, items: [], status: 'processed' },
  { id: 'inv3', supplier: 'Restaurant Depot', date: '2024-03-10', total: 2340.00, items: [], status: 'pending' },
  { id: 'inv4', supplier: 'Local Produce Co', date: '2024-03-08', total: 445.80, items: [], status: 'processed' },
  { id: 'inv5', supplier: 'Meat Purveyors Inc', date: '2024-03-05', total: 1567.90, items: [], status: 'archived' }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('recipes')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterStation, setFilterStation] = useState('all')
  const [darkMode, setDarkMode] = useState(true)
  const [userName, setUserName] = useState('Chef Maria')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  
  // Form states
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [newRecipeName, setNewRecipeName] = useState('')
  const [newRecipeDesc, setNewRecipeDesc] = useState('')
  const [newRecipeStation, setNewRecipeStation] = useState('Grill')
  const [newRecipeServings, setNewRecipeServings] = useState('4')
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const savedRecipes = localStorage.getItem('truckplate_recipes')
    const savedInvoices = localStorage.getItem('truckplate_invoices')
    const savedUser = localStorage.getItem('truckplate_user')
    
    setTimeout(() => {
      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes))
      } else {
        setRecipes(initialRecipes)
      }
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices))
      } else {
        setInvoices(initialInvoices)
      }
      if (savedUser) {
        setUserName(savedUser)
      }
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('truckplate_recipes', JSON.stringify(recipes))
    }
  }, [recipes, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('truckplate_invoices', JSON.stringify(invoices))
    }
  }, [invoices, loading])

  useEffect(() => {
    localStorage.setItem('truckplate_user', userName)
  }, [userName])

  const filteredRecipes = recipes
    .filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStation = filterStation === 'all' || r.prepStation === filterStation
      return matchesSearch && matchesStation
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'cost') {
        const costA = a.ingredients.reduce((sum, i) => sum + i.cost * i.amount, 0) / a.servings
        const costB = b.ingredients.reduce((sum, i) => sum + i.cost * i.amount, 0) / b.servings
        return costA - costB
      }
      return 0
    })

  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
    setToast({ message: 'Recipe deleted successfully', type: 'success' })
  }

  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: {[key: string]: string} = {}
    
    if (!newRecipeName.trim()) errors.name = 'Recipe name is required'
    if (!newRecipeDesc.trim()) errors.description = 'Description is required'
    if (!newRecipeServings || isNaN(parseInt(newRecipeServings))) errors.servings = 'Valid number required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: newRecipeName,
      description: newRecipeDesc,
      ingredients: [],
      prepStation: newRecipeStation,
      dietaryTags: [],
      servings: parseInt(newRecipeServings),
      prepTime: 30,
    }

    setRecipes(prev => [newRecipe, ...prev])
    setNewRecipeName('')
    setNewRecipeDesc('')
    setNewRecipeServings('4')
    setShowAddRecipe(false)
    setFormErrors({})
    setToast({ message: 'Recipe added successfully', type: 'success' })
  }

  const handleAddInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
    }
    setInvoices(prev => [newInvoice, ...prev])
    setToast({ message: 'Invoice uploaded successfully', type: 'success' })
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id))
    setToast({ message: 'Invoice removed', type: 'success' })
  }

  const handleExportData = () => {
    const data = { recipes, invoices, exportedAt: new Date().toISOString() }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setToast({ message: 'Data copied to clipboard', type: 'success' })
  }

  const stations = ['all', ...Array.from(new Set(recipes.map(r => r.prepStation)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <div className="skeleton h-16 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="skeleton h-64 rounded-[20px]" />
            <div className="skeleton h-64 rounded-[20px]" />
            <div className="skeleton h-64 rounded-[20px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen bg-[#0a0a0a]", !darkMode && "light")}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[.08]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TruckPlate</span>
            </div>
            
            <div className="flex items-center gap-1 bg-[#141414] rounded-full p-1 border border-white/[.08]">
              {[
                { id: 'recipes', label: 'Recipes', icon: ChefHat },
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'invoices', label: 'Invoices', icon: Receipt },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    activeTab === tab.id 
                      ? 'bg-white text-black' 
                      : 'text-muted hover:text-white'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'recipes' && (
          <div className="fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Recipe Management</h1>
                <p className="text-muted">Track costs, margins, and pricing for your menu items</p>
              </div>
              <button
                onClick={() => setShowAddRecipe(true)}
                className="flex items-center gap-2 bg-white text-black font-medium rounded-full px-6 py-3 hover:bg-gray-200 active:scale-95 transition-all btn-press"
              >
                <Plus className="w-5 h-5" />
                Add Recipe
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] border border-white/[.08] rounded-full pl-10 pr-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-accent"
                />
              </div>
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="bg-[#141414] border border-white/[.08] rounded-full px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              >
                {stations.map(s => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Stations' : s}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#141414] border border-white/[.08] rounded-full px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              >
                <option value="name">Sort by Name</option>
                <option value="cost">Sort by Cost</option>
              </select>
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-16 bg-[#141414] rounded-[20px] border border-white/[.08]">
                <ChefHat className="w-12 h-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No recipes found</h3>
                <p className="text-muted mb-4">Get started by adding your first recipe</p>
                <button
                  onClick={() => setShowAddRecipe(true)}
                  className="bg-white text-black font-medium rounded-full px-6 py-2 hover:bg-gray-200 transition-colors"
                >
                  Add your first recipe
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe, idx) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onDelete={handleDeleteRecipe}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {/* Add Recipe Modal */}
            {showAddRecipe && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6 w-full max-w-md fade-in-up">
                  <h2 className="text-xl font-bold text-white mb-4">Add New Recipe</h2>
                  <form onSubmit={handleAddRecipe} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Recipe Name</label>
                      <input
                        type="text"
                        value={newRecipeName}
                        onChange={(e) => setNewRecipeName(e.target.value)}
                        placeholder="e.g. Korean BBQ Bowl"
                        className={cn(
                          'w-full bg-[#0a0a0a] border rounded-lg px-4 py-2 text-white placeholder:text-muted focus:outline-none focus:border-accent',
                          formErrors.name ? 'border-red-500' : 'border-white/[.08]'
                        )}
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Description</label>
                      <textarea
                        value={newRecipeDesc}
                        onChange={(e) => setNewRecipeDesc(e.target.value)}
                        placeholder="Brief description of the dish..."
                        rows={3}
                        className={cn(
                          'w-full bg-[#0a0a0a] border rounded-lg px-4 py-2 text-white placeholder:text-muted focus:outline-none focus:border-accent resize-none',
                          formErrors.description ? 'border-red-500' : 'border-white/[.08]'
                        )}
                      />
                      {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Prep Station</label>
                        <select
                          value={newRecipeStation}
                          onChange={(e) => setNewRecipeStation(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/[.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                        >
                          <option>Grill</option>
                          <option>Fryer</option>
                          <option>Cold Prep</option>
                          <option>Oven</option>
                          <option>Smoker</option>
                          <option>Steam</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Servings</label>
                        <input
                          type="number"
                          value={newRecipeServings}
                          onChange={(e) => setNewRecipeServings(e.target.value)}
                          className={cn(
                            'w-full bg-[#0a0a0a] border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent',
                            formErrors.servings ? 'border-red-500' : 'border-white/[.08]'
                          )}
                        />
                        {formErrors.servings && <p className="text-red-500 text-xs mt-1">{formErrors.servings}</p>}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddRecipe(false)}
                        className="flex-1 py-2.5 rounded-full border border-white/[.2] text-white font-medium hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-white text-black font-medium rounded-full py-2.5 hover:bg-gray-200 active:scale-95 transition-all btn-press"
                      >
                        Add Recipe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="fade-in-up">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
              <p className="text-muted">Real-time insights into your food truck operations</p>
            </div>
            <DashboardStats recipes={recipes} invoices={invoices} />
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Supplier Invoices</h1>
                <p className="text-muted">Upload and track ingredient price changes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <InvoiceUploader onUpload={handleAddInvoice} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Invoices</h3>
                  {invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <Receipt className="w-10 h-10 text-muted mx-auto mb-3" />
                      <p className="text-muted">No invoices uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.map((inv, idx) => (
                        <div 
                          key={inv.id} 
                          className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/[.05] hover:border-white/[.15] transition-colors fade-in-up"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="flex items-center gap-4">
                            {inv.imageUrl ? (
                              <img src={inv.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-[#141414] rounded-lg flex items-center justify-center">
                                <Receipt className="w-6 h-6 text-muted" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{inv.supplier}</p>
                              <p className="text-sm text-muted">{new Date(inv.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-white">{formatCurrency(inv.total)}</span>
                            <button
                              onClick={() => handleDeleteInvoice(inv.id)}
                              className="p-2 text-muted hover:text-red-500 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="fade-in-up max-w-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h1>
              <p className="text-muted">Manage your account and preferences</p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Display Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/[.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  Appearance
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-muted">Toggle between light and dark themes</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      'w-14 h-8 rounded-full p-1 transition-colors',
                      darkMode ? 'bg-accent' : 'bg-[#0a0a0a] border border-white/[.2]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full bg-white transition-transform flex items-center justify-center',
                      darkMode ? 'translate-x-6' : 'translate-x-0'
                    )}>
                      {darkMode ? <Moon className="w-4 h-4 text-black" /> : <Sun className="w-4 h-4 text-black" />}
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-[#141414] rounded-[20px] border border-white/[.08] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent" />
                  Data Management
                </h3>
                <p className="text-sm text-muted mb-4">Export all your recipes and invoice data as JSON</p>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-white text-black font-medium rounded-full px-6 py-2.5 hover:bg-gray-200 active:scale-95 transition-all btn-press"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}