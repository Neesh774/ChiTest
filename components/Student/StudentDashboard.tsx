import {
  AppShell,
  Button,
  Group,
  Header,
  Title,
  Text,
  Aside,
  ScrollArea,
  Loader,
  Footer,
  Select,
  Radio,
  RadioGroup,
  Center,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowRight, Check, Keyboard, X } from "tabler-icons-react";
import {
  Question,
  QuestionResponse,
  User,
  Session,
  RestoredSession,
} from "../../utils/types";
import ToggleTheme from "../ToggleTheme";
import ImageDisplay from "./ImageDisplay";
import { showNotification } from "@mantine/notifications";
import Results from "./Results";
import CompleteModal from "./CompleteModal";
import Shortcuts from "./Shortcuts";
import { useHotkeys } from "@mantine/hooks";
import Reset from "./Reset";
import { useReward } from "react-rewards";

export default function StudentDashboard({
  student,
  logOut,
}: {
  student: User;
  logOut: () => void;
}) {
  const [session, setSession] = useState<Session>({
    responses: [],
    questionPool: [],
    questions: [],
    focus: "",
    categories: [],
    answers: [],
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [correct, setCorrect] = useState<{
    first: boolean;
    correct: boolean;
  }>({
    first: null,
    correct: null,
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const { reward } = useReward("correct", "confetti", {
    angle: 150,
    zIndex: 1000,
    startVelocity: 20,
  });
  useEffect(() => {
    let unsaved: RestoredSession;
    if (window) {
      unsaved = JSON.parse(window.localStorage.getItem("unsaved"));
    }
    let updatedSession: Session;
    fetch("/api/questions/getQuestion/quiz")
      .then((res) => res.json())
      .then(({ questions, categories }) => {
        updatedSession = {
          responses: unsaved
            ? unsaved.responses
            : questions.map((question: Question) => ({
                question: question.term,
                attempts: -1,
                firstTry: false,
              })),
          questionPool: unsaved ? unsaved.pool : randomizeQuestions(questions),
          questions: questions,
          categories,
          focus: unsaved ? unsaved.focus : "",
          answers: (unsaved ? unsaved.pool : questions).map(
            (question: Question) => question.term
          ),
        };
        setSession(updatedSession);
        setLoading(false);
      });
    if (window) {
      window.addEventListener("beforeunload", alertUser);

      return () => {
        window.removeEventListener("beforeunload", alertUser);
      };
    }
  }, []);

  useEffect(() => {
    if (
      window &&
      !session.responses.every((response) => response.attempts > 0)
    ) {
      window.localStorage.setItem(
        "unsaved",
        JSON.stringify({
          responses: session.responses,
          focus: session.focus,
          pool: session.questionPool,
        })
      );
    }
  }, [session]);
  const checkAnswer = () => {
    let newSession: Session = session;
    const response = session.questionPool[0].term === selectedAnswer;
    const curResponse = session.responses.find((response: QuestionResponse) => {
      return response.question === session.questionPool[0].term;
    });
    const curQuestion = session.questionPool[0];
    if (!response && correct.first == null) {
      session.questionPool = session.questionPool.concat(
        session.questionPool[0]
      );
    }

    if (!(curResponse.firstTry && response)) {
      newSession = {
        ...newSession,
        responses: [
          ...newSession.responses.filter(
            (response: QuestionResponse) =>
              response.question !== curQuestion.term
          ),
          {
            ...curResponse,
            attempts: curResponse.attempts == -1 ? 1 : curResponse.attempts + 1,
            firstTry:
              !curResponse.firstTry && correct.first == null && response,
          },
        ],
      };
    }
    setCorrect({ first: correct.first == null && response, correct: response });
    setSession(newSession);
    if (response) {
      showNotification({
        message: "You got it right, great work!",
        color: "green",
        icon: <Check />,
      });
      reward();
    } else {
      showNotification({
        message: (
          <Text>
            Hmm... try that again. Here&apos;s a hint:
            <br />
            <b>{session.questionPool[0].hint}</b>
          </Text>
        ),
        color: "red",
        icon: <X />,
      });
    }
  };

  const changeFocus = (focus: string) => {
    if (focus === null) {
      setSession({
        ...session,
        focus: "",
        questionPool: randomizeQuestions(session.questions),
        answers: session.questions.map((question: Question) => question.term),
      });
    } else {
      const newPool = session.questions.flatMap((question) => {
        if (!question.categories.includes(focus as never)) {
          return [];
        }
        return question;
      });
      setSession({
        ...session,
        focus,
        questionPool: newPool,
        answers: newPool.map((question: Question) => question.term),
      });
      setSelectedAnswer("");
      setCorrect({ ...correct, correct: null });
    }
  };

  const resetPool = () => {
    setSession({
      ...session,
      questionPool: randomizeQuestions(session.questions),
      focus: "",
      answers: session.questions.map((question: Question) => question.term),
      responses: session.responses.map((response: QuestionResponse) => {
        if (response.firstTry) {
          return response;
        }
        return {
          ...response,
          attempts: -1,
          firstTry: false,
        };
      }),
    });
    setSelectedAnswer("");
    setCorrect({ ...correct, correct: null });
  };

  const nextQuestion = () => {
    if (session.questionPool.length < 1) return;
    setCorrect({ first: null, correct: null });
    setSelectedAnswer("");
    setSession({
      ...session,
      questionPool: session.questionPool.slice(1),
    });
  };

  const saveSession = async () => {
    if (!session.responses.length) {
      showNotification({
        message: "You haven't answered any questions yet!",
        color: "red",
        icon: <X />,
      });
      return;
    }
    setSaveLoading(true);
    await fetch("/api/students/saveSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: session.responses,
        id: student.id,
      }),
    });
    setSaveLoading(false);
    showNotification({
      message: "Session saved!",
      color: "green",
      icon: <Check />,
    });
    setSession({
      ...session,
      responses: session.responses.map((response: QuestionResponse) => ({
        ...response,
        attempts: -1,
        firstTry: false,
      })),
    });
    resetPool();
  };

  const pressEnter = () => {
    if (correct.correct == null && selectedAnswer) {
      checkAnswer();
    }
    if (correct.correct && session.questionPool.length > 1) {
      nextQuestion();
    }
  };
  useHotkeys([["Enter", pressEnter]]);
  return (
    <AppShell
      padding="md"
      header={
        <Header height={80} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
              padding: "0 1rem",
            }}
          >
            <Group spacing={40}>
              <Group direction="column" spacing={0} py="md">
                <Title order={2}>ChiTest</Title>
                <Text size="sm" color="gray">
                  Logged in as:{" "}
                  <Text
                    component="span"
                    size="sm"
                    onClick={logOut}
                    sx={(theme) => ({
                      cursor: "pointer",
                      "&:hover": {
                        color: theme.colors.red[7],
                      },
                    })}
                    underline
                  >
                    {student.name}
                  </Text>
                </Text>
              </Group>
              <Group>
                <Select
                  value={session.focus}
                  data={session.categories}
                  placeholder="Focus on a category"
                  clearable
                  onChange={changeFocus}
                />
              </Group>
            </Group>
            <Group>
              <Shortcuts />
              <Results session={session} />
              <Reset resetPool={resetPool} />
              <Button
                variant="gradient"
                onClick={saveSession}
                loading={saveLoading}
              >
                Save
              </Button>
              <ToggleTheme />
            </Group>
          </div>
        </Header>
      }
      aside={
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 200 }}>
          {loading ? (
            <Group position="center">
              <Loader />
            </Group>
          ) : (
            <ScrollArea>
              <RadioGroup
                orientation="vertical"
                label={<Title order={4}>Options</Title>}
                value={selectedAnswer}
                onChange={setSelectedAnswer}
                size="sm"
              >
                {session.answers.map((term, index) => (
                  <Radio
                    key={index}
                    disabled={correct.correct == true}
                    label={term}
                    value={term}
                    onFocus={(e) => e.target.blur()}
                  />
                ))}
              </RadioGroup>
            </ScrollArea>
          )}
        </Aside>
      }
      footer={
        <Footer height={70}>
          <Group position="center" align="center" py="sm" px="lg">
            {!correct.correct && (
              <Button
                variant={selectedAnswer ? "gradient" : "default"}
                gradient={{ from: "teal", to: "lime", deg: 105 }}
                disabled={!selectedAnswer}
                onClick={checkAnswer}
              >
                Check
              </Button>
            )}
            {correct.correct != null &&
              (session.questionPool.length == 1 && correct.first ? (
                <CompleteModal
                  save={saveSession}
                  reset={resetPool}
                  session={session}
                />
              ) : (
                <Button onClick={nextQuestion}>
                  Next <ArrowRight />
                </Button>
              ))}
          </Group>
        </Footer>
      }
    >
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <ImageDisplay session={session} />
      )}
      <div id="correct" style={{ position: "fixed", bottom: 100, right: 80 }} />
    </AppShell>
  );
}

const randomizeQuestions = (questions: Question[]) => {
  const shuffled = questions.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const alertUser = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = "You have unsaved work.";
};
