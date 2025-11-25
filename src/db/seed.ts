import "dotenv/config";
import { db } from "./index";
import {
  users,
  vehicles,
  assistanceRequests,
  appointments,
  reviews,
  services,
  workshops,
  products,
} from "./schema";
import { eq } from "drizzle-orm";

// ==================== DATOS REALISTAS BOLIVIA ====================

// Vehículos populares en Bolivia
const VEHICLES_BOLIVIA = [
  { make: "Toyota", model: "Corolla", years: [2018, 2019, 2020, 2021, 2022], colors: ["Blanco", "Plata", "Negro", "Gris"] },
  { make: "Toyota", model: "Hilux", years: [2019, 2020, 2021, 2022, 2023], colors: ["Blanco", "Negro", "Plata", "Rojo"] },
  { make: "Toyota", model: "RAV4", years: [2020, 2021, 2022], colors: ["Blanco", "Azul", "Negro"] },
  { make: "Toyota", model: "Yaris", years: [2017, 2018, 2019, 2020], colors: ["Rojo", "Blanco", "Plata"] },
  { make: "Nissan", model: "Versa", years: [2018, 2019, 2020, 2021], colors: ["Blanco", "Gris", "Negro"] },
  { make: "Nissan", model: "Kicks", years: [2020, 2021, 2022, 2023], colors: ["Naranja", "Blanco", "Negro"] },
  { make: "Nissan", model: "Frontier", years: [2019, 2020, 2021], colors: ["Blanco", "Plata", "Negro"] },
  { make: "Suzuki", model: "Swift", years: [2017, 2018, 2019, 2020], colors: ["Rojo", "Azul", "Blanco"] },
  { make: "Suzuki", model: "Vitara", years: [2019, 2020, 2021, 2022], colors: ["Blanco", "Rojo", "Negro"] },
  { make: "Suzuki", model: "Jimny", years: [2020, 2021, 2022, 2023], colors: ["Verde", "Blanco", "Negro"] },
  { make: "Hyundai", model: "Tucson", years: [2019, 2020, 2021, 2022], colors: ["Blanco", "Gris", "Azul"] },
  { make: "Hyundai", model: "Accent", years: [2018, 2019, 2020, 2021], colors: ["Plata", "Blanco", "Negro"] },
  { make: "Kia", model: "Sportage", years: [2019, 2020, 2021, 2022], colors: ["Blanco", "Negro", "Gris"] },
  { make: "Kia", model: "Rio", years: [2018, 2019, 2020], colors: ["Rojo", "Blanco", "Azul"] },
  { make: "Chevrolet", model: "Sail", years: [2017, 2018, 2019], colors: ["Blanco", "Plata", "Negro"] },
  { make: "Chevrolet", model: "N300", years: [2018, 2019, 2020, 2021], colors: ["Blanco", "Plata"] },
  { make: "Mitsubishi", model: "L200", years: [2019, 2020, 2021, 2022], colors: ["Blanco", "Negro", "Gris"] },
  { make: "Mitsubishi", model: "Montero Sport", years: [2020, 2021, 2022], colors: ["Blanco", "Negro"] },
  { make: "Ford", model: "Ranger", years: [2019, 2020, 2021, 2022], colors: ["Blanco", "Negro", "Azul"] },
  { make: "Volkswagen", model: "Gol", years: [2017, 2018, 2019], colors: ["Rojo", "Blanco", "Plata"] },
];

// Placas bolivianas realistas (formato: 1234ABC)
const generateBolivianPlate = () => {
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  const letters = ["ABC", "BCD", "CDE", "DEF", "EFG", "FGH", "GHI", "HIJ", "IJK", "JKL", "KLM", "LMN", "MNO", "NOP", "OPQ", "PQR", "QRS", "RST", "STU", "TUV", "UVW", "VWX", "WXY", "XYZ"];
  return `${numbers}${letters[Math.floor(Math.random() * letters.length)]}`;
};

