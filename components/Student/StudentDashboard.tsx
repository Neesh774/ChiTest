import React, { useEffect, useState } from "react";
import { Question, User } from "../../utils/types";

export default function StudentDashboard({ student }: { student: User }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/questions/getQuestions/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, [student]);
  return (
    <div>
      <h1>{student.name}</h1>
    </div>
  );
}
