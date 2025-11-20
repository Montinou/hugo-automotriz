import { db } from "@/db";
import { users, workshops, products } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { ProductManager } from "@/components/dashboard/workshop/ProductManager";

export default async function InventoryPage() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) return null;

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });

  if (!workshop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No tienes un taller registrado</h2>
        <p className="text-muted-foreground">Registra tu taller en la configuración para gestionar tu inventario.</p>
      </div>
    );
  }

  const workshopProducts = await db.query.products.findMany({
    where: eq(products.workshopId, workshop.id),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div className="max-w-5xl mx-auto py-6">
      <ProductManager products={workshopProducts.map(p => ({
        ...p,
        price: p.price.toString(),
      }))} />
    </div>
  );
}
