import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight, 
  Download, 
  Cpu, 
  Database, 
  Code, 
  Terminal, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Bot,
  Search,
  PlayCircle,
  FileText,
  MessageSquare, 
  X, 
  Send, 
  User, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

// --- DATA: RESUME CONTEXT (The "Knowledge Base" for RAG) ---
const RESUME_CONTEXT = `
YOU ARE A RAG CHATBOT CREATED BY JAYESH VISHWAKARMA.
You are integrated directly into Jayesh's portfolio website to showcase his skills in Generative AI and RAG systems.
Your goal is to answer questions about Jayesh's professional background, skills, and projects in a FUN, MATURE, AND ENGAGING way.

CRITICAL INSTRUCTION:
You must STRICTLY answer questions ONLY based on the information provided in the "RESUME DATA" section below.
If a user asks about something NOT in this resume (like general knowledge, weather, or other topics), politely refuse and say you can only discuss Jayesh's professional life.
KEEP YOUR ANSWERS CONCISE AND TO THE POINT. DO NOT BE VERBOSE.

---
RESUME DATA:
Name: Jayesh Vishwakarma
Contact: +91 6264998382 | jayeshvishwakarma6028@gmail.com
Links: GitHub (@jayesh-cmd), LinkedIn (@cmd-jayesh)

SUMMARY:
AI/ML Developer skilled in building machine learning and Generative AI systems with Python, XGBoost, and LangChain. Currently interning in Bangalore, developing enterprise-grade AI pipelines on FastAPI & GCP.

SKILLS:
- Languages: Python, SQL
- ML/DL: scikit-learn, Keras, TensorFlow, CNNs, Transfer Learning, YOLOv8, OpenCV, MediaPipe
- GenAI & LLM: RAG Pipelines, LangChain, Vector DBs, OpenAI & Gemini APIs
- Backend/Ops: FastAPI, Docker, GCP (Cloud Run, Vertex AI), Streamlit
- Tools: PostgreSQL, Git, VS Code, Jupyter

EXPERIENCE:
1. CommPlug Innovations (AI/ML Software Developer Intern) | Sept 2025 - Present
   - Built an AI WhatsApp shopping assistant using Gemini AI & Django.
   - Architected a multi-tenant PostgreSQL system with Row-Level Security.
   - Handled 100+ daily messages with sub-2s response time using FastAPI & ThreadPoolExecutor.
   - Reduced query resolution time by 60% with context-aware conversation memory.

PROJECTS:
1. AI-Driven Financial Fraud Detection System
   - XGBoost + FastAPI. Trained on 6.3M+ transactions. AUC 0.9998.
   - Integrated GPT-3.5 for human-readable explanations of fraud flags.
   
2. PageSense - Context-Aware Browser Assistant (RAG)
   - Chrome extension answering queries via LLaMa 3.2 & Sentence-Transformers.
   - Used FAISS for semantic search (<2s latency).
   - Reduced search time by ~80%.

3. RAG-based Document Q&A Assistant
   - LangChain + FAISS + OpenAI embeddings.
   - 92%+ answer relevance. Reduced hallucinations by 23% via chunking optimization.

EDUCATION:
- Integrated MCA at Acropolis Institute, Indore (2022-2027)
- Solved 100+ DSA problems (NeetCode 250).
---

GUIDELINES:
1. If asked "Who are you?", say you are a RAG chatbot created by Jayesh and integrated into this portfolio.
2. Be concise but enthusiastic.
3. Always reply in strucutred way , write in next line when needed and always reply in strucured and readable way
4. Dont try to use any bold character and dont use ** anywhere just use simple english and reply naturally
`;

// --- SIMULATION LOGIC (Fallback for Preview without API Key) ---
const simulateRAGResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('hello') || q.includes('hi')) return "Hey! I'm a RAG chatbot created by Jayesh for this portfolio. Ask me about his projects! 🚀";
  if (q.includes('who are you')) return "I'm a RAG chatbot built by Jayesh and integrated here to show off his GenAI skills. Pretty meta, right? 😎";
  if (q.includes('python') || q.includes('langchain') || q.includes('skill')) return "Jayesh is a Python wizard! 🐍 He uses Python, LangChain, and FastAPI to build cool AI stuff.";
  if (q.includes('project') || q.includes('rag') || q.includes('fraud')) return "He has killer projects: 1) Fraud Detection (99.98% AUC), 2) PageSense (Browser RAG), and 3) Doc Q&A (Reduced hallucinations by 23%).";
  if (q.includes('experience') || q.includes('work') || q.includes('intern')) return "He's an AI/ML Intern at CommPlug Innovations, building WhatsApp shopping assistants with Gemini AI. 💼";
  if (q.includes('contact') || q.includes('email')) return "Reach him at jayeshvishwakarma6028@gmail.com. He loves talking tech!";
  return "Interesting question! Ask me about his 'RAG Pipelines', 'Fraud Detection', or 'CommPlug Internship'. 🤖";
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', href, onClick }) => {
  const baseStyle =
    "px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer font-sans";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-lg",
    secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-400",
    outline: "bg-transparent text-white border border-white/30 hover:bg-white/10",
    ghost: "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100",
    darkOutline: "bg-gray-900 text-white border border-gray-700 hover:bg-black"
  };

  // 🔥 New-tab for all external links
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};


