import { MermaidDiagram } from "@/components/project/MermaidDiagram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Car, Database, Layers, LayoutDashboard, Server, Shield, Wrench, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-muted/40 pb-12 pt-16 md:pt-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              v1.0.0 Release
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Asistencia Vehicular AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma inteligente de asistencia vehicular y gestión de talleres potenciada por Inteligencia Artificial.
            </p>
            <div className="flex gap-4 pt-4">
              <Badge variant="secondary" className="px-4 py-1 text-sm">Next.js 15</Badge>
              <Badge variant="secondary" className="px-4 py-1 text-sm">AI SDK</Badge>
              <Badge variant="secondary" className="px-4 py-1 text-sm">Postgres</Badge>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      </div>

      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Visión General</TabsTrigger>
              <TabsTrigger value="tech" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Tecnología</TabsTrigger>
              <TabsTrigger value="architecture" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Arquitectura</TabsTrigger>
              <TabsTrigger value="database" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Datos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Para Conductores</CardTitle>
                  <CardDescription>Soluciones inmediatas en el camino</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                        <Zap className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-muted-foreground">Solicitud de grúas y auxilio mecánico en tiempo real con geolocalización.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                        <Bot className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-muted-foreground">Diagnóstico preliminar mediante Chatbot IA especializado.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-purple-500/20 p-1 rounded-full">
                        <LayoutDashboard className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-muted-foreground">Historial completo de mantenimientos y reparaciones.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Para Talleres</CardTitle>
                  <CardDescription>Digitalización y gestión de negocios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-orange-500/20 p-1 rounded-full">
                        <Bot className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-muted-foreground">Clasificación y etiquetado automático del taller mediante IA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-indigo-500/20 p-1 rounded-full">
                        <LayoutDashboard className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-muted-foreground">Gestión digital de citas, servicios y catálogo de precios.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-pink-500/20 p-1 rounded-full">
                        <Zap className="w-3 h-3 text-pink-600" />
                      </div>
                      <span className="text-muted-foreground">Mayor visibilidad ante conductores con problemas cercanos.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Stack Tecnológico
                </CardTitle>
                <CardDescription>Arquitectura moderna, escalable y type-safe.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Frontend Core
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Next.js 15</span>
                        <Badge variant="outline">App Router</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">React 19</span>
                        <Badge variant="outline">RC</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Tailwind CSS</span>
                        <Badge variant="outline">v4</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Backend & Data
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Drizzle ORM</span>
                        <Database className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Neon DB</span>
                        <Badge variant="outline">Serverless</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Server Actions</span>
                        <Zap className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                      AI & Intelligence
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Vercel AI SDK</span>
                        <Bot className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">OpenAI GPT-4o</span>
                        <Badge variant="outline">Model</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Generative UI</span>
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Infraestructura
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Vercel</span>
                        <Server className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="font-medium">Stack Auth</span>
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-muted/20">
                <CardTitle>Arquitectura del Sistema</CardTitle>
                <CardDescription>Diagrama de flujo de datos y componentes.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-black">
                <MermaidDiagram chart={architectureChart} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-muted/20">
                <CardTitle>Modelo de Datos</CardTitle>
                <CardDescription>Esquema Entidad-Relación (ERD) de PostgreSQL.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-black">
                <MermaidDiagram chart={dbSchemaChart} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
