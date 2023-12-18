<script setup lang="ts">
const open = ref(false)
const { showHelpButtons } = useDevToolsUIOptions()
</script>

<template>
  <template v-if="showHelpButtons">
    <slot
      v-if="$slots.custom"
      name="custom"
      :open="open"
      :click="() => { open = !open }"
    />
    <button
      v-else
      title="Help"
      class="backdrop-blur-8 absolute bottom-5
      right-5 z-[110px]
      flex h-10 w-10
      items-center justify-center rounded-full border
      bg-gray-500 opacity-50 shadow
      "
      @click="open = !open"
    >
      <div i-ri:question-mark />
    </button>
    <Transition name="fade-in">
      <div
        v-if="open"
        class="z-100 backdrop-blur-2 fixed inset-0 bg-gray-900 bg-opacity-50"
        @click="open = false"
      />
    </Transition>
    <Transition name="slide-in">
      <div
        v-if="open"
        class="prose fixed inset-y-0 right-0 z-[200] h-full w-[600px] overflow-auto border-l
        bg-gray-900 px-8 py-4"
      >
        <slot />
        <NButton
          icon="carbon-close"
          pos="absolute top-3 right-3"
          rounded-full text-xl
          :border="false"
          @click="open = false"
        />
      </div>
    </Transition>
  </template>
</template>

<style>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s;
}
.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
</style>
