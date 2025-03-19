import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]); // ⬅️ Ajout de l'état pour stocker les films

  // Récupérer les films depuis l'API backend au chargement du composant
  useEffect(() => {
    fetch('https://mymoviz-backend-rg11.vercel.app/') // ⬅️ Correction de l'URL avec "/api"
      .then(response => response.json())
      .then(data => {
        setMoviesData(data.movies); // ⬅️ Récupération de la liste des films sous "movies"
      })
      .catch(error => console.error("❌ Erreur lors de la récupération des films:", error));
  }, []);

  // Mise à jour des films likés
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.includes(movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => (
    <div key={i} className={styles.likedMoviesContainer}>
      <span className="likedMovie">{data}</span>
      <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
    </div>
  ));

  const popoverContent = <div className={styles.popoverContent}>{likedMoviesPopover}</div>;

  const truncateOverview = (overview) => {
    return overview.length > 250 ? overview.substring(0, 250) + '...' : overview;
  };
  // Affichage des films dynamiques
  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.includes(data.title);
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.title}
        overview={truncateOverview(data.overview)}
        poster={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/default-poster.jpg'}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;
