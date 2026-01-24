"use client"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from 'next/dynamic';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // VS Code Dark Theme
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism));


const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4">
            <div className="absolute right-2 top-2 z-10">
                <button
                    onClick={handleCopy}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-md transition-all shadow-md"
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
            </div>
            <SyntaxHighlighter
                language={language || "javascript"}
                style={vscDarkPlus}
                customStyle={{
                    borderRadius: "12px",
                    padding: "1.5rem",
                    fontSize: "14px",
                    backgroundColor: "#1e1e1e",
                }}
                PreTag="div"
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export const FormattedMessage = ({ text }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const value = String(children).replace(/\n$/, "");

                    return !inline ? (
                        <CodeBlock language={language} value={value} />
                    ) : (
                        <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-red-600" {...props}>
                            {children}
                        </code>
                    );
                },
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold text-purple-600 border-b-2 border-purple-400 pb-1 mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold text-blue-600 border-l-4 border-blue-400 pl-2 mt-4 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 space-y-1" {...props} />
                ),
                a: ({ node, ...props }) => (
                    <a className="text-blue-600 underline hover:text-blue-800" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <span className="mb-2 leading-relaxed" {...props} />
                ),
            }}
        >
            {text}
        </ReactMarkdown>
    );
};