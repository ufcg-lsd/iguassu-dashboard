import axios from "axios";
import Util from "./utils";

const BASE_URL = process.env.VUE_APP_IGUASSU_API;
const DEFAULT_NUMBER_OF_WORKERS = 5;

const NodeService = {
  async insertNode(address, queueId) {
    const url = `${BASE_URL}/queues/${queueId}/nodes`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const response = await axios.get(nonceEndpoint);
    const credentials = Util.genCredentials(response.data);

    const data = {
      resource_address: address,
      pool_size: DEFAULT_NUMBER_OF_WORKERS
    };

    return axios.post(url, data, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials)
      }
    });
  },

  async getNodes(queueId) {
    const url = `${BASE_URL}/queues/${queueId}/nodes`;
    const nonceEndpoint = `${BASE_URL}/nonce`;
    const response = await axios.get(nonceEndpoint);
    const credentials = Util.genCredentials(response.data);

    return axios.get(url, {
      headers: {
        "X-Auth-User-Credentials": JSON.stringify(credentials)
      }
    });
  }
};

export default NodeService;
