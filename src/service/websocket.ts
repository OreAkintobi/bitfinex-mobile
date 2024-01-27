import ReconnectingWebSocket, {
  Event,
  CloseEvent,
} from 'reconnecting-websocket';
import { Dispatch } from 'redux';
import { ServiceEvent, handleServiceEvent } from './service-event';
import { OrderBookUpdate, onUpdateOrderBook } from './order-book';

const URL = 'wss://api-pub.bitfinex.com/ws/2';
type Precision = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
const SYMBOL = 'tBTCUSD';

class BitfinexSocket {
  private socket!: ReconnectingWebSocket;
  private url: string;
  private precision: string;
  private static instance: BitfinexSocket;
  private dispatch: Dispatch;

  constructor(url: string, dispatch: Dispatch) {
    this.url = url;
    this.dispatch = dispatch;
    this.precision = 'P0';
  }

  public static getInstance(dispatch: Dispatch): BitfinexSocket {
    if (!BitfinexSocket.instance) {
      BitfinexSocket.instance = new BitfinexSocket(URL, dispatch);
    }

    return BitfinexSocket.instance;
  }

  private subscribeToOrderBook(precision: Precision) {
    const payload = {
      event: 'subscribe',
      channel: 'book',
      symbol: SYMBOL,
      prec: precision,
      len: '25',
    };
    this.socket.send(JSON.stringify(payload));
  }

  private unsubscribeFromOrderBook() {
    if (!this.socket) {
      return;
    }
    const payload = {
      event: 'unsubscribe',
      channel: 'book',
    };
    this.socket.send(JSON.stringify(payload));
  }

  public connect(precision: Precision = 'P0') {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new ReconnectingWebSocket(this.url);

    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.socket.onmessage = this.onMessage;
    this.subscribeToOrderBook(precision);
  }

  public disconnect() {
    if (this.socket?.OPEN) {
      this.socket.close();
    }
  }

  onOpen = (event: Event) => {
    console.log('BITFINEX SOCKET OPENED!', event);
  };

  onClose = (event: CloseEvent) => {
    console.log('BITFINEX SOCKET CLOSED', event);
  };

  onError = (event: Event) => {
    console.error('BITFINEX SOCKET ERROR', event);
  };

  onMessage = (event: MessageEvent) => {
    const data: ServiceEvent | OrderBookUpdate = JSON.parse(event.data);

    if (!Array.isArray(data)) {
      handleServiceEvent(data, this.socket);
    } else {
      onUpdateOrderBook(data, this.dispatch);
    }
  };

  increasePrecision() {
    // @ts-ignore
    const increasePrecisionMap: Record<Precision, Precision> = {
      P4: 'P3',
      P3: 'P2',
      P2: 'P1',
      P1: 'P0',
    };

    const newPrecision = increasePrecisionMap[this.precision as Precision];

    if (newPrecision) {
      this.unsubscribeFromOrderBook();
      this.precision = newPrecision;
      this.connect(newPrecision as Precision);
    }
  }

  decreasePrecision() {
    // @ts-ignore
    const decreasePrecisionMap: Record<Precision, Precision> = {
      P3: 'P4',
      P2: 'P3',
      P1: 'P2',
      P0: 'P1',
    };

    const newPrecision = decreasePrecisionMap[this.precision as Precision];

    if (newPrecision) {
      this.unsubscribeFromOrderBook();
      this.precision = newPrecision;
      this.connect(newPrecision as Precision);
    }
  }

  send(message: any) {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

export { BitfinexSocket };
