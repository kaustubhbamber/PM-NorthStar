"use client";

import { useState, useMemo, useEffect } from "react";
import {
  books,
  categories,
  getFeaturedBooks,
  Category,
} from "@/data/books";
import {
  caseStudies,
  getCaseStudiesByCategory,
  CaseStudyCategory,
} from "@/data/caseStudies";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionRow } from "@/components/SectionRow";
import { HeroBanner } from "@/components/HeroBanner";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { AuthModal } from "@/components/AuthModal";
import { SaveButton } from "@/components/SaveButton";
import {
  BookOpen,
  Sparkles,
  Layers,
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  Bookmark,
  Heart,
} from "lucide-react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const categoryAccents: Record<string, string> = {
  "Product Management": "#F3123C",
  Startups: "#F3123C",
  Management: "#F3123C",
};

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        if (data.saved) {
          setSavedIds(new Set(data.saved.map((s: any) => s.resourceId)));
        }
      });
    fetch("/api/liked")
      .then((r) => r.json())
      .then((data) => {
        if (data.liked) {
          setLikedIds(new Set(data.liked.map((l: any) => l.resourceId)));
        }
      });
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSavedIds(new Set());
    setLikedIds(new Set());
  };

  const [activeNav, setActiveNav] = useState("home");
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsFilter, setActiveCsFilter] = useState<CaseStudyCategory>("All");

  const featured = getFeaturedBooks();

  const filteredBooks = useMemo(() => {
    let result = books;
    if (activeFilter !== "All") {
      result = result.filter((b) => b.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const filteredCaseStudies = useMemo(
    () => getCaseStudiesByCategory(activeCsFilter),
    [activeCsFilter]
  );

  const heroBook = featured[0];
  const isFiltered = activeFilter !== "All" || searchQuery.trim() !== "";

  const csStats = useMemo(() => {
    const counts: Record<string, number> = {};
    caseStudies.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  // ── Saved Library View ─────────────────────────────────────────────────
  if (activeNav === "saved") {
    const savedBooks = books.filter((b) => savedIds.has(b.id));
    const likedBooks = books.filter((b) => likedIds.has(b.id));
    const savedStudies = caseStudies.filter((s) => savedIds.has(s.id));
    const likedStudies = caseStudies.filter((s) => likedIds.has(s.id));

    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
          >
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                My Library
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {savedBooks.length + savedStudies.length} saved · {likedBooks.length + likedStudies.length} liked
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto scroll-container p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Bookmark size={40} style={{ color: "var(--text-faint)" }} />
                <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>
                  Sign in to see your library
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                {/* Saved Books */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      Saved Books
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                      {savedBooks.length}
                    </span>
                  </div>
                  {savedBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved books yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {savedBooks.map((book) => (
                        <div key={book.id}>
                          <ResourceCard book={book} variant="list" />
                          <div className="mt-2">
                            <SaveButton
                              resource={book}
                              isLoggedIn={!!user}
                              initialSaved={savedIds.has(book.id)}
                              initialLiked={likedIds.has(book.id)}
                              onAuthRequired={() => setShowAuthModal(true)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                {/* Saved Case Studies */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      Saved Case Studies
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                      {savedStudies.length}
                    </span>
                  </div>
                  {savedStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved case studies yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedStudies.map((study) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                {/* Liked Books */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      Liked Books
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                      {likedBooks.length}
                    </span>
                  </div>
                  {likedBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No liked books yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {likedBooks.map((book) => (
                        <div key={book.id}>
                          <ResourceCard book={book} variant="list" />
                          <div className="mt-2">
                            <SaveButton
                              resource={book}
                              isLoggedIn={!!user}
                              initialSaved={savedIds.has(book.id)}
                              initialLiked={likedIds.has(book.id)}
                              onAuthRequired={() => setShowAuthModal(true)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                {/* Liked Case Studies */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      Liked Case Studies
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                      {likedStudies.length}
                    </span>
                  </div>
                  {likedStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No liked case studies yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {likedStudies.map((study) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />
        )}
      </div>
    );
  }

  // ── Case Studies View ──────────────────────────────────────────────────
  if (activeNav === "casestudies") {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
          >
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Case Studies
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                50 real stories — product wins, growth hacks, and failures
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto scroll-container p-6 pb-12">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {Object.entries(csStats).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setActiveCsFilter(cat as CaseStudyCategory)}
                  className="rounded-xl p-3 text-left transition-all"
                  style={{
                    background: activeCsFilter === cat ? "var(--brand-soft)" : "var(--card-bg)",
                    border: `1px solid ${activeCsFilter === cat ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
                  }}
                >
                  <div className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>{count}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{cat}</div>
                </button>
              ))}
              <button
                onClick={() => setActiveCsFilter("All")}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  background: activeCsFilter === "All" ? "var(--brand-soft)" : "var(--card-bg)",
                  border: `1px solid ${activeCsFilter === "All" ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
                }}
              >
                <div className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>50</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>All</div>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {activeCsFilter === "All" ? "All Case Studies" : `${activeCsFilter} Case Studies`}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                {filteredCaseStudies.length}
              </span>
              <div className="ml-auto flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                  <TrendingUp size={12} />
                  {filteredCaseStudies.filter((c) => c.category !== "Failure").length} wins
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--danger)" }}>
                  <TrendingDown size={12} />
                  {filteredCaseStudies.filter((c) => c.category === "Failure").length} failures
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCaseStudies.map((study) => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  isLoggedIn={!!user}
                  initialSaved={savedIds.has(study.id)}
                  initialLiked={likedIds.has(study.id)}
                  onAuthRequired={() => setShowAuthModal(true)}
                />
              ))}
            </div>
          </main>
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />
        )}
      </div>
    );
  }

  // ── Main Home View ─────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
        />

        {/* User bar */}
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{ borderBottom: "1px solid var(--card-border)", background: "var(--nav-bg)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {user ? `Welcome back, ${user.name} 👋` : "Sign in to save and like resources"}
          </p>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveNav("saved")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}
              >
                <Bookmark size={11} />
                {savedIds.size} Saved
              </button>
              <button
                onClick={() => setActiveNav("saved")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}
              >
                <Heart size={11} />
                {likedIds.size} Liked
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{ background: "var(--tag-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}
              >
                <LogOut size={11} />
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <User size={11} />
              Log In / Sign Up
            </button>
          )}
        </div>

        <main className="flex-1 overflow-y-auto scroll-container">
          {!isFiltered ? (
            <div className="pb-12">
              {heroBook && <HeroBanner onNavChange={setActiveNav} />}

              {/* Stats Strip */}
              <div className="flex gap-4 mx-6 mt-4 mb-6">
                {[
                  { label: "Total Books", value: "30", icon: BookOpen },
                  { label: "Case Studies", value: "50", icon: Layers, nav: "casestudies" },
                  { label: "Categories", value: "3", icon: Sparkles },
                ].map(({ label, value, icon: Icon, nav }) => (
                  <div
                    key={label}
                    className="flex-1 flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                    onClick={() => nav && setActiveNav(nav)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)")}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)" }}>
                      <Icon size={16} style={{ color: "var(--brand-primary)" }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Row */}
              <SectionRow title="Latest Picks" subtitle="Hand-curated for product leaders" accentColor="var(--brand-primary)">
                {featured.map((book) => (
                  <div key={book.id} style={{ scrollSnapAlign: "start" }}>
                    <ResourceCard book={book} variant="featured" />
                    <div className="mt-2 px-1">
                      <SaveButton
                        resource={book}
                        isLoggedIn={!!user}
                        initialSaved={savedIds.has(book.id)}
                        initialLiked={likedIds.has(book.id)}
                        onAuthRequired={() => setShowAuthModal(true)}
                      />
                    </div>
                  </div>
                ))}
              </SectionRow>

              <div className="section-divider my-8" />

              {/* Per-Category Rows */}
              {categories.map((cat) => {
                const catBooks = books.filter((b) => b.category === cat);
                return (
                  <div key={cat} className="mt-8">
                    <SectionRow title={cat} subtitle={`${catBooks.length} essential books`} accentColor={categoryAccents[cat]}>
                      {catBooks.map((book) => (
                        <div key={book.id} style={{ scrollSnapAlign: "start" }}>
                          <ResourceCard book={book} variant="default" />
                          <div className="mt-2 px-1">
                            <SaveButton
                              resource={book}
                              isLoggedIn={!!user}
                              initialSaved={savedIds.has(book.id)}
                              initialLiked={likedIds.has(book.id)}
                              onAuthRequired={() => setShowAuthModal(true)}
                            />
                          </div>
                        </div>
                      ))}
                    </SectionRow>
                    <div className="section-divider mt-8" />
                  </div>
                );
              })}

              {/* Case Studies Preview */}
              <div className="px-6 mt-8 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Case Studies</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>50</span>
                  </div>
                  <button
                    onClick={() => setActiveNav("casestudies")}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    View All 50 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseStudies.slice(0, 6).map((study) => (
                    <CaseStudyCard
                      key={study.id}
                      study={study}
                      isLoggedIn={!!user}
                      initialSaved={savedIds.has(study.id)}
                      initialLiked={likedIds.has(study.id)}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-12">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {searchQuery ? `Results for "${searchQuery}"` : activeFilter}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen size={40} style={{ color: "var(--text-faint)" }} />
                  <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>No books found</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>Try a different search or category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <div key={book.id}>
                      <ResourceCard book={book} variant="list" />
                      <div className="mt-2">
                        <SaveButton
                          resource={book}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />
      )}
    </div>
  );
}