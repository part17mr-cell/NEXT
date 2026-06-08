// NEXT THON Store Data Types and Default Data

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  short_description: string
  description: string
  long_description: string
  price: number
  sale_price: number
  badge: string
  icon: string
  image_url: string
  delivery_note: string
  download_url: string
  download_urls?: string[]
  is_active: boolean
  sort_order: number
  stock_qty: number | null
  flash_sale_end?: string
  rating?: number
  views?: number
  sold?: number
  gallery_images?: string[]
}

export interface CartItem {
  id: string
  sku: string
  name: string
  category: string
  price: number
  qty: number
  delivery_note: string
}

export interface Order {
  id: string
  order_code: string
  created_at: string
  updated_at: string
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled'
  customer_name: string
  customer_username: string
  phone: string
  line_id: string
  note: string
  paid_amount: number
  paid_at: string
  total_amount: number
  items: CartItem[]
  slip_data: string
  member_id: string
  source: string
  delivery_link: string
  delivery_links?: string[]
  admin_note: string
  promo_code: string
  discount_amount: number
}

export interface PromoCode {
  id: string
  code: string
  type: 'percent' | 'flat'
  value: number
  min_amount: number
  max_uses: number
  uses: number
  expires_at: string
  is_active: boolean
  created_at: string
}

export interface Member {
  id: string
  username: string
  display_name: string
  password_hash: string
  created_at: string
  role: 'member' | 'admin'
  rank: string
  note: string
}

export interface StoreSettings {
  brand: {
    storeName: string
    tagline: string
    logoUrl: string
    faviconUrl: string
    domain: string
    accent: string
  }
  background: {
    enabled: boolean
    images: string[]      // image or GIF (URL or data URI)
    intervalSec: number   // auto-rotate seconds; 0 = no rotation
    opacity: number       // 0-100 overlay strength of the background
    blur: number          // px blur applied to background
  }
  icons: {
    lineIconUrl: string
    cartIconUrl: string
    heroIconUrl: string
    categoryIcons: { [key: string]: string }
  }
  home: {
    kicker: string
    heroTitle: string
    heroSubtitle: string
    primaryButton: string
    secondaryButton: string
    welcome: string
    announcement: string
    categoryTitle: string
    guideTitle: string
    guideSubtitle: string
    guideSteps: [string, string, string][]
    featuredProductIds: string[]
    bannerImageUrl: string
  }
  store: {
    title: string
    subtitle: string
    badges: string[]
  }
  contact: {
    lineId: string
    lineUrl: string
    email: string
    phone: string
    title: string
    lead: string
  }
  payment: {
    bankName: string
    accountName: string
    accountNumber: string
    qrImageUrl: string
    note: string
    discordWebhook: string
  }
  pages: {
    aboutTitle: string
    aboutLead: string
    privacyTitle: string
    privacyLead: string
    refundTitle: string
    refundLead: string
  }
  visibility: {
    homeHero: boolean
    homeAnnouncement: boolean
    homeStats: boolean
    homeCategories: boolean
    homeGuide: boolean
    storeHero: boolean
    storeToolbar: boolean
    storeBadges: boolean
    cartFab: boolean
    footerAdmin: boolean
    footerPolicies: boolean
  }
  heroStats: {
    baseMembers: number
    baseOrders: number
  }
  slipApi: {
    tabscannerKey: string
    easyslipKey: string
    autoVerify: boolean
    autoReject: boolean
  }
  security: {
    adminUsername: string
    adminPassword: string
  }
}

