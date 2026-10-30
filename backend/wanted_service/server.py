from datetime import date
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from utils.converter import item_to_json

FBI_API_URL = "https://api.fbi.gov/wanted/v1/list"

# Caricamento variabili d'ambiente da .env locale (se presente)
env_file = Path(__file__).resolve().parent / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

PORT = int(os.environ.get("WANTED_PORT", "3002"))
PUBLIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public"


def get_daily_item():
    """
    Interroga l'API pubblica dell'FBI per estrarre la lista dei ricercati.
    Seleziona deterministicamente la scheda del giorno in base alla data odierna,
    privilegiando i soggetti contrassegnati con poster_classification 'wanted'.
    """
    request = Request(
        FBI_API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "FBI-Wanted-Daily-Service/1.0",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            payload = json.load(response)
    except Exception as error:
        raise RuntimeError("Impossibile contattare l'API FBI.") from error

    items = payload.get("items") if isinstance(payload, dict) else None
    if not isinstance(items, list):
        raise RuntimeError("La risposta dell'API FBI non contiene una lista valida.")

    valid_items = [item for item in items if isinstance(item, dict)]

    # Filtra solo i soggetti ricercati attivi
    wanted_items = [
        item
        for item in valid_items
        if str(item.get("poster_classification", "")).lower() == "wanted"
    ]

    candidates = wanted_items or valid_items
    if not candidates:
        raise RuntimeError("L'API FBI non ha restituito schede disponibili.")

    # Algoritmo deterministico giornaliero: stesso soggetto per tutti gli utenti nella stessa data
    return candidates[(date.today().toordinal() - 1) % len(candidates)]


class WantedHandler(SimpleHTTPRequestHandler):
    """
    Gestore HTTP per il servizio Wanted:
    - Serve i file statici della cartella frontend/public
    - GET / o vuoto: serve FBI.html
    - GET /api/wanted/today: restituisce la scheda del ricercato del giorno in JSON
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def send_content(self, content, content_type, status=200):
        encoded = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlparse(self.path).path

        if path in ("/", ""):
            self.path = "/FBI.html"

        if path == "/api/wanted/today":
            try:
                person = item_to_json(get_daily_item())
            except RuntimeError as error:
                print(f"Errore API FBI: {error}", flush=True)
                body = json.dumps({"error": str(error)}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", 502)
                return

            body = json.dumps(person, ensure_ascii=False)
            self.send_content(body, "application/json; charset=utf-8")
            return

        super().do_GET()


if __name__ == "__main__":
    print(f"Wanted service avviato su http://localhost:{PORT}", flush=True)
    HTTPServer(("0.0.0.0", PORT), WantedHandler).serve_forever()
