import { useEffect, useState } from "react";
import axios from "axios";
import movieTrailer from "movie-trailer";
import Youtube from "react-youtube";
import styles from "../../css/rows.module.css";
import { Button } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../config/firebase";
import { useRouter } from "next/router";

export default function Rows({ url, title, main }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieDesc, setMovieDesc] = useState({});
  const [dataUser, setDataUser] = useState({});
  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const id = useAuth();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(url).then((res) => {
        setMovies(res.data.results);
      });
      return request;
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function refDb(idRef) {
      const data = (await db.collection("users").doc(idRef).get()).data();
      setDataUser(data);
    }
    if (id) {
      refDb(id);
    }
  }, [id]);

  const handleClick = (movie, movieID) => {
    setMovieDesc(movie);
    let movieTitle;
    movie.title
      ? (movieTitle = movie.title)
      : (movieTitle = movie.original_title);
    movieTrailer(movieTitle)
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => console.log(error));
    if (dataUser.likedMovie) {
      let data = dataUser.likedMovie.filter((id) => id === movieID).length > 0;
      setLiked(data);
    }
  };

  const handleLikeButton = () => {
    if (id) {
      let temp = dataUser.likedMovie;
      temp.push(movieDesc.id);
      console.log(dataUser.likedMovie);

      db.collection("users")
        .doc(id)
        .set({
          ...dataUser,
          likedMovie: temp,
        });

      setLiked(true);
    } else {
      router.push("/login");
    }
  };

  const handleUnlikeButton = async () => {
    if (id) {
      let data = dataUser.likedMovie.filter(
        (movieID) => movieID !== movieDesc.id
      );
      setLiked(false);
      db.collection("users")
        .doc(id)
        .set({
          ...dataUser,
          likedMovie: data,
        });

      const newData = await db.collection("users").doc(id).get();
      setDataUser(newData.data());
    } else {
    }
  };

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.scroll}>
        {movies.map((movie) => (
          <div
            className={styles.slide}
            key={movie.id}
            onClick={() => {
              handleClick(movie, movie.id);
            }}
          >
            <div className={styles.movie}>
              <img
                className={styles.image}
                src={`https://image.tmdb.org/t/p/w500/${
                  main ? movie.poster_path : movie.backdrop_path
                }`}
                alt={`${movie.original_title}` || `${movie.name}`}
              />
              <h4 className={styles.name}>
                {movie.title ? `${movie.title}` : `${movie.name}`}
              </h4>
            </div>
          </div>
        ))}
      </div>
      <div>
        {trailerUrl && (
          <div className={styles.modal}>
            <div className={styles.ytContainer}>
              <Youtube videoId={trailerUrl} opts={opts} />
            </div>
            <div className={styles.descContainer}>
              <h2 className={styles.desc}>{movieDesc.title}</h2>
              <p className={styles.desc}>{movieDesc.overview}</p>

              {liked ? (
                <Button
                  className={styles.btn}
                  onClick={() => {
                    handleUnlikeButton();
                  }}
                >
                  UNLIKE
                </Button>
              ) : (
                <Button
                  className={styles.btn}
                  onClick={() => {
                    handleLikeButton();
                  }}
                >
                  LIKE
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
