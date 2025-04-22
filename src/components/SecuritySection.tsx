
import { ShieldCheck } from "lucide-react";

const securityFeatures = [
  {
    title: "Zero-Knowledge Architecture",
    description: "Your master password is never sent to our servers. We don't know your passwords, and neither does anyone else."
  },
  {
    title: "AES-256 Encryption",
    description: "All your data is encrypted using the industry-standard AES-256 bit encryption, the same level used by governments and militaries."
  },
  {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security with 2FA. Even if someone gets your master password, they can't access your vault."
  },
  {
    title: "Biometric Authentication",
    description: "Unlock your vault with your fingerprint or face ID for quick and secure access on your devices."
  }
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-shadow-purple/10 rounded-full mb-4">
              <ShieldCheck className="h-5 w-5 text-shadow-purple mr-2" />
              <span className="text-sm font-medium text-shadow-purple">Bank-Level Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Security Is Our Top Priority
            </h2>
            <p className="text-muted-foreground mb-8">
              ShadowLock employs cutting-edge security measures to ensure your passwords and sensitive information remain completely private and secure.
            </p>

            <div className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-shadow-purple/20 flex items-center justify-center mt-1 mr-4">
                    <span className="text-shadow-purple text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
            <div className="p-8">
              <div className="w-20 h-20 bg-shadow-purple/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ShieldCheck className="h-10 w-10 text-shadow-purple" />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Security Dashboard</h3>
                <p className="text-muted-foreground">Your account is protected with multiple layers of security</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Password Strength</span>
                    <span className="text-green-400 text-sm">Strong</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-4/5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Two-Factor Authentication</span>
                    <span className="text-green-400 text-sm">Enabled</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Biometric Authentication</span>
                    <span className="text-green-400 text-sm">Enabled</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
