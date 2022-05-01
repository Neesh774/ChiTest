import {
  TextInput,
  Button,
  Group,
  ActionIcon,
  Title,
  Grid,
} from "@mantine/core";
import React from "react";
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
        <Grid key={index}>
          <Grid.Col span={11}>
            <TextInput
              type="url"
              value={image}
              onChange={(e) =>
                setImages(
                  images.map((img, i) => (i === index ? e.target.value : img))
                )
              }
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
