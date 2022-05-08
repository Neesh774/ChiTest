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
  useMantineTheme,
  MantineTheme,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  PlayerPlay,
  PlayerStop,
  Trash,
} from "tabler-icons-react";
import { Question } from "../../utils/types";
import EditQuestion from "./EditQuestionDrawer";

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | undefined>(undefined);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
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
                  <th>Categories</th>
                  <th>Sound</th>
                  <th>Show</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, i) => (
                  <TableRow
                    question={question}
                    key={i}
                    setSelected={setSelected}
                    theme={theme}
                  />
                ))}
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

const TableRow = ({
  question,
  setSelected,
  theme,
}: {
  question: Question;
  setSelected: (q: Question) => void;
  theme: MantineTheme;
}) => {
  const [hoverPlay, setHoverPlay] = useState(false);
  return (
    <tr
      onClick={hoverPlay ? undefined : () => setSelected(question)}
      style={{
        cursor: "pointer",
        backgroundColor: question.show
          ? ""
          : theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[3],
      }}
    >
      <td>{question.term}</td>
      <td>{question.hint}</td>
      <td
        style={{
          color:
            question.images.length == 0
              ? theme.colorScheme === "dark"
                ? theme.colors.red[8]
                : theme.colors.red[6]
              : "",
        }}
      >
        {question.images.length == 0 ? (
          <Text size="sm">No Images</Text>
        ) : (
          <Text>{question.images.length}</Text>
        )}
      </td>
      <td>
        {question.categories ? (
          question.categories.map((category, i) => {
            return (
              <Text key={i}>
                {category}
                {i !== question.categories.length - 1 && ", "}
              </Text>
            );
          })
        ) : (
          <Text>No Categories</Text>
        )}
      </td>
      <td>
        {question.sound ? (
          <ActionIcon
            onMouseEnter={() => setHoverPlay(true)}
            onMouseLeave={() => setHoverPlay(false)}
          >
            {/* {playing ? <PlayerStop /> : <PlayerPlay />} */}
          </ActionIcon>
        ) : (
          <Text>No Sound</Text>
        )}
      </td>
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
};
