"use client";
import React, { useRef, useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OutputsectionProps {
  generatedContent: string;
  isLoading?: boolean;
  error?: string | null;
}

const Outputsection = ({ generatedContent, isLoading, error }: OutputsectionProps) => {
  const editorRef = useRef<Editor>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (editorRef.current && generatedContent) {
      const editorInstance = editorRef.current.getInstance();
      // Remove HTML tags but preserve formatting
      const cleanContent = generatedContent.replace(/<[^>]*>?/gm, '');
      editorInstance.setMarkdown(cleanContent);
      setEditorContent(cleanContent);
    }
  }, [generatedContent]);

  const handleCopy = async () => {
    if (!editorRef.current) {
      toast.error("Editor not ready");
      return;
    }

    try {
      const editorInstance = editorRef.current.getInstance();
      const currentContent = editorInstance.getMarkdown();

      if (!currentContent) {
        toast.error("No content to copy");
        return;
      }

      await navigator.clipboard.writeText(currentContent);
      
      toast.success("Content copied to clipboard!", {
        description: "You can now paste it anywhere.",
        action: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
        position: 'top-right'
      });
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy content", {
        description: "Please try again or check your browser permissions.",
        position: 'top-right'
      });
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      setEditorContent(editorInstance.getMarkdown());
    }
  };

  return (
    <div className='bg-white shadow-lg rounded-lg border mt-3'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='text-lg font-medium'>Your Result</h2>
        <Button 
          onClick={handleCopy}
          disabled={isLoading || !editorContent || isCopied}
          variant={isCopied ? "default" : "outline"}
          className="transition-all duration-200"
        >
          {isCopied ? (
            <>
              <Check className='w-4 h-4 mr-2' />
              Copied!
            </>
          ) : (
            <>
              <Copy className='w-4 h-4 mr-2' />
              Copy
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="p-10 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            Loading content...
          </div>
        </div>
      ) : error ? (
        <div className="p-10 text-red-500">
          {error}
        </div>
      ) : (
        <Editor
          ref={editorRef}
          initialValue="Your result will appear here"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          autofocus={false}
          onChange={handleEditorChange}
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'link'],
            ['code', 'codeblock'],
          ]}
          
        />
      )}
    </div>
  );
};

export default Outputsection;