import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  ChevronLeft,
  Users
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    messages,
    sendMessage,
    selectedClientId,
    setSelectedClientId
  } = useApp();

  const isClient = currentUser.role === 'client';
  const assignedCoach = allProfiles.find(p => p.id === currentUser.assignedCoachId) || allProfiles.find(p => p.role === 'coach');
  const availableClients = allProfiles.filter(p => p.role === 'client');

  // If coach/admin, select active chat partner
  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    if (isClient) return assignedCoach?.id || 'user-coach-1';
    if (selectedClientId) return selectedClientId;
    return availableClients[0]?.id || 'user-client-1';
  });

  // Mobile navigation state between client list and active conversation
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(isClient);

  const [inputContent, setInputContent] = useState('');

  const activePartner = allProfiles.find(p => p.id === activePartnerId);

  // Filter messages between currentUser and activePartner
  const conversation = messages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === activePartnerId) ||
         (m.senderId === activePartnerId && m.receiverId === currentUser.id)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activePartnerId) return;

    sendMessage(activePartnerId, inputContent.trim());
    setInputContent('');
  };

  const handleSelectPartner = (clientId: string) => {
    setActivePartnerId(clientId);
    setSelectedClientId(clientId);
    setMobileShowChat(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Direct Messaging & Chat</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time asynchronous communication between athlete and coaching team.
          </p>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3 min-h-[520px] max-h-[78vh]">
        {/* Left Sidebar (Contacts for Coach/Admin) */}
        {!isClient && (
          <div className={`border-r border-slate-800 bg-slate-900/80 flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" /> Client Conversations
              </h2>
              <span className="text-xs font-mono text-slate-500 font-bold">{availableClients.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {availableClients.map(client => {
                const isSelected = activePartnerId === client.id;
                const lastMsg = messages
                  .filter(m => (m.senderId === client.id && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === client.id))
                  .pop();

                return (
                  <button
                    key={client.id}
                    onClick={() => handleSelectPartner(client.id)}
                    className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-colors min-h-[64px] ${
                      isSelected ? 'bg-slate-850 border-l-2 border-emerald-500' : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <img
                      src={client.avatarUrl}
                      alt={client.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                          {client.fullName}
                        </p>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {lastMsg ? lastMsg.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Chat Column */}
        <div className={`flex flex-col ${
          !isClient
            ? `${mobileShowChat ? 'flex md:col-span-2' : 'hidden md:flex md:col-span-2'}`
            : 'col-span-full'
        }`}>
          {/* Chat Top Banner */}
          {activePartner && (
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Back Button to roster */}
                {!isClient && (
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1"
                    aria-label="Back to contacts list"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                <img
                  src={activePartner.avatarUrl}
                  alt={activePartner.fullName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1 ring-emerald-500/50"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">{activePartner.fullName}</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 capitalize">{activePartner.role} • Active</p>
                </div>
              </div>

              <span className="text-[11px] sm:text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Connected
              </span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4 bg-slate-950/40">
            {conversation.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Start a conversation with {activePartner?.fullName}</p>
              </div>
            ) : (
              conversation.map(msg => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-xs shadow-md shadow-emerald-500/10'
                          : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-3 py-1.5 sm:py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-500 shrink-0 font-medium text-[10px] uppercase">Quick:</span>
            {[
              "Workout completed! Felt great.",
              "Submitted my weekly check-in.",
              "Adjusted calories for today.",
              "Form check video attached."
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => setInputContent(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 whitespace-nowrap transition-colors border border-slate-750 text-xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder={`Message ${activePartner?.fullName || 'athlete'}...`}
              value={inputContent}
              onChange={e => setInputContent(e.target.value)}
              className="flex-1 px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 transition-colors shadow-md min-w-[42px] min-h-[42px] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
