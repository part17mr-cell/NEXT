'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
  Pencil, X, Save, MousePointer2, GripVertical, Image, DollarSign,
  Tag, FileText, Layers, Eye, EyeOff, Trash2, Plus, Settings,
  ChevronDown, ChevronUp, Package, Type,
  Palette, MessageSquare, CreditCard, LayoutGrid, Home,
  Store as StoreIcon, Shield, Users, Move
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/lib/store-context'
import { toast } from 'sonner'
import { type Product, type StoreSettings } from '@/lib/store-data'
import { ImageInput } from '@/components/ui/image-input'

interface EditModeContextType {
  isEditMode: boolean
  setEditMode: (value: boolean) => void
  editingField: string | null
  setEditingField: (field: string | null) => void
  tempValue: string
  setTempValue: (value: string) => void
}

const EditModeContext = createContext<EditModeContextType | null>(null)

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (!context) {
    return { isEditMode: false, setEditMode: () => {}, editingField: null, setEditingField: () => {}, tempValue: '', setTempValue: () => {} }
  }
  return context
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setEditMode] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState('')

  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode, editingField, setEditingField, tempValue, setTempValue }}>
      {children}
    </EditModeContext.Provider>
  )
}

// Draggable Admin Edit Panel
export function EditModeToggle() {
  const { isAdmin } = useStore()
  const { isEditMode, setEditMode } = useEditMode()
  const [isExpanded, setIsExpanded] = useState(false)
  const [position, setPosition] = useState({ x: 16, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({ 
        x: 16, 
        y: Math.min(window.innerHeight - 300, window.innerHeight / 2)
      })
    }
  }, [])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStartPos.current = { x: clientX - position.x, y: clientY - position.y }
  }

  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const newX = Math.max(0, Math.min(window.innerWidth - 100, clientX - dragStartPos.current.x))
    const newY = Math.max(0, Math.min(window.innerHeight - 100, clientY - dragStartPos.current.y))
    
    setPosition({ x: newX, y: newY })
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDrag)
      window.addEventListener('touchend', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDrag)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDrag, handleDragEnd])

  if (!isAdmin) return null

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ 
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        touchAction: 'none'
      }}
      className="select-none"
    >
      <div className={`bg-card/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
        {/* Drag Handle Header */}
        <div 
          className={`flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-b border-amber-500/20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex items-center gap-1.5 text-amber-500">
            <Move className="w-4 h-4" />
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isEditMode ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
            <span className="text-sm font-bold text-foreground">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="p-2.5">
            <Button
              onClick={() => {
                setEditMode(!isEditMode)
                if (!isEditMode) {
                  toast.success('Edit Mode เปิดแล้ว - คลิกข้อความเพื่อแก้ไข')
                  setIsExpanded(true)
                } else {
                  toast.info('Edit Mode ปิดแล้ว')
                }
              }}
              className={`w-full gap-2 font-semibold ${
                isEditMode 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              size="sm"
            >
              {isEditMode ? (
                <>
                  <X className="w-4 h-4" />
                  ปิด Edit
                </>
              ) : (
                <>
                  <MousePointer2 className="w-4 h-4" />
                  Edit Mode
                </>
              )}
            </Button>
          </div>
        )}

        {/* Expanded Full Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminEditPanel 
                isEditMode={isEditMode} 
                setEditMode={setEditMode} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Full Admin Edit Panel with ALL editing capabilities
function AdminEditPanel({ isEditMode, setEditMode }: { isEditMode: boolean; setEditMode: (v: boolean) => void }) {
  const { products, updateProducts, settings, updateSettings } = useStore()
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div className="p-3">
      {/* Edit Mode Toggle */}
      <div className="flex items-center justify-between mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <Switch
            checked={isEditMode}
            onCheckedChange={(checked) => {
              setEditMode(checked)
              toast[checked ? 'success' : 'info'](checked ? 'Edit Mode เปิด - คลิกเพื่อแก้ไข' : 'Edit Mode ปิดแล้ว')
            }}
          />
          <Label className="text-xs font-semibold">
            {isEditMode ? 'กำลังแก้ไข' : 'Edit Mode'}
          </Label>
        </div>
        {isEditMode && (
          <span className="text-[10px] text-amber-600 font-bold px-2 py-1 bg-amber-500/20 rounded-lg animate-pulse">
            ACTIVE
          </span>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 h-9 mb-3">
          <TabsTrigger value="products" className="text-[10px] gap-1 px-1">
            <Package className="w-3 h-3" />
            <span className="hidden sm:inline">สินค้า</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="text-[10px] gap-1 px-1">
            <Palette className="w-3 h-3" />
            <span className="hidden sm:inline">แบรนด์</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="text-[10px] gap-1 px-1">
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">หน้า</span>
          </TabsTrigger>
          <TabsTrigger value="visibility" className="text-[10px] gap-1 px-1">
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">แสดง</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-72">
          {/* Products Tab */}
          <TabsContent value="products" className="mt-0 space-y-2">
            <ProductsEditor products={products} onUpdate={updateProducts} />
          </TabsContent>

          {/* Brand & Contact Tab */}
          <TabsContent value="brand" className="mt-0 space-y-2">
            <BrandEditor settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          {/* Pages Content Tab */}
          <TabsContent value="pages" className="mt-0 space-y-2">
            <PagesEditor settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          {/* Visibility Tab */}
          <TabsContent value="visibility" className="mt-0 space-y-2">
            <VisibilityEditor settings={settings} onUpdate={updateSettings} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

// Products Editor with FULL capabilities
function ProductsEditor({ products, onUpdate }: { products: Product[]; onUpdate: (products: Product[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSaveProduct = (product: Product) => {
    const updated = products.map(p => p.id === product.id ? product : p)
    onUpdate(updated)
    toast.success('บันทึกสินค้าแล้ว')
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('ต้องการลบสินค้านี้?')) {
      const updated = products.filter(p => p.id !== id)
      onUpdate(updated)
      toast.success('ลบสินค้าแล้ว')
    }
  }

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      sku: `SKU-${Date.now()}`,
      name: 'สินค้าใหม่',
      category: 'NEW',
      short_description: 'รายละเอียดสั้น',
      description: 'รายละเอียดสินค้า',
      long_description: 'รายละเอียดสินค้าแบบยาว สำหรับแสดงในหน้ารายละเอียด',
      price: 100,
      sale_price: 0,
      badge: 'ใหม่',
      icon: '',
      image_url: '',
      delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้าทันที',
      download_url: '',
      is_active: true,
      sort_order: products.length + 1,
      stock_qty: null
    }
    onUpdate([...products, newProduct])
    setExpandedId(newProduct.id)
    toast.success('เพิ่มสินค้าใหม่แล้ว')
  }

  const handleDuplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      name: `${product.name} (สำเนา)`,
      sort_order: products.length + 1
    }
    onUpdate([...products, newProduct])
    toast.success('ทำสำเนาสินค้าแล้ว')
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAddProduct} size="sm" className="w-full gap-2 h-9 text-xs bg-emerald-600 hover:bg-emerald-700">
        <Plus className="w-3.5 h-3.5" />
        เพิ่มสินค้าใหม่
      </Button>

      <div className="text-[10px] text-muted-foreground text-center py-1">
        {products.length} สินค้าทั้งหมด
      </div>

      {products.map((product, index) => (
        <div key={product.id} className="border border-border/50 rounded-xl overflow-hidden bg-secondary/20">
          <div 
            className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
          >
            <span className="text-[10px] text-muted-foreground w-5">{index + 1}</span>
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${product.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
            <span className="text-xs font-medium flex-1 truncate">{product.name}</span>
            <span className="text-[10px] text-primary font-semibold">{product.sale_price || product.price}฿</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedId === product.id ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {expandedId === product.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <ProductEditForm 
                  product={product} 
                  onSave={handleSaveProduct}
                  onDelete={() => handleDeleteProduct(product.id)}
                  onDuplicate={() => handleDuplicateProduct(product)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// Complete Product Edit Form
function ProductEditForm({ product, onSave, onDelete, onDuplicate }: { 
  product: Product
  onSave: (p: Product) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [form, setForm] = useState(product)

  const updateField = (field: keyof Product, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-3 pt-0 space-y-3 border-t border-border/30">
      {/* Basic Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
          <Type className="w-3 h-3" /> ข้อมูลพื้นฐาน
        </div>
        <Input 
          value={form.name} 
          onChange={e => updateField('name', e.target.value)}
          placeholder="ชื่อสินค้า"
          className="h-8 text-xs"
        />
        <Input 
          value={form.sku} 
          onChange={e => updateField('sku', e.target.value)}
          placeholder="SKU"
          className="h-8 text-xs"
        />
      </div>

      {/* Image */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
          <Image className="w-3 h-3" /> รูปภาพ
        </div>
        <ImageInput
          value={form.image_url || ''}
          onChange={v => updateField('image_url', v)}
          placeholder="URL หรืออัปโหลดรูปจากเครื่อง"
          previewHeight="h-20"
        />
      </div>

      {/* Category & Badge */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Layers className="w-3 h-3" /> หมวดหมู่
          </Label>
          <Input 
            value={form.category} 
            onChange={e => updateField('category', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Tag className="w-3 h-3" /> Badge
          </Label>
          <Input 
            value={form.badge} 
            onChange={e => updateField('badge', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Prices */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
          <DollarSign className="w-3 h-3" /> ราคา
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">ราคาปกติ</Label>
            <Input 
              type="number"
              value={form.price} 
              onChange={e => updateField('price', Number(e.target.value))}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">ราคาลด (0 = ไม่ลด)</Label>
            <Input 
              type="number"
              value={form.sale_price} 
              onChange={e => updateField('sale_price', Number(e.target.value))}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
          <FileText className="w-3 h-3" /> รายละเอียด
        </div>
        <Textarea 
          value={form.short_description} 
          onChange={e => updateField('short_description', e.target.value)}
          placeholder="รายละเอียดสั้น (แสดงในการ์ด)"
          className="text-xs min-h-[50px]"
        />
        <Textarea 
          value={form.long_description} 
          onChange={e => updateField('long_description', e.target.value)}
          placeholder="รายละเอียดยาว (แสดงใน Modal)"
          className="text-xs min-h-[70px]"
        />
        <Textarea 
          value={form.delivery_note} 
          onChange={e => updateField('delivery_note', e.target.value)}
          placeholder="หมายเหตุการส่งมอบ"
          className="text-xs min-h-[40px]"
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50">
        <Label className="text-xs font-medium">เปิดขาย</Label>
        <Switch 
          checked={form.is_active} 
          onCheckedChange={v => updateField('is_active', v)} 
        />
      </div>

      {/* Social Proof */}
      <div className="p-2.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-1.5">
        <Label className="text-[10px] text-yellow-400 font-bold">★ Social Proof (ว่าง = สุ่มอัตโนมัติ)</Label>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="space-y-0.5">
            <Label className="text-[9px] text-muted-foreground">ดาว</Label>
            <Input type="number" step="0.1" min="0" max="5"
              value={form.rating ?? ''}
              onChange={e => updateField('rating', e.target.value === '' ? undefined : +e.target.value)}
              placeholder="4.8" className="h-7 text-xs" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-[9px] text-muted-foreground">ยอดดู</Label>
            <Input type="number"
              value={form.views ?? ''}
              onChange={e => updateField('views', e.target.value === '' ? undefined : +e.target.value)}
              placeholder="5304" className="h-7 text-xs" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-[9px] text-muted-foreground">ขายแล้ว</Label>
            <Input type="number"
              value={form.sold ?? ''}
              onChange={e => updateField('sold', e.target.value === '' ? undefined : +e.target.value)}
              placeholder="171" className="h-7 text-xs" />
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-1.5">
        <Label className="text-[10px] text-orange-400 font-bold">สต็อกสินค้า</Label>
        <Input
          type="number"
          value={form.stock_qty ?? ''}
          onChange={e => updateField('stock_qty', e.target.value === '' ? null : Number(e.target.value))}
          placeholder="ว่าง = ไม่จำกัด"
          className="h-8 text-xs"
        />
        <div className="flex gap-1 flex-wrap">
          {[3, 5, 10, 20].map(n => (
            <button key={n} type="button" onClick={() => updateField('stock_qty', n)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${form.stock_qty === n ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500 hover:text-white'}`}>
              {n}
            </button>
          ))}
          <button type="button" onClick={() => updateField('stock_qty', null)}
            className="px-2 py-0.5 rounded text-[9px] font-bold border bg-secondary/50 text-muted-foreground border-border/50">
            ∞
          </button>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1.5">
        <Label className="text-[10px] text-red-400 font-bold">⚡ Flash Sale</Label>
        <div className="flex gap-1 flex-wrap">
          {[{ label: '1ชม', h: 1 }, { label: '3ชม', h: 3 }, { label: '6ชม', h: 6 }, { label: '24ชม', h: 24 }].map(({ label, h }) => (
            <button key={h} type="button"
              onClick={() => updateField('flash_sale_end', new Date(Date.now() + h * 3600000).toISOString())}
              className="px-2 py-0.5 rounded text-[9px] font-bold border bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white transition-all">
              +{label}
            </button>
          ))}
          <button type="button" onClick={() => updateField('flash_sale_end', undefined)}
            className="px-2 py-0.5 rounded text-[9px] font-bold border bg-secondary/50 text-muted-foreground border-border/50 hover:bg-destructive hover:text-white transition-all">
            ปิด
          </button>
        </div>
        {form.flash_sale_end && new Date(form.flash_sale_end) > new Date()
          ? <p className="text-[9px] text-red-400 font-bold">🔴 กำลัง Flash Sale — หมด {new Date(form.flash_sale_end).toLocaleTimeString('th-TH')}</p>
          : <p className="text-[9px] text-muted-foreground">ยังไม่ได้เปิด</p>
        }
      </div>

      {/* Sort Order */}
      <div className="space-y-1">
        <Label className="text-[10px] text-muted-foreground">ลำดับการแสดง</Label>
        <Input
          type="number"
          value={form.sort_order}
          onChange={e => updateField('sort_order', Number(e.target.value))}
          className="h-8 text-xs"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border/30">
        <Button onClick={() => onSave(form)} size="sm" className="flex-1 h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-3 h-3" />
          บันทึก
        </Button>
        <Button onClick={onDuplicate} variant="outline" size="sm" className="h-8 text-xs">
          ทำสำเนา
        </Button>
        <Button onClick={onDelete} variant="destructive" size="sm" className="h-8 text-xs">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

