"""Type validation helpers."""

from decimal import Decimal, InvalidOperation


def is_number(input):
    """Return True if the value can be parsed as a number."""
    if isinstance(input, str):
        value = input.strip()
        if not value:
            return False
        try:
            Decimal(value)
            return True
        except InvalidOperation:
            return False
    return isinstance(input, (int, float)) and not isinstance(input, bool)
