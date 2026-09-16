<template>
  <v-app>
    <v-app-bar color="blue-grey-lighten-4" elevation="1">
      <v-app-bar-title
        class="font-weight-bold d-none d-sm-flex"
      >
        Moj Blog
      </v-app-bar-title>

      <v-btn
        to="/"
        variant="text"
      >
        Početna
      </v-btn>

      <v-btn
        to="/posts"
        variant="text"
      >
        Članci
      </v-btn>

      <v-btn
        to="/posts/add"
        variant="text"
      >
        Dodaj članak
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>