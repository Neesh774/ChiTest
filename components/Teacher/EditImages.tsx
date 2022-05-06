import {
  TextInput,
  Button,
  Group,
  ActionIcon,
  Title,
  Grid,
  Text,
  Popover,
  Image,
  ScrollArea,
  Stack,
} from "@mantine/core";
import React, { useState, useRef } from "react";
import { X } from "tabler-icons-react";

export default function EditImages({
  images,
  setImages,
  show,
}: {
  images: string[];
  setImages: (images: string[]) => void;
  show: boolean;
}) {
  const viewport = useRef<HTMLDivElement>();
  if (!images) return null;

  const newImage = () => {
    setImages([...images, ""]);
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <Group direction="column" spacing="md" grow>
      <Title order={5}>Images</Title>

      <Stack>
        <ScrollArea style={{ height: 150 }} viewportRef={viewport}>
          {images.map((image, index) => (
            <ImageEditor
              src={image}
              index={index}
              setImages={setImages}
              images={images}
              key={index}
              show={show}
            />
          ))}{" "}
        </ScrollArea>
      </Stack>
      <Button size="xs" onClick={newImage} variant="outline" disabled={!show}>
        Add Image
      </Button>
    </Group>
  );
}

function ImageEditor({
  src,
  index,
  setImages,
  images,
  show,
}: {
  src: string;
  index: number;
  setImages: (images: string[]) => void;
  images: string[];
  show: boolean;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Group direction="row" my="sm">
      <Popover
        opened={opened && isValidHttpUrl(src)}
        position="left"
        placement="start"
        withArrow
        styles={{ popover: { width: "100%" } }}
        trapFocus={false}
        transition="pop-top-left"
        onFocusCapture={() => setOpened(true)}
        onBlurCapture={() => setOpened(false)}
        target={<div style={{ display: "none" }} />}
      >
        <Image
          src={src}
          alt="Preview"
          sx={{ objectFit: "scale-down" }}
          height={250}
        />
      </Popover>
      <TextInput
        type="url"
        value={src}
        disabled={!show}
        onChange={(e) =>
          setImages(
            images.map((img, i) => (i === index ? e.target.value : img))
          )
        }
        onFocusCapture={() => setOpened(true)}
        onBlurCapture={() => setOpened(false)}
        style={{ width: "80%" }}
      />
      <ActionIcon
        onClick={() => setImages(images.filter((_, i) => i !== index))}
        color="red"
        disabled={!show}
      >
        <X />
      </ActionIcon>
    </Group>
  );
}

function isValidHttpUrl(src: string) {
  let url;

  try {
    url = new URL(src);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
