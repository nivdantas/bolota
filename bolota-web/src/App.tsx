import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Olá! Sou o Bolota. Posso consultar preços de medicamentos ou buscar artigos científicos para você.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/webhook', {
        message: userMsg
      });

      const botReply = response.data.reply || "Desculpe, não entendi.";

      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Erro ao conectar com o servidor do Bolota.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-md">
          <div className="bg-white p-2 rounded-full">
          </div>
          <div>
            <h1 className="font-bold text-lg">Bolota AI</h1>
            <p className="text-blue-100 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online • Assistente Veterinário
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
   <ReactMarkdown
                  components={{
                    // Transforma **texto** em Negrito Azulado (se for bot) ou Branco (se for user)
                    strong: ({node, ...props}) => (
                      <span className="font-bold" {...props} />
                    )
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                {msg.role === 'bot' && msg.content.includes('prescrição') && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-orange-600 text-xs flex items-center gap-1 font-semibold">
                    Atenção: Venda sob prescrição.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pergunte sobre Simparic, Apoquel..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-12"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            IA pode cometer erros. Verifique as informações médicas.
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;
