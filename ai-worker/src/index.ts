import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
		}

		try {
			const body = await request.json() as any;
            
            // Handle Maintenance Analysis
            if (body.action === 'maintenance') {
                const { vehicleDetails, serviceHistory } = body;
                const ai = new Ai(env.AI);

                const systemPrompt = `Eres un experto mecánico automotriz de Hugo Automotriz.
                Tu tarea es analizar el estado de un vehículo y su historial de servicios para sugerir mantenimiento preventivo.
                
                Contexto:
                - Vehículo: ${vehicleDetails}
                - Historial de Servicios Recientes: ${serviceHistory || "No hay historial disponible."}
                - Ubicación: Bolivia (considera altura, caminos difíciles).
                
                Instrucciones:
                1. Analiza el vehículo y el historial.
                2. Genera una lista de servicios recomendados.
                3. Asigna urgencia (low, medium, high) y costo estimado en Bolivianos (Bs).
                4. Genera un resumen corto.
                
                IMPORTANTE: Tu respuesta DEBE ser SOLAMENTE un objeto JSON válido con la siguiente estructura, sin texto adicional ni bloques de código markdown:
                {
                  "summary": "Resumen del análisis...",
                  "services": [
                    {
                      "service": "Nombre del servicio",
                      "urgency": "high",
                      "reason": "Razón técnica...",
                      "estimatedCost": "Bs. 500"
                    }
                  ]
                }`;

                const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: "Genera el reporte de mantenimiento." }
                    ],
                    stream: false, // We want the full JSON
                });

                // Llama 3 might wrap in markdown code block, try to clean it
                let jsonStr = (response as any).response;
                jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

                try {
                    // Validate JSON
                    JSON.parse(jsonStr);
                    return new Response(jsonStr, {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                } catch (e) {
                    console.error("Invalid JSON from AI:", jsonStr);
                    return new Response(JSON.stringify({ error: "AI generated invalid JSON", raw: jsonStr }), {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
            }

            // Default Chat Handler (Existing)
			const { messages, vehicleContext } = body;
			const ai = new Ai(env.AI);

			const contextPrompt = vehicleContext 
				? `El usuario está consultando sobre el siguiente vehículo: ${vehicleContext}. Ten esto en cuenta para tus respuestas.`
				: "";

			const systemPrompt = `Eres "Hugo", un asistente mecánico experto de la plataforma Hugo Automotriz en Bolivia.
			
			Tus características son:
			- Eres servicial, paciente y muy conocedor de mecánica automotriz.
			- Hablas español neutro pero amigable, usando términos comunes en Bolivia si es necesario.
			- Tu prioridad es la seguridad del conductor.
			- Conoces el contexto de Bolivia: terrenos difíciles, altura.
			- La moneda es Bolivianos (Bs).
			
			IMPORTANTE: Si el usuario confirma que desea solicitar asistencia o crear un ticket, y ya tienes la información necesaria (tipo de problema y descripción básica), DEBES generar un bloque JSON al final de tu respuesta con el siguiente formato EXACTO:
			
			\`\`\`json
			{
			  "action": "create_ticket",
			  "data": {
			    "serviceType": "mechanical_issue", 
			    "description": "Resumen del problema del usuario"
			  }
			}
			\`\`\`
			
			Los tipos de servicio válidos son: "tow_truck" (grúa), "mechanical_issue" (mecánico), "tire_change" (llanta), "battery_jump" (batería), "locksmith" (cerrajero), "fuel_delivery" (gasolina). Elige el más apropiado.
			
			${contextPrompt}
			
			Responde de manera concisa y útil. Usa formato Markdown.`;

			const chatMessages = [
				{ role: 'system', content: systemPrompt },
				...messages.map((m: any) => ({
					role: m.role,
					content: m.content
				}))
			];

			const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
				messages: chatMessages,
				stream: true,
			});

			return new Response(response as any, {
				headers: {
					...corsHeaders,
					'Content-Type': 'text/event-stream',
				},
			});

		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
	},
};
