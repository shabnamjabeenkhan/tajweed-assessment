const features = [
  {
    title: 'Focused Learning',
    desc: 'Each quiz targets a specific Tajweed rule, helping you master one concept at a time.',
  },
  {
    title: '10 Crafted Questions',
    desc: 'Practice with 10 carefully crafted questions per rule. Skip questions you\'re unsure about or mark them as "I don\'t know" for honest self-assessment.',
  },
  {
    title: 'Instant Feedback',
    desc: 'Get instant feedback on your performance. See which areas need improvement and track your progress over time.',
  },
  {
    title: 'Build Learning Streaks',
    desc: 'Build learning streaks and maintain consistency in your Tajweed practice. Review detailed explanations for every question to deepen your understanding.',
  },
];

export default function ContentSection() {
  return (
    <section className="relative py-14" style={{ backgroundColor: '#1b1c1d' }}>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl text-white">
              Master Tajweed Rules Effectivelyremov
            </h3>
        
          </div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4"
              >
                <h4 className="font-geist text-lg font-bold tracking-tighter text-white">
                  {item.title}
                </h4>
                <p className="text-gray-500">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
