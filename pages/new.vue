<script setup>
import { ref } from 'vue';

const name = ref('');

const handleSubmit = async () => {
  const trainerName = { name: name.value }; // トレーナー名をオブジェクトに変換
  console.log(trainerName);

  try {
    const response = await fetch('/api/trainer', {
      method: 'POST', // POST リクエスト
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainerName), // JSON に変換して送信
    });

    if (response.ok) {
      alert('トレーナー名が保存されました！');
    } else if (response.status === 400) {
      alert('トレーナー名が無効です。');
    } else if (response.status === 409) {
      alert('トレーナー名がすでに存在しています。');
    } else {
      alert('トレーナー名の保存に失敗しました。');
    }
  } catch (error) {
    console.error('Error saving trainer name:', error);
    alert('トレーナー名の保存中にエラーが発生しました。');
  }
};
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では はじめに きみの なまえを おしえて もらおう！</p>
    <form @submit.prevent="handleSubmit">
      <div class="item">
        <label for="name">なまえ</label>
        <p>とくていの もじは とりのぞかれるぞ！</p>
        <input type="text" id="name" v-model="name" required />
      </div>
      <GamifyButton type="submit" @click="() => $router.push(`/trainer/${name}`)">けってい</GamifyButton>
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
