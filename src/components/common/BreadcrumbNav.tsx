import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowLeft, History, X } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { getBackLinkForRoute, getBreadcrumbsForRoute } from '../../utils/breadcrumb';
import {
  BreadcrumbHistoryEntry,
  clearNavigationHistory,
  readNavigationHistory,
  recordRouteVisit,
  writeNavigationHistory,
} from '../../utils/breadcrumbHistory';
import { pathFor } from '../../routing/routes';
import { Link } from './Link';

export const BreadcrumbNav: React.FC = () => {
  const { route } = useNavigation();
  const [historyTrail, setHistoryTrail] = useState<BreadcrumbHistoryEntry[]>(() =>
    readNavigationHistory()
  );

  // Persist every visited route into sessionStorage so nested service journeys stay clear across reloads
  useEffect(() => {
    setHistoryTrail((prev) => {
      const hydrated = prev.length > 0 ? prev : readNavigationHistory();
      const updated = recordRouteVisit(hydrated, route);
      writeNavigationHistory(updated);
      return updated;
    });
  }, [route.page, route.serviceId, route.subServiceId, route.articleSlug, route.subSection]);

  const items = getBreadcrumbsForRoute(route);
  if (!items || items.length < 2) return null;

  const backLink = getBackLinkForRoute(route);
  const currentPath = pathFor(route.page, {
    serviceId: route.serviceId,
    subServiceId: route.subServiceId,
    articleSlug: route.articleSlug,
    subSection: route.subSection,
  });

  const handleClearHistory = () => {
    clearNavigationHistory();
    const currentOnly = recordRouteVisit([], route);
    writeNavigationHistory(currentOnly);
    setHistoryTrail(currentOnly);
  };

  const showHistoryTrail = historyTrail.length >= 2;

  return (
    <div
      data-breadcrumb-nav="true"
      className="no-print fixed top-[68px] lg:top-[76px] inset-x-0 z-30 bg-[#0A0C12]/92 backdrop-blur-md border-b border-[#1B1E28]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Row 1: Canonical Site Hierarchy */}
        <div className="min-h-[34px] py-1.5 flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
            <ol className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-mono uppercase tracking-[0.14em]">
              {items.map((item, idx) => {
                const isLast = idx === items.length - 1 || item.isCurrent;
                return (
                  <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                    {idx > 0 && (
                      <ChevronRight
                        className="w-3 h-3 text-[#6E7485] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {isLast || !item.route ? (
                      <span
                        aria-current="page"
                        className="text-[#E2BA6B] truncate max-w-[200px] sm:max-w-[360px]"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        page={item.route}
                        params={item.params}
                        className="text-[#A8B0C2] hover:text-[#FAF7F0] transition-colors py-1"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {backLink && (
            <Link
              page={backLink.route}
              params={backLink.params}
              className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[11px] font-mono uppercase tracking-[0.14em] text-[#CFA85E] hover:text-[#FAF7F0] transition-colors py-1"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              <span>{backLink.label}</span>
            </Link>
          )}
        </div>

        {/* Row 2: Persistent Session Navigation Trail */}
        {showHistoryTrail && (
          <div
            data-breadcrumb-history="true"
            className="border-t border-[#161923] py-1 flex items-center justify-between gap-3"
          >
            <nav
              aria-label="Recent navigation history"
              className="min-w-0 flex-1 overflow-x-auto no-scrollbar"
            >
              <ol className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono tracking-[0.1em]">
                <li className="inline-flex items-center gap-1.5 text-[#8E96A8] uppercase tracking-[0.16em] pr-1 shrink-0">
                  <History className="w-3 h-3 text-[#CFA85E]" aria-hidden="true" />
                  <span>Path</span>
                </li>
                {historyTrail.map((entry, idx) => {
                  const isCurrent = entry.path === currentPath && idx === historyTrail.length - 1;
                  return (
                    <li
                      key={`${entry.path}-${idx}`}
                      className="flex items-center gap-1.5 shrink-0"
                    >
                      {idx > 0 && (
                        <span className="text-[#4B5063]" aria-hidden="true">
                          →
                        </span>
                      )}
                      {isCurrent ? (
                        <span
                          aria-current="location"
                          className="text-[#E2BA6B] font-medium"
                        >
                          {entry.parentLabel && entry.page === 'subservice-detail'
                            ? `${entry.parentLabel} › ${entry.label}`
                            : entry.label}
                        </span>
                      ) : (
                        <Link
                          page={entry.page}
                          params={entry.params}
                          className="text-[#9FA7B8] hover:text-[#FAF7F0] transition-colors py-0.5"
                          title={
                            entry.parentLabel
                              ? `${entry.parentLabel} › ${entry.label}`
                              : entry.label
                          }
                        >
                          {entry.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <button
              type="button"
              onClick={handleClearHistory}
              aria-label="Clear navigation history trail"
              className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[#8E96A8] hover:text-[#E2BA6B] transition-colors py-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
