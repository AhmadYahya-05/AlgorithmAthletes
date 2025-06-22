import { motion } from 'framer-motion';
import NavigationBar from '../components/NavigationBar';
import { Users, Code, Coffee, Linkedin } from 'lucide-react';

// Photos are now referenced from the public directory

const AboutUsPage = ({ user, onLogout }) => {

  const teamMembers = [
    {
      name: 'Emaad Qazi',
      role: 'Full Stack Developer',
      photo: '/EmaadPFP.jpeg',
      education: '3rd year BBA/BSc @ Laurier',
      bio: 'As the lead full-stack developer, Emaad engineered the core application, from the responsive frontend to the robust database architecture, bringing the project to life.',
      linkedin: 'https://www.linkedin.com/in/emaadqazi/'
    },
    {
      name: 'Ahmad Yahya',
      role: 'AI & Full Stack',
      photo: '/AhmadPFP.jpeg',
      education: '3rd year BSc @ Laurier',
      bio: 'Ahmad drove the AI integration, building the intelligent form-checking system and workout tracker, while also lending his expertise to the frontend design.',
      linkedin: 'https://www.linkedin.com/in/ahmad-yahya-a69278140/'
    },
    {
      name: 'Sebastian Balderrama',
      role: 'UI/UX & AI Engineer',
      photo: '/SebastianPFP.jpeg',
      education: '4th year CS+Math @ Laurier',
      bio: 'Sebastian shaped the user experience with his keen eye for UI/UX and developed the generative AI logic that powers the app\'s smart features.',
      linkedin: 'https://www.linkedin.com/in/sebalderrama/'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0F172A] text-white p-4" style={{ fontFamily: 'monospace' }}>
      <NavigationBar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto max-w-5xl pt-20 text-center">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-bold text-yellow-300 mb-4" style={{ fontFamily: 'VT323, monospace', textShadow: '3px 3px 0px #d97706' }}>
            Our Origin Story
          </h1>
          <p className="text-lg text-cyan-200 mb-12">The tale of how three friends brought Fitness Quest to life.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8 mb-16 text-left leading-relaxed"
        >
          <p className="mb-4">It all started with a simple idea: what if fitness wasn't a chore, but an epic adventure? Three friends, brought together by a shared passion for gaming and a desire to make health and wellness more engaging, decided to turn this vision into reality.</p>
          <p className="mb-4">During a weekend hackathon, fueled by coffee and creativity, the concept for Fitness Quest was born. We wanted to create an app that combined the best elements of RPGs—leveling up, completing quests, and teaming up with friends—with real-world fitness goals.</p>
          <p>This project is the culmination of countless hours of coding, designing, and dreaming. We hope it inspires you to start your own fitness quest and become the hero of your story.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-4xl font-bold text-yellow-300 mb-10" style={{ fontFamily: 'VT323, monospace' }}>Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                className="bg-gray-800 bg-opacity-60 rounded-xl p-6 border-2 border-gray-700 text-center shadow-lg flex flex-col"
              >
                <div className="flex-grow">
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-400 object-cover"
                  />
                  <h3 className="text-2xl font-bold text-cyan-300" style={{ fontFamily: 'VT323, monospace' }}>{member.name}</h3>
                  <p className="text-yellow-400 font-semibold mb-1">{member.role}</p>
                  <p className="text-gray-400 text-xs mb-3">{member.education}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
                <div className="mt-4">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block text-cyan-400 hover:text-yellow-300 transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage; 