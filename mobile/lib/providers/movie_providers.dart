import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/movie_repository.dart';
import '../models/movie.dart';

final movieRepositoryProvider = Provider<MovieRepository>((ref) {
  return MovieRepository();
});

final movieListProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  await repository.init();
  return repository.loadAll();
});

final swipeStackProvider =
    StateNotifierProvider<SwipeStackNotifier, AsyncValue<List<Movie>>>((ref) {
      final repository = ref.watch(movieRepositoryProvider);
      return SwipeStackNotifier(repository);
    });

class SwipeStackNotifier extends StateNotifier<AsyncValue<List<Movie>>> {
  final MovieRepository _repository;
  final List<Movie> _swipedMovies = [];

  SwipeStackNotifier(this._repository) : super(const AsyncValue.loading()) {
    _loadStack();
  }

  Future<void> _loadStack() async {
    state = const AsyncValue.loading();
    try {
      await _repository.init();
      final movies = await _repository.getRandomStack(count: 20);
      state = AsyncValue.data(movies);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> swipeRight(Movie movie) async {
    await _repository.toggleFavorite(movie.id);
    _swipedMovies.add(movie);
    _removeCurrentMovie();
  }

  Future<void> swipeLeft(Movie movie) async {
    _swipedMovies.add(movie);
    _removeCurrentMovie();
  }

  void _removeCurrentMovie() {
    state.whenData((movies) {
      if (movies.isNotEmpty) {
        state = AsyncValue.data(movies.sublist(1));
      }
    });
  }

  Future<void> undo() async {
    if (_swipedMovies.isEmpty) return;

    final lastMovie = _swipedMovies.removeLast();
    state.whenData((movies) {
      final newList = [lastMovie, ...movies];
      state = AsyncValue.data(newList);
    });
  }

  Future<void> reset() async {
    _swipedMovies.clear();
    await _loadStack();
  }

  bool get canUndo => _swipedMovies.isNotEmpty;
}

final favoritesProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  await repository.init();
  return repository.getFavorites();
});

final moodProvider = StateProvider<List<String>>((ref) => []);

final moodMoviesProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  final selectedMoods = ref.watch(moodProvider);
  await repository.init();

  if (selectedMoods.isEmpty) {
    return [];
  }

  return repository.getMoviesByMood(selectedMoods, count: 50);
});

final searchQueryProvider = StateProvider<String>((ref) => '');

final searchResultsProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  final query = ref.watch(searchQueryProvider);
  await repository.init();
  return repository.search(query);
});

final selectedMovieProvider = StateProvider<Movie?>((ref) => null);

final allMoodsProvider = Provider<List<String>>((ref) {
  return [
    'romantic',
    'funny',
    'thrilling',
    'calm',
    'sad',
    'nostalgic',
    'adventurous',
    'intellectual',
    'scifi',
    'horror',
    'tense',
    'dark',
    'inspiring',
    '浪漫',
    '搞笑',
    '惊悚',
    '平静',
    '悲伤',
    '怀旧',
    '冒险',
    '知识',
    '科幻',
    '恐怖',
  ];
});

final allGenresProvider = Provider<List<String>>((ref) {
  return [
    'drama',
    'comedy',
    'thriller',
    'action',
    'horror',
    'sci-fi',
    'romance',
    'animation',
    'documentary',
    'fantasy',
    'detective',
    'biography',
    'history',
    'music',
    'war',
  ];
});
