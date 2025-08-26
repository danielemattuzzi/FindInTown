<template>
    
    <!-- Screen container -->
    <div class="grid grid-cols-6 bg-[#12B07C] w-screen m-0 absolute top-0 left-0 p-5">

        <div class="fixed w-1/6 h-screen">

            <!-- Setting name container -->
            <div class="py-5 px-10">
                <div class="grid grid-rows-2 bg-slate-100 border-[#B3B3B3] border rounded-lg">
                    <a href="#aspetto" class="text-black">
                        <div class="row-span-1 px-5 py-2 border-b border-[#B3B3B3] rounded-t-lg hover:bg-slate-200">
                            <p>Aspetto</p>
                        </div>
                    </a>
                    <a href="#supporto" class="text-black">
                        <div class="row-span-1 rounded-b-lg px-5 py-2 hover:bg-slate-200">
                            <p>Supporto</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Back to map -->
        <img @click="toHome" src="../assets/images.png" class="rounded-full fixed top-full left-0 -translate-y-[150%] translate-x-full border-2 border-black w-16"/>


        <!-- Col elem -->
        <div class="col-span-1"></div>

        <!-- Setting option container -->
        <div class="col-span-5 px-2">
            <div class="grid grid-rows-2 gap-5">

                <!-- Preferenze -->
                
                
                <!-- Aspetto -->
                <div id="aspetto" class="row-span-1 grid grid-cols-2 rounded-lg bg-white">
                    <div class="col-span-1 rounded-l-lg border-r border-[B3B3B3]">
                        <div class="p-5">
                            <p class="text-black font-bold text-2xl w-full text-left">Aspetto</p>

                            <!-- Modalità scura -->
                            <div class="flex content-start mt-10 select-none">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12B07C]"></div>
                                    <span class="ms-3 text-sm font-medium text-gray-900">Modalità notte</span>
                                </label>
                            </div>

                            <!-- Alto contrasto -->
                            <div class="flex content-start mt-10 select-none">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12B07C]"></div>
                                    <span class="ms-3 text-sm font-medium text-gray-900">Modalità alto contrasto</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Mappa esempio -->
                    <div class="col-span-1 rounded-lg mx-auto">
                        <img class="" src="../assets/map.png" alt="">
                    </div>
                </div>  
                
                <!-- Supporto -->
                <div id="supporto" class="row-span-1 rounded-lg grid grid-rows-4 bg-white">
                    <div class="p-5">
                        <p class="text-black font-bold text-2xl w-full text-left">Supporto</p>
                    </div>
                    <div class="row-span-1 p-5 border-b border-[#B3B3B3]">
                        <p class="w-full text-left text-black font-semibold">Cos'è FindInTown?</p>
                        <p class="w-full text-left text-black text-sm">FindInTown è un servizio che ti permette di trovare informazioni riguardo a tutti gli eventi presenti a Trento con pochi semplici click, 
                                                                    dalla comodità del tuo smartphone</p>
                    </div>
                    <div class="row-span-1 p-5 border-b border-[#B3B3B3]">
                        <p class="w-full text-left text-black font-semibold">Come usare FindInTown?</p>
                        <p class="w-full text-left text-black text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil voluptate magnam eveniet voluptas fuga! Similique consequuntur quibusdam mollitia temporibus doloribus, 
                                                                    ipsa optio inventore saepe odit.</p>
                    </div>
                    <div class="row-span-1 p-5 border-b border-[#B3B3B3]">
                        <p class="w-full text-left text-black font-semibold">Come FindInTown utilizza i miei dati?</p>
                        <p class="w-full text-left text-black text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil voluptate magnam eveniet voluptas fuga! Similique consequuntur quibusdam mollitia temporibus doloribus, 
                                                                    ipsa optio inventore saepe odit.</p>
                    </div>
                    <div class="row-span-1 p-5 border-b border-[#B3B3B3]">
                        <p class="w-full text-left text-black font-semibold">FindInTown è gratuito?</p>
                        <p class="w-full text-left text-black text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil voluptate magnam eveniet voluptas fuga! Similique consequuntur quibusdam mollitia temporibus doloribus, 
                                                                    ipsa optio inventore saepe odit.</p>
                    </div>
                </div>                
            </div>
        </div>
    </div>

    
</template>

<style scoped>

    .active {
        color: white;
    }

    .inactive {
        color: black;
    }

</style>
  

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter()

function toHome() {
    router.push("/home");
}

</script>