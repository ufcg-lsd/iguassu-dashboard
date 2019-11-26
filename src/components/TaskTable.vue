<template>
  <div>
    <v-card flat>
      <v-card-title>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          v-model="search"
        ></v-text-field>
      </v-card-title>
    </v-card>
    <v-data-table :headers="headers" :items="tasks" :search="search">
      <template v-slot:item.state="{ item }">
        <v-chip :color="genColor(item.state)" dark small>{{
          item.state
        }}</v-chip>
      </template>

      <template v-slot:no-results>
        No results.
      </template>

      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="details(item)" class="mr-2" v-on="on">
              arrow_right_alt
            </v-icon>
          </template>
          <span>See task details</span>
        </v-tooltip>
      </template>

      <template v-slot:no-data>
        <div class="text-center">
          <v-progress-circular
            color="primary"
            indeterminate
            value="100"
          ></v-progress-circular>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { generateTaskStateColor } from "../utils";

export default {
  data: () => ({
    search: "",
    headers: [
      {
        text: "ID",
        align: "left",
        sortable: true,
        value: "id"
      },
      {
        text: "State",
        align: "left",
        sortable: true,
        value: "state"
      },
      {
        text: "Actions",
        align: "left",
        sortable: false,
        value: "action"
      }
    ]
  }),

  timers: {
    updateTaskTable: {
      name: "task-table",
      time: 1000,
      autostart: true,
      repeat: true,
      isSwitchTab: true
    }
  },

  computed: {
    ...mapState({
      tasks: state => state.jobs.tasks,
      currentJob: state => state.jobs.currentJob
    }),

    currentJobId: function() {
      return this.currentJob.id ? this.currentJob.id : this.$route.params.id;
    }
  },

  methods: {
    ...mapActions({
      syncTasks: "jobs/syncTasks",
      setCurrentTask: "jobs/setCurrentTask"
    }),

    updateTaskTable() {
      if (this.currentJobId && this.currentJob) {
        this.syncTasks(this.currentJob);
      } else {
        this.$router.push("/dash/jobs");
      }
    },

    details(task) {
      if (this.currentJobId) {
        this.$router.push(`/dash/jobs/${this.currentJobId}/tasks/${task.id}`);
      }
      this.setCurrentTask(task);
    },

    genColor(taskState) {
      return generateTaskStateColor(taskState);
    }
  }
};
</script>
