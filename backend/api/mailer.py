
import requests
import os

MAILERSEND_TOKEN = os.getenv("MAILERSEND_TOKEN")

def send_invite(email, code):
    url = "https://api.mailersend.com/v1/email"
    headers = {
        "Authorization": f"Bearer {MAILERSEND_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "from": {"email": "noreply@endless.com"},
        "to": [{"email": email}],
        "subject": "Ваш инвайт в Endless",
        "text": f"Присоединяйтесь по коду: {code}"
    }
    r = requests.post(url, headers=headers, json=data)
    return r.status_code
