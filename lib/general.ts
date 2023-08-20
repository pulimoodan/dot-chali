export function convertTimeToSince(date: Date) {
  const today = new Date();
  var seconds = Math.floor((today.getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minutes ago";
  }
  return Math.floor(seconds) + " Seconds ago";
}

export function shortenContent(inputString: string, lineCount: number) {
  const lines = inputString.split("\\n");
  if (lines.length <= lineCount) {
    return inputString;
  }

  const shortenedLines = lines.slice(0, lineCount);
  return shortenedLines.join("\n");
}

export async function copyToClipboard(content: string) {
  const el = document.createElement("textarea");
  el.value = content;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(el);
}
