'use client';

import { useParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';

export default function ChatPage() {
  const params = useParams();
  const connectionId = params.id as string;

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Link href="/connections" className="btn-secondary text-xs px-3 py-2">
            ← Back
          </Link>
          <div>
            <h1 className="text-xl font-bold">Chat</h1>
            <p className="text-xs text-surface-400">Real-time messaging</p>
          </div>
        </div>

        <ChatWindow connectionId={connectionId} />
      </div>
    </div>
  );
}
