from urllib.parse import urlparse

"""
Modulo di utilità per la normalizzazione dei dati restituiti dall'API FBI.
Estrae i soli campi visualizzati nella scheda frontend e valida gli URL.
"""


def item_to_json(item):
    """
    Riconverte l'oggetto grezzo dell'FBI in un dizionario con campi essenziali:
    titolo, descrizione, categorie (subjects), eventuale ricompensa, immagine e link ufficiale.
    """
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
    """
    Validatore di sicurezza per gli URL: ammette unicamente link HTTPS
    appartenenti al dominio ufficiale 'www.fbi.gov'.
    """
    if not isinstance(value, str):
        return ""
    parsed = urlparse(value)
    if parsed.scheme == "https" and parsed.hostname == "www.fbi.gov":
        return value
    return ""
