<script setup lang="ts">
const { themeColor, setThemeColor } = useSettings()

function toggleDarkMode() {
  document.body.classList.toggle('dark')

  if (themeColor.value === 'default')
    setThemeColor('dark')
  else
    setThemeColor('default')

  console.log('toggled:theme', themeColor.value)
}
</script>

<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title>Settings</ion-title>
    </ion-toolbar>
  </ion-header>,

  <ion-content :fullscreen="true" color="light">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">
          Settings
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list :inset="true" lines="full">
      <ion-item>
        <!-- <div class="i-ph-moon-light h-10 w-10 text-white"></div> -->
        <ion-toggle @ion-change="toggleDarkMode">
          Dark Mode
        </ion-toggle>
      </ion-item>
    </ion-list>
  </ion-content>
</template>
