<template>

     <div class="absolute top-4 -left-4 z-[1000] w-1/2 grid grid-cols-9 justify-items-center">             
          <div class="col-span-1 w-16 bg-white rounded-full justify-self-end">
               <img src="../assets/compass-icon.png">
          </div>

          <div class="col-span-1 w-16" @click="showPages=!showPages;showFilters=false">
               <img class="" src="../assets/profile.png">
          </div>

          <div v-if="showPages" id="pages_popup" class="absolute top-[70px] left-20 z-[1000] bg-white text-black p-4 rounded-lg shadow-lg w-40 flex flex-col justify-start border border-gray-300">
               <router-link v-if="!logged" to="/login" class="bg-white border-2 border-white hover:border-green-300 text-black hover:text-black py-1 px-3 rounded mb-2">Accedi</router-link>
               <router-link v-if="logged" to="/profile" class="bg-white border-2 border-white hover:border-green-300 text-black hover:text-black py-1 px-3 rounded mb-2">Profilo</router-link>
               <router-link to="/settings" class="bg-white border-2 border-white hover:border-green-300 text-black hover:text-black py-1 px-3 rounded">Impostazioni</router-link>
          </div>

          <div class="grid col-span-6 w-full">
               <form class="w-full mx-auto self-center" @submit.prevent="getEvents">
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                    <div class="relative">
                         <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                              <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                         </div>
                         <input v-model="form.event_name" type="search" id="default-search" class="block w-full p-4 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500" placeholder="Cerca Eventi..." required />
                         <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2">Cerca</button>
                    </div>
               </form>
          </div>

          <div class="col-span-1 flex items-center justify-center h-full w-full">
               <button @click="showFilters=!showFilters;showPages=false" type="button" class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center">
                    <svg class="w-9 h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"/>
                    </svg>
                    <span class="sr-only">Filtri</span>
               </button>
          </div>

          <div v-if="showFilters" id="filters_popup" class="absolute top-2 left-full z-[1000] bg-white text-black p-4 rounded-lg shadow-lg w-64">
               <h2 class="text-lg font-semibold mb-2">Filtri</h2>
               <form @submit.prevent="applyFilters">
                    <label class="block mb-2">
                         Categoria:
                         <select v-model="form.category" class="w-full mt-1 p-1 border bg-white border-gray-300 rounded">
                              <option value="">Tutte</option>
                              <option value="sport">Sport</option>
                              <option value="musica">Musica</option>
                              <option value="fiera">Fiera</option>
                         </select>
                    </label>
                    <label class="block mb-2">
                         Data:
                         <input v-model="form.date" class="w-full mt-1 p-1 border border-gray-300 rounded bg-white" type="date" name="date">
                    </label>
                    <button type="submit" class="mt-3 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">Conferma</button>
               </form>
          </div>
     </div>




     <div id="map"></div>
     <div id="explore" @wheel="onWheel">
          <button class="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10" @click="closeExplore">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6 text-gray-600">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
               </svg>
          </button>
          <div id="event">
               <div id="image_container">
                    <img id="event_image">
               </div>
               <div id="event_details">
                    <h1 id="event_title">Titolo Evento</h1>
                    <h3 id="event_short_description">Sottotitolo o descrizione breve</h3>
                    <table id="infos">
                         <tbody>
                              <tr>
                                   <td>📅</td>
                                   <td id="date">Data</td>
                              </tr>
                              <tr>
                                   <td>⌚</td>
                                   <td id="time">Orario</td>
                              </tr>
                              <tr>
                                   <td>📍</td>
                                   <td id="location">Location</td>
                              </tr>
                         </tbody>
                    </table>
                    <button id="more_details_button" @click="moreDetails" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Maggiori Dettagli</button>
               </div>
          </div>
          <div id="detailed_event" @wheel="">
               <div id="d_image_container">
                    <button class="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10" @click="lessDetails">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6 text-gray-600">
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                         </svg>
                    </button>
                    <img id="d_event_image">
               </div>
               <div id="d_event_details">
                    <h1 id="d_event_title">Titolo Evento</h1>
                    <h3 id="d_event_short_description">Sottotitolo o descrizione breve</h3>
                    <h3 id="d_event_long_description">Descrizione Lunga</h3>

                    <table id="infos" class="mt-4">
                         <tbody>
                              <tr>
                                   <td>📅</td>
                                   <td id="d_date">Data</td>
                              </tr>
                              <tr>
                                   <td>⌚</td>
                                   <td id="d_time">Orario</td>
                              </tr>
                              <tr>
                                   <td>📍</td>
                                   <td id="d_location">Location</td>
                              </tr>
                              <tr>
                                   <td>👥</td>
                                   <td id="d_organizer">Organizzatore</td>
                              </tr>
                              <tr>
                                   <td>🤔</td>
                                   <td id="d_category">Categoria</td>
                              </tr>
                         </tbody>
                    </table>

                    <button id="show_comments_button" @click="showComments" class="mt-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2">Mostra Commenti</button>

                    <form @submit.prevent="sendRating" class="mt-4">
                         <h3 class="text-lg font-semibold mb-2 text-gray-200">Cosa ne pensi?</h3>
                         <textarea class="w-full p-3 bg-black text-gray-100 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none shadow-sm pr-16" 
                              v-model="rating.comment" id="comment_area" rows="4" placeholder="Scegli il numero di stelle e scrivi il tuo commento..." required></textarea>
                         <div class="mt-2 text-left flex items-center space-x-2">
                              <template v-for="star in 5" :key="star">
                                   <button type="button" @click="selectedRating = star" @mouseover="hoverRating = star" @mouseleave="hoverRating = 0" class="focus:outline-none hover:border-black">
                                        <svg :class="[ (hoverRating >= star || selectedRating >= star) ? 'text-yellow-400' : 'text-gray-400', 'w-8 h-8 transition-colors' ]" fill="currentColor" viewBox="0 20 20" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.538 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.97z" />
                                        </svg>
                                   </button>
                              </template>
                              <button class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition text-sm disabled:opacity-50" id="comment_button">Invia</button>
                         </div>
                    </form>
               </div>
          </div>
          <div id="comment_section" @wheel="">
               <button class="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10" @click="hideComments">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6 text-gray-600">
                         <path d="M18 6 6 18"></path>
                         <path d="m6 6 12 12"></path>
                    </svg>
               </button>
               <h1 id="c_event_title">Titolo Evento</h1>
               <hr class="my-4 border-t-4 border-gray-300" />
               <div id="comments_section">
                    <template v-for="rating in eventRatings" :key="rating">
                         <div class="flex">
                              <p><b> {{ rating.user_id.name }} </b></p>
                              <div class="flex">
                              <span v-for="star in rating.stars" class="text-yellow-500">★</span>
                              <span v-for="star in (5-rating.stars)" class="text-gray-400">★</span>
                              </div>
                         </div>
                         <p> {{ rating.comment }} </p>
                         <hr class="my-2 border-t border-gray-300" />
                    </template>
               </div>
          </div>
     </div>
