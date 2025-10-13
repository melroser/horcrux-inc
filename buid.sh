# Create workspace structure
mkdir -p apps/web apps/mcp packages/shared tools data

# Initialize root package.json
cat > package.json << 'EOF'
{
  "name": "horcrux-inc",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "build:shard": "python tools/build_shard.py",
    "deploy:mcp": "cd apps/mcp && render deploy"
  },
  "devDependencies": {
    "@types/node": "^20",
    "typescript": "^5"
  },
  "packageManager": "pnpm@8.15.0"
}
EOF

# Create pnpm workspace config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# Initialize Next.js app
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Update web package.json with additional dependencies
cat > package.json << 'EOF'
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5"
  }
}
EOF

# Install dependencies
pnpm install

# Create app directory structure
mkdir -p app/corpus public

# Create layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Horcrux - Persistent Context for Agents',
  description: 'A living memory interface for AI systems',
  openGraph: {
    title: 'Horcrux',
    description: 'Persistent personal context for agents',
    url: 'https://horcrux.inc',
    siteName: 'Horcrux',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-black text-green-400`}>
        {children}
      </body>
    </html>
  )
}
EOF

# Create main page.tsx
cat > app/page.tsx << 'EOF'
'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Database, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-pulse pointer-events-none" />
      
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-green-800/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              className="font-mono text-xl font-bold tracking-wider"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              HORCRUX
            </motion.div>
            <nav className="flex gap-6 text-sm">
              <Link href="/corpus" className="hover:text-green-300 transition-colors">
                Example Shard
              </Link>
              <Link href="/docs" className="hover:text-green-300 transition-colors">
                Docs
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-mono font-black mb-8 tracking-tighter"
              animate={{ 
                textShadow: [
                  '0 0 20px #22c55e',
                  '0 0 40px #22c55e, 0 0 60px #22c55e',
                  '0 0 20px #22c55e'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              HORCRUX
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Persistent personal context for agents.
              <br />
              <span className="text-green-500">A living memory interface for AI systems.</span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                href="/corpus"
                className="group px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono font-bold text-lg transition-all duration-200 border-2 border-green-400 hover:border-green-300 flex items-center gap-2"
              >
                View Example Shard
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-green-600 hover:border-green-400 text-green-400 hover:text-green-300 font-mono font-bold text-lg transition-all duration-200 hover:bg-green-900/20">
                Mint Your Shard
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-green-800/30">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Persistent Memory',
                desc: 'Version-controlled JSON corpus of your professional context'
              },
              {
                icon: Zap,
                title: 'MCP Integration',
                desc: 'Native Model Context Protocol support for agent connectivity'
              },
              {
                icon: Shield,
                title: 'Privacy Layers',
                desc: 'Public showcase + private authenticated endpoints'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
                className="border border-green-800/30 p-6 hover:border-green-600/50 transition-colors group"
              >
                <feature.icon className="w-8 h-8 mb-4 text-green-500 group-hover:text-green-400 transition-colors" />
                <h3 className="text-xl font-mono font-bold mb-2">{feature.title}</h3>
                <p className="text-green-300/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-green-800/30 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-green-500/60 font-mono text-sm">
            Made in Miami • Open Source • MCP Compatible
          </div>
        </footer>
      </div>
    </div>
  )
}
EOF

# Create corpus page
cat > app/corpus/page.tsx << 'EOF'
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
EOF

# Update globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
  
  .font-mono {
    font-family: var(--font-mono), 'Courier New', monospace;
  }
}

@layer utilities {
  .bg-noise {
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.15) 1px, transparent 0);
    background-size: 20px 20px;
  }
  
  .animate-glitch {
    animation: glitch 2s infinite;
  }
  
  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }
}
EOF

# Update tailwind config
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
export default config
EOF

# Create netlify.toml
cat > netlify.toml << 'EOF'
[build]
  command = "pnpm build"
  publish = ".next"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"

[[redirects]]
  from = "/api/rob_shard.json"
  to = "/rob_shard.json"
  status = 200
EOF

# Go back to project root
cd ../..

# Create MCP server files
cd apps/mcp

# Create FastAPI server
cat > server.py << 'EOF'
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Dict, Any, List

app = FastAPI(
    title="Horcrux MCP Server",
    description="Model Context Protocol server for Horcrux shards",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SHARD_URL = os.getenv("SHARD_URL", "https://horcrux.inc/rob_shard.json")

class MCPTool(BaseModel):
    name: str
    description: str
    inputSchema: Dict[str, Any]

class MCPCallRequest(BaseModel):
    name: str
    arguments: Dict[str, Any] = {}

@app.get("/mcp/tools")
async def list_tools() -> List[MCPTool]:
    """List available MCP tools"""
    return [
        MCPTool(
            name="get_horcrux",
            description="Retrieve the complete Horcrux shard data",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        MCPTool(
            name="search_horcrux",
            description="Search within the Horcrux shard data",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "section": {
                        "type": "string",
                        "description": "Specific section to search (skills, projects, interviews)",
                        "enum": ["skills", "projects", "interviews", "all"]
                    }
                },
                "required": ["query"]
            }
        )
    ]

@app.post("/mcp/call")
async def call_tool(request: MCPCallRequest):
    """Execute an MCP tool call"""
    if request.name == "get_horcrux":
        return await get_shard_data()
    elif request.name == "search_horcrux":
        query = request.arguments.get("query", "")
        section = request.arguments.get("section", "all")
        return await search_shard_data(query, section)
    else:
        raise HTTPException(status_code=404, detail=f"Tool {request.name} not found")

async def get_shard_data():
    """Fetch the complete shard data"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(SHARD_URL)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch shard: {str(e)}")

async def search_shard_data(query: str, section: str = "all"):
    """Search within shard data"""
    shard = await get_shard_data()
    results = []
    
    query_lower = query.lower()
    
    if section in ["all", "skills"]:
        # Search skills
        for skill_type, skills in shard.get("skills", {}).items():
            for skill in skills:
                if query_lower in skill.lower():
                    results.append({
                        "type": "skill",
                        "category": skill_type,
                        "value": skill
                    })
    
    if section in ["all", "projects"]:
        # Search projects
        for project in shard.get("projects", []):
            if (query_lower in project.get("name", "").lower() or 
                query_lower in project.get("description", "").lower() or
                any(query_lower in tech.lower() for tech in project.get("stack", []))):
                results.append({
                    "type": "project",
                    "value": project
                })
    
    if section in ["all", "interviews"]:
        # Search interviews
        for interview in shard.get("interviews", []):
            if (query_lower in interview.get("company", "").lower() or
                query_lower in interview.get("role", "").lower() or
                query_lower in interview.get("feedback", "").lower()):
                results.append({
                    "type": "interview",
                    "value": interview
                })
    
    return {
        "query": query,
        "section": section,
        "results": results,
        "count": len(results)
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "shard_url": SHARD_URL}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.2
pydantic==2.5.0
EOF

# Create render.yaml
cat > render.yaml << 'EOF'
services:
  - type: web
    name: horcrux-mcp
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: SHARD_URL
        value: https://horcrux.inc/rob_shard.json
EOF

# Go back to project root
cd ../..

# Create build tools
cat > tools/build_shard.py << 'EOF'
#!/usr/bin/env python3
"""
Build script to merge Raycast/Granola exports into rob_shard.json
"""

import json
import os
from datetime import datetime
from pathlib import Path

def build_shard():
    """Build the shard from various data sources"""
    
    # Load base shard
    base_path = Path("data/rob_shard.json")
    if base_path.exists():
        with open(base_path) as f:
            shard = json.load(f)
    else:
        shard = {"meta": {}, "skills": {}, "projects": [], "interviews": []}
    
    # Update timestamp
    shard["meta"]["updated"] = datetime.utcnow().isoformat() + "Z"
    shard["meta"]["version"] = datetime.now().strftime("%Y.%m.%d-1")
    
    # TODO: Add parsers for Raycast/Granola exports
    # parse_raycast_notes()
    # parse_granola_transcripts()
    
    # Write to public directory for Netlify
    output_path = Path("apps/web/public/rob_shard.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(shard, f, indent=2)
    
    print(f"✅ Shard built: {output_path}")
    print(f"📊 Version: {shard['meta']['version']}")
    print(f"🔄 Updated: {shard['meta']['updated']}")

if __name__ == "__main__":
    build_shard()
EOF

# Create seed data
cat > data/rob_shard.json << 'EOF'
{
  "meta": {
    "name": "Robert Melrose",
    "title": "Senior Full-Stack Engineer",
    "location": "Miami, FL",
    "updated": "2025-01-13T10:30:00Z",
    "version": "2025.01.13-1",
    "contact": {
      "linkedin": "linkedin.com/in/robertmelrose",
      "github": "github.com/robmelrose"
    }
  },
  "skills": {
    "primary": ["Next.js 15", "TypeScript", "Python", "FastAPI", "Redis", "PostgreSQL"],
    "secondary": ["Docker", "AWS", "Tailwind CSS", "Framer Motion", "Supabase"],
    "learning": ["Snowflake", "Kubernetes", "Vector Databases", "MCP Protocol"],
    "domains": ["Full-Stack Web", "API Design", "DevOps", "AI Integration"]
  },
  "projects": [
    {
      "name": "Devs.Miami",
      "stack": ["Next.js", "Supabase", "Tailwind CSS", "TypeScript"],
      "status": "Production",
      "description": "Miami developer community platform with event management and member directory",
      "highlights": ["500+ active members", "Event RSVP system", "Real-time chat"]
    },
    {
      "name": "Archaeologist",
      "stack": ["Python", "FastAPI", "Redis", "Audio Processing"],
      "status": "MVP",
      "description": "Audio processing pipeline for music analysis and batch alignment",
      "highlights": ["Real-time audio processing", "Batch job queue", "Redis caching"]
    },
    {
      "name": "Horcrux",
      "stack": ["Next.js 15", "FastAPI", "MCP", "TypeScript"],
      "status": "Active Development",
      "description": "Persistent personal context API for AI agents with MCP integration",
      "highlights": ["MCP protocol support", "Public/private data layers", "Agent Builder integration"]
    }
  ],
  "interviews": [
    {
      "company": "Top-tier Finance Firm",
      "role": "Senior Software Engineer",
      "date": "2024-12-15",
      "stage": "Technical Round 2",
      "feedback": "Strong system design and API architecture. Need deeper knowledge of distributed caching patterns.",
      "topics": ["System Design", "Caching", "Microservices", "Database Optimization"]
    },
    {
      "company": "Enterprise SaaS",
      "role": "Full-Stack Lead",
      "date": "2024-11-28",
      "stage": "Final Round",
      "feedback": "Excellent React/Next.js knowledge. Great cultural fit. Waiting on team expansion approval.",
      "topics": ["React", "Team Leadership", "Product Strategy"]
    }
  ],
  "learning_goals": [
    "Snowflake data warehouse architecture",
    "Kubernetes orchestration patterns",
    "Vector database optimization",
    "Advanced distributed systems"
  ],
  "availability": {
    "status": "Actively interviewing",
    "target_start": "2025-02-01",
    "location_preference": "Miami or Remote",
    "role_types": ["Senior Engineer", "Tech Lead", "Principal Engineer"]
  }
}
EOF

# Build the shard for the first time
python tools/build_shard.py

# Install all dependencies
pnpm install

echo "🎉 Horcrux project initialized!"
echo ""
echo "Next steps:"
echo "1. pnpm dev                    # Start development server"
echo "2. cd apps/mcp && uvicorn server:app --reload  # Start MCP server"
echo "3. Visit http://localhost:3000 to see your Horcrux"
echo ""
echo "Deploy:"
echo "- Netlify: Connect apps/web, set package directory to 'apps/web'"
echo "- Render: Connect apps/mcp, use render.yaml blueprint"
