"use client";

import { useChat } from "@ai-sdk/react";

interface Message {
  id: string;
  role: 'function' | 'data' | 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  data?: Record<string, unknown>;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { createAssistanceRequest } from "@/app/actions/request";
import { useRouter } from "next/navigation";

interface ChatInterfaceProps {
  vehicleContext?: string;
}

export function ChatInterface({ vehicleContext }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { vehicleContext },
  } as any) as any;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  // Effect to listen for AI response completion and check for JSON actions
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const content = lastMessage.content;
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
      }
    }
  }, [messages, isLoading]);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUrl) return;

    // Append image URL to message if exists
    // Note: This is a simplification. Ideally we'd use experimental_attachments or similar
    // but for now we'll just append it to the text or handle it in the worker.
    // However, useChat doesn't easily support custom fields without experimental features.
    // We will append it to the content for the worker to parse.
    
    const content = imageUrl ? `${input}\n\n[Imagen adjunta](${imageUrl})` : input;
    
    // We need to manually trigger handleSubmit with the modified content or just let the worker handle the URL in the body
    // But useChat handles the input state. 
    // A better approach with standard useChat is to let the user send the text, and we modify the request body.
    // But we can't easily modify the body per request in the hook config dynamically for just one message.
    
    // Workaround: We'll just let the user send the text, and if there's an image, we'll clear it after send.
    // The worker will need to parse the markdown image or we need to find a way to send it.
    
    // Actually, let's just append the image markdown to the input before submitting if we can, 
    // or better, just send it as part of the message content.
    
    // Since we can't easily modify the input state programmatically without triggering a re-render loop or fighting the hook,
    // we will rely on the user typing. If they uploaded an image, we'll assume they want to talk about it.
    
    // Let's try to use the `data` field or just append to text.
    // For this MVP, appending to text is safest.
    
    if (imageUrl) {
       // We can't easily modify 'input' here to include the image URL without changing the hook's state.
       // So we will just pass it.
    }
    
    handleSubmit(e, { data: { imageUrl } });
    setImageUrl(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Hugo - Tu Mecánico IA
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
            
            {messages.map((m: Message) => (
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
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {m.content}
                  {m.data && (m.data as any).imageUrl && (
                    <img 
                      src={(m.data as any).imageUrl} 
                      alt="Uploaded" 
                      className="mt-2 rounded-md max-w-full h-auto max-h-48 object-cover" 
                    />
                  )}
                  {/* Also check for markdown images if we fallback to that */}
                  {m.content.includes("![image]") && (
                     <div className="mt-2 text-xs text-muted-foreground">[Imagen procesada]</div>
                  )}
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
            onChange={handleInputChange}
            placeholder="Escribe tu consulta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageUrl)}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
