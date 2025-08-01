// src/components/QuestionEditor.jsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function QuestionEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="9hajysd1lxduo622xk9stunofpbko3eftnwayii3bhf9wwbw"
      value={value} /* dışarıdan gelen HTML içeriğini buraya koy */
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist | removeformat | help",
      }}
      onEditorChange={(content, editor) => {
        onChange(content); /* her değişmede CreatePoolImg’e bildir */
      }}
    />
  );
}
