import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../config/firebase";
import nookies from "nookies";

const authContext = createContext(auth.currentUser || null);
const { Provider } = authContext;

export const AuthProvider = (props) => {
  const [user, setUser] = useState(auth.currentUser || null);
  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      console.log(`token changed!`);
      if (user) {
        console.log(`updating token...`);
        const token = await user.getIdToken();
        setUser(user.uid);
        nookies.destroy(null, "token");
        nookies.set(null, "token", token, {});
      } else {
        console.log(`no token found...`);
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", {});
        return;
      }
    });
  }, []);

  useEffect(() => {
    const handleTokenChange = setInterval(async () => {
      console.log("refreshing token ...");
      const user = auth.currentUser;
      if (user) await user.getIdToken();
    }, 1000 * 60 * 10); // interval an hour
    return () => clearInterval(handleTokenChange);
  });

  return <Provider value={user}>{props.children}</Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const useAuthProvider = () => {
  const register = async ({ name, email, password }) => {
    try {
      return await auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          // add user to firestore
          db.collection("users")
            .doc(res.user.uid)
            .set({
              ID: res.user.uid,
              name: name,
              email: res.user.email,
              role: ["user"],
              likedMovie: [],
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const login = async ({ email, password }) => {
    try {
      return await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    return await auth.signOut();
  };

  return {
    register,
    login,
    logout,
  };
};
