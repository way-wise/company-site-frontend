'use client';

import { useState, useEffect, useRef } from 'react';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
}

interface UploadAdapter {
  upload: () => Promise<{ default: string }>;
  abort: () => void;
}

interface FileLoader {
  file: Promise<File>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ClassicEditor: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CKEditorReact: any = null;

export function CKEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  disabled = false,
  height = 600,
}: CKEditorProps) {
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const loadEditor = async () => {
      if (!ClassicEditor) {
        const classicEditorModule = await import('@ckeditor/ckeditor5-build-classic');
        ClassicEditor = classicEditorModule.default;
      }
      if (!CKEditorReact) {
        const reactModule = await import('@ckeditor/ckeditor5-react');
        CKEditorReact = reactModule.CKEditor;
      }
      setIsReady(true);
    };

    loadEditor();
  }, []);

  if (!isMounted || !isReady || !CKEditorReact) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded border"
        style={{ height }}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <CKEditorReact
      editor={ClassicEditor}
      data={value || ''}
      disabled={disabled}
      config={{
        licenseKey: 'GPL',
        placeholder,
        language: 'en',
        enterMode: 'paragraph',
        shiftEnterMode: 'br',
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
          ]
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true
          }
        },
        fontSize: {
          options: [
            9,
            11,
            13,
            'default',
            17,
            19,
            21,
            24,
            27,
            30,
            32,
            36,
            40,
            48,
            72
          ],
          supportAllValues: true
        },
        fontFamily: {
          options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif'
          ],
          supportAllValues: true
        },
        toolbar: [
          'heading',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          'code',
          'removeFormat',
          '|',
          'link',
          'imageUpload',
          'imageInsert',
          'mediaEmbed',
          'blockQuote',
          'insertTable',
          'codeBlock',
          'horizontalLine',
          'specialCharacters',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          '|',
          'outdent',
          'indent',
          '|',
          'undo',
          'redo',
          '|',
          'sourceEditing'
        ],
      }}
      onReady={(editor: { getData: () => string; setData: (data: string) => void; plugins: { get: (name: string) => { createUploadAdapter: (loader: FileLoader) => UploadAdapter } | null } }) => {
        editorRef.current = editor;
        console.log('CKEditor is ready');
        
        // Configure custom upload adapter for base64 images
        editor.plugins.get('FileRepository')!.createUploadAdapter = (loader: FileLoader) => {
          return {
            upload: async () => {
              const file = await loader.file;
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    default: reader.result as string
                  });
                };
                reader.onerror = (error) => {
                  reject(error);
                };
                reader.readAsDataURL(file);
              });
            },
            abort: () => {}
          };
        };
        
        // Fix existing content - convert <br> inside headings to proper paragraph breaks
        const data = editor.getData();
        if (data) {
          // Replace <br><br> inside heading tags with proper paragraph closings
          let fixedData = data.replace(/<(h[1-6])>([^<]*?)<br\s*\/?><br\s*\/?>(.*?)<\/\1>/gi, '<$1>$2</$1><p>$3</p>');
          // Replace single <br> inside headings with paragraph breaks
          fixedData = fixedData.replace(/<(h[1-6])>([^<]*?)<br\s*\/?>(.*?)<\/\1>/gi, '<$1>$2</$1><p>$3</p>');
          if (fixedData !== data) {
            editor.setData(fixedData);
          }
        }
      }}
      onChange={(_event: unknown, editor: { getData: () => string }) => {
        const data = editor.getData();
        console.log('Editor HTML:', data);
        onChange(data);
      }}
    />
  );
}
