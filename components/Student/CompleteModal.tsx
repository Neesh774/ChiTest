import { Button, Group, Modal, Title, Text } from "@mantine/core";
import React, { useState } from "react";
import { ArrowRight, Confetti } from "tabler-icons-react";
import { Session } from "../../utils/types";
import { useReward } from "react-rewards";
import { table } from "./Results";

export default function CompleteModal({
  reset,
  save,
  session,
}: {
  reset: () => void;
  save: () => void;
  session: Session;
}) {
  const [opened, setOpened] = useState(false);
  const numCompleted = session.responses.filter((r) => r.attempts != -1).length;
  const { reward } = useReward("completeModal", "balloons", {
    zIndex: 100,
  });
  return (
    <>
      <Button
        id="completeModal"
        onClick={() => {
          setOpened(true);
          reward();
        }}
      >
        Complete <ArrowRight />
      </Button>
      <Modal
        title={<Title order={4}>Your Results</Title>}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Text>
          Congrats! You just completed {numCompleted}{" "}
          {numCompleted == 1 ? "term" : "terms"}.
        </Text>
        {table(session)}
        <Group position="center" mt="xl">
          <Button variant="outline" color="red" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "orange", to: "yellow" }}
            onClick={save}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
