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
  return Math.ceil(
    filtriraniClanci.value.length / itemsPerPage
  )
})

// Članci koji se prikazuju na trenutnoj stranici
const clanciNaStranici = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filtriraniClanci.value.slice(start, end)
})

// Dohvaćanje članaka iz našeg backenda
const dohvatiClanke = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3000/api/posts'
    )

    posts.value = response.data
  } catch (error) {
    console.log(
      'Greška prilikom dohvaćanja članaka:',
      error
    )
  }
}

// Brisanje članka iz naše baze
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
      `http://localhost:3000/api/posts/${id}`
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