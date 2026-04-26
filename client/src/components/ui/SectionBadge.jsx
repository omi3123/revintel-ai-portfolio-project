export default function SectionBadge({ children, tone = 'default' }) {
  const toneClass = {
    default: 'border-slate-200 bg-slate-50 text-slate-700',
    positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    premium: 'border-brand-200 bg-brand-50 text-brand-700'
  }[tone];

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}
