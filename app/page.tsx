"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaUser } from 'react-icons/fa';

export default function CleanIntro() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  

  const contentData = [
    {
      name: 'Blog Post',
      lines: [
        'Write a detailed and engaging travel blog about my recent trip to Manali.',
        'Include descriptions of the top attractions, local culture, food experiences,',
         'and travel tips for first-time visitors. '
      ]
    },
    {
      name: 'Social Media',
      lines: [
        'Generate a LinkedIn post about professional growth and learning,',
        'with a call-to-action for connections to share their experiences.',
      ]
    },
    {
      name: 'Code Review',
      lines: [
        'Review this React component code for rendering a list. Suggest improvements for performance and readability.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      <header className='mt-2 flex justify-between p-5'>
        <div className=' ml-10 '>
       <Image src={"/logo.svg"} alt="logo" width={120} height={120} />
        </div>
       

        <Link href="/dashboard" className='mr-10 flex items-center gap-2 text-gray-800 hover:text-pink-500 transition-colors'>
           <div className="w-px h-6 bg-gray-300" />
         <FaUser />
        Get Started
        </Link>

      </header>
       <hr className='bg-gray-400 shadow-lg' />

<main className=" hero-section w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Create Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Effortlessly</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate high-quality content in seconds with our intuitive AI assistant.
          </p>
        </header>

        {/* Animated Tabs */}
        <div className="mb-16 max-w-4xl items-center mx-auto">
          <div className="flex justify-center space-x-2 mb-8">
            {contentData.map((tab, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === index ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => setActiveTab(index)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="flex space-x-2 mr-4">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-3"></div>
              </div>

              <div className="space-y-4 min-h-[120px]">
                {contentData[activeTab].lines.map((line, index) => (
                  <div 
                    key={index}
                    className="relative overflow-hidden"
                    style={{
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Actual text (invisible but affects layout) */}
                    <div className="opacity-0 h-4 flex items-center text-sm">
                      {line}
                    </div>
                    
                    {/* Blur effect with text reflection */}
                    <div className="absolute inset-0 flex items-center">
                      <div 
                        className="h-4 rounded-full relative overflow-hidden"
                        style={{
                          width: index === 0 ? '75%' : index === 1 ? '85%' : index === 2 ? '65%' : '100%',
                          background: `linear-gradient(90deg, 
                            rgba(229, 231, 235, 0.3) 0%,
                            rgba(229, 231, 235, 0.8) 20%,
                            rgba(229, 231, 235, 1) 50%,
                            rgba(229, 231, 235, 0.8) 80%,
                            rgba(229, 231, 235, 0.3) 100%
                          )`,
                          backdropFilter: 'blur(1px)'
                        }}
                      >
                        {/* Text reflection inside the blur */}
                        <div className="absolute inset-0 flex items-center px-3 text-xs text-gray-400 opacity-60 font-medium tracking-wide">
                          <span className="truncate">
                            {line}
                          </span>
                        </div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Simple Interface",
              description: "Clean design that gets out of your way",
              icon: (
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              )
            },
            {
              title: "Quality Output",
              description: "Human-like content every time",
              icon: (
                <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              )
            },
            {
              title: "Multiple Formats",
              description: "Create any type of content",
              icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              )
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-all transform hover:scale-105">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-pink-50 via-violet-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Join thousands of creators saving time with our AI</p>
          <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            Try It Free
          </button>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100 text-center text-gray-500">
        © {new Date().getFullYear()} AI Content Creator. All rights reserved.
      </footer>
    </div>
  );
}