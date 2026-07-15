require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Semester = require('./models/Semester');
const Subject = require('./models/Subject');
const Module = require('./models/Module');
const Topic = require('./models/Topic');
const ResourceLink = require('./models/ResourceLink');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusyllabus_hub');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Semester.deleteMany();
    await Subject.deleteMany();
    await Module.deleteMany();
    await Topic.deleteMany();
    await ResourceLink.deleteMany();
    await Comment.deleteMany();
    console.log('Cleared existing database entries.');

    // 1. Create Users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@edusyllabus.com',
      password: 'admin123',
      role: 'admin',
    });

    const studentUser = await User.create({
      username: 'student',
      email: 'student@edusyllabus.com',
      password: 'student123',
      role: 'student',
    });
    console.log('Created Admin and Student users.');

    // 2. Create 8 Semesters
    const semesters = [];
    for (let i = 1; i <= 8; i++) {
      const sem = await Semester.create({
        number: i,
        description: `B.Tech CSE - Semester ${i} Syllabus`,
      });
      semesters.push(sem);
    }
    console.log('Created Semesters 1 to 8.');

    // 3. Define Syllabus Data (CSE Core Subjects)
    const syllabus = [
      {
        semesterNum: 1,
        code: 'CS101',
        name: 'Introduction to Programming in C',
        credits: 4,
        description: 'Foundations of computer science and basic programming techniques using the C programming language.',
        modules: [
          {
            num: 1,
            name: 'Introduction to C & Data Types',
            description: 'Basics of C programming, variables, constant declaration, and data type system.',
            topics: [
              {
                title: 'Variables, Constants and Data Types',
                description: 'Understand how memory is allocated for variables and the ranges of integer, float, and char.',
                links: [
                  { type: 'long-form', desc: 'GeeksforGeeks C Programming Complete Guide', url: 'https://www.geeksforgeeks.org/c-programming-language/' },
                  { type: 'medium-length', desc: 'W3Schools C Data Types Overview', url: 'https://www.w3schools.com/c/c_data_types.php' },
                  { type: 'short-form', desc: 'C Data Types in 3 Minutes Video', url: 'https://www.youtube.com/watch?v=k1tM1bYfVwA' }
                ]
              },
              {
                title: 'Operators and Expressions',
                description: 'Arithmetic, logical, relational, bitwise and ternary operators in C.',
                links: [
                  { type: 'long-form', desc: 'Programiz C Operators Deep Dive', url: 'https://www.programiz.com/c-programming/c-operators' },
                  { type: 'medium-length', desc: 'TutorialsPoint C Operators Guide', url: 'https://www.tutorialspoint.com/cprogramming/c_operators.htm' },
                  { type: 'short-form', desc: 'YouTube: Operators in C Explained', url: 'https://www.youtube.com/watch?v=F3G8D2k2c98' }
                ]
              }
            ]
          },
          {
            num: 2,
            name: 'Control Statements and Loops',
            description: 'Decision making constructs and iterative programming constructs.',
            topics: [
              {
                title: 'Conditional branching (if-else, switch-case)',
                description: 'Decision making processes in C code structure.',
                links: [
                  { type: 'long-form', desc: 'GeeksforGeeks C Control Statements', url: 'https://www.geeksforgeeks.org/decision-making-c-cpp/' },
                  { type: 'medium-length', desc: 'Programiz C if...else Statement', url: 'https://www.programiz.com/c-programming/c-if-else' },
                  { type: 'short-form', desc: 'Video: C switch case in 5 Mins', url: 'https://www.youtube.com/watch?v=ALf2kXgYF_M' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 2,
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        credits: 4,
        description: 'Introduction to linear and non-linear data structures, searching, sorting and complexity analysis.',
        modules: [
          {
            num: 1,
            name: 'Linear Data Structures (Arrays & Lists)',
            description: 'Concept of arrays, dynamic array allocation, linked list implementations.',
            topics: [
              {
                title: 'Singly and Doubly Linked Lists',
                description: 'Understanding sequential dynamic data structures and pointer manipulations.',
                links: [
                  { type: 'long-form', desc: 'Stanford CS Education: Linked List Basics', url: 'https://cslibrary.stanford.edu/103/LinkedListBasics.pdf' },
                  { type: 'medium-length', desc: 'GeeksforGeeks Linked List vs Array', url: 'https://www.geeksforgeeks.org/linked-list-vs-array/' },
                  { type: 'short-form', desc: 'mycodeschool: Introduction to Linked Lists', url: 'https://www.youtube.com/watch?v=NobHlGUj66Y' }
                ]
              }
            ]
          },
          {
            num: 2,
            name: 'Stacks and Queues',
            description: 'LIFO and FIFO structures, implementations using arrays and linked lists, application of stacks.',
            topics: [
              {
                title: 'Infix to Postfix Conversion using Stacks',
                description: 'Using stack data structure to evaluate algebraic expressions.',
                links: [
                  { type: 'long-form', desc: 'GeeksforGeeks Stack Applications', url: 'https://www.geeksforgeeks.org/stack-data-structure/' },
                  { type: 'medium-length', desc: 'TutorialsPoint Infix/Postfix Theory', url: 'https://www.tutorialspoint.com/data_structures_algorithms/expression_parsing.htm' },
                  { type: 'short-form', desc: 'Abdul Bari: Infix to Postfix Conversion', url: 'https://www.youtube.com/watch?v=M2zGMgVeDy0' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 3,
        code: 'CS301',
        name: 'Discrete Mathematics',
        credits: 3,
        description: 'Set theory, logic, relation, functions, graph theory and combinatorics.',
        modules: [
          {
            num: 1,
            name: 'Mathematical Logic',
            description: 'Propositional logic, truth tables, tautologies, and predicate logic.',
            topics: [
              {
                title: 'Propositional Equivalences and Truth Tables',
                description: 'Verify logic equivalence using truth tables and rules.',
                links: [
                  { type: 'long-form', desc: 'Trefor Bazett Discrete Math Playlist', url: 'https://www.youtube.com/playlist?list=PLHXZ9OQGMqxersk8fUxiUMSIx0DBqsKUp' },
                  { type: 'medium-length', desc: 'Wikipedia: Propositional Calculus', url: 'https://en.wikipedia.org/wiki/Propositional_calculus' },
                  { type: 'short-form', desc: 'Quick Truth Table Tutorial Video', url: 'https://www.youtube.com/watch?v=2KthwS_vA38' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 4,
        code: 'CS401',
        name: 'Operating Systems',
        credits: 4,
        description: 'Processes, threads, CPU scheduling, synchronization, memory management, and file systems.',
        modules: [
          {
            num: 1,
            name: 'Process Management',
            description: 'Process state, PCB, context switching, CPU scheduling algorithms.',
            topics: [
              {
                title: 'CPU Scheduling Algorithms (FCFS, SJF, Round Robin)',
                description: 'Compare scheduling strategies for performance criteria like throughput and turnaround.',
                links: [
                  { type: 'long-form', desc: 'Galvin Operating Systems: CPU Scheduling Chapter', url: 'https://codex.cs.yale.edu/avi/os-book/OS9/slide-dir/ch5.pdf' },
                  { type: 'medium-length', desc: 'GeeksforGeeks CPU Scheduling Algorithms', url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/' },
                  { type: 'short-form', desc: 'Gate Smashers CPU Scheduling Videos', url: 'https://www.youtube.com/watch?v=zF58Y1-Gvj8' }
                ]
              }
            ]
          },
          {
            num: 2,
            name: 'Memory Management',
            description: 'Paging, segmentation, virtual memory, and page replacement.',
            topics: [
              {
                title: 'Page Replacement Algorithms (FIFO, LRU, Optimal)',
                description: 'Learn how pages are loaded into memory and swapped out under memory pressure.',
                links: [
                  { type: 'long-form', desc: 'OS Dev: Memory Paging Deep Technicals', url: 'https://wiki.osdev.org/Paging' },
                  { type: 'medium-length', desc: 'Studytonight: Page Replacement Algorithms', url: 'https://www.studytonight.com/operating-system/page-replacement-algorithms' },
                  { type: 'short-form', desc: 'Neso Academy: LRU Page Replacement', url: 'https://www.youtube.com/watch?v=dYIoWkC56yA' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 5,
        code: 'CS501',
        name: 'Computer Networks',
        credits: 4,
        description: 'OSI Reference Model, TCP/IP Suite, Routing Algorithms, IP Addressing, Congestion Control.',
        modules: [
          {
            num: 1,
            name: 'Data Link Layer & Routing Protocols',
            description: 'Error correction, framing, link state vs distance vector routing.',
            topics: [
              {
                title: 'IP Addressing and Subnetting',
                description: 'Understand IPv4 addressing, CIDR notation, and how subnet masks are applied.',
                links: [
                  { type: 'long-form', desc: 'Cisco IPv4 Addressing and Subnetting Guide', url: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html' },
                  { type: 'medium-length', desc: 'Practical Networking: Subnetting Made Easy', url: 'https://www.practicalnetworking.net/subnetting-made-easy/' },
                  { type: 'short-form', desc: 'PowerCert Subnetting in 13 Minutes', url: 'https://www.youtube.com/watch?v=s_Ntt6eTn94' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 6,
        code: 'CS601',
        name: 'Compiler Design',
        credits: 3,
        description: 'Lexical analysis, syntax analysis, parsing, semantic analysis, code generation, and optimization.',
        modules: [
          {
            num: 1,
            name: 'Lexical and Syntax Analysis',
            description: 'Token generation, Finite Automata, and parsing algorithms.',
            topics: [
              {
                title: 'LL(1) and LR(1) Parsers',
                description: 'Top-down and bottom-up parsing techniques for context-free grammars.',
                links: [
                  { type: 'long-form', desc: 'Stanford CS143 Compilers Course Material', url: 'https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/' },
                  { type: 'medium-length', desc: 'Javatpoint Compiler Design Parsing Theory', url: 'https://www.javatpoint.com/compiler-design-parsing' },
                  { type: 'short-form', desc: 'Gate Smashers LL(1) Parsing Table Construction', url: 'https://www.youtube.com/watch?v=L2G73V7b1vE' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 7,
        code: 'CS701',
        name: 'Cloud Computing & Virtualization',
        credits: 3,
        description: 'SaaS, PaaS, IaaS, virtualization technologies, hypervisors, containerization (Docker, Kubernetes).',
        modules: [
          {
            num: 1,
            name: 'Cloud Concepts and Virtualization',
            description: 'Core concepts of cloud distribution, Hypervisors, type 1 and type 2 virtualization.',
            topics: [
              {
                title: 'Containers vs Virtual Machines',
                description: 'Differences in host operating systems, lightweight isolation, Docker vs ESXi.',
                links: [
                  { type: 'long-form', desc: 'Docker Official documentation: What is a container?', url: 'https://www.docker.com/resources/what-container/' },
                  { type: 'medium-length', desc: 'IBM Cloud: Containers vs VMs Comparison', url: 'https://www.ibm.com/blog/containers-vs-vms/' },
                  { type: 'short-form', desc: 'TechWorld with Nana: Containers vs VMs', url: 'https://www.youtube.com/watch?v=AdgnOctA53c' }
                ]
              }
            ]
          }
        ]
      },
      {
        semesterNum: 8,
        code: 'CS801',
        name: 'Professional Ethics & Intellectual Property',
        credits: 3,
        description: 'Ethical conduct in computer science, software copyrights, patents, and cyber law frameworks.',
        modules: [
          {
            num: 1,
            name: 'Intellectual Property Rights',
            description: 'Overview of patents, trademarks, copyrights, and intellectual trade secrets.',
            topics: [
              {
                title: 'Software Licensing (Open Source vs Proprietary)',
                description: 'Analyzing GPL, MIT, Apache licenses, and copyright protections.',
                links: [
                  { type: 'long-form', desc: 'Open Source Initiative Open Source Licenses List', url: 'https://opensource.org/licenses' },
                  { type: 'medium-length', desc: 'FOSSA Guide to Open Source Licensing', url: 'https://fossa.com/blog/open-source-licensing-guide/' },
                  { type: 'short-form', desc: 'Legal Eagle: Open Source Explained in 4 Mins', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
                ]
              }
            ]
          }
        ]
      }
    ];

    // Seed syllabus to MongoDB
    for (const item of syllabus) {
      // Find matching semester
      const semObj = semesters.find(s => s.number === item.semesterNum);
      if (!semObj) continue;

      // Create Subject
      const subj = await Subject.create({
        code: item.code,
        name: item.name,
        semester: semObj._id,
        credits: item.credits,
        department: 'CSE',
        description: item.description,
      });

      // Create Modules
      for (const mData of item.modules) {
        const mod = await Module.create({
          subject: subj._id,
          moduleNumber: mData.num,
          name: mData.name,
          description: mData.description,
        });

        // Create Topics
        for (const tData of mData.topics) {
          const topic = await Topic.create({
            module: mod._id,
            title: tData.title,
            description: tData.description,
          });

          // Create Resource Links (Approved by default)
          for (const lData of tData.links) {
            await ResourceLink.create({
              topic: topic._id,
              url: lData.url,
              type: lData.type,
              description: lData.desc,
              isApproved: true,
              submittedBy: adminUser._id,
              approvedBy: adminUser._id,
            });
          }

          // Add a sample comment
          await Comment.create({
            topic: topic._id,
            user: studentUser._id,
            content: `This is a very helpful topic. Can anyone suggest more videos on ${tData.title}?`,
          });
        }
      }
    }

    console.log('Database Seeding Successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
