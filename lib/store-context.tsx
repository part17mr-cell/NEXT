'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import {
  type Product,
  type CartItem,
  type Order,
  type Member,
  type StoreSettings,
  type PromoCode,
  type Review,
  defaultSettings,
  demoProducts,
  STORAGE_KEYS
} from '@/lib/store-data'
import { toast } from 'sonner'

interface StoreContextType {
  // Settings
  settings: StoreSettings
  updateSettings: (settings: Partial<StoreSettings>) => void
  
  // Products
  products: Product[]
  activeProducts: Product[]
  categories: string[]
  getProductById: (id: string) => Product | undefined
  updateProducts: (products: Product[]) => void
  
  // Cart
  cart: CartItem[]
  cartTotal: number
  cartCount: number
  addToCart: (productId: string, qty?: number) => void
  updateCartItem: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  
  // Orders
  orders: Order[]
  createOrder: (orderData: Omit<Order, 'id' | 'order_code' | 'created_at' | 'updated_at'>) => Order
  updateOrder: (orderId: string, updates: Partial<Order>) => void
  
  // Members
  members: Member[]
  currentMember: Member | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateMembers: (members: Member[]) => void
  
  // Admin
  isAdmin: boolean
  adminLogin: (username: string, password: string) => boolean
  adminLogout: () => void

  // Promo Codes
  promoCodes: PromoCode[]
  createPromoCode: (data: Omit<PromoCode, 'id' | 'uses' | 'created_at'>) => void
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void
  deletePromoCode: (id: string) => void
  applyPromoCode: (code: string, orderTotal: number) => { discount: number; promoCode: PromoCode } | null

  // Reviews & social proof
  reviews: Review[]
  addReview: (data: Omit<Review, 'id' | 'created_at'>) => void
  deleteReview: (id: string) => void
  updateReview: (id: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>) => void
  getProductReviews: (productId: string) => Review[]
  getProductRating: (productId: string, stableHash: number, override?: number) => number
  getProductSoldCount: (productId: string, stableHash: number, override?: number) => number
  getProductViewCount: (productId: string, stableHash: number, override?: number) => number
  incrementProductViews: (productId: string, stableHash: number) => void

  // Modal state (for hiding cart FAB)
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void

  // Manual refresh from server
  refreshFromServer: () => Promise<void>

  // Helpers
  formatMoney: (amount: number) => string
  isLoaded: boolean
}

const StoreContext = createContext<StoreContextType | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(
        output[key] as Record<string, any>,
        source[key] as Record<string, any>
      ) as T[Extract<keyof T, string>]
    } else if (source[key] !== undefined) {
      output[key] = source[key] as T[Extract<keyof T, string>]
    }
  }
  return output
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function writeProductImages(products: Product[]): void {
  if (typeof window === 'undefined') return
  for (const p of products) {
    if (p.image_url?.startsWith('data:')) {
      try {
        localStorage.setItem(`nextthon.v1.img.${p.id}`, p.image_url)
      } catch {
        // If individual image still can't fit, keep it in the products array as-is
        // (mergeProductImages will fall back to whatever is in the products key)
      }
    }
    if (p.gallery_images) {
      p.gallery_images.forEach((img, i) => {
        if (img?.startsWith('data:')) {
          try {
            localStorage.setItem(`nextthon.v1.img.${p.id}.g${i}`, img)
          } catch { /* ignore individual gallery slot failures */ }
        }
      })
    }
  }
}

function mergeProductImages(products: Product[]): Product[] {
  if (typeof window === 'undefined') return products
  return products.map(p => {
    const cover = p.image_url?.startsWith('data:')
      ? p.image_url
      : (localStorage.getItem(`nextthon.v1.img.${p.id}`) ?? p.image_url)
    const gallery = (p.gallery_images ?? []).map((img, i) =>
      img?.startsWith('data:') ? img : (localStorage.getItem(`nextthon.v1.img.${p.id}.g${i}`) ?? img)
    )
    return { ...p, image_url: cover, gallery_images: gallery }
  })
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  let data: unknown = value
  if (key === STORAGE_KEYS.orders && Array.isArray(value)) {
    data = (value as Order[]).map(o => ({ ...o, slip_data: '' }))
  } else if (key === STORAGE_KEYS.products && Array.isArray(value)) {
    writeProductImages(value as Product[])
    // Strip base64 from the products array — they're now in separate keys.
    // But verify each image was actually saved; if not, keep the data URL so the
    // current session still shows the image (the next reload will miss it but
    // at least we don't lose it immediately).
    data = (value as Product[]).map(p => {
      const coverSaved = !p.image_url?.startsWith('data:') || localStorage.getItem(`nextthon.v1.img.${p.id}`) !== null
      const galleryMapped = (p.gallery_images ?? []).map((img, i) => {
        if (!img?.startsWith('data:')) return img
        return localStorage.getItem(`nextthon.v1.img.${p.id}.g${i}`) !== null ? '' : img
      })
      return {
        ...p,
        image_url: coverSaved ? (p.image_url?.startsWith('data:') ? '' : p.image_url) : p.image_url,
        gallery_images: galleryMapped,
      }
    })
  }
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage write failed for', key, e)
  }
}

