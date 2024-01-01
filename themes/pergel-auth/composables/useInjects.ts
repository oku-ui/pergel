import type { InjectionKey } from 'vue'

export const formItemInject: InjectionKey<string>
    = Symbol() as unknown as InjectionKey<string>

export function useInjects() {
  return {
    formItemInject,
  }
}
