import { Text, Timeline } from "@mantine/core";
import React from "react";
import { ReportSession } from "../../utils/types";

export default function ReportTimeline({
  reports,
}: {
  reports: ReportSession[];
}) {
  return (
    <Timeline active={reports.length}>
      {reports.map((report, i) => {
        const actualResponses = report.responses.filter(
          (r) => r.attempts != -1
        ).length;
        return (
          <Timeline.Item
            color={
              actualResponses == report.responses.length ? "green" : "orange"
            }
            key={i}
          >
            <Text>
              Reviewed{" "}
              {actualResponses + (actualResponses == 1 ? " term" : " terms")}
            </Text>
            <Text size="xs" mt={4}>
              {new Date(report.date).toDateString()}
            </Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
