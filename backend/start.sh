#!/usr/bin/env bash
# Démarre l'API Supply Chain Radar (vérifie que app.main est importable).
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f app/main.py ]]; then
  echo "ERREUR: app/main.py introuvable. Depuis la racine du repo :"
  echo "  git checkout HEAD -- backend/"
  exit 1
fi

if [[ -f venv/bin/activate ]]; then
  # shellcheck disable=SC1091
  source venv/bin/activate
fi

python3 -c "import app.main; print('Import OK:', app.main.app.title)"

exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload "$@"
