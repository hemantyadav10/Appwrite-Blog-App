import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useThemeContext } from '../context/UserContext';
import { useContentContext } from '../context/EditorContent';


function TextEditor() {
  const editorRef = useRef(null);
  const { content, setContent } = useContentContext()
  const { theme } = useThemeContext();


  const onChange = () => {
    const wordCount = editorRef.current.plugins.wordcount.getCount();
    let readTime = wordCount / 250;
    setContent({ content: editorRef.current.getContent(), readTime: readTime })
  }

  return (
    <div>
      <Editor
        apiKey={String(import.meta.env.VITE_EDITOR_API_KEY)}
        onInit={(_evt, editor) => editorRef.current = editor}
        value={content.content}
        init={{
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : '',
          height: 500,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'wordcount', 'codesample '
          ],
          toolbar: ' undo redo | blocks  | bold italic underline forecolor codesample code preview| align  lineheight numlist bullist | fontfamily | indent outdent | link image media table  |  emoticons charmap strikethrough|  ',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          codesample_languages: [  // Optional: Define supported languages for code snippets
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'React (JSX)', value: 'jsx' }
          ],
          codesample_global_prismjs: true
        }}
        onEditorChange={onChange}
      />
    </div>
  );
}


export default React.memo(TextEditor);