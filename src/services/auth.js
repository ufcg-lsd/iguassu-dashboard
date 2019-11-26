import axios from "axios";

const authEndpoint = "/auth/oauth2";

const AuthService = {
  authenticate(authorizationCode) {
    const authenticationUrl = process.env.VUE_APP_IGUASSU_API + authEndpoint;
    const headers = {
      "X-Auth-App-Identifiers": JSON.stringify({
        client_id: process.env.VUE_APP_OWNCLOUD_OAUTH_CLIENT_ID,
        secret: process.env.VUE_APP_OWNCLOUD_OAUTH_SECRET,
        redirect_uri: process.env.VUE_APP_OWNCLOUD_OAUTH_REDIRECT_URI
      })
    };

    return axios.post(
      authenticationUrl,
      {
        authorization_code: authorizationCode
      },
      {
        headers: headers
      }
    );
  }
};

export default AuthService;
