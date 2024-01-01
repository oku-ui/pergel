<script lang="ts" setup>
const { name, formMessageId } = useFormField()
</script>

<template>
  <FormErrorMessage
    :id="formMessageId"
    as="p"
    :name="toValue(name)"
    class="mt-2 text-sm text-red-600"
  />
</template>
