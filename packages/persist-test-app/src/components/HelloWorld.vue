<script setup lang="ts">
import { ref } from 'vue'
import { createStorage, createIndexedDB } from 'persist-storage-utils'

const storage = createStorage({
  prefixKey: 'persist-test-app',
  storage: sessionStorage,
})
console.log('加载')

const init = async () => {
  const db = createIndexedDB({
    name: 'myDatabase',
    version: 1,
    stores: {
      users: 'id',
    },
  })
  console.log('开始')

  await db.ready()

  console.log('结束')

  // 添加数据
  // await db.add('users', { id: 1, name: 'John', age: 25 })

  const data = await db.get('users', 100)
  console.log('获取数据', data)

  await db.update('users', { id: 100, name: 'xuejuncheng', age: 25 })
}

init()

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
