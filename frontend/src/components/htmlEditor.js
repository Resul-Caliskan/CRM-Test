import React, { useState, useEffect } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";

const EditableContent = ({ content, setContent }) => {
  useEffect(() => {
    
  }, [content]);

  const [markdownContent, setMarkdownContent] = useState(content);

  const handleEditorChange = (value) => {
    setMarkdownContent(value);
    setContent(value);
  };

  return (
    <div className="grid grid-cols-2 gap-6 min-h-[400px] border-2 p-3 text-indigo-500">
      <MarkdownEditor
        style={{ backgroundColor: "#0000000F" }}
        width="100%"
        value={markdownContent}
        onChange={(source) => {
          handleEditorChange(source);
        }}
      />
      <div
        style={{
          backgroundColor: "#0000000F",
          padding: "10px",
          maxHeight: "100%",
          overflowY: "auto",
          borderRadius: 10,
        }}
      >
        <MarkdownEditor.Markdown
          source={markdownContent}
          className="bg-gray-300"
          style={{
            backgroundColor: "#0000000F",
            color: "black",
            padding: 10,
            borderRadius: 10,
          }}
        />
      </div>
    </div>
  );
};

export default EditableContent;
