import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import ProjectContent from "./ProjectContent";
 
interface ProjectProps {
  isOpen: boolean;
  handleOpen: () => void;
  title: string;
  description: string;
  image: Array<string>;
  key: string
}





export function Project({ isOpen, handleOpen, ...props }: ProjectProps) {
  // const [open, setOpen] = useState(false);
 
  // const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <Dialog open={isOpen} handler={handleOpen} key={props.key}>
        <DialogHeader className="flex flex-col items-center justify-center text-3xl font-extrabold">{props.title}</DialogHeader>
        <DialogBody>
          <ProjectContent projectImages={props.image} projectTitle={props.title} projectContent={props.description}/>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}