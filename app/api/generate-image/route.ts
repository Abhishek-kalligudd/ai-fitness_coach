import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

export async function POST(req: Request) {
  try {
    const { keywords, title } = await req.json();

    const token = process.env.HUGGING_FACE_TOKEN;
    if (!token) return NextResponse.json({ error: "Missing HF_TOKEN" }, { status: 500 });

    const client = new InferenceClient(token);
    const prompt = `Cinematic shot of ${keywords}, context is ${title}, professional photography, 8k resolution, highly detailed, realistic textures, soft studio lighting`;

    try {
      // [FIX] Use double casting: (result as unknown as Blob)
      const response = await client.textToImage({
        model: "black-forest-labs/FLUX.1-dev",
        provider: "nebius",
        inputs: prompt,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 3.5,
        }
      });

      // Force TypeScript to treat it as a Blob
      const imageBlob = response as unknown as Blob;

      // Read the buffer directly
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

      return NextResponse.json({ image: base64Image });

    } catch (modelError: any) {
      console.error("Inference Error:", modelError);
      
      if (modelError.message?.includes("403") || modelError.message?.includes("gated")) {
         return NextResponse.json({ 
             error: "Please accept the FLUX.1-dev license on HuggingFace.co." 
         }, { status: 403 });
      }
      throw modelError;
    }

  } catch (error: any) {
    console.error("General API Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}