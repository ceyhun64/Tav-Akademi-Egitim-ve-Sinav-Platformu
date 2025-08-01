// src/components/QuestionEditor.jsx
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function QuestionEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "removeFormat",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "link",
          "blockQuote",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "alignment",
          "|",
          "codeBlock",
          "code",
          "|",
          "fullscreen",
        ],
        // CKEditor Classic build'ın height ayarı için css kullanılır
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
