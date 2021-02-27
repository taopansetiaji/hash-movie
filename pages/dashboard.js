import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Table } from "antd";
import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";
import styles from "../css/dashboard.module.css";
import { useRouter } from "next/router";
import { Spin } from "antd";
import axios from "axios";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const id = useAuth();

  useEffect(() => {
    if (id) {
      async function userData() {
        const data = (await db.collection("users").doc(id).get()).data();
        const isAdmin = data.role.filter((adm) => adm === "admin").length > 0;
        if (!isAdmin) {
          router.replace("/");
        }
        const allUser = (await db.collection("users").get()).docs.map((doc) =>
          doc.data()
        );
        const dataUser = await Promise.all(
          allUser.map(async (user) => {
            const roles = user.role.map((role) => `${role}, `);
            const dataMovie = await Promise.all(
              user.likedMovie.map(async (id) => {
                const API_KEY = "9dc5ecdc19ba39bd96b39167574ec60e";
                const result = await axios
                  .get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
                  )
                  .then((res) => res.data)
                  .then((movie) => `${movie.title}, `);
                return result;
              })
            );

            return {
              key: user.ID,
              name: user.name,
              email: user.email,
              role: roles,
              movie: dataMovie,
            };
          })
        );
        console.log(dataUser);

        setUsers(dataUser);
      }
      userData();
      setIsLoading(false);
    }
  }, [id]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Liked Movie",
      dataIndex: "movie",
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  console.log(users);

  return (
    <div className={styles.container}>
      <Navbar />
      <Table
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 50 }}
      />
    </div>
  );
}
