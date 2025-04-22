import { Carousel, IconButton } from "@material-tailwind/react"

interface project {
    projectImages: Array<string>;
    projectTitle: string;
    projectContent: string;
}

const ProjectContent = ({ projectImages, projectTitle, projectContent }: project) => {
  return (
    <>
        <Carousel
          prevArrow={({ handlePrev }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handlePrev}
              className="!absolute top-2/4 left-4 -translate-y-2/4"
            >
              <i className="fa-solid fa-left-long text-gray-600"/>
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handleNext}
              className="!absolute top-2/4 !right-4 -translate-y-2/4"
            >
              <i className="fa-solid fa-right-long text-gray-600"/>
            </IconButton>
          )}
          loop
          autoplay
        > 
          {
            projectImages.map((image, index) => (
              <div key={index} className="flex flex-row items-center justify-center h-full">
                <img src={image} className="w-128 object-center"/>
              </div>
            ))
          }
        </Carousel>
        <p className="text-3xl text-gray-700">{projectTitle}</p>
        <p className="text-md text-gray-700">{projectContent}</p>
    </>
  )
}

export default ProjectContent