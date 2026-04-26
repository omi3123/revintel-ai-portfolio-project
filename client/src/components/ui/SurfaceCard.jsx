import { motion } from 'framer-motion';

export default function SurfaceCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-4xl border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur md:p-6 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {title ? <h3 className="text-lg font-semibold text-slate-950">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      )}
      {children}
    </motion.section>
  );
}
