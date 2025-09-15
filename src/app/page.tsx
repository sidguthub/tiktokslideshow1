"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import Moveable from "react-moveable";

const Loader = () => (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading...</span>
    </div>
);


export default function SlideshowEditor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [text, setText] = useState(
    "enter you text here"
  );
  const [fontSize, setFontSize] = useState<number>(28);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const resizeStartValues = useRef({ width: 0, fontSize: 0 });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setIsLoading(true);
      setImageSrc(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setTimeout(() => {
          centerText();
          setIsSelected(true);
          setIsLoading(false);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const centerText = () => {
     if (textRef.current && imageContainerRef.current) {
        textRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
        textRef.current.style.width = '90%';

        const containerRect = imageContainerRef.current.getBoundingClientRect();
        const textRect = textRef.current.getBoundingClientRect();
        
        const initialX = (containerRect.width / 2) - (textRect.width / 2);
        const initialY = (containerRect.height / 2) - (textRect.height / 2);
        
        textRef.current.style.transform = `translate(${initialX}px, ${initialY}px) rotate(0deg)`;
     }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const moveableControlBox = document.querySelector(".moveable-control-box");
      if (
        textRef.current &&
        !textRef.current.contains(e.target as Node) &&
        (!moveableControlBox || !moveableControlBox.contains(e.target as Node))
      ) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto p-4 md:p-8 w-full h-full items-center font-sans">
      
      <div
        ref={imageContainerRef}
        className="relative w-full max-w-md mx-auto aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl bg-gray-800 border-4 border-gray-700 flex items-center justify-center"
      >
        {isLoading && <Loader />}

        {!isLoading && !imageSrc && (
           <p className="text-gray-400">Upload an image to start</p>
        )}
        
        {imageSrc && (
            <Image
                src={imageSrc}
                alt="Slideshow background"
                fill
                className="object-cover z-0"
                unoptimized
            />
        )}

        {!isLoading && imageSrc && (
          <>
            <div
              ref={textRef}
              className="absolute cursor-move select-none"
              style={{
                top: 0,
                left: 0,
                textAlign: 'center', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
              onClick={() => setIsSelected(true)}
            >
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  color: 'black',
                  fontSize: `${fontSize}px`,
                  fontWeight: isBold ? 600 : 400,
                  fontStyle: isItalic ? "italic" : "normal",
                  letterSpacing: '-0.03em', 
                  lineHeight: 1.4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '0.25em 0.5em',
                  borderRadius: '0.25em',
                  display: 'inline', 
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                }}
              >
                {text}
              </span>
            </div>

            <Moveable
              target={isSelected ? textRef.current : null}
              draggable={true}
              rotatable={true}
              resizable={true}
              keepRatio={false} 
              origin={false}
              snappable={true}
              bounds="parent"
              onDrag={e => {
                e.target.style.transform = e.transform;
              }}
              onRotate={e => {
                e.target.style.transform = e.transform;
              }}
              onResizeStart={e => {
                const target = e.target as HTMLElement;
                resizeStartValues.current = {
                  width: target.offsetWidth,
                  fontSize: fontSize,
                };
              }}
              onResize={e => {
                const { width: initialWidth, fontSize: initialFontSize } = resizeStartValues.current;
                if (initialWidth === 0) return;
                
                const scale = e.width / initialWidth;
                setFontSize(initialFontSize * scale);
                
                const target = e.target as HTMLElement;
                target.style.width = `${e.width}px`;
                target.style.transform = e.drag.transform;
              }}
            />
          </>
        )}
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-center text-gray-100">Customize Overlay</h2>
          
          <div>
            <label htmlFor="image-upload" className="font-medium text-gray-300 block mb-2">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="text-input" className="font-medium text-gray-300 block mb-2">
              Enter Text
            </label>
            <textarea
              id="text-input"
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-white outline-none transition"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
            />
          </div>

          <div>
            <label htmlFor="font-size-slider" className="font-medium text-gray-300">
              Font Size: {Math.round(fontSize)}px
            </label>
            <input
              id="font-size-slider"
              type="range"
              min={8}
              max={150}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsBold(b => !b)} 
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${isBold ? 'bg-gray-200 text-black' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Bold
            </button>
            <button 
              onClick={() => setIsItalic(i => !i)} 
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${isItalic ? 'bg-gray-200 text-black' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Italic
            </button>
          </div>
          
          <button
            onClick={centerText}
            className="w-full py-2 rounded-lg font-semibold transition-colors bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Reset Position
          </button>
        </div>
      </div>
    </main>
  );
}

