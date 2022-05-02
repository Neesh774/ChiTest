import {
  ActionIcon,
  AspectRatio,
  Center,
  Container,
  Group,
  Image,
  Paper,
} from "@mantine/core";
import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "tabler-icons-react";
import { Question, Session } from "../../utils/types";

export default function ImageDisplay({ session }: { session: Session }) {
  const [images, setImages] = React.useState<string[]>([]);
  const [curImage, setCurImage] = React.useState<number>(0);
  const { questionPool } = session;

  useEffect(() => {
    setImages(randomizeImages(questionPool[0]));
  }, [questionPool]);

  const previousImage = () => {
    if (curImage > 0) {
      setCurImage(curImage - 1);
    }
  };

  const nextImage = () => {
    if (curImage < images.length - 1) {
      setCurImage(curImage + 1);
    }
  };

  return (
    <Center sx={{ display: "flex", flexDirection: "column" }}>
      <Image
        sx={{ objectFit: "scale-down" }}
        height={530}
        alt="Question"
        radius="md"
        src={images[curImage]}
      />
      <Group mt="md">
        <ActionIcon onClick={previousImage} disabled={curImage === 0}>
          <ArrowLeft />
        </ActionIcon>
        <ActionIcon
          onClick={nextImage}
          disabled={curImage === images.length - 1}
        >
          <ArrowRight />
        </ActionIcon>
      </Group>
    </Center>
  );
}

const randomizeImages = (question: Question) => {
  const images = question.images;
  const randomImages = [];
  while (images.length > 0) {
    const index = Math.floor(Math.random() * images.length);
    randomImages.push(images[index]);
    images.splice(index, 1);
  }
  return randomImages;
};
