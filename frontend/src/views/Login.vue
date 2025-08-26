<template>
  <div class="page-container min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm hover:shadow-2xl transition duration-150 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-center">Accedi</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="form.email" type="email" placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input v-model="form.password" type="password" placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <button type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">Accedi</button>
      </form>
      <button @click="loginWithGoogle" class="px-4 py-2 mt-4 justify-center border flex gap-2 border-slate-200  ounded-lg hover:shadow transition duration-150 hover:bg-slate-100 w-full"> 
        <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
        Accedi con Google
      </button>
      <p class="mt-4 text-sm text-center">Non hai un account?
        <router-link to="/register" class="text-green-600 hover:underline">Registrati</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import apiClient from '../api';

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      // Log what we're sending
      console.log('Sending login request with:', this.form);

      try {
        const response = await apiClient.post('/auth/login', this.form)

        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token)
          this.$router.push('/home')
          alert('Login effettuato con successo!')
        }
      } catch (error) {
        // More detailed error logging
        console.error('Login error details:', error);

        if (error.response) {
          console.log('Error response status:', error.response.status);
          console.log('Error response data:', error.response.data);

          if (error.response.status === 401) {
            alert('Credenziali non valide');
          } else if (error.response.status === 500) {
            alert('Errore del server. Riprova più tardi.');
          } else {
            alert('Si è verificato un errore durante il login');
          }
        } else if (error.request) {
          console.log('No response received:', error.request);
          alert('Errore di connessione al server. Verifica che il backend sia in esecuzione sulla porta 3000.');
        } else {
          alert('Si è verificato un errore durante il login');
        }
      }
    },
    loginWithGoogle() {
      window.location.href = 'http://localhost:3000/auth/google'; // Redirect to the backend for Google login
    }
  }
}
</script>

<style>
body {
  background-color: rgb(243 244 246); /* This is Tailwind's bg-gray-100 color */
  margin: 0;
  min-height: 100vh;
}

.page-container {
  min-height: 100vh;
  width: 100%;
}
</style>
