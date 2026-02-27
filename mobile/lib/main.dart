import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';
import 'screens/movie_details_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();

  runApp(const ProviderScope(child: MovieSwipeApp()));
}

class MovieSwipeApp extends StatelessWidget {
  const MovieSwipeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const HomeScreen(),
      routes: {'/details': (context) => const MovieDetailsScreen()},
    );
  }
}
