export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "active":
      return "green";
    case "pending":
      return "orange";
    case "rejected":
      return "red";
    case "refund":
      return "purple";
    case "processing":
      return "blue";
    case "created":
      return "cyan";
    case "blocked":
      return "gray";
    default:
      return "default";
  }
};


export function toIST(dateInput) {
  if (!dateInput) return "--"; // handle undefined/null

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--"; // handle invalid date

  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

