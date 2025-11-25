"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { createAssistanceRequest } from "@/app/actions/request";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  vehicleContext?: string;
}

const WORKER_URL = process.env.NEXT_PUBLIC_AI_WORKER_URL || "https://ai-worker.agusmontoya.workers.dev";

export function ChatInterface({ vehicleContext }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

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
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Hugo de Asistencia Vehicular AI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>¡Hola! Soy Hugo. ¿En qué puedo ayudarte con tu vehículo hoy?</p>
                <p className="text-xs mt-2">Puedo diagnosticar ruidos, estimar costos o darte consejos de mantenimiento.</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {getMessageText(m)}
                </div>

                {m.role === "user" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-secondary"><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 text-sm animate-pulse">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <form onSubmit={onSubmit} className="flex w-full gap-2 items-end">
          {imageUrl && (
             <div className="relative mb-2">
               <img src={imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md border" />
               <button 
                 type="button"
                 onClick={() => setImageUrl(null)}
                 className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
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
            variant="outline" 
            size="icon" 
            disabled={isLoading || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || (!(input || "").trim() && !imageUrl)}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
