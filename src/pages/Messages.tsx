import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { chats, users } from '../data/mockData';

interface MessagesProps {
  onChatClick: (id: string) => void;
}

export const Messages: React.FC<MessagesProps> = ({ onChatClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeUsers = Object.values(users).filter(u => 
    u.id !== 'me' && 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = chats.filter(chat => {
    const otherUserId = chat.participants.find(p => p !== 'me') || 'alex';
    const otherUser = users[otherUserId];
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full pb-24">
      <header className="sticky top-0 z-30 px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white font-display hidden sm:block">Messages</h1>
        
        <div className="relative flex-1 max-w-md">
           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            className="block w-full py-2 pl-9 pr-4 text-sm text-slate-200 rounded-xl bg-slate-800/50 border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder-slate-500 transition-all outline-none" 
            placeholder="Search messages..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative flex-shrink-0">
          <Bell className="w-6 h-6 text-slate-400" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </div>
      </header>

      <div className="px-4 py-4">
        {!searchQuery && (
          <>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Active Trades</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6 pb-2">
              {activeUsers.map((user, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-slate-700 to-slate-800">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full rounded-full bg-slate-800 object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-400 truncate w-full text-center">{user.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {searchQuery ? 'Search Results' : 'Recent Chats'}
          </h2>
          {!searchQuery && <button className="text-xs text-indigo-400">Mark all read</button>}
        </div>

        <div className="flex flex-col gap-3">
          {filteredChats.map(chat => {
            const otherUserId = chat.participants.find(p => p !== 'me') || 'alex';
            const otherUser = users[otherUserId];
            
            return (
              <div 
                key={chat.id} 
                onClick={() => onChatClick(chat.id)}
                className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3 active:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name} 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-indigo-500 rounded-full border border-slate-900"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-white">{otherUser.name}</h3>
                    <span className={`text-[10px] ${chat.unreadCount > 0 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="w-10 h-12 rounded-lg bg-slate-900 border border-white/5 overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop" 
                    className="w-full h-full object-cover opacity-80" 
                    alt="Book" 
                  />
                </div>
              </div>
            );
          })}
          {filteredChats.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No chats found matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
