import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/home/CategoryCard';
import ListingPreview from '../../components/home/ListingPreview';
import SectionHeading from '../../components/home/SectionHeading';
import { getHomeContent } from '../../services/home.service';
import { HOME_CONTENT } from './home.constants';

const INITIAL_CONTENT = { categories: [], listings: [] };

export default function HomePage() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { hero, about } = HOME_CONTENT;

  useEffect(() => {
    let isMounted = true;

    getHomeContent()
      .then(data => isMounted && setContent(data))
      .catch(() => isMounted && setError('We could not load wedding services right now. Please try again shortly.'))
      .finally(() => isMounted && setIsLoading(false));

    return () => { isMounted = false; };
  }, []);

  const handleSearch = event => {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/listings?search=${encodeURIComponent(query)}` : '/listings');
  };

  return (
    <main className="bg-[#fcfaf5] text-[#22211e]">
      <Hero hero={hero} term={term} onTermChange={setTerm} onSearch={handleSearch} />

      <section className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 sm:px-10 lg:px-6 lg:py-20" id="categories">
        <SectionHeading eyebrow="EXPLORE SERVICES" title="Everything for your wedding" linkTo="/listings" linkLabel="See all" />
        <HomeFeedback isLoading={isLoading} error={error} isEmpty={!content.categories.length} emptyMessage="Wedding services will appear here shortly." />
        {!isLoading && !error && content.categories.length > 0 && <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{content.categories.map(category => <CategoryCard category={category} key={category._id} />)}</div>}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-6 lg:pb-20">
        <SectionHeading eyebrow="HANDPICKED FOR YOU" title="Popular picks" linkTo="/listings" linkLabel="View all" />
        <HomeFeedback isLoading={isLoading} error={error} isEmpty={!content.listings.length} emptyMessage="Popular services will appear here shortly." />
        {!isLoading && !error && content.listings.length > 0 && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{content.listings.map(listing => <ListingPreview listing={listing} key={listing._id} />)}</div>}
      </section>

      <AboutSection about={about} />
    </main>
  );
}

function Hero({ hero, term, onTermChange, onSearch }) {
  return (
    <section className="relative isolate flex min-h-[580px] items-center overflow-hidden bg-cover bg-center px-6 py-20 sm:px-10 lg:px-[7%]" style={{ backgroundImage: `linear-gradient(90deg, rgba(27,22,20,.76), rgba(27,22,20,.14)), url('${hero.image}')` }}>
      <div className="max-w-3xl text-white">
        <p className="mb-4 text-xs font-bold tracking-[.18em] text-[#ffd8cf]">{hero.eyebrow}</p>
        <h1 className="font-['Playfair_Display'] text-5xl leading-[1.08] font-semibold sm:text-6xl lg:text-7xl">{hero.title} <i>{hero.titleEmphasis}</i></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{hero.description}</p>
        <form className="mt-8 flex max-w-2xl flex-col gap-2 rounded-md bg-white p-2 text-[#706d65] shadow-xl sm:flex-row sm:items-center" onSubmit={onSearch}>
          <Search className="ml-2 hidden size-5 sm:block" aria-hidden="true" />
          <input className="min-w-0 flex-1 rounded px-3 py-3 text-[15px] outline-none" aria-label="Search wedding services" value={term} onChange={event => onTermChange(event.target.value)} placeholder="Search venues, caterers, DJs…" />
          <button className="rounded bg-[#b84d66] px-6 py-3 font-semibold text-white transition hover:bg-[#9e3f57]">Search</button>
        </form>
      </div>
    </section>
  );
}

function HomeFeedback({ isLoading, error, isEmpty, emptyMessage }) {
  if (isLoading) return <p className="py-10 text-sm text-[#706d65]">Loading services…</p>;
  if (error) return <p className="rounded-md bg-[#fdf0f2] p-4 text-sm text-[#9e3f57]">{error}</p>;
  if (isEmpty) return <p className="py-10 text-sm text-[#706d65]">{emptyMessage}</p>;
  return null;
}

function AboutSection({ about }) {
  return (
    <section className="mx-auto mb-16 grid max-w-6xl scroll-mt-24 overflow-hidden bg-[#f2e5df] md:grid-cols-2 lg:mb-20" id="our-story">
      <img className="h-72 w-full object-cover md:h-full" src={about.image} alt="Couple celebrating their wedding" />
      <div className="p-9 sm:p-12 lg:px-16 lg:py-20">
        <p className="mb-4 text-xs font-bold tracking-[.18em] text-[#b84d66]">{about.eyebrow}</p>
        <h2 className="font-['Playfair_Display'] text-4xl leading-tight font-semibold">{about.title}</h2>
        <p className="mt-5 leading-7 text-[#5f5a54]">{about.description}</p>
        <div className="my-7 grid gap-2 text-sm">{about.highlights.map(([title, description]) => <span key={title}><b>{title}</b> {description}</span>)}</div>
        <Link className="inline-flex items-center gap-1 font-semibold text-[#b84d66] hover:text-[#9e3f57]" to="/about">Meet ShaadiScout</Link>
      </div>
    </section>
  );
}
