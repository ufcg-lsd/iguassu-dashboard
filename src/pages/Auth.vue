<template>
  <div class="primary" id="authentication">
    <v-content>
      <v-container hover>
        <v-layout align-center justify-center>
          <v-flex md8 sm8 xs12 lg4 xl4>
            <v-hover
              v-slot:default="{ hover }"
              :open-delay="openDelay"
              :close-delay="closeDelay"
              :disabled="disabled"
              :value="value"
            >
              <v-card :elevation="hover ? 12 : 2" class="mx-auto">
                <v-container class="text-center">
                  <v-alert
                    :type="alertType"
                    :value="alertActive"
                    dark
                    dense
                    border="left"
                    outlined
                    origin="center center"
                    transition="scale-transition"
                  >
                    {{ alertText }}
                  </v-alert>
                </v-container>
                <v-card-text>
                  <div class="layout column align-center">
                    <img
                      :src="logoSrc"
                      alt="Iguassu Logo"
                      class="lighten-2"
                      height="450"
                      width="250"
                    />
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="btnLoading"
                    @click="authorize"
                    block
                    color="primary"
                    outlined
                    rounded
                  >
                    Authenticate
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Messages from "../enums/Messages";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Auth",

  data: () => ({
    disabled: false,
    openDelay: "0",
    closeDelay: "0",
    value: false,

    alertActive: false,
    alertType: "info",
    alertText: "",

    title: "Iguassu",
    logoSrc: require("../assets/imgs/logo3.png"),
    btnLoading: false
  }),

  watch: {
    authState: function() {
      if (this.authStateIsEmpty) {
        this.btnLoading = false;
        this.destroySessionInfo();
      } else if (this.authIsPending) {
        this.btnLoading = true;
      }
    }
  },

  computed: {
    ...mapGetters(["authStateIsEmpty", "authIsPending", "authIsFinished"]),
    ...mapState(["authState"]),
    authorizationCode() {
      return this.$route.query.code ? this.$route.query.code : "";
    }
  },

  methods: {
    ...mapActions({
      requestAuthorizationCode: "auth/requestAuthorizationCode",
      requestAccessToken: "auth/requestAccessToken",
      destroySessionInfo: "auth/destroySessionInfo"
    }),

    openAlert(alertType, alertText, btnLoading) {
      this.alertActive = true;
      this.alertType = alertType;
      this.alertText = alertText;
      this.btnLoading = btnLoading;
    },

    authorize() {
      this.btnLoading = true;
      if (!this.authorizationCode) {
        this.openAlert("info", Messages.AUTHORIZATION_REDIRECT, true);
      }
      this.requestAuthorizationCode();
    },

    authenticate(authorizationCode) {
      this.openAlert("info", Messages.AUTHENTICATING, true);
      this.requestAccessToken(authorizationCode)
        .then(msg => {
          this.openAlert("success", msg, true);
          const delayTime = 2000;
          setTimeout(() => {
            this.$router.replace("/dash/jobs");
          }, delayTime);
        })
        .catch(errMsg => {
          if (errMsg === Messages.INTERNAL_SERVER_ERROR) {
            this.$router.replace("/auth");
          }
          this.openAlert("error", errMsg, false);
        });
    }
  },

  created: function() {
    if (this.authorizationCode) {
      this.btnLoading = true;
      this.authenticate(this.authorizationCode);
    }
  }
};
</script>

<style lang="css" scoped>
#authentication {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
}
</style>
