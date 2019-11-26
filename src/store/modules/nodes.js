import resourceNodesService from "../../services/nodes.js";
import HttpStatusCode from "../../enums/HttpStatusCode";
import storageService from "../../services/storage.js";

const state = {
  nodes: []
};

const type = {
  UPDATE_NODES_STATE: "UPDATE_NODES_STATE"
};

const mutations = {
  [type.UPDATE_NODES_STATE]: (state, nodes) => {
    state.nodes = nodes;
  }
};

const actions = {
  insertNode: function({ dispatch, commit }, address) {
    return new Promise((resolve, reject) => {
      const currentQueue = JSON.parse(storageService.get("current_queue"));
      resourceNodesService
        .insertNode(address, currentQueue.id)
        .then(response => {
          commit("UPDATE_NODES_STATE", response.data);
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

  getNodes: async function({ commit }) {
    try {
      const currentQueue = JSON.parse(storageService.get("current_queue"));
      const res = await resourceNodesService.getNodes(currentQueue.id);
      commit("UPDATE_NODES_STATE", res.data);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
