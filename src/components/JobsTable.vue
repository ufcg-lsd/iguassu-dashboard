<template>
  <div>
    <v-snackbar
      :color="snackbarColor"
      :top="snackbarYTopPosition"
      v-model="snackbar"
      >{{ snackbarText }}</v-snackbar
    >
    <v-card flat>
      <v-card-title>
        <v-row align="center">
          <v-col cols="12">
            <v-text-field
              flat
              label="Search "
              prepend-inner-icon="search"
              single-line
              v-model="search"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              :items="currentQueues"
              v-model="queueSelected"
              hint="Filter jobs by queue"
              persistent-hint
              label="---"
              solo
              hide-selected
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              :items="jobStates"
              v-model="jobStateSelected"
              hint="Filter jobs by state"
              persistent-hint
              label="---"
              solo
              hide-selected
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>

    <v-data-table
      v-model="selected"
      :footer-props="{
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus'
      }"
      :headers="headers"
      :items="currentJobs"
      :items-per-page="5"
      :loading="loading"
      :search="search"
      :show-select="showMultiSelect"
      item-key="id"
      loading-text="Loading job list... Please wait."
    >
      <template v-slot:item.state="{ item }">
        <v-chip :color="genColor(item.state)" dark filter small>
          {{ item.state }}
        </v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="details(item)" class="mr-2" v-on="on"
              >arrow_right_alt</v-icon
            >
          </template>
          <span>See job details</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="deleteJob(item)"
              class="mr-2"
              v-show="item.state === 'FINISHED' || item.state === 'FAILED'"
              v-on="on"
              >delete</v-icon
            >
          </template>
          <span>Remove this Job</span>
        </v-tooltip>
      </template>

      <template v-slot:no-data>{{ tableMsg }}</template>

      <template v-slot:no-results
        >No results</template
      >
    </v-data-table>
    <br />
    <v-layout align-end justify-end>
      <div>
        <v-btn
          small
          :disabled="deleteBtnDisabled"
          :loading="deleteBtnLoading"
          @click="deleteAllJobsSelected()"
          color="primary"
          v-if="showMultiSelect"
          >Remove selected</v-btn
        >
      </div>
    </v-layout>
    <br />
  </div>
</template>

<script>
import { generateJobStateColor } from "../utils";
import { mapActions, mapState, mapGetters } from "vuex";
import JobState from "../enums/JobState.js";
import Messages from "../enums/Messages.js";

export default {
  name: "JobsTable",

  data: () => {
    return {
      snackbarYTopPosition: true,
      snackbar: false,
      snackbarColor: "info",
      snackbarText: "",

      showMultiSelect: false,
      deleteBtnDisabled: true,
      deleteBtnLoading: false,

      loading: true,
      tableMsg: "",
      search: "",
      headers: [
        { text: "Label", value: "label" },
        { text: "ID", value: "id" },
        { text: "Created", value: "creation_date" },
        { text: "State", value: "state" },
        { text: "More", value: "action", sortable: false }
      ],

      selected: [],

      queueSelected: "All",
      queueDefault: {
        text: "---",
        value: "All"
      },

      jobStateSelected: "All",
      jobStates: [
        {
          text: "---",
          value: "All"
        },
        {
          text: "Queued",
          value: JobState.QUEUED
        },
        {
          text: "Running",
          value: JobState.RUNNING
        },
        {
          text: "Failed",
          value: JobState.FAILED
        },
        {
          text: "Finished",
          value: JobState.FINISHED
        }
      ]
    };
  },

  timers: {
    syncTableData: {
      name: "sync-jobs-table",
      time: 3000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    },
    evaluateJobState: {
      name: "evaluate-job-state",
      time: 1000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  watch: {
    selected: function() {
      this.deleteBtnDisabled = this.selected.length <= 0;
    },

    jobState: function() {
      this.evaluateJobState();
    },

    queues: function() {
      this.evaluateJobsLen();
      this.filterJobs();
    }
  },

  created: function() {
    this.evaluateJobState();
    setTimeout(this.evaluateJobsLen, 3000);
  },

  computed: {
    ...mapState({
      queues: state => state.jobs.queues
    }),

    ...mapGetters({
      filteredJobs: "filteredJobs"
    }),

    currentQueues: function() {
      return this.queues
        .map(queue => {
          return {
            text: queue.name,
            value: queue.id
          };
        })
        .concat(this.queueDefault);
    },

    currentJobs: function() {
      return this.jobStateSelected === "All"
        ? this.jobs
        : this.jobs.filter(job => job.state === this.jobStateSelected);
    },

    jobs: function() {
      return this.filteredJobs(this.queueSelected);
    }
  },

  methods: {
    ...mapActions({
      removeJob: "jobs/removeJob",
      removeAllJobs: "jobs/removeAllJobs",
      setCurrentJob: "jobs/setCurrentJob",
      syncJobs: "jobs/syncJobs",

      getQueues: "queues/getQueues"
    }),

    syncTableData() {
      this.getQueues().then(() => this.syncJobs());
    },

    activeSnackbar(snackbarColor, snackbarText) {
      this.snackbar = true;
      this.snackbarColor = snackbarColor;
      this.snackbarText = snackbarText;
    },

    genColor(jobState) {
      return generateJobStateColor(jobState);
    },

    details(job) {
      this.setCurrentJob(job);
      this.$router.push(`/dash/jobs/${job.id}`);
    },

    deleteJob(job) {
      if (confirm("Are you sure you want to remove this job?")) {
        this.loading = true;
        this.removeJob(job)
          .then(msg => {
            this.activeSnackbar("success", msg);
            this.loading = false;
          })
          .catch(err => {
            this.activeSnackbar("error", err);
          });
      }
    },

    deleteAllJobsSelected() {
      this.deleteBtnLoading = true;
      this.removeAllJobs(this.selected)
        .then(() => {
          this.activeSnackbar("success", Messages.JOB_BATCH_REMOVE_SUCCESSFUL);
          this.deleteBtnLoading = false;
          this.selected = [];
        })
        .catch(err => {
          this.activeSnackbar("error", err);
          this.deleteBtnLoading = false;
          this.selected = [];
        });
    },

    filterJobs() {
      if (this.queueSelected === "All") {
        return [].concat(...this.queues.map(queue => queue.jobs));
      } else {
        const queuesFiltered = this.queues.filter(
          queue => queue.id === this.queueSelected
        );
        return [].concat(...queuesFiltered.map(queue => queue.jobs));
      }
    },

    evaluateJobsLen() {
      if ([].concat(...this.queues.map(queue => queue.jobs)).length >= 0) {
        this.loading = false;
      }
    },

    evaluateJobState() {
      switch (this.jobStateSelected) {
        case JobState.FINISHED:
          this.tableMsg = "No job finished.";
          this.showMultiSelect = true;
          break;
        case JobState.QUEUED:
          this.tableMsg = "No queued job.";
          this.showMultiSelect = false;
          break;
        case JobState.RUNNING:
          this.tableMsg = "No job running.";
          this.showMultiSelect = false;
          break;
        case JobState.FAILED:
          this.tableMsg = "No job failed.";
          this.showMultiSelect = true;
          break;
        default:
          this.tableMsg =
            "No jobs were submitted yet. Maybe you can submit the first.";
          this.showMultiSelect = false;
          break;
      }
    }
  }
};
</script>
