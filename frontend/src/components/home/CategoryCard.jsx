import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FALLBACK_IMAGES } from '../../Pages/Home/home.constants';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/listings?category=${category._id}`} aria-label={`Explore ${category.name}`} className="group relative h-40 overflow-hidden rounded-lg bg-[#27231f] shadow-sm sm:h-48 sm:rounded-md">
      <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={category.image || FALLBACK_IMAGES.category} alt="" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 font-['Playfair_Display'] text-xl font-semibold text-white">{category.name}</span>
      <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full border border-white/60 text-white transition sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
        <ChevronRight size={18} />
      </span>
    </Link>
  );
}
