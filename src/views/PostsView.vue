<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import PostCard from '../components/PostCard.vue'
import Swal from 'sweetalert2'

const posts = ref([])
const search = ref('')
const selectedUser = ref(null)
const page = ref(1)

const itemsPerPage = 6

// Filtriranje članaka prema naslovu i autoru
const filtriraniClanci = computed(() => {
  return posts.value.filter(post => {
    const odgovaraPretrazi = post.title
      .toLowerCase()
      .includes(search.value.toLowerCase())

    const odgovaraAutoru =
      selectedUser.value === null ||
      post.userId === selectedUser.value

    return odgovaraPretrazi && odgovaraAutoru
  })
})

// Broj stranica za paginaciju
const brojStranica = computed(() => {
  return Math.ceil(filtriraniClanci.value.length / itemsPerPage)
})

// Članci koji se prikazuju na trenutnoj stranici
const clanciNaStranici = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filtriraniClanci.value.slice(start, end)
})

// Dohvaćanje članaka s API-ja
const dohvatiClanke = async () => {
  try {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    // Hrvatski tekstovi za prikaz članaka
    const hrvatskiClanci = [
      {
        title: 'Kako bolje organizirati svoje vrijeme',
        body: 'Dobra organizacija vremena može nam pomoći da lakše izvršimo svakodnevne obaveze i pronađemo više vremena za odmor.'
      },
      {
        title: 'Moji savjeti za učenje',
        body: 'Učenje je puno lakše kada napravimo dobar raspored, redovito ponavljamo gradivo i napravimo kratke pauze.'
      },
      {
        title: 'Ideje za produktivan dan',
        body: 'Dan možemo započeti jednostavnim planom obaveza i prvo riješiti najvažnije zadatke.'
      },
      {
        title: 'Zašto je važno imati hobi',
        body: 'Hobiji nam omogućuju da se opustimo, naučimo nešto novo i kvalitetno provedemo slobodno vrijeme.'
      },
      {
        title: 'Kako se odmoriti nakon napornog dana',
        body: 'Šetnja, glazba, druženje ili dobra knjiga mogu biti odličan način za odmor nakon obaveza.'
      },
      {
        title: 'Male navike koje čine razliku',
        body: 'Male svakodnevne navike s vremenom mogu donijeti velike promjene i pomoći nam da budemo organiziraniji.'
      },
      {
        title: 'Kako ostati motiviran',
        body: 'Postavljanje malih i ostvarivih ciljeva može nam pomoći da zadržimo motivaciju i lakše pratimo svoj napredak.'
      },
      {
        title: 'Prednosti jutarnje rutine',
        body: 'Dobra jutarnja rutina može nam pomoći da mirnije započnemo dan i bolje se pripremimo za obaveze.'
      },
      {
        title: 'Kako kvalitetno provesti slobodno vrijeme',
        body: 'Slobodno vrijeme možemo iskoristiti za druženje, sport, čitanje, putovanja ili aktivnosti koje nas vesele.'
      },
      {
        title: 'Važnost odmora i sna',
        body: 'Kvalitetan san i dovoljno odmora važni su za koncentraciju, raspoloženje i uspješno izvršavanje svakodnevnih obaveza.'
      }
    ]

    // Zadržavamo podatke s API-ja, ali prikazujemo hrvatski sadržaj
    posts.value = response.data.map((post, index) => {
      const tekst =
        hrvatskiClanci[index % hrvatskiClanci.length]

      return {
        ...post,
        title: tekst.title,
        body: tekst.body
      }
    })
  } catch (error) {
    console.log(
      'Greška prilikom dohvaćanja članaka:',
      error
    )
  }
}

// Brisanje članka
const obrisiClanak = async (id) => {
  const rezultat = await Swal.fire({
    title: 'Jeste li sigurni?',
    text: 'Ovaj članak će biti obrisan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, obriši',
    cancelButtonText: 'Odustani'
  })

  if (!rezultat.isConfirmed) {
    return
  }

  try {
    await axios.delete(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    )

    posts.value = posts.value.filter(
      post => post.id !== id
    )

    Swal.fire({
      title: 'Obrisano!',
      text: 'Članak je uspješno obrisan.',
      icon: 'success'
    })
  } catch (error) {
    console.log(
      'Greška prilikom brisanja članka:',
      error
    )

    Swal.fire({
      title: 'Greška!',
      text: 'Došlo je do greške prilikom brisanja članka.',
      icon: 'error'
    })
  }
}

onMounted(() => {
  dohvatiClanke()
})
</script>

<template>
  <v-container class="py-8">

    <h1 class="text-h3 font-weight-bold mb-8">
      Članci
    </h1>

    <!-- Pretraga -->
    <v-text-field
      v-model="search"
      label="Pretraži članke"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      class="mb-4"
    />

    <!-- Filtriranje prema autoru -->
    <v-select
      v-model="selectedUser"
      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      label="Filtriraj po autoru"
      clearable
      variant="outlined"
      class="mb-4"
    />

    <!-- Članci -->
    <v-row>
      <v-col
        v-for="post in clanciNaStranici"
        :key="post.id"
        cols="12"
        md="6"
      >
        <PostCard
          :post="post"
          @delete="obrisiClanak"
        />
      </v-col>
    </v-row>

    <!-- Paginacija -->
    <v-pagination
      v-model="page"
      :length="brojStranica"
      class="mt-6"
    />

  </v-container>
</template>