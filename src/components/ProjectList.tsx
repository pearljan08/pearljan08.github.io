import aims from '../assets/aims.png';
import aims1 from '../assets/aims1.png';
import aims2 from '../assets/aims2.png';
import los from '../assets/csb.png';
import los1 from '../assets/csb1.png';
import los2 from '../assets/csb2.png';
import gcg from '../assets/gcg.png';
import gcg1 from '../assets/gcg1.png';
import gcg2 from '../assets/gcg2.png';
import gcg3 from '../assets/gcg3.png';

export const projectList = [
    {
        id: 'aims',
        name: 'AIMS',
        description: 'Academic Information Management Sytem. A web-based application for managing academic information that caters to students, faculty, and admin.',
        image: [aims, aims1, aims2],
    },
    {
        id: 'los',
        name: 'LOS',
        description: 'A Loan Origination System. A web-based application for managing loan applications and processing.',   
        image: [los, los1, los2],
    },
    {
        id: 'hris',
        name: 'HRIS',
        description: 'Human Resource Information System. A web-based application for managing employee information and HR processes.',
        image: [gcg, gcg1, gcg2, gcg3],
    }
];