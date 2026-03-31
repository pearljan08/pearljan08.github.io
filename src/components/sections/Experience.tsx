import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import ExperienceItem from '../ui/ExperienceItem';
import { experiences } from '../../data/experiences';

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading
        title="Work Experience"
        subtitle="My professional journey so far."
      />
      <div className="max-w-2xl">
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={exp.id}
            experience={exp}
            index={index}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
