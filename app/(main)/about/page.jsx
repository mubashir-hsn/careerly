import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Rocket, Target, Users, Shield, Zap, Globe, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - Careerly",
  description: "Learn about Careerly's mission to revolutionize career growth through advanced AI technology.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
      title: "AI Innovation",
      description: "We leverage cutting-edge Gemini AI to provide granular, actionable career guidance.",
      bg: "bg-blue-50"
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: "Privacy First",
      description: "Your professional data is yours. We prioritize security and data integrity above all else.",
      bg: "bg-emerald-50"
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      title: "Real-time Edge",
      description: "Market trends move fast. Our AI syncs with modern industry patterns in real-time.",
      bg: "bg-amber-50"
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Universal Access",
      description: "Democratizing world-class career coaching for professionals across all industries.",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen pt-10 bg-white">
      {/* Hero Section */}
      <section className="relative p-10 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-slate-100 text-slate-500 border-0 mb-6 font-black uppercase text-[10px] px-3 py-1">Our Story</Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight mb-8">
              Pioneering the Future of <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Career Excellence.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Careerly was born from a simple observation: Talent is universal, but opportunity and guidance are not. We&apos;re here to change that using the power of AI.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-slate-900/10 z-10" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <Rocket className="w-32 h-32 text-indigo-600/20 animate-pulse" />
              </div>
              {/* Fallback for image until user provides one, using gradient and icons for premium feel */}
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay" />
            </div>

            <div className="space-y-10">
              <div>
                <Badge className="bg-indigo-100 text-indigo-600 border-0 mb-4 font-black uppercase text-[10px]">The Mission</Badge>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Bridging the Gap Between Potential and Success</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  We believe that everyone deserves a world-class career coach. Careerly utilizes advanced AI architecture to provide personalized insights that were previously reserved for the elite.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl">Our Vision</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">To become the global standard for professional growth and AI-driven career strategy.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl">Identity</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">A community-centric platform built for ambitious individuals in every sector.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-slate-200 text-slate-600 border-0 mb-4 font-black uppercase text-[10px]">Our Values</Badge>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Principles That Drive Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[32px] overflow-hidden group">
                <CardContent className="pt-10 pb-8 px-8 text-center sm:text-left flex flex-col items-center sm:items-start space-y-4">
                  <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="font-black text-xl text-slate-900">{value.title}</h3>
                  <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full -ml-32 -mb-32 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                Ready to Rewrite Your <br /> Professional Story?
              </h2>
              <p className="text-slate-400 text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join our community of over 10,000 professionals using Careerly to unlock their full potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 h-14 px-10 rounded-2xl font-black hover:bg-slate-100 transition-all text-lg">
                  <Link href="/dashboard">Get Started Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-700 text-white h-14 px-10 rounded-2xl bg-slate-700 font-black transition-all text-lg">
                  <Link href="/pricing" className="flex items-center gap-2">
                    <Shield className="w-5 h-5" /> View Plans
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Have Questions?</h3>
            <p className="text-slate-500 font-medium">Our team is here to help you accelerate your journey.</p>
            <Link href="mailto:support@careerly.com" className="text-indigo-600 font-black text-lg hover:underline underline-offset-8 transition-all">
              support@careerly.com
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
