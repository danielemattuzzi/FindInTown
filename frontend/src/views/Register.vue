<template>
  <div class="page-container min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm hover:shadow-2xl transition duration-150 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-center">Registrazione</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <input v-model="form.name" placeholder="Nome"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input v-model="form.email" type="email" placeholder="Email"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input v-model="form.password" type="password" placeholder="Password"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <button type="submit"
                class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">Registrati</button>
      </form>
      <p class="mt-4 text-sm text-center">Hai già un account? 
        <router-link to="/login" class="text-green-600 hover:underline">Accedi</router-link>
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
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async handleRegister() {
      if (!this.validateForm()) {
        alert('Per favore, compila tutti i campi correttamente.')
        return
      }

      try {
        const response = await apiClient.post('/auth/register', this.form);
        
        if (response.status === 201) {
          alert('Registrazione completata!')
          this.$router.push('/login')
        }
      } catch (error) {
        console.error(error);
        
        if (error.response) {
          if (error.response.status === 400) {
            alert('Email già in uso');
          } else if (error.response.status === 500) {
            alert('Errore del server. Riprova più tardi.');
          } else {
            alert('Si è verificato un errore durante la registrazione');
          }
        } else if (error.request) {
          alert('Errore di connessione al server');
        } else {
          alert('Si è verificato un errore durante la registrazione');
        }
      }
    },
    validateForm() {
      return this.form.name.trim() !== '' &&
             this.form.email.trim() !== '' &&
             this.form.password.trim() !== ''
    }
  }
}
</script>
