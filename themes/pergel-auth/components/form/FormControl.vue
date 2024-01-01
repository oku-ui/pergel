<script lang="ts" setup>
import { OkuSlot } from '@oku-ui/slot'

const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
</script>

<template>
  <OkuSlot
    :id="formItemId"
    :aria-describedby="!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error"
  >
    <slot />
  </OkuSlot>
</template>
