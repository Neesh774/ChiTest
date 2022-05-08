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
          <Button
            size="xs"
            color="red"
            onClick={() => {
              clearBlobUrl();
            }}
            variant="outline"
            disabled={
              status === "recording" ||
              (sound === null && mediaBlobUrl === null)
            }
          >
            Remove Sound
          </Button>
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
            disabled={status == "recording"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpened(false);
              const reader = new FileReader();
              reader.readAsDataURL(new Blob([mediaBlobUrl]));
              reader.onload = () => {
                const result = reader.result as string;
                setSound(result.substring(result.indexOf(",") + 1));
              };
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