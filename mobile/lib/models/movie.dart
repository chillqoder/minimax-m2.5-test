class Movie {
  final String id;
  final String title;
  final String? originalTitle;
  final int year;
  final String description;
  final List<String> genres;
  final List<String> moods;
  final double rating;
  final int duration;
  final String director;
  final List<String> cast;
  final String poster;
  final String backdrop;
  final String language;
  final List<String> tags;
  final String watchStatus;
  final bool isFavorite;
  final int? tmdbId;
  final DateTime createdAt;

  Movie({
    required this.id,
    required this.title,
    this.originalTitle,
    required this.year,
    required this.description,
    required this.genres,
    required this.moods,
    required this.rating,
    required this.duration,
    required this.director,
    required this.cast,
    required this.poster,
    required this.backdrop,
    required this.language,
    required this.tags,
    required this.watchStatus,
    required this.isFavorite,
    this.tmdbId,
    required this.createdAt,
  });

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'] as String,
      title: json['title'] as String,
      originalTitle: json['original_title'] as String?,
      year: json['year'] as int,
      description: json['description'] as String,
      genres: List<String>.from(json['genres'] ?? []),
      moods: List<String>.from(json['moods'] ?? []),
      rating: (json['rating'] as num).toDouble(),
      duration: json['duration'] as int,
      director: json['director'] as String,
      cast: List<String>.from(json['cast'] ?? []),
      poster: json['poster'] as String,
      backdrop: json['backdrop'] as String,
      language: json['language'] as String,
      tags: List<String>.from(json['tags'] ?? []),
      watchStatus: json['watch_status'] as String? ?? 'unwatched',
      isFavorite: json['is_favorite'] as bool? ?? false,
      tmdbId: json['tmdb_id'] as int?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'original_title': originalTitle,
      'year': year,
      'description': description,
      'genres': genres,
      'moods': moods,
      'rating': rating,
      'duration': duration,
      'director': director,
      'cast': cast,
      'poster': poster,
      'backdrop': backdrop,
      'language': language,
      'tags': tags,
      'watch_status': watchStatus,
      'is_favorite': isFavorite,
      'tmdb_id': tmdbId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Movie copyWith({
    String? id,
    String? title,
    String? originalTitle,
    int? year,
    String? description,
    List<String>? genres,
    List<String>? moods,
    double? rating,
    int? duration,
    String? director,
    List<String>? cast,
    String? poster,
    String? backdrop,
    String? language,
    List<String>? tags,
    String? watchStatus,
    bool? isFavorite,
    int? tmdbId,
    DateTime? createdAt,
  }) {
    return Movie(
      id: id ?? this.id,
      title: title ?? this.title,
      originalTitle: originalTitle ?? this.originalTitle,
      year: year ?? this.year,
      description: description ?? this.description,
      genres: genres ?? this.genres,
      moods: moods ?? this.moods,
      rating: rating ?? this.rating,
      duration: duration ?? this.duration,
      director: director ?? this.director,
      cast: cast ?? this.cast,
      poster: poster ?? this.poster,
      backdrop: backdrop ?? this.backdrop,
      language: language ?? this.language,
      tags: tags ?? this.tags,
      watchStatus: watchStatus ?? this.watchStatus,
      isFavorite: isFavorite ?? this.isFavorite,
      tmdbId: tmdbId ?? this.tmdbId,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  String get formattedDuration {
    final hours = duration ~/ 60;
    final minutes = duration % 60;
    if (hours > 0) {
      return '${hours}ч ${minutes}мин';
    }
    return '${minutes}мин';
  }
}