async function sha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return btoa(unescape(encodeURIComponent(text))).split('').reverse().join('')
}

function generateId(prefix: string): string {
  if (typeof window !== 'undefined' && crypto?.randomUUID) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function generateOrderCode(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `PX${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function normalizeUsername(value: string): string {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 32)
}

// ── Server sync helpers ─────────────────────────────────────────────────────
type ServerPayload = {
  settings?: Partial<StoreSettings>
  products?: Product[]
  orders?: Order[]
  members?: Member[]
  promoCodes?: PromoCode[]
  reviews?: Review[]
  viewCounts?: Record<string, number>
}

async function fetchFromServer(): Promise<ServerPayload> {
  try {
    const res = await fetch('/api/store', { cache: 'no-store' })
    if (!res.ok) return {}
    return await res.json()
  } catch {
    return {}
  }
}

function pushToServer(payload: ServerPayload) {
  fetch('/api/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [currentMember, setCurrentMember] = useState<Member | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})
  const [modalCount, setModalCount] = useState(0)

  // Ref tracking latest server-syncable state (updated each render)
  const serverStateRef = useRef<ServerPayload>({})
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Keep ref current
  serverStateRef.current = { settings, products, orders, members, promoCodes, reviews, viewCounts }

  const scheduleServerSync = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      pushToServer(serverStateRef.current)
    }, 400)
  }, [])

  // Initialize: localStorage first (instant), then overlay server data
  useEffect(() => {
    const localProducts = read<Product[]>(STORAGE_KEYS.products, [])
    const withImages = mergeProductImages(localProducts.length ? localProducts : demoProducts)

    setSettings(deepMerge(defaultSettings, read<Partial<StoreSettings>>(STORAGE_KEYS.settings, {})))
    setProducts(withImages)
    setCart(read<CartItem[]>(STORAGE_KEYS.cart, []))
    setOrders(read<Order[]>(STORAGE_KEYS.orders, []))
    setMembers(read<Member[]>(STORAGE_KEYS.members, []))
    setPromoCodes(read<PromoCode[]>(STORAGE_KEYS.promoCodes, []))
    setReviews(read<Review[]>(STORAGE_KEYS.reviews, []))
    setViewCounts(read<Record<string, number>>(STORAGE_KEYS.views, {}))

    const memberId = sessionStorage.getItem(STORAGE_KEYS.member) || localStorage.getItem(STORAGE_KEYS.member)
    if (memberId) {
      const memberList = read<Member[]>(STORAGE_KEYS.members, [])
      const member = memberList.find(m => m.id === memberId)
      if (member) setCurrentMember(member)
    }
    if (sessionStorage.getItem(STORAGE_KEYS.admin) === 'ok') setIsAdmin(true)

    // Then fetch server data (source of truth for shared data)
    fetchFromServer().then(sv => {
      if (sv.settings)    setSettings(deepMerge(defaultSettings, sv.settings))
      if (sv.products?.length) setProducts(sv.products)  // server has full images
      if (sv.orders)      setOrders(sv.orders)
      if (sv.members) {
        setMembers(sv.members)
        // Re-resolve currentMember against server members
        const memberId2 = sessionStorage.getItem(STORAGE_KEYS.member) || localStorage.getItem(STORAGE_KEYS.member)
        if (memberId2) {
          const m = sv.members.find((m: Member) => m.id === memberId2)
          if (m) setCurrentMember(m)
        }
      }
      if (sv.promoCodes)  setPromoCodes(sv.promoCodes)
      if (sv.reviews)     setReviews(sv.reviews)
      if (sv.viewCounts)  setViewCounts(sv.viewCounts)
      setIsLoaded(true)
    }).catch(() => setIsLoaded(true))
  }, [])

  // Poll server every 15s when admin is logged in so new customer orders appear live
  useEffect(() => {
    if (!isAdmin || !isLoaded) return
    const poll = async () => {
      const sv = await fetchFromServer()
      if (sv.orders)  setOrders(sv.orders)
      if (sv.members) setMembers(sv.members)
    }
    const timer = setInterval(poll, 15000)
    return () => clearInterval(timer)
  }, [isAdmin, isLoaded])

  // Settings
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const updated = deepMerge(prev, newSettings as Partial<StoreSettings>)
      write(STORAGE_KEYS.settings, updated)
      toast.success('บันทึกการตั้งค่าแล้ว')
      return updated
    })
    scheduleServerSync()
  }, [scheduleServerSync])

  // Products
  const activeProducts = products.filter(p => p.is_active !== false).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
  const categories = [...new Set(activeProducts.map(p => p.category).filter(Boolean))]

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id)
  }, [products])

  const updateProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts)
    write(STORAGE_KEYS.products, newProducts)
    scheduleServerSync()
  }, [scheduleServerSync])

  // Cart
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const addToCart = useCallback((productId: string, qty = 1) => {
    const product = products.find(p => p.id === productId)
    if (!product) {
      toast.error('ไม่พบสินค้า')
      return
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === productId)
      let updated: CartItem[]
      
      if (existing) {
        updated = prev.map(item => 
          item.id === productId ? { ...item, qty: item.qty + qty } : item
        )
      } else {
        updated = [...prev, {
          id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: product.sale_price || product.price,
          qty,
          delivery_note: product.delivery_note
        }]
      }
      
      write(STORAGE_KEYS.cart, updated)
      return updated
    })
    
  }, [products])

  const updateCartItem = useCallback((productId: string, qty: number) => {
    setCart(prev => {
      if (qty <= 0) {
        const updated = prev.filter(item => item.id !== productId)
        write(STORAGE_KEYS.cart, updated)
        return updated
      }
      const updated = prev.map(item => 
        item.id === productId ? { ...item, qty } : item
      )
      write(STORAGE_KEYS.cart, updated)
      return updated
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== productId)
      write(STORAGE_KEYS.cart, updated)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    write(STORAGE_KEYS.cart, [])
  }, [])

  // Orders
  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'order_code' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const order: Order = {
      ...orderData,
      id: generateId('order'),
      order_code: generateOrderCode(),
      created_at: now,
      updated_at: now,
    }
    setOrders(prev => {
      const updated = [order, ...prev]
      write(STORAGE_KEYS.orders, updated)
      return updated
    })
    // Decrement stock for each item that has stock tracking
    setProducts(prev => {
      let changed = false
      const updated = prev.map(p => {
        const item = orderData.items.find(i => i.id === p.id)
        if (item && p.stock_qty !== null && p.stock_qty !== undefined) {
          changed = true
          return { ...p, stock_qty: Math.max(0, p.stock_qty - item.qty) }
        }
        return p
      })
      if (changed) write(STORAGE_KEYS.products, updated)
      return changed ? updated : prev
    })
    scheduleServerSync()
    return order
  }, [scheduleServerSync])

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev => {
      const updated = prev.map(order =>
        order.id === orderId
          ? { ...order, ...updates, updated_at: new Date().toISOString() }
          : order
      )
      write(STORAGE_KEYS.orders, updated)
      return updated
    })
    scheduleServerSync()
  }, [scheduleServerSync])

  // Members
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const normalizedUsername = normalizeUsername(username)
    const hash = await sha256(password)
    
    // Find member by username first
    const member = members.find(m => normalizeUsername(m.username) === normalizedUsername)
    
    if (!member) {
      toast.error('ไม่พบ Username นี้ในระบบ')
      return false
    }
    
    // Check password - compare with stored hash
    const passwordMatch = member.password_hash === hash
    
    if (!passwordMatch) {
      toast.error('Password ไม่ถูกต้อง กรุณาลองใหม่')
      return false
    }
    
    // Clear admin session when logging in as member
    setIsAdmin(false)
    sessionStorage.removeItem(STORAGE_KEYS.admin)
    setCurrentMember(member)
    sessionStorage.setItem(STORAGE_KEYS.member, member.id)
    localStorage.setItem(STORAGE_KEYS.member, member.id)
    toast.success('เข้าสู่ระบบสำเร็จ')
    return true
  }, [members])

  const register = useCallback(async (username: string, password: string): Promise<boolean> => {
    const normalizedUsername = normalizeUsername(username)
    
    if (normalizedUsername.length < 3) {
      toast.error('Username ต้องมีอย่างน้อย 3 ตัว')
      return false
    }
    
    if (normalizedUsername === normalizeUsername(settings.security.adminUsername)) {
      toast.error('Username นี้ใช้สำหรับแอดมินแล้ว')
      return false
    }
    
    if (members.some(m => normalizeUsername(m.username) === normalizedUsername)) {
      toast.error('Username นี้ถูกใช้แล้ว')
      return false
    }
    
    const hash = await sha256(password)
    const member: Member = {
      id: generateId('mem'),
      username: normalizedUsername,
      display_name: '',
      password_hash: hash,
      created_at: new Date().toISOString(),
      role: 'member',
      rank: '',
      note: '',
    }
    
    setMembers(prev => {
      const updated = [member, ...prev]
      write(STORAGE_KEYS.members, updated)
      return updated
    })
    setCurrentMember(member)
    sessionStorage.setItem(STORAGE_KEYS.member, member.id)
    localStorage.setItem(STORAGE_KEYS.member, member.id)
    scheduleServerSync()
    toast.success('สมัครสมาชิกสำเร็จ')
    return true
  }, [members, settings.security.adminUsername, scheduleServerSync])

  const logout = useCallback(() => {
    setCurrentMember(null)
    sessionStorage.removeItem(STORAGE_KEYS.member)
    localStorage.removeItem(STORAGE_KEYS.member)
  }, [])

  const updateMembers = useCallback((newMembers: Member[]) => {
    setMembers(newMembers)
    write(STORAGE_KEYS.members, newMembers)
    scheduleServerSync()
  }, [scheduleServerSync])

  // Admin
  const adminLogin = useCallback((username: string, password: string): boolean => {
    const normalizedInput = normalizeUsername(username)
    const storedUsername = normalizeUsername(settings.security.adminUsername)
    const defaultUsername = normalizeUsername(defaultSettings.security.adminUsername)
    
    // Check username first
    const usernameMatchesStored = normalizedInput === storedUsername
    const usernameMatchesDefault = normalizedInput === defaultUsername
    
    if (!usernameMatchesStored && !usernameMatchesDefault) {
      toast.error('ไม่พบ Username แอดมินนี้')
      return false
    }
    
    // Check password
    const passwordMatchesStored = usernameMatchesStored && password === settings.security.adminPassword
    const passwordMatchesDefault = usernameMatchesDefault && password === defaultSettings.security.adminPassword
    
    if (passwordMatchesStored || passwordMatchesDefault) {
      // Clear member session when switching to admin
      setCurrentMember(null)
      sessionStorage.removeItem(STORAGE_KEYS.member)
      localStorage.removeItem(STORAGE_KEYS.member)
      setIsAdmin(true)
      sessionStorage.setItem(STORAGE_KEYS.admin, 'ok')
      toast.success('เข้าสู่ระบบแอดมินสำเร็จ')
      return true
    }
    
    toast.error('Password ไม่ถูกต้อง กรุณาลองใหม่')
    return false
  }, [settings.security.adminUsername, settings.security.adminPassword])

  const adminLogout = useCallback(() => {
    setIsAdmin(false)
    sessionStorage.removeItem(STORAGE_KEYS.admin)
  }, [])

  // Promo Codes
  const createPromoCode = useCallback((data: Omit<PromoCode, 'id' | 'uses' | 'created_at'>) => {
    const code: PromoCode = {
      ...data,
      id: generateId('promo'),
      uses: 0,
      created_at: new Date().toISOString(),
    }
    setPromoCodes(prev => {
      const updated = [code, ...prev]
      write(STORAGE_KEYS.promoCodes, updated)
      return updated
    })
    scheduleServerSync()
    toast.success('สร้างโค้ดส่วนลดแล้ว')
  }, [scheduleServerSync])

  const updatePromoCode = useCallback((id: string, updates: Partial<PromoCode>) => {
    setPromoCodes(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      write(STORAGE_KEYS.promoCodes, updated)
      return updated
    })
    scheduleServerSync()
  }, [scheduleServerSync])

  const deletePromoCode = useCallback((id: string) => {
    setPromoCodes(prev => {
      const updated = prev.filter(c => c.id !== id)
      write(STORAGE_KEYS.promoCodes, updated)
      return updated
    })
    scheduleServerSync()
    toast.success('ลบโค้ดแล้ว')
  }, [scheduleServerSync])

  const applyPromoCode = useCallback((code: string, orderTotal: number): { discount: number; promoCode: PromoCode } | null => {
    const promo = promoCodes.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active)
    if (!promo) return null
    if (promo.expires_at) {
      // If only a date (no time component), treat expiry as end of that day
      const expiryStr = promo.expires_at.includes('T') ? promo.expires_at : promo.expires_at + 'T23:59:59'
      if (new Date(expiryStr) < new Date()) return null
    }
    if (promo.max_uses > 0 && promo.uses >= promo.max_uses) return null
    if (promo.min_amount > 0 && orderTotal < promo.min_amount) return null
    const discount = promo.type === 'percent'
      ? Math.round(orderTotal * promo.value / 100)
      : Math.min(promo.value, orderTotal)
    return { discount, promoCode: promo }
  }, [promoCodes])

  // Reviews
  const addReview = useCallback((data: Omit<Review, 'id' | 'created_at'>) => {
    const review: Review = { ...data, id: generateId('rev'), created_at: new Date().toISOString() }
    setReviews(prev => {
      const updated = [review, ...prev]
      write(STORAGE_KEYS.reviews, updated)
      return updated
    })
    scheduleServerSync()
  }, [scheduleServerSync])

  const getProductReviews = useCallback((productId: string) => {
    return reviews.filter(r => r.product_id === productId).sort((a, b) => b.created_at.localeCompare(a.created_at))
  }, [reviews])

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== id)
      write(STORAGE_KEYS.reviews, updated)
      return updated
    })
    scheduleServerSync()
    toast.success('ลบรีวิวแล้ว')
  }, [scheduleServerSync])

  const updateReview = useCallback((id: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>) => {
    setReviews(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      write(STORAGE_KEYS.reviews, updated)
      return updated
    })
    scheduleServerSync()
    toast.success('แก้ไขรีวิวแล้ว')
  }, [scheduleServerSync])

  const getProductRating = useCallback((productId: string, stableHash: number, override?: number): number => {
    if (override !== undefined && override > 0) return override
    const productReviews = reviews.filter(r => r.product_id === productId)
    if (productReviews.length === 0) return (40 + (stableHash % 9)) / 10
    return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
  }, [reviews])

  const getProductSoldCount = useCallback((productId: string, stableHash: number, override?: number): number => {
    if (override !== undefined && override > 0) return override
    const count = orders.filter(o => o.status === 'delivered' && o.items.some(i => i.id === productId)).length
    return count > 0 ? count : 51 + (stableHash % 200)
  }, [orders])

  const getProductViewCount = useCallback((productId: string, stableHash: number, override?: number): number => {
    if (override !== undefined && override > 0) return override
    const stored = viewCounts[productId]
    if (stored !== undefined) return stored
    const rawViews = 3 + (stableHash % 13)
    return rawViews * 287 + 1000
  }, [viewCounts])

  const incrementProductViews = useCallback((productId: string, stableHash: number) => {
    setViewCounts(prev => {
      // Use same formula as getProductViewCount for consistent initial value
      const rawViews = 3 + (stableHash % 13)
      const initial = rawViews * 287 + 1000
      const current = prev[productId] ?? initial
      const updated = { ...prev, [productId]: current + 1 }
      write(STORAGE_KEYS.views, updated)
      return updated
    })
    scheduleServerSync()
  }, [scheduleServerSync])

  // Manual refresh from server (used by admin refresh button)
  const refreshFromServer = useCallback(async () => {
    const sv = await fetchFromServer()
    if (sv.settings)    setSettings(deepMerge(defaultSettings, sv.settings))
    if (sv.products?.length) setProducts(sv.products)
    if (sv.orders)      setOrders(sv.orders)
    if (sv.members)     setMembers(sv.members)
    if (sv.promoCodes)  setPromoCodes(sv.promoCodes)
    if (sv.reviews)     setReviews(sv.reviews)
    if (sv.viewCounts)  setViewCounts(sv.viewCounts)
  }, [])

  // Modal open/close (for hiding cart FAB)
  const openModal = useCallback(() => setModalCount(c => c + 1), [])
  const closeModal = useCallback(() => setModalCount(c => Math.max(0, c - 1)), [])

  // Helpers
  const formatMoney = useCallback((amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0
    }).format(amount)
  }, [])

  return (
    <StoreContext.Provider value={{
      settings,
      updateSettings,
      products,
      activeProducts,
      categories,
      getProductById,
      updateProducts,
      cart,
      cartTotal,
      cartCount,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      orders,
      createOrder,
      updateOrder,
      members,
      currentMember,
      login,
      register,
      logout,
      updateMembers,
      isAdmin,
      adminLogin,
      adminLogout,
      promoCodes,
      createPromoCode,
      updatePromoCode,
      deletePromoCode,
      applyPromoCode,
      reviews,
      addReview,
      deleteReview,
      updateReview,
      getProductReviews,
      getProductRating,
      getProductSoldCount,
      getProductViewCount,
      incrementProductViews,
      modalOpen: modalCount > 0,
      openModal,
      closeModal,
      refreshFromServer,
      formatMoney,
      isLoaded,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
