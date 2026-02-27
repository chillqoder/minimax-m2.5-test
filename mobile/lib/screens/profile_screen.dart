import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.profileTab)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildProfileHeader(context),
          const SizedBox(height: 32),
          _buildSettingsSection(context),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppTheme.surface,
            border: Border.all(color: AppTheme.accent, width: 3),
          ),
          child: const Icon(Icons.person, size: 50, color: AppTheme.accent),
        ),
        const SizedBox(height: 16),
        Text('Киноман', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(
          'Любитель качественного кино',
          style: Theme.of(
            context,
          ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryText),
        ),
      ],
    );
  }

  Widget _buildSettingsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.settings,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Card(
          child: Column(
            children: [
              _buildSettingsTile(
                context,
                icon: Icons.language,
                title: AppStrings.language,
                subtitle: 'Русский',
                onTap: () {},
              ),
              const Divider(height: 1),
              _buildSettingsTile(
                context,
                icon: Icons.palette,
                title: AppStrings.theme,
                subtitle: AppStrings.darkTheme,
                onTap: () {},
              ),
              const Divider(height: 1),
              _buildSettingsTile(
                context,
                icon: Icons.info_outline,
                title: 'О приложении',
                subtitle: 'Версия 1.0.0',
                onTap: () {
                  showAboutDialog(
                    context: context,
                    applicationName: 'MovieSwipe',
                    applicationVersion: '1.0.0',
                    applicationIcon: const Icon(
                      Icons.movie_filter,
                      size: 48,
                      color: AppTheme.accent,
                    ),
                    children: [
                      const Text(
                        'Приложение для быстрого выбора фильма на основе настроения.',
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.help_outline, color: AppTheme.accent),
                    const SizedBox(width: 12),
                    Text(
                      'Как использовать',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildHelpItem(
                  context,
                  Icons.swipe_right,
                  'Свайп вправо',
                  'Добавить фильм в избранное',
                ),
                const SizedBox(height: 12),
                _buildHelpItem(
                  context,
                  Icons.swipe_left,
                  'Свайп влево',
                  'Пропустить фильм',
                ),
                const SizedBox(height: 12),
                _buildHelpItem(
                  context,
                  Icons.touch_app,
                  'Нажатие',
                  'Посмотреть подробности о фильме',
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.accent),
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: AppTheme.secondaryText),
      ),
      trailing: const Icon(Icons.chevron_right, color: AppTheme.secondaryText),
      onTap: onTap,
    );
  }

  Widget _buildHelpItem(
    BuildContext context,
    IconData icon,
    String title,
    String description,
  ) {
    return Row(
      children: [
        Icon(icon, size: 24, color: AppTheme.secondaryText),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
              ),
              Text(description, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ],
    );
  }
}
