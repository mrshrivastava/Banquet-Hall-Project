import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FALLBACK_IMAGES } from '../../Pages/Home/home.constants';

const formatPrice = price => new Intl.NumberFormat('en-IN').format(price || 0);

export default function ListingPreview({ listing }) {
  const image = listing.photos?.[0] || FALLBACK_IMAGES.listing;
  const location = [listing.city, listing.state].filter(Boolean).join(', ');

  return (
    <Link to={`/listings/${listing._id}`} className="group overflow-hidden rounded-xl border border-[#eee9e1] bg-white transition duration-200 active:scale-[.99] sm:rounded-md sm:hover:-translate-y-1 sm:hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={image} alt="" />
        {listing.category && <span className="absolute bottom-3 left-3 rounded bg-white px-2 py-1 text-xs font-bold text-[#b84d66]">{listing.category.name}</span>}
      </div>
      <div className="p-5">
        <h3 className="font-['Playfair_Display'] text-xl font-semibold">{listing.name}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-[#706d65]"><MapPin size={15} />{location}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <b className="text-[#b84d66]">From ₹{formatPrice(listing.priceFrom)}</b>
          <span className="flex items-center gap-1 text-[#c78a20]"><Star size={15} fill="currentColor" />{listing.rating?.toFixed(1) || 'New'}</span>
        </div>
      </div>
    </Link>
  );
}
