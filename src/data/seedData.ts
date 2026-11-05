/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Application, Interview, Scorecard } from '../types';

export const SEED_JOBS: Job[] = [
  {
    id: 'job-csm',
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Delhi, India',
    salaryRange: '₹8L–₹12L / yr',
    employmentType: 'Full-time',
    status: 'Open',
    postedDateDisplay: 'Posted Oct 25',
    createdAt: '2026-10-25T09:00:00Z',
    minExperience: 3.0,
    mandatorySkills: ['Customer Retention', 'SaaS Onboarding', 'Zendesk / CRM', 'Account Health'],
    minEducation: 'Bachelor',
    description: 'We are seeking an empathetic and structured Customer Success Manager in Delhi to own customer health, proactive onboarding, retention, and executive business reviews for high-growth enterprise clients across APAC.',
    responsibilities: [
      'Lead post-sale onboarding workflows and ensure rapid time-to-value for enterprise customers.',
      'Analyze recurring product usage metrics and preemptively mitigate customer churn risk.',
      'Partner closely with product and engineering leads to advocate for critical client workflow enhancements.',
      'Conduct quarterly executive reviews and identify expansion opportunities.'
    ],
    requirements: [
      '3+ years in B2B SaaS customer success, account management, or client relations.',
      'Demonstrated track record maintaining >92% gross customer retention across mid-market accounts.',
      'Strong analytical rigor with proficiency in CRM platforms, Looker, and customer health dashboards.',
      'Superb interpersonal, written, and cross-functional communication abilities.'
    ],
    benefits: [
      'Comprehensive medical insurance for employee and immediate family.',
      'Annual learning and professional development budget (₹50,000).',
      'Flexible working hours and modern ergonomic workspace in Central Delhi.',
      'Generous paid annual leave and health wellness stipends.'
    ],
    resumeFormats: ['.pdf', '.docx'],
    questions: [
      {
        id: 'q-csm-1',
        label: 'Describe a scenario where you rescued an at-risk enterprise customer from churning',
        kind: 'long_text',
        required: true
      },
      {
        id: 'q-csm-2',
        label: 'What customer health metrics do you prioritize in daily account tracking?',
        kind: 'text',
        required: true
      },
      {
        id: 'q-csm-3',
        label: 'Are you based in Delhi NCR or open to working from our Delhi hub?',
        kind: 'yes_no',
        required: true
      }
    ]
  },
  {
    id: 'job-da',
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Pune, India (Hybrid)',
    salaryRange: '₹10L–₹15L / yr',
    employmentType: 'Full-time',
    status: 'Open',
    postedDateDisplay: 'Posted Oct 22',
    createdAt: '2026-10-22T10:00:00Z',
    minExperience: 2.5,
    mandatorySkills: ['SQL', 'Python / Pandas', 'Tableau / PowerBI', 'Cohort Analysis'],
    minEducation: 'Bachelor',
    description: 'Join our Analytics team in Pune to build scalable data models, executive KPI scorecards, and predictive conversion funnels that power product decision-making across HirePulse.',
    responsibilities: [
      'Build automated ETL transformations and maintain clean, reliable data marts in Snowflake & PostgreSQL.',
      'Collaborate with product squads to define metric taxonomies and construct self-serve dashboards.',
      'Perform exploratory multivariate analyses to uncover candidate conversion bottlenecks.',
      'Design and evaluate randomized A/B tests with statistical hypothesis rigor.'
    ],
    requirements: [
      '2.5+ years experience querying complex relational datasets and building production BI dashboards.',
      'Mastery of advanced SQL (window functions, recursive CTEs, indexing strategies).',
      'Hands-on proficiency with Python or R for statistical cohort modeling.',
      'Ability to articulate complex numerical insights into clear, actionable executive narratives.'
    ],
    benefits: [
      'Hybrid working model (2 days office, 3 days flexible remote).',
      'Top-tier health coverage with OPD benefits.',
      'Annual hardware stipend for home setup.',
      'Subsidized meal passes and commuter assistance.'
    ],
    resumeFormats: ['.pdf', '.docx'],
    questions: [
      {
        id: 'q-da-1',
        label: 'Link to a public GitHub repo or analytics case study project',
        kind: 'text',
        required: true
      },
      {
        id: 'q-da-2',
        label: 'Explain the difference between a window function and a standard group-by aggregate',
        kind: 'long_text',
        required: true
      }
    ]
  },
  {
    id: 'job-tr',
    title: 'Technical Recruiter',
    department: 'People',
    location: 'Mumbai, India',
    salaryRange: '₹9L–₹13L / yr',
    employmentType: 'Full-time',
    status: 'Open',
    postedDateDisplay: 'Posted Oct 19',
    createdAt: '2026-10-19T11:30:00Z',
    minExperience: 3.0,
    mandatorySkills: ['Full-lifecycle Recruiting', 'Tech Sourcing', 'Candidate Experience', 'ATS Management'],
    minEducation: 'Bachelor',
    description: 'We are looking for a thoughtful, craft-oriented Technical Recruiter in Mumbai to drive full-lifecycle hiring across engineering, product design, and distributed infrastructure teams.',
    responsibilities: [
      'Source high-caliber software engineering and design talent through direct networks and deliberate outreach.',
      'Conduct rigorous screening interviews calibrating technical competencies and cultural alignment.',
      'Deliver an exceptional candidate experience with timely, respectful feedback at every stage.',
      'Partner with hiring managers to refine job requisitions and candidate evaluation rubrics.'
    ],
    requirements: [
      '3+ years technical recruiting experience in high-growth software companies.',
      'Deep understanding of engineering concepts (frontend architectures, distributed systems, cloud services).',
      'Pragmatic approach to structured interviews, fair compensation benchmarking, and talent pipelines.',
      'High emotional intelligence with polished negotiation and closing skills.'
    ],
    benefits: [
      'Comprehensive health and life insurance.',
      'Mental wellness subscriptions and paid rest days.',
      'Central Mumbai office in Bandra Kurla Complex (BKC).',
      'Performance bonuses based on hiring quality and retention.'
    ],
    resumeFormats: ['.pdf', '.docx'],
    questions: [
      {
        id: 'q-tr-1',
        label: 'What is your preferred sourcing strategy for passive senior engineering candidates?',
        kind: 'long_text',
        required: true
      },
      {
        id: 'q-tr-2',
        label: 'Average number of hires closed per quarter in your previous role',
        kind: 'text',
        required: true
      }
    ]
  },
  {
    id: 'job-pd',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (India)',
    salaryRange: '₹14L–₹20L / yr',
    employmentType: 'Full-time',
    status: 'Open',
    postedDateDisplay: 'Posted Oct 16',
    createdAt: '2026-10-16T14:00:00Z',
    minExperience: 4.0,
    mandatorySkills: ['Figma', 'Design Systems', 'User Research', 'Editorial Typography', 'Prototyping'],
    minEducation: 'Bachelor',
    description: 'We are seeking an editorial, systems-minded Product Designer to lead core candidate evaluation workflows, design token architectures, and responsive interfaces for HirePulse.',
    responsibilities: [
      'Craft calm, restrained interfaces adhering to strict 1px hairline border rules and typography hierarchy.',
      'Synthesize user feedback and candidate friction points into high-fidelity interaction prototypes.',
      'Partner with frontend engineers to uphold the highest visual and interaction bar in production.',
      'Maintain and extend our design token architecture across web and mobile.'
    ],
    requirements: [
      '4+ years designing production web software or complex data-rich applications.',
      'Mastery of Figma, component libraries, typography scale, and micro-interaction ergonomics.',
      'Portfolio demonstrating strong visual craftsmanship, generous whitespace, and zero visual clutter.',
      'Deep understanding of accessible design standards (WCAG AA).'
    ],
    benefits: [
      '100% remote with asynchronous collaboration rituals.',
      '₹1,50,000 home office setup allowance + modern MacBook Pro.',
      'Annual team retreat at scenic locations.',
      'Generous equity grant with 4-year vesting.'
    ],
    resumeFormats: ['.pdf', '.docx'],
    questions: [
      {
        id: 'q-pd-1',
        label: 'Link to your design portfolio or case study',
        kind: 'text',
        required: true
      },
      {
        id: 'q-pd-2',
        label: 'Describe a design decision where you chose editorial restraint over decorative complexity',
        kind: 'long_text',
        required: true
      }
    ]
  },
  {
    id: 'job-fse',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Bengaluru, India (Hybrid)',
    salaryRange: '₹22L–₹32L / yr',
    employmentType: 'Full-time',
    status: 'Open',
    postedDateDisplay: 'Posted Oct 13',
    createdAt: '2026-10-13T09:30:00Z',
    minExperience: 5.0,
    mandatorySkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Architecture'],
    minEducation: 'Bachelor / B.Tech',
    description: 'Build fast, accessible, and resilient applicant tracking workflows and backend services. You will architect candidate evaluation tools, real-time kanban state, and automated resume screening engines.',
    responsibilities: [
      'Architect robust web applications with modern TypeScript, React, and modular backend endpoints.',
      'Optimize relational database indexing, event streams, and sub-second rendering performance.',
      'Collaborate closely with design to translate typographic specs into responsive web components.',
      'Uphold high code quality, automated test coverage, and clear technical documentation.'
    ],
    requirements: [
      '5+ years building and scaling production web applications.',
      'Strong grasp of semantic HTML, accessibility (WCAG AA), and modern CSS token architectures.',
      'Deep fluency with TypeScript, SQL optimization, and asynchronous event workflows.',
      'Pride in code craftsmanship, clean abstractions, and disciplined error handling.'
    ],
    benefits: [
      'Top-tier compensation with meaningful stock options.',
      'Comprehensive family healthcare coverage.',
      'Bengaluru tech hub office (Indiranagar) with chef-prepared meals and parking.',
      'Flexible hybrid schedule with remote Wednesdays and Fridays.'
    ],
    resumeFormats: ['.pdf', '.docx'],
    questions: [
      {
        id: 'q-fse-1',
        label: 'GitHub or personal website URL',
        kind: 'text',
        required: true
      },
      {
        id: 'q-fse-2',
        label: 'Describe a challenging database query optimization or state synchronization bug you fixed',
        kind: 'long_text',
        required: true
      },
      {
        id: 'q-fse-3',
        label: 'Are you based in Bengaluru or open to relocating for this hybrid role?',
        kind: 'yes_no',
        required: true
      }
    ]
  }
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-01',
    jobId: 'job-fse',
    stage: 'Interview',
    notes: 'Aced the system design round. Exceptional TypeScript depth. High recommendation from tech lead.',
    appliedAt: '2026-10-14T11:20:00Z',
    resumeName: 'Aarav_Sharma_Senior_FullStack.pdf',
    matchScore: 94,
    isSpam: false,
    isEligible: true,
    passedCriteria: [
      'Experience: 6.5 yrs meets required 5.0 yrs',
      'All mandatory core skills present (5/5)',
      'Education requirement met (B.Tech Computer Science)'
    ],
    missingCriteria: [],
    aiScreening: {
      matchScore: 94,
      isSpam: false,
      isEligible: true,
      passedCriteria: [
        'Experience: 6.5 yrs meets required 5.0 yrs',
        'All mandatory core skills present (5/5)',
        'Education requirement met (B.Tech Computer Science)'
      ],
      missingCriteria: [],
      strengths: 'Outstanding command of React, TypeScript, Node.js, and PostgreSQL with proven distributed systems track record.',
      concerns: 'No critical gaps identified. Highly competitive candidate.',
      topMatchingSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Architecture'],
      missingSkills: [],
      processedAt: '2026-10-14T12:00:00Z'
    },
    answers: [
      {
        questionId: 'q-fse-1',
        label: 'GitHub or personal website URL',
        answer: 'https://github.com/aarav-sharma-dev'
      },
      {
        questionId: 'q-fse-2',
        label: 'Describe a challenging database query optimization or state synchronization bug you fixed',
        answer: 'Optimized an applicant tracking pipeline query across 400k records by replacing correlated subqueries with recursive CTEs and covering composite indexes, reducing query execution latency from 1.8s down to 34ms.'
      },
      {
        questionId: 'q-fse-3',
        label: 'Are you based in Bengaluru or open to relocating for this hybrid role?',
        answer: 'Yes'
      }
    ],
    candidate: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@techlead.in',
      phone: '+91 98450 12345',
      headline: 'Lead Full-Stack Engineer & Systems Architect',
      location: 'Bengaluru, India',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Architecture', 'Docker'],
      experienceYears: 6.5,
      education: 'B.Tech Computer Science',
      workHistory: [
        {
          company: 'Zephyr Systems',
          role: 'Lead Full-Stack Engineer',
          from: '2022',
          to: 'Present',
          summary: 'Architected high-concurrency client trading interfaces with WebSockets and canvas rendering.'
        },
        {
          company: 'Cognitive Cloud',
          role: 'Senior Software Engineer',
          from: '2019',
          to: '2022',
          summary: 'Built microservices and API gateways handling 40M requests daily with 99.99% uptime.'
        }
      ]
    }
  },
  {
    id: 'app-02',
    jobId: 'job-pd',
    stage: 'Offer',
    notes: 'Unanimous team approval. Clean portfolio showing calm typography, design systems, and great user empathy.',
    appliedAt: '2026-10-17T09:45:00Z',
    resumeName: 'Ananya_Iyer_Product_Designer.pdf',
    matchScore: 92,
    isSpam: false,
    isEligible: true,
    passedCriteria: [
      'Experience: 5.2 yrs meets required 4.0 yrs',
      'All mandatory core skills present (5/5)',
      'Education requirement met (Bachelor in Design)'
    ],
    missingCriteria: [],
    aiScreening: {
      matchScore: 92,
      isSpam: false,
      isEligible: true,
      passedCriteria: [
        'Experience: 5.2 yrs meets required 4.0 yrs',
        'All mandatory core skills present (5/5)',
        'Education requirement met (Bachelor in Design)'
      ],
      missingCriteria: [],
      strengths: 'Deep mastery of editorial typography, Figma design token architectures, and accessible form design.',
      concerns: 'Leans slightly more toward web layouts than native mobile, but very adaptable.',
      topMatchingSkills: ['Figma', 'Design Systems', 'Editorial Typography', 'User Research', 'Prototyping'],
      missingSkills: [],
      processedAt: '2026-10-17T10:15:00Z'
    },
    answers: [
      {
        questionId: 'q-pd-1',
        label: 'Link to your design portfolio or case study',
        answer: 'https://ananyaiyer.design'
      },
      {
        questionId: 'q-pd-2',
        label: 'Describe a design decision where you chose editorial restraint over decorative complexity',
        answer: 'Redesigned a SaaS analytics dashboard by stripping all gradients, drop shadows, and neon cards down to hairline 1px borders and Newsreader serif numbers. Users reported 40% less eye fatigue and data comprehension speed jumped 30%.'
      }
    ],
    candidate: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@creativestudio.in',
      phone: '+91 98201 88321',
      headline: 'Senior Product Designer & Design System Specialist',
      location: 'Remote (India)',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skills: ['Figma', 'Design Systems', 'Editorial Typography', 'Prototyping', 'WCAG AA', 'User Research'],
      experienceYears: 5.2,
      education: 'Bachelor of Design (B.Des)',
      workHistory: [
        {
          company: 'Prism Labs',
          role: 'Senior Product Designer',
          from: '2022',
          to: 'Present',
          summary: 'Led the multi-platform design system spanning web, iOS, and Figma plugins.'
        },
        {
          company: 'Aura Interactive',
          role: 'UI/UX Designer',
          from: '2020',
          to: '2022',
          summary: 'Crafted responsive customer portals and accessible onboarding experiences.'
        }
      ]
    }
  },
  {
    id: 'app-03',
    jobId: 'job-da',
    stage: 'Interview',
    notes: 'Strong Python and SQL live challenge. High attention to statistical nuance.',
    appliedAt: '2026-10-23T14:10:00Z',
    resumeName: 'Rohan_Kulkarni_Data_Analyst.pdf',
    matchScore: 88,
    isSpam: false,
    isEligible: true,
    passedCriteria: [
      'Experience: 3.5 yrs meets required 2.5 yrs',
      'All mandatory core skills present (4/4)',
      'Education requirement met (B.Sc Statistics)'
    ],
    missingCriteria: [],
    aiScreening: {
      matchScore: 88,
      isSpam: false,
      isEligible: true,
      passedCriteria: [
        'Experience: 3.5 yrs meets required 2.5 yrs',
        'All mandatory core skills present (4/4)',
        'Education requirement met (B.Sc Statistics)'
      ],
      missingCriteria: [],
      strengths: 'Strong statistical foundations in SQL, Pandas, and cohort retention modeling.',
      concerns: 'Tableau experience is solid; PowerBI exposure is moderate.',
      topMatchingSkills: ['SQL', 'Python / Pandas', 'Tableau / PowerBI', 'Cohort Analysis'],
      missingSkills: [],
      processedAt: '2026-10-23T15:00:00Z'
    },
    answers: [
      {
        questionId: 'q-da-1',
        label: 'Link to a public GitHub repo or analytics case study project',
        answer: 'https://github.com/rohan-k-analytics/saas-retention-cohorts'
      },
      {
        questionId: 'q-da-2',
        label: 'Explain the difference between a window function and a standard group-by aggregate',
        answer: 'A GROUP BY collapses individual rows into a single aggregated row per key. A window function performs calculation across a defined set of rows related to the current row without collapsing them, preserving row-level granularity.'
      }
    ],
    candidate: {
      name: 'Rohan Kulkarni',
      email: 'rohan.kulkarni@databridge.io',
      phone: '+91 97654 32109',
      headline: 'Data Analyst & Quantitative Modeler',
      location: 'Pune, India',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      skills: ['SQL', 'Python / Pandas', 'Tableau / PowerBI', 'Cohort Analysis', 'Snowflake', 'Statistics'],
      experienceYears: 3.5,
      education: 'B.Sc Statistics & Computer Applications',
      workHistory: [
        {
          company: 'MetricPulse Analytics',
          role: 'Data Analyst',
          from: '2022',
          to: 'Present',
          summary: 'Developed executive dashboards tracking churn, CAC payback, and customer cohorts.'
        }
      ]
    }
  },
  {
    id: 'app-04',
    jobId: 'job-csm',
    stage: 'Screening',
    notes: 'Recruiter screen scheduled with Maya. Good communication and customer empathy.',
    appliedAt: '2026-10-26T16:30:00Z',
    resumeName: 'Pooja_Mehta_CSM_Lead.pdf',
    matchScore: 86,
    isSpam: false,
    isEligible: true,
    passedCriteria: [
      'Experience: 4.0 yrs meets required 3.0 yrs',
      'All mandatory core skills present (4/4)',
      'Education requirement met (Bachelor in Business)'
    ],
    missingCriteria: [],
    aiScreening: {
      matchScore: 86,
      isSpam: false,
      isEligible: true,
      passedCriteria: [
        'Experience: 4.0 yrs meets required 3.0 yrs',
        'All mandatory core skills present (4/4)',
        'Education requirement met (Bachelor in Business)'
      ],
      missingCriteria: [],
      strengths: 'Proven track record in SaaS retention, proactive QBR facilitation, and Zendesk administration.',
      concerns: 'Slightly less exposure to enterprise API troubleshooting.',
      topMatchingSkills: ['Customer Retention', 'SaaS Onboarding', 'Zendesk / CRM', 'Account Health'],
      missingSkills: [],
      processedAt: '2026-10-26T17:00:00Z'
    },
    answers: [
      {
        questionId: 'q-csm-1',
        label: 'Describe a scenario where you rescued an at-risk enterprise customer from churning',
        answer: 'Identified a dip in daily active users for a fintech client. Traveled to their Gurgaon office for an on-site training workshop, re-aligned workflows with their new VP of Ops, and secured a 2-year contract extension.'
      },
      {
        questionId: 'q-csm-2',
        label: 'What customer health metrics do you prioritize in daily account tracking?',
        answer: 'Product adoption depth, time-to-first-value, open support ticket severity, and executive stakeholder engagement frequency.'
      },
      {
        questionId: 'q-csm-3',
        label: 'Are you based in Delhi NCR or open to working from our Delhi hub?',
        answer: 'Yes'
      }
    ],
    candidate: {
      name: 'Pooja Mehta',
      email: 'pooja.mehta@nexusgrowth.com',
      phone: '+91 99100 44556',
      headline: 'Customer Success Manager & Enterprise Account Lead',
      location: 'Delhi, India',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      skills: ['Customer Retention', 'SaaS Onboarding', 'Zendesk / CRM', 'Account Health', 'Executive QBRs'],
      experienceYears: 4.0,
      education: 'Bachelor of Business Administration',
      workHistory: [
        {
          company: 'CloudMatrix Technologies',
          role: 'Customer Success Specialist',
          from: '2022',
          to: 'Present',
          summary: 'Managed a $2.4M ARR portfolio with 96% annual net revenue retention.'
        }
      ]
    }
  },
  {
    id: 'app-05',
    jobId: 'job-tr',
    stage: 'Interview',
    notes: 'Strong technical sourcing candidate. Very articulate about developer empathy and pipeline velocity.',
    appliedAt: '2026-10-20T10:15:00Z',
    resumeName: 'Kunal_Verma_Recruiter.pdf',
    matchScore: 89,
    isSpam: false,
    isEligible: true,
    passedCriteria: [
      'Experience: 3.8 yrs meets required 3.0 yrs',
      'All mandatory core skills present (4/4)',
      'Education requirement met (Bachelor in Human Resources)'
    ],
    missingCriteria: [],
    aiScreening: {
      matchScore: 89,
      isSpam: false,
      isEligible: true,
      passedCriteria: [
        'Experience: 3.8 yrs meets required 3.0 yrs',
        'All mandatory core skills present (4/4)',
        'Education requirement met (Bachelor in Human Resources)'
      ],
      missingCriteria: [],
      strengths: 'Deep sourcing expertise across LinkedIn Recruiter, GitHub, and tech communities; structured rubric discipline.',
      concerns: 'Notice period is 30 days.',
      topMatchingSkills: ['Full-lifecycle Recruiting', 'Tech Sourcing', 'Candidate Experience', 'ATS Management'],
      missingSkills: [],
      processedAt: '2026-10-20T11:00:00Z'
    },
    answers: [
      {
        questionId: 'q-tr-1',
        label: 'What is your preferred sourcing strategy for passive senior engineering candidates?',
        answer: 'Researching open-source contributions on GitHub, personalized outreach referencing specific pull requests or architecture blogs, and leveraging technical alumni networks.'
      },
      {
        questionId: 'q-tr-2',
        label: 'Average number of hires closed per quarter in your previous role',
        answer: 'Closed an average of 7-9 high-bar engineering hires per quarter across backend and infrastructure pods.'
      }
    ],
    candidate: {
      name: 'Kunal Verma',
      email: 'kunal.verma@talentpulse.in',
      phone: '+91 98199 77889',
      headline: 'Senior Technical Talent Partner',
      location: 'Mumbai, India',
      imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      skills: ['Full-lifecycle Recruiting', 'Tech Sourcing', 'Candidate Experience', 'ATS Management', 'Compensation Bands'],
      experienceYears: 3.8,
      education: 'Bachelor in Human Resources',
      workHistory: [
        {
          company: 'Veloce Talent Partners',
          role: 'Technical Recruiter',
          from: '2021',
          to: 'Present',
          summary: 'Scaled engineering team from 30 to 110 engineers in 18 months.'
        }
      ]
    }
  },
  {
    id: 'app-06',
    jobId: 'job-fse',
    stage: 'Rejected',
    notes: '[Ineligible] Candidate has 1.2 years experience, below the required 5.0 years minimum threshold.',
    appliedAt: '2026-10-28T09:00:00Z',
    resumeName: 'Vikram_Singh_Junior_Web.pdf',
    matchScore: 35,
    isSpam: false,
    isEligible: false,
    passedCriteria: ['Mandatory core skills partially matched (3/5)'],
    missingCriteria: ['Requires at least 5.0 yrs experience (found 1.2 yrs)'],
    aiScreening: {
      matchScore: 35,
      isSpam: false,
      isEligible: false,
      passedCriteria: ['Mandatory core skills partially matched (3/5)'],
      missingCriteria: ['Requires at least 5.0 yrs experience (found 1.2 yrs)'],
      strengths: 'Energetic junior developer with foundational React exposure.',
      concerns: 'Does not satisfy non-negotiable minimum 5 years seniority requirement for this lead role.',
      topMatchingSkills: ['React', 'TypeScript'],
      missingSkills: ['System Architecture', 'PostgreSQL'],
      processedAt: '2026-10-28T09:30:00Z'
    },
    answers: [
      {
        questionId: 'q-fse-1',
        label: 'GitHub or personal website URL',
        answer: 'https://github.com/vikram-dev'
      },
      {
        questionId: 'q-fse-2',
        label: 'Describe a challenging database query optimization or state synchronization bug you fixed',
        answer: 'Built a simple to-do app with localStorage.'
      },
      {
        questionId: 'q-fse-3',
        label: 'Are you based in Bengaluru or open to relocating for this hybrid role?',
        answer: 'Yes'
      }
    ],
    candidate: {
      name: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      phone: '+91 98765 00112',
      headline: 'Junior Web Developer',
      location: 'Bengaluru, India',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      experienceYears: 1.2,
      education: 'B.Tech IT',
      workHistory: [
        {
          company: 'Starter App Studio',
          role: 'Junior Frontend Intern',
          from: '2024',
          to: 'Present',
          summary: 'Assisted in building responsive landing pages.'
        }
      ]
    }
  }
];

