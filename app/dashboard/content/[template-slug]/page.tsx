"use client";
import React, { useState } from "react";
import Formsection from "../_component/Formsection";
import Outputsection from "../_component/Outputsection";
import { TEMPLATE } from "../../_component/Templetelistsection";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {db} from "../../../../utils/db";
import { AIOutput } from "../../../../utils/Schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useContent } from '../../../../utils/contexts/ContentContext';
import { useParams } from "next/navigation";

interface PageProps {
  params: {
    "template-slug": string;
  };
}

interface FormData {
  [key: string]: string;
}

const API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!;

const CreateNewContent = (props: PageProps) => {//props: PageProps

  const params = useParams();
  const templateSlug = params["template-slug"];

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const {user} =useUser();
  
    // const { setContentCount } = useContent();
    const { fetchContentCount } = useContent();

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === props.params["template-slug"]
  );
  //   const selectedTemplate: TEMPLATE | undefined = Templates?.find(
  //   (item) => item.slug === templateSlug
  // );


  const generateAIContent = async (formData: FormData): Promise<void> => {
    const selectedPrompt = selectedTemplate?.aiPrompt || "";
    const finalPrompt = JSON.stringify(formData) + ", " + selectedPrompt;

    setIsLoading(true);
    setGeneratedContent("");
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 10, 90));
    }, 300);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();
      

      setGeneratedContent(text);
      await fetchContentCount();
      await SaveInDb(formData,selectedTemplate?.slug,text);
      
      // setContentCount(prev => prev + 1);

      console.log("Generated Content:", text);
      setProgress(100);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setGeneratedContent("Error generating content. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const SaveInDb=async(formData:any,slug:any,aiResp:any)=>{
    const result=await db.insert(AIOutput).values(
   {
    formdata: JSON.stringify(formData),
    templateSlug:slug,
    aiResponse:aiResp,
    createdBy:user?.primaryEmailAddressId,
    createdAt:moment().format("YYYY-MM-DD HH:mm:ss"),
  
      }
    )

    console.log("Data saved in DB:", result);
  }

  return (
    <div className="relative">
      <Link href="/dashboard">
        <Button className="mt-2 ml-3">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        <Formsection
          selectedTemplete={selectedTemplate}
          userFormInput={generateAIContent}
          
        />

        <div className="col-span-2 relative min-h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {/* Animated AI Loader */}
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 animate-pulse"></div>
                
                {/* Neural Network Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-12 bg-blue-500 rounded-full opacity-70"
                        style={{
                          left: '50%',
                          transform: `rotate(${i * 45}deg) translateY(-20px)`,
                          animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full max-w-md px-4">
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-300 font-medium">
                  {progress < 30 && "Initializing AI models..."}
                  {progress >= 30 && progress < 70 && "Generating content..."}
                  {progress >= 70 && "Polishing the results..."}
                </p>
              </div>

              {/* Floating Tech Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-blue-400 opacity-20"
                    style={{
                      fontSize: `${Math.random() * 12 + 8}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${Math.random() * 8 + 4}s infinite ease-in-out`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  >
                    {['</>', '{ }', 'AI', 'ML', '() =>', '[]'][Math.floor(Math.random() * 6)]}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Outputsection  generatedContent={generatedContent}
              isLoading={isLoading}
              error={error} />
          )}
        </div>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(5px) rotate(2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.8); }
        }
      `}</style>
    </div>
  );
};

export default CreateNewContent;