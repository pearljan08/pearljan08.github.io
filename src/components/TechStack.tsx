interface TechStackProps {
  techStack: { name: string }[];
}

const TechStack = ({ techStack }: TechStackProps) => {
  return (
    <>
      {
        techStack.map((tech, index) => (
            <div key={index} className="p-1 border border-gray-400 rounded-lg">
                <p className="text-xs font-semibold text-gray-600">{tech.name}</p>
            </div>
        ))
      }
    </>
  )
}

export default TechStack
