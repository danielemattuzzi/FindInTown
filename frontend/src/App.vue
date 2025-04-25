<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();

// Manage the token from the URL (if present) 
// *This is useful for Google login, where the token is passed as a query parameter*
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token'); // Get the token from the URL

  if (token) { // saving the token in localStorage
    localStorage.setItem('token', token);
    router.push('/'); 
    alert('Login effettuato con successo!'); 
  }
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