// Talleres de Santa Cruz, Bolivia
const WORKSHOPS_DATA = [
  {
    name: "Taller Automotriz El Parabrisas",
    description: "Especialistas en mecánica general, electricidad automotriz y aire acondicionado. Más de 15 años de experiencia.",
    address: "Av. Santos Dumont #2150, Zona Norte, Santa Cruz",
    lat: -17.7634,
    lng: -63.1820,
    phone: "+591 3 342 5678",
    tags: ["Mecánica General", "Electricidad", "A/C"],
  },
  {
    name: "Servicio Automotriz Japón",
    description: "Taller especializado en vehículos japoneses. Toyota, Nissan, Suzuki, Mitsubishi. Repuestos originales.",
    address: "4to Anillo, Av. Banzer #890, Santa Cruz",
    lat: -17.7512,
    lng: -63.1954,
    phone: "+591 3 356 7890",
    tags: ["Toyota", "Nissan", "Suzuki", "Repuestos Originales"],
  },
  {
    name: "Lubricentro Express 24/7",
    description: "Cambio de aceite express en 15 minutos. Trabajamos las 24 horas. Aceites sintéticos y minerales.",
    address: "Av. Cristo Redentor #567, Santa Cruz",
    lat: -17.7789,
    lng: -63.1678,
    phone: "+591 3 333 4455",
    tags: ["Cambio de Aceite", "24 Horas", "Express"],
  },
  {
    name: "Frenos y Suspensión Don Carlos",
    description: "Especialistas en sistemas de frenos, suspensión y dirección. Alineación computarizada.",
    address: "Av. Alemana #1234, Zona Este, Santa Cruz",
    lat: -17.7845,
    lng: -63.1523,
    phone: "+591 3 344 5566",
    tags: ["Frenos", "Suspensión", "Alineación"],
  },
  {
    name: "Taller Eléctrico Voltaje",
    description: "Diagnóstico electrónico, reparación de alternadores, arranques y sistemas eléctricos.",
    address: "Calle Beni #456, Zona Central, Santa Cruz",
    lat: -17.7923,
    lng: -63.1812,
    phone: "+591 3 355 6677",
    tags: ["Electricidad", "Diagnóstico", "Electrónica"],
  },
];

// Servicios por tipo de taller
const SERVICES_CATALOG = {
  mecanica: [
    { name: "Cambio de Aceite y Filtro", price: "120.00", duration: 30, type: "maintenance" },
    { name: "Afinamiento Completo", price: "350.00", duration: 120, type: "maintenance" },
    { name: "Cambio de Bujías", price: "180.00", duration: 45, type: "maintenance" },
    { name: "Cambio de Correa de Distribución", price: "800.00", duration: 180, type: "maintenance" },
    { name: "Reparación de Motor", price: "2500.00", duration: 480, type: "mechanic" },
    { name: "Cambio de Embrague", price: "1200.00", duration: 240, type: "mechanic" },
  ],
  electrico: [
    { name: "Diagnóstico Electrónico", price: "100.00", duration: 60, type: "mechanic" },
    { name: "Reparación de Alternador", price: "400.00", duration: 120, type: "mechanic" },
    { name: "Cambio de Batería", price: "150.00", duration: 20, type: "battery" },
    { name: "Reparación de Arranque", price: "350.00", duration: 90, type: "mechanic" },
    { name: "Instalación de Alarma", price: "250.00", duration: 120, type: "other" },
  ],
  frenos: [
    { name: "Cambio de Pastillas de Freno", price: "200.00", duration: 60, type: "maintenance" },
    { name: "Cambio de Discos de Freno", price: "450.00", duration: 90, type: "maintenance" },
    { name: "Purga de Sistema de Frenos", price: "80.00", duration: 30, type: "maintenance" },
    { name: "Alineación Computarizada", price: "120.00", duration: 45, type: "tire" },
    { name: "Balanceo de Ruedas", price: "60.00", duration: 30, type: "tire" },
  ],
  lubricentro: [
    { name: "Cambio de Aceite Mineral", price: "100.00", duration: 20, type: "maintenance" },
    { name: "Cambio de Aceite Semi-sintético", price: "150.00", duration: 20, type: "maintenance" },
    { name: "Cambio de Aceite Sintético", price: "220.00", duration: 20, type: "maintenance" },
    { name: "Cambio de Filtro de Aire", price: "80.00", duration: 15, type: "maintenance" },
    { name: "Revisión de 21 Puntos", price: "50.00", duration: 30, type: "maintenance" },
  ],
};

