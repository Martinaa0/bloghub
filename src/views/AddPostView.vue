<script setup>
import { ref } from 'vue'
import axios from 'axios'

const title = ref('')
const body = ref('')
const userId = ref(1)
const poruka = ref('')
const uspjeh = ref(false)

const dodajClanak = async () => {
  try {
    const response = await axios.post(
     'http://localhost:3000/api/posts',
      {
        title: title.value,
        body: body.value,
        userId: userId.value
      }
    )

    console.log('Novi članak:', response.data)
    poruka.value = 'Članak je uspješno dodan!'
uspjeh.value = true

title.value = ''
body.value = ''
userId.value = 1
  } catch (error) {
    console.log('Greška prilikom dodavanja članka:', error)
    poruka.value = 'Došlo je do greške prilikom dodavanja članka.'
uspjeh.value = false
  }
}
</script>

<template>
  <v-container class="mt-6">
    <h1 class="text-h4 font-weight-bold mb-6">
      Dodaj članak
      <v-alert
  v-if="poruka"
  :type="uspjeh ? 'success' : 'error'"
  class="mb-4"
>
  {{ poruka }}
</v-alert>
    </h1>

    <v-form @submit.prevent="dodajClanak">
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
        Dodaj članak
      </v-btn>
    </v-form>
  </v-container>
</template>
