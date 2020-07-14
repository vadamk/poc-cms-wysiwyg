import React from 'react';
import ReactQuill from 'react-quill';

import 'snow.css';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ 'align': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link', 'image', 'video'],
  [{ 'background': [] }],
  ['clean']
];

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RichEditor = React.forwardRef<ReactQuill, RichEditorProps>(({
  value = '',
  onChange = () => null,
}, ref) => {

  const handleChange = (value: string) => {
    onChange(value);
  }

  return (
    <ReactQuill
      ref={ref}
      value={value}
      onChange={handleChange}
      modules={{
        clipboard: { matchVisual: false },
        toolbar: toolbarOptions
      }}
    />
  );
});

export default RichEditor;
