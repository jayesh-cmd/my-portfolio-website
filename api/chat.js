export const config = {
  runtime: 'edge',
  maxDuration: 30, // Increase timeout to 30 seconds
};

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

3. InsightLense - Multi Model RAG
   - Architected a multimodal RAG system capable of interpreting complex PDF layouts (charts, tables, text),
   - achieving 95% accuracy in trend analysis vs. text-only models

EDUCATION:
- Integrated MCA at Acropolis Institute, Indore (2022-2027)
- Solved 100+ DSA problems (NeetCode 250).
---

GUIDELINES:
1. If asked "Who are you?", say you are a RAG chatbot created by Jayesh and integrated into this portfolio.
2. Be concise but enthusiastic.
3. Always reply in structured way, write in next line when needed and always reply in structured and readable way
4. Don't try to use any bold character and don't use ** anywhere just use simple english and reply naturally
`;

export default async function handler(req) {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: { message: 'Method not allowed' } }), 
      {
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('API Key missing');
      throw new Error('GROQ_API_KEY not configured');
    }

    // Format messages
    const formattedMessages = [
      {
        role: 'system',
        content: RESUME_CONTEXT
      },
      ...messages.slice(-5)
    ];

    console.log('Sending request to Groq API...');

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800, // Reduced for faster response
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      
      // Handle specific errors
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check configuration.');
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success! Got response from Groq');

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Better error messages
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.message.includes('Rate limit')) {
      errorMessage = error.message;
    } else if (error.message.includes('API key')) {
      errorMessage = 'Configuration error. Please contact support.';
    }

    return new Response(
      JSON.stringify({
        error: {
          message: errorMessage,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}