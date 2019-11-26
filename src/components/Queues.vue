<template>
  <div>
    <v-snackbar
      :color="snackbarColor"
      :top="snackbarYTopPosition"
      v-model="snackbar"
      >{{ snackbarText }}</v-snackbar
    >
    <session-title title="Queues" />
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container fluid>
      <div class="pt-2">
        <v-btn @click="sheet = !sheet" class="mr-2" color="primary"
          >New Queue</v-btn
        >
      </div>
      <br />
      <v-expansion-panels>
        <v-expansion-panel flat v-for="(queue, i) in currentQueues" :key="i">
          <v-expansion-panel-header expand-icon="mdi-menu-down">
            {{ queue.name }} </v-expansion-panel-header>
          <v-expansion-panel-content>
            ID: {{ queue.id }}
            <br />
            Waiting jobs: {{ queue.waiting_jobs }}
            <br />
            Nodes: {{ queue.nodes }}
            <br />
            Workers: {{ queue.workers }}
            <br />
            <v-layout align-end justify-end row>
              <div class="pt-2">
                <v-btn
                  @click="goToQueueDetails(queue)"
                  class="mr-2"
                  color="primary"
                  >Details</v-btn
                >
              </div>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>

    <div class="text-center">
      <v-bottom-sheet inset v-model="sheet">
        <v-sheet class="text-center">
          <v-btn @click="sheet = !sheet" class="mt-6" color="primary" text
            >close
          </v-btn>
          <v-container class="pa-4" grid-list-sm>
            <v-layout>
              <v-flex align-center justify-space-between xs12>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    v-model="queueName"
                    :rules="nameRules"
                    label="Queue name"
                    required
                  ></v-text-field>

                  <v-btn
                    :disabled="queueName === ''"
                    color="primary"
                    class="mr-4"
                    @click="create"
                    :loading="loading"
                  >
                    Create
                  </v-btn>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-sheet>
      </v-bottom-sheet>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import SessionTitle from "./SessionTitle";

export default {
  name: "Queues",

  components: {
    SessionTitle
  },

  data: () => ({
    snackbarYTopPosition: true,
    snackbar: false,
    snackbarColor: "info",
    snackbarText: "",

    success: false,
    sheet: false,
    loading: false,
    overlay: true,
    queueName: "",
    nameRules: [v => !!v || "Name is required"]
  }),

  timers: {
    syncQueues: {
      name: "sync-queues-list",
      time: 3000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  watch: {
    uploadIsFinished: function() {
      if (this.uploadIsFinished) {
        this.sheet = false;
      }
    },
    queues: function() {
      this.evaluateOverlay();
    }
  },

  computed: {
    ...mapState({
      queues: state => state.queues.queues
    }),

    ...mapGetters(["uploadIsFinished"]),

    currentQueues: function() {
      return this.queues.filter(queue => queue.id !== "All");
    }
  },

  created: function() {
    this.evaluateOverlay();
  },

  methods: {
    ...mapActions({
      getQueues: "queues/getQueues",
      createQueue: "queues/createQueue",
      storeQueue: "queues/storeQueue"
    }),
    syncQueues() {
      this.getQueues();
    },
    create() {
      this.loading = true;
      const payload = { queueName: this.queueName };
      this.createQueue(payload)
        .then(response => {
          this.activeSnackbar("success", "Queue created with id " + response);
          this.loading = false;
          this.sheet = false;
        })
        .catch(err => {
          this.activeSnackbar("error", err);
          this.loading = false;
        });
    },

    evaluateOverlay() {
      if (this.queues.length >= 1) {
        this.overlay = false;
      }
    },

    goToQueueDetails(queue) {
      this.storeQueue(queue);
      this.$router.replace(`/dash/queues/${queue.id}`);
    },

    activeSnackbar(snackbarColor, snackbarText) {
      this.snackbar = true;
      this.snackbarColor = snackbarColor;
      this.snackbarText = snackbarText;
    }
  }
};
</script>
