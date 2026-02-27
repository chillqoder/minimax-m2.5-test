import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'swipe_screen.dart';
import 'mood_screen.dart';
import 'favorites_screen.dart';
import 'profile_screen.dart';
import 'catalog_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    SwipeScreen(),
    MoodScreen(),
    FavoritesScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.swipe),
            label: AppStrings.mainTab,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.mood),
            label: AppStrings.moodTab,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: AppStrings.favoritesTab,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: AppStrings.profileTab,
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CatalogScreen(),
                  ),
                );
              },
              backgroundColor: AppTheme.accent,
              child: const Icon(Icons.search, color: AppTheme.background),
            )
          : null,
    );
  }
}
