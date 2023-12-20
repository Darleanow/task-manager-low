import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorProvider,
  useEditor,
  EditorContent,
  Extension,
} from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

import { FaRegFileCode } from "react-icons/fa6";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaQuoteLeft,
} from "react-icons/fa";
import { HiListBullet } from "react-icons/hi2";
import { GoListOrdered } from "react-icons/go";
import { IoRemoveOutline } from "react-icons/io5";

import "./RichText.scss";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="mb-option_bar">
        <FaBold
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active option" : "option"}
        />
        <FaItalic
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active option" : "option"}
        />
        <FaStrikethrough
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active option" : "option"}
        />
        <FaCode
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active option" : "option"}
        />
        <HiListBullet
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "is-active option" : "option"
          }
        />
        <GoListOrdered
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "is-active option" : "option"
          }
        />
        <FaRegFileCode
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock") ? "is-active option" : "option"
          }
        />
        <FaQuoteLeft
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote") ? "is-active option" : "option"
          }
        />
        <IoRemoveOutline
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="option"
        />
      </div>
    </>
  );
};

const RichText = ({ onEditorChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),

      Placeholder.configure({
        placeholder: "Write something magical !",
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onEditorChange(content);
    },
  });

  const focusEditor = () => {
    if (editor) {
      editor.view.focus();
    }
  };

  return (
    <div className="editor-container" onClick={focusEditor}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="ec-editor_content" />
    </div>
  );
};

export default RichText;
