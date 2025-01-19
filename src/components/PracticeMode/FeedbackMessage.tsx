interface NoteFeedbackProps {
  correct: boolean | null; // `null` si no hay ningún intento aún
}

function FeedbackMessage({ correct }: NoteFeedbackProps) {
  if (correct === null)
    return (
      <div
        className={`mt-4 p-7 rounded-md text-center bg-white text-slate-700`}
      ></div>
    );

  const message = correct ? "Correct! 🎸" : "Try again! 🎼";
  const styles = correct
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className={`mt-4 p-4 rounded-md text-center ${styles}`}>{message}</div>
  );
}

export default FeedbackMessage;
