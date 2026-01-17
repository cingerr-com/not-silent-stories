import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/sanity";
import Navigation from "@/components/Navigation";
import { Calendar, ArrowLeft, Clock, Share2, Youtube, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface Episode {
    _id: string;
    title: string;
    description: string;
    publishedAt: string;
    duration: string;
    youtubeUrl?: string;
}

const EpisodeDetail = () => {
    const { slug } = useParams();

    const { data: episode, isLoading } = useQuery({
        queryKey: ["episode", slug],
        queryFn: async () => {
            return await client.fetch<Episode>(
                `*[_type == "episode" && slug.current == $slug][0]`,
                { slug }
            );
        },
        enabled: !!slug,
    });


    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-heading uppercase tracking-widest text-xs">Loading Episode</p>
            </div>
        );
    }

    if (!episode) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-heading font-black mb-4">Episode not found</h1>
                <Link to="/episodes">
                    <Button variant="default" className="rounded-full px-8">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Episodes
                    </Button>
                </Link>
            </div>
        );
    }

    const embedUrl = getYouTubeEmbedUrl(episode.youtubeUrl);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="relative pt-32 pb-24 overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/4" />

                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link to="/episodes" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-12 transition-all group tracking-wide uppercase">
                            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Episodes
                        </Link>

                        <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-black">
                                Podcast Episode
                            </span>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                {new Date(episode.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                {episode.duration}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-heading font-black text-foreground mb-12 leading-tight tracking-tighter">
                            {episode.title}
                        </h1>

                        {/* Video / Content Section */}
                        <div className="relative z-20 mb-16">
                            {embedUrl ? (
                                <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border-8 border-background bg-black group transition-all duration-500 hover:scale-[1.01]">
                                    <iframe
                                        src={embedUrl}
                                        title={episode.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full border-0"
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="aspect-video w-full rounded-[2.5rem] bg-muted/30 border-4 border-dashed border-border flex flex-col items-center justify-center text-center p-12">
                                    <Youtube className="w-16 h-16 text-muted-foreground mb-6" />
                                    <p className="text-muted-foreground text-xl font-medium max-w-md">No video preview available for this episode yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-16">
                            <div className="lg:col-span-2">
                                <h3 className="text-2xl font-heading font-black mb-6 flex items-center">
                                    <Info className="w-6 h-6 mr-3 text-primary" />
                                    Episode Synopsis
                                </h3>
                                <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed whitespace-pre-wrap">
                                    {episode.description}
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="p-8 bg-muted/30 rounded-3xl border border-border/50">
                                    <h4 className="font-heading font-black text-xs mb-6 uppercase tracking-[0.2em] text-muted-foreground">Share this episode</h4>
                                    <div className="flex flex-col gap-4">
                                        <Button className="w-full rounded-2xl h-14 font-black gap-3 transform hover:-translate-y-1 transition-all">
                                            <Share2 className="w-5 h-5" />
                                            Share Link
                                        </Button>
                                        <Button variant="outline" className="w-full rounded-2xl h-14 font-black gap-3 border-2">
                                            <Youtube className="w-5 h-5 text-red-600" />
                                            Watch on YouTube
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default EpisodeDetail;
