<script lang="ts" setup>
const error = ref<string | null>(null)
const formValues = reactive({
  username: '',
  password: '',
})
async function login(e: Event) {
  if (!(e.target instanceof HTMLFormElement))
    return

  const result = await useFetch('/api/auth/login', {
    method: 'POST',
    body: {
      ...formValues,
    },
  })
  if (result.error.value)
    error.value = result.error.value.data?.message ?? null

  else
    await navigateTo('/')
}
</script>

<template>
  <h1>Create an account</h1>
  <form method="post" @submit.prevent="login">
    <label htmlFor="username">Username</label>
    <input id="username" v-model="formValues.username" name="username" />
    <br />
    <label htmlFor="password">Password</label>
    <input id="password" v-model="formValues.password" type="password" name="password" />
    <br />
    <button>Continue</button>
    <p>{{ error }}</p>
  </form>
  <NuxtLink to="/login">
    Sign in
  </NuxtLink>
</template>
