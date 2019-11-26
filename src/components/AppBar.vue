<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar app clipped-left color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer />

      <span class="hidden-xs-only">
        <v-container>
          <img
            alt="Iguassu Logo"
            height="50"
            src="../assets/imgs/10fundoazul.png"
            @click="goToDash()"
            width="200"
          />
        </v-container>
      </span>

      <v-spacer />

      <v-menu
        bottom
        open-on-hover
        origin="center center"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on" v-show="miniVariant">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="logout()">
            <v-list-item-title> Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      :mini-variant.sync="miniVariant"
      app
      clipped
      light
      v-model="drawer"
    >
      <v-list class="py-0" dense nav>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="../assets/imgs/generic-user.svg"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{ userAlias }}</v-list-item-title>
          <v-btn @click.stop="miniVariant = !miniVariant" icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          :key="item.title"
          :to="item.path"
          link
          v-for="item in items"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2" v-show="!miniVariant">
          <v-btn @click="logout()" block outlined>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "AppBar",

  data: () => ({
    logoutError: false,
    drawer: true,
    items: [
      { title: "Jobs", icon: "work_outline", path: "/dash/jobs" },
      { title: "Queues", icon: "horizontal_split", path: "/dash/queues" }
    ],
    miniVariant: false,
    expandOnHover: false
  }),

  watch: {
    userAlias: function() {
      if (this.userAlias === "") {
        this.destroySessionInfo();
        location.reload();
      }
    }
  },

  computed: {
    ...mapGetters(["authIsFinished"]),
    ...mapState({
      userAlias: state => state.auth.userAlias
    })
  },

  methods: {
    ...mapActions({
      destroySessionInfo: "destroySessionInfo"
    }),

    logout() {
      this.destroySessionInfo()
        .then(() => {
          this.$router.replace("/auth");
        })
        .catch(() => {
          location.reload();
        });
    },

    goToDash() {
      this.$router.replace("/dash");
    }
  }
};
</script>
