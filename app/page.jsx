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

export default function Home() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/*Features section  */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-5">
          <h1 className="text-3xl p-2 font-bold tracking-tighter text-center mb-12">Powerful Features for Your Career Growth</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-y-10 max-w-5xl mx-auto">
            {
              features.map((feature, index) => {
                return (
                  <Card key={index} className="bg-white border-0 shadow-xl transition-colors duration-300">
                    <CardContent className="pt-2 text-center flex flex-col items-center">
                      <Link href={`${feature.link}`}>
                        <div className="flex flex-col items-center justify-center ">
                          <div className={`px-3 pt-3 rounded-full ${feature.bg} flex justify-center items-center`}>
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold my-2">{feature.title}</h3>
                          <p className=" text-muted-foreground">{feature.description}</p>
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
       <section className="w-full py-12 md:py-24 bg-blue-100/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto font-medium text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground font-medium tracking-wider">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground tracking-wider">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground tracking-wider">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground tracking-wider">AI Support</p>
            </div>
          </div>
        </div>
      </section>

   
      {/*How its work section  */}
    <section className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 max-w-2xl md:px-14">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg py-3 text-center">
            Four simple steps to accelerate your growth
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-muted" />

          <div className="space-y-12">
            {steps.map((item, index) => (
              <div key={index} className="relative flex gap-8">
                <div className="flex flex-col items-center">
                  {index === 0 ? (
                    <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                      {item.step}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500 bg-background flex items-center justify-center text-sm font-semibold text-indigo-500">
                      {item.step}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  {/* <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="w-2 h-2" />
                  </div> */}

                  <div className="space-y-1">
                    <h3 className="font-semibold text-xl">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* Who we are */}
      <section className="w-full pt-20 pb-20 bg-slate-100">
      <div className="max-w-6xl mx-auto px-10 bg-white rounded-lg py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-start">
          {/* Left side */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-purple-500 uppercase">
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Driven by Mission,
              <br />
              Powered by AI
            </h2>

            <p className="mt-6 text-gray-500 text-lg">
              Careerly was founded with a simple belief:
              <br />
              everyone deserves a world class career coach
              <br />
              in their pocket.
            </p>
          </div>

          {/* Right side */}
          <div className="space-y-10">
            {/* Mission */}
            <div className="flex gap-6 items-start">
              <div className="flex items-center justify-center w-24 h-12 rounded-full bg-purple-100">
                <Rocket className="text-purple-600 w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Our Mission
                </h3>
                <p className="mt-2 text-gray-500 leading-relaxed">
                  To bridge the gap between talent and opportunity using
                  artificial intelligence, making career growth accessible
                  to all.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex gap-6 items-start">
              <div className="flex items-center justify-center w-28 h-12 rounded-full bg-pink-100">
                <Users className="text-pink-600 w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Our Values
                </h3>
                <p className="mt-2 text-gray-500 leading-relaxed">
                  We prioritize user privacy, data transparency, and
                  inclusive design in every feature we build, ensuring
                  a fair platform for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* testimonial section */}
      <section className="w-full py-12 md:py-24 md:pb-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background border-0 shadow-xl">
                <CardContent className="">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex justify-center items-center shrink-0 rounded-full border-2 border-gray-800">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className={`text-slate-600 font-medium relative italic pl-4 border-l-2 ${testimonial.border}`}>
                      <blockquote>
                        <span className="text-xl absolute -top-1.25 left-1">
                          &quot;
                        </span>
                        <span className="italic text-[15px]"> {testimonial.quote}</span>
                        <span className="text-xl absolute -bottom-4">
                          &quot;
                        </span>
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-4">
            <Accordion type="single" collapsible className="w-full border-b border-slate-200">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="mt-3 pb-2 border-b border-slate-200">
                  <AccordionTrigger className="text-left cursor-pointer font-medium text-[17px] hover:no-underline [&>svg]:w-7 [&>svg]:h-7 [&>svg]:text-slate-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 font-normal text-justify text-[16px] leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto py-24 bg-slate-100 rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold leading-13 tracking-tight sm:text-4xl md:text-5xl">
              Ready to Accelerate <br /> <span className="bg-linear-to-tl from-violet-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">Your Career?</span>
            </h2>
            <p className="mx-auto max-w-150 text-gray-600 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"

                className="h-11 mt-5 animate-bounce"
              >
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

