import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/movie.dart';
import '../providers/movie_providers.dart';
import '../theme/app_theme.dart';
import '../widgets/movie_card.dart';

class SwipeScreen extends ConsumerWidget {
  const SwipeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final swipeStack = ref.watch(swipeStackProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.mainTab),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(swipeStackProvider.notifier).reset();
            },
          ),
        ],
      ),
      body: swipeStack.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppTheme.error),
              const SizedBox(height: 16),
              Text('Ошибка: $error'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.read(swipeStackProvider.notifier).reset();
                },
                child: const Text('Повторить'),
              ),
            ],
          ),
        ),
        data: (movies) {
          if (movies.isEmpty) {
            return _buildEmptyState(context, ref);
          }
          return _buildSwipeStack(context, ref, movies);
        },
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.movie_filter,
            size: 80,
            color: AppTheme.secondaryText,
          ),
          const SizedBox(height: 24),
          Text(
            AppStrings.noMoreMovies,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              ref.read(swipeStackProvider.notifier).reset();
            },
            icon: const Icon(Icons.refresh),
            label: const Text(AppStrings.resetSwipes),
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeStack(
    BuildContext context,
    WidgetRef ref,
    List<Movie> movies,
  ) {
    final displayMovies = movies.take(3).toList();

    return Column(
      children: [
        Expanded(
          child: Stack(
            alignment: Alignment.center,
            children: [
              for (int i = displayMovies.length - 1; i >= 0; i--)
                MovieCard(
                  movie: displayMovies[i],
                  isTop: i == 0,
                  onSwipeRight: () {
                    ref
                        .read(swipeStackProvider.notifier)
                        .swipeRight(displayMovies[i]);
                  },
                  onSwipeLeft: () {
                    ref
                        .read(swipeStackProvider.notifier)
                        .swipeLeft(displayMovies[i]);
                  },
                  onTap: () {
                    ref.read(selectedMovieProvider.notifier).state =
                        displayMovies[i];
                    Navigator.pushNamed(context, '/details');
                  },
                ),
            ],
          ),
        ),
        _buildControls(context, ref, movies.isNotEmpty ? movies.first : null),
      ],
    );
  }

  Widget _buildControls(
    BuildContext context,
    WidgetRef ref,
    Movie? currentMovie,
  ) {
    final canUndo = ref.watch(swipeStackProvider.notifier).canUndo;

    return Container(
      padding: const EdgeInsets.all(24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildControlButton(
            icon: Icons.undo,
            color: AppTheme.warning,
            onPressed: canUndo
                ? () {
                    ref.read(swipeStackProvider.notifier).undo();
                  }
                : null,
          ),
          _buildControlButton(
            icon: Icons.close,
            color: AppTheme.error,
            size: 56,
            onPressed: currentMovie != null
                ? () {
                    ref
                        .read(swipeStackProvider.notifier)
                        .swipeLeft(currentMovie);
                  }
                : null,
          ),
          _buildControlButton(
            icon: Icons.favorite,
            color: AppTheme.accent,
            size: 56,
            onPressed: currentMovie != null
                ? () {
                    ref
                        .read(swipeStackProvider.notifier)
                        .swipeRight(currentMovie);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          '${currentMovie.title} добавлен в избранное',
                        ),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  }
                : null,
          ),
          _buildControlButton(
            icon: Icons.info_outline,
            color: AppTheme.secondaryText,
            onPressed: currentMovie != null
                ? () {
                    ref.read(selectedMovieProvider.notifier).state =
                        currentMovie;
                    Navigator.pushNamed(context, '/details');
                  }
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required Color color,
    required VoidCallback? onPressed,
    double size = 48,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(size / 2),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: onPressed != null
                ? color.withValues(alpha: 0.2)
                : AppTheme.surface,
            border: Border.all(
              color: onPressed != null
                  ? color
                  : AppTheme.secondaryText.withValues(alpha: 0.3),
              width: 2,
            ),
          ),
          child: Icon(
            icon,
            color: onPressed != null
                ? color
                : AppTheme.secondaryText.withValues(alpha: 0.3),
            size: size * 0.5,
          ),
        ),
      ),
    );
  }
}
