import Layout from "../../components/layout/Layout";
import Link from "next/link";
import RegisterForm from "../../components/forms/RegisterForm";
import styles from "../../css/auth.module.css";

export default function Login() {
  return (
    <Layout title="Register">
      <div className={styles.container}>
        <div className={styles.formRegister}>
          <div>
            <h1 className={styles.title}>Register</h1>
            <RegisterForm />
            <p>
              Already have an account ?
              <Link href="/login">
                <a className={styles.link}> Login</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
