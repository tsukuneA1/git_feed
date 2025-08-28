"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageTag } from "@/components/language-tag";

import React,{useState} from "react";
import { Plus, X } from "lucide-react";


  const languages:string[] = ["ai", "cloud", "elixer","python","react","java","gaming", "javascript",
  ".net", "mobile", "testing", "tools", "data-science", "architecture", "crypto",
  "security", "database", "machine-learning", "webdev", "rust", "ruby", "devops",
  "open-source", "golang", "tech-news", "nodejs", "npm", "typescript"];

  export default function App(){
  const[selected, setSelected]=useState<{[Key:string]:boolean}>({});

  const toggle = (language:any) =>{
    setSelected((prev)=>({...prev,[language]:!prev[language]}));
};
  
  return (
    <div className="flex flex-wrap gap-2 p-4 bg black text-sm font-medium">
      {languages.map((language) => (
        <button key={language} 
        onClick={() => toggle(language)}
        className={`px-4 py-2 rounded-lg border transition
            ${selected[language] ? "bg-white text-black" : "bg-black text-white border-white"}`}
        >
          {language}
          <span className="ml-1 text">
          {selected[language]?"×":"+"}
          </span>
        </button>
      ))}
    </div>
  );
}


