import { motion } from 'motion/react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="h-1 bg-accent rounded-full mt-4"
      />
      {subtitle && (
        <p className="text-gray-400 mt-4 max-w-2xl text-lg">{subtitle}</p>
      )}
    </div>
  );
}
