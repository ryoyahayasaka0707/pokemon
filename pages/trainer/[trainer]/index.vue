<script setup>
import { useRoute } from 'vue-router'

// ルートパラメータを取得
const route = useRoute()
const trainer = route.params.trainer
const pokemons = ref([]);
const getTrainer = async (trainer) => {
  console.log(trainer)
  try {
    const response = await fetch(`/api/trainer/${trainer}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(), // JSON に変換して送信
    });

    const result = await response.json();
    console.log("Success:", result);
    pokemons.value = result.pokemons
    return result;
  } catch (error) {
    return null
  }
}
getTrainer(trainer)

const deleteEachTrainer = async (trainer) => {
  try {
    const response = await fetch(`/api/trainer/${trainer}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(), // JSON に変換して送信
    });

    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    return null
  }
}

</script>

<template>
  <h1>トレーナー情報</h1>
  <div class="trainer_info">
    <img src="public/avatar.png" />
    {{trainer}}
  </div>
  <GamifyButton @click="deleteEachTrainer(trainer).then(() => $router.push(`/`))">マサラタウンにかえる</GamifyButton>
  <h2>てもちポケモン</h2>
  <GamifyButton type="button" @click="() => $router.push(`/trainer/${trainer}/get_pokemon`)">ポケモンをつかまえる</GamifyButton>
  <GamifyList>
    <GamifyItem v-for="pokemon in pokemons" :key="pokemon.name">
      {{ pokemon.name }}
      <img :src="pokemon.image" />
    </GamifyItem>
  </GamifyList>
</template>

<style scoped>
/* .trainer_info {
} */
</style>