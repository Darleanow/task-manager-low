export function formatDate(p_Date, includeYear = true) {
  const formattedDate = new Date(p_Date);

  const options = {
    month: "short",
    day: "numeric",
  };

  if (includeYear) {
    options.year = "numeric";
  }

  return formattedDate.toLocaleDateString("en-US", options);
}
