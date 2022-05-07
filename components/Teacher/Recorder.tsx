import React from "react";
import { ActionIcon, Button, Group, Modal, Title } from "@mantine/core";
import { PlayerStop, Microphone } from "tabler-icons-react";
import { useReactMediaRecorder } from "react-media-recorder";

export default function Recorder({
  sound,
  setSound,
  name,
}: {
  sound: string;
  setSound: (sound: string) => void;
  name: string;
}) {
  const [opened, setOpened] = React.useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
    });
  return (
    <>
      {sound == null ? (
        <Button onClick={() => setOpened(true)}>Record a sound</Button>
      ) : (
        <Group>
          <Button onClick={() => setOpened(true)}>Edit Sound</Button>
          <audio src={sound} controls />
        </Group>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={4}>Record &quot;{name}&quot;</Title>}
      >
        <Group position="apart">
          <Button
            size="xs"
            color="red"
            onClick={() => {
              clearBlobUrl();
            }}
            variant="outline"
          >
            Remove Sound
          </Button>{" "}
          <Group>
            <ActionIcon
              onClick={startRecording}
              disabled={status === "recording"}
              color="green"
              variant="light"
              size="lg"
            >
              <Microphone />
            </ActionIcon>
            <ActionIcon
              onClick={stopRecording}
              disabled={status != "recording"}
              color="red"
              variant="light"
              size="lg"
            >
              <PlayerStop />
            </ActionIcon>
          </Group>
        </Group>
        <Group position="center" mt="xl">
          <audio src={mediaBlobUrl} controls />
        </Group>
        <Group position="apart" mt="xl">
          <Button
            onClick={() => {
              setOpened(false);
              clearBlobUrl();
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSound(mediaBlobUrl);
              setOpened(false);
            }}
            disabled={status == "recording"}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
