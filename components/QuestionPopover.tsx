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
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`/api/questions/getQuestion/${questionTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [questionTerm]);
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
          onClick={() => setOpened(error ? false : !opened)}
          underline
          style={{ cursor: error ? "" : "pointer" }}
        >
          {questionTerm}
        </Text>
      }
    >
      {!error &&
        (loading ? (
          <Group position="center">
            <Loader />
          </Group>
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
            <Text size="md" weight="500">
              Categories
            </Text>
            {question.categories.length > 0 ? (
              <Group direction="column" spacing={0}>
                {question.categories.map((category, i) => {
                  return (
                    <Text key={i}>
                      {category}
                      {i !== question.categories.length - 1 && ", "}
                    </Text>
                  );
                })}
              </Group>
            ) : (
              <Text color="gray" size="sm">
                No Categories
              </Text>
            )}
          </>
        ))}
      {error && (
        <Group position="center" grow>
          <Text color="red" size="md">
            Error loading question.
          </Text>
        </Group>
      )}
    </Popover>
  );
}
