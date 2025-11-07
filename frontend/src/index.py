from .app import create_app
from os import getenv
from pathlib import Path
import secrets

app = create_app()
env_secret = getenv("FLASK_SECRET_KEY")
if env_secret:
    app.secret_key = env_secret
else:
    secret_file = Path(__file__).resolve().parent / ".flask_secret"
    try:
        if secret_file.exists():
            app.secret_key = secret_file.read_text(encoding="utf-8").strip()
        else:
            s = secrets.token_urlsafe(48)
            secret_file.write_text(s, encoding="utf-8")
            app.secret_key = s
    except Exception:
        app.secret_key = secrets.token_urlsafe(48)

app.config["SESSION_TYPE"] = getenv("FLASK_SESSION_TYPE", "filesystem")

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, host="0.0.0.0")