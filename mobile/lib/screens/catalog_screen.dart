import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/movie_providers.dart';
import '../theme/app_theme.dart';
import '../widgets/movie_list_item.dart';

class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  String? _selectedGenre;
  double _minRating = 0;
  int _maxDuration = 300;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchResults = ref.watch(searchResultsProvider);
    final allGenres = ref.watch(allGenresProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.catalog),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterSheet(context, allGenres),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: AppStrings.searchHint,
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(searchQueryProvider.notifier).state = '';
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                ref.read(searchQueryProvider.notifier).state = value;
              },
            ),
          ),
          if (_selectedGenre != null || _minRating > 0 || _maxDuration < 300)
            _buildActiveFilters(context),
          Expanded(
            child: searchResults.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(child: Text('Ошибка: $error')),
              data: (movies) {
                var filteredMovies = movies;

                if (_selectedGenre != null) {
                  filteredMovies = filteredMovies
                      .where(
                        (m) => m.genres.contains(_selectedGenre!.toLowerCase()),
                      )
                      .toList();
                }
                if (_minRating > 0) {
                  filteredMovies = filteredMovies
                      .where((m) => m.rating >= _minRating)
                      .toList();
                }
                if (_maxDuration < 300) {
                  filteredMovies = filteredMovies
                      .where((m) => m.duration <= _maxDuration)
                      .toList();
                }

                if (filteredMovies.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.search_off,
                          size: 64,
                          color: AppTheme.secondaryText,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          AppStrings.noMoviesFound,
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(color: AppTheme.secondaryText),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filteredMovies.length,
                  itemBuilder: (context, index) {
                    return MovieListItem(
                      movie: filteredMovies[index],
                      onTap: () {
                        ref.read(selectedMovieProvider.notifier).state =
                            filteredMovies[index];
                        Navigator.pushNamed(context, '/details');
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveFilters(BuildContext context) {
    return Container(
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          if (_selectedGenre != null)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Chip(
                label: Text(_selectedGenre!),
                deleteIcon: const Icon(Icons.close, size: 16),
                onDeleted: () {
                  setState(() {
                    _selectedGenre = null;
                  });
                },
              ),
            ),
          if (_minRating > 0)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Chip(
                label: Text('Рейтинг: ${_minRating.toStringAsFixed(1)}'),
                deleteIcon: const Icon(Icons.close, size: 16),
                onDeleted: () {
                  setState(() {
                    _minRating = 0;
                  });
                },
              ),
            ),
          if (_maxDuration < 300)
            Chip(
              label: Text('До $_maxDuration мин'),
              deleteIcon: const Icon(Icons.close, size: 16),
              onDeleted: () {
                setState(() {
                  _maxDuration = 300;
                });
              },
            ),
        ],
      ),
    );
  }

  void _showFilterSheet(BuildContext context, List<String> genres) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        AppStrings.filters,
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      TextButton(
                        onPressed: () {
                          setModalState(() {
                            _selectedGenre = null;
                            _minRating = 0;
                            _maxDuration = 300;
                          });
                          setState(() {});
                        },
                        child: const Text('Сбросить'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    AppStrings.genre,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: genres.map((genre) {
                      final isSelected = _selectedGenre == genre;
                      return FilterChip(
                        label: Text(genre),
                        selected: isSelected,
                        onSelected: (selected) {
                          setModalState(() {
                            _selectedGenre = selected ? genre : null;
                          });
                          setState(() {});
                        },
                        selectedColor: AppTheme.accent,
                        labelStyle: TextStyle(
                          color: isSelected
                              ? AppTheme.background
                              : AppTheme.primaryText,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    '${AppStrings.rating}: ${_minRating.toStringAsFixed(1)}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Slider(
                    value: _minRating,
                    min: 0,
                    max: 10,
                    divisions: 20,
                    activeColor: AppTheme.accent,
                    onChanged: (value) {
                      setModalState(() {
                        _minRating = value;
                      });
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '${AppStrings.duration}: до $_maxDuration мин',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Slider(
                    value: _maxDuration.toDouble(),
                    min: 60,
                    max: 300,
                    divisions: 8,
                    activeColor: AppTheme.accent,
                    onChanged: (value) {
                      setModalState(() {
                        _maxDuration = value.toInt();
                      });
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Применить'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
