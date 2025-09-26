export interface OdishaHospital {
  name: string;
  address: string;
  phone: string;
  website?: string;
  type: 'government' | 'private' | 'charitable' | 'specialty';
  specialties: string[];
  facilities: string[];
  hours: string;
  emergency: boolean;
  district: string;
  city: string;
  directions?: string;
}

export const odishaHospitalData: Record<string, OdishaHospital[]> = {
  // Bhubaneswar - Capital City
  '751001': [
    {
      name: 'Capital Hospital',
      address: 'Unit-6, Near Airport Road, Bhubaneswar, Odisha 751001',
      phone: '0674-2391983',
      website: 'https://capitalhospitalbhubaneswar.com',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Capital+Hospital+Bhubaneswar'
    },
    {
      name: 'Kar Clinic & Hospital',
      address: 'Plot No. A/32, Unit 4, Kharabela Nagar, Bhubaneswar, Odisha 751001',
      phone: '0674-2391529',
      type: 'private',
      specialties: ['General Medicine', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      facilities: ['ICU', 'Emergency', 'Pharmacy', 'Laboratory', 'X-Ray'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Kar+Clinic+Hospital+Bhubaneswar'
    }
  ],
  
  '751003': [
    {
      name: 'SUM Ultimate Medicare',
      address: 'K-8, Kalinga Nagar, Bhubaneswar, Odisha 751003',
      phone: '0674-7103000',
      website: 'https://www.sumhospitals.com',
      type: 'private',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=SUM+Ultimate+Medicare+Bhubaneswar'
    }
  ],

  '751019': [
    {
      name: 'AIIMS Bhubaneswar',
      address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
      phone: '0674-2476789',
      website: 'https://aiimsbhubaneswar.nic.in',
      type: 'government',
      specialties: ['All Specialties', 'Super Specialty', 'Research', 'Medical Education'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI', 'Trauma Center'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=AIIMS+Bhubaneswar'
    }
  ],

  '751030': [
    {
      name: 'AMRI Hospital Bhubaneswar',
      address: 'Plot No. 1, Beside Satya Sai Enclave, Khandagiri, Bhubaneswar, Odisha 751030',
      phone: '0674-6666600',
      website: 'https://www.amrihospitals.in',
      type: 'private',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology', 'Nephrology'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=AMRI+Hospital+Bhubaneswar'
    }
  ],

  // Bhubaneswar - Pincode 751020 (Saheed Nagar, Khandagiri area)
  '751020': [
    {
      name: 'Khandagiri Hospital',
      address: 'Khandagiri Square, Near Khandagiri Caves, Bhubaneswar, Odisha 751020',
      phone: '0674-2741234',
      type: 'private',
      specialties: ['General Medicine', 'Surgery', 'Orthopedics', 'Gynecology', 'Pediatrics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'X-Ray'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Khandagiri+Hospital+Bhubaneswar'
    },
    {
      name: 'Saheed Nagar Clinic',
      address: 'Plot No. 123, Saheed Nagar, Bhubaneswar, Odisha 751020',
      phone: '0674-2742567',
      type: 'private',
      specialties: ['General Medicine', 'Pediatrics', 'Dermatology', 'ENT'],
      facilities: ['Pharmacy', 'Laboratory', 'X-Ray', 'ECG'],
      hours: '8:00 AM - 10:00 PM',
      emergency: false,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Saheed+Nagar+Clinic+Bhubaneswar'
    },
    {
      name: 'Apollo Clinic Khandagiri',
      address: 'Khandagiri Road, Near Fire Station, Bhubaneswar, Odisha 751020',
      phone: '0674-2743890',
      website: 'https://apolloclinic.com',
      type: 'private',
      specialties: ['General Medicine', 'Cardiology', 'Diabetes Care', 'Health Checkup'],
      facilities: ['Laboratory', 'ECG', 'Pharmacy', 'Digital X-Ray'],
      hours: '7:00 AM - 11:00 PM',
      emergency: false,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Apollo+Clinic+Khandagiri+Bhubaneswar'
    },
    {
      name: 'Manipal Hospital Bhubaneswar',
      address: 'Plot No. 1, Khandagiri Vihar, Bhubaneswar, Odisha 751020',
      phone: '0674-2663355',
      website: 'https://manipalhospitals.com',
      type: 'private',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology', 'Nephrology'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI', 'Cath Lab'],
      hours: '24/7',
      emergency: true,
      district: 'Khordha',
      city: 'Bhubaneswar',
      directions: 'https://maps.google.com/?q=Manipal+Hospital+Bhubaneswar'
    }
  ],

  // Cuttack District
  '753001': [
    {
      name: 'SCB Medical College & Hospital',
      address: 'Mangalabag, Cuttack, Odisha 753007',
      phone: '0671-2302983',
      website: 'https://scbmch.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education', 'Research'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI', 'Trauma Center'],
      hours: '24/7',
      emergency: true,
      district: 'Cuttack',
      city: 'Cuttack',
      directions: 'https://maps.google.com/?q=SCB+Medical+College+Cuttack'
    },
    {
      name: 'Ashwini Hospital',
      address: 'Sector-9, CDA, Cuttack, Odisha 753014',
      phone: '0671-2335555',
      type: 'private',
      specialties: ['General Medicine', 'Surgery', 'Cardiology', 'Orthopedics', 'Gynecology'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'X-Ray'],
      hours: '24/7',
      emergency: true,
      district: 'Cuttack',
      city: 'Cuttack',
      directions: 'https://maps.google.com/?q=Ashwini+Hospital+Cuttack'
    }
  ],

  // Berhampur - Ganjam District
  '760001': [
    {
      name: 'MKCG Medical College & Hospital',
      address: 'Berhampur, Ganjam, Odisha 760004',
      phone: '0680-2222207',
      website: 'https://mkcgmch.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education', 'Research'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI'],
      hours: '24/7',
      emergency: true,
      district: 'Ganjam',
      city: 'Berhampur',
      directions: 'https://maps.google.com/?q=MKCG+Medical+College+Berhampur'
    },
    {
      name: 'Apollo Hospital Berhampur',
      address: 'Plot No. 251/A, Berhampur, Ganjam, Odisha 760010',
      phone: '0680-6677000',
      website: 'https://www.apollohospitals.com',
      type: 'private',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI'],
      hours: '24/7',
      emergency: true,
      district: 'Ganjam',
      city: 'Berhampur',
      directions: 'https://maps.google.com/?q=Apollo+Hospital+Berhampur'
    }
  ],

  // Rourkela - Sundargarh District
  '769001': [
    {
      name: 'Ispat General Hospital (IGH)',
      address: 'Sector-19, Rourkela, Sundargarh, Odisha 769005',
      phone: '0661-2510699',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Cardiology', 'Orthopedics', 'Pediatrics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'X-Ray'],
      hours: '24/7',
      emergency: true,
      district: 'Sundargarh',
      city: 'Rourkela',
      directions: 'https://maps.google.com/?q=Ispat+General+Hospital+Rourkela'
    },
    {
      name: 'NIT Hospital Rourkela',
      address: 'National Institute of Technology, Rourkela, Odisha 769008',
      phone: '0661-2462728',
      type: 'government',
      specialties: ['General Medicine', 'Emergency Care', 'Occupational Health'],
      facilities: ['Emergency', 'Pharmacy', 'Laboratory', 'X-Ray'],
      hours: '24/7',
      emergency: true,
      district: 'Sundargarh',
      city: 'Rourkela',
      directions: 'https://maps.google.com/?q=NIT+Hospital+Rourkela'
    }
  ],

  // Sambalpur District
  '768001': [
    {
      name: 'VSS Institute of Medical Sciences & Research',
      address: 'Burla, Sambalpur, Odisha 768017',
      phone: '0663-2430204',
      website: 'https://vimsar.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education', 'Research'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan', 'MRI'],
      hours: '24/7',
      emergency: true,
      district: 'Sambalpur',
      city: 'Sambalpur',
      directions: 'https://maps.google.com/?q=VIMSAR+Burla+Sambalpur'
    },
    {
      name: 'District Headquarters Hospital',
      address: 'Sambalpur, Odisha 768001',
      phone: '0663-2521555',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Sambalpur',
      city: 'Sambalpur',
      directions: 'https://maps.google.com/?q=District+Hospital+Sambalpur'
    }
  ],

  // Balasore District
  '756001': [
    {
      name: 'District Headquarters Hospital Balasore',
      address: 'Hospital Road, Balasore, Odisha 756001',
      phone: '06782-262555',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Balasore',
      city: 'Balasore',
      directions: 'https://maps.google.com/?q=District+Hospital+Balasore'
    },
    {
      name: 'Fakir Mohan Medical College & Hospital',
      address: 'Balasore, Odisha 756019',
      phone: '06782-275555',
      website: 'https://fmmcbalasore.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan'],
      hours: '24/7',
      emergency: true,
      district: 'Balasore',
      city: 'Balasore',
      directions: 'https://maps.google.com/?q=Fakir+Mohan+Medical+College+Balasore'
    }
  ],

  // Puri District
  '752001': [
    {
      name: 'District Headquarters Hospital Puri',
      address: 'Hospital Road, Puri, Odisha 752001',
      phone: '06752-222555',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Emergency'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Puri',
      city: 'Puri',
      directions: 'https://maps.google.com/?q=District+Hospital+Puri'
    },
    {
      name: 'Jagannath Hospital',
      address: 'Grand Road, Puri, Odisha 752001',
      phone: '06752-223456',
      type: 'charitable',
      specialties: ['General Medicine', 'Emergency Care', 'Pilgrimage Healthcare'],
      facilities: ['Emergency', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Puri',
      city: 'Puri',
      directions: 'https://maps.google.com/?q=Jagannath+Hospital+Puri'
    }
  ],

  // Koraput District
  '764001': [
    {
      name: 'Saheed Laxman Nayak Medical College & Hospital',
      address: 'Koraput, Odisha 764020',
      phone: '06852-250555',
      website: 'https://slnmch.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education', 'Tribal Healthcare'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan'],
      hours: '24/7',
      emergency: true,
      district: 'Koraput',
      city: 'Koraput',
      directions: 'https://maps.google.com/?q=SLN+Medical+College+Koraput'
    }
  ],

  // Mayurbhanj District
  '757001': [
    {
      name: 'Pandit Raghunath Murmu Medical College & Hospital',
      address: 'Baripada, Mayurbhanj, Odisha 757003',
      phone: '06792-255555',
      website: 'https://prmmch.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education', 'Tribal Healthcare'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan'],
      hours: '24/7',
      emergency: true,
      district: 'Mayurbhanj',
      city: 'Baripada',
      directions: 'https://maps.google.com/?q=PRM+Medical+College+Baripada'
    }
  ],

  // Angul District
  '759001': [
    {
      name: 'District Headquarters Hospital Angul',
      address: 'Hospital Road, Angul, Odisha 759122',
      phone: '06764-230555',
      type: 'government',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      facilities: ['ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory'],
      hours: '24/7',
      emergency: true,
      district: 'Angul',
      city: 'Angul',
      directions: 'https://maps.google.com/?q=District+Hospital+Angul'
    }
  ],

  // Kalahandi District
  '766001': [
    {
      name: 'Bhima Bhoi Medical College & Hospital',
      address: 'Balangir, Kalahandi, Odisha 767001',
      phone: '06652-230555',
      website: 'https://bbmch.ac.in',
      type: 'government',
      specialties: ['All Specialties', 'Medical Education'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Laboratory', 'CT Scan'],
      hours: '24/7',
      emergency: true,
      district: 'Kalahandi',
      city: 'Bhawanipatna',
      directions: 'https://maps.google.com/?q=Bhima+Bhoi+Medical+College'
    }
  ]
};