const Orb = ({ color, size, top, left, blur = "blur-3xl", delay = "0s" }) => (
  <div 
    className={`absolute rounded-full opacity-40 pointer-events-none mix-blend-multiply animate-float ${blur}`}
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top: top,
      left: left,
      animationDelay: delay,
      zIndex: 0
    }}
  />
);

const OrbitLine = ({ width, height, top, left, rotate, opacity = 0.4, color = "#d1d5db" }) => (
  <div 
    className="absolute rounded-[100%] border pointer-events-none"
    style={{
      width: width,
      height: height,
      top: top,
      left: left,
      transform: `rotate(${rotate})`,
      opacity: opacity,
      zIndex: 0,
      borderColor: color,
      borderWidth: '1px'
    }}
  />
);

const FeatureCard = ({ title, subtitle, description, tags = [], icon: Icon, imageGradient }) => (
  <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 p-8 h-full flex flex-col">
    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${imageGradient} opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700`}></div>
    
    <div className="mb-6 relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-serif font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider font-sans">{subtitle}</p>
    </div>
    
    <p className="text-gray-600 mb-6 relative z-10 leading-relaxed flex-grow font-sans">
      {description}
    </p>

    {tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-sans">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-xl font-serif text-gray-800 group-hover:text-black transition-colors">
          {question}
        </span>
        <span className={`ml-4 p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-black text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
          <ChevronDown size={20} />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed font-sans">
          {answer}
        </p>
      </div>
    </div>
  );
};

