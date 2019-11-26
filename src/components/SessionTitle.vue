<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <h1 v-text="title" class="display-2"></h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "SessionTitle",
  props: {
    title: String
  }
};
</script>
