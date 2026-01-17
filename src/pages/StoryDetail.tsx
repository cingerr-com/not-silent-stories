import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import Navigation from "@/components/Navigation";
import { Calendar, ArrowLeft, User, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) return null;
            return (
                <motion.figure
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="my-12 space-y-4"
                >
                    <img
                        alt={value.alt || "Story image"}
                        loading="lazy"
                        src={urlFor(value).width(1200).url()}
                        className="rounded-3xl w-full shadow-md border border-border/50 transition-all duration-500 hover:shadow-2xl"
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
            <h2 className="text-3xl font-heading font-black mt-16 mb-6 text-foreground tracking-tight border-b border-border/30 pb-3">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-2xl font-heading font-bold mt-12 mb-4 text-foreground tracking-tight">
                {children}
            </h3>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-8 border-accent pl-8 my-12 italic text-2xl text-foreground font-body leading-relaxed bg-accent/5 py-10 pr-8 rounded-r-[2rem] relative overflow-hidden border-y border-r border-border/50">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50" />
                {children}
            </blockquote>
        ),
        normal: ({ children }: any) => (
            <p className="font-body text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                {children}
            </p>
        ),
    },
};

const StoryDetail = () => {
    const { slug } = useParams();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const { data: story, isLoading } = useQuery({
        queryKey: ["story", slug],
        queryFn: async () => {
            const data = await client.fetch(
                `*[_type == "story" && slug.current == $slug][0]`,
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
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
                />
                <p className="mt-8 text-muted-foreground font-heading font-black tracking-[0.3em] uppercase text-xs animate-pulse">Retracing History</p>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
                    <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-heading font-black mb-4">Story not found</h1>
                <p className="text-muted-foreground mb-10 text-lg max-w-md">This person's journey is currently being transcribed. Check back soon.</p>
                <Link to="/stories">
                    <Button variant="default" className="rounded-full px-10 h-14 font-black">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-accent/30">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-2 z-[100] bg-transparent pointer-events-none">
                <motion.div
                    className="h-full bg-accent origin-left"
                    style={{ scaleX }}
                />
            </div>

            <Navigation />

            <main className="relative">
                {/* Story Header / Hero */}
                <header className="relative pt-40 pb-20 overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent -skew-x-12 -z-10 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-[120px] -z-10" />

                    <div className="max-w-5xl mx-auto px-6 relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        >
                            <Link to="/stories" className="inline-flex items-center text-xs font-black text-muted-foreground hover:text-accent mb-16 transition-all group tracking-[0.2em] uppercase bg-muted/30 px-6 py-2 rounded-full border border-border/50">
                                <ArrowLeft className="mr-3 h-4 w-4 transform group-hover:-translate-x-2 transition-transform" />
                                All Stories
                            </Link>

                            <div className="flex items-center gap-6 mb-10">
                                <span className="px-6 py-2 rounded-2xl bg-accent text-accent-foreground text-xs font-black uppercase tracking-[0.2em]">
                                    {story.category}
                                </span>
                                <div className="h-[2px] w-12 bg-border" />
                                <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-widest bg-muted/30 px-4 py-2 rounded-xl">
                                    <User className="w-4 h-4 mr-3 text-accent" />
                                    {story.author}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-heading font-black text-foreground mb-8 leading-[1] tracking-tighter">
                                {story.title}
                            </h1>

                            <p className="text-2xl md:text-3xl text-muted-foreground font-body leading-relaxed mb-12 max-w-4xl font-light">
                                {story.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border/30 pt-12 gap-10">
                                <div className="flex items-center gap-6 bg-white/50 backdrop-blur-xl p-4 rounded-[2rem] border border-white">
                                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground font-black text-3xl ring-4 ring-white">
                                        {story.title?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-heading font-black text-foreground text-xl">The Interview</p>
                                        <div className="flex items-center text-muted-foreground text-sm font-bold tracking-tight">
                                            <Calendar className="w-4 h-4 mr-2 text-accent" />
                                            {new Date(story.publishedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" size="lg" className="rounded-2xl gap-3 font-black h-16 px-8 border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                                        <Share2 className="w-5 h-5" />
                                        Share Story
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-2xl w-16 h-16 border-2 hover:bg-muted transition-all">
                                        <Bookmark className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                <AnimatePresence>
                    {story.mainImage && (
                        <div className="max-w-7xl mx-auto px-6 mb-32 relative z-30">
                            <motion.div
                                initial={{ opacity: 0, scale: 1.05 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-background relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                                <img
                                    src={urlFor(story.mainImage).width(2000).url()}
                                    alt={story.title}
                                    className="w-full h-auto object-cover max-h-[800px] transition-transform duration-[2000ms] group-hover:scale-110"
                                />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Article Content Section */}
                <div className="max-w-4xl mx-auto px-6 pb-40 relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="article-content"
                    >
                        {story.body ? (
                            <PortableText value={story.body} components={ptComponents} />
                        ) : (
                            <div className="p-16 bg-muted/20 rounded-[3rem] border-4 border-double border-border/50 text-center space-y-6">
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                                    <User className="w-10 h-10 text-accent" />
                                </div>
                                <p className="text-xl text-foreground/70 font-body leading-relaxed max-w-2xl mx-auto">
                                    {story.excerpt}
                                </p>
                                <div className="h-px w-20 bg-accent/30 mx-auto" />
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Original Interview Draft</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Footer Area */}
                    <motion.footer
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-40"
                    >
                        <div className="bg-gradient-hero p-16 rounded-[4rem] border-2 border-border/50 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />

                            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                                <h4 className="font-heading font-black text-4xl md:text-5xl text-foreground tracking-tighter max-w-2xl">Every story matters. Help us find more.</h4>
                                <p className="text-xl text-muted-foreground font-medium max-w-xl">We are dedicated to amplifying voices that refuse to be silenced. If you know of a story of courage, we want to hear it.</p>

                                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                                    <Link to="/contact">
                                        <Button variant="default" className="rounded-full px-12 h-16 font-black text-lg bg-accent text-accent-foreground hover:bg-accent/90 transform hover:-translate-y-2 transition-all">
                                            Submit a Story
                                        </Button>
                                    </Link>
                                    <Link to="/stories">
                                        <Button variant="outline" className="rounded-full px-12 h-16 font-black text-lg border-2 hover:bg-foreground hover:text-background transition-all">
                                            Return to Archives
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.footer>
                </div>
            </main>
        </div>
    );
};

export default StoryDetail;