export const defaultSettings: StoreSettings = {
  brand: {
    storeName: 'NEXT THON',
    tagline: 'Digital Store',
    logoUrl: '',
    faviconUrl: '',
    domain: 'nextthon.store',
    accent: '#6366f1'
  },
  background: {
    enabled: false,
    images: [],
    intervalSec: 8,
    opacity: 18,
    blur: 2,
  },
  icons: {
    lineIconUrl: '',
    cartIconUrl: '',
    heroIconUrl: '',
    categoryIcons: {}
  },
  home: {
    kicker: 'Premium Digital Store',
    heroTitle: 'ยินดีต้อนรับสู่ {store}',
    heroSubtitle: 'ร้านดิจิทัลระบบออโต้ ปลอดภัย 100% สั่งซื้อได้ตลอด 24 ชั่วโมง พร้อมบริการหลังการขายที่รวดเร็ว',
    primaryButton: 'เริ่มช้อปปิ้ง',
    secondaryButton: 'วิธีใช้งาน',
    welcome: 'WELCOME TO NEXT THON',
    announcement: 'แจ้งเลขออเดอร์ทุกครั้งเมื่อทักแอดมิน • สินค้าดิจิทัลส่งมอบไว • ตรวจสอบสถานะได้ในเว็บ • บริการ 24/7',
    categoryTitle: 'หมวดหมู่สินค้า',
    guideTitle: 'วิธีสั่งซื้อ',
    guideSubtitle: 'ง่ายๆ เพียง 4 ขั้นตอน',
    guideSteps: [
      ['01', 'เลือกสินค้า', 'เลือกหมวดหรือค้นหาสินค้าที่ต้องการจากร้านค้า'],
      ['02', 'เพิ่มลงตะกร้า', 'ตรวจรายละเอียด ราคา แล้วเพิ่มลงตะกร้า'],
      ['03', 'ชำระเงิน', 'ไปหน้า Checkout แล้วอัปโหลดสลิปการโอน'],
      ['04', 'รับสินค้า', 'แอดมินตรวจสอบแล้วส่งมอบสินค้าทันที']
    ],
    featuredProductIds: [],
    bannerImageUrl: '',
  },
  store: {
    title: 'สินค้าทั้งหมด',
    subtitle: 'รวมสินค้าและบริการดิจิทัลยอดนิยม เลือกหมวด ค้นหา แล้วสั่งซื้อได้ทันที',
    badges: ['ระบบออโต้', 'ปลอดภัย 100%', 'ส่งมอบไว', 'บริการ 24/7']
  },
  contact: {
    lineId: '@nextthon',
    lineUrl: 'https://lin.ee/nextthon',
    email: 'support@nextthon.store',
    phone: '-',
    title: 'ติดต่อ NEXT THON',
    lead: 'ต้องการความช่วยเหลือ? ส่งเลขออเดอร์และสลิปให้แอดมินตรวจสอบได้ทันที'
  },
  payment: {
    bankName: 'ธนาคาร/วอลเล็ต',
    accountName: 'NEXT THON STORE',
    accountNumber: '000-000-0000',
    qrImageUrl: '',
    note: 'โอนแล้วแนบสลิปในหน้า Checkout',
    discordWebhook: ''
  },
  pages: {
    aboutTitle: 'NEXT THON - ร้านดิจิทัลระบบออโต้',
    aboutLead: 'รวมสินค้าและบริการดิจิทัล เช่น FiveM, Account, Free Fire, Roblox, Unban All และบริการเสริมอื่น ๆ ในเว็บเดียว',
    privacyTitle: 'นโยบายข้อมูลส่วนบุคคล',
    privacyLead: 'เก็บข้อมูลเท่าที่จำเป็นเพื่อยืนยันออเดอร์ ตรวจสอบการชำระเงิน ส่งมอบสินค้า และให้บริการหลังการขาย',
    refundTitle: 'นโยบายการคืนเงิน',
    refundLead: 'คืนเงินภายใน 1 วัน (24 ชั่วโมง) หากสินค้ามีปัญหาจากทางร้าน — กรุณาติดต่อแอดมินพร้อมหลักฐานประกอบ'
  },
  visibility: {
    homeHero: true,
    homeAnnouncement: true,
    homeStats: true,
    homeCategories: true,
    homeGuide: true,
    storeHero: true,
    storeToolbar: true,
    storeBadges: true,
    cartFab: true,
    footerAdmin: false,
    footerPolicies: true
  },
  heroStats: {
    baseMembers: 0,
    baseOrders: 0,
  },
  slipApi: {
    tabscannerKey: '',
    easyslipKey: '',
    autoVerify: false,
    autoReject: false,
  },
  security: {
    adminUsername: 'admin',
    adminPassword: 'index999+'
  }
}

