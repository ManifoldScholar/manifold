export const labels = {
  p: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  ol: "Numbered List",
  ul: "Bulleted List",
  blockquote: "Block Quote",
  link: "Link",
  pre: "Code Block",
  italic: "Italic",
  strikethrough: "Strikethrough",
  bold: "Bold",
  underline: "Underline",
  code: "Code",
  undo: "Undo",
  redo: "Redo",
  img: "Image",
  iframe: "Iframe"
};

export const descriptions = {
  img: "Paste an image URL into the editor to insert.",
  iframe:
    "Paste a YouTube or Vimeo embed URL into the editor to insert. Insert other iframe content via the modal."
};

export const hotkeys = {
  p: [
    { label: "Mac", keys: ["Cmd", "Option", "0"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "0"] }
  ],
  h1: [
    { label: "Mac", keys: ["Cmd", "Option", "1"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "1"] },
    { label: "Markdown", keys: ["#", "Space"] }
  ],
  h2: [
    { label: "Mac", keys: ["Cmd", "Option", "2"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "2"] },
    { label: "Markdown", keys: ["##", "Space"] }
  ],
  h3: [
    { label: "Mac", keys: ["Cmd", "Option", "3"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "3"] },
    { label: "Markdown", keys: ["###", "Space"] }
  ],
  h4: [
    { label: "Mac", keys: ["Cmd", "Option", "4"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "4"] },
    { label: "Markdown", keys: ["####", "Space"] }
  ],
  h5: [
    { label: "Mac", keys: ["Cmd", "Option", "5"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "5"] },
    { label: "Markdown", keys: ["#####", "Space"] }
  ],
  h6: [
    { label: "Mac", keys: ["Cmd", "Option", "6"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "6"] },
    { label: "Markdown", keys: ["######", "Space"] }
  ],
  ol: [
    { label: "Mac", keys: ["Cmd", "Option", "7"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "7"] },
    { label: "Markdown", keys: ["1.", "Space"] }
  ],
  ul: [
    { label: "Mac", keys: ["Cmd", "Option", "8"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "8"] },
    { label: "Markdown", keys: ["-", "Space"] }
  ],
  blockquote: [
    { label: "Mac", keys: ["Cmd", "Option", "9"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "9"] },
    { label: "Markdown", keys: [">", "Space"] }
  ],
  link: [
    { label: "Mac", keys: ["Cmd", "K"] },
    { label: "Windows", keys: ["Ctrl", "K"] }
  ],
  pre: [
    { label: "Mac", keys: ["Cmd", "Option", "E"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "E"] },
    { label: "Markdown", keys: ["```", "Space"] }
  ],
  italic: [
    { label: "Mac", keys: ["Cmd", "I"] },
    { label: "Windows", keys: ["Ctrl", "I"] },
    { label: "Markdown", keys: ["*", "*"], inline: true }
  ],
  strikethrough: [
    { label: "Mac", keys: ["Cmd", "Shift", "S"] },
    { label: "Windows", keys: ["Ctrl", "Shift", "S"] },
    { label: "Markdown", keys: ["~", "~"], inline: true }
  ],
  bold: [
    { label: "Mac", keys: ["Cmd", "B"] },
    { label: "Windows", keys: ["Ctrl", "B"] },
    { label: "Markdown", keys: ["**", "**"], inline: true }
  ],
  underline: [
    { label: "Mac", keys: ["Cmd", "U"] },
    { label: "Windows", keys: ["Ctrl", "U"] }
  ],
  code: [
    { label: "Mac", keys: ["Cmd", "E"] },
    { label: "Windows", keys: ["Ctrl", "E"] },
    { label: "Markdown", keys: ["`", "`"], inline: true }
  ],
  undo: [
    { label: "Mac", keys: ["Cmd", "Z"] },
    { label: "Windows", keys: ["Ctrl", "Z"] }
  ],
  redo: [
    { label: "Mac", keys: ["Cmd", "Shift", "Z"] },
    { label: "Windows", keys: ["Ctrl", "Y"] }
  ],
  img: [
    { label: "Mac", keys: ["Cmd", "G"] },
    { label: "Windows", keys: ["Ctrl", "G"] }
  ],
  iframe: [
    { label: "Mac", keys: ["Cmd", "M"] },
    { label: "Windows", keys: ["Ctrl", "M"] }
  ]
};
