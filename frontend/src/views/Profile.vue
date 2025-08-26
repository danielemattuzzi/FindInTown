<template>
    <img @click="toHome" src="../assets/images.png" class=" z-50 rounded-full fixed top-full left-0 -translate-y-[150%] translate-x-full border-2 border-black w-16"/>

    <div class="bg-[#12B07C] h-screen w-screen grid m-0 absolute top-0 left-0 content-center grid-cols-12">

        <div class="col-span-1"></div>

        <div class="col-span-10 grid grid-cols-2 bg-white rounded-lg">
            <div class="col-span-1 p-10">
                <p class="text-black w-full text-left mb-4 font-bold text-xl">Profilo</p>
                <div class="grid grid-rows-4">

                    <!-- Nome utente -->
                    <div class="row-span-1 text-black">
                        <p class="w-full text-left font-semibold">Nome utente</p>
                        <div class="flex">
                            <input type="text" v-model="user.name" class="bg-white border border-slate-200 rounded-lg w-64 p-1">
                            <button @click="changeUsername" class="inline ml-5 cursor-pointer underline">Salva</button>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="row-span-1 text-black">
                        <p class="w-full text-left font-semibold">Email</p>
                        <div class="flex">
                            <input disabled type="text" :value="user.email" class="bg-white border border-slate-200 rounded-lg w-64 p-1">
                            <button @click="changeEmail" class="inline ml-5 cursor-pointer underline">Salva</button>
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="row-span-1 text-black">
                        <p class="w-full text-left font-semibold">Nuova Password</p>
                        <div class="flex">
                            <input type="text" v-model="user.password" class="bg-white border border-slate-200 rounded-lg w-64 p-1">
                            <button @click="ChangePassword" class="inline ml-5 cursor-pointer underline">Salva</button>
                        </div>
                    </div>




                    <div class="row-span-1 text-black flex mt-5">
                        <button @click="logout" class="bg-red-400 w-40 h-8 hover:bg-red-500 border-0 transition duration-150 mr-5">Esci</button>
                        <button @click="deleteAccount" class="bg-red-400 w-40 h-8 hover:bg-red-500 border-0 transition duration-150">Elimina Account</button>
                    </div>
                    
                    <!-- Button -->
                    <div class="flex content-start mt-10 select-none">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer">
                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12B07C]"></div>
                            <span class="ms-3 text-sm font-medium text-gray-900">Notifiche</span>
                        </label>
                    </div>

                </div>
            </div>
            <div class="col-span-1 border-l border-l-slate-200 p-10">

                <div id="preferenze" class="row-span-1 rounded-lg bg-white">
                    <div class="p-5">
                        <p class="text-black font-bold text-2xl w-full text-left">Preferenze</p>
                        <p class="w-full text-left text-black py-5">Categorie preferite:</p>
                        <div class="flex gap-2">
                            <div    @click="x.selected = !x.selected" 
                                    v-for="(x, index) in categories" :class="[x.selected ? 'text-white bg-'+[x.color] : 'text-black border-'+[x.color]]" 
                                    class="cursor-pointer select-none rounded-md py-0.5 px-2.5 border text-sm transition-all shadow-sm"> {{ x.name }} </div>
                        </div>
                        <div class="mt-10 flex content-start">
                            <p class="text-black inline">Mostra eventi fino a </p>
                            <select class="bg-white text-black border border-[#B3B3B3] mx-1 rounded-md">
                                <option v-for="x in 7" value="1" class="text-black">{{x}} {{ x > 1 ? "giorni" : "giorno" }}</option>
                            </select>
                            <p class="text-black inline">di anticipo</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="col-span-1"></div>

    <!-- Temporanei, solo per Dev -->
    <div class="bg-blue-600 border-blue-600"></div>
    <div class="bg-red-600 border-red-600"></div>
    <div class="bg-green-600 border-green-600"></div>
    <div class="bg-amber-600 border-amber-600"></div>
    <div class="bg-pink-600 border-pink-600"></div>
    <div class="bg-indigo-600 border-indigo-600"></div>
    <div class="bg-purple-600 border-purple-600"></div>
    
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { ref } from 'vue'
    import apiClient from '../api';
    import { useRouter } from 'vue-router';
    const router = useRouter()

let user = ref({
            name: "",
            email: "",
            password: "",
        });
let userOld = ref({
            name: "",
            email: "",
            password: "",
        });
onMounted( async () => {
    console.log(`the component is now mounted.`);
    let data = await apiClient.get('/user/me');
    user.value = {name: data.data.name,
                  email: data.data.email,
                  password: "",
            };
    console.log(user);
});
const categories = ref([
    {name: "Sport",         color: "blue-600",      selected: false},
    {name: "Musica",        color: "red-600",       selected: false},
    {name: "Cultura",       color: "green-600",     selected: false},
    {name: "Arte",          color: "amber-600",     selected: false},
    {name: "Antiquariato",  color: "pink-600",      selected: false},
    {name: "Mercati",       color: "indigo-600",    selected: false},
    {name: "Religioso",     color: "purple-600",    selected: false}
]);
async function changeUsername() {
    try {
        const response = await apiClient.put('/user/me', user.value);
    } catch (e) {
        console.log(e);            
        alert("Username non modificato, si è verificato un errore.");
        return;
    }
    alert("New username: " + user.value.name);
    userOld.value.name = user.value.name;
}
function changeEmail() {
    alert("Funzione non disponibile in quanto non ancora compliant con le normative GDPR");
}
async function ChangePassword() {
    if (confirm("Sicuro di voler modificare la password?\nNuova password: " + user.value.password +" ?")) {
        try {
            const response = await apiClient.put('/user/me', user.value);
        } catch (e) {
            alert("Password non modificata, si è verificato un errore.");
            return;
        }
        userOld.value.password = user.value.password;
        alert("Password aggiornata!");
    } else {
        alert("Modifica della password non effettuata!");
    }
    user.value.password = "";
}
function logout() {
    localStorage.removeItem('token');
    router.push("/login");
}
async function deleteAccount() {
    if (confirm("Sicuro di voler procedere con l'elimionazione dell'account?")) {
        try {
            const response = await apiClient.delete('/user/me', user.value);
        } catch (e) {
            alert("Errore nell'eliminazione dell'account!");
            return;
        }
        alert("Account eliminato con succcesso!");
        localStorage.removeItem('token');
        router.push("/login");
    } else {
        alert("Eliminazione account non terminata");
    }
}
function toHome() {
    router.push("/home");
}
</script>