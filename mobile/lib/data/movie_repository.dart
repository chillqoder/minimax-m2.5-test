import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';
import '../models/movie.dart';

class MovieRepository {
  static const String _favoritesBoxName = 'favorites';
  static const String _watchStatusBoxName = 'watch_status';

  List<Movie> _movies = [];
  late Box<bool> _favoritesBox;
  late Box<String> _watchStatusBox;
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    await _loadMovies();
    _favoritesBox = await Hive.openBox<bool>(_favoritesBoxName);
    _watchStatusBox = await Hive.openBox<String>(_watchStatusBoxName);
    _initialized = true;
  }

  Future<void> _loadMovies() async {
    final jsonString = await rootBundle.loadString('assets/movies.json');
    final jsonList = json.decode(jsonString) as List;
    _movies = jsonList.map((json) => Movie.fromJson(json)).toList();
  }

  Future<List<Movie>> loadAll() async {
    return _getMoviesWithUserData(_movies);
  }

  Future<Movie?> getById(String id) async {
    final movie = _movies.firstWhere(
      (m) => m.id == id,
      orElse: () => throw Exception('Movie not found'),
    );
    return _applyUserData(movie);
  }

  Future<List<Movie>> getRandomStack({int count = 20}) async {
    final shuffled = List<Movie>.from(_movies)..shuffle();
    final selected = shuffled.take(count).toList();
    return _getMoviesWithUserData(selected);
  }

  Future<Movie?> getRandomByMood(List<String> moods) async {
    if (moods.isEmpty) {
      return null;
    }

    final filtered = _movies.where((movie) {
      return moods.any((mood) => movie.moods.contains(mood.toLowerCase()));
    }).toList();

    if (filtered.isEmpty) return null;

    filtered.shuffle();
    return _applyUserData(filtered.first);
  }

  Future<List<Movie>> getMoviesByMood(
    List<String> moods, {
    int count = 20,
  }) async {
    if (moods.isEmpty) {
      return [];
    }

    final filtered = _movies.where((movie) {
      return moods.any((mood) => movie.moods.contains(mood.toLowerCase()));
    }).toList();

    filtered.shuffle();
    return _getMoviesWithUserData(filtered.take(count).toList());
  }

  Future<List<Movie>> search(String query) async {
    if (query.isEmpty) {
      return _getMoviesWithUserData(_movies);
    }

    final lowerQuery = query.toLowerCase();
    final filtered = _movies.where((movie) {
      return movie.title.toLowerCase().contains(lowerQuery) ||
          (movie.originalTitle?.toLowerCase().contains(lowerQuery) ?? false) ||
          movie.director.toLowerCase().contains(lowerQuery) ||
          movie.cast.any((c) => c.toLowerCase().contains(lowerQuery)) ||
          movie.tags.any((t) => t.toLowerCase().contains(lowerQuery));
    }).toList();

    return _getMoviesWithUserData(filtered);
  }

  Future<List<Movie>> filterByGenre(String genre) async {
    final filtered = _movies.where((movie) {
      return movie.genres.contains(genre.toLowerCase());
    }).toList();

    return _getMoviesWithUserData(filtered);
  }

  Future<List<Movie>> filterByRating(double minRating) async {
    final filtered = _movies.where((movie) {
      return movie.rating >= minRating;
    }).toList();

    return _getMoviesWithUserData(filtered);
  }

  Future<List<Movie>> filterByDuration(int maxDuration) async {
    final filtered = _movies.where((movie) {
      return movie.duration <= maxDuration;
    }).toList();

    return _getMoviesWithUserData(filtered);
  }

  Future<void> toggleFavorite(String id) async {
    final currentValue = _favoritesBox.get(id, defaultValue: false) ?? false;
    await _favoritesBox.put(id, !currentValue);
  }

  Future<bool> isFavorite(String id) async {
    return _favoritesBox.get(id, defaultValue: false) ?? false;
  }

  Future<List<Movie>> getFavorites() async {
    final favoriteIds = _favoritesBox.keys.toList();
    final favorites = _movies
        .where((movie) => favoriteIds.contains(movie.id))
        .map((movie) => movie.copyWith(isFavorite: true))
        .toList();
    return favorites;
  }

  Future<void> updateWatchStatus(String id, String status) async {
    await _watchStatusBox.put(id, status);
  }

  Future<String?> getWatchStatus(String id) async {
    return _watchStatusBox.get(id);
  }

  List<String> getAllMoods() {
    final moods = <String>{};
    for (final movie in _movies) {
      moods.addAll(movie.moods);
    }
    return moods.toList()..sort();
  }

  List<String> getAllGenres() {
    final genres = <String>{};
    for (final movie in _movies) {
      genres.addAll(movie.genres);
    }
    return genres.toList()..sort();
  }

  Future<List<Movie>> _getMoviesWithUserData(List<Movie> movies) async {
    final result = <Movie>[];
    for (final movie in movies) {
      result.add(await _applyUserData(movie));
    }
    return result;
  }

  Future<Movie> _applyUserData(Movie movie) async {
    final isFav = await isFavorite(movie.id);
    final status = await getWatchStatus(movie.id);
    return movie.copyWith(
      isFavorite: isFav,
      watchStatus: status ?? 'unwatched',
    );
  }
}
