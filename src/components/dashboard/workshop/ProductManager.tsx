'use client';

import { useState, useTransition, useRef } from "react";
import { createProduct, deleteProduct, updateProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Package, Upload, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  category: string | null;
  imageUrl: string | null;
}

interface ProductManagerProps {
  products: Product[];
}

export function ProductManager({ products }: ProductManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setImageUrl(product.imageUrl || "");
    } else {
      setEditingProduct(null);
      setImageUrl("");
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Error al subir imagen');
      
      const newBlob = await response.json();
      setImageUrl(newBlob.url);
      toast.success("Imagen del producto subida");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (editingProduct) {
          formData.append("id", editingProduct.id.toString());
          await updateProduct(formData);
          toast.success("Producto actualizado");
        } else {
          await createProduct(formData);
          toast.success("Producto creado");
        }
        setIsDialogOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar el producto");
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Producto eliminado");
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar el producto");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventario</h2>
          <p className="text-muted-foreground">Gestiona los productos y repuestos de tu taller.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Precio (Bs)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No hay productos registrados.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded overflow-hidden bg-muted">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <Package className="h-6 w-6 m-2 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">{product.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del producto o repuesto.
            </DialogDescription>
          </DialogHeader>
          
          <form action={handleSubmit} className="space-y-4 py-4">
            <input type="hidden" name="imageUrl" value={imageUrl} />
            
            <div className="flex flex-col gap-4 items-center">
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Subir Imagen
                </Button>
                {imageUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setImageUrl("")}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={editingProduct?.name} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio (Bs)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock || 0} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" defaultValue={editingProduct?.category || ""} placeholder="Ej: Aceites, Frenos, Llantas" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" defaultValue={editingProduct?.description || ""} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending || isUploading}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
