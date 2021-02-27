import React, { useEffect, useState } from "react";
import { comedy } from "../../config/movie";
import axios from "axios";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import styles from "../../css/banner.module.css";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../config/firebase";
import { useRouter } from "next/router";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const id = useAuth();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(comedy).then((res) => {
        setMovie(
          res.data.results[
            Math.floor(Math.random() * res.data.results.length - 1)
          ]
        );
      });
      return request;
    }
    fetchData();
    if (dataUser.likedMovie) {
      let data = dataUser.likedMovie.filter((id) => id === movieID).length > 0;
      setLiked(data);
    }
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

  const handleClickView = () => {
    movieTrailer(movie.title)
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => console.log(error));
  };

  const handleLikeButton = () => {
    if (id) {
      let temp = dataUser.likedMovie;
      temp.push(movie.id);
      console.log(movie.id);
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
      let data = dataUser.likedMovie.filter((movieID) => movieID !== movie.id);
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

  const handleClickList = () => {
    router.push("/list");
  };

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <>
      <header
        className={styles.banner}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(
             "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div>
          <h1 className={styles.title}>
            {movie?.name ? movie?.title : movie?.original_title}
          </h1>
        </div>
        <div className={styles.button}>
          {id ? (
            <button className={styles.btn} onClick={() => handleClickList()}>
              My List
            </button>
          ) : null}
          {liked ? (
            <button
              className={styles.btn}
              onClick={() => {
                handleUnlikeButton();
              }}
            >
              UNLIKE
            </button>
          ) : (
            <button
              className={styles.btn}
              onClick={() => {
                handleLikeButton();
              }}
            >
              LIKE
            </button>
          )}
          <button className={styles.btn} onClick={handleClickView}>
            View Thrailer
          </button>
        </div>
        <div className={styles.desc}>
          <p>{movie?.overview}</p>
        </div>
      </header>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </>
  );
}

export default Banner;
