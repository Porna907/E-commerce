import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, Headphones, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils';
import { motion } from 'motion/react';
import { productService } from '../services/api/productService';
import { Product } from '../types';
import { siteService, SiteSettings } from '../services/api/siteService';

function StorefrontCta({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const to = (href || '/').trim() || '/';
  if (/^https?:\/\//i.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; image: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [feat, all, catRes, siteRes] = await Promise.all([
          productService.getFeatured(),
          productService.getAll({ ordering: '-created_at', page_size: 8 }),
          productService.getCategories(),
          siteService.getSettings(),
        ]);
        if (!cancelled) {
          setFeaturedProducts(feat);
          setLatestProducts(all.slice(0, 4));
          setCategories(catRes.results.slice(0, 6));
          setSite(siteRes);
        }
      } catch {
        if (!cancelled) {
          setFeaturedProducts([]);
          setLatestProducts([]);
          setCategories([]);
          setSite(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroBadge = site?.hero_badge_text?.trim() || 'Next Gen Technology';
  const heroTitle = site?.hero_title?.trim() || 'The Future';
  const heroHighlight = site?.hero_title_highlight?.trim() || 'of Innovation.';
  const heroHighlightParts = heroHighlight.split(/\s+/).filter(Boolean);
  const heroHighlightFirst = heroHighlightParts[0] || 'of';
  const heroHighlightRest = heroHighlightParts.slice(1).join(' ') || 'Innovation.';
  const heroDesc =
    site?.hero_description?.trim() ||
    'Experience the next evolution of gadgets. Precision engineered, beautifully designed, and built for the modern world.';
  const promoTitle = site?.promo_title?.trim() || 'Immersive';
  const promoHighlight = site?.promo_title_highlight?.trim() || 'Sound Experience.';
  const promoDesc =
    site?.promo_description?.trim() ||
    'Get up to 30% off on all Sony and Bose headphones this week. Experience audio like never before.';
  const promoCta = site?.promo_cta_label?.trim() || 'Shop Audio Deals';
  const promoUrl = site?.promo_cta_url?.trim() || '/products?category=Audio';

  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section — content from Site settings */}
      <section className="relative min-h-[min(92vh,56rem)] overflow-hidden bg-[#050B1A] pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="absolute inset-0 z-0">
          {site?.hero_image_url || site?.hero_background_image_url ? (
            <img
              src={site?.hero_background_image_url || site?.hero_image_url || ''}
              alt=""
              className="h-full w-full object-cover opacity-100 brightness-110 contrast-[1.05] saturate-[1.05]"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B1A]/90 via-[#050B1A]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050B1A]/15 via-transparent to-[#050B1A]/80" />
          <div className="absolute -left-24 top-24 h-[340px] w-[340px] rounded-full bg-brand-600/25 blur-[110px]" />
          <div className="absolute -right-28 top-8 h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-[140px]" />
        </div>

        <div className="container-custom relative z-10 flex min-h-[min(92vh,56rem)] items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl lg:pt-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur md:mb-8"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">
                {heroBadge}
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl">
              {heroTitle}
              <br />
              <span className="block bg-gradient-to-r from-brand-500 to-indigo-400 bg-clip-text text-transparent">
                {heroHighlightFirst}
              </span>
              <span className="block bg-gradient-to-r from-brand-500 to-indigo-400 bg-clip-text text-transparent">
                {heroHighlightRest}
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-slate-200/80 sm:text-lg md:mb-10">
              {heroDesc}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <StorefrontCta
                href={site?.hero_cta_primary_url || '/products'}
                className="group inline-flex min-h-[3rem] w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-7 py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[14rem]"
              >
                {(site?.hero_cta_primary_label || 'Shop Collection').trim()}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </StorefrontCta>
              <StorefrontCta
                href={site?.hero_cta_secondary_url || '/products'}
                className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto sm:min-w-[14rem]"
              >
                {(site?.hero_cta_secondary_label || 'Explore Categories').trim()}
              </StorefrontCta>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:mt-12 md:grid-cols-4 md:gap-8">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'On all orders' },
                { icon: Shield, title: '1 Year Warranty', desc: 'Peace of mind' },
                { icon: RotateCcw, title: '30 Days Return', desc: 'Hassle free returns' },
                { icon: Headphones, title: 'Secure Payment', desc: '100% protected' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3 text-white/90">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                    <f.icon className="h-5 w-5 text-brand-200" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold tracking-tight">{f.title}</p>
                    <p className="text-[11px] font-medium text-slate-200/70">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container-custom py-20 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">Shop by Category</h2>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 md:text-lg">
              Find the perfect gadget for your needs with our curated collections.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-600 transition-all hover:gap-4"
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {(categories.length
            ? categories
            : [
                { id: 0, name: 'Laptops', slug: 'laptops', image: 'https://picsum.photos/seed/cat1/800/800' },
                { id: 1, name: 'Smartphones', slug: 'smartphones', image: 'https://picsum.photos/seed/cat2/800/800' },
                { id: 2, name: 'Audio', slug: 'audio', image: 'https://picsum.photos/seed/cat3/800/800' },
                { id: 3, name: 'Wearables', slug: 'wearables', image: 'https://picsum.photos/seed/cat4/800/800' },
                { id: 4, name: 'Gaming', slug: 'gaming', image: 'https://picsum.photos/seed/cat5/800/800' },
                { id: 5, name: 'Accessories', slug: 'accessories', image: 'https://picsum.photos/seed/cat6/800/800' },
              ]
          ).map((cat, i) => (
            <Link
              key={cat.id || i}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl dark:bg-slate-900',
                i % 5 === 0 ? 'md:col-span-2' : 'md:col-span-1'
              )}
            >
              <img
                src={cat.image || 'https://picsum.photos/seed/catfallback/800/800'}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              <div className="absolute bottom-6 left-6 text-white md:bottom-10 md:left-10">
                <h3 className="mb-2 text-2xl font-extrabold md:text-3xl">{cat.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Shop now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-20 md:py-32">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">Featured Products</h2>
            <p className="font-medium text-slate-500 dark:text-slate-400">Handpicked gadgets for your modern lifestyle.</p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-600 transition-all hover:gap-4 sm:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo banner — copy & CTA from Site settings */}
      <section className="container-custom py-12 md:py-20">
        <div className="relative h-[min(36rem,85vh)] min-h-[20rem] overflow-hidden rounded-[2rem] bg-brand-600 shadow-2xl shadow-brand-600/20 md:rounded-[2.5rem] md:h-[600px]">
          <img
            src={site?.homepage_banner_image_url || 'https://picsum.photos/seed/audiobanner/1200/800'}
            alt=""
            className="h-full w-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/50 to-transparent md:from-brand-950/80 md:via-brand-950/40" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-6 max-w-xl text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl md:mb-8 md:text-5xl lg:text-7xl">
                {promoTitle} <br />
                <span className="text-brand-300">{promoHighlight}</span>
              </h2>
              <p className="mb-8 max-w-md text-base font-medium leading-relaxed text-brand-100 md:mb-12 md:text-lg">
                {promoDesc}
              </p>
              <StorefrontCta
                href={promoUrl}
                className="inline-flex min-h-[3rem] items-center gap-4 rounded-2xl bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-brand-600 shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {promoCta}
                <ArrowRight className="h-4 w-4" />
              </StorefrontCta>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-custom py-20 md:py-32">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">New Arrivals</h2>
            <p className="font-medium text-slate-500 dark:text-slate-400">Be the first to own the latest technology.</p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-600 transition-all hover:gap-4 sm:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container-custom py-20 md:py-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40 md:rounded-[3rem] md:p-24">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:mb-8 md:text-4xl lg:text-6xl">
            Join the Hub.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:mb-12 md:text-lg">
            Subscribe to our newsletter and get $20 off your first order plus exclusive access to new product launches and
            tech insights.
          </p>
          <form className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
            <input type="email" placeholder="YOUR EMAIL ADDRESS" className="input-modern flex-1" />
            <button type="button" className="btn-primary whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