export const SEED_INTERVIEWS: Interview[] = [
  {
    id: 'int-01',
    applicationId: 'app-01',
    round: 'Final Architecture & Pairing Interview',
    scheduledAt: '2026-11-06T15:00:00Z',
    interviewer: 'David Chen (Staff Platform Architect)',
    location: 'Google Meet (meet.google.com/hpr-fse-pair)'
  },
  {
    id: 'int-02',
    applicationId: 'app-03',
    round: 'SQL & Data Modeling Deep Dive',
    scheduledAt: '2026-11-07T11:00:00Z',
    interviewer: 'Sneha Patel (Head of Analytics)',
    location: 'Google Meet (meet.google.com/hpr-data-pune)'
  },
  {
    id: 'int-03',
    applicationId: 'app-05',
    round: 'Talent Strategy & Culture Calibration',
    scheduledAt: '2026-11-08T14:30:00Z',
    interviewer: 'Jordan Kelly (VP People Operations)',
    location: 'Mumbai BKC Room 3B'
  }
];

export const SEED_SCORECARDS: Scorecard[] = [
  {
    id: 'sc-01',
    applicationId: 'app-01',
    reviewer: 'David Chen (Staff Platform Architect)',
    technical: 5,
    culture: 5,
    communication: 5,
    feedback: 'Aarav demonstrated exceptional clarity explaining database connection pooling and optimistic concurrency in React. Top tier engineer.',
    submittedAt: '2026-10-24T18:00:00Z'
  },
  {
    id: 'sc-02',
    applicationId: 'app-02',
    reviewer: 'Claire Beaumont (VP Design)',
    technical: 5,
    culture: 5,
    communication: 5,
    feedback: 'Ananya embodies calm editorial design craft. Her design system philosophy and token architecture are world class. Immediate hire recommendation.',
    submittedAt: '2026-10-25T11:00:00Z'
  }
];
