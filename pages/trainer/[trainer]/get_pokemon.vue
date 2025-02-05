<script setup>
import { useRoute } from 'vue-router'
import { useFetch } from '#app'

const route = useRoute()
const trainer = route.params.trainer

const { data: pokemons } = await useFetch('https://pokeapi.co/api/v2/pokemon', {
  default: () => [],
  server: false,
})

console.log(pokemons.value) // データ取得確認

const caughtPokemon = ref('') // 捕まえたポケモンの名前を保持する変数

const catchPokemon = async (pokemonName) => {
  caughtPokemon.value = pokemonName
  console.log(`${pokemonName} を捕まえた！`) // 発火する処理
  try {
    const response = await fetch(`/api/trainer/${trainer}/pokemon`, {
      method: 'POST', // POST リクエスト
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: pokemonName }), // JSON に変換して送信
    });

    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error('Failed to catch Pokémon:', error);
    alert('ポケモンゲット中にエラーが発生しました。');
    return null
  }
}
</script>

<template>
  <h1>ポケモンをつかまえる</h1>
  <p>{{pokemons.count}} しゅるいのポケモン</p>
  <GamifyList>
    <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.name">
      {{ pokemon.name }}
      <GamifyButton @click="catchPokemon(pokemon.name).then(() => $router.push(`/trainer/${trainer}`))">つかまえる</GamifyButton>
    </GamifyItem>
  </GamifyList>
</template>