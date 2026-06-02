#!/bin/bash
# PRISM — Oracle Cloud Ubuntu 22.04 Setup Script
# Run as: bash setup-oracle.sh

set -e

echo "=== PRISM Oracle Cloud Setup ==="

# 1. System update
echo "[1/7] Updating system..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

# 2. Install dependencies for Playwright/Chromium
echo "[2/7] Installing browser dependencies..."
sudo apt-get install -y -qq \
  ca-certificates curl gnupg git unzip \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2 \
  libpangocairo-1.0-0 libgtk-3-0 libx11-xcb1 \
  fonts-liberation xdg-utils wget

# 3. Install Bun
echo "[3/7] Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
bun --version

# 4. Clone repo
echo "[4/7] Cloning PRISM repo..."
cd /home/ubuntu
git clone https://github.com/designbyfatur/prism.git
cd prism

# 5. Install dependencies
echo "[5/7] Installing dependencies..."
bun install

# 6. Install Playwright browsers (Chromium only)
echo "[6/7] Installing Playwright Chromium..."
cd apps/worker
bunx playwright install chromium
bunx playwright install-deps chromium
cd /home/ubuntu/prism

# 7. Configure environment
echo "[7/7] Setting up environment..."
cat > apps/worker/.env << 'ENVEOF'
# FILL IN YOUR FIREBASE SERVICE ACCOUNT KEY (minified JSON)
FIREBASE_SERVICE_ACCOUNT_KEY=REPLACE_WITH_YOUR_KEY

# FILL IN YOUR ENCRYPTION KEY (same as local)
ENCRYPTION_KEY=REPLACE_WITH_YOUR_KEY

# Cloud mode — disable capture server (capture runs locally)
ENABLE_CAPTURE_SERVER=false
WORKER_POLL_INTERVAL_MS=60000
ENVEOF

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "1. Edit apps/worker/.env — fill in FIREBASE_SERVICE_ACCOUNT_KEY and ENCRYPTION_KEY"
echo "   nano apps/worker/.env"
echo ""
echo "2. Install systemd service:"
echo "   sudo cp apps/worker/prism-worker.service /etc/systemd/system/"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable prism-worker"
echo "   sudo systemctl start prism-worker"
echo ""
echo "3. Check status:"
echo "   sudo systemctl status prism-worker"
echo "   sudo journalctl -u prism-worker -f"
