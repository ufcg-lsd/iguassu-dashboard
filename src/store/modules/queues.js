import queueService from "../../services/queues.js";
import HttpStatusCode from "../../enums/HttpStatusCode";
import storageService from "../../services/storage.js";

const state = {
  queues: [],
  currentQueue: JSON.parse(storageService.get("current_queue")) || {}
};

const type = {
  STORE_QUEUES: "STORE_QUEUES",
  STORE_CURRENT_QUEUE: "STORE_CURRENT_QUEUE"
};

const mutations = {
  [type.STORE_QUEUES]: (state, queues) => {
    queues.forEach(queue => {
      let queueSearched = state.queues.filter(e => e.id === queue.id);
      if (queueSearched.length === 0) {
        state.queues.push(queue);
      } else {
        const queueIndex = state.queues.indexOf(queueSearched[0]);
        state.queues[queueIndex] = { ...state.queues[queueIndex], ...queue };
      }
    });
  },

  [type.STORE_CURRENT_QUEUE]: (state, queue) => {
    state.currentQueue = queue;
  }
};

const actions = {
  getQueues: function({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      queueService
        .getQueues()
        .then(response => {
          commit("STORE_QUEUES", response.data);
          resolve(response.data);
        })
        .catch(err => {
          if (err.response.status === HttpStatusCode.UNAUTHORIZED) {
            dispatch("destroySessionInfo", null, { root: true });
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
          reject(err.response);
        });
    });
  },

  createQueue: function(context, payload) {
    return new Promise((resolve, reject) => {
      queueService
        .createQueue(payload.queueName)
        .then(response => {
          if (response.data.id === null) {
            reject("The queue name cannot use accents");
          }
          resolve(response.data.id);
        })
        .catch(err => {
          if (err.response.status === HttpStatusCode.UNAUTHORIZED) {
            context.dispatch("destroySessionInfo", null, { root: true });
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
          reject(
            "An error occur while trying create queue with name " +
              payload.queueName
          );
        });
    });
  },

  storeQueue: async function(ctx, queue) {
    try {
      storageService.put("current_queue", JSON.stringify(queue));
      ctx.commit(type.STORE_CURRENT_QUEUE, queue);
      return queue;
    } catch (e) {
      throw new Error(
        "An error occur while trying store the queue with id " + queue.id
      );
    }
  },

  syncQueue: async function(ctx, payload) {
    try {
      const res = await queueService.getQueues();
      const q = res.data.filter(q => q.id === payload.queueId);

      return q[0];
    } catch (e) {
      throw new Error(
        "An error occur while trying get the queue with id " + payload.queueId
      );
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