// Productos de inventario
const PRODUCTS_CATALOG = [
  { name: "Aceite Mobil 1 5W-30 (4L)", price: "180.00", category: "Aceites", stock: 25 },
  { name: "Aceite Castrol GTX 20W-50 (4L)", price: "120.00", category: "Aceites", stock: 30 },
  { name: "Filtro de Aceite Toyota", price: "45.00", category: "Filtros", stock: 40 },
  { name: "Filtro de Aire Universal", price: "35.00", category: "Filtros", stock: 35 },
  { name: "Pastillas de Freno Delanteras", price: "150.00", category: "Frenos", stock: 20 },
  { name: "Pastillas de Freno Traseras", price: "120.00", category: "Frenos", stock: 18 },
  { name: "Batería Bosch 12V 60Ah", price: "650.00", category: "Baterías", stock: 8 },
  { name: "Batería Moura 12V 70Ah", price: "580.00", category: "Baterías", stock: 10 },
  { name: "Bujías NGK (4 unidades)", price: "80.00", category: "Encendido", stock: 50 },
  { name: "Líquido de Frenos DOT 4", price: "35.00", category: "Líquidos", stock: 30 },
  { name: "Refrigerante Anticongelante (4L)", price: "60.00", category: "Líquidos", stock: 25 },
  { name: "Limpiaparabrisas (par)", price: "45.00", category: "Accesorios", stock: 40 },
];

// Solicitudes de asistencia realistas
const ASSISTANCE_REQUESTS = [
  { type: "tow", descriptions: [
    "Mi auto dejó de funcionar en medio de la avenida, necesito grúa urgente.",
    "El motor se recalentó y el auto ya no enciende. Estoy en el 3er anillo.",
    "Choqué y el auto no puede moverse, necesito remolque.",
  ], prices: ["250.00", "300.00", "350.00"] },
  { type: "battery", descriptions: [
    "Batería muerta, dejé las luces prendidas toda la noche.",
    "El auto no arranca, creo que es la batería. Necesito auxilio.",
    "Batería descargada, necesito puente o cambio de batería.",
  ], prices: ["80.00", "100.00", "120.00"] },
  { type: "tire", descriptions: [
    "Llanta pinchada en la carretera, no tengo repuesto.",
    "Se me reventó la llanta y no puedo cambiarla, necesito ayuda.",
    "Tengo el neumático desinflado y no funciona el gato.",
  ], prices: ["60.00", "80.00", "100.00"] },
  { type: "mechanic", descriptions: [
    "El motor hace un ruido extraño, necesito que lo revisen.",
    "Se prendió la luz de check engine, no sé qué pasa.",
    "El auto tiembla mucho cuando acelero, necesito un mecánico.",
  ], prices: ["150.00", "200.00", "180.00"] },
  { type: "fuel", descriptions: [
    "Me quedé sin gasolina en la autopista, necesito combustible.",
    "El medidor de gasolina falló y me quedé sin combustible.",
  ], prices: ["50.00", "70.00"] },
];

