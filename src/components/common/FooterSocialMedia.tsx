import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import {
  TGLC_SOCIAL_CHANNELS,
  SocialChannel,
  SocialChannelId,
  getSocialLinkProps,
  isExternalSocialUrl,
} from '../../data/socialChannels';
import { useNavigation } from '../../context/NavigationContext';

const SocialIcon: React.FC<{ id: SocialChannelId; className?: string }> = ({
  id,
  className = 'w-4 h-4',
}) => {
  switch (id) {
    case 'linkedin':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'telegram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M21.2 4.4 2.8 11.5c-.8.3-.8 1.4.1 1.7l4.6 1.5 1.8 5.4c.2.7 1.1.9 1.6.4l2.7-2.6 4.7 3.4c.7.5 1.7.1 1.9-.7l2.9-14.6c.2-.9-.7-1.7-1.9-1.6Z" />
          <path d="M7.5 14.7 18.2 7.8" />
        </svg>
      );
  }
};

export interface FooterSocialMediaProps {
  channels?: readonly SocialChannel[];
}

export const FooterSocialMedia: React.FC<FooterSocialMediaProps> = ({
  channels = TGLC_SOCIAL_CHANNELS,
}) => {
  const { navigateTo } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, channel: SocialChannel) => {
    if (isExternalSocialUrl(channel.href)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Social media and private member channels"
      className="py-4 border-b border-[#1D1F28] flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] shrink-0">
        Private Channels
      </span>

      <ul className="flex flex-wrap items-center gap-2.5">
        {channels.map((channel) => {
          const linkProps = getSocialLinkProps(channel);
          return (
            <li key={channel.id}>
              <a
                {...linkProps}
                onClick={(e) => handleClick(e, channel)}
                aria-label={channel.ariaLabel}
                className="group min-h-[40px] px-3.5 py-2 bg-[#0C0E14] hover:bg-[#131621] border border-[#222532] hover:border-[#CFA85E]/80 transition-colors inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CFA85E]"
              >
                <SocialIcon id={channel.id} className="w-3.5 h-3.5 text-[#CFA85E] shrink-0" />
                <span className="text-xs font-medium text-[#F2D8A0] group-hover:text-[#FFE7B3] transition-colors inline-flex items-center gap-1">
                  <span>{channel.name}</span>
                  {channel.membersOnly && (
                    <Lock className="w-3 h-3 text-[#CFA85E] shrink-0" aria-hidden="true" />
                  )}
                </span>
                <span
                  data-no-translate={channel.id === 'instagram' || channel.id === 'linkedin' ? 'true' : undefined}
                  className="hidden sm:inline text-[11px] text-[#8F98AA] group-hover:text-[#D4D8E2] transition-colors"
                >
                  · {channel.subtitle}
                </span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-[#8B672B] group-hover:text-[#E2BA6B] transition-colors shrink-0"
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
