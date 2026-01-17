import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import Navigation from "@/components/Navigation";
import { Calendar, ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) return null;
            return (
                <motion.figure
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="my-12 space-y-3"
                >
                    <img
                        alt={value.alt || "Article image"}
                        loading="lazy"
                        src={urlFor(value).width(1200).url()}
                        className="rounded-2xl w-full shadow-md border border-border/50 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
                    />
                    {value.caption && (
                        <figcaption className="text-center text-sm text-muted-foreground italic font-body">
                            {value.caption}
                        </figcaption>
                    )}
                </motion.figure>
            );
        },
    },
    block: {
        h2: ({ children }: any) => (
            <h2 className="text-3xl font-heading font-bold mt-16 mb-6 text-foreground tracking-tight border-b border-border/30 pb-2">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-2xl font-heading font-bold mt-12 mb-4 text-foreground tracking-tight">
                {children}
            </h3>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-8 my-10 italic text-2xl text-muted-foreground bg-muted/20 py-8 pr-6 rounded-r-2xl font-body leading-relaxed border-y border-r border-border/50">
                "{children}"
            </blockquote>
        ),
        normal: ({ children }: any) => (
            <p className="font-body text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
                {children}
            </p>
        ),
    },
    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc pl-6 space-y-3 mb-8 font-body text-lg text-foreground/80">
                {children}
            </ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal pl-6 space-y-3 mb-8 font-body text-lg text-foreground/80">
                {children}
            </ol>
        ),
    },
};

const BlogPost = () => {
    const { slug } = useParams();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", slug],
        queryFn: async () => {
            const data = await client.fetch(
                `*[_type == "post" && slug.current == $slug][0]`,
                { slug }
            );
            return data;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
                <p className="mt-6 text-muted-foreground font-heading font-medium tracking-widest uppercase text-xs">Loading Story</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-heading font-black mb-4">Post not found</h1>
                <p className="text-muted-foreground mb-8 text-lg max-w-md">The story you're looking for has moved or hasn't been published yet.</p>
                <Link to="/blog">
                    <Button variant="default" className="rounded-full px-8">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-transparent pointer-events-none">
                <motion.div
                    className="h-full bg-primary origin-left"
                    style={{ scaleX }}
                />
            </div>

            <Navigation />

            <main className="relative">
                {/* Article Header / Hero */}
                <header className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

                    <div className="max-w-4xl mx-auto px-6 relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <Link to="/blog" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-12 transition-all group tracking-wide uppercase">
                                <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                                Back to Blog
                            </Link>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                                    {post.category}
                                </span>
                                <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                    <Clock className="w-4 h-4 mr-2 text-primary/60" />
                                    {post.readTime}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground mb-10 leading-[1.05] tracking-tighter">
                                {post.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-border/50 py-10 gap-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center text-white font-black text-2xl shadow-sm rotate-3">
                                        {post.category?.[0] || 'N'}
                                    </div>
                                    <div>
                                        <p className="font-heading font-black text-foreground text-lg">NOT Silent Editorial</p>
                                        <div className="flex items-center text-muted-foreground text-sm font-medium">
                                            <Calendar className="w-4 h-4 mr-2 text-primary/60" />
                                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" size="lg" className="rounded-full gap-2 font-bold transition-all hover:bg-primary hover:text-primary-foreground">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                                        <Bookmark className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Featured Image - Integrated with header flow */}
                <AnimatePresence>
                    {post.mainImage && (
                        <div className="max-w-6xl mx-auto px-6 -mt-6 mb-20 relative z-30">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background"
                            >
                                <img
                                    src={urlFor(post.mainImage).width(1600).url()}
                                    alt={post.title}
                                    className="w-full h-auto object-cover max-h-[650px] transition-transform duration-1000 hover:scale-105"
                                />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Article Content Section */}
                <div className="max-w-3xl mx-auto px-6 pb-32">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="article-content"
                    >
                        {post.body ? (
                            <PortableText value={post.body} components={ptComponents} />
                        ) : (
                            <div className="text-center py-24 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border/50">
                                <p className="italic text-muted-foreground text-lg font-body">
                                    This reflection is currently being prepared for publication. Please check back shortly.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Footer Area */}
                    <motion.footer
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 pt-16 border-t-2 border-border/30"
                    >
                        <div className="bg-muted/30 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 border border-border/50">
                            <div className="text-center md:text-left space-y-2">
                                <h4 className="font-heading font-black text-2xl text-foreground">Inspired by this story?</h4>
                                <p className="text-muted-foreground font-medium max-w-sm">Share your thoughts or explore more perspectives on courage and resilience.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <Link to="/blog" className="w-full sm:w-auto">
                                    <Button variant="default" size="lg" className="w-full rounded-full px-10 font-black h-14 translate-y-0 hover:-translate-y-1 transition-all hover:shadow-primary/20">
                                        Back to Blog
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="rounded-full px-10 font-black h-14 border-2 transition-all">
                                    Join Newsletter
                                </Button>
                            </div>
                        </div>
                    </motion.footer>
                </div>
            </main>
        </div>
    );
};

export default BlogPost;
