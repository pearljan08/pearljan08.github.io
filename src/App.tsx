import './App.css'
import me from './assets/me.jpg';
import { BeakerIcon, BookOpenIcon, BriefcaseIcon, ChevronLeftIcon, ClipboardDocumentListIcon, CogIcon } from '@heroicons/react/24/solid';
import { BulletList } from './components/BulletList';
import { experienceList } from './components/ExperienceList';
import TechStack from './components/TechStack';
import { backendList, frontendList } from './components/TechStackList';
import { Projects } from './components/Projects';
import { projectList } from './components/ProjectList';
import { Carousel, IconButton } from '@material-tailwind/react';
import { useState } from 'react';
import { Project } from './components/Project';

function App() {

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setActiveProjectId(id);
  };

  const handleClose = () => {
    setActiveProjectId(null);
  };
   

  return (
    <>
      <div className="flex items-center mx-64 my-5">
        <div className="grid grid-cols-3 grid-rows-3 gap-5 w-full h-screen">
          <div className="row-span-2 size-full rounded-xl shadow-lg border border-gray-50 bg-gray-50">
            <div className="flex flex-col justify-center p-8 gap-8">
              <h1 className="text-3xl font-bold text-gray-700 flex flex-row gap-3"><BriefcaseIcon className="w-1/11 text-gray-700"/>Work Experience</h1>
              <hr className="w-full text-gray-300"/>
              <div className="">
              <BulletList list={experienceList}/>
              </div>
            </div>
          </div>
          <div className="col-span-2 w-full h-full rounded-xl shadow-lg border border-gray-50 bg-gray-50">
            <div className="grid grid-cols-4 h-full">
              <div className="flex flex-row items-center">
                <BeakerIcon className="text-gray-300"/>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="flex flex-col text-right">
                  <p className="text-4xl font-bold text-gray-700">Pearl Jan Sabanal</p>
                  <p className="text-lg text-gray-600">Fullstack Developer</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="aspect-square w-full max-w-[160px] rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={me}
                    alt="Pearl Jan Sabanal"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="size-full rounded-xl shadow-lg border-1 border-gray-50 bg-gray-50">
            <div className="flex flex-col h-full p-5">
              <p className="text-3xl font-bold text-gray-700 flex flex-row gap-3"><BookOpenIcon className="w-1/11 text-gray-700"/>About</p>
              <hr className="w-full my-3 text-gray-300"/>
              <p className="text-gray-600 text-md overflow-auto">
              I am passionate about creating user-friendly interfaces and optimizing performance to enhance
              user experience. I am a quick learner and adaptable to new technologies, and I thrive in
              fast-paced environments. I am committed to continuous learning and professional growth, and
              I am excited to contribute my skills and knowledge to a dynamic team. I am eager to take on
              new challenges and make a positive impact in the field of web development.
              </p>
            </div>
          </div>
          <div className="size-full rounded-xl shadow-lg border-1 border-gray-50 bg-gray-50">
            <div className="flex flex-col h-full p-5">
              <p className="text-3xl text-gray-700 font-bold flex flex-row gap-3"><CogIcon className="w-1/11 text-gray-700"/>Tech Stack</p>
              <hr className="w-full my-3 text-gray-300"/>
              <p className="text-md font-bold text-gray-600">Front-end</p>
              <div className="flex flex-row justify-start gap-1 pt-1.5">
                <TechStack techStack={frontendList}/>
              </div>
              <p className="text-md font-bold text-gray-600 pt-3">Back-end</p>
              <div className="flex flex-row justify-start gap-1 pt-1.5">
                <TechStack techStack={backendList}/>
              </div>
            </div>
          </div>
          <div className="col-span-2 size-full rounded-xl shadow-lg border-1 border-gray-50 bg-gray-50">
            <div className="flex flex-col p-3 h-full">
              <p className="text-xl text-gray-700 font-bold flex flex-row gap-1"><ClipboardDocumentListIcon className="w-1/25 text-gray-700"/>Projects I've worked on..</p>
              <Carousel 
                className="py-2 h-[22rem]"
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
                projectList.map((project, index) => (
                  <>
                    <Projects
                      key={index}
                      cardImg={project.image[0] || ''}
                      cardTitle={project.name}
                      cardDescription={project.description} 
                      readMore={() => handleOpen(project.id)}  
                                       
                    />
                    <Project key={project.id} isOpen={activeProjectId === project.id} handleOpen={handleClose} title={project.name} description={project.description} image={project.image}/>
                  </>
                ))
              }
              </Carousel>
            </div>
          </div>
          <div className="size-full rounded-xl shadow-lg border-1 border-gray-50">
            <div className="flex items-center justify-center h-full">
            <p>This is me</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
