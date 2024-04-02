import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { marked } from "marked";
import PropTypes from "prop-types";
import { OpenAIOutlined } from "@ant-design/icons";
import { Button, Space, Spin } from "antd";
import HRH from "../assets/hrh.gif"

const CustomButton = ({ isLoading }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "antiquewhite",
      width: 130,
      height: 30,
      marginBottom: 15,
      marginTop:-4,
      borderRadius: 5,
      padding: 10,
    
    }}
    className="text-white  sm:w-1/2  h-10  mb-2  bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm  text-center "
  >

    {isLoading ? (

        <img src={HRH} style={{ width: 25, height: 25,marginLeft:40 }} />

    ) : (
      <>
        <OpenAIOutlined className="mr-1 mb-1" />
        <p>AI ile Oluştur</p>
      </>
    )}
  </div>
);

const CustomToolbar = ({ handleAskAi, isLoading }) => (
  <div id="toolbar">
    {console.log("TT" + isLoading)}
    <select
      className="ql-header"
      defaultValue={""}
      onChange={(e) => e.persist()}
    >
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>

    <button className="ql-bold"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
    <button className="ql-italic"></button>

    <Button disabled={isLoading} className="ql-insertStar mb-1" onClick={handleAskAi}>
      <CustomButton isLoading={isLoading} />
    </Button>
  </div>
);

const Editor = ({ placeholder, setContent, initialContent, handleAskAi, isLoading }) => {
  const [content, setContent2] = useState(initialContent || "");

  const handleChange = (value) => {
    setContent(value);
    console.log("content editor: ", content);
    setContent2(value);
  };

  return (
    <div className="text-editor">
      <CustomToolbar handleAskAi={handleAskAi}
        isLoading={isLoading}
      />
      <ReactQuill
        className="h-[400px]"
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        modules={Editor.modules}

      />
    </div>
  );
};

Editor.modules = {
  toolbar: {
    container: "#toolbar",

  },
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

Editor.propTypes = {
  placeholder: PropTypes.string,
  setContent: PropTypes.func.isRequired,
  initialContent: PropTypes.string,
};

const EditableContent = ({ content, setContent, handleAskAi, isLoading }) => {
  const [htmlContent, setHtmlContent] = useState(marked(content));

  useEffect(() => {
    setHtmlContent(marked(content));
    console.log("XX:" + isLoading);
  }, [content, isLoading]);

  return (
    <div>
      <Editor
        placeholder={"İş Tanımını Yazınız veya Yapay Zeka ile Oluşturun"}
        setContent={setContent}
        initialContent={htmlContent}
        handleAskAi={handleAskAi}
        isLoading={isLoading}
      />
    </div>
  );
};

EditableContent.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
};

export default EditableContent;
