import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/movie_providers.dart';
import '../theme/app_theme.dart';
import '../widgets/movie_list_item.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favorites = ref.watch(favoritesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.favoritesTab)),
      body: favorites.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Ошибка: $error')),
        data: (movies) {
          if (movies.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.favorite_border,
                    size: 80,
                    color: AppTheme.secondaryText,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    AppStrings.noFavorites,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: AppTheme.secondaryText,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Добавьте фильмы в избранное',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.secondaryText,
                    ),
                  ),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: movies.length,
            itemBuilder: (context, index) {
              return MovieListItem(
                movie: movies[index],
                onTap: () {
                  ref.read(selectedMovieProvider.notifier).state =
                      movies[index];
                  Navigator.pushNamed(context, '/details');
                },
                onFavoriteToggle: () async {
                  final repository = ref.read(movieRepositoryProvider);
                  await repository.toggleFavorite(movies[index].id);
                  ref.invalidate(favoritesProvider);
                },
              );
            },
          );
        },
      ),
    );
  }
}
