<script setup lang="ts">
import { createStorage } from '@persist/storage-utils'
import { ref } from 'vue'
const storage = createStorage({
  prefixKey: 'persist-test-app',
  storage: sessionStorage,
})

const inputValue = ref('')
const storageValue = ref<string | null>(null)
defineProps<{ msg: string }>()

const setStorage = () => {
  storage.set('test', inputValue.value, 1000 * 60)
}

const getStorage = () => {
  storageValue.value = storage.get('test', '这是默认值')
}

const removeStorage = () => {
  storage.remove('test')
}

const clearStorage = () => {
  storage.clear()
}

const setCookie = () => {
  storage.setCookie('test', 'test', 1000 * 60)
}

const getCookie = () => {
  storage.getCookie('test')
}

const removeCookie = () => {
  storage.removeCookie('test')
}

const clearCookie = () => {
  storage.clearCookie()
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <input type="text" v-model="inputValue" />
  <div>{{ storageValue }}</div>
  <div>
    <button @click="setStorage">setStorage</button>
    <button @click="getStorage">getStorage</button>
    <button @click="removeStorage">removeStorage</button>
    <button @click="clearStorage">clearStorage</button>
    <button @click="setCookie">setCookie</button>
    <button @click="getCookie">getCookie</button>
    <button @click="removeCookie">removeCookie</button>
    <button @click="clearCookie">clearCookie</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
