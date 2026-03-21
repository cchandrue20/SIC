import { io } from 'socket.io-client';

let socket = null;

export const getSocket = (token) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
