import { Suspense } from 'react'
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// This would fetch your actual shard data
async function getShardData() {
  // In production, this would fetch from /rob_shard.json
  return {
    meta: {
      name: "Robert Melrose",
      title: "Senior Full-Stack Engineer",
      location: "Miami, FL",
      updated: "2025-01-13T10:30:00Z",
      version: "2025.01.13-1"
    },
    skills: {
      primary: ["Next.js", "TypeScript", "Python", "FastAPI", "Redis"],
      secondary: ["Docker", "AWS", "PostgreSQL", "Tailwind CSS"],
      learning: ["Snowflake", "Kubernetes", "Vector DBs"]
    },
    projects: [
      {
        name: "Devs.Miami",
        stack: ["Next.js", "Supabase", "Tailwind"],
        status: "Production",
        description: "Miami developer community platform"
      },
      {
        name: "Archaeologist",
        stack: ["Python", "FastAPI", "Redis"],
        status: "MVP",
        description: "Audio processing pipeline for music analysis"
      }
    ],
    interviews: [
      {
        company: "Top-tier Finance",
        role: "Senior SDE",
        date: "2024-12-15",
        outcome: "Technical Round 2",
        feedback: "Strong system design, need deeper cache optimization knowledge"
      }
    ]
  }
}

export default async function CorpusPage() {
  const shard = await getShardData()

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Horcrux
          </Link>
        </div>

        {/* Shard Header */}
        <div className="border border-green-800/30 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-mono font-bold mb-2">{shard.meta.name}</h1>
              <p className="text-green-300 text-lg">{shard.meta.title}</p>
            </div>
            <div className="text-right text-sm text-green-500/70 font-mono">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                {new Date(shard.meta.updated).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {shard.meta.location}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <span className="px-2 py-1 bg-green-900/30 border border-green-700/50 font-mono">
              v{shard.meta.version}
            </span>
            <Link 
              href="/rob_shard.json"
              className="flex items-center gap-1 text-green-500 hover:text-green-400 transition-colors"
            >
              Raw JSON <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-xl font-mono font-bold mb-4 text-green-300">Skills</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-green-500 font-mono mb-2">Primary</h3>
              <div className="flex flex-wrap gap-2">
                {shard.skills.primary.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-green-600/20 border border-green-600/50 text-sm font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-green-500 font-mono mb-2">Learning</h3>
              <div className="flex flex-wrap gap-2">
                {shard.skills.learning.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 text-sm font-mono text-yellow-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-8">
          <h2 className="text-xl font-mono font-bold mb-4 text-green-300">Projects</h2>
          <div className="space-y-4">
            {shard.projects.map(project => (
              <div key={project.name} className="border border-green-800/30 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-bold">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-mono ${
                    project.status === 'Production' 
                      ? 'bg-green-900/30 border border-green-700/50 text-green-400'
                      : 'bg-blue-900/30 border border-blue-700/50 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-green-300/70 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 text-xs font-mono text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Interviews */}
        <section>
          <h2 className="text-xl font-mono font-bold mb-4 text-green-300">Recent Activity</h2>
          <div className="space-y-4">
            {shard.interviews.map((interview, i) => (
              <div key={i} className="border border-green-800/30 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-bold">{interview.company}</h3>
                  <span className="text-sm text-green-500/70 font-mono">{interview.date}</span>
                </div>
                <p className="text-green-300/70 mb-2">{interview.role}</p>
                <p className="text-sm text-green-400/80">{interview.feedback}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
