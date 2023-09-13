<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const users = ref<any[]>([]);
const currentPage = ref<number>(1);

const pushUsers = async (page?: number, count?: number) => {
  const { data: usersResponse } = await axios.get('http://localhost:3000/api/v1/users', {
    params: {
      page: page,
      count: count,
    }
  });

  users.value.push(...usersResponse);
}

const handleNext = async () => {
  currentPage.value++;

  await pushUsers(currentPage.value);
}

await pushUsers();
</script>
<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }}<br>{{ user.email }}<br>{{ user.phone }} <hr>
      </li>
    </ul>
  </div>
  <hr>
  <button @click="handleNext">Show More</button>
</template>

<style></style>
