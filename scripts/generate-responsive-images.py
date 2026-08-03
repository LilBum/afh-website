#!/usr/bin/env python3
"""Generate responsive WebP and AVIF derivatives from published images."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_DIR = REPO_ROOT / "public" / "assets" / "img"
DEFAULT_OUTPUT_DIR = DEFAULT_SOURCE_DIR / "responsive"
DEFAULT_WIDTHS = (480, 768, 960)


def parse_widths(value: str) -> tuple[int, ...]:
    """Parse a comma-separated list of positive widths."""
    try:
        widths = tuple(sorted({int(width.strip()) for width in value.split(",")}))
    except ValueError as error:
        raise argparse.ArgumentTypeError("widths must be comma-separated integers") from error

    if not widths or any(width <= 0 for width in widths):
        raise argparse.ArgumentTypeError("widths must contain positive integers")

    return widths


def save_variant(image: Image.Image, destination: Path, image_format: str, quality: int) -> None:
    """Encode an image without forwarding metadata from its source."""
    destination.parent.mkdir(parents=True, exist_ok=True)
    if image_format == "AVIF":
        image.save(destination, format=image_format, quality=quality, speed=6)
    else:
        image.save(destination, format=image_format, quality=quality, method=6, optimize=True)


def validate_variant(path: Path, expected_size: tuple[int, int]) -> None:
    """Ensure a derivative decodes at the expected size and carries no source metadata."""
    with Image.open(path) as image:
        image.load()
        if image.size != expected_size:
            raise RuntimeError(f"{path} is {image.size}, expected {expected_size}")
        if image.getexif() or {'exif', 'xmp', 'icc_profile'}.intersection(image.info):
            raise RuntimeError(f"{path} contains metadata")


def display_path(path: Path) -> str:
    try:
        return path.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--widths", type=parse_widths, default=DEFAULT_WIDTHS)
    parser.add_argument("--quality", type=int, default=76)
    parser.add_argument("--avif-quality", type=int, default=45)
    args = parser.parse_args()
    args.source = args.source.resolve()
    args.output = args.output.resolve()

    if not 1 <= args.quality <= 100:
        parser.error("quality must be between 1 and 100")
    if not 1 <= args.avif_quality <= 100:
        parser.error("avif-quality must be between 1 and 100")

    sources = sorted(args.source.glob("*.webp"))
    if not sources:
        parser.error(f"no WebP images found in {args.source}")

    webp_generated = 0
    avif_generated = 0
    comparisons: dict[str, tuple[int, int]] = {}
    for source in sources:
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).copy()
        source_width, source_height = image.size

        # The natural-width candidate prevents high-density displays from upscaling the
        # largest responsive derivative when the browser selects the AVIF source set.
        natural_avif = args.output / f"{source.stem}-{source_width}.avif"
        save_variant(image, natural_avif, "AVIF", args.avif_quality)
        validate_variant(natural_avif, (source_width, source_height))
        print(
            f"{display_path(natural_avif)}\t{source_width}x{source_height}\t"
            f"{natural_avif.stat().st_size / 1024:.1f} KiB"
        )
        comparisons[source.stem] = (source.stat().st_size, natural_avif.stat().st_size)
        avif_generated += 1

        for width in args.widths:
            if width >= source_width:
                continue

            height = round(source_height * width / source_width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            webp_destination = args.output / f"{source.stem}-{width}.webp"
            avif_destination = args.output / f"{source.stem}-{width}.avif"
            save_variant(resized, webp_destination, "WEBP", args.quality)
            save_variant(resized, avif_destination, "AVIF", args.avif_quality)
            validate_variant(webp_destination, (width, height))
            validate_variant(avif_destination, (width, height))
            print(
                f"{display_path(webp_destination)}\t{width}x{height}\t"
                f"{webp_destination.stat().st_size / 1024:.1f} KiB"
            )
            print(
                f"{display_path(avif_destination)}\t{width}x{height}\t"
                f"{avif_destination.stat().st_size / 1024:.1f} KiB"
            )
            webp_generated += 1
            avif_generated += 1
            webp_bytes, avif_bytes = comparisons[source.stem]
            comparisons[source.stem] = (
                webp_bytes + webp_destination.stat().st_size,
                avif_bytes + avif_destination.stat().st_size,
            )

    print(
        f"Generated {webp_generated} WebPs and {avif_generated} AVIFs "
        f"from {len(sources)} sources."
    )
    print("Validated every derivative's decode, dimensions, and metadata.")
    webp_total = sum(webp_bytes for webp_bytes, _ in comparisons.values())
    avif_total = sum(avif_bytes for _, avif_bytes in comparisons.values())
    print(
        f"Comparable candidates: {webp_total / 1024:.1f} KiB WebP -> "
        f"{avif_total / 1024:.1f} KiB AVIF "
        f"({(webp_total - avif_total) / webp_total:.1%} smaller)."
    )
    for stem, (webp_bytes, avif_bytes) in sorted(comparisons.items()):
        savings = (webp_bytes - avif_bytes) / webp_bytes
        print(
            f"{stem:24} {webp_bytes / 1024:7.1f} -> "
            f"{avif_bytes / 1024:7.1f} KiB ({savings:5.1%})"
        )


if __name__ == "__main__":
    main()
