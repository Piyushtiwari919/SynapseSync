import axios from "axios";

// Create the instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// State variables to prevent infinite loops and handle concurrent requests
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue of paused requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []; // Clear the queue once processed
};

api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // If the 401 came from the /login route or the /refresh route, DO NOT intercept it!
    // Just pass the error straight back to the component so it can show a "Wrong Password" message.
    if (
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/logout")
    ) {
      return Promise.reject(error);
    }

    // Check if the error is 401 and we haven't already retried this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is ALREADY happening, push this request into the queue and wait
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest); // Retry the request once resolved
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark this request so we don't get stuck in an infinite loop
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Because of withCredentials: true, the browser automatically sends the 7-day Refresh Token cookie!
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        // If successful, your backend just set a brand new Access Token cookie.
        isRefreshing = false;

        // Resolve all the paused requests in the queue
        processQueue(null);

        // Finally, retry the original request that failed
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token itself is expired or invalid, the refresh fails.
        processQueue(refreshError, null);
        isRefreshing = false;

        //Only redirect if they ARE NOT already on the login page, register page or at the "/" url
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (400, 404, 500, etc.), just return the error normally
    return Promise.reject(error);
  },
);

export default api;
