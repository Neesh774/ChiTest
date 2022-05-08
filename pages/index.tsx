import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import SignIn from "../components/SignIn";
import useSWR from "swr";
import TeacherDashboard from "../components/Teacher/TeacherDashboard";
import { User } from "../utils/types";
import StudentDashboard from "../components/Student/StudentDashboard";
import { Dialog, Group, Text, ThemeIcon } from "@mantine/core";
import { Mouse } from "tabler-icons-react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState<User | "teacher" | undefined>(
    undefined
  );
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) setShowSignIn(true);
  }, [loggedIn]);

  const logOut = () => {
    setLoggedIn(undefined);
    if (window) {
      window.localStorage.removeItem("user");
    }
  };
  return (
    <>
      <Head>
        <title>ChiTest</title>
      </Head>
      <main>
        {loggedIn &&
          (loggedIn === "teacher" ? (
            <TeacherDashboard logOut={() => setLoggedIn(undefined)} />
          ) : (
            <StudentDashboard student={loggedIn} logOut={logOut} />
          ))}
      </main>
      <SignIn
        opened={showSignIn}
        setOpened={setShowSignIn}
        setUser={setLoggedIn}
        loggedIn={!!loggedIn}
      />
    </>
  );
}
