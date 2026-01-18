
import React, { useState, useEffect, useMemo } from 'react';
import type { Link, Theme } from './types';
import { LinkCard } from './components/LinkCard';
import { GithubIcon, TwitterIcon, LinkedinIcon, GlobeIcon, MailIcon, SearchIcon } from './components/Icons';
import { DigitalClock } from './components/DigitalClock';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { THEMES } from './themes';

const LINKS_PER_PAGE = 5;

// Pemetaan dari string nama ikon di CSV ke komponen React
const iconComponents: { [key: string]: React.ReactElement } = {
  GithubIcon: <GithubIcon />,
  TwitterIcon: <TwitterIcon />,
  LinkedinIcon: <LinkedinIcon />,
  GlobeIcon: <GlobeIcon />,
  MailIcon: <MailIcon />,
};

const App: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk memuat dan mengurai data dari links.csv
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/links.csv');
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const linkData: Link[] = lines.slice(1).map((line) => {
          // Parser CSV sederhana yang menangani field yang dikutip
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const entry = headers.reduce((obj, header, index) => {
            const value = (values[index] || '').replace(/"/g, '').trim();
            (obj as any)[header] = value;
            return obj;
          }, {} as any);
          
          return {
            id: parseInt(entry.id, 10),
            title: entry.title,
            url: entry.url,
            icon: iconComponents[entry.icon] || <GlobeIcon />,
            description: entry.description || undefined,
            tags: entry.tags ? entry.tags.split(';').map(t => t.trim()) : undefined,
          };
        });
        setLinks(linkData);
      } catch (error) {
        console.error("Gagal memuat atau mengurai links.csv:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('link-hub-theme');
    const savedTheme = THEMES.find(t => t.id === savedThemeId) || THEMES[0];
    setTheme(savedTheme);

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('link-hub-theme', theme.id);
  }, [theme]);

  const filteredLinks = useMemo(() =>
    links.filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [searchQuery, links]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, isMobile]);

  const totalPages = isMobile ? Math.ceil(filteredLinks.length / LINKS_PER_PAGE) : 1;
  const paginatedLinks = isMobile
    ? filteredLinks.slice((currentPage - 1) * LINKS_PER_PAGE, currentPage * LINKS_PER_PAGE)
    : filteredLinks;

  return (
    <div className={`min-h-screen text-white font-sans transition-colors duration-500 ${theme.background}`}>
      <div className="w-full max-w-md mx-auto px-4">
        
        <header className={`sticky top-0 z-10 pt-8 pb-6 backdrop-blur-md transition-colors duration-500 ${theme.headerBg}`}>
          <div className="text-center">
            <img
              src="https://picsum.photos/128/128"
              alt="Foto Profil"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"
            />
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Nama Anda
            </h1>
            <p className="text-gray-400 mt-1 text-base">
              Deskripsi singkat atau tagline Anda.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <DigitalClock />
            <div className="relative">
              <input
                type="text"
                placeholder="Cari link, deskripsi, atau tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                style={{'--tw-ring-color': theme.themeSelectorRing.replace('ring-','')} as React.CSSProperties}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <SearchIcon />
              </div>
            </div>
          </div>
        </header>

        <main className="py-2">
          <section className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-8">Memuat link...</p>
            ) : paginatedLinks.length > 0 ? (
              paginatedLinks.map((link) => (
                <LinkCard key={link.id} link={link} theme={theme} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Tidak ada link yang ditemukan.</p>
            )}
          </section>

          {isMobile && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <span className="text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjut
              </button>
            </div>
          )}
        </main>

        <footer className="text-center py-8 space-y-4">
          <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nama Anda. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
