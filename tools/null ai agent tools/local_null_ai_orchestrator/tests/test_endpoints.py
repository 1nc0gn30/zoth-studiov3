#!/usr/bin/env python3
"""Orchestrator test runner linking to test_zoth_studio_api."""

import sys
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(TOOLS_DIR))

from test_zoth_studio_api import *

if __name__ == "__main__":
    unittest.main(verbosity=2)
