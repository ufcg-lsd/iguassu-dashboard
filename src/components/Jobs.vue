<template>
  <div>
    <v-snackbar
      :color="snackbarColor"
      :top="snackbarYTopPosition"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
    <session-title title="Jobs" />
    <v-container fluid>
      <div class="pt-2">
        <v-btn @click="sheet = !sheet" class="mr-2" color="primary"
          >Submit JDF</v-btn
        >
      </div>
      <br />
      <v-card flat>
        <jobs-table />
      </v-card>
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
                <file-uploader />
              </v-flex>
            </v-layout>
          </v-container>
        </v-sheet>
      </v-bottom-sheet>
    </div>
  </div>
</template>

<script>
import FileUploader from "./FileUploader.vue";
import JobsTable from "./JobsTable";
import { mapGetters } from "vuex";
import SessionTitle from "./SessionTitle";

export default {
  components: {
    SessionTitle,
    FileUploader,
    JobsTable
  },

  data: () => ({
    sheet: false,

    snackbar: false,
    snackbarColor: "",
    snackbarYTopPosition: true,
    snackbarText: ""
  }),

  watch: {
    uploadIsFinished: function() {
      if (this.uploadIsFinished) {
        this.sheet = false;
        this.activeSnackbar("success", "JDF successfully compiled!");
      } else {
        this.activeSnackbar(
          "warning",
          "One or more jobs were not submitted. Try again!"
        );
      }
    }
  },

  computed: {
    ...mapGetters(["uploadIsFinished"])
  },

  methods: {
    activeSnackbar(snackbarColor, snackbarText) {
      this.snackbar = true;
      this.snackbarColor = snackbarColor;
      this.snackbarText = snackbarText;
    }
  }
};
</script>
