"""Phone number parsing and normalization utilities."""

import phonenumbers


def normalize_phone_number(number: str | None):
    """Validate and normalize a phone number to E.164 format without '+'."""
    if number is None:
        return number

    number = number.strip()

    if not number.startswith("+"):
        number = f"+{number}"

    try:
        parsed = phonenumbers.parse(number, None)

        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("Invalid mobile number")

        e164 = phonenumbers.format_number(
            parsed,
            phonenumbers.PhoneNumberFormat.E164,
        )

        return e164.lstrip("+")
    except phonenumbers.NumberParseException:
        raise ValueError("Invalid mobile number (must include country code)")
