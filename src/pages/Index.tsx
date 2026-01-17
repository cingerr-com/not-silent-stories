import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Image as ImageIcon, Mic, ArrowRight, Users, Globe, Award, Heart, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
// Removed heroLogo import - using Arbana's portrait from public folder
import hostPortrait from "@/assets/host-portrait.jpg";
import featuredStory from "@/assets/featured-story.jpg";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import { getYouTubeThumbnail } from "@/lib/youtube";

interface Episode {
    _id: string;
    title: string;
    description: string;
    publishedAt: string;
    duration: string;
    featured: boolean;
    slug: {
        current: string;
    };
    mainImage?: any;
    youtubeUrl?: string;
}

interface Story {
    _id: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    slug: {
        current: string;
    };
    mainImage?: any;
    author: string;
    category: string;
}

const Index = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const { data: latestEpisode, isLoading } = useQuery({
        queryKey: ["latest-featured-episode"],
        queryFn: async () => {
            const data = await client.fetch<Episode>(`
        *[_type == "episode" && featured == true] | order(publishedAt desc)[0] {
          _id,
          title,
          description,
          publishedAt,
          duration,
          featured,
          slug,
          mainImage,
          youtubeUrl
        }
      `);
            return data;
        },
    });

    const { data: latestStory, isLoading: isStoryLoading } = useQuery({
        queryKey: ["latest-featured-story"],
        queryFn: async () => {
            const data = await client.fetch<Story>(`
        *[_type == "story" && featured == true] | order(publishedAt desc)[0] {
          _id,
          title,
          excerpt,
          publishedAt,
          slug,
          mainImage,
          author,
          category
        }
      `);
            return data;
        },
    });

    const { data: episodeCount } = useQuery({
        queryKey: ["episode-count"],
        queryFn: async () => {
            const count = await client.fetch<number>(`count(*[_type == "episode"])`);
            return count;
        },
    });

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />

            {/* Hero Section */}
            <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-accent/10"></div>
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column - Main Content */}
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Global Voices Platform
                                </div>
                                <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
                                    NOT<br />
                                    <span className="text-primary">Silent</span>
                                </h1>
                                <p className="text-2xl md:text-3xl text-muted-foreground font-light leading-relaxed">
                                    Courageous voices from around the world.<br />
                                    <span className="italic font-medium">Unfiltered. Unafraid.</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {latestEpisode?.slug ? (
                                    <Link to={`/episodes/${latestEpisode.slug.current}`}>
                                        <Button size="lg" className="group">
                                            Latest Episode
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button size="lg" variant="outline" disabled>
                                        Latest Episode
                                    </Button>
                                )}
                                <Link to="/stories">
                                    <Button variant="outline" size="lg">
                                        All Stories
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {episodeCount !== undefined ? episodeCount : "..."}
                                    </div>
                                    <div className="text-sm text-muted-foreground text-nowrap">Episodes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">25</div>
                                    <div className="text-sm text-muted-foreground">Countries</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">100K+</div>
                                    <div className="text-sm text-muted-foreground">Listeners</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Visual */}
                        <div className="relative">
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 shadow-2xl">
                                <img
                                    src="/arbana.jpeg"
                                    alt="Arbana Xharra - Host of NOT Silent"
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Episode */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Decorative background blurs */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid lg:grid-cols-12 gap-16 items-center animate-pulse">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="h-4 w-32 bg-muted rounded"></div>
                                <div className="h-16 w-3/4 bg-muted rounded"></div>
                                <div className="h-24 w-full bg-muted rounded"></div>
                            </div>
                            <div className="lg:col-span-5 h-[500px] bg-muted rounded-[3rem]"></div>
                        </div>
                    ) : latestEpisode ? (
                        <div className="relative">
                            <div className="grid lg:grid-cols-12 gap-8 xl:gap-24 items-center">
                                {/* Content Side */}
                                <div className="lg:col-span-7 z-10 order-2 lg:order-1">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Newest Discussion</span>
                                            </div>

                                            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tighter">
                                                {latestEpisode.title}
                                            </h2>

                                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-body">
                                                {latestEpisode.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-8 py-8 border-y border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Published</p>
                                                    <p className="text-sm font-bold">{new Date(latestEpisode.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Duration</p>
                                                    <p className="text-sm font-bold">{latestEpisode.duration}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-6 pt-4">
                                            {latestEpisode.slug ? (
                                                <Link to={`/episodes/${latestEpisode.slug.current}`}>
                                                    <Button size="lg" className="group">
                                                        <Play className="w-4 h-4 mr-2 fill-current group-hover:scale-110 transition-transform" />
                                                        Listen to Episode
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button size="lg" disabled className="opacity-50">
                                                    Coming Soon
                                                </Button>
                                            )}

                                            <Link to="/episodes">
                                                <Button variant="outline" size="lg">
                                                    View All Episodes
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Visual Side */}
                                <div className="lg:col-span-5 order-1 lg:order-2">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="relative"
                                    >
                                        {/* Floating decorative elements */}
                                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -z-10 animate-pulse" />
                                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDelay: '1.5s' }} />

                                        <div className="relative aspect-square xl:aspect-[4/5] rounded-[4rem] overflow-hidden border-[16px] border-background shadow-none group">
                                            {latestEpisode.mainImage ? (
                                                <img
                                                    src={urlFor(latestEpisode.mainImage).width(1200).url()}
                                                    alt={latestEpisode.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : latestEpisode.youtubeUrl ? (
                                                <img
                                                    src={getYouTubeThumbnail(latestEpisode.youtubeUrl) || ""}
                                                    alt={latestEpisode.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-12">
                                                    <Mic className="w-32 h-32 text-primary/20" />
                                                </div>
                                            )}

                                            {/* Overlapping Mic Badge */}
                                            <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-700">
                                                <div className="relative">
                                                    <Mic className="w-14 h-14" />
                                                    <div className="absolute -inset-4 rounded-full border-4 border-dashed border-accent-foreground/30" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-muted/20 rounded-[4rem] border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground uppercase tracking-widest text-sm font-black">No featured episodes found</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Story */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-accent-foreground text-sm font-medium">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Featured Story
                        </div>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                            Voices of Resilience
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful stories that speak to the human experience, captured through the lens of courage
                        </p>
                    </div>

                    {isStoryLoading ? (
                        <div className="grid lg:grid-cols-2 gap-16 items-center animate-pulse">
                            <div className="aspect-[4/3] rounded-3xl bg-muted"></div>
                            <div className="space-y-6">
                                <div className="h-10 w-3/4 bg-muted rounded"></div>
                                <div className="h-20 w-full bg-muted rounded"></div>
                                <div className="h-12 w-40 bg-muted rounded"></div>
                            </div>
                        </div>
                    ) : latestStory ? (
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Image */}
                            <div className="relative group">
                                {latestStory.slug && (
                                    <Link to={`/stories/${latestStory.slug.current}`}>
                                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                            {latestStory.mainImage ? (
                                                <img
                                                    src={urlFor(latestStory.mainImage).width(1200).url()}
                                                    alt={latestStory.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                        </div>
                                    </Link>
                                )}
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-foreground">
                                    {latestStory.author} • {new Date(latestStory.publishedAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                        {latestStory.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {latestStory.excerpt}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center p-6 bg-card rounded-2xl border border-border/50">
                                        <div className="text-2xl font-bold text-primary">{latestStory.category}</div>
                                        <div className="text-sm text-muted-foreground">Category</div>
                                    </div>
                                    <div className="text-center p-6 bg-card rounded-2xl border border-border/50">
                                        <div className="text-2xl font-bold text-primary">Featured</div>
                                        <div className="text-sm text-muted-foreground">Spotlight</div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    {latestStory.slug ? (
                                        <Link to={`/stories/${latestStory.slug.current}`}>
                                            <Button size="lg" className="group">
                                                Read Full Story
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button size="lg" disabled className="opacity-50">
                                            Coming Soon
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-muted/20 rounded-[4rem] border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground uppercase tracking-widest text-sm font-black">No featured stories found</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Navigation Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Explore Our Platform
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover stories, episodes, and voices that matter
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-heading text-xl font-bold text-foreground">About</h3>
                                    <p className="text-muted-foreground leading-relaxed">Learn about our mission and meet Arbana Xharra</p>
                                </div>
                                <Link to="/about">
                                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        Learn More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <Mic className="w-8 h-8 text-accent" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-heading text-xl font-bold text-foreground">Episodes</h3>
                                    <p className="text-muted-foreground leading-relaxed">Browse all podcast conversations and interviews</p>
                                </div>
                                <Link to="/episodes">
                                    <Button variant="ghost" className="group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                                        Explore
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="bg-gradient-to-br from-primary/20 to-muted/20 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <ImageIcon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-heading text-xl font-bold text-foreground">Stories</h3>
                                    <p className="text-muted-foreground leading-relaxed">Read written interviews and inspiring profiles</p>
                                </div>
                                <Link to="/stories">
                                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        Read
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <Heart className="w-8 h-8 text-accent" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-heading text-xl font-bold text-foreground">Contact</h3>
                                    <p className="text-muted-foreground leading-relaxed">Share your story or connect with us</p>
                                </div>
                                <Link to="/contact">
                                    <Button variant="ghost" className="group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                                        Connect
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-16">
                        <div className="space-y-8">
                            <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight">
                                Your Voice<br />
                                <span className="text-primary">Matters</span>
                            </h2>
                            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Have a story of courage to share? We believe every voice has the power
                                to inspire change and challenge the status quo.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
                            <Button size="lg" className="group text-lg px-8 py-6">
                                Share Your Story
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                                Subscribe to Newsletter
                            </Button>
                        </div>

                        {/* Newsletter signup visual indicator */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16">
                            <div className="text-center space-y-3">
                                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                    <Globe className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold">Global Impact</h3>
                                <p className="text-muted-foreground text-sm">Stories from every corner of the world</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                    <Users className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold">Growing Community</h3>
                                <p className="text-muted-foreground text-sm">Join thousands of engaged listeners</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold">Real Stories</h3>
                                <p className="text-muted-foreground text-sm">Authentic voices, unfiltered truth</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
