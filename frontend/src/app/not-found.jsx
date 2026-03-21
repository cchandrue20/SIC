import Link from 'next/link';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg" },
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
  { text: "If you are not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
  { text: "Chase the vision, not the money; the money will end up following you.", author: "Tony Hsieh" },
  { text: "Don't worry about failure; you only have to be right once.", author: "Drew Houston" },
];

export default function NotFound() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="text-center max-w-lg animate-slide-up">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-surface-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Inspirational Quote */}
        <div className="glass p-6 mb-8">
          <p className="text-surface-200 italic text-lg leading-relaxed mb-3">
            &ldquo;{randomQuote.text}&rdquo;
          </p>
          <p className="text-surface-400 text-sm">— {randomQuote.author}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            ← Go Home
          </Link>
          <Link href="/browse" className="btn-secondary">
            Browse Startups
          </Link>
        </div>
      </div>
    </div>
  );
}
