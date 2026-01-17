import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, MessageCircle, Clock, Loader2, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor, writeClient } from "@/lib/sanity";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  readTime: string;
  featured: boolean;
  slug: {
    current: string;
  };
  mainImage?: any;
}

const Blog = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const posts = await client.fetch<BlogPost[]>(`
        *[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          excerpt,
          publishedAt,
          category,
          readTime,
          featured,
          slug,
          mainImage
        }
      `);
      return posts;
    },
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await writeClient.create({
        _type: "subscriber",
        email: email,
        subscribedAt: new Date().toISOString(),
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Reflection: "bg-accent/20 text-accent-foreground border-accent/20",
      Commentary: "bg-primary/10 text-primary border-primary/20",
      Personal: "bg-secondary text-secondary-foreground border-border",
      Analysis: "bg-muted text-muted-foreground border-border",
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground border-border";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const posts = blogPosts || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="max-w-3xl mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight tracking-tight"
            >
              Blog & <span className="text-primary italic">Reflections</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed"
            >
              Thoughts on journalism, courage, and the stories that shape our understanding of the world.
            </motion.p>
          </header>

          {/* Featured Post */}
          {posts
            .filter(post => post.featured)
            .map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-20"
              >
                <Card className="overflow-hidden border-2 border-border/50 bg-card/30 backdrop-blur-xl group shadow-none hover:shadow-primary/5 transition-all duration-500">
                  <div className="flex flex-col lg:flex-row">
                    {post.mainImage && (
                      <div className="lg:w-1/2 overflow-hidden aspect-video lg:aspect-auto">
                        <img
                          src={urlFor(post.mainImage).width(1200).url()}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className={`lg:w-1/2 p-8 md:p-12 flex flex-col justify-center ${!post.mainImage ? 'lg:w-full' : ''}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {post.readTime}
                        </div>
                      </div>

                      {post.slug ? (
                        <Link to={`/blog/${post.slug.current}`}>
                          <CardTitle className="font-heading text-3xl md:text-5xl font-black leading-tight mb-6 hover:text-primary transition-colors cursor-pointer tracking-tight">
                            {post.title}
                          </CardTitle>
                        </Link>
                      ) : (
                        <CardTitle className="font-heading text-3xl md:text-5xl font-black leading-tight mb-6 tracking-tight">
                          {post.title}
                        </CardTitle>
                      )}

                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-body line-clamp-3 italic">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-muted-foreground text-sm font-medium">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        {post.slug ? (
                          <Link to={`/blog/${post.slug.current}`}>
                            <Button variant="default" size="lg" className="rounded-full px-8 font-black group transition-all">
                              Read Article
                              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="default" size="lg" disabled className="rounded-full px-8 font-black opacity-50 cursor-not-allowed">
                            Draft Mode
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

          {/* Blog Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter(post => !post.featured)
              .map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full border border-border/50 bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all duration-300 group overflow-hidden flex flex-col shadow-none hover:shadow-xl">
                    {post.mainImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={urlFor(post.mainImage).width(600).url()}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {post.readTime}
                        </div>
                      </div>

                      {post.slug ? (
                        <Link to={`/blog/${post.slug.current}`}>
                          <CardTitle className="font-heading text-xl font-black leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                        </Link>
                      ) : (
                        <CardTitle className="font-heading text-xl font-black leading-tight mb-4 line-clamp-2">
                          {post.title}
                        </CardTitle>
                      )}

                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3 font-body">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex flex-col gap-4">
                        <div className="h-px bg-border/50 w-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                            <Calendar className="w-3 h-3 mr-1.5" />
                            {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          {post.slug ? (
                            <Link to={`/blog/${post.slug.current}`}>
                              <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 transition-all">
                                Read More
                                <ArrowRight className="w-3 h-3 ml-2" />
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="ghost" size="sm" disabled className="font-black text-[10px] uppercase tracking-widest text-muted-foreground cursor-not-allowed">
                              Read More
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32"
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
                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting || status === "success"}
                    className="flex-1 px-6 h-14 border-2 border-border rounded-full bg-background text-foreground transition-focus focus:border-primary outline-none font-bold disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isSubmitting || status === "success"}
                    className="rounded-full h-14 px-10 font-black shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === "success" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </form>
                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-primary font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Welcome to the community!
                    </motion.p>
                  )}
                  {status === "error" && (
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
      </div>
    </div>
  );
};

export default Blog;
