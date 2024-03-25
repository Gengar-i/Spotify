const BASE_URL = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = "39eb37df0a3b4dea8def726ed604f536";
const REDIRECT_URI = "http://localhost:9400";
const SCOPE = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize");
let tokenObj = {};
const isAuthorized = () => {
  return hasToken();
};
const hasToken = () => {
  return localStorage.getItem("spotify_access_token") !== null;
};
const getToken = async (code: string) => {
  const codeVerifier = localStorage.getItem("code_verifier");
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier || "",
    }),
  };
  fetch(TOKEN_URL, payload)
    .then((data) => {
      if (data) {
      }
      console.log(data);

      return data.json();
    })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        return;
      }
      tokenObj = response;
      localStorage.setItem("spotify_access_token", response.access_token);
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};
const authorize = async () => {
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));

    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };
  const codeVerifier = generateRandomString(64);
  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);

    return window.crypto.subtle.digest("SHA-256", data);
  };
  const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPE,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  localStorage.setItem("code_verifier", codeVerifier);
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};
const getTracks = () => {};
const getAlbums = () => {
  const artistId = "7CJgLPEqiIRuneZSolpawQ";
  const url = `${BASE_URL}/artists/${artistId}/albums`;
  const accessToken = localStorage.getItem("token");

  fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch artist data");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // data.tracks?.items.forEach((track: any) => {
      //   console.log(track.external_urls.spotify, track.name);
      // });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export { getToken, getTracks, getAlbums, authorize, isAuthorized };
