<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="uploader">
    <v-select
      :items="currentQueues"
      v-model="queueSelected"
      label="What queue do you want to submit this job to?"
      hint="If you don't choose any queue, the job will be submitted to the default queue"
      solo
      hide-details
    ></v-select>
    <v-file-input
      :loading="filesLoading"
      autofocus
      clearable
      color="primary"
      counter
      multiple
      placeholder="Click here to browser your files"
      prepend-icon="cloud_upload"
      rounded
      v-model="files"
      validate-on-blur
    >
      <template v-slot:selection="{ index, text }">
        <v-chip
          @click:close="cancel(index)"
          class="ma-2"
          close
          close-icon="mdi-delete"
          color="secondary"
          dark
          label
          outlined
        >
          <v-avatar left>
            <v-icon>work_outline</v-icon>
          </v-avatar>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
    <v-snackbar
      :color="snackbarColor"
      :top="snackbarYTopPosition"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
    <v-btn
      :disabled="uploadBlocked"
      :loading="filesLoading"
      @click="submit()"
      block
      color="primary"
      outlined
      right
    >
      Submit
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "FileUploader",

  data: () => ({
    files: [],
    filesLoading: false,
    uploadBlocked: true,

    snackbar: false,
    snackbarColor: "",
    snackbarYTopPosition: true,
    snackbarText: "",

    queueSelected: ""
  }),

  computed: {
    ...mapGetters(["uploadIsFinished", "uploadIsError"]),
    ...mapState({
      queues: state => state.queues.queues
    }),

    currentQueues: function() {
      return this.queues
        .filter(queue => queue.id !== "All")
        .map(queue => {
          return {
            text: queue.name,
            value: queue.id
          };
        });
    }
  },

  watch: {
    files: function() {
      if (this.files.length >= 1) {
        this.uploadBlocked = false;
      }
    },

    uploadIsFinished: function() {
      if (this.uploadIsFinished) {
        this.filesLoading = false;
        this.files = [];
        this.uploadBlocked = true;
      }
    },

    uploadIsError: function() {
      if (this.uploadIsError) {
        this.filesLoading = false;
        this.files = [];
        this.uploadBlocked = true;
      }
    }
  },

  methods: {
    ...mapActions({
      submitJdfList: "jobs/submitJdfList"
    }),

    activeSnackbar(snackbarColor, snackbarText) {
      this.snackbar = true;
      this.snackbarColor = snackbarColor;
      this.snackbarText = snackbarText;
    },

    submit() {
      this.filesLoading = true;
      const jdfs = this.files;
      const payload = { jobs: jdfs, queueId: this.queueSelected };
      this.submitJdfList(payload)
        .then(() => {})
        .catch(err => {
          this.activeSnackbar("error", err);
        });
    },

    cancel(jdfIndex) {
      this.files.splice(jdfIndex, 1);
    }
  }
};
</script>
