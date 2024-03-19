<script setup lang="ts">
const appStates = ref<any[]>([])

// Action Sheet
async function showActions() {
  const result = await CapacitorActionSheet.showActions({
    title: 'Photo Options',
    message: 'Select an option to perform',
    options: [
      {
        title: 'Upload',
      },
      {
        title: 'Share',
      },
      {
        title: 'Remove',
        style: CapacitorActionSheetButtonStyle.Destructive,
      },
    ],
  })

  console.log('Action Sheet result:', result)
}

// Browser
async function openCapacitorSite() {
  await CapacitorBrowser.open({ url: 'http://capacitorjs.com/' })
}

// App launcher
async function checkCanOpenUrl() {
  const url = 'https://apps.apple.com/tr/app/sudeb/id1494667688'
  const { value } = await CapacitorAppLauncher.checkCanOpenUrl({ url })

  await CapacitorAppLauncher.openUrl({ url })

  console.log(value)
}

// App
CapacitorApp.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => { // FIXME: AutoImport type not assigned
  console.log('App state changed. Is active?', isActive)
  appStates.value.push(isActive)
})

// BackgroundRunner
onMounted(() => {
  CapacitorBackgroundRunner.requestPermissions({
    apis: ['geolocation', 'notifications'],
  })
})
</script>

<template>
  <div style="padding: 74px">
    <button @click="showActions">
      Action Sheet
    </button>

    <button @click="openCapacitorSite">
      Browser
    </button>

    <button @click="checkCanOpenUrl">
      App Launcher
    </button>

    <div>
      App States

      <div v-for="(item, idx) in appStates" :key="idx">
        {{ JSON.stringify(item) }}
      </div>
    </div>
  </div>
</template>
