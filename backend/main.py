"""Entrypoint alias to support `uvicorn main:app`."""
from server import app

__all__ = ["app"]
