<script setup>
import { useRoute } from 'vue-router'

// ルートパラメータを取得
const route = useRoute()
const trainer = ref(route.params.trainer)
const pokemons = ref([]);

// トレーナー情報取得
const getTrainer = async (trainer) => {
  try {
    const response = await fetch(`/api/trainer/${trainer}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(), // JSON に変換して送信
    });

    const result = await response.json();
    pokemons.value = result.pokemons
    return result;
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
getTrainer(trainer.value)  // ページ表示時にデータ取得

// トレーナー削除
const deleteEachTrainer = async (trainer) => {
  try {
    await fetch(`/api/trainer/${trainer}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(), // JSON に変換して送信
    });
    return null;
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

// ポケモン削除 & データ再取得

const handleDeletePokemon = async (pokemonName) => {
  try {
    await deleteEachPokemon(trainer.value, pokemonName);
    await getTrainer(trainer.value); // 削除後にデータ再取得
  } catch (error) {
    console.error("Error:", error)
  }
}

// ポケモン削除
const deleteEachPokemon = async (trainer, pokemon) => {
  try {
    const response = await fetch(`/api/trainer/${trainer}/pokemon/${pokemon}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

</script>

<template>
  <h1>トレーナー情報</h1>
  <div class="trainer-info">
    <img src="/public/avatar.png" alt="Trainer Avatar" class="trainer-avatar" />
    <p class="trainer-name">{{ trainer }}</p>
  </div>
  <GamifyButton @click="$router.push(`/`)">ほぞんしておわる</GamifyButton>
  <GamifyButton @click="deleteEachTrainer(trainer).then(() => $router.push(`/`))">マサラタウンにかえる</GamifyButton>

  <h2>てもちポケモン</h2>
  <CatchButton type="button" @click="() => $router.push(`/trainer/${trainer}/get_pokemon`)">ポケモンをつかまえる</CatchButton>
  <GamifyList>
    <GamifyItem v-for="pokemon in pokemons" :key="pokemon.name">
      {{ pokemon.nickname }}
      <img :src="pokemon.image" />
      <GamifyButton @click="$router.push(`/trainer/${trainer}/${pokemon.name}`)">ニックネームをつける</GamifyButton>
      <GamifyButton @click="handleDeletePokemon(pokemon.name)">はかせにおくる</GamifyButton>
    </GamifyItem>
  </GamifyList>
</template>

<style scoped>
/* トレーナー情報 */
.trainer-info {
  display: flex;
  align-items: center;
  gap: 15px;  /* アバターと名前の間隔 */
}

.trainer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.trainer-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

</style>