<script setup>
import { useRoute, useRouter } from 'vue-router'

// ルートパラメータを取得
const route = useRoute()
const router = useRouter()
const trainer = route.params.trainer
const pokemon = route.params.pokemon

const nickname = ref('');

const submitNickname = async () => {
  try {
    const response = await fetch(`/api/trainer/${trainer}/pokemon/${pokemon}`, {
      method: 'PUT', // PUT リクエスト
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname: nickname.value }), // JSON に変換して送信
    });

    router.back() // 直前の画面に戻る
  } catch (error) {
    console.error('Error saving nickname:', error);
    alert('ニックネームの保存中にエラーが発生しました。');
  }
}
</script>

<template>
  <div>
    <h1>ポケモンにニックネームをつける</h1>
    <form @submit.prevent="submitNickname">
      <p>なまえ を つけよう！</p>
      <input id="nickname" v-model="nickname" type="text" required />
      <GamifyButton type="submit">けってい</GamifyButton>
    </form>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>