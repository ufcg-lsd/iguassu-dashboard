import AuthState from "../enums/AuthState.js";
import FileUploadStatus from "../enums/FileUploadStatus.js";
import TaskState from "../enums/TaskState.js";
import storageService from "../services/storage.js";
import StorageKey from "../enums/StorageKey.js";

const isLoggedIn = state =>
  state.auth.authState === AuthState.FINISHED &&
  storageService.get(StorageKey.CREDENTIALS) &&
  storageService.get(StorageKey.USER_ALIAS);

const authIsPending = state => state.auth.authState === AuthState.PENDING;
const authIsFinished = state => state.auth.authState === AuthState.FINISHED;
const authIsStarted = state => state.auth.authState === AuthState.STARTED;
const authIsNotStarted = state =>
  state.auth.authState === AuthState.NOT_STARTED;
const authIsError = state => state.auth.authState === AuthState.ERROR;
const authStateIsEmpty = state => state.auth.authState === "";

const uploadIsFinished = state =>
  state.jobs.fileUploadStatus === FileUploadStatus.LOADED;
const uploadIsLoading = state =>
  state.jobs.fileUploadStatus === FileUploadStatus.LOADING;
const uploadIsError = state =>
  state.jobs.fileUploadStatus === FileUploadStatus.ERROR;

const finishedTasks = state =>
  state.jobs.tasks.filter(task => task.state === TaskState.FINISHED);
const pendingTasks = state =>
  state.jobs.tasks.filter(task => task.state === "PENDING");
const runningTasks = state =>
  state.jobs.tasks.filter(task => task.state === "RUNNING");
const failedTasks = state =>
  state.jobs.tasks.filter(task => task.state === "FAILED");

const jobIsEmpty = state => Object.entries(state.jobs.currentJob).length === 0;

const filteredJobs = function(state) {
  return keyword => {
    if (keyword === "All") {
      return [].concat(...state.jobs.queues.map(q => q.jobs));
    } else {
      const queuesFiltered = state.jobs.queues.filter(
        queue => queue.id === keyword
      );
      return [].concat(...queuesFiltered.map(queue => queue.jobs));
    }
  };
};

const updatedJob = state =>
  JSON.parse(storageService.get("current_job")) || state.jobs.currentJob;
const updatedTask = state =>
  JSON.parse(storageService.get("current_task")) || state.jobs.currentTask;
const updatedQueue = state =>
  state.queues.currentQueue || JSON.parse(storageService.get("current_queue"));

export default {
  filteredJobs,
  jobIsEmpty,
  updatedJob,
  updatedTask,
  updatedQueue,

  isLoggedIn,
  authStateIsEmpty,
  authIsPending,
  authIsFinished,
  authIsStarted,
  authIsNotStarted,
  authIsError,

  uploadIsFinished,
  uploadIsLoading,
  uploadIsError,

  finishedTasks,
  pendingTasks,
  runningTasks,
  failedTasks
};
