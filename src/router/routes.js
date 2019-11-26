import Auth from "../pages/Auth.vue";
import Dash from "../pages/Dash.vue";
import Jobs from "../components/Jobs.vue";
import JobDetails from "../components/JobDetails.vue";
import TaskDetails from "../components/TaskDetails.vue";
import Queues from "../components/Queues.vue";
import QueueDetails from "../components/QueueDetails.vue";

const routes = [
  {
    path: "*",
    redirect: "/dash/jobs",
    meta: { requiresAuth: true }
  },
  {
    path: "*",
    redirect: "auth",
    meta: { requiresAuth: false }
  },
  {
    name: "auth",
    path: "/auth",
    component: Auth,
    meta: { requiresAuth: false }
  },
  {
    name: "dash",
    path: "/dash",
    component: Dash,
    meta: { requiresAuth: true },
    children: [
      {
        name: "jobs",
        path: "jobs",
        component: Jobs,
        meta: { requiresAuth: true }
      },
      {
        name: "job-details",
        path: "jobs/:id/",
        component: JobDetails,
        meta: { requiresAuth: true }
      },
      {
        name: "task-details",
        path: "jobs/:id/tasks/:taskId",
        component: TaskDetails,
        meta: { requiresAuth: true }
      },
      {
        name: "queues",
        path: "queues",
        component: Queues,
        meta: { requiresAuth: true }
      },
      {
        name: "queue-details",
        path: "queues/:queueId",
        component: QueueDetails,
        meta: { requiresAuth: true }
      },
    ]
  }
];

export default routes;
