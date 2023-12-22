<script setup lang="ts">
const formData = reactive({
  name: '',
  email: '',
  password: '',
})

const { data, execute } = await useFetch('/api/test', {
  method: 'GET',
})

async function addUser() {
  const { data } = await useFetch('/api/user', {
    method: 'POST',
    body: {
      ...formData,
    },
  })
  // eslint-disable-next-line no-console
  console.log(data.value)
  execute()

  formData.name = ''
  formData.email = ''
  formData.password = ''
}
</script>

<template>
  <div>
    <h1>Users</h1>
    <ul v-if="data">
      <li v-for="user in data.body" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
  <div>
    <form @submit.prevent="addUser">
      <input v-model="formData.name" />
      <input v-model="formData.email" />
      <input v-model="formData.password" />
      <button type="submit">
        Add User
      </button>
    </form>
  </div>
</template>
