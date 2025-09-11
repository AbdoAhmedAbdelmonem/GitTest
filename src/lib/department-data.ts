export interface Subject {
  id: string
  name: string
  description: string
  creditHours: number
  code: string
  prerequisites?: string[]
  materials: {
    lectures?: string
    sections?: string
    videos?: string
    quizzes?: {
      id: string
      name: string
      code: string
      duration: string | number
      questions: number
      jsonFile: string
    }[]
    exams?: string
  }
}

export interface Level {
  subjects: {
    term1: Subject[]
    term2: Subject[]
  }
}

export interface Department {
  name: string
  description: string
  levels: {
    [key: number]: Level
  }
}


export const departmentData: { [key: string]: Department } = {
  "computing-data-sciences": {
    name: "Computing and Data Sciences",
    description: "Advanced computing and data science methodologies for modern analytics",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for data science applications",
              creditHours: 3,
              prerequisites: [],
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/linear-algebra-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-videos",
                exams: "hhttps://drive.google.com/drive/folders/1aEMvu3ck662mv9UxoIJx0sXg5aXYZGT8?usp=drive_link",
              },
            },
            {
              id: "calculus",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with applications in computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-sections",
                videos: "https://youtube.com/playlist?list=calculus-videos",
                exams: "https://drive.google.com/drive/folders/calculus-lastexam",

              },
            },
            {
              id: "intro-computer-systems",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Fundamentals of computer architecture and system organization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-videos",
              },
            },
            {
              id: "intro-data-sciences",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Overview of data science concepts, tools, and methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-videos",
              },
            },
            {
              id: "programming-1",
              name: "Programming I",
              code: "02-24-00105",
              description: "Introduction to programming concepts and problem-solving techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-sections",
                videos: "https://youtube.com/playlist?list=programming-1-videos",
                quizzes: [
                  {
                    id: "PR1_30001",
                    name: "Chapter 1 : Introduction to Programming",
                    code: "PR1_30001",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30001.json"
                  },
                  {
                    id: "PR1_30002",
                    name: "Chapter 2-1 : Introduction to Java Programming",
                    code: "PR1_30002",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30002.json"
                  },
                  {
                    id: "PR1_30003",
                    name: "Chapter 2-2 : Java Basics",
                    code: "PR1_30003",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30003.json"
                  },
                  {
                    id: "PR1_30004",
                    name: "Chapter 2-3 : Java Basics",
                    code: "PR1_30004",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30004.json"
                  },
                  {
                    id: "PR1_30005",
                    name: "Chapter 2-4 : Deep Dive into Java",
                    code: "PR1_30005",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30005.json"
                  },
                  {
                    id: "PR1_30006",
                    name: "Chapter 3-1 : Controlling Program Flow",
                    code: "PR1_30006",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30006.json"
                  },
                  {
                    id: "PR1_30007",
                    name: "Chapter 3-2 : Controlling Program Flow",
                    code: "PR1_30007",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30007.json"
                  },
                  {
                    id: "PR1_30008",
                    name: "Chapter 4-1 : One Dimensional Arrays",
                    code: "PR1_30008",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30008.json"
                  },
                  {
                    id: "PR1_30009",
                    name: "Chapter 4-2 : Multi Dimensional Arrays",
                    code: "PR1_30009",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30009.json"
                  },
                  {
                    id: "PR1_30010",
                    name: "Review 1",
                    code: "PR1_30010",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30010.json"
                  },
                  {
                    id: "PR1_30011",
                    name: "Review 2",
                    code: "PR1_30011",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30011.json"
                  },
                  {
                    id: "PR1_30012",
                    name: "Tracing and Debugging",
                    code: "PR1_30012",
                    duration: "No Timer", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30012.json"
                  },
                ],
              
              },
            },
            {
              id: "critical-thinking",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Development of analytical and critical thinking skills",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-videos",
              },
            },
            {
              id: "discrete-structures",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-videos",
              },
            },
            {
              id: "data-structures-algorithms",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-videos",
              },
            },
            {
              id: "intro-artificial-intelligence",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-videos",
              },
            },
            {
              id: "programming-2",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-sections",
                videos: "https://youtube.com/playlist?list=programming-2-videos",
              },
            },
            {
              id: "innovation-entrepreneurship",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-videos",
              },
            },
            {
              id: "intro-databases",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-videos",
              },
            },
            {
              id: "numerical-computations",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-videos",
              },
            },
            {
              id: "advanced-calculus",
              name: "Advanced Calculus",
              code: "02-24-01201",
              description: "Multivariable calculus and advanced mathematical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/advanced-calculus-lectures",
                sections: "https://drive.google.com/drive/folders/advanced-calculus-sections",
                videos: "https://youtube.com/playlist?list=advanced-calculus-videos",
              },
            },
            {
              id: "data-science-methodology",
              name: "Data Science Methodology",
              code: "02-24-01202",
              description: "Systematic approaches to data science projects and research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-science-methodology-lectures",
                sections: "https://drive.google.com/drive/folders/data-science-methodology-sections",
                videos: "https://youtube.com/playlist?list=data-science-methodology-videos",
              },
            },
            {
              id: "university-elective-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-sections",
                videos: "https://youtube.com/playlist?list=university-elective-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-videos",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "No Timer", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "No Timer",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "No Timer",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
              
            },
            {
              id: "machine-learning",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-videos",
              },
            },
            {
              id: "data-mining-analytics",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-videos",
              },
            },
            {
              id: "data-science-tools-software",
              name: "Data Science Tools and Software",
              code: "02-24-01203",
              description: "Practical tools and software for data science workflows",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-science-tools-lectures",
                sections: "https://drive.google.com/drive/folders/data-science-tools-sections",
                videos: "https://youtube.com/playlist?list=data-science-tools-videos",
              },
            },
            {
              id: "regression-analysis",
              name: "Regression Analysis",
              code: "02-24-01204",
              description: "Linear and nonlinear regression modeling techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/regression-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/regression-analysis-sections",
                videos: "https://youtube.com/playlist?list=regression-analysis-videos",
              },
            },
            {
              id: "university-elective-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "stochastic-processes",
              name: "Stochastic Processes",
              code: "02-24-01301",
              description: "Random processes and their applications in data science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/stochastic-processes-lectures",
                sections: "https://drive.google.com/drive/folders/stochastic-processes-sections",
                videos: "https://youtube.com/playlist?list=stochastic-processes-videos",
              },
            },
            {
              id: "design-analysis-experiments",
              name: "Design and Analysis of Experiments",
              code: "02-24-01302",
              description: "Experimental design principles and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/design-analysis-experiments-lectures",
                sections: "https://drive.google.com/drive/folders/design-analysis-experiments-sections",
                videos: "https://youtube.com/playlist?list=design-analysis-experiments-videos",
              },
            },
            {
              id: "data-visualization-tools",
              name: "Data Visualization Tools",
              code: "02-24-01303",
              description: "Tools and techniques for effective data visualization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-visualization-tools-lectures",
                sections: "https://drive.google.com/drive/folders/data-visualization-tools-sections",
                videos: "https://youtube.com/playlist?list=data-visualization-tools-videos",
              },
            },
            {
              id: "faculty-elective-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized elective from faculty offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-1-videos",
              },
            },
            {
              id: "faculty-elective-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized elective from faculty offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-2-videos",
              },
            },
            {
              id: "university-elective-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "data-computation-analysis",
              name: "Data Computation and Analysis",
              code: "02-24-01304",
              description: "Advanced computational methods for data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-computation-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/data-computation-analysis-sections",
                videos: "https://youtube.com/playlist?list=data-computation-analysis-videos",
              },
            },
            {
              id: "survey-methodology",
              name: "Survey Methodology",
              code: "02-24-01305",
              description: "Design and implementation of survey research methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/survey-methodology-lectures",
                sections: "https://drive.google.com/drive/folders/survey-methodology-sections",
                videos: "https://youtube.com/playlist?list=survey-methodology-videos",
              },
            },
            {
              id: "computing-intensive-statistical-methods",
              name: "Computing Intensive Statistical Methods",
              code: "02-24-01306",
              description: "Computational approaches to complex statistical problems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computing-intensive-statistical-lectures",
                sections: "https://drive.google.com/drive/folders/computing-intensive-statistical-sections",
                videos: "https://youtube.com/playlist?list=computing-intensive-statistical-videos",
              },
            },
            {
              id: "faculty-elective-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized elective from faculty offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-3-videos",
              },
            },
            {
              id: "faculty-elective-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized elective from faculty offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "big-data-analytics",
              name: "Big Data Analytics",
              code: "02-24-01401",
              description: "Processing and analyzing large-scale datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/big-data-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/big-data-analytics-sections",
                videos: "https://youtube.com/playlist?list=big-data-analytics-videos",
              },
            },
            {
              id: "intro-social-networks",
              name: "Introduction to Social Networks",
              code: "02-24-01402",
              description: "Analysis of social network structures and dynamics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-social-networks-lectures",
                sections: "https://drive.google.com/drive/folders/intro-social-networks-sections",
                videos: "https://youtube.com/playlist?list=intro-social-networks-videos",
              },
            },
            {
              id: "simulations",
              name: "Simulations",
              code: "02-24-01403",
              description: "Monte Carlo methods and simulation techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/simulations-lectures",
                sections: "https://drive.google.com/drive/folders/simulations-sections",
                videos: "https://youtube.com/playlist?list=simulations-videos",
              },
            },
            {
              id: "program-elective-1",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-1-videos",
              },
            },
            {
              id: "program-elective-2",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-2-videos",
              },
            },
            {
              id: "university-elective-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "social-data-analytics",
              name: "Social Data Analytics",
              code: "02-24-01405",
              description: "Analysis of social media and behavioral data",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-data-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/social-data-analytics-sections",
                videos: "https://youtube.com/playlist?list=social-data-analytics-videos",
              },
            },
            {
              id: "distributed-data-analysis",
              name: "Distributed Data Analysis",
              code: "02-24-01406",
              description: "Parallel and distributed computing for data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/distributed-data-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/distributed-data-analysis-sections",
                videos: "https://youtube.com/playlist?list=distributed-data-analysis-videos",
              },
            },
            {
              id: "stream-processing",
              name: "Stream Processing",
              code: "02-24-01407",
              description: "Real-time data processing and streaming analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/stream-processing-lectures",
                sections: "https://drive.google.com/drive/folders/stream-processing-sections",
                videos: "https://youtube.com/playlist?list=stream-processing-videos",
              },
            },
            {
              id: "program-elective-3",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-3-videos",
              },
            },
            {
              id: "program-elective-4",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-4-videos",
              },
            },
            {
              id: "university-elective-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "business-analytics": {
    name: "Business Analytics",
    description: "Data-driven business intelligence and analytics for strategic decision making",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-ba",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-ba-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-ba-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-ba-videos",
              },
            },
            {
              id: "calculus-ba",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with business applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-ba-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-ba-sections",
                videos: "https://youtube.com/playlist?list=calculus-ba-videos",
              },
            },
            {
              id: "intro-computer-systems-ba",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems fundamentals for business applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-ba-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-ba-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-ba-videos",
              },
            },
            {
              id: "intro-data-sciences-ba",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-ba-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-ba-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-ba-videos",
              },
            },
            {
              id: "programming-1-ba",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-ba-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-ba-sections",
                videos: "https://youtube.com/playlist?list=programming-1-ba-videos",
              },
            },
            {
              id: "critical-thinking-ba",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking skills for business decision making",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-ba-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-ba-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-ba-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-ba",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Statistical foundations for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-ba-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-ba-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-ba-videos",
              },
            },
            {
              id: "discrete-structures-ba",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures for business computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-ba-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-ba-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-ba-videos",
              },
            },
            {
              id: "data-structures-algorithms-ba",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Data structures and algorithms for business applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-ba-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-ba-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-ba-videos",
              },
            },
            {
              id: "intro-artificial-intelligence-ba",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "AI concepts and applications in business",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-ba-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-ba-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-ba-videos",
              },
            },
            {
              id: "programming-2-ba",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-ba-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-ba-sections",
                videos: "https://youtube.com/playlist?list=programming-2-ba-videos",
              },
            },
            {
              id: "innovation-entrepreneurship-ba",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Innovation and entrepreneurship in business analytics",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-ba-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-ba-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-ba-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-ba",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-ba-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-ba-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-ba-videos",
              },
            },
            {
              id: "intro-databases-ba",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database systems for business applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-ba-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-ba-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-ba-videos",
              },
            },
            {
              id: "numerical-computations-ba",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for business problem solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-ba-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-ba-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-ba-videos",
              },
            },
            {
              id: "intro-business",
              name: "Introduction to Business",
              code: "02-24-02201",
              description: "Fundamentals of business operations and management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-business-lectures",
                sections: "https://drive.google.com/drive/folders/intro-business-sections",
                videos: "https://youtube.com/playlist?list=intro-business-videos",
              },
            },
            {
              id: "accounting-information-systems",
              name: "Accounting as an Information Systems",
              code: "02-24-02202",
              description: "Accounting principles and information systems integration",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/accounting-information-systems-lectures",
                sections: "https://drive.google.com/drive/folders/accounting-information-systems-sections",
                videos: "https://youtube.com/playlist?list=accounting-information-systems-videos",
              },
            },
            {
              id: "university-elective-ba-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-ba",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms and services for business analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-ba-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-ba-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-ba-videos",
              },
            },
            {
              id: "machine-learning-ba",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Machine learning applications in business",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-ba-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-ba-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-ba-videos",
              },
            },
            {
              id: "data-mining-analytics-ba",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Data mining techniques for business insights",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-ba-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-ba-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-ba-videos",
              },
            },
            {
              id: "system-analysis-design",
              name: "System Analysis & Design",
              code: "02-24-02203",
              description: "Business system analysis and design methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/system-analysis-design-lectures",
                sections: "https://drive.google.com/drive/folders/system-analysis-design-sections",
                videos: "https://youtube.com/playlist?list=system-analysis-design-videos",
              },
            },
            {
              id: "financial-planning-analysis",
              name: "Financial Planning and Analysis",
              code: "02-24-02204",
              description: "Financial planning and analytical techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/financial-planning-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/financial-planning-analysis-sections",
                videos: "https://youtube.com/playlist?list=financial-planning-analysis-videos",
              },
            },
            {
              id: "university-elective-ba-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "business-process-modeling",
              name: "Business Process Modeling and Integration",
              code: "02-24-02301",
              description: "Business process analysis and integration strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/business-process-modeling-lectures",
                sections: "https://drive.google.com/drive/folders/business-process-modeling-sections",
                videos: "https://youtube.com/playlist?list=business-process-modeling-videos",
              },
            },
            {
              id: "quantitative-analysis",
              name: "Quantitative Analysis",
              code: "02-24-02302",
              description: "Quantitative methods for business decision making",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/quantitative-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/quantitative-analysis-sections",
                videos: "https://youtube.com/playlist?list=quantitative-analysis-videos",
              },
            },
            {
              id: "data-warehousing-bi",
              name: "Data Warehousing & Business Intelligence",
              code: "02-24-02303",
              description: "Data warehousing and business intelligence systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-warehousing-bi-lectures",
                sections: "https://drive.google.com/drive/folders/data-warehousing-bi-sections",
                videos: "https://youtube.com/playlist?list=data-warehousing-bi-videos",
              },
            },
            {
              id: "faculty-elective-ba-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-1-videos",
              },
            },
            {
              id: "faculty-elective-ba-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-2-videos",
              },
            },
            {
              id: "university-elective-ba-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "data-visualization-ba",
              name: "Data Visualization",
              code: "02-24-02304",
              description: "Advanced data visualization techniques for business",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-visualization-ba-lectures",
                sections: "https://drive.google.com/drive/folders/data-visualization-ba-sections",
                videos: "https://youtube.com/playlist?list=data-visualization-ba-videos",
              },
            },
            {
              id: "enterprise-information-systems",
              name: "Enterprise Information Systems",
              code: "02-24-02305",
              description: "Enterprise-level information system design and management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/enterprise-information-systems-lectures",
                sections: "https://drive.google.com/drive/folders/enterprise-information-systems-sections",
                videos: "https://youtube.com/playlist?list=enterprise-information-systems-videos",
              },
            },
            {
              id: "data-driven-marketing",
              name: "Data Driven Marketing",
              code: "02-24-02306",
              description: "Marketing analytics and data-driven marketing strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-driven-marketing-lectures",
                sections: "https://drive.google.com/drive/folders/data-driven-marketing-sections",
                videos: "https://youtube.com/playlist?list=data-driven-marketing-videos",
              },
            },
            {
              id: "faculty-elective-ba-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-3-videos",
              },
            },
            {
              id: "faculty-elective-ba-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "leadership-people-analytics",
              name: "Leadership and People Analytics",
              code: "02-24-02401",
              description: "Analytics for human resources and leadership development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/leadership-people-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/leadership-people-analytics-sections",
                videos: "https://youtube.com/playlist?list=leadership-people-analytics-videos",
              },
            },
            {
              id: "data-it-governance",
              name: "Data and IT Governance",
              code: "02-24-02402",
              description: "Governance frameworks for data and IT management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-it-governance-lectures",
                sections: "https://drive.google.com/drive/folders/data-it-governance-sections",
                videos: "https://youtube.com/playlist?list=data-it-governance-videos",
              },
            },
            {
              id: "information-retrieval",
              name: "Information Retrieval",
              code: "02-24-02403",
              description: "Information retrieval systems and search technologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/information-retrieval-lectures",
                sections: "https://drive.google.com/drive/folders/information-retrieval-sections",
                videos: "https://youtube.com/playlist?list=information-retrieval-videos",
              },
            },
            {
              id: "program-elective-ba-1",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-1-videos",
              },
            },
            {
              id: "program-elective-ba-2",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-2-videos",
              },
            },
            {
              id: "university-elective-ba-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "text-social-media-mining",
              name: "Text and Social Media Mining",
              code: "02-24-02405",
              description: "Mining and analysis of text and social media data",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/text-social-media-mining-lectures",
                sections: "https://drive.google.com/drive/folders/text-social-media-mining-sections",
                videos: "https://youtube.com/playlist?list=text-social-media-mining-videos",
              },
            },
            {
              id: "logistics-supply-chain-analytics",
              name: "Logistics and Supply Chain Analytics",
              code: "02-24-02406",
              description: "Analytics for logistics and supply chain optimization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-sections",
                videos: "https://youtube.com/playlist?list=logistics-supply-chain-analytics-videos",
              },
            },
            {
              id: "it-laws-ethics",
              name: "Information Technology Laws and Ethics",
              code: "02-24-02407",
              description: "Legal and ethical aspects of information technology",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/it-laws-ethics-lectures",
                sections: "https://drive.google.com/drive/folders/it-laws-ethics-sections",
                videos: "https://youtube.com/playlist?list=it-laws-ethics-videos",
              },
            },
            {
              id: "program-elective-ba-3",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-3-videos",
              },
            },
            {
              id: "program-elective-ba-4",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-4-videos",
              },
            },
            {
              id: "university-elective-ba-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "artificial-intelligence": {
    name: "Intelligent Systems",
    description: "Advanced AI systems, machine learning, and intelligent automation technologies",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-is",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-is-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-is-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-is-videos",
              },
            },
            {
              id: "calculus-is",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus for AI and intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-is-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-is-sections",
                videos: "https://youtube.com/playlist?list=calculus-is-videos",
              },
            },
            {
              id: "intro-computer-systems-is",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems for intelligent applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-is-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-is-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-is-videos",
              },
            },
            {
              id: "intro-data-sciences-is",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science foundations for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-is-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-is-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-is-videos",
              },
            },
            {
              id: "programming-1-is",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-is-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-is-sections",
                videos: "https://youtube.com/playlist?list=programming-1-is-videos",
              },
            },
            {
              id: "critical-thinking-is",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking for AI and intelligent systems",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-is-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-is-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-is-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-is",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Statistical foundations for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-is-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-is-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-is-videos",
              },
            },
            {
              id: "discrete-structures-is",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-is-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-is-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-is-videos",
              },
            },
            {
              id: "data-structures-algorithms-is",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Data structures and algorithms for AI applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-is-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-is-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-is-videos",
              },
            },
            {
              id: "intro-artificial-intelligence-is",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Comprehensive introduction to AI concepts and techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-is-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-is-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-is-videos",
              },
            },
            {
              id: "programming-2-is",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-is-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-is-sections",
                videos: "https://youtube.com/playlist?list=programming-2-is-videos",
              },
            },
            {
              id: "innovation-entrepreneurship-is",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Innovation in intelligent systems and AI entrepreneurship",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-is-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-is-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-is-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-is",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistics for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-is-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-is-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-is-videos",
              },
            },
            {
              id: "intro-databases-is",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database systems for intelligent applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-is-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-is-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-is-videos",
              },
            },
            {
              id: "numerical-computations-is",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-is-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-is-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-is-videos",
              },
            },
            {
              id: "smart-systems-computational-intelligence",
              name: "Smart Systems and Computational Intelligence",
              code: "02-24-03201",
              description: "Intelligent systems design and computational intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/smart-systems-computational-intelligence-lectures",
                sections: "https://drive.google.com/drive/folders/smart-systems-computational-intelligence-sections",
                videos: "https://youtube.com/playlist?list=smart-systems-computational-intelligence-videos",
              },
            },
            {
              id: "operations-research",
              name: "Operations Research",
              code: "02-24-03202",
              description: "Optimization techniques and operations research methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/operations-research-lectures",
                sections: "https://drive.google.com/drive/folders/operations-research-sections",
                videos: "https://youtube.com/playlist?list=operations-research-videos",
              },
            },
            {
              id: "university-elective-is-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-is",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms for intelligent systems deployment",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-is-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-is-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-is-videos",
              },
            },
            {
              id: "machine-learning-is",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Machine learning algorithms and applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-is-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-is-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-is-videos",
              },
            },
            {
              id: "data-mining-analytics-is",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Data mining techniques for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-is-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-is-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-is-videos",
              },
            },
            {
              id: "pattern-recognition",
              name: "Pattern Recognition",
              code: "02-24-03203",
              description: "Pattern recognition algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/pattern-recognition-lectures",
                sections: "https://drive.google.com/drive/folders/pattern-recognition-sections",
                videos: "https://youtube.com/playlist?list=pattern-recognition-videos",
              },
            },
            {
              id: "neural-networks",
              name: "Neural Networks",
              code: "02-24-03204",
              description: "Neural network architectures and training methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/neural-networks-lectures",
                sections: "https://drive.google.com/drive/folders/neural-networks-sections",
                videos: "https://youtube.com/playlist?list=neural-networks-videos",
              },
            },
            {
              id: "university-elective-is-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "intelligent-programming",
              name: "Intelligent Programming",
              code: "02-24-03301",
              description: "Programming techniques for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intelligent-programming-lectures",
                sections: "https://drive.google.com/drive/folders/intelligent-programming-sections",
                videos: "https://youtube.com/playlist?list=intelligent-programming-videos",
              },
            },
            {
              id: "deep-learning",
              name: "Deep Learning",
              code: "02-24-03302",
              description: "Deep neural networks and advanced architectures",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/deep-learning-lectures",
                sections: "https://drive.google.com/drive/folders/deep-learning-sections",
                videos: "https://youtube.com/playlist?list=deep-learning-videos",
              },
            },
            {
              id: "modern-control-systems",
              name: "Modern Control Systems",
              code: "02-24-03303",
              description: "Control theory for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/modern-control-systems-lectures",
                sections: "https://drive.google.com/drive/folders/modern-control-systems-sections",
                videos: "https://youtube.com/playlist?list=modern-control-systems-videos",
              },
            },
            {
              id: "faculty-elective-is-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-1-videos",
              },
            },
            {
              id: "faculty-elective-is-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-2-videos",
              },
            },
            {
              id: "university-elective-is-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "embedded-systems",
              name: "Embedded Systems",
              code: "02-24-03304",
              description: "Embedded systems for intelligent applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/embedded-systems-lectures",
                sections: "https://drive.google.com/drive/folders/embedded-systems-sections",
                videos: "https://youtube.com/playlist?list=embedded-systems-videos",
              },
            },
            {
              id: "computer-vision",
              name: "Computer Vision",
              code: "02-24-03305",
              description: "Computer vision algorithms and applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-vision-lectures",
                sections: "https://drive.google.com/drive/folders/computer-vision-sections",
                videos: "https://youtube.com/playlist?list=computer-vision-videos",
              },
            },
            {
              id: "ai-security-issues",
              name: "AI Security Issues",
              code: "02-24-03306",
              description: "Security challenges and solutions in AI systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-security-issues-lectures",
                sections: "https://drive.google.com/drive/folders/ai-security-issues-sections",
                videos: "https://youtube.com/playlist?list=ai-security-issues-videos",
              },
            },
            {
              id: "faculty-elective-is-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-3-videos",
              },
            },
            {
              id: "faculty-elective-is-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "ai-platforms",
              name: "AI Platforms",
              code: "02-24-03401",
              description: "AI development platforms and frameworks",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-platforms-lectures",
                sections: "https://drive.google.com/drive/folders/ai-platforms-sections",
                videos: "https://youtube.com/playlist?list=ai-platforms-videos",
              },
            },
            {
              id: "internet-of-things-1",
              name: "Internet of Things I",
              code: "02-24-03402",
              description: "IoT fundamentals and intelligent device integration",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/internet-of-things-1-lectures",
                sections: "https://drive.google.com/drive/folders/internet-of-things-1-sections",
                videos: "https://youtube.com/playlist?list=internet-of-things-1-videos",
              },
            },
            {
              id: "natural-language-processing-is",
              name: "Natural Language Processing",
              code: "02-24-03403",
              description: "NLP techniques for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/natural-language-processing-is-lectures",
                sections: "https://drive.google.com/drive/folders/natural-language-processing-is-sections",
                videos: "https://youtube.com/playlist?list=natural-language-processing-is-videos",
              },
            },
            {
              id: "program-elective-is-1",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-1-videos",
              },
            },
            {
              id: "program-elective-is-2",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-2-videos",
              },
            },
            {
              id: "university-elective-is-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "reinforcement-learning",
              name: "Reinforcement Learning",
              code: "02-24-03405",
              description: "Reinforcement learning algorithms and applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/reinforcement-learning-lectures",
                sections: "https://drive.google.com/drive/folders/reinforcement-learning-sections",
                videos: "https://youtube.com/playlist?list=reinforcement-learning-videos",
              },
            },
            {
              id: "ai-for-robotics",
              name: "AI for Robotics",
              code: "02-24-03406",
              description: "Artificial intelligence applications in robotics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-for-robotics-lectures",
                sections: "https://drive.google.com/drive/folders/ai-for-robotics-sections",
                videos: "https://youtube.com/playlist?list=ai-for-robotics-videos",
              },
            },
            {
              id: "visual-recognition",
              name: "Visual Recognition",
              code: "02-24-03407",
              description: "Advanced visual recognition and image analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/visual-recognition-lectures",
                sections: "https://drive.google.com/drive/folders/visual-recognition-sections",
                videos: "https://youtube.com/playlist?list=visual-recognition-videos",
              },
            },
            {
              id: "program-elective-is-3",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-3-videos",
              },
            },
            {
              id: "program-elective-is-4",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-4-videos",
              },
            },
            {
              id: "university-elective-is-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "media-analytics": {
    name: "Media Analytics",
    description: "Digital media analysis, content creation, and multimedia data processing",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-ma",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-ma-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-ma-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-ma-videos",
              },
            },
            {
              id: "calculus-ma",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus for media and digital content analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-ma-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-ma-sections",
                videos: "https://youtube.com/playlist?list=calculus-ma-videos",
              },
            },
            {
              id: "intro-computer-systems-ma",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems for media processing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-ma-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-ma-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-ma-videos",
              },
            },
            {
              id: "intro-data-sciences-ma",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-ma-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-ma-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-ma-videos",
              },
            },
            {
              id: "programming-1-ma",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for media applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-ma-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-ma-sections",
                videos: "https://youtube.com/playlist?list=programming-1-ma-videos",
              },
            },
            {
              id: "critical-thinking-ma",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking for media analysis",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-ma-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-ma-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-ma-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-ma",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Statistical methods for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-ma-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-ma-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-ma-videos",
              },
            },
            {
              id: "discrete-structures-ma",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures for media computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-ma-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-ma-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-ma-videos",
              },
            },
            {
              id: "data-structures-algorithms-ma",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Data structures for media processing applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-ma-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-ma-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-ma-videos",
              },
            },
            {
              id: "intro-artificial-intelligence-ma",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "AI applications in media and content analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-ma-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-ma-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-ma-videos",
              },
            },
            {
              id: "programming-2-ma",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming for media applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-ma-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-ma-sections",
                videos: "https://youtube.com/playlist?list=programming-2-ma-videos",
              },
            },
            {
              id: "innovation-entrepreneurship-ma",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Innovation in media technology and digital entrepreneurship",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-ma-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-ma-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-ma-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-ma",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistics for media data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-ma-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-ma-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-ma-videos",
              },
            },
            {
              id: "intro-databases-ma",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database systems for media content management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-ma-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-ma-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-ma-videos",
              },
            },
            {
              id: "numerical-computations-ma",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for media processing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-ma-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-ma-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-ma-videos",
              },
            },
            {
              id: "data-driven-journalism",
              name: "Data Driven Journalism",
              code: "02-24-04201",
              description: "Data analysis and visualization for journalism",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-driven-journalism-lectures",
                sections: "https://drive.google.com/drive/folders/data-driven-journalism-sections",
                videos: "https://youtube.com/playlist?list=data-driven-journalism-videos",
              },
            },
            {
              id: "digital-mass-communication",
              name: "Digital Mass Communication",
              code: "02-24-04202",
              description: "Digital communication theories and practices",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-mass-communication-lectures",
                sections: "https://drive.google.com/drive/folders/digital-mass-communication-sections",
                videos: "https://youtube.com/playlist?list=digital-mass-communication-videos",
              },
            },
            {
              id: "university-elective-ma-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-ma",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms for media storage and processing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-ma-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-ma-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-ma-videos",
              },
            },
            {
              id: "machine-learning-ma",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Machine learning for media content analysis",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-ma-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-ma-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-ma-videos",
              },
            },
            {
              id: "data-mining-analytics-ma",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Data mining techniques for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-ma-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-ma-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-ma-videos",
              },
            },
            {
              id: "digital-video-production",
              name: "Digital Video Production",
              code: "02-24-04203",
              description: "Digital video creation and production techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-video-production-lectures",
                sections: "https://drive.google.com/drive/folders/digital-video-production-sections",
                videos: "https://youtube.com/playlist?list=digital-video-production-videos",
              },
            },
            {
              id: "news-editing-blogging",
              name: "News Editing and Blogging",
              code: "02-24-04204",
              description: "Digital content editing and blog management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/news-editing-blogging-lectures",
                sections: "https://drive.google.com/drive/folders/news-editing-blogging-sections",
                videos: "https://youtube.com/playlist?list=news-editing-blogging-videos",
              },
            },
            {
              id: "university-elective-ma-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "image-processing",
              name: "Image Processing",
              code: "02-24-04301",
              description: "Digital image processing and enhancement techniques",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/image-processing-lectures",
                sections: "https://drive.google.com/drive/folders/image-processing-sections",
                videos: "https://youtube.com/playlist?list=image-processing-videos",
              },
            },
            {
              id: "web-design-seo",
              name: "Web Design and Search-Engine Optimization",
              code: "02-24-04302",
              description: "Web design principles and SEO strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/web-design-seo-lectures",
                sections: "https://drive.google.com/drive/folders/web-design-seo-sections",
                videos: "https://youtube.com/playlist?list=web-design-seo-videos",
              },
            },
            {
              id: "computer-audio",
              name: "Computer Audio",
              code: "02-24-04303",
              description: "Digital audio processing and synthesis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-audio-lectures",
                sections: "https://drive.google.com/drive/folders/computer-audio-sections",
                videos: "https://youtube.com/playlist?list=computer-audio-videos",
              },
            },
            {
              id: "faculty-elective-ma-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-1-videos",
              },
            },
            {
              id: "faculty-elective-ma-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-2-videos",
              },
            },
            {
              id: "university-elective-ma-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "infographics-data-visualization",
              name: "Infographics and Data Visualization",
              code: "02-24-04304",
              description: "Creating effective infographics and data visualizations",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/infographics-data-visualization-lectures",
                sections: "https://drive.google.com/drive/folders/infographics-data-visualization-sections",
                videos: "https://youtube.com/playlist?list=infographics-data-visualization-videos",
              },
            },
            {
              id: "natural-language-processing-ma",
              name: "Natural Language Processing",
              code: "02-24-04305",
              description: "NLP for media content analysis and generation",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/natural-language-processing-ma-lectures",
                sections: "https://drive.google.com/drive/folders/natural-language-processing-ma-sections",
                videos: "https://youtube.com/playlist?list=natural-language-processing-ma-videos",
              },
            },
            {
              id: "media-processing",
              name: "Media Processing",
              code: "02-24-04306",
              description: "Advanced multimedia processing techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/media-processing-lectures",
                sections: "https://drive.google.com/drive/folders/media-processing-sections",
                videos: "https://youtube.com/playlist?list=media-processing-videos",
              },
            },
            {
              id: "faculty-elective-ma-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-3-videos",
              },
            },
            {
              id: "faculty-elective-ma-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "computer-graphics",
              name: "Computer Graphics",
              code: "02-24-04401",
              description: "3D graphics programming and rendering techniques",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-graphics-lectures",
                sections: "https://drive.google.com/drive/folders/computer-graphics-sections",
                videos: "https://youtube.com/playlist?list=computer-graphics-videos",
              },
            },
            {
              id: "digital-broadcasting",
              name: "Digital Broadcasting",
              code: "02-24-04402",
              description: "Digital broadcasting technologies and systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-broadcasting-lectures",
                sections: "https://drive.google.com/drive/folders/digital-broadcasting-sections",
                videos: "https://youtube.com/playlist?list=digital-broadcasting-videos",
              },
            },
            {
              id: "audience-research-analysis",
              name: "Audience Research and Analysis",
              code: "02-24-04403",
              description: "Media audience research and behavioral analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/audience-research-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/audience-research-analysis-sections",
                videos: "https://youtube.com/playlist?list=audience-research-analysis-videos",
              },
            },
            {
              id: "program-elective-ma-1",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-1-videos",
              },
            },
            {
              id: "program-elective-ma-2",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-2-videos",
              },
            },
            {
              id: "university-elective-ma-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "social-media-analytics",
              name: "Social Media Analytics",
              code: "02-24-04405",
              description: "Analysis of social media data and engagement metrics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-media-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/social-media-analytics-sections",
                videos: "https://youtube.com/playlist?list=social-media-analytics-videos",
              },
            },
            {
              id: "multimedia-analytics",
              name: "Multimedia Analytics",
              code: "02-24-04406",
              description: "Advanced analytics for multimedia content",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/multimedia-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/multimedia-analytics-sections",
                videos: "https://youtube.com/playlist?list=multimedia-analytics-videos",
              },
            },
            {
              id: "public-opinion-e-surveys",
              name: "Public Opinion and E Surveys",
              code: "02-24-04407",
              description: "Digital survey methods and public opinion analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/public-opinion-e-surveys-lectures",
                sections: "https://drive.google.com/drive/folders/public-opinion-e-surveys-sections",
                videos: "https://youtube.com/playlist?list=public-opinion-e-surveys-videos",
              },
            },
            {
              id: "program-elective-ma-3",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-3-videos",
              },
            },
            {
              id: "program-elective-ma-4",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-4-videos",
              },
            },
            {
              id: "university-elective-ma-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "healthcare-informatics": {
    name: "Healthcare Informatics",
    description: "Healthcare data analysis, medical informatics, and health information systems",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-hi",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for healthcare data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-hi-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-hi-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-hi-videos",
              },
            },
            {
              id: "calculus-hi",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus applications in healthcare analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-hi-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-hi-sections",
                videos: "https://youtube.com/playlist?list=calculus-hi-videos",
              },
            },
            {
              id: "intro-computer-systems-hi",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems for healthcare applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-hi-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-hi-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-hi-videos",
              },
            },
            {
              id: "intro-data-sciences-hi",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for healthcare",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-hi-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-hi-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-hi-videos",
              },
            },
            {
              id: "programming-1-hi",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for healthcare informatics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-hi-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-hi-sections",
                videos: "https://youtube.com/playlist?list=programming-1-hi-videos",
              },
            },
            {
              id: "critical-thinking-hi",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking in healthcare decision making",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-hi-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-hi-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-hi-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-hi",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Statistical methods for healthcare data",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-hi-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-hi-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-hi-videos",
              },
            },
            {
              id: "discrete-structures-hi",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures for healthcare informatics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-hi-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-hi-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-hi-videos",
              },
            },
            {
              id: "data-structures-algorithms-hi",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Data structures for healthcare information systems",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-hi-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-hi-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-hi-videos",
              },
            },
            {
              id: "intro-artificial-intelligence-hi",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "AI applications in healthcare and medical diagnosis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-hi-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-hi-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-hi-videos",
              },
            },
            {
              id: "programming-2-hi",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming for healthcare applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-hi-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-hi-sections",
                videos: "https://youtube.com/playlist?list=programming-2-hi-videos",
              },
            },
            {
              id: "innovation-entrepreneurship-hi",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Innovation in healthcare technology and medical entrepreneurship",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-hi-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-hi-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-hi-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-hi",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistics for healthcare research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-hi-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-hi-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-hi-videos",
              },
            },
            {
              id: "intro-databases-hi",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database systems for healthcare information management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-hi-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-hi-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-hi-videos",
              },
            },
            {
              id: "numerical-computations-hi",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for healthcare modeling",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-hi-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-hi-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-hi-videos",
              },
            },
            {
              id: "intro-epidemiology",
              name: "Introduction to Epidemiology",
              code: "02-24-05201",
              description: "Epidemiological principles and disease surveillance",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-epidemiology-lectures",
                sections: "https://drive.google.com/drive/folders/intro-epidemiology-sections",
                videos: "https://youtube.com/playlist?list=intro-epidemiology-videos",
              },
            },
            {
              id: "anatomy-physiology",
              name: "Anatomy and Physiology",
              code: "02-24-05202",
              description: "Human anatomy and physiological systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/anatomy-physiology-lectures",
                sections: "https://drive.google.com/drive/folders/anatomy-physiology-sections",
                videos: "https://youtube.com/playlist?list=anatomy-physiology-videos",
              },
            },
            {
              id: "university-elective-hi-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-hi",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms for healthcare data management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-hi-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-hi-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-hi-videos",
              },
            },
            {
              id: "machine-learning-hi",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Machine learning applications in healthcare",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-hi-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-hi-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-hi-videos",
              },
            },
            {
              id: "data-mining-analytics-hi",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Data mining techniques for healthcare insights",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-hi-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-hi-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-hi-videos",
              },
            },
            {
              id: "pharmacology-chemistry-drugs",
              name: "Pharmacology and Chemistry of Drugs",
              code: "02-24-05203",
              description: "Drug mechanisms and pharmaceutical chemistry",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/pharmacology-chemistry-drugs-lectures",
                sections: "https://drive.google.com/drive/folders/pharmacology-chemistry-drugs-sections",
                videos: "https://youtube.com/playlist?list=pharmacology-chemistry-drugs-videos",
              },
            },
            {
              id: "ethics-regulations-healthcare",
              name: "Ethics & Regulations in Healthcare",
              code: "02-24-05204",
              description: "Healthcare ethics and regulatory compliance",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ethics-regulations-healthcare-lectures",
                sections: "https://drive.google.com/drive/folders/ethics-regulations-healthcare-sections",
                videos: "https://youtube.com/playlist?list=ethics-regulations-healthcare-videos",
              },
            },
            {
              id: "university-elective-hi-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "neuroscience-robotics",
              name: "Neuroscience and Robotics",
              code: "02-24-05301",
              description: "Neuroscience applications in medical robotics",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/neuroscience-robotics-lectures",
                sections: "https://drive.google.com/drive/folders/neuroscience-robotics-sections",
                videos: "https://youtube.com/playlist?list=neuroscience-robotics-videos",
              },
            },
            {
              id: "health-information-systems",
              name: "Health Information Systems",
              code: "02-24-05302",
              description: "Design and implementation of health information systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-information-systems-lectures",
                sections: "https://drive.google.com/drive/folders/health-information-systems-sections",
                videos: "https://youtube.com/playlist?list=health-information-systems-videos",
              },
            },
            {
              id: "computer-assisted-drug-design",
              name: "Computer-Assisted Drug Design",
              code: "02-24-05303",
              description: "Computational methods for drug discovery and design",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-assisted-drug-design-lectures",
                sections: "https://drive.google.com/drive/folders/computer-assisted-drug-design-sections",
                videos: "https://youtube.com/playlist?list=computer-assisted-drug-design-videos",
              },
            },
            {
              id: "faculty-elective-hi-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-1-videos",
              },
            },
            {
              id: "faculty-elective-hi-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-2-videos",
              },
            },
            {
              id: "university-elective-hi-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "national-international-healthcare-systems",
              name: "National and International Healthcare Systems",
              code: "02-24-05304",
              description: "Comparative analysis of healthcare systems worldwide",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/national-international-healthcare-systems-lectures",
                sections: "https://drive.google.com/drive/folders/national-international-healthcare-systems-sections",
                videos: "https://youtube.com/playlist?list=national-international-healthcare-systems-videos",
              },
            },
            {
              id: "health-policy-economics",
              name: "Health Policy & Economics",
              code: "02-24-05305",
              description: "Healthcare policy analysis and health economics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-policy-economics-lectures",
                sections: "https://drive.google.com/drive/folders/health-policy-economics-sections",
                videos: "https://youtube.com/playlist?list=health-policy-economics-videos",
              },
            },
            {
              id: "healthcare-market-analytics",
              name: "Healthcare Market Analytics",
              code: "02-24-05306",
              description: "Market analysis and analytics in healthcare industry",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/healthcare-market-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/healthcare-market-analytics-sections",
                videos: "https://youtube.com/playlist?list=healthcare-market-analytics-videos",
              },
            },
            {
              id: "faculty-elective-hi-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-3-videos",
              },
            },
            {
              id: "faculty-elective-hi-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "e-health-telehealth-telemedicine",
              name: "E-health, Telehealth and Telemedicine",
              code: "02-24-05401",
              description: "Digital health technologies and remote healthcare delivery",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/e-health-telehealth-telemedicine-lectures",
                sections: "https://drive.google.com/drive/folders/e-health-telehealth-telemedicine-sections",
                videos: "https://youtube.com/playlist?list=e-health-telehealth-telemedicine-videos",
              },
            },
            {
              id: "mathematical-modelling-health",
              name: "Mathematical Modelling for Health",
              code: "02-24-05402",
              description: "Mathematical models for healthcare and epidemiology",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/mathematical-modelling-health-lectures",
                sections: "https://drive.google.com/drive/folders/mathematical-modelling-health-sections",
                videos: "https://youtube.com/playlist?list=mathematical-modelling-health-videos",
              },
            },
            {
              id: "clinical-medical-care-delivery",
              name: "Clinical & Medical Care Delivery",
              code: "02-24-05403",
              description: "Healthcare delivery systems and clinical workflows",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/clinical-medical-care-delivery-lectures",
                sections: "https://drive.google.com/drive/folders/clinical-medical-care-delivery-sections",
                videos: "https://youtube.com/playlist?list=clinical-medical-care-delivery-videos",
              },
            },
            {
              id: "program-elective-hi-1",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-1-videos",
              },
            },
            {
              id: "program-elective-hi-2",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-2-videos",
              },
            },
            {
              id: "university-elective-hi-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "computerized-disease-registries",
              name: "Computerized Disease Registries",
              code: "02-24-05405",
              description: "Design and management of electronic disease registries",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computerized-disease-registries-lectures",
                sections: "https://drive.google.com/drive/folders/computerized-disease-registries-sections",
                videos: "https://youtube.com/playlist?list=computerized-disease-registries-videos",
              },
            },
            {
              id: "clinical-decision-support-systems",
              name: "Clinical Decision Support Systems",
              code: "02-24-05406",
              description: "AI-powered clinical decision support and expert systems",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/clinical-decision-support-systems-lectures",
                sections: "https://drive.google.com/drive/folders/clinical-decision-support-systems-sections",
                videos: "https://youtube.com/playlist?list=clinical-decision-support-systems-videos",
              },
            },
            {
              id: "health-psychology",
              name: "Health Psychology",
              code: "02-24-05407",
              description: "Psychological factors in health and illness",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-psychology-lectures",
                sections: "https://drive.google.com/drive/folders/health-psychology-sections",
                videos: "https://youtube.com/playlist?list=health-psychology-videos",
              },
            },
            {
              id: "program-elective-hi-3",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-3-videos",
              },
            },
            {
              id: "program-elective-hi-4",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-4-videos",
              },
            },
            {
              id: "university-elective-hi-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  cybersecurity: {
    name: "Cybersecurity",
    description: "Information security, cyber defense, and digital forensics",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-cs",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for cybersecurity applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-cs-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-cs-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-cs-videos",
              },
            },
            {
              id: "calculus-cs",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus for cybersecurity and cryptographic applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-cs-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-cs-sections",
                videos: "https://youtube.com/playlist?list=calculus-cs-videos",
              },
            },
            {
              id: "intro-computer-systems-cs",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems architecture and security fundamentals",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-cs-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-cs-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-cs-videos",
              },
            },
            {
              id: "intro-data-sciences-cs",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for cybersecurity analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-cs-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-cs-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-cs-videos",
              },
            },
            {
              id: "programming-1-cs",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for cybersecurity applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-cs-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-cs-sections",
                videos: "https://youtube.com/playlist?list=programming-1-cs-videos",
              },
            },
            {
              id: "critical-thinking-cs",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking for cybersecurity analysis",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-cs-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-cs-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-cs-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-cs",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Statistical methods for cybersecurity analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-1-cs-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-1-cs-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-1-cs-videos",
              },
            },
            {
              id: "discrete-structures-cs",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures for cryptography and security",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/discrete-structures-cs-lectures",
                sections: "https://drive.google.com/drive/folders/discrete-structures-cs-sections",
                videos: "https://youtube.com/playlist?list=discrete-structures-cs-videos",
              },
            },
            {
              id: "data-structures-algorithms-cs",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Data structures and algorithms for security applications",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-structures-algorithms-cs-lectures",
                sections: "https://drive.google.com/drive/folders/data-structures-algorithms-cs-sections",
                videos: "https://youtube.com/playlist?list=data-structures-algorithms-cs-videos",
              },
            },
            {
              id: "intro-artificial-intelligence-cs",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "AI applications in cybersecurity and threat detection",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-ai-cs-lectures",
                sections: "https://drive.google.com/drive/folders/intro-ai-cs-sections",
                videos: "https://youtube.com/playlist?list=intro-ai-cs-videos",
              },
            },
            {
              id: "programming-2-cs",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming for cybersecurity tools",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-2-cs-lectures",
                sections: "https://drive.google.com/drive/folders/programming-2-cs-sections",
                videos: "https://youtube.com/playlist?list=programming-2-cs-videos",
              },
            },
            {
              id: "innovation-entrepreneurship-cs",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Innovation in cybersecurity and security entrepreneurship",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/innovation-entrepreneurship-cs-lectures",
                sections: "https://drive.google.com/drive/folders/innovation-entrepreneurship-cs-sections",
                videos: "https://youtube.com/playlist?list=innovation-entrepreneurship-cs-videos",
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-cs",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistics for cybersecurity research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-cs-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-cs-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-cs-videos",
              },
            },
            {
              id: "intro-databases-cs",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database security and secure database design",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-cs-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-cs-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-cs-videos",
              },
            },
            {
              id: "numerical-computations-cs",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for cryptographic applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-cs-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-cs-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-cs-videos",
              },
            },
            {
              id: "intro-cybersecurity",
              name: "Introduction to Cybersecurity",
              code: "02-24-06201",
              description: "Fundamentals of cybersecurity and information security",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-cybersecurity-lectures",
                sections: "https://drive.google.com/drive/folders/intro-cybersecurity-sections",
                videos: "https://youtube.com/playlist?list=intro-cybersecurity-videos",
              },
            },
            {
              id: "number-theory",
              name: "Number Theory",
              code: "02-24-06202",
              description: "Number theory foundations for cryptography",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/number-theory-lectures",
                sections: "https://drive.google.com/drive/folders/number-theory-sections",
                videos: "https://youtube.com/playlist?list=number-theory-videos",
              },
            },
            {
              id: "university-elective-cs-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-cs",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud security and secure cloud architectures",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cloud-computing-cs-lectures",
                sections: "https://drive.google.com/drive/folders/cloud-computing-cs-sections",
                videos: "https://youtube.com/playlist?list=cloud-computing-cs-videos",
              },
            },
            {
              id: "machine-learning-cs",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Machine learning for cybersecurity and threat detection",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/machine-learning-cs-lectures",
                sections: "https://drive.google.com/drive/folders/machine-learning-cs-sections",
                videos: "https://youtube.com/playlist?list=machine-learning-cs-videos",
              },
            },
            {
              id: "data-mining-analytics-cs",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Data mining for cybersecurity intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-mining-analytics-cs-lectures",
                sections: "https://drive.google.com/drive/folders/data-mining-analytics-cs-sections",
                videos: "https://youtube.com/playlist?list=data-mining-analytics-cs-videos",
              },
            },
            {
              id: "cryptography",
              name: "Cryptography",
              code: "02-24-06203",
              description: "Cryptographic algorithms and protocols",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cryptography-lectures",
                sections: "https://drive.google.com/drive/folders/cryptography-sections",
                videos: "https://youtube.com/playlist?list=cryptography-videos",
              },
            },
            {
              id: "operating-systems-cs",
              name: "Operating Systems",
              code: "02-24-00307",
              description: "Operating system security and system-level protection",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/operating-systems-cs-lectures",
                sections: "https://drive.google.com/drive/folders/operating-systems-cs-sections",
                videos: "https://youtube.com/playlist?list=operating-systems-cs-videos",
              },
            },
            {
              id: "university-elective-cs-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "computer-networks-cs",
              name: "Computer Networks",
              code: "02-24-00308",
              description: "Network protocols and network security fundamentals",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-networks-cs-lectures",
                sections: "https://drive.google.com/drive/folders/computer-networks-cs-sections",
                videos: "https://youtube.com/playlist?list=computer-networks-cs-videos",
              },
            },
            {
              id: "operating-systems-security",
              name: "Operating Systems Security",
              code: "02-24-06302",
              description: "Advanced operating system security mechanisms",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/operating-systems-security-lectures",
                sections: "https://drive.google.com/drive/folders/operating-systems-security-sections",
                videos: "https://youtube.com/playlist?list=operating-systems-security-videos",
              },
            },
            {
              id: "secure-software-development",
              name: "Secure Software Development",
              code: "02-24-06303",
              description: "Secure coding practices and software security",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/secure-software-development-lectures",
                sections: "https://drive.google.com/drive/folders/secure-software-development-sections",
                videos: "https://youtube.com/playlist?list=secure-software-development-videos",
              },
            },
            {
              id: "faculty-elective-cs-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-1-videos",
              },
            },
            {
              id: "faculty-elective-cs-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-2-videos",
              },
            },
            {
              id: "university-elective-cs-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "computer-network-security",
              name: "Computer and Network Security",
              code: "02-24-06304",
              description: "Advanced network security and intrusion detection",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-network-security-lectures",
                sections: "https://drive.google.com/drive/folders/computer-network-security-sections",
                videos: "https://youtube.com/playlist?list=computer-network-security-videos",
              },
            },
            {
              id: "data-integrity-authentication",
              name: "Data Integrity and Authentication",
              code: "02-24-06305",
              description: "Data protection and authentication mechanisms",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-integrity-authentication-lectures",
                sections: "https://drive.google.com/drive/folders/data-integrity-authentication-sections",
                videos: "https://youtube.com/playlist?list=data-integrity-authentication-videos",
              },
            },
            {
              id: "information-security-management",
              name: "Information Security Management",
              code: "02-24-06306",
              description: "Security governance and risk management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/information-security-management-lectures",
                sections: "https://drive.google.com/drive/folders/information-security-management-sections",
                videos: "https://youtube.com/playlist?list=information-security-management-videos",
              },
            },
            {
              id: "faculty-elective-cs-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-3-videos",
              },
            },
            {
              id: "faculty-elective-cs-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "social-network-computing",
              name: "Social Network Computing",
              code: "02-24-06401",
              description: "Security and privacy in social networks",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-network-computing-lectures",
                sections: "https://drive.google.com/drive/folders/social-network-computing-sections",
                videos: "https://youtube.com/playlist?list=social-network-computing-videos",
              },
            },
            {
              id: "security-distributed-systems",
              name: "Security of Distributed Systems",
              code: "02-24-06402",
              description: "Security challenges in distributed computing environments",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/security-distributed-systems-lectures",
                sections: "https://drive.google.com/drive/folders/security-distributed-systems-sections",
                videos: "https://youtube.com/playlist?list=security-distributed-systems-videos",
              },
            },
            {
              id: "human-security",
              name: "Human Security",
              code: "02-24-06403",
              description: "Human factors in cybersecurity and social engineering",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/human-security-lectures",
                sections: "https://drive.google.com/drive/folders/human-security-sections",
                videos: "https://youtube.com/playlist?list=human-security-videos",
              },
            },
            {
              id: "program-elective-cs-1",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-1-videos",
              },
            },
            {
              id: "program-elective-cs-2",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-2-videos",
              },
            },
            {
              id: "university-elective-cs-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "cybersecurity-risk-management",
              name: "Cybersecurity Risk Management",
              code: "02-24-06405",
              description: "Risk assessment and management in cybersecurity",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cybersecurity-risk-management-lectures",
                sections: "https://drive.google.com/drive/folders/cybersecurity-risk-management-sections",
                videos: "https://youtube.com/playlist?list=cybersecurity-risk-management-videos",
              },
            },
            {
              id: "digital-forensics",
              name: "Digital Forensics",
              code: "02-24-06406",
              description: "Digital evidence collection and forensic analysis",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-forensics-lectures",
                sections: "https://drive.google.com/drive/folders/digital-forensics-sections",
                videos: "https://youtube.com/playlist?list=digital-forensics-videos",
              },
            },
            {
              id: "law-cybersecurity",
              name: "Law and Cybersecurity",
              code: "02-24-06407",
              description: "Legal aspects of cybersecurity and cyber law",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/law-cybersecurity-lectures",
                sections: "https://drive.google.com/drive/folders/law-cybersecurity-sections",
                videos: "https://youtube.com/playlist?list=law-cybersecurity-videos",
              },
            },
            {
              id: "program-elective-cs-3",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 4,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-3-videos",
              },
            },
            {
              id: "program-elective-cs-4",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-4-videos",
              },
            },
            {
              id: "university-elective-cs-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-5-videos",
              },
            },
          ],
        },
      },
    },
  },
}
