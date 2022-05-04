import {
  ActionIcon,
  Aside,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  MediaQuery,
  Modal,
  Table,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Trash } from "tabler-icons-react";
import { QuestionResponse, User } from "../../utils/types";
import QuestionPopover from "../QuestionPopover";
import ReportTimeline from "./ReportTimeline";

export default function TeacherReports() {
  const [students, setStudents] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/students/getStudents")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, [loading]);

  const deleteStudent = async () => {
    setDeleteModalLoading(true);
    setStudents(undefined);
    await fetch("/api/students/deleteStudent/" + selected.name);
    setLoading(true);
    setSelected(undefined);
    setDeleteModalLoading(false);
    setDeleteModal(false);
  };

  const summarizeSessions = () => {
    const { sessions } = selected;
    let summary: { [term: string]: string } = {};
    sessions.forEach((session) => {
      session.responses.forEach((response) => {
        summary[response.question] =
          (summary[response.question] ? summary[response.question] + "⇛" : "") +
          (response.attempts == -1 ? "✘" : response.attempts);
      });
    });
    return summary;
  };
  return (
    <>
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title={<Title order={4}>Delete Student</Title>}
      >
        <Text>
          Are you sure you want to delete this student? You will not be able to
          recover their data.
        </Text>
        <Group position="apart" mt="md">
          <Button variant="outline" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={deleteStudent}
            loading={deleteModalLoading}
          >
            Send them to the void!
          </Button>
        </Group>
      </Modal>
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 200 }}>
          <Title order={3} mb="md">
            Students
          </Title>
          {!loading && students ? (
            students.map((student, i) => (
              <UnstyledButton
                key={i}
                sx={(theme) => ({
                  display: "block",
                  width: "100%",
                  padding: theme.spacing.xs,
                  fontWeight: selected === student ? "500" : "normal",
                  borderRight:
                    selected === student
                      ? `2px solid ${theme.colors.blue[5]}`
                      : `1px solid ${theme.colors.gray[5]}`,
                  borderTopLeftRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  color:
                    selected === student
                      ? theme.colorScheme === "dark"
                        ? theme.colors.blue[0]
                        : theme.colors.blue[5]
                      : theme.colorScheme === "dark"
                      ? theme.colors.dark[2]
                      : theme.colors.black,
                  backgroundColor:
                    selected === student
                      ? theme.colorScheme === "dark"
                        ? theme.colors.blue[4] + "60"
                        : theme.colors.blue[0]
                      : "transparent",
                })}
                onClick={() => setSelected(student)}
              >
                <Text>{student.name}</Text>
              </UnstyledButton>
            ))
          ) : (
            <Group position="center">
              <Loader />
            </Group>
          )}
        </Aside>
      </MediaQuery>
      {selected ? (
        <Container>
          <Group position="apart">
            <Title>{selected.name}</Title>
            <ActionIcon onClick={() => setDeleteModal(true)} color="red">
              <Trash />
            </ActionIcon>
          </Group>
          <Divider />
          <Title order={3} mt="lg">
            Report
          </Title>
          <Group position="center" mt="md">
            {selected.responses?.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Attempts for First Try</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summarizeSessions()).map((response, i) => (
                    <tr key={i}>
                      <td>
                        <QuestionPopover questionTerm={response[0]} />
                      </td>
                      <td>{response[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Text color="gray">This user has not completed any work.</Text>
            )}
          </Group>
          {selected.sessions.length > 0 && (
            <>
              <Title order={3} mt="lg">
                {selected.sessions.length +
                  " " +
                  (selected.sessions.length == 1 ? "Session" : "Sessions")}
              </Title>
              <Group position="center" mt="lg">
                <ReportTimeline reports={selected.sessions} />
              </Group>
            </>
          )}
        </Container>
      ) : (
        <Group position="center">
          <Text weight="bold" size="xl" color="gray">
            Select a student to get started.
          </Text>
        </Group>
      )}
    </>
  );
}
