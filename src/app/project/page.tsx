import { MermaidDiagram } from "@/components/project/MermaidDiagram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ProjectPage() {
  const architectureChart = `
    graph TD
      Client[Client (Browser)] -->|Next.js App Router| Server[Server Components]
      Client -->|Server Actions| Actions[Backend Logic]
      
      subgraph "Backend Services"
        Actions -->|Drizzle ORM| DB[(Neon Postgres)]
        Actions -->|Vercel AI SDK| OpenAI[OpenAI GPT-4]
        Actions -->|Stack Auth| Auth[Authentication]
      end
      
      subgraph "Features"
        DB -->|Workshops Data| WorkshopList[Workshop Directory]
        OpenAI -->|Classification| WorkshopAI[Workshop Auto-Tagging]
        OpenAI -->|Chat Stream| MechanicAI[Mechanic Chatbot]
      end
  `;

  const dbSchemaChart = `
    erDiagram
      USERS ||--o{ VEHICLES : owns
      USERS ||--o{ WORKSHOPS : owns
      USERS ||--o{ REQUESTS : makes
      USERS ||--o{ REVIEWS : writes
      
      WORKSHOPS ||--o{ SERVICES : offers
      WORKSHOPS ||--o{ APPOINTMENTS : receives
      WORKSHOPS ||--o{ REVIEWS : receives
      
      VEHICLES ||--o{ REQUESTS : involved_in
      VEHICLES ||--o{ APPOINTMENTS : booked_for
      
      USERS {
        int id
        string role "driver | workshop_owner"
        string email
      }
      
      WORKSHOPS {
        int id
        string name
        string[] tags
        string description
        decimal rating
      }
      
      REQUESTS {
        int id
        string type "tow | mechanic"
        string status
        decimal latitude
        decimal longitude
      }
  `;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentación del Proyecto</h1>
        <p className="text-xl text-muted-foreground">
          Asistencia Vehicular AI - Plataforma de Asistencia y Gestión
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="tech">Tecnología</TabsTrigger>
          <TabsTrigger value="architecture">Arquitectura</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué es Asistencia Vehicular AI?</CardTitle>
              <CardDescription>El "Uber" para mecánicos y asistencia vehicular en Bolivia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Una plataforma integral que conecta a conductores con problemas mecánicos (o necesidades de mantenimiento) 
                con talleres y grúas cercanas de manera rápida y confiable.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Para Conductores</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Solicitud de grúas y auxilio mecánico en tiempo real.</li>
                    <li>Chatbot con IA para diagnóstico preliminar.</li>
                    <li>Búsqueda de talleres calificados.</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Para Talleres</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Perfil digital con clasificación automática por IA.</li>
                    <li>Gestión de citas y servicios.</li>
                    <li>Visibilidad ante conductores cercanos.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech">
          <Card>
            <CardHeader>
              <CardTitle>Stack Tecnológico</CardTitle>
              <CardDescription>Herramientas modernas para un desarrollo ágil y escalable.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Core</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Next.js 15 (App Router)</Badge>
                    <Badge>React 19</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Tailwind CSS</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend & Data</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Drizzle ORM</Badge>
                    <Badge variant="secondary">Neon (Postgres)</Badge>
                    <Badge variant="secondary">Server Actions</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Inteligencia Artificial</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Vercel AI SDK</Badge>
                    <Badge variant="outline">OpenAI GPT-4o</Badge>
                    <Badge variant="outline">Generative UI</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Infraestructura</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive">Vercel</Badge>
                    <Badge variant="destructive">Stack Auth</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de Información</CardTitle>
              <CardDescription>Cómo interactúan los componentes del sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <MermaidDiagram chart={architectureChart} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Esquema de Base de Datos</CardTitle>
              <CardDescription>Estructura relacional en PostgreSQL.</CardDescription>
            </CardHeader>
            <CardContent>
              <MermaidDiagram chart={dbSchemaChart} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
