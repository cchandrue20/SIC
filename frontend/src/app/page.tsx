import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now connecting startups worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Where Great Ideas
            <br />
            <span className="gradient-text">Meet Great Support</span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            LaunchPad connects visionary startups with investors and technical experts.
            Find the funding, mentorship, and talent you need to launch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              Start Your Journey
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/browse" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
              Browse Startups
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Connect & Grow</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Our platform makes it seamless for startups and supporters to find each other and collaborate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🚀',
                title: 'Startup Profiles',
                desc: 'Create a compelling profile with your pitch, funding needs, and technical requirements to attract the right supporters.',
              },
              {
                icon: '🤝',
                title: 'Smart Matching',
                desc: 'Browse and filter startups by industry, funding needs, location, and technical requirements to find the perfect match.',
              },
              {
                icon: '💬',
                title: 'Real-time Chat',
                desc: 'Once connected, communicate instantly with real-time messaging, typing indicators, and read receipts.',
              },
              {
                icon: '💰',
                title: 'Investor Network',
                desc: 'Access a curated network of investors looking for the next breakthrough startup to fund and mentor.',
              },
              {
                icon: '🔧',
                title: 'Technical Experts',
                desc: 'Find experienced developers, designers, and technical advisors ready to help build your vision.',
              },
              {
                icon: '📊',
                title: 'Dashboard & Analytics',
                desc: 'Track your connections, manage your profile, and monitor engagement from a single intuitive dashboard.',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-hover p-8 group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to <span className="gradient-text">Launch</span>?
              </h2>
              <p className="text-surface-400 max-w-lg mx-auto mb-8">
                Whether you&apos;re a startup looking for support or an investor seeking the next big thing, LaunchPad is your platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register?role=startup" className="btn-primary px-8 py-4">
                  I&apos;m a Startup
                </Link>
                <Link href="/register?role=supporter" className="btn-accent px-8 py-4">
                  I&apos;m a Supporter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
