const BACKEND_URL = process.env.VITE_PUBLIC_API_URL || ""

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    }
  }
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: event.body,
    })

    const data = await res.text()
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    }
  } catch (err) {
    console.error("Proxy error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy failed" }),
    }
  }
}
