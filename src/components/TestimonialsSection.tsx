
const testimonials = [
  {
    quote: "ShadowLock has completely transformed how I manage my online security. No more forgotten passwords or security concerns.",
    author: "Sarah Johnson",
    title: "Marketing Director"
  },
  {
    quote: "As a technology professional, I'm extremely cautious about security. ShadowLock exceeds all my expectations with its encryption and ease of use.",
    author: "Michael Chen",
    title: "Software Engineer"
  },
  {
    quote: "Managing passwords for our entire team used to be a nightmare. ShadowLock's business plan solved all our problems in one elegant solution.",
    author: "Emily Rodriguez",
    title: "Operations Manager"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have strengthened their online security with ShadowLock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl border border-border p-8 transition-all duration-300 hover:border-shadow-purple"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-shadow-purple">★</span>
                ))}
              </div>
              <p className="mb-6 text-lg italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
