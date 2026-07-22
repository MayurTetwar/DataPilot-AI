import modal

# ─────────────────────────────────────────────
# Define the container image
# Install all your dependencies
# ─────────────────────────────────────────────
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install([
        "fastapi>=0.111.0",
        "uvicorn[standard]>=0.29.0",
        "python-multipart>=0.0.9",
        "pydantic>=2.7.0",
        "pydantic-ai[google]>=0.0.14",
        "pandas>=2.2.0",
        "numpy>=1.26.0",
        "scikit-learn>=1.4.0",
        "openpyxl>=3.1.0",
        "python-dateutil>=2.9.0",
        "python-dotenv>=1.0.0",
        "uuid6>=2024.1.12",
    ]).add_local_dir(".", remote_path="/root")
)

app = modal.App(
    name="datapilot-backend",
    image=image,
)


# ─────────────────────────────────────────────
# The FastAPI web endpoint
# ─────────────────────────────────────────────
@app.function(
    timeout=300,          # 5 minutes max per request
)
@modal.concurrent(max_inputs=10)
@modal.asgi_app()
def fastapi_app():
    from main import app as _app
    return _app