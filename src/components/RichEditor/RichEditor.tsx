import React from 'react';
import ReactQuill from 'react-quill';

import './RichEditor.scss';

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image', 'video'],
  [
    { background: ['#FFF', '#D7F2F2'] },
    { color: ['#FFF', '#343636', '#959E9F', '#555D5D', '#FF486C'] },
  ],
  ['clean'],
];

const quillConfig = {
  clipboard: { matchVisual: false },
  toolbar: toolbarOptions,
};

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

const RichEditor = React.forwardRef<ReactQuill, RichEditorProps>(
  ({ value = '', onChange = () => null, onBlur = () => null }, ref) => {
    const handleChange = (value: string, delta, source, { getText }) => {
      onChange(getText().length > 1 ? value : '');
    };

    const handleBlur = () => {
      onBlur();
    };

    return (
      <ReactQuill
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        modules={quillConfig}
      />
    );
  },
);

export default RichEditor;
