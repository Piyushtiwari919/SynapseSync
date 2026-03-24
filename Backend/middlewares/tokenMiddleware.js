import jwt from "jsonwebtoken";
import cookie from "cookie";

const tokenVerification = (io) => {
  io.use((socket, next) => {
    try {
      // Grab the raw cookie string from the handshake headers
      const cookieString = socket.handshake.headers.cookie;

      if (!cookieString) {
        return next(new Error("Authentication error: No cookies found"));
      }

      // Parse the string into an object
      const cookies = cookie.parse(cookieString);
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Authentication error: Token missing"));
      }

      //console.log(accessToken);

      //Verify the token (This will throw an error if invalid/expired)
      const secret = process.env.JWT_SECRET_KEY;
      const decodedObj = jwt.verify(accessToken, secret);

      //console.log(decodedObj);

      // Attach the userId to the socket
      socket.userId = decodedObj?.userId;

      // Let the user connect
      next();
    } catch (error) {
      // This catches expired tokens, malformed tokens, etc.
      console.error("Socket authentication error:", error.message);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });
};

export default tokenVerification;
