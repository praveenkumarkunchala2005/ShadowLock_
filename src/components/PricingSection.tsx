
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic password management for individuals",
    features: [
      "Store up to 50 passwords",
      "Access on 1 device type",
      "Password generator",
      "Secure notes",
      "30-day password history"
    ],
    buttonText: "Sign Up Free",
    highlighted: false
  },
  {
    name: "Premium",
    price: "$3.99",
    period: "per month",
    description: "Advanced security for individuals and families",
    features: [
      "Unlimited password storage",
      "Access on all devices",
      "Password sharing",
      "Data breach monitoring",
      "1GB encrypted file storage",
      "Priority support",
      "Emergency access"
    ],
    buttonText: "Get Premium",
    highlighted: true
  },
  {
    name: "Business",
    price: "$5.99",
    period: "per user/month",
    description: "Complete solution for teams and organizations",
    features: [
      "Everything in Premium",
      "Team password sharing",
      "Admin controls",
      "User management",
      "Activity reporting",
      "API access",
      "SSO integration",
      "Dedicated support"
    ],
    buttonText: "Contact Sales",
    highlighted: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the Perfect Plan for You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing options designed to fit your needs, from individuals to large organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-card rounded-xl border ${
                plan.highlighted ? 'border-shadow-purple shadow-glow' : 'border-border'
              } overflow-hidden transition-all duration-300 hover:border-shadow-purple hover:shadow-lg`}
            >
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <Button 
                  className={`w-full mb-6 ${
                    plan.highlighted 
                    ? 'bg-shadow-purple hover:bg-shadow-purple/90' 
                    : ''
                  } btn-hover-effect`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-shadow-purple mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
