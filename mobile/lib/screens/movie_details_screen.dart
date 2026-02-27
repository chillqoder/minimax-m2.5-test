import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/movie.dart';
import '../providers/movie_providers.dart';
import '../theme/app_theme.dart';

class MovieDetailsScreen extends ConsumerWidget {
  const MovieDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final movie = ref.watch(selectedMovieProvider);

    if (movie == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Фильм не найден')),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context, ref, movie),
          SliverToBoxAdapter(child: _buildContent(context, ref, movie)),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context, WidgetRef ref, Movie movie) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: AppTheme.background,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            movie.backdrop.startsWith('http')
                ? Image.network(
                    movie.backdrop,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: AppTheme.surface,
                        child: const Icon(
                          Icons.movie,
                          size: 80,
                          color: AppTheme.secondaryText,
                        ),
                      );
                    },
                  )
                : Container(
                    color: AppTheme.surface,
                    child: const Icon(
                      Icons.movie,
                      size: 80,
                      color: AppTheme.secondaryText,
                    ),
                  ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    AppTheme.background.withValues(alpha: 0.8),
                    AppTheme.background,
                  ],
                  stops: const [0.0, 0.7, 1.0],
                ),
              ),
            ),
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    movie.title,
                    style: const TextStyle(
                      color: AppTheme.primaryText,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (movie.originalTitle != null &&
                      movie.originalTitle!.isNotEmpty)
                    Text(
                      movie.originalTitle!,
                      style: const TextStyle(
                        color: AppTheme.secondaryText,
                        fontSize: 16,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(
            movie.isFavorite ? Icons.favorite : Icons.favorite_border,
            color: movie.isFavorite ? AppTheme.error : AppTheme.primaryText,
          ),
          onPressed: () async {
            final repository = ref.read(movieRepositoryProvider);
            await repository.toggleFavorite(movie.id);
            final updatedMovie = await repository.getById(movie.id);
            if (updatedMovie != null) {
              ref.read(selectedMovieProvider.notifier).state = updatedMovie;
              ref.invalidate(favoritesProvider);
            }
          },
        ),
      ],
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, Movie movie) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoRow(context, movie),
          const SizedBox(height: 24),
          _buildDescription(context, movie),
          const SizedBox(height: 24),
          _buildDetails(context, movie),
          const SizedBox(height: 24),
          _buildCast(context, movie),
          const SizedBox(height: 24),
          _buildGenres(context, movie),
          const SizedBox(height: 24),
          _buildMoods(context, movie),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, Movie movie) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildInfoItem(
          context,
          Icons.star,
          AppTheme.warning,
          '${movie.rating}',
          'Рейтинг',
        ),
        _buildInfoItem(
          context,
          Icons.calendar_today,
          AppTheme.secondaryText,
          '${movie.year}',
          'Год',
        ),
        _buildInfoItem(
          context,
          Icons.access_time,
          AppTheme.secondaryText,
          movie.formattedDuration,
          'Длит.',
        ),
      ],
    );
  }

  Widget _buildInfoItem(
    BuildContext context,
    IconData icon,
    Color color,
    String value,
    String label,
  ) {
    return Column(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }

  Widget _buildDescription(BuildContext context, Movie movie) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.movieDetails,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        Text(
          movie.description,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: AppTheme.secondaryText,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildDetails(BuildContext context, Movie movie) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildDetailRow(context, AppStrings.director, movie.director),
            const Divider(),
            _buildDetailRow(
              context,
              AppStrings.yearLabel,
              movie.year.toString(),
            ),
            const Divider(),
            _buildDetailRow(
              context,
              AppStrings.durationLabel,
              movie.formattedDuration,
            ),
            const Divider(),
            _buildDetailRow(
              context,
              AppStrings.ratingLabel,
              movie.rating.toStringAsFixed(1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryText),
          ),
          Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildCast(BuildContext context, Movie movie) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(AppStrings.cast, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: movie.cast.map((actor) {
            return Chip(label: Text(actor), backgroundColor: AppTheme.surface);
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildGenres(BuildContext context, Movie movie) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.genresLabel,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: movie.genres.map((genre) {
            return Chip(
              label: Text(genre),
              backgroundColor: AppTheme.accent.withValues(alpha: 0.2),
              labelStyle: const TextStyle(color: AppTheme.accent),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildMoods(BuildContext context, Movie movie) {
    if (movie.moods.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.moodsLabel,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: movie.moods.map((mood) {
            return Chip(
              label: Text(mood),
              backgroundColor: AppTheme.warning.withValues(alpha: 0.2),
              labelStyle: const TextStyle(color: AppTheme.warning),
            );
          }).toList(),
        ),
      ],
    );
  }
}
