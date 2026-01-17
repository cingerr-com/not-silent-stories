import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Heart, Send, Instagram, Facebook, Twitter, Linkedin, Globe, Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { writeClient } from "@/lib/sanity";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    newsletter: false,
  });

  // Newsletter state (separate logic as found in About/Blog)
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");

    try {
      // 1. Submit message to Sanity
      await writeClient.create({
        _type: "message",
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        receivedAt: new Date().toISOString(),
      });

      // 2. If newsletter is checked, subscribe them too
      if (formData.newsletter) {
        await writeClient.create({
          _type: "subscriber",
          email: formData.email,
          subscribedAt: new Date().toISOString(),
        });
      }

      setFormStatus("success");
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "", newsletter: false });
    } catch (err) {
      console.error("Submission error:", err);
      setFormStatus("error");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsNewsletterSubmitting(true);
    setNewsletterStatus("idle");

    try {
      await writeClient.create({
        _type: "subscriber",
        email: newsletterEmail,
        subscribedAt: new Date().toISOString(),
      });
      setNewsletterStatus("success");
      setNewsletterEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setNewsletterStatus("error");
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const socials = [
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", color: "hover:text-pink-500" },
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter/X", color: "hover:text-blue-400" },
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", color: "hover:text-blue-600" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", color: "hover:text-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="overflow-hidden">
        {/* Editorial Header */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />

          <div className="max-w-7xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                Contact Us
              </div>
              <h1 className="font-heading text-6xl md:text-8xl font-black text-foreground leading-[0.9] tracking-tighter">
                GET IN<br />
                <span className="text-secondary italic">TOUCH</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light mt-8">
                Have a story that needs to be heard? Or just want to say hello?
                Our platform is built on connection and shared courage.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-start">

              {/* Left Column: Form */}
              <motion.div
                {...fadeInUp}
                className="lg:col-span-7"
              >
                <div className="bg-card/30 backdrop-blur-xl border-2 border-border/50 rounded-[3rem] p-8 md:p-12 shadow-none hover:shadow-primary/5 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h2 className="font-heading text-3xl font-black tracking-tight">Send a Message</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Arbana Xharra"
                          className="h-14 rounded-2xl border-2 border-border/50 bg-background/50 focus:border-primary transition-all font-bold placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="hello@example.com"
                          className="h-14 rounded-2xl border-2 border-border/50 bg-background/50 focus:border-primary transition-all font-bold placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Story Submission / General Inquiry"
                        className="h-14 rounded-2xl border-2 border-border/50 bg-background/50 focus:border-primary transition-all font-bold placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Share your thoughts with us..."
                        className="min-h-[200px] rounded-[2rem] border-2 border-border/50 bg-background/50 focus:border-primary transition-all font-bold p-6 placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="relative flex items-center justify-center">
                        <input
                          id="newsletter"
                          name="newsletter"
                          type="checkbox"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded-lg border-2 border-primary text-primary focus:ring-primary accent-primary"
                        />
                      </div>
                      <Label htmlFor="newsletter" className="text-sm font-medium text-muted-foreground leading-none cursor-pointer">
                        Subscribe to our newsletter for updates and new episodes
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || formStatus === "success"}
                      className="w-full h-16 rounded-full text-lg font-black group shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> :
                        formStatus === "success" ? <CheckCircle2 className="w-6 h-6" /> :
                          <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Right Column: Info & Socials */}
              <div className="lg:col-span-5 space-y-12">

                {/* Connect Details */}
                <motion.div
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Email Directory</h3>
                    <div className="grid gap-6">
                      <div className="group bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">General Inquiries</p>
                        <p className="text-xl font-bold">hello@notsilent.com</p>
                      </div>
                      <div className="group bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Story Submissions</p>
                        <p className="text-xl font-bold">stories@notsilent.com</p>
                      </div>
                      <div className="group bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Press & Media</p>
                        <p className="text-xl font-bold">press@notsilent.com</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Social Grid */}
                <motion.div
                  {...fadeInUp}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Social Channels</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {socials.map((social, i) => (
                      <a
                        key={i}
                        href="#"
                        className={`flex items-center gap-3 p-4 bg-muted/20 border border-border/50 rounded-2xl font-bold transition-all group ${social.color} hover:bg-card hover:shadow-lg`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                          {social.icon}
                        </div>
                        <span className="text-sm">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Voice Badge */}
                <motion.div
                  {...fadeInUp}
                  transition={{ delay: 0.3 }}
                  className="relative p-8 rounded-[3rem] bg-gradient-to-br from-primary to-accent overflow-hidden group shadow-2xl shadow-primary/20"
                >
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Heart className="w-24 h-24 rotate-12 group-hover:scale-125 transition-transform duration-700" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="font-heading text-2xl md:text-3xl font-black text-white leading-tight">Share Your<br />Resilience.</h3>
                    <p className="text-white/80 font-medium italic">
                      "Your story might be the spark someone else needs."
                    </p>
                    <button className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs border-b-2 border-white/50 pb-1 hover:border-white transition-colors">
                      Learn About Submissions <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Consistent with About/Blog */}
        <section className="py-24 px-6 md:pb-48">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-primary/20 bg-gradient-hero backdrop-blur-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                <CardContent className="p-12 md:p-20 text-center relative z-10">
                  <MessageCircle className="w-16 h-16 text-primary mx-auto mb-8 animate-bounce" />
                  <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight">
                    Join the <span className="text-primary italic">Community</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-body">
                    Get notified when new reflections and insights are published. Join our network of thoughtful readers.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
                    <form onSubmit={handleNewsletterSubscribe} className="flex flex-col md:flex-row gap-4 w-full">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={isNewsletterSubmitting || newsletterStatus === "success"}
                        className="flex-1 px-6 h-14 border-2 border-border rounded-full bg-background text-foreground transition-focus focus:border-primary outline-none font-bold disabled:opacity-50"
                      />
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        disabled={isNewsletterSubmitting || newsletterStatus === "success"}
                        className="rounded-full h-14 px-10 font-black shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center min-w-[180px]"
                      >
                        {isNewsletterSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> :
                          newsletterStatus === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                            "Subscribe Now"}
                      </Button>
                    </form>
                  </div>
                  <AnimatePresence>
                    {newsletterStatus === "success" && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-primary font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Welcome to the community!
                      </motion.p>
                    )}
                    {newsletterStatus === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-destructive font-bold"
                      >
                        Something went wrong. Please try again later.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Simple ChevronRight icon since it's not imported from lucide-react in current scope
const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Contact;
