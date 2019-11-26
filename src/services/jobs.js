import axios from "axios";
import Util from "./utils.js";

const BASE_URL = process.env.VUE_APP_IGUASSU_API;

const JobService = {
  submitJDFList: async (jdfList, queueId) => {
    let queue = queueId === "" ? "default" : queueId;

    const promises = jdfList.map(async jdf => {
      const jobEndpoint = `${BASE_URL}/queues/${queue}/jobs`;
      const nonceEndpoint = `${BASE_URL}/nonce`;
      const response = await axios.get(nonceEndpoint);
      const credentials = Util.genCredentials(response.data);
      const form = new FormData();
      form.append("jdffilepath", jdf);

      return axios.post(jobEndpoint, form, {
        headers: {
          "X-Auth-User-Credentials": JSON.stringify(credentials),
          "Content-Type": undefined,
          Accept: "application/json"
        }
      });
    });

    return Promise.all(promises);
  },

  async getTasksByJob(jobId, queueId) {
    const endPoint = `${BASE_URL}/queues/${queueId}/jobs/${jobId}/tasks`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const nonce = await axios.get(nonceEndpoint).then(res => res.data);
    const credentials = Util.genCredentials(nonce);

    return axios.get(endPoint, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials),
        Accept: "application/json"
      }
    });
  },

  async getJobById(jobId, queueId) {
    const endPoint = `${BASE_URL}/queues/${queueId}/jobs/${jobId}`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const nonce = await axios.get(nonceEndpoint).then(res => res.data);
    const credentials = Util.genCredentials(nonce);

    return axios.get(endPoint, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials),
        Accept: "application/json"
      }
    });
  },

  async removeJob(jobId, queueId) {
    const endPoint = `${BASE_URL}/queues/${queueId}/jobs/${jobId}`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const nonce = await axios.get(nonceEndpoint).then(res => res.data);
    const credentials = Util.genCredentials(nonce);

    return axios.delete(endPoint, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials),
        Accept: "application/json"
      }
    });
  }
};

export default JobService;
