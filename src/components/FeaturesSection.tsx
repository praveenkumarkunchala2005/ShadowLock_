
import { Shield, Lock, Key, User, Users } from "lucide-react";

const features = [
  {
    icon: <Lock className="h-10 w-10 text-shadow-purple" />,
    title: "Password Generator",
    description: "Create strong, unique passwords with our advanced password generator. Customize length and complexity to meet your security needs."
  },
  {
    icon: <Key className="h-10 w-10 text-shadow-purple" />,
    title: "Secure Vault",
    description: "Store all your passwords in an encrypted vault that only you can access. Your data is protected with AES-256 encryption."
  },
  {
    icon: <User className="h-10 w-10 text-shadow-purple" />,
    title: "Autofill",
    description: "Save time with automatic form filling. ShadowLock fills in your credentials with a single click across all your devices."
  },
  {
    icon: <Shield className="h-10 w-10 text-shadow-purple" />,
    title: "Data Breach Alerts",
    description: "Get instant notifications if your accounts are compromised in a data breach. Stay one step ahead of hackers."
  },
  {
    icon: <Users className="h-10 w-10 text-shadow-purple" />,
    title: "Secure Sharing",
    description: "Share passwords securely with family or team members without exposing sensitive information."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Complete Protection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ShadowLock combines advanced security with intuitive design to keep your digital identity safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-xl border border-border hover:border-shadow-purple transition-colors duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
