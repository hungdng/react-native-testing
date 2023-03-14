/* eslint-disable react-hooks/exhaustive-deps */
//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Button,
} from 'react-native';
import {ApiService} from '../configs/api';
import {IMAGE_URL_500} from '../constants/constant';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');
const POSTER_IMAGE = 400;
// create a component
const MovieDetailScreen = props => {
  console.log(props?.route.params?.id);
  const movieId = props?.route.params?.id;
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    ApiService.getMovie(movieId).then(res => {
      console.log('res', res.data);
      setMovie(res.data);
    });
  }, []);
  console.log(movie);
  const posterUrl = `${IMAGE_URL_500}/${movie?.poster_path}`;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: posterUrl}}
        style={styles.posterImage}
        imageStyle={styles.posterImageStyle}
      />
      <View style={styles.bg} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieName}>{movie?.title}</Text>
        <Text style={styles.normalInfo}>
          Genres: {movie?.genres?.map(item => item.name).join(', ')}
        </Text>
        <Text style={styles.normalInfo}>
          Release date: {movie?.release_date}
        </Text>
        <Text style={styles.normalInfo}>
          Languages:{' '}
          {movie?.spoken_languages?.map(item => item.name).join(', ')}
        </Text>
        <Text numberOfLines={2} style={styles.normalInfo}>
          Companies:{' '}
          {movie?.production_companies?.map(item => item.name).join(', ')}
        </Text>
      </View>
      <View style={styles.overview}>
        <Text style={styles.overviewTxt}>
          Overview: {movie?.overview || ''}
        </Text>
        <Button title="Trailer" />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  posterImage: {
    width: WIDTH,
    height: POSTER_IMAGE,
    overflow: 'hidden',
  },
  posterImageStyle: {
    resizeMode: 'cover',
    height: 700, // <-- you can adjust this height to play with zoom
  },
  detail: {
    position: 'absolute',
    width: WIDTH,
    minHeight: 500,
    top: HEIGHT / 2.2,
  },
  bg: {
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: POSTER_IMAGE - 180,
    opacity: 0.6,
    backgroundColor: 'black',
  },
  movieInfo: {
    width: '100%',
    top: POSTER_IMAGE - 180,
    padding: 16,
    paddingVertical: 6,
    position: 'absolute',
  },
  movieName: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  normalInfo: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginBottom: 6,
  },
  overview: {
    padding: 16,
  },
  overviewTxt: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 20,
  },
});

//make this component available to the app
export default MovieDetailScreen;
