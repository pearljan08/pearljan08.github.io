import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@material-tailwind/react";
 
interface BulletListItem {
  title: string;
  client?: string;
  company: string;
  date: string;
  description?: string[];
}

interface BulletListProps {
  list: BulletListItem[];
}

export function BulletList({ list }: BulletListProps) {
  return (
      <div className="">
        <Timeline>
          {
              list.map((item, index) => (
                  <TimelineItem key={index}>
                  <TimelineConnector />
                  <TimelineHeader className="h-1">
                      <TimelineIcon />
                      <p className="text-gray-700 leading-none font-bold">
                      {item.title} { item.client ? `(${item.client})` : ""}
                      </p>
                  </TimelineHeader>
                  <TimelineBody className="pb-8">
                      <p className="text-gray-600 font-semibold">{item.company}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                      {/* {
                          item.description.map((desc, index) => (
                              <p key={index}>{desc}</p>
                          ))
                      } */}
                  </TimelineBody>
                  </TimelineItem>
              ))
          }
        </Timeline>
      </div>
    
  );
}