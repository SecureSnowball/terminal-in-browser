const socket = io();

const term = new Terminal();
term.open(document.getElementById("terminal"));

socket.on("terminal.incomingData", (data) => {
  term.write(data);
});

term.onData((data) => {
  socket.emit("terminal.keystroke", data);
});
