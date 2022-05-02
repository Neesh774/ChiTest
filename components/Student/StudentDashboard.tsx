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
import { ArrowRight } from "tabler-icons-react";
import { Question, QuestionResponse, User, Session } from "../../utils/types";
import ToggleTheme from "../ToggleTheme";
import ImageDisplay from "./ImageDisplay";

export default function StudentDashboard({ student }: { student: User }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<Session>();
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [correct, setCorrect] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/questions/getQuestion/quiz")
      .then((res) => res.json())
      .then(({ questions, categories }) => {
        setQuestions(questions);
        setAllCategories(categories);
        setSession({
          responses: questions.map((question: Question) => ({
            question: question.term,
            attempts: 0,
          })),
          questionPool: randomizeQuestions(questions),
        });
        setLoading(false);
      });
  }, [student]);

  const checkAnswer = () => {
    const correct = session.questionPool[0].term === selectedAnswer;
    if (correct) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  const nextQuestion = () => {
    let newSession: Session;
    const curResponse = session.responses.find((response: QuestionResponse) => {
      return response.question === session.questionPool[0].term;
    });
    const curQuestion = session.questionPool[0];
    if (correct) {
      newSession = {
        responses: [
          ...session.responses,
          {
            question: session.questionPool[0].term,
            attempts: curResponse.attempts + 1,
          },
        ],
        questionPool: session.questionPool.slice(1),
      };
    } else {
      newSession = {
        responses: [
          ...session.responses,
          {
            question: session.questionPool[0].term,
            attempts: curResponse.attempts + 1,
          },
        ],
        questionPool: session.questionPool.slice(1).concat(curQuestion),
      };
    }
    setCorrect(undefined);
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
                  value={selectedCategory}
                  data={allCategories}
                  placeholder="Focus on a category"
                  clearable
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedAnswer("");
                  }}
                />
              </Group>
            </Group>
            <Group>
              <Button color="red" variant="outline">
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
                color={
                  correct === true
                    ? "green"
                    : correct === false
                    ? "red"
                    : "gray"
                }
              >
                {questions.flatMap((question, index) => {
                  if (
                    selectedCategory &&
                    !question.categories.includes(selectedCategory as never)
                  ) {
                    return null;
                  }
                  return (
                    <Radio
                      disabled={correct != null}
                      key={index}
                      label={question.term}
                      value={question.term}
                    />
                  );
                })}
              </RadioGroup>
            </ScrollArea>
          )}
        </Aside>
      }
      footer={
        <Footer height={70}>
          <Group position="center" align="center" py="sm" px="lg">
            {correct == null ? (
              <Button
                variant={selectedAnswer ? "gradient" : "default"}
                gradient={{ from: "teal", to: "lime", deg: 105 }}
                disabled={!selectedAnswer}
                onClick={checkAnswer}
              >
                Check
              </Button>
            ) : session.questionPool.length > 1 ? (
              <Button onClick={nextQuestion}>
                Next <ArrowRight />
              </Button>
            ) : (
              <Button>
                Complete <ArrowRight />
              </Button>
            )}
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
