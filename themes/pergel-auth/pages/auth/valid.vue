<script setup lang="ts">
const input = ref('12')
const inputRef = ref<{ ref: HTMLInputElement } | null>(null)
const disabled = ref(false)

async function onSubmit(e?: Event | string) {
  inputRef.value?.ref.select()
  await new Promise(r => setTimeout(r, 1_00))

  if (typeof e !== 'string')
    e?.preventDefault?.()

  //   if (input.value === '123456') {
  //     hasGuessed.value = true
  //     setTimeout(() => {
  //       hasGuessed.value = false
  //     }, 1_000)
  //   }
  //   else {
  //     push.warning('Try guessing the right password 🤔')
  //   }

  input.value = ''
  setTimeout(() => {
    inputRef.value?.ref?.blur()
  }, 20)
}
</script>

<template>
  <div>
    <form :class="cn('mx-auto flex max-w-[980px] justify-center pt-6 pb-4', $attrs.class as string)" @submit="onSubmit">
      <OTPInput
        ref="inputRef"
        v-slot="{ slots, isFocused }"
        v-model="input"
        :disabled="disabled"
        :maxlength="6"
        allow-navigation
        :pattern="REGEXP_ONLY_DIGITS"
        container-class="group flex items-center"
        @complete="onSubmit"
      >
        <div class="flex">
          <ValidSlot
            v-for="(slot, idx) in slots.slice(0, 3)"
            :key="idx"
            :is-focused="isFocused"
            :animate-idx="idx"
            v-bind="slot"
          />
        </div>

        <!-- Layout inspired by Stripe -->
        <div class="md:20 flex w-10 items-center justify-center">
          <div class="bg-border h-1 w-3 rounded-full md:h-2 md:w-6" />
        </div>

        <div class="flex">
          <ValidSlot
            v-for="(slot, idx) in slots.slice(3)"
            :key="idx"
            :is-focused="isFocused"
            v-bind="slot"
          />
        </div>
      </OTPInput>
    </form>
  </div>
</template>
