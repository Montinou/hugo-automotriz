"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { submitReview } from "@/app/actions/rating";
import { toast } from "sonner";

interface RatingModalProps {
  isOpen: boolean;
  requestId: number;
  providerName?: string;
  onClose: () => void;
}

export function RatingModal({ isOpen, requestId, providerName, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(requestId, rating, comment);
      toast.success("¡Gracias por tu calificación!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar la calificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calificar Servicio</DialogTitle>
          <DialogDescription>
            ¿Cómo fue tu experiencia con {providerName || "el mecánico"}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Escribe un comentario (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Calificación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
