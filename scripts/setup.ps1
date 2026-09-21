# Environment & Workspace Setup Script
Write-Host "Setting up RestaurantApp Monorepo Workspace..." -ForegroundColor Green

# 1. Install dependencies across packages
pnpm install

# 2. Generate Prisma Client
Set-Location -Path "Backend"
npx prisma generate
Set-Location -Path ".."

Write-Host "Setup complete! Run .\scripts\dev.ps1 to start dev servers." -ForegroundColor Green
