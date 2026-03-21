import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="text-lg font-bold gradient-text">LaunchPad</span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              Connecting visionary startups with investors and technical experts to build the future.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/browse" className="text-sm text-surface-400 hover:text-white transition-colors">Browse Startups</Link></li>
              <li><Link href="/register" className="text-sm text-surface-400 hover:text-white transition-colors">Join as Startup</Link></li>
              <li><Link href="/register" className="text-sm text-surface-400 hover:text-white transition-colors">Join as Supporter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-surface-400 cursor-default">Help Center</span></li>
              <li><span className="text-sm text-surface-400 cursor-default">Blog</span></li>
              <li><span className="text-sm text-surface-400 cursor-default">API Docs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-surface-400 cursor-default">Privacy Policy</span></li>
              <li><span className="text-sm text-surface-400 cursor-default">Terms of Service</span></li>
              <li><span className="text-sm text-surface-400 cursor-default">Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} LaunchPad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
