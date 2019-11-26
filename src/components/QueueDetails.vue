<template>
  <div>
    <v-snackbar
      :color="snackbarColor"
      :top="snackbarYTopPosition"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
    <session-title title="Queue Details" />
    <v-container fluid>
      <div class="pt-2">
        <v-btn @click="backToQueueList()" class="mr-2" color="primary"
          >Back</v-btn
        >
      </div>
      <br />
      <v-layout>
        <v-flex xs3>
          <v-card flat height="130">
            <v-card-title primary-title>
              <strong>ID</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="queue.hasOwnProperty('id')">{{
                queue.id
              }}</template>
              <template class="text-center" v-else>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider vertical />

        <v-flex xs3>
          <v-card flat height="130">
            <v-card-title primary-title>
              <strong>Name</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="queue.hasOwnProperty('name')">{{
                queue.name
              }}</template>
              <template class="text-center" v-else>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider vertical />

        <v-flex xs3>
          <v-card flat height="130">
            <v-card-title primary-title>
              <strong>Nodes</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="queue.hasOwnProperty('nodes')">{{
                queue.nodes
              }}</template>
              <template v-else>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider vertical />

        <v-flex xs3>
          <v-card flat height="130">
            <v-card-title primary-title>
              <strong>Workers</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="queue.hasOwnProperty('workers')">{{
                queue.workers
              }}</template>
              <template v-else>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider vertical />
      </v-layout>
      <v-divider light />
      <br />
      <br />
      <h3 class="display-1">Nodes list</h3>
      <v-divider light />
      <div class="pt-2">
        <v-btn @click="openSheet()" class="mr-2" color="primary">Add</v-btn>
      </div>
      <v-bottom-sheet inset v-model="sheet">
        <v-sheet class="text-center">
          <v-btn @click="sheet = !sheet" class="mt-6" color="primary" text
            >close
          </v-btn>
          <v-container class="pa-4" grid-list-sm>
            <v-layout>
              <v-flex align-center justify-space-between xs12>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="nodeAddress"
                    :rules="ipRules"
                    label="IP"
                    required
                  ></v-text-field>

                  <v-btn
                    :loading="loading"
                    :disabled="!valid"
                    color="primary"
                    class="mr-4"
                    @click="insertNode"
                  >
                    Insert
                  </v-btn>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-sheet>
      </v-bottom-sheet>
      <br />
      <br />
      <v-card class="mx-auto" tile flat>
        <v-list rounded flat v-show="nodes.length !== 0">
          <v-list-item v-for="item in nodes" :key="item.resource_address">
            <v-list-item-icon>
              <v-icon color="primary"> mdi-worker</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                v-text="item.resource_address"
              ></v-list-item-title>
              <v-list-item-subtitle v-text="item.state"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import SessionTitle from "./SessionTitle";
import { mapActions } from "vuex";

export default {
  name: "QueueDetails",

  components: {
    SessionTitle
  },
  data: () => {
    return {
      nodes: [],
      queue: {},

      snackbar: false,
      snackbarColor: "",
      snackbarYTopPosition: true,
      snackbarText: "",

      loading: false,

      sheet: false,
      valid: true,
      nodeAddress: "",
      ipRules: [
        v => !!v || "IP is required",
        v =>
          /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
            v
          ) || "Must be a valid IPV4"
      ]
    };
  },

  timers: {
    updateQueueDetails: {
      name: "job-detail",
      time: 1000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    },

    syncNodeList: {
      name: "sync-nodes",
      time: 1000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  computed: {
    currentQueueId: function() {
      return this.queue.id ? this.queue.id : this.$route.params.queueId;
    }
  },

  methods: {
    ...mapActions({
      syncQueue: "queues/syncQueue",
      insert: "nodes/insertNode",
      getNodes: "nodes/getNodes"
    }),

    async syncNodeList() {
      const r = await this.getNodes();
      this.nodes = r.nodes;
    },
    async updateQueueDetails() {
      this.queue = await this.syncQueue({ queueId: this.currentQueueId });
    },

    insertNode() {
      this.loading = true;
      this.insert(this.nodeAddress)
        .then(() => {
          this.loading = false;
          this.sheet = false;
          this.activeSnackbar("success", "Node added successfully.");
        })
        .catch(err => {
          this.loading = false;
          this.sheet = false;
          this.activeSnackbar("error", err.message);
        });
    },

    activeSnackbar(snackbarColor, snackbarText) {
      this.snackbar = true;
      this.snackbarColor = snackbarColor;
      this.snackbarText = snackbarText;
    },

    backToQueueList() {
      this.$router.push("/dash/queues");
    },

    openSheet() {
      this.sheet = true;
    }
  }
};
</script>
