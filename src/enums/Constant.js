const AUTHORIZATION_CODE_REQUEST_URL =
  process.env.VUE_APP_OWNCLOUD_SERVER_HOST +
  "/index.php/apps/oauth2/authorize" +
  "?response_type=code&" +
  "client_id=" +
  process.env.VUE_APP_OWNCLOUD_OAUTH_CLIENT_ID +
  "&redirect_uri=" +
  process.env.VUE_APP_OWNCLOUD_OAUTH_REDIRECT_URI;

export default {
  AUTHORIZATION_CODE_REQUEST_URL
};
