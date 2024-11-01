declare module 'react-file-previewer' {
  interface FilePreviewerProps {
    url: string;
    mimeType?: string;
    className?: string;
  }
  
  export const FilePreview: React.FC<FilePreviewerProps>;
} 