"""Null AI Agent Runtime — lightweight agent that uses the orchestrator.

This is a minimal agent runtime that discovers, runs, and chains tools
through the orchestrator. It's designed to be:
- Self-contained (stdlib only)
- Prompt-driven (accepts JSON or natural language tasks)
- Chain-aware (can run multi-step pipelines)
- Report-capable (logs everything to runs/)
"""

from __future__ import annotations

__version__ = "0.1.0"
