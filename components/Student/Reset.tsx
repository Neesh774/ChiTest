import { Button, Modal, Title, Text, Group } from "@mantine/core";
import { useState } from "react";

export default function Reset({ resetPool }: { resetPool: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button variant="outline" color="red" onClick={() => setOpened(true)}>
        Reset
      </Button>
      <Modal
        title={<Title order={4}>Reset Questions</Title>}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Text>
          Are you sure you want to reset? This will reset the order of your
          questions, but will <b>NOT</b> reset your response streak.
        </Text>
        <Group position="center" mt="xl">
          <Button variant="outline" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              resetPool();
              setOpened(false);
            }}
          >
            Do it!
          </Button>
        </Group>
      </Modal>
    </>
  );
}
