import { ActionIcon, Kbd, Menu, Text, Group, Popover } from "@mantine/core";
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
      >
        <Group direction="column">
          <Group>
            <Kbd>&gt;</Kbd>
            <Text>Next Image</Text>
          </Group>
          <Group>
            <Kbd>&lt;</Kbd>
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
