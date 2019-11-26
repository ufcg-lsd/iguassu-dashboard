import storageService from "../../services/storage.js";
import authService from "../../services/auth.js";
import HttpStatusCode from "../../enums/HttpStatusCode";
import Messages from "../../enums/Messages";
import AuthState from "../../enums/AuthState.js";
import StorageKey from "../../enums/StorageKey.js";
import Constant from "../../enums/Constant.js";

const state = {
  authState: storageService.get(StorageKey.AUTH_STATE) || AuthState.NOT_STARTED,
  userAlias: storageService.get(StorageKey.USER_ALIAS) || ""
};

const type = {
  CHANGE_AUTH_STATE: "CHANGE_AUTH_STATE",
  SAVE_USER_ALIAS: "SAVE_USER_ALIAS"
};

const mutations = {
  [type.CHANGE_AUTH_STATE]: (state, authState) => {
    state.authState = authState;
  },

  [type.SAVE_USER_ALIAS]: (state, userAlias) => {
    state.userAlias = userAlias;
  }
};

const actions = {
  requestAuthorizationCode: function({ commit }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise(resolve => {
      setTimeout(() => {
        window.location.href = Constant.AUTHORIZATION_CODE_REQUEST_URL;
        storageService.put(StorageKey.AUTH_STATE, AuthState.STARTED);
        commit(type.CHANGE_AUTH_STATE, AuthState.STARTED);
        resolve();
      }, 2000);
    });
  },

  requestAccessToken: function({ commit }, authorizationCode) {
    return new Promise((resolve, reject) => {
      storageService.put(StorageKey.AUTH_STATE, AuthState.PENDING);
      commit(type.CHANGE_AUTH_STATE, AuthState.PENDING);

      authService
        .authenticate(authorizationCode)
        .then(response => {
          const user = response.data;
          const userId = user.id;
          const userCredentials = user.credentials;
          userCredentials[StorageKey.USER_ID] = userId;
          const userAlias = user.alias;

          if (userId && userCredentials && userAlias) {
            const delayTime = 2000;
            setTimeout(() => {
              storageService.put(StorageKey.USER_ALIAS, userAlias);
              storageService.put(
                StorageKey.CREDENTIALS,
                JSON.stringify(userCredentials)
              );
              storageService.put(StorageKey.AUTH_STATE, AuthState.FINISHED);

              commit(type.SAVE_USER_ALIAS, userAlias);
              commit(type.CHANGE_AUTH_STATE, AuthState.FINISHED);
              if (response.status === HttpStatusCode.OK) {
                resolve(Messages.AUTHENTICATION_SUCCESSFUL);
              }
            }, delayTime);
          } else {
            reject(Messages.INTERNAL_SERVER_ERROR);
          }
        })
        .catch(error => {
          storageService.put(StorageKey.AUTH_STATE, AuthState.ERROR);
          commit(type.CHANGE_AUTH_STATE, AuthState.ERROR);
          if (error.response.status === HttpStatusCode.UNAUTHORIZED) {
            reject(Messages.AUTHENTICATION_ERROR);
          } else {
            reject(Messages.AUTHORIZATION_ERROR);
          }
        });
    });
  },

  destroySessionInfo: {
    root: true,
    handler({ commit }) {
      return new Promise(resolve => {
        storageService.put(StorageKey.AUTH_STATE, AuthState.NOT_STARTED);
        commit(type.CHANGE_AUTH_STATE, AuthState.NOT_STARTED);

        storageService.remove(StorageKey.CREDENTIALS);
        storageService.remove(StorageKey.USER_ALIAS);
        storageService.remove("current_job");
        storageService.remove("current_task");
        resolve();
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