// Reviews realistas en español
const REVIEWS_COMMENTS = {
  5: [
    "Excelente servicio, muy profesionales. Llegaron rápido y solucionaron el problema en minutos.",
    "Super recomendado! El mecánico sabía exactamente qué hacer. Precio justo.",
    "Increíble atención. Me explicaron todo el proceso y quedé muy satisfecho.",
    "Los mejores! Ya es la tercera vez que los llamo y siempre cumplen.",
    "Servicio de primera. Puntuales y honestos con el diagnóstico.",
  ],
  4: [
    "Buen servicio en general. Tardaron un poco más de lo esperado pero resolvieron bien.",
    "Profesionales y amables. El precio fue razonable.",
    "Buen trabajo, aunque la comunicación podría mejorar un poco.",
    "Recomendable. Hicieron el trabajo correctamente.",
  ],
  3: [
    "Servicio aceptable. Cumplieron pero nada extraordinario.",
    "Regular. El trabajo quedó bien pero tardaron mucho.",
    "Podría ser mejor. El mecánico llegó tarde.",
  ],
  2: [
    "No muy satisfecho. Tuve que llamar varias veces para que vinieran.",
    "El servicio fue lento y la comunicación mala.",
  ],
  1: [
    "Mala experiencia. No recomiendo.",
  ],
};

// Ubicaciones en Santa Cruz para las solicitudes
const SANTA_CRUZ_LOCATIONS = [
  { lat: -17.7833, lng: -63.1821, zone: "Centro" },
  { lat: -17.7654, lng: -63.1954, zone: "Equipetrol" },
  { lat: -17.7512, lng: -63.1678, zone: "Urbarí" },
  { lat: -17.7923, lng: -63.1523, zone: "Plan 3000" },
  { lat: -17.7789, lng: -63.2012, zone: "4to Anillo Norte" },
  { lat: -17.8012, lng: -63.1756, zone: "Av. Banzer" },
  { lat: -17.7567, lng: -63.1890, zone: "Cristo Redentor" },
  { lat: -17.7890, lng: -63.1634, zone: "Santos Dumont" },
];

// ==================== FUNCIONES HELPER ====================

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(randomNumber(8, 20), randomNumber(0, 59), 0, 0);
  return date;
}

function randomFutureDate(daysAhead: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  date.setHours(randomNumber(8, 18), 0, 0, 0);
  return date;
}

// ==================== MAIN SEED FUNCTION ====================

