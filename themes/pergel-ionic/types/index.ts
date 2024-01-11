export declare type Locale = string
export interface LocaleObject extends Record<string, any> {
  code: Locale
  name?: string
}

export type ThemeType = 'default' | 'dark'
export type LangType = 'en' | 'tr' | 'fr' | 'zh'

export interface SettingsItem {
  order: number
  name: string
  icon: string
  to: string
  subItems?: SettingsItem[]
}

export interface User {
  username: string
  firstName: string
  lastName: string
  bio?: string
  fullName?: string
  email?: string
  avatar?: string
}
