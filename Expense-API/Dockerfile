FROM python:3.13-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY app app
COPY alembic alembic
COPY alembic.ini alembic.ini
COPY .env .env

# Run the app
CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
