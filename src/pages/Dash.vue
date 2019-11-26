<template>
  <div>
    <AppBar />
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AppBar from "../components/AppBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "Dash",

  components: {
    AppBar
  },

  computed: {
    ...mapGetters(["authIsError"])
  },

  watch: {
    authIsError: function() {
      location.reload();
    }
  }
};
</script>
