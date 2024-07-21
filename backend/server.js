import { uniqueNamesGenerator, colors, names } from "unique-names-generator";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const chatHistory = [];

// Listen for new web socket connections
io.on("connection", (socket) => {
  const username = getUniqueUsername();
  console.log(`${username} connected`);

  socket.emit("receive-message", {
    chatHistory: getAllMessages(),
    username,
  });

  // Listen for new messages from the client
  socket.on("post-message", (data) => {
    const { message } = data || { message: "" };
    console.log("Received message:", message);
    chatHistory.push({ username, message });

    // Send the updated chat history to all clients
    io.emit("receive-message", {
      chatHistory: getAllMessages(),
    });
  });

  // Listen for disconnects and log them
  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});

// HTTP server setup to serve the page assets
app.use(express.static(process.cwd() + "/frontend"));

// HTTP server setup to serve the page at / route
app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

// Start the HTTP server to serve the page
server.listen(3000, () => {
  console.log("listening on port 3000");
});

// Helper functions
function getAllMessages() {
  return Array.from(chatHistory).reverse();
}

function getUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });
}
