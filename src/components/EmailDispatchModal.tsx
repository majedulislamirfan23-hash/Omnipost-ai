import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  Download, 
  ClipboardPaste, 
  ExternalLink, 
  Send, 
  UserCheck, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';
import { CampaignData } from '../types';

interface EmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData | null;
}

interface SavedEmailContact {
  id: string;
  name: string;
  email: string;
  tag: string;
}

const DEFAULT_CONTACTS: SavedEmailContact[] = [
  {
    id: 'c1',
    name: 'Primary Account',
    email: 'majedulislamirfan23@gmail.com',
    tag: 'Owner',
  },
  {
    id: 'c2',
    name: 'Marketing Lead',
    email: 'marketing@omnipost.studio',
    tag: 'Team',
  },
  {
    id: 'c3',
    name: 'Client Review',
    email: 'client.review@creativeagency.io',
    tag: 'Client',
  },
  {
    id: 'c4',
    name: 'Social Media Manager',
    email: 'social@growthpulse.com',
    tag: 'Editorial',
  },
];

const LOCAL_CONTACTS_KEY = 'omnipost_saved_email_contacts';

export const EmailDispatchModal: React.FC<EmailDispatchModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  if (!isOpen || !campaign) return null;

  const [recipientEmail, setRecipientEmail] = useState('majedulislamirfan23@gmail.com');
  const [contacts, setContacts] = useState<SavedEmailContact[]>(DEFAULT_CONTACTS);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  
  const [subject, setSubject] = useState(`[OmniPost Campaign Draft] ${campaign.campaignTitle}`);
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'linkedin' | 'twitter' | 'instagram'>('all');
  
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  // Load contacts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CONTACTS_KEY);
      if (saved) {
        setContacts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load contacts:', e);
    }
  }, []);

  // Save contacts
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactEmail.trim() || !newContactEmail.includes('@')) return;

    const newContact: SavedEmailContact = {
      id: `c_${Date.now()}`,
      name: newContactName.trim() || 'Collaborator',
      email: newContactEmail.trim().toLowerCase(),
      tag: 'Custom',
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    setRecipientEmail(newContact.email);
    setNewContactName('');
    setNewContactEmail('');
    setShowAddContact(false);

    try {
      localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save contact:', err);
    }
  };

  const handleDeleteContact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    try {
      localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to update contacts:', err);
    }
  };

  // Clipboard Paste handler ("Pest")
  const handlePasteEmail = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const cleaned = text.trim();
        setRecipientEmail(cleaned);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Copy Email Address
  const handleCopyEmailAddress = async () => {
    if (!recipientEmail) return;
    try {
      await navigator.clipboard.writeText(recipientEmail);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Construct Email Body based on selected platforms
  const generateEmailBodyText = () => {
    let body = `Hello,\n\nHere is the multi-platform social media campaign draft generated via OmniPost Studio for:\n"${campaign.campaignTitle}"\n\n`;
    body += `Original Concept: ${campaign.originalIdea}\n`;
    body += `Tone: ${campaign.tone} | Audience: ${campaign.audience || 'Target Community'}\n`;
    body += `Generated: ${new Date(campaign.createdAt).toLocaleString()}\n`;
    body += `--------------------------------------------------------\n\n`;

    if (selectedFormat === 'all' || selectedFormat === 'linkedin') {
      body += `[LINKEDIN POST (Long-Form Thought Leadership)]\n`;
      body += `Opening Hook: ${campaign.linkedin.hook}\n`;
      body += `Recommended Visual Ratio: ${campaign.linkedin.recommendedRatio}\n\n`;
      body += `${campaign.linkedin.text}\n\n`;
      body += `Hashtags: ${campaign.linkedin.hashtags.join(' ')}\n\n`;
      body += `--------------------------------------------------------\n\n`;
    }

    if (selectedFormat === 'all' || selectedFormat === 'twitter') {
      body += `[TWITTER / X POST (Short & Punchy)]\n`;
      body += `Recommended Visual Ratio: ${campaign.twitter.recommendedRatio}\n\n`;
      body += `${campaign.twitter.singleTweet}\n\n`;
      if (campaign.twitter.threadTweets && campaign.twitter.threadTweets.length > 0) {
        body += `Thread Continuation:\n`;
        campaign.twitter.threadTweets.forEach((t, i) => {
          body += `${i + 2}/ ${t}\n\n`;
        });
      }
      body += `Hashtags: ${campaign.twitter.hashtags.join(' ')}\n\n`;
      body += `--------------------------------------------------------\n\n`;
    }

    if (selectedFormat === 'all' || selectedFormat === 'instagram') {
      body += `[INSTAGRAM POST (Visual Storytelling)]\n`;
      body += `Call to Action: ${campaign.instagram.callToAction}\n`;
      body += `Recommended Visual Ratio: ${campaign.instagram.recommendedRatio}\n\n`;
      body += `${campaign.instagram.caption}\n\n`;
      body += `Hashtags:\n${campaign.instagram.hashtags.join(' ')}\n\n`;
      body += `--------------------------------------------------------\n\n`;
    }

    body += `Drafted with OmniPost Studio AI Engine.`;
    return body;
  };

  // Copy Complete Formatted Email
  const handleCopyFormattedEmail = async () => {
    const full = `To: ${recipientEmail}\nSubject: ${subject}\n\n${generateEmailBodyText()}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy formatted email:', err);
    }
  };

  // Open native mailto:
  const handleOpenMailClient = () => {
    const body = generateEmailBodyText();
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Download Email Draft (.txt or .eml)
  const handleDownloadEmailDraft = () => {
    const full = `To: ${recipientEmail}\nSubject: ${subject}\nDate: ${new Date().toUTCString()}\nMIME-Version: 1.0\nContent-Type: text/plain; charset=UTF-8\n\n${generateEmailBodyText()}`;
    const blob = new Blob([full], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-draft-${campaign.id}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Email Dispatch & Contact Selector
              </h3>
              <p className="text-xs text-slate-400">
                Process email addresses, paste from clipboard, select saved contacts & export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Email Address Selection Process */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Recipient Email Address</span>
              </label>

              {/* Status indicator */}
              <div className="flex items-center gap-1.5 text-xs">
                {isEmailValid ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid Email
                  </span>
                ) : recipientEmail.length > 0 ? (
                  <span className="text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Invalid Format
                  </span>
                ) : null}
              </div>
            </div>

            {/* Email Input Bar with Copy, Paste (Pest), and Clear */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. client@example.com, marketing@team.org"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Paste Button ("Pest") */}
              <button
                type="button"
                onClick={handlePasteEmail}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                title="Paste email address from clipboard"
              >
                <ClipboardPaste className="w-4 h-4 text-indigo-400" />
                <span>{pasteSuccess ? 'Pasted!' : 'Paste'}</span>
              </button>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmailAddress}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                title="Copy current email to clipboard"
              >
                {copiedAddress ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Selection Process: Saved & Preset Contacts */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Quick Select Contact List ({contacts.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddContact ? 'Cancel' : 'Add New Contact'}</span>
                </button>
              </div>

              {/* Add contact mini-form */}
              {showAddContact && (
                <form onSubmit={handleSaveContact} className="p-3 mb-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Contact Name (e.g. Agency Lead)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                  >
                    Save
                  </button>
                </form>
              )}

              {/* Contacts Chips / Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contacts.map((contact) => {
                  const isSelected = recipientEmail.toLowerCase() === contact.email.toLowerCase();
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setRecipientEmail(contact.email)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-slate-200 truncate">
                            {contact.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {contact.tag}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-indigo-300 truncate mt-0.5">
                          {contact.email}
                        </div>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <button
                          onClick={(e) => handleDeleteContact(contact.id, e)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Delete contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Subject & Content Scope */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Email Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Include Platforms in Email Draft
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('all')}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedFormat === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All 3 Platforms
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('linkedin')}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedFormat === 'linkedin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  LinkedIn Only
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('twitter')}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedFormat === 'twitter'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Twitter / X Only
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('instagram')}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedFormat === 'instagram'
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Instagram Only
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Action Buttons (Copy, Open Mail Client, Download) */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 justify-end">
            {/* Copy Formatted Email */}
            <button
              type="button"
              onClick={handleCopyFormattedEmail}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Formatted Email</span>
                </>
              )}
            </button>

            {/* Download Email Draft File */}
            <button
              type="button"
              onClick={handleDownloadEmailDraft}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              title="Download standard RFC .eml file"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download Draft (.eml)</span>
            </button>

            {/* Open in Mail Client */}
            <button
              type="button"
              onClick={handleOpenMailClient}
              disabled={!isEmailValid}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Open in Email App (mailto:)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
