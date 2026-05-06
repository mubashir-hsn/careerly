import HeroSection from "@/components/Hero.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { steps } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonials";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Rocket, User, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features section  */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-5">
          <h1 className="text-3xl font-black text-slate-900 mb-12 text-center tracking-tight">Powerful Features for Your Career Growth</h1>



          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-12 max-w-6xl mx-auto">
            {
              features.map((feature, index) => {
                return (
                  <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl overflow-hidden">
                    <CardContent className="pt-8 pb-10 text-center flex flex-col items-center">
                      <Link href={`${feature.link}`} className="w-full">
                        <div className="flex flex-col items-center justify-center">
                          <div className={`px-3 pt-3 rounded-full ${feature.bg} flex justify-center items-center`}>
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-3 pt-3">{feature.title}</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            }
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto font-medium text-center">
            <div className="flex flex-col items-center justify-center space-y-1">
              <h3 className="text-5xl font-black tracking-tighter">50+</h3>
              <p className="font-bold uppercase text-[10px] tracking-widest">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <h3 className="text-5xl font-black tracking-tighter">10K+</h3>
              <p className="font-bold uppercase text-[10px] tracking-widest">AI Insights Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <h3 className="text-5xl font-black tracking-tighter">98%</h3>
              <p className="font-bold uppercase text-[10px] tracking-widest">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <h3 className="text-5xl font-black tracking-tighter">24/7</h3>
              <p className="font-bold uppercase text-[10px] tracking-widest">Intelligent Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How its work section  */}
      <section className="w-full py-32 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-20">
            <Badge className="bg-slate-100 text-slate-500 border-0 mb-4 font-black uppercase text-[10px] px-3">Workflow</Badge>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Four simple steps to accelerate your professional growth
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-1 bg-slate-100 rounded-full" />

            <div className="space-y-16">
              {steps.map((item, index) => (
                <div key={index} className="relative flex gap-12 group">
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg transition-all group-hover:scale-110 ${index % 2 === 0 ? "bg-indigo-600 text-white" : "bg-white border-2 border-indigo-600 text-indigo-600"}`}>
                      {item.step}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-black text-2xl text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="w-full py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="bg-purple-100 text-purple-600 border-0 mb-6 font-black uppercase text-[10px]">The Mission</Badge>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                  Driven by Purpose,
                  <br />
                  <span className="text-purple-600">Empowered by AI.</span>
                </h2>

                <p className="mt-8 text-slate-500 text-lg font-medium leading-relaxed">
                  Careerly was founded with a single, clear objective:
                  to put a world-class career coach in the pocket of every ambitious professional on earth.
                </p>
              </div>

              <div className="space-y-12">
                <div className="flex gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600 shrink-0 shadow-lg">
                    <Rocket className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Our Mission</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      To bridge the gap between human potential and market opportunity using advanced AI.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500 shrink-0 shadow-lg">
                    <Users className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Our Values</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Uncompromising privacy, clear AI help, and inclusive design.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Dynamic */}
      <PricingSection />

      {/* Testimonial Section */}
      <section className="w-full py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="bg-slate-100 text-slate-500 border-0 mb-4 font-black uppercase text-[10px]">Wall of Love</Badge>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Trusted by Professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-slate-50 border-0 shadow-lg rounded-3xl group hover:-translate-y-2 transition-all">
                <CardContent className="pt-8">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-2xl bg-white flex justify-center items-center shrink-0 border border-slate-200 shadow-sm overflow-hidden">
                        <User className="w-7 h-7 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{testimonial.author}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-slate-600 font-bold leading-relaxed italic text-[15px]">
                        &quot;{testimonial.quote}&quot;
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Common Questions
            </h2>
            <p className="text-slate-500 font-medium">
              Everything you need to know about Careerly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-left font-black text-slate-900 py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 font-medium leading-relaxed pb-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-8">
              Ready to Accelerate <br /> <span className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Your Career?</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium mb-12 max-w-2xl leading-relaxed">
              Join thousands of professionals who use Careerly to reach their goals and achieve their dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button asChild size="lg" className="bg-slate-700 text-slate-50 h-16 px-10 rounded-2xl font-black text-xl shadow-2xl animate-bounce hover:bg-slate-800">
                <Link href="/dashboard" className="flex items-center gap-3">
                  Start Your Journey Today <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
