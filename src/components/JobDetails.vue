<template>
  <div>
    <session-title title="Job Details" />
    <v-container fluid>
      <div class="pt-2">
        <v-btn @click="backToJobList()" class="mr-2" color="primary"
          >Back</v-btn
        >
      </div>
      <br />
      <v-layout>
        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title primary-title>
              <strong>ID</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="currentJob.id">{{ currentJob.id }}</template>
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

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title primary-title>
              <strong>Label</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="currentJob.label">{{
                currentJob.label
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

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title primary-title>
              <strong>Created</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="currentJob.creation_date">{{
                currentJob.creation_date
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

        <v-flex xs2>
          <v-card class="text-center" flat height="200">
            <v-card-title primary-title>
              <strong>Status</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <template v-if="currentJob.id">
                <v-chip :color="genColor(currentJob.state)" label outlined>{{
                  currentJob.state
                }}</v-chip>
              </template>
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

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title primary-title>
              <strong>Summary</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              {{ numberOfTasks() }} total
              <v-spacer />
              {{ numberOfTasksRunning() }} running
              <v-spacer />
              {{ numberOfTasksPending() }} pending
              <v-spacer />
              {{ numberOfTasksFailed() }} failed
              <v-spacer />
              {{ numberOfTasksFinished() }} finished
              <v-spacer />
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider vertical />

        <v-flex xs2>
          <v-card class="text-center" flat height="200">
            <v-card-title primary-title>
              <strong>Progress</strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <v-progress-circular
                :color="progressColor()"
                :rotate="360"
                :value="progressValue()"
                :width="2"
                size="100"
                >{{ Math.trunc(progressValue()) }}%</v-progress-circular
              >
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-divider light />
      <br />
      <br />
      <v-tabs>
        <v-tab>Tasks</v-tab>

        <v-tab-item>
          <task-table />
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import SessionTitle from "./SessionTitle";
import TaskTable from "./TaskTable.vue";
import { generateJobStateColor } from "../utils";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "JobDetails",

  components: {
    TaskTable,
    SessionTitle
  },
  data: () => {
    return {
      job: {}
    };
  },

  timers: {
    updateJobDetail: {
      name: "job-detail",
      time: 2000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  computed: {
    ...mapState({
      tasks: state => state.jobs.tasks,
      currentQueue: state => state.queues.currentQueue,
      currentJob: state => state.jobs.currentJob
    }),

    ...mapGetters([
      "finishedTasks",
      "runningTasks",
      "pendingTasks",
      "failedTasks",
      "jobIsEmpty"
    ]),

    currentJobId: function() {
      return this.currentJob.id ? this.currentJob.id : this.$route.params.id;
    }
  },

  created: function() {
    this.job = this.currentJob;
  },

  methods: {
    ...mapActions({
      syncJobStatus: "jobs/syncJobStatus"
    }),

    updateJobDetail() {
      if (this.currentJobId) {
        this.syncJobStatus();
      } else {
        this.backToJobList();
      }
    },

    backToJobList() {
      this.$router.push("/dash/jobs");
    },

    progressValue() {
      const currentProgress =
        ((this.numberOfTasksFinished() + this.numberOfTasksFailed()) /
          this.numberOfTasks()) *
        100;
      return currentProgress ? currentProgress : 0;
    },

    progressColor() {
      return this.numberOfTasksFinished() === this.numberOfTasks()
        ? "success"
        : "primary";
    },

    genColor(jobState) {
      return generateJobStateColor(jobState);
    },

    numberOfTasks() {
      return this.tasks.length;
    },

    numberOfTasksFinished() {
      return this.finishedTasks.length;
    },

    numberOfTasksFailed() {
      return this.failedTasks.length;
    },

    numberOfTasksRunning() {
      return this.runningTasks.length;
    },

    numberOfTasksPending() {
      return this.pendingTasks.length;
    }
  }
};
</script>
