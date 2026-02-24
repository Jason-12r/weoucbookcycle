import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Market } from './pages/Market';
import { Post } from './pages/Post';
import { Messages } from './pages/Messages';
import { UserProfile } from './pages/UserProfile';
import { BookDetail } from './pages/BookDetail';
import { ChatDetail } from './pages/ChatDetail';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const handleBookClick = (id: string) => {
    setSelectedBookId(id);
  };

  const handleChatClick = (id: string) => {
    setSelectedChatId(id);
  };

  const handleSellerClick = (sellerId: string) => {
    setViewingUserId(sellerId);
  };

  const handleBack = () => {
    if (selectedChatId) {
      setSelectedChatId(null);
      return;
    }
    if (viewingUserId) {
      setViewingUserId(null);
      return;
    }
    if (selectedBookId) {
      setSelectedBookId(null);
      return;
    }
  };

  const handleStartChatFromProfile = () => {
    setSelectedChatId('1'); // Mock chat ID
    setViewingUserId(null);
    setSelectedBookId(null);
  };

  const renderContent = () => {
    if (selectedChatId) {
      return <ChatDetail id={selectedChatId} onBack={handleBack} />;
    }

    if (viewingUserId) {
      return (
        <UserProfile 
          userId={viewingUserId} 
          onBack={handleBack} 
          onChat={handleStartChatFromProfile}
          onBookClick={handleBookClick}
        />
      );
    }

    if (selectedBookId) {
      return (
        <BookDetail 
          id={selectedBookId} 
          onBack={handleBack} 
          onChat={() => {
            setSelectedBookId(null);
            setActiveTab('messages');
            setSelectedChatId('1'); // Mock opening a chat
          }}
          onSellerClick={handleSellerClick}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Home onBookClick={handleBookClick} />;
      case 'market':
        return <Market onBookClick={handleBookClick} />;
      case 'post':
        return <Post onBack={() => setActiveTab('home')} />;
      case 'messages':
        return <Messages onChatClick={handleChatClick} />;
      case 'profile':
        return <UserProfile userId="me" />;
      default:
        return <Home onBookClick={handleBookClick} />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBookId ? 'book' : selectedChatId ? 'chat' : viewingUserId ? 'user' : activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {!selectedBookId && !selectedChatId && !viewingUserId && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
