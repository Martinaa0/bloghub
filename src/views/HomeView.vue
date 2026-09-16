<template>
  <v-container class="py-10">
    <v-row align="center">
      <v-col
        cols="12"
        md="6"
      >
        <h1 class="text-h3 font-weight-bold mb-4">
          Dobrodošli na Moj Blog
        </h1>

        <p class="text-h6 mb-6">
          Jednostavna web aplikacija za pregled,
          dodavanje i uređivanje članaka.
        </p>

        <v-btn
          to="/posts"
          color="blue-grey-darken-1"
          size="large"
          class="mr-3"
        >
          Pregledaj članke
        </v-btn>

        <v-btn
          to="/posts/add"
          variant="outlined"
          size="large"
        >
          Dodaj članak
        </v-btn>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-img
          src="https://picsum.photos/seed/blog-pocetna/700/450"
          height="350"
          cover
          class="rounded-lg"
        />
      </v-col>
    </v-row>
  </v-container>
</template>