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
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "tabler-icons-react";
import { Question, User } from "../../utils/types";
import ToggleTheme from "../ToggleTheme";

export default function StudentDashboard({ student }: { student: User }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/questions/getQuestion/quiz")
      .then((res) => res.json())
      .then(({ questions, categories }) => {
        setQuestions(questions);
        setAllCategories(categories);
        setLoading(false);
      });
  }, [student]);
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
                    setSelectedAnswer(undefined);
                  }}
                />
              </Group>
            </Group>
            <ToggleTheme />
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
                {questions.flatMap((question, index) => {
                  if (
                    selectedCategory &&
                    !question.categories.includes(selectedCategory as never)
                  ) {
                    return null;
                  }
                  return <Radio label={question.term} value={question.term} />;
                })}
              </RadioGroup>
            </ScrollArea>
          )}
        </Aside>
      }
      footer={
        <Footer height={120}>
          <Group position="center" align="center" py="sm">
            <Button>
              Next <ArrowRight size={16} />{" "}
            </Button>
          </Group>
        </Footer>
      }
    >
      <div></div>
    </AppShell>
  );
}
