
import React, { useState } from 'react';
import type { Link, Theme } from '../types';
import { ChevronDownIcon } from './Icons';

interface LinkCardProps {
  link: Link;
  theme: Theme;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = link.description || (link.tags && link.tags.length > 0);

  const cardClasses = `
    group backdrop-blur-sm rounded-lg w-full text-white 
    transition-all duration-300 ease-in-out shadow-md
    ${theme.linkBg} ${theme.linkBorder} 
    ${isExpanded ? theme.linkHoverBorder.replace('hover:', '') : ''}
    ${isExpanded ? theme.linkHoverShadow.replace('hover:', '') : theme.linkHoverShadow}
  `;

  const headerClasses = `
    flex items-center p-4 w-full text-left
    ${hasDetails ? 'cursor-pointer' : ''}
  `;
  
  const iconClasses = `
    w-8 h-8 flex-shrink-0 mr-4 text-gray-400 transition-colors duration-300
    ${theme.linkHoverIcon}
  `;

  const tagColors: { [key: string]: string } = {
    cyan: 'bg-cyan-900/50 text-cyan-300',
    rose: 'bg-rose-900/50 text-rose-300',
    emerald: 'bg-emerald-900/50 text-emerald-300',
    violet: 'bg-violet-900/50 text-violet-300',
  };
  
  const visitButtonColors: { [key: string]: string } = {
    cyan: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300',
    rose: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300',
    emerald: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300',
    violet: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300',
  }

  const handleCardClick = () => {
    if (hasDetails) {
      setIsExpanded(!isExpanded);
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={cardClasses}>
      <button onClick={handleCardClick} className={headerClasses} aria-expanded={isExpanded}>
        <div className={iconClasses}>
          {link.icon}
        </div>
        <span className="font-semibold text-base flex-grow text-left sm:text-lg">
          {link.title}
        </span>
        {hasDetails && (
          <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      {hasDetails && (
         <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="border-t border-gray-700/50 px-4 pt-3 pb-4 space-y-3">
              {link.description && (
                <p className="text-gray-400 text-sm">{link.description}</p>
              )}
              {link.tags && link.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {link.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagColors[theme.id]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
               <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-block w-full text-center px-4 py-2 mt-2 rounded-lg font-semibold transition-colors duration-200 ${visitButtonColors[theme.id]}`}
              >
                Kunjungi Tautan
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
