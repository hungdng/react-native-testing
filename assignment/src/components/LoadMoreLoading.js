//import liraries
import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';

// create a component
const LoadMoreLoading = props => {
  const {isLoadMore} = props;
  if (isLoadMore) {
    return (
      <ActivityIndicator color={'green'} size="large" style={styles.loading} />
    );
  }
  return null;
};

// define your styles
const styles = StyleSheet.create({
  loading: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});

//make this component available to the app
export default LoadMoreLoading;
