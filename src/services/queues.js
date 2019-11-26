import axios from "axios";
import Util from "./utils";

const BASE_URL = process.env.VUE_APP_IGUASSU_API;

const QueueService = {
  async getQueues() {
    const endPoint = `${BASE_URL}/queues`;
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

  async getQueue(queueId) {
    const endPoint = `${BASE_URL}/queues/${queueId}`;
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

  async getJobsByQueue(queueId) {
    const endPoint = `${BASE_URL}/queues/${queueId}/jobs`;
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

  async createQueue(queueName) {
    const queueEndpoint = `${BASE_URL}/queues`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const response = await axios.get(nonceEndpoint);
    const credentials = Util.genCredentials(response.data);
    const data = { name: queueName };

    return axios.post(queueEndpoint, data, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials)
      }
    });
  }
};

export default QueueService;