const CosmicProject = ({ title, role, description, stats, repoLink, demoLink }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex flex-col h-full">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h3 className="text-2xl font-serif text-white mb-1">{title}</h3>
        <span className="text-blue-400 text-sm font-medium tracking-wide font-sans">{role}</span>
      </div>
    </div>
    
    <p className="text-gray-300 mb-8 leading-relaxed flex-grow font-sans">
      {description}
    </p>

    <div className="flex gap-3 mb-6">
      {demoLink && (
        <a 
          href={demoLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors font-sans"
        >
          <PlayCircle size={16} /> Video Demo
        </a>
      )}
      {repoLink && (
         <a 
          href={repoLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-colors border border-white/20 font-sans"
        >
          <Github size={16} /> GitHub
        </a>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4 mt-auto">
      {stats.map((stat, i) => (
        <div key={i} className="bg-black/30 rounded-xl p-4">
          <div className="text-xl font-serif text-white mb-1">{stat.value}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-sans">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// --- COMPACT EMBEDDED CHAT COMPONENT ---
const CompactChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey There 👋, I Am Jay's Assistant Lets. Have A Chat  " }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // UPDATED: Use 'nearest' block to avoid aggressive page scrolling
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    // UPDATED FIX: Only scroll if there is more than the initial welcome message
    if (messages.length > 1) {
        scrollToBottom();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // FIXED: calculate next count manually (React state is async)
    const nextCount = userMessageCount + 1;
    setUserMessageCount(nextCount);

    // LIMIT CHECK (runs only AFTER user sends the 10th message)
    if (nextCount >= 10) {
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "You can contact me on LinkedIn - @cmd-jayesh ✨\nI’ve hit my message limit because I'm saving tokens for recruiters 😅"
                }
            ]);
            setIsLoading(false);
        }, 600);

        return; // stop further API calls
    }

    try {
        const apiKey = import.meta.env?.VITE_OPENAI_API_KEY; 

        if (!apiKey) {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            const fakeResponse = simulateRAGResponse(userMessage.content);
            setMessages(prev => [...prev, { role: 'assistant', content: fakeResponse }]);
            setIsLoading(false);
            return;
        }

        const history = messages.slice(-5);

        const response = await fetch('/api/chat', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history })  // ✅ use history, not messages
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.choices[0].message.content }
        ]);

    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "You can contect me Linkedin - @cmd-jayesh here \n Cause i want to save my tokens for recruiters 😅" }]);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden h-full flex flex-col relative font-sans">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/4M3Rmtye1aP2adi4PMKLsoYPxQ.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'   // 🔥 KEY FIX
          }}
        >
          <div className="absolute inset-0 bg-gray-950/60"></div>
        </div>


      <div className="bg-gray-900/90 px-4 py-3 border-b border-gray-700 flex items-center gap-3 relative z-10 backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-gray-800 h-6 rounded border border-gray-700 flex items-center px-3 text-[10px] text-gray-400 font-mono">
           <span className="text-blue-400 mr-1">ai://</span>chat-bot
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
            {userMessageCount}/10
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-10">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 mt-1 shrink-0 border border-white/10">
                    <Bot size={12} className="text-blue-300" />
                </div>
            )}
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed backdrop-blur-md shadow-lg font-sans ${
                msg.role === 'user' 
                  ? 'bg-blue-600/90 text-white rounded-br-none border border-blue-400/30' 
                  : 'bg-white/10 text-white/90 rounded-bl-none border border-white/10'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 mt-1 border border-white/10">
                <Bot size={12} className="text-blue-300" />
            </div>
            <div className="bg-white/10 border border-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-gray-900/80 backdrop-blur-xl relative z-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={userMessageCount >= 10 ? "Limit reached." : "Ask AI..."}
            disabled={isLoading || userMessageCount >= 10}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-500 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || userMessageCount >= 10}
            className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PORTFOLIO COMPONENT ---

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(-1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden selection:bg-black selection:text-white relative">
      
      {/* --- Background Orbital Lines --- */}
      <div className="absolute top-0 left-0 w-full h-[150vh] overflow-hidden pointer-events-none z-0">
         <OrbitLine width="120vw" height="120vh" top="-50%" left="-10%" rotate="15deg" opacity={0.5} color="#FDBA74" />
         <OrbitLine width="100vw" height="100vh" top="10%" left="20%" rotate="-10deg" opacity={0.4} color="#22D3EE" />
         <OrbitLine width="80vw" height="80vh" top="40%" left="-20%" rotate="25deg" opacity={0.4} color="#A78BFA" />
      </div>

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif font-bold text-lg">J</div>
            <span className="font-medium tracking-tight text-lg font-sans">Jayesh.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 font-sans">
            <button onClick={() => scrollToSection('experience')} className="hover:text-black transition-colors">Experience</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-black transition-colors">Projects</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-black transition-colors">Skills</button>
          </div>

          <Button variant="secondary" className="!px-4 !py-2 text-sm" href="mailto:jayeshvishwakarma6028@gmail.com">
            <Mail size={16} /> Contact
          </Button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-40 pb-10 px-6">
        <Orb color="#C4B5FD" size="400px" top="-100px" left="-100px" delay="0s" />
        <Orb color="#FDBA74" size="300px" top="20%" left="80%" delay="2s" />
        <Orb color="#67E8F9" size="250px" top="60%" left="10%" delay="4s" />

        <div className="container mx-auto max-w-7xl relative z-10"> 
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm animate-fade-in font-sans">
                👋 Hi, I'm Jayesh Vishwakarma
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight tracking-tight">
                Intelligence that <br />
                <span className="text-gray-900">works </span>
                <span className="italic font-serif text-gray-900">for</span>
                <span className="text-gray-900"> you</span>
            </h1>
            
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-sans">
                AI/ML Developer specializing in Artificial Intelligence, Machine Learning and Generative AI, building scalable and automated systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={() => scrollToSection('projects')}>
                View My Work <ArrowRight size={18} />
                </Button>
                <Button variant="ghost" href="https://github.com/jayesh-cmd" className="gap-2">
                <Github size={18} /> GitHub
                </Button>
                <Button variant="ghost" href="https://drive.google.com/file/d/1u-fcunbchizGs6fQ93ZGjcaIslwwT13S/view?usp=sharing" className="gap-2">
                <FileText size={18} /> Resume
                </Button>
            </div>
          </div>

          {/* --- HERO STACK: TOP AND BOTTOM CARDS --- */}
          <div className="flex flex-col gap-8 items-center w-full">
            
            {/* 1. RESTORED 'ABOUT ME' CARD (Full Width) */}
            <div className="w-full rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-white h-8 rounded-lg border border-gray-200 flex items-center px-4 text-xs text-gray-400 font-mono">
                        jayesh-portfolio.ai/about-me
                    </div>
                </div>
                
                <div className="p-10 md:p-12 bg-gradient-to-b from-white to-gray-50 flex flex-col md:flex-row items-center gap-8 h-full">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-serif text-gray-900 leading-tight">
                            Bridging <span className="text-blue-600 italic">Research</span> & <span className="text-purple-600 italic">Reality</span>.
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg font-sans">
                            I’m an fresher engineer who builds intelligent systems end-to-end. I turn complex ML concepts into practical, high-impact applications — from shaping efficient RAG pipelines to crafting scalable FastAPI backends that ship reliably in production.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg font-sans">
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex justify-center">
                        <div className="relative w-56 h-56">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full opacity-50 blur-3xl animate-pulse"></div>
                            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 rotate-3 hover:rotate-0 transition-all duration-500">
                                <Brain className="w-12 h-12 text-gray-900 mb-2" />
                                <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-sans">Algorithms Mastered</div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 z-20 bg-black text-white p-4 rounded-3xl shadow-xl -rotate-3 hover:rotate-0 transition-all duration-500">
                                <Code className="w-6 h-6 mb-1" />
                                <div className="text-lg font-serif">Builder</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CHAT CARD (Below, Wider but Small Height) */}
            <div className="w-full h-[600px]">
                <CompactChat />
            </div>

          </div>
        </div>
      </header>

      {/* --- Experience Section --- */}
      <section id="experience" className="pt-20 pb-32 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Professional Experience</h2>
            <p className="text-xl text-gray-500 max-w-2xl font-sans">
              Applying theoretical knowledge to build scalable, real-world AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              title="CommPlug Innovations"
              subtitle="AI/ML Software Developer Intern | Sept 2025 - Present"
              description="Architecting a multi-tenant system with Row-Level Security. Developed an AI-powered WhatsApp shopping assistant using Google Gemini AI, Django, and WhatsApp Business API."
              icon={Bot}
              imageGradient="from-blue-400 to-purple-500"
            />
            
            <FeatureCard 
              title="Education: MCA"
              subtitle="Acropolis Institute, Indore | 2022 - 2027"
              description="Integrated Master of Computer Applications. Focusing on Core Algorithms, Applied Math for ML, and Data Structures. Successfully solved 100+ DSA problems on LeetCode."
              icon={Terminal}
              imageGradient="from-green-400 to-teal-500"
            />
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="bg-gray-950 py-32 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">
                Constructing the <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-400">Future of AI</span>
              </h2>
              <p className="text-gray-400 max-w-xl text-lg font-sans">
                From fraud detection to context-aware browser assistants, I build systems that understand and act.
              </p>
            </div>
            <Button variant="outline" href="https://github.com/jayesh-cmd">
              View Full GitHub <ExternalLink size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CosmicProject 
                title="AI-Driven Financial Fraud Detection System"
                role="XGBoost + FastAPI"
                description="Engineered a fraud-detection model trained on 6.3M+ transactions. Designed statistical features capturing behavioral anomalies like 'account drained to $0'. Integrated GPT-3.5 for human-readable explainability."
                stats={[
                  { value: "0.9998", label: "AUC Score" },
                  { value: "<100ms", label: "Inference Time" }
                ]}
                repoLink="https://github.com/jayesh-cmd/FinSecure-AI"
                demoLink="https://www.linkedin.com/posts/cmd-jayesh_machinelearning-frauddetection-ai-activity-7385927884600737792-4lgX?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFlqJGoBl68XgWGQ56UL9i8cfNrN4L5nMUQ"
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white h-full flex flex-col justify-between group hover:shadow-2xl hover:shadow-blue-900/20 transition-all relative overflow-hidden">
                 <div className="relative z-10">
                   <Search className="mb-6 opacity-80" size={32} />
                   <h3 className="text-2xl font-serif mb-2">PageSense</h3>
                   <p className="text-blue-100 text-sm leading-relaxed mb-4 font-sans">
                     Context-Aware Browser Assistant using RAG. Extracts live page content and answers queries using LLaMa 3.2.
                   </p>
                   
                    <div className="flex gap-2 mt-4">
                      <a href="https://www.linkedin.com/posts/cmd-jayesh_ai-machinelearning-generativeai-activity-7356755637784961024-YtXN?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFlqJGoBl68XgWGQ56UL9i8cfNrN4L5nMUQ" target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform"><PlayCircle size={16} /></a>
                      <a href="https://github.com/jayesh-cmd/pagesense-rag-extension" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"><Github size={16} /></a>
                    </div>

                 </div>
                 <div className="pt-4 border-t border-white/20 mt-6 relative z-10">
                    <div>
                        <div className="text-3xl font-serif">~80%</div>
                        <div className="text-xs uppercase tracking-wide opacity-70 font-sans">Search Time Reduced</div>
                     </div>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-3">
              <CosmicProject 
                title="RAG-based Document Q&A Assistant"
                role="LangChain + FAISS"
                description="An end-to-end solution enabling users to upload PDFs and query them. Used OpenAI embeddings for semantic search and integrated chunking optimization to reduce hallucinations by 23%."
                stats={[
                  { value: "1.8s", label: "Retrieval Latency" },
                  { value: "92%+", label: "Answer Relevance" },
                  { value: "10k", label: "Token Context" },
                  { value: "23%", label: "Hallucination Drop" }
                ]}
                repoLink="https://github.com/jayesh-cmd/RAG-based-Document-Q-A-System"
                demoLink="https://www.linkedin.com/posts/cmd-jayesh_ai-chatbot-generativeai-activity-7364632709245083648-lPvp?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFlqJGoBl68XgWGQ56UL9i8cfNrN4L5nMUQ"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Skills / FAQ Section --- */}
      <section id="skills" className="py-32 px-6 bg-white relative z-10">
        <div className="container mx-auto max-w-4xl">
           <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Technical Arsenal</h2>
            <p className="text-gray-500 font-sans">The tools and frameworks I use to build intelligent systems.</p>
          </div>

          <div className="border-t border-gray-200">
            <AccordionItem 
              question="What is my core Machine Learning stack?"
              answer="My ML stack is built around Python, using Scikit-learn for classical models and TensorFlow/Keras for deep learning. I specialize in Computer Vision with YOLOv8, OpenCV, and MediaPipe, and I'm experienced in building optimized CNNs and Transfer Learning pipelines."
              isOpen={openAccordion === 0}
              onClick={() => setOpenAccordion(0 === openAccordion ? -1 : 0)}
            />
            <AccordionItem 
              question="How do I handle Generative AI & LLMs?"
              answer="I specialize in RAG (Retrieval-Augmented Generation) pipelines using LangChain and Vector Databases like FAISS. I integrate OpenAI and Gemini APIs for inference and optimize context windows to reduce hallucinations."
              isOpen={openAccordion === 1}
              onClick={() => setOpenAccordion(1 === openAccordion ? -1 : 1)}
            />
            <AccordionItem 
              question="What about Backend & Deployment?"
              answer="My production stack includes FastAPI for high-performance async APIs, PostgreSQL for data storage, and Docker for containerization. I deploy on Google Cloud Platform (Cloud Run, Vertex AI) to ensure scalability."
              isOpen={openAccordion === 2}
              onClick={() => setOpenAccordion(2 === openAccordion ? -1 : 2)}
            />
             <AccordionItem 
              question="Languages & Tools?"
              answer="Python is my primary language, supported by SQL for data manipulation. I use Git/GitHub for version control, VS Code as my IDE, and Jupyter/Colab for experimentation and prototyping."
              isOpen={openAccordion === 3}
              onClick={() => setOpenAccordion(3 === openAccordion ? -1 : 3)}
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white pt-24 pb-12 px-6 relative overflow-hidden z-10">
        <Orb color="#4C1D95" size="500px" top="0" left="0" blur="blur-[120px]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 md:mb-0 text-center md:text-left">
              Ready to <br />
              collaborate?
            </h2>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Button variant="darkOutline" href="mailto:jayeshvishwakarma6028@gmail.com" className="justify-center w-full md:w-auto transition-all">
                <Mail size={20} /> jayeshvishwakarma6028@gmail.com
              </Button>
              
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://www.linkedin.com/in/cmd-jayesh/" className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="https://github.com/jayesh-cmd" className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy;Jayesh Vishwakarma.</p>
            <div className="flex gap-8 mt-4 md:mt-0 font-sans">
              <span>Indore, India</span>
              <span>+91 6264998382</span>
            </div>
          </div>
        </div>
      </footer>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        :root {
          --font-sans: 'Inter', sans-serif;
          --font-serif: 'Playfair Display', serif;
        }

        body {
          font-family: var(--font-sans);
        }

        .font-serif {
          font-family: var(--font-serif);
        }

        .font-sans {
          font-family: var(--font-sans);
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.4);
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-fade-in {
            animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}