// Brand & Contact Editor
function BrandEditor({ settings, onUpdate }: { settings: StoreSettings; onUpdate: (s: Partial<StoreSettings>) => void }) {
  const [brand, setBrand] = useState(settings.brand)
  const [contact, setContact] = useState(settings.contact)
  const [payment, setPayment] = useState(settings.payment)

  return (
    <div className="space-y-3">
      {/* Brand */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-primary" /> แบรนด์ร้าน
        </h4>
        <Input 
          value={brand.storeName}
          onChange={e => setBrand(prev => ({ ...prev, storeName: e.target.value }))}
          placeholder="ชื่อร้าน"
          className="h-8 text-xs"
        />
        <Input 
          value={brand.tagline}
          onChange={e => setBrand(prev => ({ ...prev, tagline: e.target.value }))}
          placeholder="Tagline"
          className="h-8 text-xs"
        />
        <ImageInput
          value={brand.logoUrl || ''}
          onChange={v => setBrand(prev => ({ ...prev, logoUrl: v }))}
          placeholder="URL หรืออัปโหลดโลโก้"
          previewHeight="h-12"
        />
        <Input 
          value={brand.domain}
          onChange={e => setBrand(prev => ({ ...prev, domain: e.target.value }))}
          placeholder="Domain"
          className="h-8 text-xs"
        />
        <Button 
          onClick={() => { onUpdate({ brand }); toast.success('บันทึกแบรนด์แล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกแบรนด์
        </Button>
      </div>

      {/* Contact */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" /> ช่องทางติดต่อ
        </h4>
        <Input 
          value={contact.lineId}
          onChange={e => setContact(prev => ({ ...prev, lineId: e.target.value }))}
          placeholder="Line ID"
          className="h-8 text-xs"
        />
        <Input 
          value={contact.lineUrl}
          onChange={e => setContact(prev => ({ ...prev, lineUrl: e.target.value }))}
          placeholder="Line URL"
          className="h-8 text-xs"
        />
        <Input 
          value={contact.email}
          onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
          className="h-8 text-xs"
        />
        <Input 
          value={contact.phone}
          onChange={e => setContact(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="เบอร์โทร"
          className="h-8 text-xs"
        />
        <Button 
          onClick={() => { onUpdate({ contact }); toast.success('บันทึกข้อมูลติดต่อแล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกข้อมูลติดต่อ
        </Button>
      </div>

      {/* Payment */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-primary" /> การชำระเงิน
        </h4>
        <Input 
          value={payment.bankName}
          onChange={e => setPayment(prev => ({ ...prev, bankName: e.target.value }))}
          placeholder="ชื่อธนาคาร"
          className="h-8 text-xs"
        />
        <Input 
          value={payment.accountName}
          onChange={e => setPayment(prev => ({ ...prev, accountName: e.target.value }))}
          placeholder="ชื่อบัญชี"
          className="h-8 text-xs"
        />
        <Input 
          value={payment.accountNumber}
          onChange={e => setPayment(prev => ({ ...prev, accountNumber: e.target.value }))}
          placeholder="เลขบัญชี"
          className="h-8 text-xs"
        />
        <ImageInput
          value={payment.qrImageUrl || ''}
          onChange={v => setPayment(prev => ({ ...prev, qrImageUrl: v }))}
          placeholder="URL หรืออัปโหลด QR Code จากเครื่อง"
          previewHeight="h-20"
        />
        <Textarea 
          value={payment.note}
          onChange={e => setPayment(prev => ({ ...prev, note: e.target.value }))}
          placeholder="หมายเหตุการชำระเงิน"
          className="text-xs min-h-[40px]"
        />
        <Button 
          onClick={() => { onUpdate({ payment }); toast.success('บันทึกข้อมูลชำระเงินแล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกข้อมูลชำระเงิน
        </Button>
      </div>
    </div>
  )
}

// Pages Content Editor
function PagesEditor({ settings, onUpdate }: { settings: StoreSettings; onUpdate: (s: Partial<StoreSettings>) => void }) {
  const [home, setHome] = useState(settings.home)
  const [store, setStore] = useState(settings.store)
  const [pages, setPages] = useState(settings.pages)

  return (
    <div className="space-y-3">
      {/* Home Page */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-primary" /> หน้าแรก
        </h4>
        <Input 
          value={home.heroTitle}
          onChange={e => setHome(prev => ({ ...prev, heroTitle: e.target.value }))}
          placeholder="Hero Title ({store} = ชื่อร้าน)"
          className="h-8 text-xs"
        />
        <Textarea 
          value={home.heroSubtitle}
          onChange={e => setHome(prev => ({ ...prev, heroSubtitle: e.target.value }))}
          placeholder="Hero Subtitle"
          className="text-xs min-h-[50px]"
        />
        <Input 
          value={home.announcement}
          onChange={e => setHome(prev => ({ ...prev, announcement: e.target.value }))}
          placeholder="ข้อความประกาศ"
          className="h-8 text-xs"
        />
        <Input 
          value={home.primaryButton}
          onChange={e => setHome(prev => ({ ...prev, primaryButton: e.target.value }))}
          placeholder="ปุ่มหลัก"
          className="h-8 text-xs"
        />
        <Button 
          onClick={() => { onUpdate({ home }); toast.success('บันทึกหน้าแรกแล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกหน้าแรก
        </Button>
      </div>

      {/* Store Page */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <StoreIcon className="w-3.5 h-3.5 text-primary" /> หน้าร้านค้า
        </h4>
        <Input 
          value={store.title}
          onChange={e => setStore(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="h-8 text-xs"
        />
        <Textarea 
          value={store.subtitle}
          onChange={e => setStore(prev => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Subtitle"
          className="text-xs min-h-[50px]"
        />
        <Input 
          value={store.badges.join(', ')}
          onChange={e => setStore(prev => ({ ...prev, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
          placeholder="Badges (คั่นด้วย ,)"
          className="h-8 text-xs"
        />
        <Button 
          onClick={() => { onUpdate({ store }); toast.success('บันทึกหน้าร้านค้าแล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกหน้าร้านค้า
        </Button>
      </div>

      {/* Other Pages */}
      <div className="p-3 border border-border/50 rounded-xl space-y-2 bg-secondary/20">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-primary" /> หน้าอื่นๆ
        </h4>
        <Input 
          value={pages.aboutTitle}
          onChange={e => setPages(prev => ({ ...prev, aboutTitle: e.target.value }))}
          placeholder="About Title"
          className="h-8 text-xs"
        />
        <Input 
          value={pages.privacyTitle}
          onChange={e => setPages(prev => ({ ...prev, privacyTitle: e.target.value }))}
          placeholder="Privacy Title"
          className="h-8 text-xs"
        />
        <Input 
          value={pages.refundTitle}
          onChange={e => setPages(prev => ({ ...prev, refundTitle: e.target.value }))}
          placeholder="Refund Title"
          className="h-8 text-xs"
        />
        <Button 
          onClick={() => { onUpdate({ pages }); toast.success('บันทึกหน้าอื่นๆ แล้ว') }} 
          size="sm" 
          className="w-full h-8 text-xs"
        >
          บันทึกหน้าอื่นๆ
        </Button>
      </div>
    </div>
  )
}

// Visibility Editor
function VisibilityEditor({ settings, onUpdate }: { settings: StoreSettings; onUpdate: (s: Partial<StoreSettings>) => void }) {
  const [visibility, setVisibility] = useState(settings.visibility)

  const toggleVisibility = (key: keyof typeof visibility) => {
    const updated = { ...visibility, [key]: !visibility[key] }
    setVisibility(updated)
    onUpdate({ visibility: updated })
    toast.success(`${visibility[key] ? 'ซ่อน' : 'แสดง'}แล้ว`)
  }

  const visibilityItems = [
    { key: 'homeHero', label: 'Hero หน้าแรก', icon: Home },
    { key: 'homeAnnouncement', label: 'ประกาศหน้าแรก', icon: MessageSquare },
    { key: 'homeStats', label: 'สถิติหน้าแรก', icon: LayoutGrid },
    { key: 'homeCategories', label: 'หมวดหมู่หน้าแรก', icon: Layers },
    { key: 'homeGuide', label: 'วิธีสั่งซื้อ', icon: FileText },
    { key: 'storeHero', label: 'Hero ร้านค้า', icon: StoreIcon },
    { key: 'storeToolbar', label: 'แถบค้นหาร้านค้า', icon: Tag },
    { key: 'storeBadges', label: 'Badge ร้านค้า', icon: Shield },
    { key: 'cartFab', label: 'ปุ่มตะกร้าลอย', icon: Package },
    { key: 'footerAdmin', label: 'ลิงก์แอดมิน', icon: Users },
    { key: 'footerPolicies', label: 'ลิงก์นโยบาย', icon: FileText },
  ] as const

  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground mb-2 px-1">
        เปิด/ปิด การแสดงผลส่วนต่างๆ ของเว็บไซต์
      </p>
      {visibilityItems.map(item => {
        const Icon = item.icon
        return (
          <div 
            key={item.key}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {visibility[item.key] ? (
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground/50" />
              )}
              <Icon className="w-3 h-3 text-muted-foreground" />
              <Label className={`text-xs cursor-pointer ${!visibility[item.key] ? 'text-muted-foreground' : ''}`}>
                {item.label}
              </Label>
            </div>
            <Switch 
              checked={visibility[item.key]} 
              onCheckedChange={() => toggleVisibility(item.key)}
            />
          </div>
        )
      })}
    </div>
  )
}

// Editable Text Component
interface EditableTextProps {
  fieldPath: string
  value: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  multiline?: boolean
  children?: ReactNode
}

export function EditableText({ 
  fieldPath, 
  value, 
  className = '', 
  as: Component = 'span',
  multiline = false,
  children
}: EditableTextProps) {
  const { isEditMode, editingField, setEditingField } = useEditMode()
  const { settings, updateSettings } = useStore()
  const [localValue, setLocalValue] = useState(value)
  const isEditing = editingField === fieldPath

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return
    e.preventDefault()
    e.stopPropagation()
    setEditingField(fieldPath)
    setLocalValue(value)
  }, [isEditMode, fieldPath, value, setEditingField])

  const handleSave = useCallback(() => {
    const parts = fieldPath.split('.')
    if (parts.length >= 2) {
      const newSettings = { ...settings }
      let current: Record<string, unknown> = newSettings
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] && typeof current[parts[i]] === 'object') {
          current[parts[i]] = { ...(current[parts[i]] as Record<string, unknown>) }
          current = current[parts[i]] as Record<string, unknown>
        }
      }
      
      current[parts[parts.length - 1]] = localValue
      updateSettings(newSettings)
      toast.success('บันทึกแล้ว')
    }
    setEditingField(null)
  }, [fieldPath, localValue, settings, updateSettings, setEditingField])

  const handleCancel = useCallback(() => {
    setEditingField(null)
    setLocalValue(value)
  }, [value, setEditingField])

  if (isEditing) {
    return (
      <motion.div 
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="relative inline-block w-full"
      >
        {multiline ? (
          <Textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className={`${className} min-h-20 border-amber-500 focus:ring-amber-500`}
            autoFocus
          />
        ) : (
          <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className={`${className} border-amber-500 focus:ring-amber-500`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />
        )}
        <div className="flex gap-1 mt-2">
          <Button size="sm" onClick={handleSave} className="gap-1 bg-emerald-500 hover:bg-emerald-600">
            <Save className="w-3 h-3" />
            บันทึก
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            ยกเลิก
          </Button>
        </div>
      </motion.div>
    )
  }

  if (!isEditMode) {
    return <Component className={className}>{children || value}</Component>
  }

  return (
    <Component
      className={`${className} cursor-pointer relative group`}
      onClick={handleClick}
    >
      {children || value}
      <motion.span
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center"
      >
        <Pencil className="w-3 h-3" />
      </motion.span>
      <span className="absolute inset-0 rounded-lg ring-2 ring-amber-500/50 ring-offset-2 ring-offset-background opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Component>
  )
}
