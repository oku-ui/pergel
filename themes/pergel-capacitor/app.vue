<script setup lang="ts">
import { Geolocation } from '@capacitor/geolocation'

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

// Device
async function logDeviceInfo() {
  const info = await CapacitorDevice.getInfo()

  console.log(info)
}

// Dialog
async function showAlert() {
  await CapacitorDialog.alert({
    title: 'Stop',
    message: 'this is an error',
  })
}

// Filesystem
async function handleFilesystem() {
  const writeSecretFile = async () => {
    await CapacitorFSFilesystem.writeFile({
      path: 'secrets/text.txt',
      data: 'This is a test',
      directory: CapacitorFSDirectory.Documents,
      encoding: CapacitorFSEncoding.UTF8,
    })
  }

  const readSecretFile = async () => {
    const contents = await CapacitorFSFilesystem.readFile({
      path: 'secrets/text.txt',
      directory: CapacitorFSDirectory.Documents,
      encoding: CapacitorFSEncoding.UTF8,
    })

    console.log('secrets:', contents)
  }

  if (!CapacitorFSFilesystem.checkPermissions())
    return console.log('permission required')

  await writeSecretFile()
  await readSecretFile()
}

// Geolocation
async function printCurrentPosition() {
  const coordinates = await CapacitorGeolocation.getCurrentPosition()

  console.log('Current position:', coordinates)
}

onMounted(() => {
  // Permissions
  CapacitorBackgroundRunner.requestPermissions({
    apis: ['geolocation', 'notifications'],
  })
  CapacitorFSFilesystem.requestPermissions()

  CapacitorGeolocation.requestPermissions()

  logDeviceInfo()
})
</script>

<template>
  <div :style="{ padding: '100px' }">
    <button @click="showActions">
      Action Sheet
    </button>

    <button @click="openCapacitorSite">
      Browser
    </button>

    <button @click="checkCanOpenUrl">
      App Launcher
    </button>

    <button @click="showAlert">
      Dialog
    </button>

    <button @click="handleFilesystem">
      Filesystem
    </button>

    <button @click="printCurrentPosition">
      Geolocation
    </button>

    <div>
      App States

      <div v-for="(item, idx) in appStates" :key="idx">
        {{ JSON.stringify(item) }}
      </div>
    </div>
  </div>
</template>
