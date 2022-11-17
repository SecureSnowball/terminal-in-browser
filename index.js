const http = require("http");
const express = require("express");
const pty = require("node-pty");
const os = require("os");
const { Server } = require("socket.io");
const app = express();

const server = http.createServer(app);
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

app.use(express.static("public"));

// const io = require("socket.io")(http, {
//   cors: { origin: "*" },
// });
const io = new Server(server);

io.on("connection", (socket) => {
  console.log('New connection');
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 120,
    rows: 75,
    cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.on("data", function (data) {
    io.emit("terminal.incomingData", data);
  });

  socket.on("terminal.keystroke", (data) => {
    ptyProcess.write(data);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
