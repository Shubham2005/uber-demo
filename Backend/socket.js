const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      console.log("👋 JOIN EVENT RECEIVED:", data);

      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      console.log("📍 Received location update data:", data);

      const { userId, location } = data;

      // 1. Check for BOTH 'lat' or 'ltd' to prevent crashes
      const latitude = location.lat || location.ltd;
      const longitude = location.lng;

      if (!location || !latitude || !longitude) {
        console.log(
          "❌ Validation failed! Location data is missing or incorrect.",
        );
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        const updatedCaptain = await captainModel.findByIdAndUpdate(
          userId,
          {
            location: {
              type: "Point",
              // 2. Pass the extracted variables to MongoDB
              coordinates: [longitude, latitude],
            },
          },
          { new: true },
        );

        if (!updatedCaptain) {
          console.log("❌ Captain not found in database with ID:", userId);
        } else {
          console.log("✅ Captain location updated successfully in DB!");
        }
      } catch (err) {
        console.log("❌ Database update crashed:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
