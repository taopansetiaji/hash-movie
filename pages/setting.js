import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../css/setting.module.css";
import Navbar from "../components/layout/Navbar";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { Spin } from "antd";

export default function Setting() {
  const { register, errors, handleSubmit, watch } = useForm();
  const [user, setUser] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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

  const onChangeUsername = async (data) => {
    console.log(data);
    db.collection("users")
      .doc(id)
      .set({
        ...user,
        name: data.name,
      });
    const newData = await db.collection("users").doc(id).get();
    setUser(newData.data());
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.wrapperContainer}>
      <Navbar />
      <form className={styles.form} onSubmit={handleSubmit(onChangeUsername)}>
        <div className={styles.wrapper}>
          <label htmlFor="name">Name</label>
          <input
            className={styles.input}
            id="name"
            type="text"
            name="name"
            placeholder={user.name}
            ref={register({
              required: "Please enter an name",
            })}
          />
          {errors.password && (
            <div className={styles.error}>{errors.password.message}</div>
          )}
        </div>
        <div>
          <button type="submit" className={styles.btn}>
            Change Username
          </button>
        </div>
      </form>
      {showChangePassword ? (
        <form className={styles.form}>
          <div className={styles.wrapper}>
            <label htmlFor="email">Email address</label>
            <div>
              <input
                className={styles.input}
                id="email"
                t
                ype="email"
                name="email"
                placeholder={user.email}
                ref={register({
                  required: "Please enter an email",
                  pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                })}
              />
              {errors.email && (
                <div className={styles.error}>{errors.email.message}</div>
              )}
            </div>
          </div>
          <div className={styles.wrapper}>
            <label htmlFor="password">Password</label>
            <div>
              <input
                className={styles.input}
                id="password"
                type="password"
                name="password"
                ref={register({
                  required: "Please enter a password",
                  minLength: {
                    value: 6,
                    message: "Should have at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <div className={styles.error}>{errors.password.message}</div>
              )}
            </div>
          </div>
          <button
            className={styles.btn2}
            onClick={() => setShowChangePassword(false)}
          >
            Cancel
          </button>
        </form>
      ) : null}
      <button
        className={showChangePassword ? styles.btn : styles.btn2}
        onClick={() => setShowChangePassword(true)}
      >
        Change Email & Password
      </button>
    </div>
  );
}
