import Layout from "../../components/layout/Layout";
import Link from "next/link";
import LoginForm from "../../components/forms/LoginForm";
import styles from "../../css/auth.module.css";

export default function Login() {
  return (
    <Layout title="Login">
      <div className={styles.container}>
        <div className={styles.formLogin}>
          <div>
            <h1 className={styles.title}>Login</h1>
            <LoginForm />
            <p>
              New here ?
              <Link href="/register">
                <a className={styles.link}> Register</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
