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
} from "@mantine/core";
import React, { useState } from "react";
import { X } from "tabler-icons-react";

export default function EditImages({
  images,
  setImages,
}: {
  images: string[];
  setImages: (images: string[]) => void;
}) {
  if (!images) return null;
  return (
    <Group direction="column" spacing="md" grow>
      <Title order={5}>Images</Title>
      {images.map((image, index) => (
        <ImageEditor
          src={image}
          index={index}
          setImages={setImages}
          images={images}
          key={index}
        />
      ))}
      <Button
        size="xs"
        onClick={() => setImages([...images, ""])}
        variant="outline"
      >
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
}: {
  src: string;
  index: number;
  setImages: (images: string[]) => void;
  images: string[];
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Grid>
      <Popover
        opened={opened}
        position="left"
        placement="start"
        withArrow
        styles={{ popover: { width: "100%" } }}
        trapFocus={false}
        transition="pop-top-left"
        onFocusCapture={() => setOpened(true)}
        onBlurCapture={() => setOpened(false)}
        target={<div />}
      >
        {isValidHttpUrl(src) ? (
          <Image
            src={src}
            alt="Preview"
            sx={{ objectFit: "scale-down" }}
            height={250}
          />
        ) : (
          <Text>This is not a valid URL. Please enter a valid URL.</Text>
        )}
      </Popover>
      <Grid.Col span={11}>
        <TextInput
          type="url"
          value={src}
          onChange={(e) =>
            setImages(
              images.map((img, i) => (i === index ? e.target.value : img))
            )
          }
          onFocusCapture={() => setOpened(true)}
          onBlurCapture={() => setOpened(false)}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <ActionIcon
          onClick={() => setImages(images.filter((_, i) => i !== index))}
          color="red"
        >
          <X />
        </ActionIcon>
      </Grid.Col>
    </Grid>
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
