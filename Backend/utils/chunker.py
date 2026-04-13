# Backend/utils/chunker.py
"""
Splits cleaned email body text into overlapping chunks suitable
for TF-IDF model input.

Design decisions:
- Chunk by words (not characters) — TF-IDF is bag-of-words.
- Overlap of 20 words prevents context loss at boundaries.
- Max 120 words per chunk matches the training distribution of
  the bundled sklearn models (trained on short sentences/paragraphs).
"""

DEFAULT_CHUNK_SIZE = 120   # words per chunk
DEFAULT_OVERLAP    = 20    # words shared between adjacent chunks


def chunk_text(text: str, chunk_size: int = DEFAULT_CHUNK_SIZE, overlap: int = DEFAULT_OVERLAP) -> list[str]:
    """
    Split *text* into overlapping word-windows.

    Args:
        text:       Cleaned email body.
        chunk_size: Max words per chunk.
        overlap:    Words to repeat from the end of the previous chunk.

    Returns:
        List of chunk strings. Always returns at least one element.
    """
    words = text.split()

    if not words:
        return [""]

    if len(words) <= chunk_size:
        return [text]

    chunks: list[str] = []
    step = chunk_size - overlap
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end >= len(words):
            break
        start += step

    return chunks