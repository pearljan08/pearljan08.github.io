import { Carousel } from "@material-tailwind/react"

interface project {
    projectImages: string;
    projectTitle: string;
    projectContent: string;
}

const ProjectContent = ({ projectImages, projectTitle, projectContent }: project) => {
  return (
    <>
        <Carousel>
            <img src={projectImages} className="w-9 h-9"/>
        </Carousel>
        <p className="text-3xl text-gray-700">{projectTitle}</p>
        <p className="text-md text-gray-700">{projectContent}</p>
    </>
  )
}

export default ProjectContent