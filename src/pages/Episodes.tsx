import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import { Link } from "react-router-dom";
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
  youtubeUrl?: string;
  audioUrl?: string;
  mainImage?: any;
}

const Episodes = () => {
  const { data: episodesData, isLoading, error } = useQuery({
    queryKey: ["episodes"],
    queryFn: async () => {
      const data = await client.fetch<Episode[]>(`
        *[_type == "episode"] | order(publishedAt desc) {
          _id,
          title,
          description,
          publishedAt,
          duration,
          featured,
          slug,
          youtubeUrl,
          mainImage
        }
      `);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="py-16 px-4 text-center">
          <p className="text-muted-foreground">Loading episodes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="py-16 px-4 text-center">
          <p className="text-red-500">Failed to load episodes. Please check your connection.</p>
        </div>
      </div>
    );
  }

  const episodes = episodesData || [];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Episodes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dive deep into conversations that matter. Each episode brings you closer to the stories that shape our world.
            </p>
          </div>

          {/* Featured Episode */}
          {episodes
            .filter(episode => episode.featured)
            .map((episode) => (
              <Card key={episode._id} className="mb-12 border border-border/20 bg-card overflow-hidden backdrop-blur-sm group">
                <div className="grid md:grid-cols-12 gap-0">
                  <div className="md:col-span-4 relative aspect-video md:aspect-auto overflow-hidden">
                    {episode.mainImage ? (
                      <img
                        src={urlFor(episode.mainImage).width(800).url()}
                        alt={episode.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : episode.youtubeUrl ? (
                      <img
                        src={getYouTubeThumbnail(episode.youtubeUrl) || ""}
                        alt={episode.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Play className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-8 p-6 md:p-10 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="font-heading text-2xl md:text-4xl font-black leading-tight mb-4">
                        {episode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed line-clamp-2 md:line-clamp-3">
                        {episode.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-auto">
                        <div className="flex items-center space-x-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            {new Date(episode.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            {episode.duration}
                          </div>
                        </div>
                        {episode.slug ? (
                          <Link to={`/episodes/${episode.slug.current}`}>
                            <Button size="lg" className="rounded-full px-8 font-black group h-14">
                              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                              Listen Now
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled size="lg" className="rounded-full px-8 font-black opacity-50 cursor-not-allowed h-14">
                            Draft Mode
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}

          {/* Episodes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episodes
              .filter(episode => !episode.featured)
              .map((episode) => (
                <Card key={episode._id} className="border border-border/20 bg-card/50 overflow-hidden backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group">
                  <div className="aspect-video relative overflow-hidden">
                    {episode.mainImage ? (
                      <img
                        src={urlFor(episode.mainImage).width(400).url()}
                        alt={episode.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : episode.youtubeUrl ? (
                      <img
                        src={getYouTubeThumbnail(episode.youtubeUrl) || ""}
                        alt={episode.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-lg font-black leading-tight line-clamp-2 min-h-[3rem]">
                      {episode.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-2 font-body">
                      {episode.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1.5 text-primary" />
                          <span>{new Date(episode.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1.5 text-primary" />
                          <span>{episode.duration}</span>
                        </div>
                      </div>
                      {episode.slug ? (
                        <Link to={`/episodes/${episode.slug.current}`}>
                          <Button variant="ghost" size="sm" className="h-10 rounded-full font-black text-xs hover:bg-primary hover:text-white transition-all px-4">
                            View
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Draft</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="border border-border/20 bg-muted/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="font-heading text-2xl font-semibold mb-4 text-foreground">
                  Never Miss an Episode
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to NOT Silent and be the first to hear new conversations that challenge, inspire, and empower.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="default" size="lg">Subscribe on Apple Podcasts</Button>
                  <Button variant="outline" size="lg">Listen on Spotify</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Episodes;
