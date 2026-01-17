import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Story {
  _id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  slug: {
    current: string;
  };
  mainImage?: any;
}

const Stories = () => {
  const { data: storiesData, isLoading, error } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const data = await client.fetch<Story[]>(`
        *[_type == "story"] | order(publishedAt desc) {
          _id,
          title,
          subtitle,
          excerpt,
          author,
          publishedAt,
          category,
          featured,
          slug,
          mainImage
        }
      `);
      return data;
    },
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      "Profiles in Courage": "bg-primary/20 text-primary border-primary/30",
      "In Her Words": "bg-accent/20 text-accent-foreground border-accent/30",
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground border-border";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stories = storiesData || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="max-w-4xl mb-24">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-6xl md:text-8xl font-black text-foreground mb-8 leading-none tracking-tighter"
            >
              Stories of <span className="text-accent">Courage</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-muted-foreground font-body leading-relaxed max-w-2xl"
            >
              First-hand accounts and investigative profiles of individuals across the globe who refused to be silenced.
            </motion.p>
          </header>

          {/* Featured Story */}
          {stories
            .filter(story => story.featured)
            .map((story) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-24"
              >
                <Card className="overflow-hidden border-none bg-card/40 backdrop-blur-2xl group shadow-none hover:shadow-accent/5 rounded-[3rem]">
                  <div className="flex flex-col xl:flex-row">
                    <div className="xl:w-3/5 overflow-hidden relative group aspect-[16/10] xl:aspect-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10 hidden xl:block" />
                      <img
                        src={story.mainImage ? urlFor(story.mainImage).width(1600).url() : "/placeholder.svg"}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="xl:w-2/5 p-10 md:p-16 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-8">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${getCategoryColor(story.category)}`}>
                          {story.category}
                        </span>
                      </div>

                      {story.slug ? (
                        <Link to={`/stories/${story.slug.current}`}>
                          <CardTitle className="font-heading text-4xl md:text-6xl font-black leading-tight mb-6 hover:text-accent transition-colors tracking-tighter">
                            {story.title}
                          </CardTitle>
                        </Link>
                      ) : (
                        <CardTitle className="font-heading text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tighter">
                          {story.title}
                        </CardTitle>
                      )}

                      <p className="text-xl text-accent font-heading font-bold mb-8 opacity-80 decoration-accent/30 decoration-2 underline-offset-8 underline italic">
                        {story.subtitle}
                      </p>

                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-body">
                        {story.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-border/50 pt-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-widest">{story.author}</p>
                            <p className="text-xs text-muted-foreground font-bold">{new Date(story.publishedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        {story.slug ? (
                          <Link to={`/stories/${story.slug.current}`}>
                            <Button variant="default" size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-14 font-black transition-all">
                              Explore Story
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="default" size="lg" disabled className="rounded-full bg-muted text-muted-foreground px-10 h-14 font-black opacity-50 cursor-not-allowed">
                            Draft Story
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

          {/* Stories Grid */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {stories
              .filter(story => !story.featured)
              .map((story, idx) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full border border-border/50 bg-card/20 backdrop-blur-sm hover:bg-white transition-all duration-500 group overflow-hidden flex flex-col rounded-[2.5rem] shadow-none hover:shadow-2xl hover:-translate-y-2">
                    {story.mainImage && (
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={urlFor(story.mainImage).width(800).url()}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${getCategoryColor(story.category)}`}>
                            {story.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-1">
                      {story.slug ? (
                        <Link to={`/stories/${story.slug.current}`}>
                          <CardTitle className="font-heading text-xl font-black leading-tight mb-4 group-hover:text-accent transition-colors line-clamp-2">
                            {story.title}
                          </CardTitle>
                        </Link>
                      ) : (
                        <CardTitle className="font-heading text-xl font-black leading-tight mb-4 line-clamp-2">
                          {story.title}
                        </CardTitle>
                      )}

                      <p className="text-sm text-accent font-bold mb-4 font-heading italic line-clamp-1">
                        {story.subtitle}
                      </p>

                      <p className="text-muted-foreground text-sm mb-8 leading-relaxed line-clamp-3 font-body">
                        {story.excerpt}
                      </p>

                      <div className="mt-auto flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(story.publishedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                          </div>
                          {story.slug ? (
                            <Link to={`/stories/${story.slug.current}`}>
                              <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-accent hover:text-accent hover:bg-accent/5 transition-all">
                                View Story
                                <ArrowRight className="w-3 h-3 ml-2" />
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="ghost" size="sm" disabled className="font-black text-[10px] uppercase tracking-widest text-muted-foreground cursor-not-allowed">
                              Discover More
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>

          {/* Submission Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-40"
          >
            <Card className="border-none bg-accent p-12 md:p-24 rounded-[4rem] text-center relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(var(--accent),0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <BookOpen className="w-20 h-20 text-accent-foreground mb-10 opacity-20" />
                <h2 className="font-heading text-4xl md:text-6xl font-black mb-8 text-accent-foreground tracking-tighter leading-none">
                  A voice for the <br /><span className="italic opacity-80">unheard.</span>
                </h2>
                <p className="text-xl md:text-2xl text-accent-foreground/80 mb-12 font-medium leading-relaxed">
                  We are building an archive of resilience. If you have a story of standing up against injustice, our platform is your megaphone.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="rounded-full h-16 px-12 font-black text-lg shadow-2xl hover:scale-105 transition-transform">
                    Submit Your Story
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full h-16 px-12 font-black text-lg border-white/30 text-accent-foreground hover:bg-white hover:text-accent transition-all">
                    Our Mission
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
