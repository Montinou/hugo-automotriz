"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Image as ImageIcon, Loader2, X, Sparkles, Lock, Crown } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { createAssistanceRequest } from "@/app/actions/request";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { usePricingModal } from "@/contexts/PricingModalContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  vehicleContext?: string;
  userPlan?: "free" | "pro" | "enterprise";
  dailyMessageCount?: number;
}

const FREE_DAILY_LIMIT = 5;

const SUGGESTED_QUESTIONS = [
  "¿Por qué mi auto hace un ruido al frenar?",
  "¿Cada cuánto debo cambiar el aceite?",
  "Tengo una luz de advertencia en el tablero",
  "¿Cuánto cuesta un servicio de grúa?"
];

export function ChatInterface({ vehicleContext, userPlan = "free", dailyMessageCount = 0 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(dailyMessageCount);
  const router = useRouter();
  const { openPricingModal } = usePricingModal();

  // Check if user has reached free limit
  const isLimitReached = userPlan === "free" && messageCount >= FREE_DAILY_LIMIT;
  const remainingMessages = FREE_DAILY_LIMIT - messageCount;

  // Check for JSON actions in assistant messages
  const checkForActions = useCallback((content: string) => {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const actionData = JSON.parse(jsonMatch[1]);
        if (actionData.action === "create_ticket") {
          handleCreateTicket(actionData.data);
        }
      } catch (e) {
        console.error("Error parsing AI action:", e);
      }
    }
  }, []);

  const handleCreateTicket = async (data: { serviceType: string; description: string }) => {
    toast.loading("Creando solicitud de asistencia...");
    
    if (!navigator.geolocation) {
      toast.error("No se pudo obtener la ubicación. Por favor habilita el GPS.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await createAssistanceRequest({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            serviceType: data.serviceType,
            description: data.description,
            vehicleId: undefined // Let backend pick default
          });
          toast.dismiss();
          toast.success("Solicitud creada exitosamente");
          router.push("/dashboard/request");
        } catch (error) {
          toast.dismiss();
          toast.error("Error al crear la solicitud");
          console.error(error);
        }
      },
      (error) => {
        toast.dismiss();
        toast.error("Error de ubicación: " + error.message);
      }
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setImageUrl(newBlob.url);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUrl) return;

    // Build the message content
    let messageContent = input.trim();
    if (imageUrl) {
      messageContent += `\n\n[Imagen adjunta](${imageUrl})`;
    }

    // Send message using the new API
    await sendMessage({ text: messageContent });
    setInput("");
    setImageUrl(null);
  };

  const getMessageText = (m: Message) => {
    // Hide the JSON action block from the UI
    return m.content.replace(/```json[\s\S]*?```/g, "").trim();
  };

  const sendMessage = async ({ text }: { text: string }) => {
    // Check limit before sending
    if (isLimitReached) {
      openPricingModal("Has alcanzado el limite de 5 mensajes diarios. Actualiza a Pro para chat ilimitado.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageCount((prev) => prev + 1);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })), // Send only necessary fields
          vehicleContext,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body?.getReader();
      if (!reader) return;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2));
              assistantContent += text;
              
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === "assistant") {
                    lastMsg.content = assistantContent;
                }
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing stream:", e);
            }
          }
        }
      }
      
      checkForActions(assistantContent);

    } catch (error) {
      console.error(error);
      toast.error("Error al enviar mensaje");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage({ text: question });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col shadow-lg border-muted/40 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Hugo AI</h3>
              <p className="text-xs text-muted-foreground font-normal">Asistente Virtual Automotriz</p>
            </div>
          </div>
          {userPlan === "free" && (
            <div className="flex items-center gap-2 text-xs">
              <span className={remainingMessages <= 2 ? "text-orange-500" : "text-muted-foreground"}>
                {remainingMessages > 0 ? `${remainingMessages} msgs restantes` : "Limite alcanzado"}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => openPricingModal("Actualiza a Pro para chat ilimitado y funciones avanzadas.")}
              >
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/50 dark:bg-slate-950/50">
        <ScrollArea className="h-full p-4">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-12 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-primary/10 p-4 rounded-full mb-2">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-2 max-w-sm">
                  <h4 className="font-semibold text-lg">¡Hola! Soy Hugo.</h4>
                  <p className="text-sm text-muted-foreground">
                    Estoy aquí para ayudarte con el mantenimiento, diagnóstico y dudas sobre tu vehículo.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      className="justify-start h-auto py-3 px-4 text-left text-sm font-normal hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                      onClick={() => handleSuggestedQuestion(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <Avatar className="h-8 w-8 border bg-white dark:bg-slate-900 shadow-sm mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-5 py-3 text-sm shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white dark:bg-slate-900 border text-foreground rounded-tl-none"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            strong: ({children}) => <span className="font-semibold text-primary/90">{children}</span>,
                          }}
                        >
                          {getMessageText(m)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{getMessageText(m)}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {m.role === "user" && (
                  <Avatar className="h-8 w-8 border shadow-sm mt-1">
                    <AvatarFallback className="bg-secondary"><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <Avatar className="h-8 w-8 border bg-white dark:bg-slate-900 shadow-sm mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-slate-900 border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 bg-background border-t relative">
        {isLimitReached && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
            <Lock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-center mb-2">Limite diario alcanzado</p>
            <Button
              size="sm"
              onClick={() => openPricingModal("Has alcanzado el limite de 5 mensajes diarios. Actualiza a Pro para chat ilimitado.")}
              className="bg-primary"
            >
              <Crown className="h-4 w-4 mr-2" />
              Actualizar a Pro
            </Button>
          </div>
        )}
        <form onSubmit={onSubmit} className="flex w-full gap-2 items-end">
          {imageUrl && (
             <div className="relative mb-2">
               <img src={imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md border shadow-sm" />
               <button 
                 type="button"
                 onClick={() => setImageUrl(null)}
                 className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
               >
                 <X className="h-3 w-3" />
               </button>
             </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
            disabled={isLoading || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLimitReached ? "Actualiza a Pro para continuar..." : "Escribe tu consulta..."}
            disabled={isLoading || isLimitReached}
            className="flex-1 bg-muted/30 focus-visible:ring-primary/20"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-primary hover:bg-primary/90 shadow-sm"
            disabled={isLoading || (!(input || "").trim() && !imageUrl)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
