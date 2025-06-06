export interface OaiMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function openaiChat(
  messages: OaiMsg[],
  model = 'gpt-3.5-turbo',       
) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.choices[0].message.content as string;
}
