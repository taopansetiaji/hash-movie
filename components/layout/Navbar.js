import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../css/nav.module.css";
import { useAuthProvider } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { db } from "../../config/firebase";

// antdesign
import { Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);
  const id = useAuth();
  useEffect(() => {
    const scrollDown = () => {
      if (window.scrollY > 30) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", scrollDown);
    return () => {
      window.removeEventListener("scroll", scrollDown);
    };
  }, []);

  useEffect(() => {
    if (id) {
      async function userData() {
        const data = (await db.collection("users").doc(id).get()).data();
        const isAdmin = data.role.filter((adm) => adm === "admin").length > 0;
        setAdmin(isAdmin);
        setUser(data);
      }
      userData();
    }
  }, [id]);

  const auth = useAuthProvider();
  const handleLogout = () => {
    return auth.logout().then(() => {
      router.push("/login");
    });
  };

  const handleIndex = () => {
    router.push("/");
  };

  // antdesign

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          router.push("/list");
        }}
      >
        My List
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          router.push("/setting");
        }}
      >
        Setting
      </Menu.Item>
      {admin ? (
        <Menu.Item
          key="3"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Dashboard
        </Menu.Item>
      ) : null}
    </Menu>
  );

  return (
    <>
      {!id ? (
        <div className={show ? styles.containerBlack : styles.container}>
          <img
            className={styles.logo}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png"
            alt="Netflix-logo"
            onClick={() => handleIndex()}
          />
          <div className={styles.right2}>
            <Link href="/register">
              <button className={styles.btnRegister}>Register</button>
            </Link>
            <Link href="./login">
              <button className={styles.btnLogin}>Login</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className={show ? styles.containerBlack : styles.container}>
          <img
            className={styles.logo}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png"
            alt="Netflix-logo"
            onClick={() => handleIndex()}
          />
          <div className={styles.right}>
            <Dropdown.Button
              overlay={menu}
              placement="bottomCenter"
              icon={<UserOutlined />}
              className={styles.avatar}
            >
              {user.name}
            </Dropdown.Button>
            <button className={styles.btn} onClick={() => handleLogout()}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
