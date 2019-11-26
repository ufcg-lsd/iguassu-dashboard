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
    <v-data-table
      :headers="headers"
      :items="currentTask.commands"
      :search="search"
      :loading="isLoading"
    >
      <template v-slot:item.state="{ item }">
        <v-chip :color="genColor(item.state)" dark filter small>{{
          item.state
        }}</v-chip>
      </template>

      <template v-slot:no-results>
        No results.
      </template>

      <template v-slot:no-data>
        No commands here.
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { generateCommandStateColor } from "../utils";

export default {
  data: () => ({
    search: "",
    headers: [
      {
        text: "Command",
        align: "left",
        sortable: true,
        value: "raw_command"
      },
      {
        text: "Exit code",
        align: "left",
        sortable: true,
        value: "exit_code"
      },
      {
        text: "State",
        align: "left",
        sortable: true,
        value: "state"
      }
    ]
  }),

  computed: {
    ...mapState({
      currentTask: state => state.jobs.currentTask
    }),

    isLoading: function() {
      return this.currentTask.length === 0;
    }
  },

  methods: {
    genColor(commandState) {
      return generateCommandStateColor(commandState);
    }
  }
};
</script>
