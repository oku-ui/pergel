import { FieldContextKey, useFieldError, useIsFieldDirty, useIsFieldTouched, useIsFieldValid } from 'vee-validate'
import { inject } from 'vue'
import { formItemInject } from './useInjects'

export function useFormField(injectStatus: boolean = true) {
  const fieldContext = inject(FieldContextKey)
  const fieldItemContext = injectStatus ? inject(formItemInject) : ''

  const fieldState = {
    valid: useIsFieldValid(),
    isDirty: useIsFieldDirty(),
    isTouched: useIsFieldTouched(),
    error: useFieldError(),
  }

  if (!fieldContext)
    throw new Error('useFormField should be used within <FormField>')

  const { name } = fieldContext
  const id = fieldItemContext

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}
