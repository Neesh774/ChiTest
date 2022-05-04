import { Button, Modal, Table, Title } from "@mantine/core";
import React, { useState } from "react";
import { Session } from "../../utils/types";
import QuestionPopover from "../QuestionPopover";

export default function Results({ session }: { session: Session }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>View Results</Button>
      <Modal
        title={<Title order={4}>Results</Title>}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Attempts for First Try</th>
            </tr>
          </thead>
          <tbody>
            {session.responses.map((question, i) => {
              return (
                <tr key={i}>
                  <td>
                    <QuestionPopover questionTerm={question.question} />
                  </td>
                  <td>
                    {question.attempts == -1
                      ? "Not Attempted"
                      : question.attempts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal>
    </>
  );
}
