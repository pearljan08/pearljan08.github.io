import {
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@material-tailwind/react";
 
interface ProjectsProps {
  cardImg: string;
  cardTitle: string;
  cardDescription: string;
  readMore: () => void;
}

export function Projects({cardImg, cardTitle, cardDescription, readMore}: ProjectsProps) {
  return (
    <Card className="h-full w-full max-w-[48rem] flex flex-col md:flex-row overflow-hidden rounded-xl">
        <CardHeader
            shadow={false}
            floated={false}
            className="m-0 md:w-2/5 w-full shrink-0 rounded-b-none md:rounded-r-none md:rounded-l-xl overflow-hidden"
        >
            <img
            src={cardImg || ""}
            alt="card-image"
            className="h-48 md:h-full w-full object-cover"
            />
        </CardHeader>

        <CardBody className="flex flex-col justify-center">
            <p className="mb-2 text-2xl font-bold text-gray-700">
            {cardTitle || "Project Title"}
            </p>
            <p className="mb-6 font-normal text-gray-500">
            {cardDescription || "Project description goes here."}
            </p>
            <a href="#" className="inline-block mt-auto">
            <Button
                variant="text"
                className="flex items-center gap-2 text-blue-600"
                onClick={readMore || (() => {})}
            >
                Learn More
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
                </svg>
            </Button>
            </a>
        </CardBody>
    </Card>

  );
}