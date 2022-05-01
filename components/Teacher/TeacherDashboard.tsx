import {
  Aside,
  Button,
  Divider,
  Group,
  MediaQuery,
  Navbar,
  Title,
  Text,
  ThemeIcon,
  UnstyledButton,
  AppShell,
  Burger,
  Footer,
  Header,
  useMantineTheme,
} from "@mantine/core";
import React, { ReactNode, useState } from "react";
import ToggleTheme from "../ToggleTheme";
import { Report, ClipboardList } from "tabler-icons-react";
import TeacherReports from "./TeacherReports";
import TeacherQuestions from "./TeacherQuestions";
export default function TeacherDashboard({ logOut }: { logOut: () => void }) {
  const [tab, setTab] = useState<"stats" | "quiz">("stats");
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <MenuItem
            tab="stats"
            current={tab}
            setTab={setTab}
            color="blue"
            icon={<Report />}
            label="Reports"
          />
          <MenuItem
            tab="quiz"
            current={tab}
            setTab={setTab}
            color="green"
            icon={<ClipboardList />}
            label="Questions"
          />
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
              padding: "0 1rem",
            }}
          >
            <div>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Title>ChiTest</Title>
            </div>
            <Group>
              <ToggleTheme />
              <Button size="xs" variant="light" onClick={logOut}>
                Sign Out
              </Button>
            </Group>
          </div>
        </Header>
      }
    >
      {tab === "stats" ? <TeacherReports /> : <TeacherQuestions />}
    </AppShell>
  );
}

const MenuItem = ({
  icon,
  label,
  color,
  setTab,
  current,
  tab,
}: {
  icon: ReactNode;
  label: string;
  color: string;
  setTab: (value: "stats" | "quiz") => void;
  current: string;
  tab: "stats" | "quiz";
}) => {
  return (
    <UnstyledButton
      my={4}
      onClick={() => setTab(tab)}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor:
          current == tab
            ? theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
            : theme.colorScheme === "dark"
            ? "transparent"
            : theme.colors.white,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};
