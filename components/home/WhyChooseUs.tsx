export default function WhyChooseUs() {
  const features = [
    { icon: "✅", title: "Verified Tutors", desc: "All tutors are reviewed and verified before listing." },
    { icon: "🔒", title: "Secure Booking", desc: "JWT-protected sessions and encrypted data." },
    { icon: "💬", title: "All Subjects", desc: "From Math to Music — we have a tutor for everything." },
    { icon: "⚡", title: "Instant Tokens", desc: "Get your session token right after booking." },
    { icon: "📱", title: "Mobile Friendly", desc: "Manage bookings from any device, anytime." },
    { icon: "💰", title: "Affordable Rates", desc: "Competitive hourly rates with no hidden fees." },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Why Choose MediQueue?</h2>
        <p className="text-foreground-500">We make learning simple, safe, and effective</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex gap-4 p-5 rounded-xl border border-divider hover:border-primary transition-colors"
          >
            <span className="text-3xl shrink-0">{f.icon}</span>
            <div>
              <h4 className="font-semibold mb-1">{f.title}</h4>
              <p className="text-sm text-foreground-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
