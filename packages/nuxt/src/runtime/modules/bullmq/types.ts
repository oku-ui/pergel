export interface BullMQModuleRuntimeConfig {
  url?: string
  options?: {
    host: string
    port: number
    db: 0
    password: string
    username: string
  }
}
