import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-xs font-bold tracking-[.18em] text-[#b84d66]">{eyebrow}</p>
        <h2 className="font-['Playfair_Display'] text-3xl font-semibold sm:text-4xl">{title}</h2>
      </div>
      <Link className="mb-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#b84d66] hover:text-[#9e3f57]" to={linkTo}>
        {linkLabel} <ChevronRight size={18} />
      </Link>
    </div>
  );
}
