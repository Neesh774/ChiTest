import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stepper,
  TextInput,
  Title,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { Mouse } from "tabler-icons-react";
import { User } from "../utils/types";

export default function SignIn({
  opened,
  setOpened,
  setUser,
  loggedIn,
}: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  setUser: (value: User | "teacher") => void;
  loggedIn: boolean;
}) {
  const [username, setUsername] = useState("");
  const [teacherUsername, setTeacherUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState<string>();
  const [type, setType] = useState<"teacher" | "student">();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const nextStep = () =>
    setStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setStep((current) => (current > 0 ? current - 1 : current));

  const chooseStudent = () => {
    setType("student");
    nextStep();
  };
  const chooseTeacher = () => {
    setType("teacher");
    nextStep();
  };

  useEffect(() => {
    if (window && !loggedIn) {
      const user = window.localStorage.getItem("user");
      if (user) {
        setLoading(true);
        fetch("/api/students/getStudent/" + user)
          .then((res) => res.json())
          .then((data) => {
            setUser(data.user as User);
            setOpened(false);
            if (data.newUser) {
              showNotification({
                title: "Welcome to ChiTest",
                message:
                  "Try scrolling and dragging the image to take a closer look.",
                color: "blue",
                icon: <Mouse />,
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            console.error(err);
          });
      }
    }
  }, [setUser, loggedIn, setOpened]);

  const handleSubmit = async () => {
    setLoading(true);
    if (type === "teacher") {
      if (teacherUsername !== "mcgee1" || password !== "mcgee1") {
        setInvalid("Invalid username or password");
        setLoading(false);
        return;
      }
      setUser("teacher");
    }
    if (type === "student") {
      if (username.length < 2) {
        setInvalid("Username must be at least 2 characters long");
        return;
      }
      const user = await fetch("/api/students/getStudent/" + username)
        .then((res) => res.json())
        .then((data) => {
          return data.user as User;
        });
      setUser(user);
      if (window) {
        window.localStorage.setItem("user", username);
      }
    }
    setLoading(false);
    setOpened(false);
  };

  useHotkeys([["Enter", handleSubmit]]);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={4}>Sign In to ChiTest</Title>}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={loggedIn}
    >
      <LoadingOverlay visible={loading} />
      <Stepper active={step} breakpoint="sm">
        <Stepper.Step label="User">
          <Group position="center" mt="xl">
            <Button size="xl" onClick={chooseStudent}>
              🧑‍🎓
              <br />
              Student
            </Button>
            <Button size="xl" onClick={chooseTeacher}>
              🧑‍🏫
              <br />
              Teacher
            </Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step label="Log In">
          <Group position="center" mb="lg" direction="column" grow>
            {type === "teacher" && <Title order={4}>Welcome, Mr. McGee</Title>}
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              value={type === "teacher" ? teacherUsername : username}
              onChange={(e) => {
                type === "teacher"
                  ? setTeacherUsername(e.target.value)
                  : setUsername(e.target.value);
              }}
            />
            {type === "teacher" && (
              <TextInput
                type="password"
                placeholder="Password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Group>
          <Group position="right">
            <Button variant="outline" onClick={prevStep}>
              &larr;Back
            </Button>
            <Button onClick={handleSubmit}>Sign In</Button>
          </Group>
          {invalid && (
            <Alert
              title="Whoopsie..."
              withCloseButton
              color="red"
              variant="outline"
              mt="lg"
              onClose={() => setInvalid(undefined)}
            >
              {invalid}
            </Alert>
          )}
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
