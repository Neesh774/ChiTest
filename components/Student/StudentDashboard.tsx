import {
  AppShell,
  Burger,
  Button,
  Group,
  Header,
  MediaQuery,
  Title,
  Text,
  Aside,
  ScrollArea,
  UnstyledButton,
  Loader,
  Footer,
  MultiSelect,
  Select,
  Radio,
  RadioGroup,
  Center,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowRight, Check, X } from "tabler-icons-react";
import { Question, QuestionResponse, User, Session } from "../../utils/types";
import ToggleTheme from "../ToggleTheme";
import ImageDisplay from "./ImageDisplay";
import { showNotification } from "@mantine/notifications";
import Results from "./Results";

export default function StudentDashboard({ student }: { student: User }) {
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
  useEffect(() => {
    fetch("/api/questions/getQuestion/quiz")
      .then((res) => res.json())
      .then(({ questions, categories }) => {
        setSession({
          responses: questions.map((question: Question) => ({
            question: question.term,
            attempts: -1,
            firstTry: false,
          })),
          questionPool: randomizeQuestions(questions),
          questions: questions,
          categories,
          focus: "",
          answers: questions.map((question: Question) => question.term),
        });
        setLoading(false);
      });
    if (window) {
      window.addEventListener("beforeunload", alertUser);

      return () => {
        window.removeEventListener("beforeunload", alertUser);
      };
    }
  }, []);
  const checkAnswer = () => {
    const response = session.questionPool[0].term === selectedAnswer;
    if (!response && correct.first == null) {
      setSession({
        ...session,
        questionPool: session.questionPool.concat(session.questionPool[0]),
      });
    }
    setCorrect({ first: correct.first == null && response, correct: response });
    if (response) {
      showNotification({
        message: "You got it right, great work!",
        color: "green",
        icon: <Check />,
      });
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
    let newSession: Session;
    const curResponse = session.responses.find((response: QuestionResponse) => {
      return response.question === session.questionPool[0].term;
    });
    const curQuestion = session.questionPool[0];
    newSession = {
      ...session,
      responses: [
        ...session.responses.filter(
          (response: QuestionResponse) => response.question !== curQuestion.term
        ),
        {
          ...curResponse,
          attempts: curResponse.attempts == -1 ? 1 : curResponse.attempts + 1,
          firstTry: !curResponse.firstTry && correct.first ? true : false,
        },
      ],
      questionPool: session.questionPool.slice(1),
    };
    setCorrect({ first: null, correct: null });
    setSelectedAnswer("");
    setSession(newSession);
  };
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
                  Logged in as: {student.name}
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
              <Results session={session} />
              <Button color="red" variant="outline" onClick={resetPool}>
                Reset
              </Button>
              <Button variant="gradient">Save</Button>
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
              (session.questionPool.length > 1 ? (
                <Button onClick={nextQuestion}>
                  Next <ArrowRight />
                </Button>
              ) : (
                <Button>
                  Complete <ArrowRight />
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
