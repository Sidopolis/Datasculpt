export interface DataSource {
  id: string
  name: string
  type: 'postgresql' | 'mysql'
  host: string
  port: number
  database: string
  username: string
  password: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  records?: number
  isActive: boolean
}

export interface DataSourceConfig {
  id: string
  name: string
  type: 'postgresql' | 'mysql'
  host: string
  port: number
  database: string
  username: string
  password: string
}

class DataSourceManager {
  private sources: DataSource[] = []
  private activeSourceId: string | null = null

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('datasculpt-data-sources')
      if (saved) {
        this.sources = JSON.parse(saved)
      }
      
      const active = localStorage.getItem('datasculpt-active-source')
      if (active) {
        this.activeSourceId = active
      }
    } catch (error) {
      console.error('Error loading data sources:', error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('datasculpt-data-sources', JSON.stringify(this.sources))
      if (this.activeSourceId) {
        localStorage.setItem('datasculpt-active-source', this.activeSourceId)
      }
    } catch (error) {
      console.error('Error saving data sources:', error)
    }
  }

  async addDataSource(config: DataSourceConfig): Promise<DataSource> {
    const source: DataSource = {
      id: Date.now().toString(),
      name: config.name,
      type: config.type,
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      status: 'disconnected',
      isActive: false
    }

    // Test connection
    try {
      await this.testConnection(source)
      source.status = 'connected'
      source.lastSync = new Date().toISOString()
    } catch (error) {
      source.status = 'error'
      console.error('Connection test failed:', error)
    }

    this.sources.push(source)
    
    // Set as active if it's the first one
    if (this.sources.length === 1) {
      this.setActiveSource(source.id)
    }
    
    this.saveToStorage()
    return source
  }

  async testConnection(source: DataSource): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: source.type,
          host: source.host,
          port: source.port,
          database: source.database,
          username: source.username,
          password: source.password,
        }),
      })

      if (!response.ok) {
        throw new Error('Connection test failed')
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Connection test error:', error)
      throw error
    }
  }

  getSources(): DataSource[] {
    return this.sources
  }

  getActiveSource(): DataSource | null {
    if (!this.activeSourceId) return null
    return this.sources.find(s => s.id === this.activeSourceId) || null
  }

  setActiveSource(sourceId: string): boolean {
    const source = this.sources.find(s => s.id === sourceId)
    if (!source) return false

    // Deactivate all sources
    this.sources.forEach(s => s.isActive = false)
    
    // Activate selected source
    source.isActive = true
    this.activeSourceId = sourceId
    
    this.saveToStorage()
    return true
  }

  async updateSourceStatus(sourceId: string): Promise<void> {
    const source = this.sources.find(s => s.id === sourceId)
    if (!source) return

    try {
      await this.testConnection(source)
      source.status = 'connected'
      source.lastSync = new Date().toISOString()
    } catch (error) {
      source.status = 'error'
    }
    
    this.saveToStorage()
  }

  removeSource(sourceId: string): boolean {
    const index = this.sources.findIndex(s => s.id === sourceId)
    if (index === -1) return false

    this.sources.splice(index, 1)
    
    // If we removed the active source, set the first one as active
    if (this.activeSourceId === sourceId) {
      this.activeSourceId = this.sources.length > 0 ? this.sources[0].id : null
    }
    
    this.saveToStorage()
    return true
  }

  getSourceConfig(sourceId: string): DataSourceConfig | null {
    const source = this.sources.find(s => s.id === sourceId)
    if (!source) return null

    return {
      id: source.id,
      name: source.name,
      type: source.type,
      host: source.host,
      port: source.port,
      database: source.database,
      username: source.username,
      password: source.password,
    }
  }
}

export const dataSourceManager = new DataSourceManager() 