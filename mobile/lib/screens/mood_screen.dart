import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/movie_providers.dart';
import '../theme/app_theme.dart';
import '../widgets/movie_list_item.dart';

class MoodScreen extends ConsumerWidget {
  const MoodScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMoods = ref.watch(moodProvider);
    final allMoods = ref.watch(allMoodsProvider);
    final moodMovies = ref.watch(moodMoviesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.moodTab)),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppStrings.selectMood,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: allMoods.map((mood) {
                    final isSelected = selectedMoods.contains(mood);
                    return FilterChip(
                      label: Text(_getMoodLabel(mood)),
                      selected: isSelected,
                      onSelected: (selected) {
                        final current = ref.read(moodProvider);
                        if (selected) {
                          ref.read(moodProvider.notifier).state = [
                            ...current,
                            mood,
                          ];
                        } else {
                          ref.read(moodProvider.notifier).state = current
                              .where((m) => m != mood)
                              .toList();
                        }
                      },
                      selectedColor: AppTheme.accent,
                      checkmarkColor: AppTheme.background,
                      labelStyle: TextStyle(
                        color: isSelected
                            ? AppTheme.background
                            : AppTheme.primaryText,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: selectedMoods.isEmpty
                        ? null
                        : () {
                            ref.invalidate(moodMoviesProvider);
                          },
                    child: const Text(AppStrings.findMovie),
                  ),
                ),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: selectedMoods.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.mood,
                          size: 64,
                          color: AppTheme.secondaryText,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Выберите настроение',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(color: AppTheme.secondaryText),
                        ),
                      ],
                    ),
                  )
                : moodMovies.when(
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (error, stack) =>
                        Center(child: Text('Ошибка: $error')),
                    data: (movies) {
                      if (movies.isEmpty) {
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.movie_filter,
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
                        itemCount: movies.length,
                        itemBuilder: (context, index) {
                          return MovieListItem(
                            movie: movies[index],
                            onTap: () {
                              ref.read(selectedMovieProvider.notifier).state =
                                  movies[index];
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

  String _getMoodLabel(String mood) {
    final labels = {
      'romantic': 'Романтика',
      'funny': 'Комедия',
      'thrilling': 'Триллер',
      'calm': 'Спокойствие',
      'sad': 'Грусть',
      'nostalgic': 'Ностальгия',
      'adventurous': 'Приключения',
      'intellectual': 'Интеллектуальный',
      'scifi': 'Научная фантастика',
      'horror': 'Ужасы',
      'tense': 'Напряжённый',
      'dark': 'Мрачный',
      'inspiring': 'Вдохновляющий',
    };
    return labels[mood.toLowerCase()] ?? mood;
  }
}
