import {
  Accordion,
  Container,
  Divider,
  Group,
  Loader,
  Title,
  Text,
  Button,
  Anchor,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Question } from "../utils/types";

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/questions/getQuestions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  });
  return (
    <Container>
      <Group position="apart" mb="md">
        <Title order={2}>Quiz Questions</Title>
        <Button variant="outline">Add Question</Button>
      </Group>
      <Divider mb="md" />
      <Group position="center" grow>
        {loading ? (
          <Loader />
        ) : (
          <Accordion>
            {questions.map((question, i) => (
              <Accordion.Item
                key={i}
                mx="xl"
                label={
                  <AccordionLabel
                    label={question.term}
                    description={question.hint}
                  />
                }
              >
                {question.images.length > 0 ? (
                  <Group direction="column" spacing={0}>
                    {question.images.map((image, i) => {
                      return (
                        <Anchor
                          py={0}
                          my={0}
                          key={i}
                          href={image}
                          target="_blank"
                        >
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
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Group>
    </Container>
  );
}

interface AccordionLabelProps {
  label: string;
  description: string;
}

function AccordionLabel({ label, description }: AccordionLabelProps) {
  return (
    <Group noWrap>
      <Text>{label}</Text>
      <Text size="sm" color="dimmed" weight={400}>
        {description}
      </Text>
    </Group>
  );
}
