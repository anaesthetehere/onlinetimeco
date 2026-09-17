import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  Bug, 
  Sparkles, 
  HelpCircle, 
  HeartHandshake,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'review' | 'working' | 'enhancement' | 'bug' | 'help';

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const contactEmail = 'anweshasenapati4@gmail.com';
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType>('review');
  const [userFeedback, setUserFeedback] = useState('');
  const [senderName, setSenderName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSubject = () => {
    switch (selectedType) {
      case 'review':
        return `[Time-Co Review & Testimonial] ${senderName ? `from ${senderName}` : 'User Feedback'}`;
      case 'working':
        return `[Time-Co Experience & How It Is Working] ${senderName ? `from ${senderName}` : 'User Experience'}`;
      case 'enhancement':
        return `[Time-Co Feature Enhancement] ${senderName ? `from ${senderName}` : 'Future Idea'}`;
      case 'bug':
        return `[Time-Co Bug Report & Fix Request] ${senderName ? `from ${senderName}` : 'Bug Details'}`;
      case 'help':
        return `[Time-Co Support & Inquiries] ${senderName ? `from ${senderName}` : 'Help Needed'}`;
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(getSubject());
    const body = encodeURIComponent(
      `Hello Anwesha and Time-Co Team,\n\n` +
      `Category: ${selectedType.toUpperCase()}\n` +
      `Sender: ${senderName || 'Anonymous Explorer'}\n\n` +
      `Message / Review Details:\n${userFeedback || '(No additional message provided)'}\n\n` +
      `Sent via Time-Co Prototype Interface`
    );
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warm Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-amber-200/50 dark:border-slate-800 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  Contact Us & Share Your Voice
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Direct Line
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                We warmly welcome reviews, feedback, feature ideas, bug fixes, or any help needed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Close Contact Modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[78vh] leading-relaxed text-sm">
          
          {/* Warm Welcome Banner */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-slate-800 dark:text-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>You Are Important to Us</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Time-Co was built for creators, teams, and visionaries. Your perspective shapes every line of code. 
              Whether you want to leave an honest review, share how the prototype is working for you, propose new capabilities, report an unexpected bug, or simply say hello — we read and respond to every note.
            </p>
          </div>

          {/* Primary Email Card with Quick Copy */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Direct Review & Feedback Address</span>
              <div className="text-sm sm:text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <span>{contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Time-Co] Prototype Review & Feedback')}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Mail App</span>
              </a>
            </div>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                What would you like to share today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedType('review')}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    selectedType === 'review'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px] leading-tight">Review / Rating</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('working')}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    selectedType === 'working'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[11px] leading-tight">How It's Working</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('enhancement')}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    selectedType === 'enhancement'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-[11px] leading-tight">Enhancement Idea</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('bug')}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    selectedType === 'bug'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span className="text-[11px] leading-tight">Bug / Fix Needed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('help')}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center text-center gap-1 transition-all col-span-2 sm:col-span-1 ${
                    selectedType === 'help'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-[11px] leading-tight">General Help</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name or Team / Role (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Startup Founder or Solo Dev"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination
                </label>
                <input
                  type="text"
                  disabled
                  value={contactEmail}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Review, Feedback, or Request
              </label>
              <textarea
                rows={4}
                required
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                placeholder="Share your thoughts: How is Time-Co working for your workflow? Any features or integrations you wish existed? Found an unexpected bug or need guidance? We are here for you..."
                className="w-full p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-400 resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero spam guarantee · Sent directly to primary developer inbox</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Review via Email</span>
                </button>
              </div>
            </div>

            {submitted && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Your default email client has been prepared with your review addressed to <strong>{contactEmail}</strong>. Thank you for making Time-Co better!</span>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};