async function seed() {
  console.log("🌱 Iniciando proceso de seeding para Hugo Automotriz...\n");

  // 1. Clean up data (Preserve Users)
  console.log("🧹 Limpiando tablas (preservando usuarios)...");

  await db.delete(reviews);
  await db.delete(appointments);
  await db.delete(assistanceRequests);
  await db.delete(products);
  await db.delete(services);
  await db.delete(workshops);
  await db.delete(vehicles);

  console.log("✅ Tablas limpiadas.\n");

  // 2. Fetch existing users
  const existingUsers = await db.select().from(users);
  console.log(`👥 Encontrados ${existingUsers.length} usuarios.\n`);

  if (existingUsers.length === 0) {
    console.log("⚠️ No hay usuarios. Por favor registra usuarios en la app primero.");
    return;
  }

  // Separate users by role
  const drivers = existingUsers.filter((u) => u.role === "driver");
  const workshopOwners = existingUsers.filter((u) => u.role === "workshop_owner");

  console.log(`   - Conductores: ${drivers.length}`);
  console.log(`   - Dueños de taller: ${workshopOwners.length}\n`);

  // 3. Create Workshops (assign to workshop owners or create with first user)
  console.log("🏪 Creando talleres...");
  const createdWorkshops = [];

  for (let i = 0; i < WORKSHOPS_DATA.length; i++) {
    const workshopData = WORKSHOPS_DATA[i];
    const owner = workshopOwners[i] || workshopOwners[0] || existingUsers[0];

    const [workshop] = await db
      .insert(workshops)
      .values({
        ownerId: owner.id,
        name: workshopData.name,
        description: workshopData.description,
        address: workshopData.address,
        latitude: workshopData.lat.toString(),
        longitude: workshopData.lng.toString(),
        phone: workshopData.phone,
        rating: (Math.random() * 1.5 + 3.5).toFixed(2), // 3.5 - 5.0
        reviewCount: randomNumber(10, 50),
        tags: workshopData.tags,
      })
      .returning();

    createdWorkshops.push(workshop);
    console.log(`   ✓ ${workshop.name}`);
  }

  // 4. Create Services for each workshop
  console.log("\n🔧 Creando servicios para cada taller...");

  const serviceCategories = Object.values(SERVICES_CATALOG);
  for (const workshop of createdWorkshops) {
    const category = randomElement(serviceCategories);
    const numServices = randomNumber(4, 6);

    for (let i = 0; i < Math.min(numServices, category.length); i++) {
      const serviceData = category[i];
      await db.insert(services).values({
        workshopId: workshop.id,
        name: serviceData.name,
        description: `Servicio profesional de ${serviceData.name.toLowerCase()} con garantía.`,
        price: serviceData.price,
        durationMinutes: serviceData.duration,
        type: serviceData.type as any,
      });
    }
  }
  console.log(`   ✓ Servicios creados para ${createdWorkshops.length} talleres`);

  // 5. Create Products for each workshop
  console.log("\n📦 Creando inventario de productos...");

  for (const workshop of createdWorkshops) {
    const numProducts = randomNumber(5, 10);
    const shuffledProducts = [...PRODUCTS_CATALOG].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numProducts; i++) {
      const productData = shuffledProducts[i];
      await db.insert(products).values({
        workshopId: workshop.id,
        name: productData.name,
        description: `Producto de alta calidad para mantenimiento vehicular.`,
        price: productData.price,
        stock: randomNumber(5, productData.stock),
        category: productData.category,
      });
    }
  }
  console.log(`   ✓ Productos creados para ${createdWorkshops.length} talleres`);

  // 6. Create Vehicles for drivers
  console.log("\n🚗 Creando vehículos para conductores...");

  const userVehiclesMap: Map<number, any[]> = new Map();

  for (const user of drivers.length > 0 ? drivers : existingUsers) {
    const numVehicles = randomNumber(1, 2);
    const userVehicles = [];

    for (let i = 0; i < numVehicles; i++) {
      const vehicleData = randomElement(VEHICLES_BOLIVIA);
      const [vehicle] = await db
        .insert(vehicles)
        .values({
          userId: user.id,
          make: vehicleData.make,
          model: vehicleData.model,
          year: randomElement(vehicleData.years),
          plate: generateBolivianPlate(),
          color: randomElement(vehicleData.colors),
        })
        .returning();

      userVehicles.push(vehicle);
    }

    userVehiclesMap.set(user.id, userVehicles);
    console.log(`   ✓ ${numVehicles} vehículo(s) para ${user.fullName || user.email}`);
  }

  // 7. Create Assistance Requests with various statuses
  console.log("\n🆘 Creando solicitudes de asistencia...");

  const statuses = ["pending", "accepted", "in_progress", "completed", "cancelled"] as const;
  const statusWeights = { pending: 2, accepted: 1, in_progress: 1, completed: 5, cancelled: 1 };
  const weightedStatuses = Object.entries(statusWeights).flatMap(([status, weight]) =>
    Array(weight).fill(status)
  );

  let requestCount = 0;
  for (const user of drivers.length > 0 ? drivers : existingUsers) {
    const userVehicles = userVehiclesMap.get(user.id) || [];
    if (userVehicles.length === 0) continue;

    const numRequests = randomNumber(3, 6);

    for (let i = 0; i < numRequests; i++) {
      const requestType = randomElement(ASSISTANCE_REQUESTS);
      const location = randomElement(SANTA_CRUZ_LOCATIONS);
      const status = randomElement(weightedStatuses);
      const provider = status !== "pending" && status !== "cancelled" ? randomElement(workshopOwners.length > 0 ? workshopOwners : existingUsers) : null;

      await db.insert(assistanceRequests).values({
        userId: user.id,
        vehicleId: randomElement(userVehicles).id,
        providerId: provider?.id || null,
        type: requestType.type as any,
        description: randomElement(requestType.descriptions),
        latitude: (location.lat + (Math.random() * 0.01 - 0.005)).toString(),
        longitude: (location.lng + (Math.random() * 0.01 - 0.005)).toString(),
        status: status as any,
        price: randomElement(requestType.prices),
        createdAt: randomDate(90),
      });

      requestCount++;
    }
  }
  console.log(`   ✓ ${requestCount} solicitudes de asistencia creadas`);

  // 8. Create Reviews for workshops
  console.log("\n⭐ Creando reseñas para talleres...");

  let reviewCount = 0;
  for (const workshop of createdWorkshops) {
    const numReviews = randomNumber(5, 15);

    for (let i = 0; i < numReviews; i++) {
      const rating = randomNumber(1, 5);
      const ratingKey = rating as keyof typeof REVIEWS_COMMENTS;
      const comments = REVIEWS_COMMENTS[ratingKey];
      const reviewer = randomElement(drivers.length > 0 ? drivers : existingUsers);

      await db.insert(reviews).values({
        userId: reviewer.id,
        workshopId: workshop.id,
        rating,
        comment: randomElement(comments),
        createdAt: randomDate(180),
      });

      reviewCount++;
    }
  }
  console.log(`   ✓ ${reviewCount} reseñas creadas`);

  // 9. Create Appointments
  console.log("\n📅 Creando citas programadas...");

  const workshopServices = await db.select().from(services);
  let appointmentCount = 0;

  for (const user of drivers.length > 0 ? drivers : existingUsers) {
    const userVehicles = userVehiclesMap.get(user.id) || [];
    if (userVehicles.length === 0) continue;

    const numAppointments = randomNumber(1, 3);

    for (let i = 0; i < numAppointments; i++) {
      const workshop = randomElement(createdWorkshops);
      const workshopServiceList = workshopServices.filter((s) => s.workshopId === workshop.id);
      if (workshopServiceList.length === 0) continue;

      const service = randomElement(workshopServiceList);
      const appointmentStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
      const status = randomElement(appointmentStatuses);

      await db.insert(appointments).values({
        userId: user.id,
        workshopId: workshop.id,
        vehicleId: randomElement(userVehicles).id,
        serviceId: service.id,
        date: status === "completed" || status === "cancelled" ? randomDate(60) : randomFutureDate(30),
        status: status as any,
        notes: status === "pending" ? "Por favor confirmar disponibilidad." : null,
      });

      appointmentCount++;
    }
  }
  console.log(`   ✓ ${appointmentCount} citas creadas`);

  // 10. Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DEL SEEDING");
  console.log("=".repeat(50));

  const counts = {
    users: (await db.select().from(users)).length,
    vehicles: (await db.select().from(vehicles)).length,
    workshops: (await db.select().from(workshops)).length,
    services: (await db.select().from(services)).length,
    products: (await db.select().from(products)).length,
    assistanceRequests: (await db.select().from(assistanceRequests)).length,
    appointments: (await db.select().from(appointments)).length,
    reviews: (await db.select().from(reviews)).length,
  };

  console.log(`
   Usuarios:              ${counts.users}
   Vehículos:             ${counts.vehicles}
   Talleres:              ${counts.workshops}
   Servicios:             ${counts.services}
   Productos:             ${counts.products}
   Solicitudes:           ${counts.assistanceRequests}
   Citas:                 ${counts.appointments}
   Reseñas:               ${counts.reviews}
  `);

  console.log("✅ Seeding completado exitosamente!\n");
}

seed().catch((err) => {
  console.error("❌ Error en seeding:", err);
  process.exit(1);
});
