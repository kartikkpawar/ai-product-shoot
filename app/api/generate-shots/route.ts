/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const shotVariations = [
  {
    id: 1,
    type: "Hero Studio Shot",
    description:
      "Clean white seamless background with professional 3-point lighting",
  },
  {
    id: 2,
    type: "Lifestyle Context",
    description:
      "Product in natural environment/real-world setting with ambient lighting",
  },
  {
    id: 3,
    type: "Detail Focus",
    description:
      "Close-up macro shot highlighting key product features and textures",
  },
  {
    id: 4,
    type: "Creative Angle",
    description:
      "Dynamic perspective with dramatic lighting and textured backdrop",
  },
  {
    id: 5,
    type: "Flat Lay Overhead",
    description:
      "Top-down composition with carefully arranged complementary props",
  },
];

const productShotGenPrompt = (
  product_input: string,
  audience_persona: string,
  platform_format: string,
  variation: any
) => {
  return `You are a world-class advertising creative director and professional product photographer. Create ONE photorealistic commercial product shot based on the following inputs:

Product: ${product_input}
Audience Persona: ${audience_persona}
Platform Format: ${platform_format}
Shot Number: [${variation.id} of 5] - ${variation.type}

PHOTOREALISM REQUIREMENTS

Must look exactly like a real photograph shot on a professional DSLR/mirrorless camera
Use authentic studio or natural lighting with realistic shadows, highlights, and reflections
Apply natural depth of field, lens blur, and film-like grain if suitable
Render true-to-life textures, surfaces, and materials
Strictly avoid cartoon, anime, CGI/3D renders, or AI-artifacts
Avoid oversaturated or unnatural lighting—maintain professional, subtle color grading

COMPOSITION & BRANDING

Frame precisely for ${platform_format} aspect ratio and placement requirements
Keep product heroically visible, with logo/branding clear and crisp
Style, lighting, and mood should directly appeal to ${audience_persona}
Leave clean negative space for ad copy overlay
Ensure consistent product identity and brand aesthetic
Follow high-end commercial photography principles

STYLE & EXECUTION

High-end studio-quality commercial product photography
Cinematic precision, natural realism, luxury-grade finish

SPECIFIC SHOT REQUIREMENT

${variation.description}
Generate only ONE final photorealistic marketing product image.`;
};

const generateSingleProductShot = async (
  ai: GoogleGenAI,
  product_input: string,
  audience_persona: string,
  platform_format: string,
  variation: any,
  base64Image: string,
  mimeType: string
) => {
  const prompt = [
    {
      text: productShotGenPrompt(
        product_input,
        audience_persona,
        platform_format,
        variation
      ),
    },
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error(
      `No candidates returned from Gemini API for shot ${variation.id}`
    );
  }

  const candidate = response.candidates[0];
  if (!candidate.content || !candidate.content.parts) {
    throw new Error(
      `Invalid response structure from Gemini API for shot ${variation.id}`
    );
  }

  for (const part of candidate.content.parts) {
    if (part?.inlineData?.data) {
      return {
        shotId: variation.id,
        shotType: variation.type,
        type: "image",
        content: `data:${part?.inlineData?.mimeType};base64,${part.inlineData.data}`,
        mimeType: part?.inlineData?.mimeType,
      };
    }
  }

  throw new Error(`No image data found in response for shot ${variation.id}`);
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const product_input = formData.get("product_input") as string;
    const audience_persona = formData.get("audience_persona") as string;
    const platform_format = formData.get("platform_format") as string;
    const file = formData.get("image") as File;

    if (!product_input || !audience_persona || !platform_format || !file) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: product_input, audience_persona, platform_format, or image",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const fileMimeType = file.type || "image/png";

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    const results: any[] = [];
    const errors: any[] = [];
    let successCount = 0;

    for (const variation of shotVariations) {
      try {
        console.log(`Generating shot ${variation.id}: ${variation.type}`);

        const shot = await generateSingleProductShot(
          ai,
          product_input,
          audience_persona,
          platform_format,
          variation,
          base64Image,
          fileMimeType
        );

        results.push(shot);
        successCount++;

        if (variation.id < shotVariations.length) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      } catch (error: any) {
        console.error(`Error generating shot ${variation.id}:`, error.message);
        errors.push({
          shotId: variation.id,
          shotType: variation.type,
          error: error.message,
        });
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any product shots",
          details: errors,
          totalRequested: shotVariations.length,
          totalGenerated: 0,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount} out of ${shotVariations.length} product shots`,
      results,
      totalGenerated: successCount,
      totalRequested: shotVariations.length,
      ...(errors.length > 0 && { errors, partialFailure: true }),
    });
  } catch (error: any) {
    console.error("Error in product shot generation:", error);
    return NextResponse.json(
      {
        error: "Internal server error during product shot generation",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
