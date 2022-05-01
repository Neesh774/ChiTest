import {
  Accordion,
  Container,
  Divider,
  Group,
  Loader,
  Title,
  Text,
  Button,
  Anchor,
  Table,
  ThemeIcon,
  Drawer,
  Paper,
  LoadingOverlay,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Trash } from "tabler-icons-react";
import { Question } from "../../utils/types";
import EditQuestion from "./EditQuestionDrawer";

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | undefined>(undefined);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/questions/getQuestions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, [loading]);

  const createQuestion = async () => {
    setCreateLoading(true);
    await fetch("/api/questions/createQuestion")
      .then((res) => res.json())
      .then((data) => {
        setSelected(data);
        setCreateLoading(false);
        setLoading(true);
      });
  };

  return (
    <>
      <Drawer
        opened={!!selected}
        onClose={() => setSelected(undefined)}
        title={<Title order={4}>Edit Question</Title>}
        padding="xl"
        size="xl"
        position="right"
      >
        {" "}
        <EditQuestion
          selected={selected}
          setSelected={setSelected}
          setTableLoading={setLoading}
        />
      </Drawer>
      <Container>
        <Group position="apart" mb="md">
          <Group direction="column" spacing={0}>
            <Title order={2}>Quiz Questions</Title>
            <Text color="gray">Click on a question to edit it.</Text>
          </Group>
          <Button
            variant="outline"
            onClick={createQuestion}
            loading={createLoading}
          >
            Add Question
          </Button>
        </Group>
        <Divider mb="md" />
        <Group position="center" grow>
          {loading ? (
            <Loader />
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Hint</th>
                  <th>Images</th>
                  <th>Show</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, i) => {
                  return (
                    <tr
                      onClick={() => setSelected(question)}
                      key={i}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{question.term}</td>
                      <td>{question.hint}</td>
                      <td>{question.images.length}</td>
                      <td>
                        <ThemeIcon
                          style={{ backgroundColor: "transparent" }}
                          variant="light"
                          color="gray"
                        >
                          {question.show ? <Eye /> : <EyeOff />}
                        </ThemeIcon>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Group>
      </Container>
    </>
  );
}

interface AccordionLabelProps {
  label: string;
  description: string;
}

function AccordionLabel({ label, description }: AccordionLabelProps) {
  return (
    <Group noWrap>
      <Text>{label}</Text>
      <Text size="sm" color="dimmed" weight={400}>
        {description}
      </Text>
    </Group>
  );
}
