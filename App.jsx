import { useState, useEffect } from 'react';
import './App.css';

const MAX_STARS = 5;

// Clickable stars used in the form
function StarPicker({ value, onChange }) {
    return (
        <div className="star-picker">
            {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((n) => (
                <button
                    type="button"
                    key={n}
                    className={n <= value ? 'star on' : 'star off'}
                    onClick={() => onChange(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                    ⭐
                </button>
            ))}
        </div>
    );
}

function MovieCard({ movie, onRemove }) {
    return (
        <li className="movie">
            <div className="movie-top">
                <h3>{movie.title}</h3>
                <button className="remove" onClick={() => onRemove(movie.id)} title="Remove">
                    🗑️
                </button>
            </div>

            <div className="rating">
                <span className="emoji-stars">{'⭐'.repeat(movie.rating)}</span>
                <span className="rating-text">
                    {movie.rating}/{MAX_STARS}
                </span>
            </div>

            {movie.comment && <p className="comment">“{movie.comment}”</p>}
        </li>
    );
}

export default function App() {
    const [movies, setMovies] = useState(() => {
        const saved = localStorage.getItem('movies');
        return saved ? JSON.parse(saved) : [];
    });
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // Save to the browser whenever the list changes
    useEffect(() => {
        localStorage.setItem('movies', JSON.stringify(movies));
    }, [movies]);

    const addMovie = (e) => {
        e.preventDefault();
        if (!title.trim() || rating === 0) return;

        const newMovie = {
            id: Date.now(),
            title: title.trim(),
            rating,
            comment: comment.trim(),
        };
        setMovies([newMovie, ...movies]);
        setTitle('');
        setRating(0);
        setComment('');
    };

    const removeMovie = (id) => setMovies(movies.filter((m) => m.id !== id));

    const average =
        movies.length > 0
            ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)
            : null;

    return (
        <main className="card">
            <h1>🎬 Movies Watch List</h1>

            <form onSubmit={addMovie} className="form">
                <input
                    type="text"
                    placeholder="Movie title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="rate-row">
                    <span>Your rating:</span>
                    <StarPicker value={rating} onChange={setRating} />
                </div>

                <textarea
                    placeholder="Write a short review (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="2"
                />

                <button type="submit" className="add-btn" disabled={!title.trim() || rating === 0}>
                    Add movie
                </button>
            </form>

            <div className="summary">
                <span>
                    {movies.length} movie{movies.length !== 1 ? 's' : ''} watched
                </span>
                {average && <span>Average: {average} ⭐</span>}
            </div>

            {movies.length === 0 ? (
                <p className="empty">No movies yet. Add the first one!</p>
            ) : (
                <ul className="list">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onRemove={removeMovie} />
                    ))}
                </ul>
            )}
        </main>
    );
}