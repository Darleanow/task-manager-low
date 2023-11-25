/**
 * This method has 1 parameter:
 * - *p_Color*: Provided by caller, which is a background color
 * of a component...
 *
 * And returns if the text shall be white or black
 * (In Hex string)
 */
export function getTextColorFromBackground(p_Color) {
  const r = parseInt(p_Color.substr(1, 2), 16);
  const g = parseInt(p_Color.substr(3, 2), 16);
  const b = parseInt(p_Color.substr(5, 2), 16);

  // Calculate luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // If luminance below 128, text will be white, else black
  return luminance < 220 ? "#FFFFFF" : "#000000";
}

/**
 * This method has 1 parameter:
 * - *p_Date*: Provided by caller, which is a date
 *
 * And returns if the date shall be red black depending on time left
 * (7 Days right now, could be configureable after...)
 * (In Hex string)
 */
export function getTextColorFromDueDate(p_Date) {
  const current_date = Date.now();
  const due_date = new Date(p_Date);

  const difference = due_date - current_date;

  // Difference is made in days
  const daysDifference = difference / (1000 * 3600 * 24);

  return daysDifference < 7 ? "#C70039" : "#000000";
}
