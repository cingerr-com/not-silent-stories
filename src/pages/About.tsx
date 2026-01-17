import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              About NOT Silent
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Amplifying courageous voices from around the world. Unfiltered. Unafraid.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-12 border border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                Our Mission
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  NOT Silent is more than a podcast—it's a platform for the brave voices that refuse to be silenced. 
                  In a world where truth is often buried beneath noise, we dig deeper. We listen harder. We amplify the stories that matter.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  From journalists on the front lines to activists fighting for justice, from survivors sharing their truth to 
                  changemakers breaking barriers—every conversation is a testament to human resilience and the power of speaking out.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that every voice has the power to spark change, challenge systems, and inspire others to find their own courage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Host Profile */}
          <Card className="border border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                    Meet Arbana Xharra
                  </h2>
                  <div className="prose prose-lg">
                    <p className="text-muted-foreground leading-relaxed mb-4">
  Arbana Xharra is a Kosovo-born investigative journalist and former editor-in-chief of <em>Zëri</em>, with a career that began in 2001. She gained early experience working for Koha Ditore, Kosovo’s first independent newspaper, and later contributed to Balkan Insight. Throughout her career, Xharra has pursued stories of public consequence—investigating government financial misconduct, inflation, public asset misuse, and suspicious links between businesses and politics. 
</p>

<p className="text-muted-foreground leading-relaxed">
  Xharra’s resolute journalistic courage earned her multiple honors, including three UNDP prizes, the Rexhai Surroi Award, and the prestigious 2015 International Women of Courage Award from the U.S. State Department. Her spotlight on extremism sparked a vicious campaign of intimidation—vandalism, threats against her and her children, and even a brutal physical assault in May 2017 that hospitalized her. In 2018, seeking safety for herself and her family, she relocated to the United States, where she continues her investigative endeavors and research, collaborating with international institutions while remaining a powerful voice for truth and accountability.
</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full max-w-xs mx-auto aspect-[2/4] rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="/arbana.jpeg" 
                      alt="Arbana Xharra" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 italic">
                    "Every story shared is an act of resistance against silence."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Milestones */}
          <Card className="mt-12 border border-border/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                Journey Milestones
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">2024: NOT Silent Launch</h3>
                    <p className="text-muted-foreground">Premiered with groundbreaking interview series focusing on global press freedom</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Recognition & Impact</h3>
                    <p className="text-muted-foreground">Featured in international journalism forums for innovative storytelling approach</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Global Community</h3>
                    <p className="text-muted-foreground">Built a network of courageous voices spanning six continents</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
