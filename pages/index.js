import Banner from "../components/layout/Banner";
import Layout from "../components/layout/Layout";
import Rows from "../components/layout/Rows";
import "../config/movie";
import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";
import {
  popularity,
  trending,
  action,
  adventure,
  animation,
  comedy,
  documentary,
} from "../config/movie";
import Navbar from "../components/layout/Navbar";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import styles from "../css/loading.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataUser, setDataUser] = useState({});

  const id = useAuth();

  useEffect(() => {
    if (id) {
      async function userData() {
        const data = (await db.collection("users").doc(id).get()).data();
        setIsLoading(false);
        setDataUser(data);
      }
      userData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <Layout title="Home">
      <Navbar user={dataUser} />
      <Banner />
      <Rows url={popularity} title="POPULAR MOVIE" main={true} />
      <Rows url={trending} title="Trending" />
      <Rows url={action} title="Action" />
      <Rows url={adventure} title="Adventure" />
      <Rows url={animation} title="Animation" />
      <Rows url={comedy} title="Comedy" />
      <Rows url={documentary} title="Documentary" />
    </Layout>
  );
}