</template>

<script>
     import 'leaflet/dist/leaflet.css'
     import L from 'leaflet'
     import apiClient from '../api';
     
     delete L.Icon.Default.prototype._getIconUrl;
     L.Icon.Default.mergeOptions({
          iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
          iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
          shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
     });
     const zoom = 14 // Livello di Zoom adatto a Trento
     const center = [46.0664228, 11.1257601] // Coordinate di Trento

     export default {
          data() {
               return {
                    form: {
                         event_name: '',
                         category: '',
                         date: '',
                         title: ''
                    },
                    rating: {
                         event_id: '',
                         user_id: '',
                         comment: ''
                    },
                    showFilters: false,
                    showPages: false,
                    markersLayer: null,
                    selectedRating: 0,
                    hoverRating: 0,
                    eventRatings: [],
                    eventi_global: [],
                    scrollTimeout: null,
                    numEvento: 0,
                    logged: localStorage.getItem("token")
               }
          },
          mounted() {
               this.map = L.map('map', { attributionControl: true, zoomControl: false })
                    .setView(center, zoom);
               L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© OpenStreetMap contributors'})
                    .addTo(this.map);
               this.map.attributionControl.setPosition('bottomleft');
               L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
               this.markersLayer = L.layerGroup().addTo(this.map);
               document.getElementById("explore").style.visibility = "hidden";
               document.getElementById("comment_section").style.visibility = "hidden";
               this.getEvents();
          },
          methods: {

               moreDetails() {
                    document.getElementById("detailed_event").style.visibility = "visible";
                    document.getElementById("comment_section").style.visibility = "hidden";
                    document.getElementById("d_image_container").style.visibility = "visible";
               },
               lessDetails() {
                    document.getElementById("detailed_event").style.visibility = "hidden";
                    document.getElementById("comment_section").style.visibility = "hidden";
                    document.getElementById("d_image_container").style.visibility = "hidden";
               },
               closeExplore() {
                    document.getElementById("explore").style.visibility = "hidden";
                    document.getElementById("detailed_event").style.visibility = "hidden";
                    document.getElementById("comment_section").style.visibility = "hidden";
                    document.getElementById("d_image_container").style.visibility = "hidden";
               },
               showComments() {
                    document.getElementById("comment_section").style.visibility = "visible";
                    document.getElementById("c_event_title").textContent = document.getElementById("event_title").textContent;
                    document.getElementById("d_image_container").style.visibility = "hidden";
                    
                    this.getRatings();
               },
               hideComments() {
                    document.getElementById("comment_section").style.visibility = "hidden";
                    document.getElementById("d_image_container").style.visibility = "visible";
               },
               onWheel(event) {
                    if (document.getElementById("detailed_event").style.visibility == "hidden") {
                         if (this.scrollTimeout) {
                              clearTimeout(this.scrollTimeout);
                         }
                         this.scrollTimeout = setTimeout(() => {
                              event.deltaY > 0 ? this.numEvento++ : this.numEvento--;
                              this.setEvent(this.eventi_global[this.numEvento % this.eventi_global.length]);
                         }, 200);
                    }
               },
               async applyFilters() {
                    await this.getEvents();
                    this.showFilters = false;
               },
               async getEvents() {
                    // console.log('Sending event request');
                    try {
                         //const response = await apiClient.get('/map/events');

                         const response = await apiClient.get('/map/events', {
                              params: {
                                   category: this.form.category,
                                   date: this.form.date,
                                   title: this.form.event_name
                              }
                         });

                         const eventi = response.data;
                         this.eventi_global= eventi;

                         // console.log("eventi ricevuti");
                         this.markersLayer.clearLayers();

                         eventi.forEach((evento) => {
                              let color = "black";
                              switch (evento.category) {
                                   case 'sport': color = "red"; break;
                                   case 'musica': color = "green"; break;
                                   case 'fiera': color = "blue"; break;
                              }
                              let coloredIcon = L.icon({
                                   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-'+color+'.png',
                                   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                                   iconSize: [25, 41],
                                   iconAnchor: [12, 41],
                                   popupAnchor: [1, -34],
                                   shadowSize: [41, 41]
                              });
                              let marker = L.marker([evento.location.coordinates[1], evento.location.coordinates[0]], { icon: coloredIcon })
                              .addTo(this.markersLayer)
                              .on('click', (e) => {
                                   document.getElementById("comment_section").style.visibility = "hidden";
                                   document.getElementById("detailed_event").style.visibility = "hidden";
                                   document.getElementById("d_image_container").style.visibility = "hidden";
                                   document.getElementById("explore").style.visibility = "visible";
                                   this.setEvent(evento);
                              });
                         });
                    } catch (errore) {
                         alert("errore ricezione eventi");
                    }
               },
               setEvent(evento) {
                    document.getElementById("event_title").textContent = evento.title;
                    document.getElementById("event_short_description").textContent = evento.description_short;
                    document.getElementById("location").textContent = evento.location_text;
                    //document.getElementById("organizer").textContent = evento.organizer.name;
                    document.getElementById("event_image").src = evento.image;

                    document.getElementById("d_event_title").textContent = evento.title;
                    document.getElementById("d_event_short_description").textContent = evento.description_short;
                    document.getElementById("d_event_long_description").textContent = evento.description_long;
                    document.getElementById("d_location").textContent = evento.location_text;
                    document.getElementById("d_organizer").textContent = evento.organizer.name;
                    document.getElementById("d_category").textContent = evento.category.charAt(0).toUpperCase() + evento.category.slice(1);
                    document.getElementById("d_event_image").src = evento.image;

                    document.getElementById("c_event_title").textContent = evento.title;

                    var data = new Date(evento.date);

                    const giorno = data.getDate().toString().padStart(2, '0');
                    const mese = (data.getMonth() + 1).toString().padStart(2, '0');
                    const anno = data.getFullYear();
                    
                    document.getElementById("date").textContent = giorno+"/"+mese+"/"+anno;
                    document.getElementById("d_date").textContent = giorno+"/"+mese+"/"+anno;
                    
                    const ore = data.getHours().toString().padStart(2, '0');
                    const minuti = data.getMinutes().toString().padStart(2, '0');
                    
                    document.getElementById("time").textContent = ore+":"+minuti;
                    document.getElementById("d_time").textContent = ore+":"+minuti;

                    this.selectedRating = 0;
                    this.rating.comment = '';
                    this.rating.event_id = evento._id;

                    this.map.setView([evento.location.coordinates[1],evento.location.coordinates[0]+0.0014], 18);
               },
               async sendRating() {
                    const token = localStorage.getItem('token');
                    
                    if (!token) {
                         alert("Devi effettuare il login per inviare una recensione");
                         return;
                    }

                    if (this.selectedRating === 0 || !this.rating.comment) {
                         alert("devi inserire sia un commento testuale e selezionare un numero di stelle per inviare il tuo rating");
                         return;
                    }
                    
                    try {
                         const response = await apiClient.post('/explore/rating', {
                              event_id: this.rating.event_id,
                              stars: this.selectedRating,
                              comment: this.rating.comment
                         });

                         console.log('Rating inviato con successo:', response.data);
                         alert("Commento pubblicato");
                         // Clear form after successful submission
                         this.rating.comment = '';
                         this.selectedRating = 0;
                         
                         // Refresh ratings list
                         await this.getRatings();
                    } catch (error) {
                         if (error.response && error.response.status === 409) {
                              alert("Hai già inserito una recensione per questo evento");
                         } else {
                              console.error('Errore durante l\'invio del rating:', error);
                              alert("Errore durante l'invio della recensione");
                         }
                    }
               },
               async getRatings() {
                    try {
                         console.log('Fetching ratings for event:', this.rating.event_id);
                         const response = await apiClient.get(`/explore/rating/${this.rating.event_id}`);
                         this.eventRatings = response.data;
                    } catch (error) {
                         console.error('Error fetching ratings:', error);
                         console.log('Current event_id:', this.rating.event_id);
                         alert("ratings non ricevuti");
                    }
               }
               
          }
     };

