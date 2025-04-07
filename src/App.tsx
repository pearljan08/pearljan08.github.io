import './App.css'
import me from './assets/me.jpg';
import { BeakerIcon, BookOpenIcon, BriefcaseIcon } from '@heroicons/react/24/solid';
import { BulletList } from './components/BulletList';
import { experienceList } from './components/ExperienceList';
import TechStack from './components/TechStack';
import { backendList, frontendList } from './components/TechStackList';

function App() {

  return (
    <>
      <div className="flex items-center mx-64 my-5">
        <div className="grid grid-cols-3 grid-rows-3 gap-5 w-full h-screen">
          <div className="row-span-2 size-full rounded-xl shadow-lg border border-gray-50 bg-gray-50">
            <div className="flex flex-col justify-center p-8 gap-8">
              <h1 className="text-4xl font-bold text-gray-700 flex flex-row gap-3"><BriefcaseIcon className="w-1/9 text-gray-700"/>Work Experience</h1>
              <hr className="w-full text-gray-300"/>
              <BulletList list={experienceList}/>
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
              <p className="text-4xl font-bold text-gray-700 flex flex-row gap-3"><BookOpenIcon className="w-1/9 text-gray-700"/>About</p>
              <hr className="w-full my-3 text-gray-300"/>
              <p className="text-gray-700 text-sm">
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
            <p className="text-4xl text-gray-700 font-bold">Tech Stack</p>
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
          <div className="col-span-2 size-full rounded-xl shadow-lg border-1 border-gray-50">
            <div className="flex items-center justify-center h-full">
            <p>Projects I've worked on...</p>
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
