export const runtime = "nodejs";

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: Record<string, string>;
}

export async function GET() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new Response("Erro ao buscar modelos", { status: res.status });
    }

    const data = await res.json();
    const models = (data.data as OpenRouterModel[])
      .filter((m) => Object.values(m.pricing || {}).some((v) => v === "0"))
      .map((m) => ({ id: m.id, name: m.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return Response.json(models);
  } catch {
    return new Response("Erro ao buscar modelos", { status: 500 });
  }
}
