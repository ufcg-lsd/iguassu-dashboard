import jobService from "../../services/jobs.js";
import FileUploadStatus from "../../enums/FileUploadStatus";
import HttpStatusCode from "../../enums/HttpStatusCode";
import queueService from "../../services/queues.js";
import storageService from "../../services/storage.js";

const state = {
  fileUploadStatus: FileUploadStatus.UNLOADED,
  queues: [],
  tasks: [],
  currentJob: JSON.parse(storageService.get("current_job")) || {},
  currentTask: JSON.parse(storageService.get("current_task")) || {}
};

const type = {
  CHANGE_FILE_UPLOAD_STATUS: "CHANGE_FILE_UPLOAD_STATUS",
  SYNC_JOBS_STATE: "SYNC_JOBS_STATE",
  SET_TASK_LIST: "SET_TASK_LIST",
  SET_CURRENT_JOB: "SET_CURRENT_JOB",
  SET_CURRENT_TASK: "SET_CURRENT_TASK",
  SYNC_FILTERED_JOBS_STATE: "SYNC_FILTERED_JOBS_STATE",
  REMOVE_JOB_BY_INDEX: "DELETE_JOB_BY_INDEX"
};

const mutations = {
  [type.CHANGE_FILE_UPLOAD_STATUS]: (state, newFileUploadStatus) => {
    state.fileUploadStatus = newFileUploadStatus;
  },

  [type.SYNC_JOBS_STATE]: (state, queue) => {
    let queueSearched = state.queues.filter(e => e.id === queue.id);
    if (queueSearched.length === 0) {
      state.queues.push(queue);
    } else {
      const queueIndex = state.queues.indexOf(queueSearched[0]);
      state.queues[queueIndex].jobs = queue.jobs;
    }
  },

  [type.SET_CURRENT_JOB]: (state, currentJob) => {
    state.currentJob = { ...state.currentJob, ...currentJob };
  },

  [type.SET_CURRENT_TASK]: (state, task) => {
    state.currentTask = { ...state.currentTask, ...task };
  },

  [type.SET_TASK_LIST]: (state, currentTasks) => {
    state.tasks = currentTasks;
  },

  [type.REMOVE_JOB_BY_INDEX]: (state, job) => {
    state.queues.forEach(queue => {
      let jobIndex = queue.jobs.indexOf(job);
      if (jobIndex !== -1) {
        queue.splice(jobIndex, 1);
      }
    });
  }
};

const actions = {
  syncJobs: function({ dispatch, commit, rootState }) {
    return Promise.all(
      rootState.queues.queues.map(queue => {
        queueService
          .getQueue(queue.id)
          .then(response => {
            commit(type.SYNC_JOBS_STATE, response.data);
          })
          .catch(err => {
            const status = err.response.status;
            if (status) {
              if (status === HttpStatusCode.UNAUTHORIZED) {
                dispatch("destroySessionInfo", null, { root: true });
                setTimeout(() => {
                  location.reload();
                }, 3000);
              }
            }
          });
      })
    );
  },

  submitJdfList: async function({ commit }, payload) {
    commit(type.CHANGE_FILE_UPLOAD_STATUS, FileUploadStatus.LOADING);

    try {
      await jobService.submitJDFList(payload.jobs, payload.queueId);
      commit(type.CHANGE_FILE_UPLOAD_STATUS, FileUploadStatus.LOADED);
    } catch (e) {
      commit(type.CHANGE_FILE_UPLOAD_STATUS, FileUploadStatus.ERROR);
    }
  },

  syncJobStatus: async function({ dispatch, commit }) {
    try {
      const currentJob = JSON.parse(storageService.get("current_job"));
      const r = await jobService.getJobById(currentJob.id, currentJob.queue_id);
      const job = r.data;
      commit(type.SET_CURRENT_JOB, job);
      storageService.put("current_job", JSON.stringify(job));
      await dispatch("syncTasks", job);
    } catch (e) {
      if (e.response.status === HttpStatusCode.UNAUTHORIZED) {
        dispatch("destroySessionInfo", null, { root: true });
        setTimeout(() => {
          location.reload();
        }, 3000);
        throw new Error(e.response.data.message);
      }
    }
  },

  removeAllJobs: function({ dispatch }, jobList) {
    return Promise.all(jobList.map(job => dispatch("removeJob", job)));
  },

  syncTasks: async function({ dispatch, commit }, job) {
    try {
      const ts = await jobService.getTasksByJob(job.id, job.queue_id);
      commit(type.SET_TASK_LIST, ts.data);
    } catch (e) {
      if (e.response.status === HttpStatusCode.UNAUTHORIZED) {
        dispatch("destroySessionInfo", null, { root: true });
        setTimeout(() => {
          location.reload();
        }, 3000);
        throw new Error(e.response.data.message);
      } else {
        throw new Error(
          "Retrieve job " +
            job.id +
            " failed : [ " +
            e.response.data.message +
            " ]"
        );
      }
    }
  },

  syncTaskState: async function({ dispatch }, taskId) {
    let currentTaskId = JSON.parse(storageService.get("current_task")).id;
    if (currentTaskId === undefined) {
      currentTaskId = taskId;
    }
    const currentJob = JSON.parse(storageService.get("current_job"));
    try {
      const response = await jobService.getTasksByJob(
        currentJob.id,
        currentJob.queue_id
      );
      let newTaskState = response.data.filter(task => task.id == currentTaskId);
      dispatch("setCurrentTask", newTaskState[0]);
    } catch (err) {
      if (err.response.data.status === HttpStatusCode.UNAUTHORIZED) {
        dispatch("destroySessionInfo", null, { root: true });
        setTimeout(() => {
          location.reload();
        }, 3000);
        throw new Error(err);
      }
    }
  },

  removeJob: function({ commit }, job) {
    return new Promise((resolve, reject) => {
      jobService
        .removeJob(job.id)
        .then(() => {
          commit(type.REMOVE_JOB_BY_INDEX, job);
          resolve("Job <" + job.id + "> was removed with success.");
        })
        .catch(() => {
          reject("Unable to delete job " + job.label);
        });
    });
  },

  setCurrentJob: function({ commit }, job) {
    storageService.put("current_job", JSON.stringify(job));
    commit(type.SET_CURRENT_JOB, job.id);
  },

  setCurrentTask: function({ commit }, task) {
    storageService.put("current_task", JSON.stringify(task));
    commit(type.SET_CURRENT_TASK, task);
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
