import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigation } from '../../context/NavigationContext';
import { LANGUAGE_MAP, LanguageCode, SUPPORTED_LANGUAGES } from '../../data/translations';

export interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'grid';
  onOpen?: () => void;
  onSelect?: (lang: LanguageCode) => void;
  className?: string;
}

/**
 * Dedicated multi-language switcher wired to NavigationContext.
 * Updates application language state and forces immediate full-DOM re-translation
 * across menu labels, page titles, hero headings, and static editorial copy.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  onOpen,
  onSelect,
  className = '',
}) => {
  const { language, setLanguage, forceRetranslate, t } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_MAP[language] ?? LANGUAGE_MAP.en;

  useEffect(() => {
    if (variant !== 'dropdown' || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [variant, isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    forceRetranslate();
    setIsOpen(false);
    onSelect?.(code);
  };

  if (variant === 'grid') {
    return (
      <div
        data-language-switcher="true"
        data-language-variant="grid"
        className={`p-3.5 bg-[#0D1017] border border-[#222532] space-y-2.5 ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CFA85E] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t('nav.language')}</span>
          </span>
          <span data-no-translate="true" className="font-mono text-[10px] text-[#8F98AA] tabular-nums">
            {currentLang.nativeName} · {SUPPORTED_LANGUAGES.length}
          </span>
        </div>

        <div
          role="listbox"
          aria-label={t('nav.language')}
          data-no-translate="true"
          className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-[210px] overflow-y-auto pr-0.5"
        >
          {SUPPORTED_LANGUAGES.map((opt) => {
            const selected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={selected}
                data-language-option={opt.code}
                onClick={() => handleSelectLanguage(opt.code)}
                className={`min-h-[40px] px-2.5 py-1.5 text-xs border transition-colors text-center cursor-pointer truncate ${
                  selected
                    ? 'bg-[#161923] border-[#CFA85E] text-[#F2D8A0] font-medium'
                    : 'bg-[#08090C] border-[#20232E] text-[#B4BCCB] hover:border-[#8B672B] hover:text-[#FAF7F0]'
                }`}
              >
                {opt.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-language-switcher="true"
      data-language-variant="dropdown"
      className={`relative ${className}`}
    >
      <button
        type="button"
        data-language-trigger="true"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) onOpen?.();
        }}
        aria-label={`${t('nav.language')}: ${currentLang.nativeName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`min-h-[40px] px-2 sm:px-2.5 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
          isOpen
            ? 'border-[#CFA85E] bg-[#131722] text-[#E2BA6B]'
            : 'border-[#242632] bg-[#0D1017]/80 text-[#D9D4CA] hover:border-[#8B672B] hover:text-[#E2BA6B]'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-[#CFA85E] shrink-0" aria-hidden="true" />
        <span data-no-translate="true">{currentLang.shortCode}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#8F98AA] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#CFA85E]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label={t('nav.language')}
            className="absolute end-0 mt-2 w-[310px] sm:w-[440px] max-h-[75vh] overflow-y-auto bg-[#0B0C10]/98 border border-[#2A2D38] shadow-2xl backdrop-blur-xl p-2.5 z-[60]"
          >
            <div className="px-2.5 py-1.5 mb-1.5 border-b border-[#1E212E] flex items-center justify-between sticky top-0 bg-[#0B0C10]/98 z-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CFA85E]">
                {t('nav.language')}
              </span>
              <span data-no-translate="true" className="font-mono text-[10px] text-[#8F98AA] tabular-nums">
                {SUPPORTED_LANGUAGES.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1" data-no-translate="true">
              {SUPPORTED_LANGUAGES.map((opt) => {
                const selected = opt.code === language;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-language-option={opt.code}
                    onClick={() => handleSelectLanguage(opt.code)}
                    className={`min-h-[38px] px-2.5 py-1.5 text-start flex items-center justify-between gap-2 transition-colors cursor-pointer border ${
                      selected
                        ? 'bg-[#161923] border-[#CFA85E]/80 text-[#F2D8A0]'
                        : 'bg-transparent border-transparent hover:bg-[#131722] hover:border-[#252836] text-[#D4D8E2]'
                    }`}
                  >
                    <span className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate leading-snug">
                        {opt.nativeName}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#8F98AA] truncate">
                        {opt.englishName}
                      </span>
                    </span>
                    {selected ? (
                      <Check className="w-3.5 h-3.5 text-[#E2BA6B] shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="font-mono text-[10px] text-[#6E768A] shrink-0">
                        {opt.shortCode}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
