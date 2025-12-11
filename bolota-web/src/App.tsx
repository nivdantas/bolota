import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "bot";
  content: string;
}

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/webhook", {
        message: userMsg,
      });

      const botReply = response.data.reply || "Desculpe, não entendi.";
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Erro ao conectar com o servidor do Bolota." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col items-center">

      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-400
          ${hasMessages ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <h1 className="text-3xl font-bold text-gray-800 mt-60">Bolota AI</h1>
        <p className="text-gray-500 mt-5">Seu assistente veterinário inteligente.</p>
      </div>

      <div
        className={`
          w-full max-w-2xl lg:max-w-6xl 2xl:max-w-full bg-white rounded-t-xl shadow-2xl overflow-hidden flex flex-col
          transition-all duration-600 ease-in-out absolute bottom-0
          ${hasMessages
            ? "h-[calc(100vh-20px)] 2xl:h-dvh 2xl:rounded-none opacity-100 translate-y-0"
            : "h-0 opacity-0 translate-y-20"
          }
        `}
      >
        <div className="bg-greenbolota-400 p-4 text-white flex items-center gap-3 shadow-md z-10">
          <div>
            <h1 className="font-bold text-lg">Bolota AI</h1>
            <p className="text-blue-100 text-xs">Assistente Veterinário</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm lg:text-[18px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-greenbolota-400 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
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
      </div>

      <div
        className={`
          fixed w-full max-w-2xl px-4 transition-all duration-700 ease-in-out z-50
          ${hasMessages
            ? "bottom-4 translate-y-0"
            : "top-1/2 -translate-y-1/2"
          }
        `}
      >
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte sobre Simparic, Apoquel..."
            className="flex-1 p-3 pl-4 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            disabled={isLoading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-greenbolota-400 text-white p-3 rounded-full hover:bg-greenbolota-500 disabled:opacity-50 transition-colors w-12 h-12 flex items-center justify-center shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <p className={`text-center text-xs text-gray-400 mt-2 transition-opacity duration-500 ${hasMessages ? 'opacity-100' : 'opacity-0'}`}>
          IA pode cometer erros. Verifique as informações médicas.
        </p>
      </div>

    </div>
  );
}

export default App;
