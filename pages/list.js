import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { Spin } from "antd";
import styles from "../css/list.module.css";

export default function List() {
  const [user, setUser] = useState({});
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = useAuth();

  useEffect(() => {
    if (id) {
      async function userData() {
        const data = (await db.collection("users").doc(id).get()).data();
        setIsLoading(false);
        setUser(data);
      }
      userData();
    }
  }, [id]);

  const API_KEY = "9dc5ecdc19ba39bd96b39167574ec60e";

  useEffect(() => {
    if (user.likedMovie) {
      const moviesData = Promise.all(
        user.likedMovie.map(async (id) => {
          return await axios
            .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
            .then((res) => res.data);
        })
      );
      moviesData.then((data) => setMovies(data));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>My List</h1>
        {movies.map((movie) => (
          <div className={styles.slide} key={movie.id}>
            <div className={styles.movie}>
              <img
                className={styles.image}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={`${movie.original_title}` || `${movie.name}`}
              />
              <h4 className={styles.name}>
                {movie.title ? `${movie.title}` : `${movie.name}`}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
