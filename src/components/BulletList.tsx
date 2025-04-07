import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
 
export function BulletList({list}) {
  return (
    
      <Timeline>
        {
            list.map((item, index) => (
                <TimelineItem key={index}>
                <TimelineConnector />
                <TimelineHeader className="h-3">
                    <TimelineIcon />
                    <Typography variant="h6" color="blue-gray" className="leading-none font-bold">
                    {item.title} { item.client ? `(${item.client})` : ""}
                    </Typography>
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
    
  );
}