# React Native Test

## Description

The task is to create a sample application, that allows the user to search for movies, and view the movie details, with the following open source API examples:

**Search API:** `https://api.themoviedb.org/3/search/movie?page=1&api_key=<api_key>&query=<query>`

**Movie details:** `https://api.themoviedb.org/3/movie/<movie_id>?api_key=<api_key>`

Information about the API can be found at [The Movie Database API Documentation](https://developers.themoviedb.org/3/getting-started/introduction).

_**NOTE: An API key will be provided to you separately.**_

## Requirements

### Main / Search Screen:

- Have a text input for user to input movie name for searching
- Search button (press search to start searching)
- Section to show last 5 searches keyword (able to remove with fade out animation)
- Section to show result list (below recent searches), tap item on list to navigate to detail screen
- Scroll to load more data
- Pull to refresh (load only 1st page with current keyword)

### Detail screen:

- Load detail data of Movie
- If there are multiple media results, they should display by tapping to open a popup
- If there are related movies in the details results, user should be able to tap to open the details for that movie
