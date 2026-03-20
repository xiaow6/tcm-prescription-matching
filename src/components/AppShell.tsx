'use client';

import ChatContainer from './ChatContainer';

export default function AppShell() {
  return (
    <div className="fixed inset-0 flex flex-col max-w-2xl mx-auto bg-white sm:inset-4 sm:rounded-2xl sm:shadow-lg">
      <div className="flex-1 min-h-0">
        <ChatContainer />
      </div>
    </div>
  );
}
