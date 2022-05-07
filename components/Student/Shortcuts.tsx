import { ActionIcon, Kbd, Text, Group, Popover, Title } from "@mantine/core";
import React, { useState } from "react";
import { Keyboard, Mouse } from "tabler-icons-react";

export default function Shortcuts() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Popover
        target={
          <ActionIcon
            size="lg"
            color="orange"
            variant="light"
            onClick={() => setOpened(!opened)}
          >
            <Keyboard />
          </ActionIcon>
        }
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        transition="pop-top-left"
      >
        <Group direction="column">
          <Title order={4}>Shortcuts</Title>
          <Group>
            <Kbd>Right</Kbd>
            <Text size="sm">Next Image</Text>
          </Group>
          <Group>
            <Kbd>Left</Kbd>
            <Text>Previous Image</Text>
          </Group>
          <Group>
            <Kbd>Enter</Kbd>
            <Text>Check/Next</Text>
          </Group>
          <Group>
            <Mouse />
            <Text>Zoom Image</Text>
          </Group>
        </Group>
      </Popover>
    </>
  );
}
