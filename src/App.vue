<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
const userStore = useUserStore();

onMounted(() => {
  userStore.initialize();
});
</script>
