import { Anchor, Divider, Group, Loader, Popover, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Question } from "../utils/types";

export default function QuestionPopover({
  questionTerm,
}: {
  questionTerm: string;
}) {
  const [opened, setOpened] = useState(false);
  const [question, setQuestion] = useState<Question>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/questions/getQuestion/${questionTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setLoading(false);
      });
  });
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="top"
      placement="center"
      trapFocus={false}
      closeOnEscape={false}
      transition="pop"
      width={260}
      target={
        <Text
          onClick={() => setOpened(!opened)}
          underline
          style={{ cursor: "pointer" }}
        >
          {questionTerm}
        </Text>
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Text size="lg">{question.term}</Text>
          <Divider mb="sm" />
          <Text size="md" weight="500">
            Hint
          </Text>
          <Text color="gray">{question.hint}</Text>
          <Text size="md" weight="500">
            Images
          </Text>
          {question.images.length > 0 ? (
            <Group direction="column" spacing={0}>
              {question.images.map((image, i) => {
                return (
                  <Anchor py={0} my={0} key={i} href={image} target="_blank">
                    Image {i + 1}
                  </Anchor>
                );
              })}
            </Group>
          ) : (
            <Text color="gray" size="sm">
              No Images
            </Text>
          )}
        </>
      )}
    </Popover>
  );
}
