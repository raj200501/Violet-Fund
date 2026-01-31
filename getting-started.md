# Getting Started

This guide assumes a completely fresh machine and walks you through installing prerequisites and running the VioletFund repo locally.

---

## macOS (recommended)

```bash
# 1) Install Apple Command Line Tools (NOT the Xcode IDE)
xcode-select --install

# 2) Install Homebrew (skip if you already have it)
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3) Install Git (optional but recommended)
brew install git

# 4) Install Docker Desktop
brew install --cask docker

# 5) Start Docker Desktop (required once so the Docker engine is running)
open -a Docker

# 6) Verify Docker works
docker --version
docker compose version

# If you see: zsh: command not found: docker (even though Docker Desktop is running)
echo 'export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
hash -r
docker --version
docker compose version

# 7) Clone and run the repo
git clone <REPO_URL>
cd <REPO_DIR>

cp .env.example .env
make dev

# Open:
# - Web: http://localhost:3000
# - API Docs: http://localhost:8000/docs
```

---

## Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y git docker.io docker-compose-plugin

# Allow running docker without sudo
sudo usermod -aG docker "$USER"
newgrp docker

docker --version
docker compose version

git clone <REPO_URL>
cd <REPO_DIR>

cp .env.example .env
make dev
```

---

## Windows (PowerShell)

```powershell
winget install -e --id Git.Git
winget install -e --id Docker.DockerDesktop

# Restart terminal after installs
docker --version
docker compose version

git clone <REPO_URL>
cd <REPO_DIR>

copy .env.example .env
make dev
```

---

## Common commands

```bash
# Stop containers
docker compose down

# Rebuild + start
docker compose up --build

# Follow logs
docker compose logs -f web
docker compose logs -f api

# List running containers
docker compose ps
```
