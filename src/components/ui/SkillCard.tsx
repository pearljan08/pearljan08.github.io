import { motion } from 'motion/react';

interface SkillCardProps {
  name: string;
  index: number;
}

export default function SkillCard({ name, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)' }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-center cursor-default
                 hover:border-accent/50 transition-colors duration-300"
    >
      <span className="text-sm font-medium text-gray-300">{name}</span>
    </motion.div>
  );
}
