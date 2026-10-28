from urllib.parse import urlparse


def item_to_json(item):
    # Riduciamo la risposta dell'API ai soli campi usati dalla pagina.
    images = item.get("images") or []
    image_url = ""
    if images and isinstance(images[0], dict):
        image_url = safe_fbi_url(images[0].get("large") or images[0].get("thumb"))

    subjects = item.get("subjects")
    if not isinstance(subjects, list):
        subjects = []

    return {
        "title": item.get("title") or "Scheda FBI",
        "description": item.get("description") or "",
        "subjects": subjects,
        "reward": item.get("reward_text") or "",
        "image": image_url,
        "url": safe_fbi_url(item.get("url")),
    }


def safe_fbi_url(value):
    # Accettiamo solo link HTTPS del dominio FBI prima di inserirli nella risposta
    if not isinstance(value, str):
        return ""
    parsed = urlparse(value)
    if parsed.scheme == "https" and parsed.hostname == "www.fbi.gov":
        return value
    return ""
