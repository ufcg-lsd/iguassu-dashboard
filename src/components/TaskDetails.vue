<template>
  <div>
    <session-title title="Task Details" />
    <v-container fluid>
      <div class="pt-2">
        <v-btn @click="backToJobDetails()" class="mr-2" color="primary"
          >Back
        </v-btn>
      </div>
      <br />
      <v-layout>
        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title><strong>ID</strong></v-card-title>
            <v-divider />
            <v-card-text> {{ currentTask.id }}</v-card-text>
          </v-card>
        </v-flex>
        <v-divider vertical />

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title><strong>Job ID</strong></v-card-title>
            <v-divider />
            <v-card-text>{{ currentJob.id }}</v-card-text>
          </v-card>
        </v-flex>
        <v-divider vertical />

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title><strong>Job Label </strong></v-card-title>
            <v-divider />
            <v-card-text>{{ currentJob.label }}</v-card-text>
          </v-card>
        </v-flex>
        <v-divider vertical />

        <v-flex xs2>
          <v-card class="text-center" flat height="200">
            <v-card-title><strong>Status </strong></v-card-title>
            <v-divider />
            <v-card-text>
              <v-chip :color="genColor(currentTask.state)" label outlined>
                {{ currentTask.state }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-divider vertical />

        <v-flex xs2>
          <v-card flat height="200">
            <v-card-title><strong>Summary </strong></v-card-title>
            <v-divider />
            <v-card-text>
              {{ numberOfCommands() }} total
              <v-spacer />
              {{ cmdsOfState("FINISHED") }} finished
              <v-spacer />
            </v-card-text>
          </v-card>
        </v-flex>
        <v-divider vertical />

        <v-flex xs2>
          <v-card class="text-center" flat height="200">
            <v-card-title primary-title>
              <strong>Progress </strong>
            </v-card-title>
            <v-divider light />
            <v-card-text>
              <v-progress-circular
                :color="progressColor()"
                :rotate="360"
                :value="progressValue()"
                :width="2"
                size="100"
              >
                {{ Math.trunc(progressValue()) }}%
              </v-progress-circular>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-divider vertical />

      <v-tabs>
        <v-tab>
          Commands
        </v-tab>

        <v-tab-item>
          <CommandList />
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import CommandList from "./CommandTable.vue";
import SessionTitle from "./SessionTitle";
import { generateTaskStateColor } from "../utils";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "TaskDetails",
  components: {
    CommandList,
    SessionTitle
  },

  computed: {
    ...mapState({
      tasks: state => state.jobs.tasks
    }),
    ...mapGetters({
      currentJob: "updatedJob",
      currentTask: "updatedTask"
    }),

    currentJobId: function() {
      return this.currentJob.id ? this.currentJob.id : this.$route.params.id;
    },

    currentTaskId: function() {
      return this.currentTask.id
        ? this.currentTask.id
        : this.$route.params.taskId;
    }
  },

  timers: {
    updateTaskDetail: {
      name: "task-detail",
      time: 1000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  methods: {
    ...mapActions({
      syncJobStatus: "jobs/syncJobStatus",
      syncTaskState: "jobs/syncTaskState"
    }),

    updateTaskDetail() {
      this.syncJobStatus();
      this.syncTaskState(this.currentTaskId);
    },

    progressColor() {
      return this.cmdsOfState("FINISHED") === this.numberOfCommands()
        ? "success"
        : "primary";
    },

    progressValue() {
      const currentProgress =
        ((this.cmdsOfState("FINISHED") + this.cmdsOfState("FAILED")) /
          this.numberOfCommands()) *
        100;
      return currentProgress ? currentProgress : 0;
    },

    genColor(taskState) {
      return generateTaskStateColor(taskState);
    },

    cmdsOfState(state) {
      let result = 0;
      if (Object.entries(this.currentTask).length !== 0) {
        result = this.currentTask.commands.filter(
          command => command.state === state
        ).length;
      }
      return result;
    },

    numberOfCommands() {
      let result = 0;
      if (Object.entries(this.currentTask).length !== 0) {
        result = this.currentTask.commands.length;
      }
      return result;
    },

    backToJobDetails() {
      this.$router.push(`/dash/jobs/${this.currentJobId}`);
    }
  }
};
</script>
