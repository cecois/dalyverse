<template>
  <v-footer padless="true" class="bg-grey-lighten-3">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in ['footer-link1', 'footer-link2']"
        :key="link"
        variant="text"
        class="mx-2"
      >
        {{ link }}
      </v-btn>
    </v-row>
    <v-row>no copyright infringement is intended</v-row>
  </v-footer>
</template>

<script setup></script>
