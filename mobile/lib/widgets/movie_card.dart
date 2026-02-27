import 'package:flutter/material.dart';
import '../models/movie.dart';
import '../theme/app_theme.dart';

class MovieCard extends StatefulWidget {
  final Movie movie;
  final bool isTop;
  final VoidCallback onSwipeRight;
  final VoidCallback onSwipeLeft;
  final VoidCallback onTap;

  const MovieCard({
    super.key,
    required this.movie,
    required this.isTop,
    required this.onSwipeRight,
    required this.onSwipeLeft,
    required this.onTap,
  });

  @override
  State<MovieCard> createState() => _MovieCardState();
}

class _MovieCardState extends State<MovieCard>
    with SingleTickerProviderStateMixin {
  double _dragX = 0;
  double _dragY = 0;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onPanStart(DragStartDetails details) {
    if (!widget.isTop) return;
    _animationController.forward();
  }

  void _onPanUpdate(DragUpdateDetails details) {
    if (!widget.isTop) return;
    setState(() {
      _dragX += details.delta.dx;
      _dragY += details.delta.dy;
    });
  }

  void _onPanEnd(DragEndDetails details) {
    if (!widget.isTop) return;
    _animationController.reverse();

    final screenWidth = MediaQuery.of(context).size.width;
    final threshold = screenWidth * 0.3;

    if (_dragX > threshold) {
      widget.onSwipeRight();
    } else if (_dragX < -threshold) {
      widget.onSwipeLeft();
    }

    setState(() {
      _dragX = 0;
      _dragY = 0;
    });
  }

  Color? _getOverlayColor() {
    if (_dragX > 50) {
      return AppTheme.accent.withValues(alpha: (_dragX / 200).clamp(0, 0.5));
    } else if (_dragX < -50) {
      return AppTheme.error.withValues(alpha: (-_dragX / 200).clamp(0, 0.5));
    }
    return null;
  }

  IconData? _getOverlayIcon() {
    if (_dragX > 50) {
      return Icons.favorite;
    } else if (_dragX < -50) {
      return Icons.close;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isTop) {
      return Transform.scale(scale: 0.95, child: _buildCard(context));
    }

    return GestureDetector(
      onPanStart: _onPanStart,
      onPanUpdate: _onPanUpdate,
      onPanEnd: _onPanEnd,
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(_dragX, _dragY),
            child: Transform.rotate(
              angle: _dragX / 1000,
              child: _buildCard(context),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCard(BuildContext context) {
    final overlayColor = _getOverlayColor();
    final overlayIcon = _getOverlayIcon();

    return Container(
      width: MediaQuery.of(context).size.width * 0.85,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Container(
              color: AppTheme.surface,
              child: widget.movie.poster.startsWith('http')
                  ? Image.network(
                      widget.movie.poster,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildPlaceholder();
                      },
                    )
                  : _buildPlaceholder(),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.8),
                  ],
                  stops: const [0.5, 1.0],
                ),
              ),
            ),
            if (overlayColor != null) Container(color: overlayColor),
            if (overlayIcon != null)
              Positioned(
                top: 40,
                right: 40,
                child: Icon(
                  overlayIcon,
                  size: 80,
                  color: _dragX > 50 ? AppTheme.accent : AppTheme.error,
                ),
              ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      widget.movie.title,
                      style: const TextStyle(
                        color: AppTheme.primaryText,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (widget.movie.originalTitle != null &&
                        widget.movie.originalTitle!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          widget.movie.originalTitle!,
                          style: const TextStyle(
                            color: AppTheme.secondaryText,
                            fontSize: 14,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _buildInfoChip(
                          Icons.star,
                          widget.movie.rating.toStringAsFixed(1),
                          AppTheme.warning,
                        ),
                        const SizedBox(width: 12),
                        _buildInfoChip(
                          Icons.access_time,
                          widget.movie.formattedDuration,
                          AppTheme.secondaryText,
                        ),
                        const SizedBox(width: 12),
                        _buildInfoChip(
                          Icons.calendar_today,
                          widget.movie.year.toString(),
                          AppTheme.secondaryText,
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      widget.movie.description,
                      style: const TextStyle(
                        color: AppTheme.secondaryText,
                        fontSize: 14,
                      ),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              top: 16,
              right: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.surface.withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star, color: AppTheme.warning, size: 18),
                    const SizedBox(width: 4),
                    Text(
                      widget.movie.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        color: AppTheme.primaryText,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppTheme.surface,
      child: const Center(
        child: Icon(Icons.movie, size: 80, color: AppTheme.secondaryText),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: color,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
