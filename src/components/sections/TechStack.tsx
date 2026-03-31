import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import SkillCard from '../ui/SkillCard';
import { skillCategories } from '../../data/skills';

export default function TechStack() {
  let globalIndex = 0;

  return (
    <SectionWrapper id="skills">
      <SectionHeading
        title="Tech Stack"
        subtitle="Technologies and tools I work with."
      />
      <div className="space-y-10">
        {skillCategories.map((category) => (
          <div key={category.category}>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              {category.category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {category.skills.map((skill) => {
                const idx = globalIndex++;
                return (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
