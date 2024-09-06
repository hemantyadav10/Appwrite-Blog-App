import { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    content: '',
    readTime: 0
  });
  const editorData = {
    content,
    setContent
  }
  return (
    <ContentContext.Provider value={editorData}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContentContext = () => useContext(ContentContext);