</script>

<style scoped>
/* HEADER + MAPPA */
#map {
     height: 100vh; width: 100vw;
     position: absolute; top: 0; left: 0;
}

/* SEZIONE ESPLORA */
#explore {
     width: 40vw; height: 100vh;
     position: absolute; top: 0; left: 60vw;
     z-index: 1000;
     color: white;
     backdrop-filter: blur(5px);
     background-color: rgba(0, 0, 0, 0.5);
     display: flex;
     justify-content: center;
     align-items: center;
}
#event {
     width: 30vw; height: 60vh;
     position: relative; /*top: 20vh; left: 5vw;*/
     z-index: 1001;
     background-color: rgba(0, 0, 0, 1);
     border-radius: 2vh;
     text-align: left;
     max-width: 450px;
}

/* EVENTO DETTAGLIATO */
#detailed_event, #comment_section {
     width: 36vw; height: 96vh;
     position: absolute; top: 2vh; left: 2vw;
     z-index: 1002;
     background-color: rgba(0, 0, 0, 1);
     border-radius: 2vh;
     text-align: left;
     display: flex;
     flex-direction: column;
}
#comment_section {
     padding-top: 2vh;
     padding-left: 2vh;
     max-height: 96vh;
}
#comments_section {
     overflow-y: auto;
     padding-right: 20px;
}

