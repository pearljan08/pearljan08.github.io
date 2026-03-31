import { motion } from 'motion/react';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import me from '../../assets/me.jpg';

export default function About() {
  return (
    <SectionWrapper id="about">
      <SectionHeading title="About Me" />
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0"
        >
          <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border border-gray-700/50
                          hover:border-accent/30 transition-colors duration-300 shadow-lg">
            <img
              src={me}
              alt="Pearl Jan Sabanal"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <p className="text-gray-300 leading-relaxed text-lg">
            I am passionate about creating user-friendly interfaces and optimizing
            performance to enhance user experience. I am a quick learner and
            adaptable to new technologies, and I thrive in fast-paced environments.
          </p>
          <p className="text-gray-300 leading-relaxed text-lg mt-4">
            I am committed to continuous learning and professional growth, and I
            am excited to contribute my skills and knowledge to a dynamic team. I
            am eager to take on new challenges and make a positive impact in the
            field of web development.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            {[
              { value: '5+', label: 'Years Experience' },
              { value: '3+', label: 'Projects Built' },
              { value: '5', label: 'Companies' },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
