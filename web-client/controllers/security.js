const debug = require("debug")("tutorial:security");
const { AuthorizationCode } = require("simple-oauth2");
const axios = require("axios");

const clientId =
  process.env.KEYROCK_CLIENT_ID || "tutorial-dckr-site-0000-xpresswebapp";
const clientSecret =
  process.env.KEYROCK_CLIENT_SECRET || "tutorial-dckr-site-0000-clientsecret";
const keyrockPort = process.env.KEYROCK_PORT || "3005";
const keyrockUrl =
  (process.env.KEYROCK_URL || "http://localhost") + ":" + keyrockPort;
const callbackURL = process.env.CALLBACK_URL || "http://localhost:3000/login";

//----- INITIALIZING THE MODULE -----//

const config = {
  client: {
    id: clientId,
    secret: clientSecret
  },
  auth: {
    tokenHost: keyrockUrl,
    authorizePath: "/oauth2/authorize",
    tokenPath: "/oauth2/token"
  }
};

const clientAuthorizationGrant = new AuthorizationCode(config);

const authorizationUri = clientAuthorizationGrant.authorizeURL({
  redirect_uri: callbackURL,
  state: "xyz"
});

// ----- HELPERS ---- //

// Saves token in session
function saveTokensInSession(req, accessToken) {
  debug("The resulting token: ", { accessToken });
  // containes all the access token (refresh, times) not just the token, used to refresToken.
  accessToken.token.expires_in = 60;
  accessToken.token.expires_at = "2020-09-18T20:41:07.626Z";
  req.session.all_access_token = accessToken || undefined;
  req.session.access_token = accessToken.token.access_token || undefined;
  req.session.refresh_token = accessToken.token.refresh_token || undefined;
}

async function getFromUrl(method, url, queryParameters = {}) {
  const options = {
    method,
    url,
    params: queryParameters
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    debug("getFrom url error", error);
    throw error;
  }
}

async function getUserFromAccessToken(req) {
  debug("getUserFromAccessToken");
  try {
    const userInfo = await getFromUrl("GET", `${keyrockUrl}/user`, {
      access_token: req.session.access_token,
      app_id: clientId
    });
    debug("userInfo", userInfo);
    return userInfo;
  } catch (error) {
    debug("getUserFromAccessToken error");
    console.error(error);
    throw error;
  }
}

// Redirection to Keyrock for an Authorization Code Grant
function authCodeGrant(req, res) {
  debug("authCodeGrant");
  return res.redirect(authorizationUri);
}

// Response from an Authorization Code Grant
async function authCodeGrantCallback(req, res) {
  debug("authCodeGrantCallback");
  // With the authcode grant, a code is included in the response
  // We need to make a second request to obtain an access token of the user
  debug("Auth Code received " + req.query.code);
  const tokenParams = {
    code: req.query.code,
    redirect_uri: callbackURL
  };
  try {
    const accessToken = await clientAuthorizationGrant.getToken(tokenParams);
    saveTokensInSession(req, accessToken);
    const user = await getUserFromAccessToken(req);
    req.session.username = user.username;
    req.flash("success", user.username + " logged");
    res.redirect("/");
  } catch (error) {
    console.error("Access Token Error", error.message);
    req.flash("error", "Access Denied");
    res.redirect("/");
  }
}

// ----- AUTHENTICATION AND AUTHORIZATION ----- //

// Use of Keyrock as a PDP (Policy Decision Point)
// LEVEL 1: AUTHENTICATION ONLY - Any user is authorized, just ensure the user exists.
function authenticate(req, res, next) {
  debug("authenticate");
  // to save the boolean and not the token
  res.locals.authorized = !!req.session.access_token;
  return next();
}

// Use of Keyrock as a PDP (Policy Decision Point)
// LEVEL 2: BASIC AUTHORIZATION - Resources are accessible on a User/Verb/Resource basis
async function authorizeBasicPDP(req, res, next, resource = req.url) {
  debug("authorizeBasicPDP");
  try {
    // Using the access token asks the IDM for the user info
    const user = await getFromUrl("GET", `${keyrockUrl}/user`, {
      access_token: req.session.access_token,
      app_id: clientId,
      action: req.method,
      resource
    });
    res.locals.authorized = user.authorization_decision === "Permit";
    next();
  } catch (error) {
    debug("authorization error");
    console.error(error);
    res.locals.authorized = false;
    next();
  }
}

// ----- LOGOUT ----- //

// Handles logout requests to remove access_token from the session cookie
function logOut(req, res) {
  debug("logOut");
  req.flash("success", req.session.username + " logged out");
  req.session.all_access_token = undefined;
  req.session.access_token = undefined;
  req.session.refresh_token = undefined;
  req.session.username = undefined;
  return res.redirect("/");
}

// ----- REFRESH TOKEN ----- //

async function refreshToken(req, res, next) {
  try {
    let allAccessToken = req.session.all_access_token
      ? clientAuthorizationGrant.createToken(req.session.all_access_token)
      : undefined;
    if (allAccessToken && allAccessToken.expired()) {
      debug("Token expired");
      allAccessToken = await allAccessToken.refresh();
      debug("Token refreshed");
      saveTokensInSession(req, allAccessToken);
    }
    next();
  } catch (error) {
    debug("Error refreshing token");
    console.error(error);
    next();
  }
}

module.exports = {
  authCodeGrant,
  authCodeGrantCallback,
  authenticate,
  authorizeBasicPDP,
  logOut,
  refreshToken
};
