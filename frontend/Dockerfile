FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
# Copiamos todo el contenido de la carpeta frontend. Algunas instalaciones no tienen
# `static` o `templates` como carpetas separadas, por eso copiamos el contexto completo.
COPY . /app
EXPOSE 5000
ENV FLASK_ENV=production
CMD ["python","-m","src.index"]
