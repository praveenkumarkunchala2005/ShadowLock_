
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="bg-shadow-purple/10 rounded-2xl p-12 text-center max-w-4xl mx-auto border border-shadow-purple/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of individuals and businesses who trust ShadowLock to protect their most sensitive information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-shadow-purple hover:bg-shadow-purple/90 btn-hover-effect text-lg px-8 py-6">
              Try ShadowLock Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
