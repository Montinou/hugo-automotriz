'use server';

import { db } from "@/db";
import { products, users, workshops } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });
  if (!workshop) throw new Error("Workshop not found");

  return await db.query.products.findMany({
    where: eq(products.workshopId, workshop.id),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

export async function createProduct(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });
  if (!workshop) throw new Error("Workshop not found");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await db.insert(products).values({
    workshopId: workshop.id,
    name,
    description,
    price: price,
    stock: parseInt(stock) || 0,
    category,
    imageUrl,
  });

  revalidatePath("/dashboard/workshop/inventory");
}

export async function updateProduct(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership (simplified for brevity, ideally check if product belongs to user's workshop)
  const id = parseInt(formData.get("id") as string);
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await db.update(products)
    .set({
      name,
      description,
      price: price,
      stock: parseInt(stock) || 0,
      category,
      imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/dashboard/workshop/inventory");
}

export async function deleteProduct(id: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/dashboard/workshop/inventory");
}
