import type { FindNearbyHospitalsOutput } from "@/ai/flows/find-nearby-hospitals";

export const hospitalData: Record<string, FindNearbyHospitalsOutput> = {
    "751024": {
        hospitals: [
            { name: "AIIMS Bhubaneswar", address: "Sijua, Patrapada, Bhubaneswar, Odisha 751019", type: "government", hours: "24/7", directions: "https://maps.google.com/?q=AIIMS+Bhubaneswar", phone: "tel:+916742476789" },
            { name: "AMRI Hospital", address: "Plot No. 1, Beside Satya Sai Enclave, Khandagiri, Bhubaneswar, Odisha 751030", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=AMRI+Hospital+Bhubaneswar", phone: "tel:+916746666600" },
            { name: "SUM Ultimate Medicare", address: "K-8, Kalinga Nagar, Bhubaneswar, Odisha 751003", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=SUM+Ultimate+Medicare", phone: "tel:+916747103000" },
        ]
    },
    "751001": {
        hospitals: [
            { name: "Capital Hospital", address: "Unit-6, Near Airport Road, Bhubaneswar, Odisha 751001", type: "government", hours: "24/7", directions: "https://maps.google.com/?q=Capital+Hospital+Bhubaneswar", phone: "tel:+916742391983" },
            { name: "Kar Clinic & Hospital", address: "Plot No. A/32, Unit 4, Kharabela Nagar, Bhubaneswar, Odisha 751001", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=Kar+Clinic+&+Hospital", phone: "tel:+916742391529" },
        ]
    },
    "400001": {
        hospitals: [
            { name: "Bombay Hospital & Medical Research Centre", address: "12, Marine Lines, Mumbai, Maharashtra 400020", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=Bombay+Hospital+&+Medical+Research+Centre", phone: "tel:+912222067676" },
            { name: "St. George's Hospital", address: "P D'Mello Road, Fort, Mumbai, Maharashtra 400001", type: "government", hours: "24/7", directions: "https://maps.google.com/?q=St.+George's+Hospital+Mumbai", phone: "tel:+912222620344" },
        ]
    },
     "110001": {
        hospitals: [
            { name: "Lok Nayak Jai Prakash Narayan Hospital", address: "Jawaharlal Nehru Marg, New Delhi, Delhi 110002", type: "government", hours: "24/7", directions: "https://maps.google.com/?q=Lok+Nayak+Jai+Prakash+Narayan+Hospital", phone: "tel:+911123232400" },
            { name: "Sir Ganga Ram Hospital", address: "Rajinder Nagar, New Delhi, Delhi 110060", type: "charitable", hours: "24/7", directions: "https://maps.google.com/?q=Sir+Ganga+Ram+Hospital", phone: "tel:+911125750000" },
        ]
    },
    "831004": {
        hospitals: [
            { name: "Tata Main Hospital", address: "C Road West, Northern Town, Jamshedpur, Jharkhand 831001", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=Tata+Main+Hospital", phone: "tel:+916576641021" },
            { name: "MGM Medical College & Hospital", address: "Dimna, Mango, Jamshedpur, Jharkhand 831020", type: "government", hours: "24/7", directions: "https://maps.google.com/?q=MGM+Medical+College+&+Hospital", phone: "tel:+916572360744" },
            { name: "Brahmananda Narayana Multispeciality Hospital", address: "NH33, Tamolia, Jamshedpur, Jharkhand 831012", type: "private", hours: "24/7", directions: "https://maps.google.com/?q=Brahmananda+Narayana+Multispeciality+Hospital", phone: "tel:+918067506570" },
        ]
    }
};
