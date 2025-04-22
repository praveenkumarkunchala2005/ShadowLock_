
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-2 bg-shadow-purple/10 rounded-full mb-4">
            <Lock className="h-5 w-5 text-shadow-purple mr-2" />
            <span className="text-sm font-medium text-shadow-purple">Secure Password Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Keep Your Digital World <span className="text-shadow-purple">Safe</span> & <span className="text-shadow-purple">Organized</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in">
            ShadowLock helps you create, store, and manage strong passwords in one secure place. Never forget a password again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <a href="/dashboard">
            <Button className="bg-shadow-purple hover:bg-shadow-purple/90 btn-hover-effect text-lg px-8 py-6">
              Try ShadowLock Free
            </Button>
            </a>
            <a href="#security">
            <Button variant="outline" className="btn-hover-effect text-lg px-8 py-6">
              How It Works
            </Button>
            </a>
          </div>
          <div className="mt-12 bg-card rounded-xl p-6 shadow-lg border border-border w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-muted-foreground">ShadowLock Vault</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 bg-shadow-purple/20 rounded-full mr-2"></div>
                  <div className="text-sm font-medium">Acme Banking</div>
                </div>
                <div className="px-2 py-1 text-xs bg-secondary rounded-md font-mono">
                  ••••••••••••••••
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 bg-shadow-purple/20 rounded-full mr-2"></div>
                  <div className="text-sm font-medium">Social Network</div>
                </div>
                <div className="px-2 py-1 text-xs bg-secondary rounded-md font-mono">
                  ••••••••••••••••
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
