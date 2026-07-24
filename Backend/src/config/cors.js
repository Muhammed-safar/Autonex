const allowedOrigins = [process.env.CLIENT_URL];

const corsOptions = {
  origin(origin, callback) {
    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    console.log("Incoming Origin:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);

    callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;