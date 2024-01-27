import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BitfinexSocket } from '../service/websocket';
import { RootState } from '../store';

export const AskScreen: React.FC = () => {
  const isConnected = useSelector(
    (state: RootState) => state.websocket.isConnected
  );
  const orderBook = useSelector((state: RootState) => state.orderBook);
  const precision = useSelector((state: RootState) => state.precision);
  const dispatch = useDispatch();
  const websocketService = BitfinexSocket.getInstance(dispatch);

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.row}>
        <Text style={styles.columnItem}>{item.count}</Text>
        <Text style={styles.columnItem}>{item.amount.toFixed(4)}</Text>
        <Text style={styles.columnItem}>{item.total.toFixed(4)}</Text>
        <Text style={styles.columnItem}>{item.price.toFixed(precision)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>COUNT</Text>
          <Text style={styles.columnHeader}>AMOUNT</Text>
          <Text style={styles.columnHeader}>TOTAL</Text>
          <Text style={styles.columnHeader}>PRICE</Text>
        </View>
        <FlatList
          data={orderBook.asks}
          renderItem={renderItem}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b262f',
    padding: 20,
  },
  table: {
    flex: 1,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  columnHeader: {
    color: '#fff',
    fontWeight: 'bold',
  },
  columnItem: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});
