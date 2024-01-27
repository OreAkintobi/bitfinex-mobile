import ReconnectingWebSocket from 'reconnecting-websocket';

export interface ServiceEvent {
  event: string;
  code: number;
}

export const handleServiceEvent = (
  data: ServiceEvent,
  socket: ReconnectingWebSocket
) => {
  // handle Bitfinex service events
  if (data.event === 'info' && data.code === 20051) {
    // Bitfinex API sends this event code when it will restart soon, so we should reconnect.
    socket.close();
  } else if (data.event === 'info' && data.code === 20060) {
    // Bitfinex API sends this event code when it is in maintenance mode, so we should wait and then reconnect.
    setTimeout(() => {
      socket.close();
    }, 5000); // Wait 5 seconds before reconnecting
  }
};
