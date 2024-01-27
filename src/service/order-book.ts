import { Dispatch } from 'redux';
import { OrderBookEntry, updateOrderBook, store } from '../store';

type SnapshotEntry = [number, number, number];

export type OrderBookUpdate =
  | [number, SnapshotEntry[]]
  | [number, SnapshotEntry];

const handleIndividualUpdate = (update: SnapshotEntry) => {
  const [price, count, amount] = update;
  const order = {
    price,
    count,
    amount,
    total: Math.abs(count * amount),
  };

  // Update the order book based on the received update
  store.dispatch((dispatch, getState) => {
    let { bids, asks } = getState().orderBook;

    // Make copies of the arrays
    bids = [...bids];
    asks = [...asks];
    if (amount > 0) {
      const index = bids.findIndex((bid) => bid.price === price);
      if (index !== -1) {
        if (count === 0) {
          bids.splice(index, 1);
        } else {
          bids[index] = order;
        }
      } else if (count !== 0) {
        bids.push(order);
        bids.sort((a, b) => a.price - b.price);
      }
    } else {
      const index = asks.findIndex((ask) => ask.price === price);
      if (index !== -1) {
        if (count === 0) {
          asks.splice(index, 1);
        } else {
          asks[index] = order;
        }
      } else if (count !== 0) {
        asks.push(order);
        asks.sort((a, b) => a.price - b.price);
      }
    }
    dispatch(updateOrderBook({ bids, asks }));
  });
};

export const onUpdateOrderBook = (
  data: OrderBookUpdate,
  dispatch: Dispatch
) => {
  if (Array.isArray(data[1])) {
    if (Array.isArray(data[1][0])) {
      onSnapshot(data[1] as SnapshotEntry[], dispatch);
    } else {
      handleIndividualUpdate(data[1] as unknown as SnapshotEntry);
    }
  }
};

const onSnapshot = (snapshot: SnapshotEntry[], dispatch: Dispatch) => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  snapshot.forEach((entry) => {
    const [price, count, amount] = entry;
    const order = {
      price,
      count,
      amount,
      total: Math.abs(count * amount),
    };
    if (amount > 0) {
      bids.push(order);
    } else {
      asks.push(order);
    }
  });

  // Sort bids descending and asks ascending by price
  bids.sort((a, b) => a.price - b.price);
  asks.sort((a, b) => a.price - b.price);

  // Dispatch updateOrderBook action to update state in Redux
  dispatch(updateOrderBook({ bids, asks }));
};
