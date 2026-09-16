<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const router = useRouter()

const idiNaUredivanje = () => {
  router.push(`/posts/edit/${props.post.id}`)
}

// Slike po temama članaka
const slike = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9'
]

const slika = slike[(props.post.id - 1) % slike.length]
</script>

<template>
  <v-card
    rounded="lg"
    elevation="2"
    class="h-100"
    color="white"
  >
    <v-img
      :src="slika"
      height="190"
      cover
    />

    <v-card-title class="text-wrap font-weight-bold">
      {{ post.title }}
    </v-card-title>

    <v-card-subtitle>
      Autor {{ post.userId }}
    </v-card-subtitle>

    <v-card-text>
      {{ post.body }}
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="blue-grey-darken-1"
        variant="tonal"
        @click="idiNaUredivanje"
      >
        Uredi
      </v-btn>

      <v-btn
        color="red-darken-1"
        variant="text"
        @click="emit('delete', post.id)"
      >
        Obriši
      </v-btn>
    </v-card-actions>
  </v-card>
</template>