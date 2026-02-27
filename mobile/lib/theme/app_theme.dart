import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFF111219);
  static const Color surface = Color(0xFF15171A);
  static const Color surfaceLight = Color(0xFF1E2025);
  static const Color primaryText = Color(0xFFE6E7EB);
  static const Color secondaryText = Color(0xFFA6A8AD);
  static const Color accent = Color(0xFF2ECC71);
  static const Color error = Color(0xFFFF6B6B);
  static const Color warning = Color(0xFFF39C12);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      colorScheme: const ColorScheme.dark(
        primary: accent,
        secondary: accent,
        surface: surface,
        error: error,
        onPrimary: primaryText,
        onSecondary: primaryText,
        onSurface: primaryText,
        onError: primaryText,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        foregroundColor: primaryText,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: primaryText,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: accent,
        unselectedItemColor: secondaryText,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accent,
          foregroundColor: background,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryText,
          side: const BorderSide(color: secondaryText),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(foregroundColor: primaryText),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        hintStyle: const TextStyle(color: secondaryText),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: accent, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surface,
        selectedColor: accent,
        labelStyle: const TextStyle(color: primaryText),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: primaryText,
          fontSize: 28,
          fontWeight: FontWeight.bold,
        ),
        headlineMedium: TextStyle(
          color: primaryText,
          fontSize: 24,
          fontWeight: FontWeight.w600,
        ),
        headlineSmall: TextStyle(
          color: primaryText,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        titleLarge: TextStyle(
          color: primaryText,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
        titleMedium: TextStyle(
          color: primaryText,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        titleSmall: TextStyle(
          color: secondaryText,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        bodyLarge: TextStyle(color: primaryText, fontSize: 16),
        bodyMedium: TextStyle(color: primaryText, fontSize: 14),
        bodySmall: TextStyle(color: secondaryText, fontSize: 12),
        labelLarge: TextStyle(
          color: primaryText,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
      dividerTheme: const DividerThemeData(color: surfaceLight, thickness: 1),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: surface,
        contentTextStyle: const TextStyle(color: primaryText),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class AppStrings {
  static const String appName = 'MovieSwipe';

  static const String mainTab = 'Главная';
  static const String moodTab = 'Настроение';
  static const String favoritesTab = 'Избранное';
  static const String profileTab = 'Профиль';

  static const String swipeRightToLike = 'Свайп вправо — нравится';
  static const String swipeLeftToSkip = 'Свайп влево — пропустить';
  static const String tapToSeeDetails = 'Нажмите для подробностей';

  static const String selectMood = 'Выберите настроение';
  static const String findMovie = 'Найти фильм';
  static const String noMoviesFound = 'Фильмы не найдены';
  static const String noFavorites = 'Нет избранных фильмов';
  static const String addToFavorites = 'Добавить в избранное';
  static const String removeFromFavorites = 'Удалить из избранного';

  static const String search = 'Поиск';
  static const String searchHint = 'Поиск по названию, актёрам, режиссёру...';
  static const String filters = 'Фильтры';
  static const String genre = 'Жанр';
  static const String rating = 'Рейтинг';
  static const String duration = 'Длительность';

  static const String movieDetails = 'О фильме';
  static const String director = 'Режиссёр';
  static const String cast = 'В ролях';
  static const String durationLabel = 'Длительность';
  static const String ratingLabel = 'Рейтинг';
  static const String yearLabel = 'Год';
  static const String genresLabel = 'Жанры';
  static const String moodsLabel = 'Настроение';

  static const String undo = 'Отменить';
  static const String like = 'Нравится';
  static const String dislike = 'Не нравится';
  static const String settings = 'Настройки';
  static const String language = 'Язык';
  static const String theme = 'Тема';
  static const String darkTheme = 'Тёмная';
  static const String lightTheme = 'Светлая';

  static const String catalog = 'Каталог';
  static const String allMovies = 'Все фильмы';

  static const String resetSwipes = 'Начать заново';
  static const String noMoreMovies = 'Фильмы закончились';
  static const String loadMore = 'Загрузить ещё';
}
