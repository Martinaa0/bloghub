<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = ref('')
const body = ref('')
const userId = ref(1)

const poruka = ref('')
const uspjeh = ref(false)

const dohvatiClanak = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/posts/${route.params.id}`
    )

    title.value = response.data.title
    body.value = response.data.body
    userId.value = response.data.userId
  } catch (error) {
    console.log('Greška prilikom dohvaćanja članka:', error)
  }
}

const urediClanak = async () => {
  try {
    await axios.put(
      `http://localhost:3000/api/posts/${route.params.id}`,
      {
        id: route.params.id,
        title: title.value,
        body: body.value,
        userId: userId.value
      }
    )

    poruka.value = 'Članak je uspješno uređen!'
    uspjeh.value = true
  } catch (error) {
    console.log('Greška prilikom uređivanja članka:', error)

    poruka.value = 'Došlo je do greške prilikom uređivanja članka.'
    uspjeh.value = false
  }
}

onMounted(() => {
  dohvatiClanak()
})
</script>

<template>
  <v-container class="mt-6">
    <h1 class="text-h4 font-weight-bold mb-6">
      Uredi članak
    </h1>

    <v-alert
      v-if="poruka"
      :type="uspjeh ? 'success' : 'error'"
      class="mb-4"
    >
      {{ poruka }}
    </v-alert>

    <v-form @submit.prevent="urediClanak">
      <v-text-field
        v-model="title"
        label="Naslov"
        variant="outlined"
        class="mb-4"
      />

      <v-textarea
        v-model="body"
        label="Sadržaj"
        variant="outlined"
        class="mb-4"
      />

      <v-select
        v-model="userId"
        :items="[1,2,3,4,5,6,7,8,9,10]"
        label="Autor"
        variant="outlined"
        class="mb-4"
      />

      <v-btn
        type="submit"
        color="primary"
      >
        Spremi promjene
      </v-btn>
    </v-form>
  </v-container>
</template>