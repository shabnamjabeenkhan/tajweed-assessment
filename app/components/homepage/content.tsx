import {
  Target,
  HelpCircle,
  TrendingUp,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: <Target className="h-6 w-6" style={{ color: '#114b3c' }} />,
    title: 'Focused Learning',
    desc: 'Each quiz targets a specific Tajweed rule, helping you master one concept at a time.',
  },
  {
    icon: <HelpCircle className="h-6 w-6" style={{ color: '#114b3c' }} />,
    title: '10 Crafted Questions',
    desc: 'Practice with 10 carefully crafted questions per rule. Skip questions you\'re unsure about or mark them as "I don\'t know" for honest self-assessment.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" style={{ color: '#114b3c' }} />,
    title: 'Instant Feedback',
    desc: 'Get instant feedback on your performance. See which areas need improvement and track your progress over time.',
  },
  {
    icon: <Award className="h-6 w-6" style={{ color: '#114b3c' }} />,
    title: 'Build Learning Streaks',
    desc: 'Build learning streaks and maintain consistency in your Tajweed practice. Review detailed explanations for every question to deepen your understanding.',
  },
];

export default function ContentSection() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl text-gray-300">
              Master Tajweed Rules Effectively
            </h3>
        
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                'linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)',
            }}
          ></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]"
              >
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter text-gray-200">
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
