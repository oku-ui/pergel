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
