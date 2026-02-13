'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface InvoiceUploaderProps {
  onSubmit: (data: { supplier: string; amount: number; date: string; items: string }) => void
  onCancel: () => void
}

export function InvoiceUploader({ onSubmit, onCancel }: InvoiceUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [supplier, setSupplier] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!supplier.trim()) newErrors.supplier = 'Supplier name is required'
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valid amount required'
    if (!date) newErrors.date = 'Date is required'
    if (!items.trim()) newErrors.items = 'Item description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        supplier,
        amount: parseFloat(amount),
        date,
        items
      })
      setSupplier('')
      setAmount('')
      setItems('')
      setFile(null)
      setPreview(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selected)
    }
  }

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-clay mb-6 fade-in-up">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Supplier Invoice</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer',
            isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400',
            preview ? 'border-solid border-indigo-400' : ''
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { 
            e.preventDefault(); 
            setIsDragging(false); 
            const files = e.dataTransfer.files;
            if (files[0]) handleFileChange({ target: { files } } as any)
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-sm text-gray-600">Drop invoice photo here or click to upload</p>
              <p className="text-xs text-gray-400">Supports JPG, PNG, PDF</p>
            </div>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Sysco Food Services"
              className={cn(
                'w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-indigo-400 transition-colors',
                errors.supplier ? 'border-red-400' : 'border-gray-200'
              )}
            />
            {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 450.00"
              className={cn(
                'w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-indigo-400 transition-colors',
                errors.amount ? 'border-red-400' : 'border-gray-200'
              )}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(
              'w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-indigo-400 transition-colors',
              errors.date ? 'border-red-400' : 'border-gray-200'
            )}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Items Description</label>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="e.g. 50lbs brisket, 20lbs cabbage, spices..."
            rows={3}
            className={cn(
              'w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-indigo-400 transition-colors resize-none',
              errors.items ? 'border-red-400' : 'border-gray-200'
            )}
          />
          {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-400 text-white font-semibold py-3 rounded-2xl shadow-button hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all"
          >
            Submit Invoice
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}