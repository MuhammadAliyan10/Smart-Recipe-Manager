from slowapi import Limiter
from slowapi.util import get_remote_address

# Global limiter
limiter = Limiter(key_func=get_remote_address)

# User-based limiter
user_limiter = Limiter(key_func=lambda: str(g.user_id))