export const demoProducts: Product[] = [
  { id: 'ig-account-01', sku: 'AC-PREM-01', name: 'Premium Account 30 Days', category: 'ACCOUNT', short_description: 'บัญชีพรีเมียมพร้อมใช้งาน ใช้ได้ 30 วัน', description: 'บัญชีพรีเมียมพร้อมใช้งาน ใช้ได้ 30 วัน', long_description: 'บัญชีพร้อมใช้งาน แพ็กเริ่มต้นสำหรับลูกค้าใหม่ พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 99, sale_price: 67, badge: 'แนะนำ', icon: 'fa-user-shield', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 1, stock_qty: null },
  { id: 'ig-account-02', sku: 'AC-DISCORD-02', name: 'Discord Nitro Account', category: 'ACCOUNT', short_description: 'บัญชี Discord Nitro สำหรับงาน Community', description: 'บัญชี Discord Nitro สำหรับงาน Community และ Bot test', long_description: 'ชุดบัญชี Discord สำหรับงาน Community และ Bot test พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 120, sale_price: 89, badge: 'พร้อมส่ง', icon: 'fa-brands fa-discord', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 2, stock_qty: null },
  { id: 'ig-fivem-01', sku: 'FIVEM-PRM-01', name: 'FiveM Ultimate Pack', category: 'FIVEM', short_description: 'แพ็กทรัพยากร FiveM ครบครันสำหรับเซิร์ฟเวอร์', description: 'แพ็กทรัพยากร FiveM สำหรับเริ่มต้นเซิร์ฟเวอร์', long_description: 'แพ็กทรัพยากร FiveM สำหรับเริ่มต้นเซิร์ฟเวอร์ พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 390, sale_price: 299, badge: 'ยอดนิยม', icon: 'fa-gamepad', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 3, stock_qty: null },
  { id: 'ig-fivem-02', sku: 'FIVEM-UI-02', name: 'Dark UI Kit Pro', category: 'FIVEM', short_description: 'ชุด UI สไตล์ดาร์กโทนสำหรับโปรเจกต์เกม', description: 'ชุด UI/Overlay สไตล์ดาร์กโทนสำหรับโปรเจกต์เกม', long_description: 'ชุด UI/Overlay สไตล์ดาร์กโทนสำหรับโปรเจกต์เกม พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 250, sale_price: 199, badge: 'ใหม่', icon: 'fa-skull', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 4, stock_qty: null },
  { id: 'ig-roblox-01', sku: 'RB-MASCOT-01', name: 'Roblox Asset Bundle', category: 'ROBLOX', short_description: 'Asset mascot และ Template สำหรับทำร้านเกม', description: 'Asset mascot และ Template สำหรับทำร้านเกม', long_description: 'Asset mascot และ Template สำหรับทำร้านเกม พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 89, sale_price: 67, badge: 'พร้อมส่ง', icon: 'fa-cube', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 5, stock_qty: null },
  { id: 'ig-fivem-03', sku: 'FIVEM-MONITOR-03', name: 'Server Monitor Template', category: 'FIVEM', short_description: 'หน้า Monitor สำหรับวางบน Discord/เว็บร้าน', description: 'หน้า Monitor สำหรับวางบน Discord/เว็บร้าน', long_description: 'หน้า Monitor สำหรับวางบน Discord/เว็บร้าน พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 329, sale_price: 229, badge: 'ขายดี', icon: 'fa-desktop', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 6, stock_qty: null },
  { id: 'ig-fivem-04', sku: 'FIVEM-SCRIPT-04', name: 'Script Starter Pack', category: 'FIVEM', short_description: 'แพ็ก Script แนะนำสำหรับจัดระบบเซิร์ฟเวอร์', description: 'แพ็ก Script แนะนำสำหรับจัดระบบเซิร์ฟเวอร์', long_description: 'แพ็ก Script แนะนำสำหรับจัดระบบเซิร์ฟเวอร์ พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 120, sale_price: 99, badge: 'Hot', icon: 'fa-fire', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 7, stock_qty: null },
  { id: 'ig-freefire-01', sku: 'FF-GRAPHIC-01', name: 'Gaming Graphics Kit', category: 'FREE FIRE', short_description: 'ชุดกราฟิก/หน้าประกาศสำหรับชุมชนเกม', description: 'ชุดกราฟิกบอร์ด/หน้าประกาศสำหรับชุมชนเกม', long_description: 'ชุดกราฟิกบอร์ด/หน้าประกาศสำหรับชุมชนเกม พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 180, sale_price: 129, badge: 'ใหม่', icon: 'fa-crosshairs', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 8, stock_qty: null },
  { id: 'ig-freefire-02', sku: 'FF-OVERLAY-02', name: 'Stream Overlay Pack', category: 'FREE FIRE', short_description: 'Overlay สไตล์เกมสำหรับงาน Stream', description: 'Overlay สไตล์เกมสำหรับงาน Stream และคอนเทนต์', long_description: 'Overlay สไตล์เกมสำหรับงานภาพ พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 299, sale_price: 199, badge: 'ดีไซน์', icon: 'fa-bullseye', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 9, stock_qty: null },
  { id: 'ig-fivem-05', sku: 'FIVEM-LANDING-05', name: 'Landing Page Template', category: 'FIVEM', short_description: 'Landing page สไตล์ดาร์กสำหรับขายแพ็กดิจิทัล', description: 'Landing page สไตล์ดาร์กสำหรับขายแพ็กดิจิทัล', long_description: 'Landing page สไตล์ดาร์กสำหรับขายแพ็กดิจิทัล พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 499, sale_price: 399, badge: 'Pro', icon: 'fa-window-maximize', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 10, stock_qty: null },
  { id: 'ig-account-03', sku: 'AC-ROBLOX-03', name: 'Roblox Verified Account', category: 'ACCOUNT', short_description: 'บัญชี Roblox ยืนยันตัวตนแล้วพร้อมใช้', description: 'บัญชีเริ่มต้นสำหรับงานทดสอบ/คอนเทนต์', long_description: 'บัญชีเริ่มต้นสำหรับงานทดสอบ/คอนเทนต์ พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 120, sale_price: 80, badge: 'พร้อมส่ง', icon: 'fa-user', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 11, stock_qty: null },
  { id: 'ig-service-01', sku: 'SVC-UNBAN-01', name: 'UNBAN Service Bundle', category: 'SERVICE', short_description: 'บริการ/แพ็กข้อมูลสำหรับงาน Unban', description: 'บริการ/แพ็กข้อมูลสำหรับงาน Unban All และหน้าร้านสายเกมมิ่ง', long_description: 'บริการ/แพ็กข้อมูลสำหรับงาน Unban All และหน้าร้านสายเกมมิ่ง พร้อมตั้งค่าข้อความส่งมอบและลิงก์ได้จากหลังบ้าน', price: 990, sale_price: 790, badge: 'Bundle', icon: 'fa-shield-halved', image_url: '', delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก', download_url: '', is_active: true, sort_order: 12, stock_qty: null },
]

export interface Review {
  id: string
  product_id: string
  member_id: string
  username: string
  rating: number
  comment: string
  created_at: string
}

export const STORAGE_KEYS = {
  settings: 'nextthon.v1.settings',
  products: 'nextthon.v1.products',
  orders: 'nextthon.v1.orders',
  members: 'nextthon.v1.members',
  cart: 'nextthon.v1.cart',
  member: 'nextthon.v1.member',
  admin: 'nextthon.v1.admin',
  promoCodes: 'nextthon.v1.promoCodes',
  reviews: 'nextthon.v1.reviews',
  views: 'nextthon.v1.views',
}
