import sys
import os

# Add the parent directory to the python path so it can import cache, simulator, etc.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app
