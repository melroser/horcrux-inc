# Make sure you're in the project root
cd horcrux-inc

# Initialize git repository
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/
__pycache__/
*.pyc
.env
.env.local
.env.production.local
.env.development.local

# Next.js
apps/web/.next/
apps/web/out/
apps/web/.vercel

# Build outputs
dist/
build/
*.tsbuildinfo

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary
tmp/
temp/
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Horcrux monorepo with Next.js + FastAPI MCP server"

# Create repository on GitHub (replace YOUR_USERNAME)
# Go to github.com and create a new repository named "horcrux-inc"
# Then run:

git remote add origin https://github.com/melroser/horcrux-inc.git
git branch -M master
git push -u origin main

