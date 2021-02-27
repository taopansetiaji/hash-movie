import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "../../css/form.module.css";
import { useAuthProvider } from "../../hooks/useAuth";

export default function LoginForm() {
  const { register, errors, handleSubmit, watch } = useForm();
  const router = useRouter();
  const auth = useAuthProvider();

  const onSubmit = (data) => {
    return auth.login(data).then(() => {
      router.push("/");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.wrapper}>
        <label htmlFor="email">Email address</label>
        <div>
          <input
            className={styles.input}
            id="email"
            type="email"
            name="email"
            ref={register({
              required: "Please enter a valid email",
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
      <div>
        <button className={styles.btn} type="submit">
          Login
        </button>
      </div>
    </form>
  );
}
