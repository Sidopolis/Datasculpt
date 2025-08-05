// Mock data for development without Supabase
export interface User {
  id: string
  email: string
  full_name: string
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
}

export interface Order {
  id: string
  product_id: string
  user_id: string
  quantity: number
  state: string
  total_amount: number
  created_at: string
  products?: Product
}

export const mockUser: User = {
  id: '1',
  email: 'demo@datasculpt.com',
  full_name: 'Demo User'
}

export const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 2999, category: 'Electronics' },
  { id: '2', name: 'Smart Watch', price: 15999, category: 'Electronics' },
  { id: '3', name: 'Bluetooth Speaker', price: 1799, category: 'Electronics' },
  { id: '4', name: 'Fitness Tracker', price: 4999, category: 'Electronics' },
  { id: '5', name: 'Smartphone Case', price: 599, category: 'Accessories' },
  { id: '6', name: 'Power Bank', price: 1299, category: 'Electronics' },
  { id: '7', name: 'Gaming Mouse', price: 2499, category: 'Electronics' },
  { id: '8', name: 'Laptop Stand', price: 899, category: 'Accessories' },
  { id: '9', name: 'Wireless Charger', price: 1899, category: 'Electronics' },
  { id: '10', name: 'USB Cable', price: 299, category: 'Accessories' }
]

export const mockOrders: Order[] = [
  { id: '1', product_id: '1', user_id: '1', quantity: 2, state: 'Maharashtra', total_amount: 5998, created_at: '2024-01-15', products: mockProducts[0] },
  { id: '2', product_id: '2', user_id: '1', quantity: 1, state: 'Karnataka', total_amount: 15999, created_at: '2024-01-16', products: mockProducts[1] },
  { id: '3', product_id: '3', user_id: '1', quantity: 3, state: 'Tamil Nadu', total_amount: 5397, created_at: '2024-01-17', products: mockProducts[2] },
  { id: '4', product_id: '4', user_id: '1', quantity: 1, state: 'Delhi', total_amount: 4999, created_at: '2024-01-18', products: mockProducts[3] },
  { id: '5', product_id: '5', user_id: '1', quantity: 5, state: 'Gujarat', total_amount: 2995, created_at: '2024-01-19', products: mockProducts[4] },
  { id: '6', product_id: '6', user_id: '1', quantity: 2, state: 'Rajasthan', total_amount: 2598, created_at: '2024-01-20', products: mockProducts[5] },
  { id: '7', product_id: '7', user_id: '1', quantity: 1, state: 'Uttar Pradesh', total_amount: 2499, created_at: '2024-01-21', products: mockProducts[6] },
  { id: '8', product_id: '8', user_id: '1', quantity: 4, state: 'West Bengal', total_amount: 3596, created_at: '2024-01-22', products: mockProducts[7] },
  { id: '9', product_id: '9', user_id: '1', quantity: 2, state: 'Telangana', total_amount: 3798, created_at: '2024-01-23', products: mockProducts[8] },
  { id: '10', product_id: '10', user_id: '1', quantity: 10, state: 'Kerala', total_amount: 2990, created_at: '2024-01-24', products: mockProducts[9] },
  { id: '11', product_id: '1', user_id: '1', quantity: 1, state: 'Maharashtra', total_amount: 2999, created_at: '2024-01-25', products: mockProducts[0] },
  { id: '12', product_id: '2', user_id: '1', quantity: 2, state: 'Karnataka', total_amount: 31998, created_at: '2024-01-26', products: mockProducts[1] },
  { id: '13', product_id: '3', user_id: '1', quantity: 1, state: 'Tamil Nadu', total_amount: 1799, created_at: '2024-01-27', products: mockProducts[2] },
  { id: '14', product_id: '4', user_id: '1', quantity: 3, state: 'Delhi', total_amount: 14997, created_at: '2024-01-28', products: mockProducts[3] },
  { id: '15', product_id: '5', user_id: '1', quantity: 2, state: 'Gujarat', total_amount: 1198, created_at: '2024-01-29', products: mockProducts[4] }
]

// Mock authentication service
export const mockAuth = {
  currentUser: null as User | null,
  
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'demo@datasculpt.com' && password === 'demo123') {
      mockAuth.currentUser = mockUser
      return { error: null }
    }
    
    return { error: { message: 'Invalid credentials' } }
  },
  
  signUp: async (email: string, password: string, fullName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser = {
      id: Date.now().toString(),
      email,
      full_name: fullName
    }
    
    mockAuth.currentUser = newUser
    return { error: null }
  },
  
  signOut: async () => {
    mockAuth.currentUser = null
  },
  
  getSession: () => {
    return mockAuth.currentUser ? { user: mockAuth.currentUser } : null
  }
}