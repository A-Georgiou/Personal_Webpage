#!/usr/bin/env bash
# Serve the site locally for design work: ./scripts/serve.sh [port]
set -euo pipefail

port="${1:-8000}"
cd "$(git rev-parse --show-toplevel)"

echo "Serving $(pwd) at http://localhost:${port}"
exec python3 -m http.server "$port"
