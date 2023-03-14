/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
//import liraries
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
  LayoutAnimation,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SCREEN_NAME} from '../constants/screens';
import {
  ApiService,
  DEFAULT_MOVIES_PARAMS,
  DEFAULT_SEARCH_PARAMS,
} from '../configs/api';
import LoadMoreLoading from '../components/LoadMoreLoading';
import {IMAGE_URL, PAGE_SIZE} from '../constants/constant';
import FastImage from 'react-native-fast-image';
import {useDebouncedEffect} from '../utils/useDebouncedEffect';
import AsyncStorage from '@react-native-async-storage/async-storage';
const searchIcon = require('../../assets/icons/search.png');
const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');
// create a component
const DashboardScreen = props => {
  const {navigation} = props;
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const offset = useRef(1);

  const getMovies = () => {
    if (query.trim().length > 0) {
      const params = DEFAULT_SEARCH_PARAMS;
      params.query = query;
      params.page = offset.current;
      ApiService.searchMovies(params).then(res => {
        const moviesResponse = res?.data?.results || [];
        setIsLoadMore(false);
        setCanLoadMore(moviesResponse.length === PAGE_SIZE);
        if (offset.current === 1) {
          setMovies(moviesResponse);
        } else {
          setMovies([...movies, ...moviesResponse]);
        }
      });
    } else {
      const params = DEFAULT_MOVIES_PARAMS;
      params.query = query;
      params.page = offset.current;
      ApiService.getMovies(params).then(res => {
        const moviesResponse = res?.data?.results || [];
        setIsLoadMore(false);
        setCanLoadMore(moviesResponse.length === PAGE_SIZE);
        if (offset.current === 1) {
          setMovies(moviesResponse);
        } else {
          setMovies([...movies, ...moviesResponse]);
        }
        setRefreshing(false);
      });
    }
  };

  const onRefresh = () => {
    offset.current = 1;
    getMovies();
  };

  const onLoadMore = () => {
    offset.current = offset.current + 1;
    getMovies();
  };

  const getKeywords = async () => {
    const keywordsStorage = await AsyncStorage.getItem('keywords');
    const keywords = JSON.parse(keywordsStorage);
    if (keywords?.length) {
      setKeywords(keywords || []);
    }
  };

  useEffect(() => {
    getKeywords();
    getMovies();
  }, []);

  useDebouncedEffect(
    () => {
      if (query.length > 0) {
        const idx = keywords.findIndex(
          item => item.toLocaleLowerCase() === query.toLocaleLowerCase(),
        );
        if (idx === -1) {
          const keywordHistoryUpdate = [query, ...keywords];
          setKeywords(keywordHistoryUpdate);
          AsyncStorage.setItem(
            'keywords',
            JSON.stringify(keywordHistoryUpdate),
          );
        }
      }
      offset.current = 1;
      getMovies();
    },
    [query],
    1000,
  );
  const renderItem = props => {
    const {item} = props;
    const {poster_path, id} = item;
    const posterUrl = `${IMAGE_URL}/${poster_path}`;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(SCREEN_NAME.movieDetail, {id: id})}
        style={styles.movieItem}>
        <FastImage
          key={posterUrl}
          resizeMode="contain"
          source={{uri: posterUrl}}
          style={styles.moviePoster}
        />
      </TouchableOpacity>
    );
  };

  const removeKeyword = index => {
    const keywordsUpdate = JSON.parse(JSON.stringify(keywords));
    keywordsUpdate.splice(index, 1);
    setKeywords(keywordsUpdate);
    AsyncStorage.setItem('keywords', JSON.stringify(keywordsUpdate));
    // after removing the item, we start animation
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Data</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputSearchContainer}>
        <FastImage
          tintColor={'white'}
          style={styles.searchIcon}
          source={searchIcon}
        />
        <TextInput
          placeholderTextColor={'white'}
          style={styles.inputSearch}
          placeholder="Search movies.."
          value={query}
          onChangeText={text => setQuery(text)}
        />
      </View>
      {keywords?.length > 0 && (
        <Text style={styles.keywordTitle}>Keywords:</Text>
      )}

      {keywords?.map((item, index) => {
        if (index > 4) {
          return null;
        }
        return (
          <TouchableOpacity
            onPress={() => setQuery(item)}
            key={item}
            style={styles.keywordItem}>
            <Text style={styles.keywordHistory}>{item}</Text>
            <Text onPress={() => removeKeyword(index)} style={styles.removeBtn}>
              Remove
            </Text>
          </TouchableOpacity>
        );
      })}
      <FlatList
        data={movies}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        onEndReached={() => {
          if (!canLoadMore) {
            return;
          }
          setIsLoadMore(true);
          if (!isLoadMore) {
            onLoadMore && onLoadMore();
          }
        }}
        ListFooterComponent={<LoadMoreLoading isLoadMore={isLoadMore} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={3}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  emptyContainer: {
    height: HEIGHT,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptyText: {
    fontSize: 18,
    color: 'white',
    marginTop: HEIGHT / 4,
  },
  flatList: {
    paddingTop: 0,
    paddingHorizontal: 12,
  },
  movieItem: {
    width: (WIDTH - 24) / 3,
    height: (WIDTH - 24) / 3 / 0.666,
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
  },
  inputSearchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 36,
    height: 36,
  },
  inputSearch: {
    color: 'white',
    fontSize: 24,
    flex: 1,
  },
  keywordTitle: {
    fontSize: 18,
    color: 'white',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  keywordItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  keywordHistory: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  removeBtn: {
    color: 'white',
    fontSize: 14,
  },
});

//make this component available to the app
export default DashboardScreen;
