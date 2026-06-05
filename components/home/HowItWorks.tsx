export default function HowItWorks() {
  const steps = [
    { icon: "🔍", title: "Search", desc: "Browse tutors by subject, location, or availability." },
    { icon: "📅", title: "Book", desc: "Choose your slot and book a session instantly." },
    { icon: "🎓", title: "Learn", desc: "Attend your session online or offline and level up." },
  ];

  return (
    <section className="bg-content1 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-foreground-500">Three simple steps to start learning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-background border border-divider hover:shadow-md transition-shadow"
            >
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-foreground-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
