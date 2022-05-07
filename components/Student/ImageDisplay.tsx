import { ActionIcon, Center, Group, Image, Loader } from "@mantine/core";
import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight, ClipboardX } from "tabler-icons-react";
import { Question, Session } from "../../utils/types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useHotkeys } from "@mantine/hooks";

export default function ImageDisplay({ session }: { session: Session }) {
  const [images, setImages] = React.useState<string[]>([]);
  const [curImage, setCurImage] = React.useState<number>(0);

  useEffect(() => {
    setImages(randomizeImages(session.questionPool[0]));
    setCurImage(0);
  }, [session.questionPool]);

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

  useHotkeys([
    ["ArrowRight", nextImage],
    ["ArrowLeft", previousImage],
  ]);

  return (
    <Center sx={{ display: "flex", flexDirection: "column" }}>
      {images.length > 0 ? (
        <TransformWrapper wheel={{ step: 0.05 }}>
          <TransformComponent>
            <Image
              sx={{ objectFit: "scale-down" }}
              height={530}
              alt="Question"
              radius="md"
              src={images[curImage]}
              withPlaceholder
              placeholder={<ClipboardX />}
            />
          </TransformComponent>
        </TransformWrapper>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
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
  const images = [...question.images];
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images;
};
