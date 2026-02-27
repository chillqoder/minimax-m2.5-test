import 'package:flutter/material.dart';
import '../models/movie.dart';
import '../theme/app_theme.dart';

class MovieListItem extends StatelessWidget {
  final Movie movie;
  final VoidCallback onTap;
  final VoidCallback? onFavoriteToggle;

  const MovieListItem({
    super.key,
    required this.movie,
    required this.onTap,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: SizedBox(
                  width: 80,
                  height: 120,
                  child: movie.poster.startsWith('http')
                      ? Image.network(
                          movie.poster,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return _buildPlaceholder();
                          },
                        )
                      : _buildPlaceholder(),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      movie.title,
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      movie.originalTitle ?? '',
                      style: Theme.of(context).textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(
                          Icons.star,
                          size: 16,
                          color: AppTheme.warning,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          movie.rating.toStringAsFixed(1),
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(color: AppTheme.warning),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          movie.year.toString(),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          movie.formattedDuration,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 4,
                      runSpacing: 4,
                      children: movie.genres.take(3).map((genre) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            genre,
                            style: Theme.of(
                              context,
                            ).textTheme.bodySmall?.copyWith(fontSize: 10),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              if (onFavoriteToggle != null)
                IconButton(
                  icon: Icon(
                    movie.isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: movie.isFavorite
                        ? AppTheme.error
                        : AppTheme.secondaryText,
                  ),
                  onPressed: onFavoriteToggle,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppTheme.surfaceLight,
      child: const Center(
        child: Icon(Icons.movie, color: AppTheme.secondaryText),
      ),
    );
  }
}
