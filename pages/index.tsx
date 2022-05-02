import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import SignIn from "../components/SignIn";
import useSWR from "swr";
import TeacherDashboard from "../components/Teacher/TeacherDashboard";
import { User } from "../utils/types";
import StudentDashboard from "../components/Student/StudentDashboard";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState<User | "teacher" | undefined>(
    undefined
  );
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) setShowSignIn(true);
  }, [showSignIn, loggedIn]);
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
            <StudentDashboard student={loggedIn} />
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
