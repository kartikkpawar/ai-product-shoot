import { AiPromtForm } from "@/components/AiPromtForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Target, Palette } from "lucide-react";
import { Cover } from "@/components/ui/cover";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Enhancement",
      description:
        "Transform ordinary product photos into stunning visuals with advanced AI technology",
    },
    {
      icon: Target,
      title: "Audience-Targeted",
      description:
        "Customize images for specific demographics to maximize engagement and conversions",
    },
    {
      icon: Zap,
      title: "Platform Optimized",
      description:
        "Perfect dimensions and styling for Instagram, LinkedIn, Twitter, and YouTube",
    },
    {
      icon: Palette,
      title: "Professional Quality",
      description:
        "Studio-grade results without the studio costs or complexity",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-bg">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Product Enhancement
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Transform Your
              <Cover className="bg-gradient-primary bg-clip-text block">
                Product Images
              </Cover>{" "}
              with AI
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create stunning, audience-targeted product visuals optimized for
              any platform. No design skills required – just upload and watch AI
              work its magic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className=" hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating for Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AiPromtForm />
        </div>
      </section>

      <section className="py-20 bg-gradient-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our AI Enhancer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge AI technology meets user-friendly design for
              professional results every time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-card border border-border/50 hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your{" "}
              <span className="bg-gradient-primary bg-clip-text">
                Product Images?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators and businesses using AI to elevate
              their visual content
            </p>
            <Button
              size="lg"
              className="hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