/* IMMAGINE EVENTO */
#image_container {
     width: 30vw; height: 25vh;
     border-radius: 2vh 2vh 0vh 0vh;
     overflow: hidden;
     max-width: 450px;
}
#d_image_container {
     width: 36vw; height: 36vh;
     border-radius: 2vh 2vh 0vh 0vh;
     overflow: hidden;
     flex-shrink: 0;
}
#event_image, #d_event_image {
     width: 100%; height: 100%;
     object-fit: cover;
}

/* DETTAGLI EVENTI */
#event_details, #d_event_details {
     padding: 2vh;
     overflow-y: auto;
     padding-right: 20px;
     max-height: calc(96vh - 36vh);
}
#more_details_button {
     position: absolute; bottom: 1vh; right: 1vh;
}
#event_title, #d_event_title, #c_event_title {
     font-size: 2.5vh;
     font-weight: bold;
}
#event_short_description, #d_event_short_description {
     font-size: 2vh;
     margin-top: 1vh;
}
#d_event_long_description {
     font-size: 1.7vh;
     margin-top: 1vh;
}
#comment_button {
     margin-left: auto;
}
</style>

<style>
.leaflet-control-container .leaflet-control-attribution {
  left: 0 !important;
  right: auto !important;
}

::-webkit-calendar-picker-indicator {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23d1d5db" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
}
</style>