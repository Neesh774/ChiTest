import {
  Drawer,
  Title,
  Paper,
  LoadingOverlay,
  Group,
  TextInput,
  ActionIcon,
  Switch,
  Button,
  Alert,
  Modal,
  Text,
  MultiSelect,
} from "@mantine/core";
import React, { useEffect } from "react";
import { AlertCircle, Trash } from "tabler-icons-react";
import { Question } from "../../utils/types";
import EditImages from "./EditImages";

export default function EditQuestion({
  selected,
  setSelected,
  setTableLoading,
}: {
  selected: Question;
  setSelected: (question: Question) => void;
  setTableLoading: (loading: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [term, setTerm] = React.useState(selected?.term);
  const [hint, setHint] = React.useState(selected?.hint);
  const [show, setShow] = React.useState(selected?.show);
  const [images, setImages] = React.useState(selected?.images);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    selected?.categories
  );
  const [categories, setCategories] = React.useState([]);
  const [error, setError] = React.useState("");
  const [deleteModal, setDeleteModal] = React.useState(false);

  useEffect(() => {
    fetch("/api/questions/getCategories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);
  const deleteQuestion = () => {
    setLoading(true);
    setDeleteModal(false);
    fetch("/api/questions/deleteQuestion/" + selected.id).then(() => {
      setSelected(undefined);
      setLoading(false);
      setTableLoading(true);
    });
  };
  const saveQuestion = async () => {
    if (term.length < 1) {
      setError("Please enter a term.");
      return;
    }
    if (hint.length < 1) {
      setError("Please enter a hint.");
      return;
    }
    if (images.some((image) => image.length < 1)) {
      setError("Please enter a valid image URL.");
      return;
    }
    setLoading(true);
    await fetch("/api/questions/updateQuestion/" + selected.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term,
        hint,
        images,
        show,
        categories: selectedCategories,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        setTableLoading(true);
        setSelected(undefined);
      } else {
        setError("Error updating question.");
      }
    });
  };
  return (
    <>
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title={<Title order={4}>Delete Question</Title>}
      >
        <Text>
          Are you sure you want to delete this question? You will not be able to
          recover its data.
        </Text>
        <Group position="apart" mt="md">
          <Button variant="outline" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={deleteQuestion}>
            Send it to the void!
          </Button>
        </Group>
      </Modal>
      <Paper
        p={0}
        sx={(theme) => ({
          position: "relative",
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <LoadingOverlay visible={loading} />
        <Group position="apart" mt="md" align="center">
          <TextInput
            disabled={!show}
            label="Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <ActionIcon onClick={() => setDeleteModal(true)} color="red">
            <Trash />
          </ActionIcon>
        </Group>
        <Group mt="md" direction="column" grow>
          <TextInput
            disabled={!show}
            label="Hint"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />
          <EditImages show={show} images={images} setImages={setImages} />
          <MultiSelect
            disabled={!show}
            label="Categories"
            data={categories}
            placeholder="Set question categories"
            creatable
            searchable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setCategories([...categories, query]);
            }}
            onChange={(value) => {
              setSelectedCategories(value);
            }}
            value={selectedCategories}
          />
        </Group>
        <Group my="lg" position="apart">
          <Switch
            label="Show Question"
            checked={show}
            onChange={(e) => setShow(e.currentTarget.checked)}
          />
          <Button onClick={saveQuestion}>Save</Button>
        </Group>
        {error && (
          <Alert
            title="Oopsie Daisy!"
            color="red"
            icon={<AlertCircle />}
            withCloseButton
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
      </Paper>
    </>
  );
}
