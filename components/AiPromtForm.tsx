/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, GpuIcon, ScanSearchIcon } from "lucide-react";
import { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";

const audiencePersonas = [
  { value: "kids", label: "Kids" },
  { value: "gen-z", label: "Gen Z" },
  { value: "eco-conscious", label: "Eco-conscious" },
  { value: "executives", label: "Executives" },
  { value: "luxury-shoppers", label: "Luxury Shoppers" },
  { value: "festival-goers", label: "Festival Goers" },
  { value: "all", label: "All" },
];

const platformFormats = [
  { value: "instagram", label: "Instagram (1080x1080)" },
  { value: "linkedin", label: "LinkedIn Banner (1200x627)" },
  { value: "twitter", label: "Twitter/X (1200x675)" },
  { value: "youtube", label: "YouTube Thumbnail (1280x720)" },
];

export const AiPromtForm = () => {
  const [productInput, setProductInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audiencePersona, setAudiencePersona] = useState("");
  const [platformFormat, setPlatformFormat] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [productShots, setProductShots] = useState([]);

  const handleGenerate = async () => {
    if (!productInput && !selectedFile) return;
    if (!audiencePersona || !platformFormat) return;

    setIsGenerating(true);

    const formData = new FormData();
    formData.append("product_input", productInput);
    formData.append("audience_persona", audiencePersona);
    formData.append("platform_format", platformFormat);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const res = await fetch("/api/generate-shots", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setProductShots(data.results);
    setIsGenerating(false);
    setProductInput("");
    setSelectedFile(null);
    setAudiencePersona("");
    setPlatformFormat("");
  };

  const isFormValid =
    (productInput || selectedFile) && audiencePersona && platformFormat;

  function downloadImage(base64String: string, filename = "product-shot.png") {
    try {
      // Extract the mime type and data from base64 string
      const [header, data] = base64String.split(",");

      const mimeType = header?.match(/:(.*?);/)?.[1] || "image/png";

      // Convert base64 to blob
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Create URL and download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      URL.revokeObjectURL(url);

      console.log(`Image downloaded as: ${filename}`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border/50 backdrop-blur-sm">
      <CardContent className="mx-auto max-w-[540px] space-y-6">
        <FileUpload
          onChange={(files) => {
            setSelectedFile(files[0]);
          }}
        />

        <Textarea
          placeholder="Type what you want us to generate"
          onChange={(event) => setProductInput(event.target.value)}
          value={productInput}
          className="resize-none"
          rows={10}
        />
        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="audience" className="text-sm font-medium">
              Target Audience
            </Label>
            <Select value={audiencePersona} onValueChange={setAudiencePersona}>
              <SelectTrigger
                id="audience"
                className="bg-input/50 border-border"
              >
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {audiencePersonas.map((persona) => (
                  <SelectItem key={persona.value} value={persona.value}>
                    {persona.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="platform" className="text-sm font-medium">
              Platform Format
            </Label>
            <Select value={platformFormat} onValueChange={setPlatformFormat}>
              <SelectTrigger
                id="platform"
                className="bg-input/50 border-border"
              >
                <SelectValue placeholder="Select platform format" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {platformFormats.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!isFormValid || isGenerating}
          className="w-full hover:shadow-glow transition-all duration-300 font-medium"
          size="lg"
        >
          {isGenerating ? (
            <>
              <GpuIcon className="mr-2 h-4 w-4 animate-spin" />
              Enhancing Image...
            </>
          ) : (
            <>
              <GpuIcon className="mr-2 h-4 w-4" />
              Generate Enhanced Image
            </>
          )}
        </Button>
      </CardContent>
      {productShots && (
        <CardFooter className="flex flex-wrap gap-3 items-center justify-center">
          {productShots.map((product: any, index) => (
            <div className="h-[250px] w-[250px] relative" key={index}>
              <Image
                src={product.content}
                height={250}
                width={250}
                alt="image"
                className="object-contain"
              />
              <div
                className="absolute bottom-1 right-1 rounded-sm bg-black/40 p-2 cursor-pointer"
                onClick={() => downloadImage(product.content)}
              >
                <Download className="h-5 w-5 text-white" />
              </div>
              <Dialog>
                <DialogTrigger className="absolute bottom-1 left-1 rounded-sm bg-black/40 p-2 cursor-pointer">
                  <ScanSearchIcon className="h-5 w-5 text-white" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogDescription>
                      <Image
                        src={product.content}
                        height={500}
                        width={500}
                        alt="image"
                        className="object-contain"
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};
