import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-600">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
      </motion.div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
