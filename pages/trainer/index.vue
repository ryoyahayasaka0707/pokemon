<script setup>
import { ref, onMounted } from 'vue';

const trainers = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/trainers');
    const data = await response.json();
    trainers.value = data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
  }
});
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>

  </div>
</template>
