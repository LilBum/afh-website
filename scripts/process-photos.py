"""Rebuild every published photo from the owner's originals.

Run when new photos arrive:  python scripts/process-photos.py

Three things this guarantees, all of which matter:
  * All EXIF is dropped. iPhone originals carry GPS and the Everett address is not public.
  * Nothing is larger than it is ever displayed. The heroes render at <=560 CSS px and the
    gallery tiles at ~360, so 1200 px on the long edge is already 2x for a retina screen.
  * WebP quality is chosen per image against a size budget, because a flat quality makes
    foliage-heavy shots enormous and flat interiors needlessly small.

Open Graph images stay JPEG: some social and messaging scrapers still do not take WebP.
"""

from PIL import Image
from pathlib import Path

EVERETT_SRC = Path(
    r"C:\Users\oneco\Downloads\iCloud Photos from Gabriela  badet\iCloud Photos from Gabriela  badet"
)
LYNNWOOD_SRC = Path(
    r"C:\Users\oneco\Downloads\iCloud Photos from Gabriela  badet (1)\iCloud Photos from Gabriela  badet"
)
IMG_OUT = Path("public/assets/img")
OG_OUT = Path("public/assets/og")

MAX_EDGE = 1200
SIZE_BUDGET_KB = 200
QUALITY_START, QUALITY_FLOOR = 82, 58

# (source dir, source file, published name, fraction to crop off the top)
PHOTOS = [
    (EVERETT_SRC, "IMG_4523.JPEG", "everett-exterior", 0.0),
    (EVERETT_SRC, "IMG_4520.JPEG", "everett-garden", 0.0),
    (EVERETT_SRC, "IMG_5005.JPEG", "everett-dining", 0.0),
    (EVERETT_SRC, "IMG_6282.JPG", "everett-bedroom", 0.0),
    (EVERETT_SRC, "IMG_6280.JPG", "everett-deck", 0.0),
    (EVERETT_SRC, "IMG_6093.JPEG", "everett-deck-flowers", 0.0),
    (EVERETT_SRC, "IMG_6258.JPEG", "everett-bathroom", 0.0),
    (EVERETT_SRC, "IMG_6285.JPG", "everett-shower", 0.0),
    (LYNNWOOD_SRC, "IMG_4479.JPEG", "lynnwood-exterior", 0.0),
    (LYNNWOOD_SRC, "IMG_3985.JPG", "living-room", 0.0),
    (LYNNWOOD_SRC, "IMG_3988.JPG", "kitchen", 0.0),
    (LYNNWOOD_SRC, "IMG_3974.PNG", "dining-room", 0.0),
    (LYNNWOOD_SRC, "IMG_6307.JPG", "lynnwood-bedroom", 0.0),
    (LYNNWOOD_SRC, "IMG_6301.JPEG", "lynnwood-bathroom", 0.0),
    (LYNNWOOD_SRC, "IMG_6302.JPEG", "lynnwood-shower", 0.0),
    (LYNNWOOD_SRC, "IMG_4230.JPG", "back-deck", 0.0),
    (LYNNWOOD_SRC, "IMG_5421_Original.JPG", "celebration-table", 0.0),
    # A dumpster and portable toilet next door sit above the fence line in this one.
    (LYNNWOOD_SRC, "IMG_4229.JPG", "lynnwood-fountain", 0.34),
]

# Social preview images, cropped to the 1200x630 Open Graph standard. The bias picks how far
# down the portrait source to take the band from, so the house lands in frame.
OG_IMAGES = [
    ("living-room", "og-home.jpg", 0.38),
    ("lynnwood-exterior", "og-lynnwood.jpg", 0.52),
    ("everett-exterior", "og-everett.jpg", 0.38),
]


def load(src_dir: Path, name: str, crop_top: float) -> Image.Image:
    im = Image.open(src_dir / name).convert("RGB")
    if crop_top:
        w, h = im.size
        im = im.crop((0, round(h * crop_top), w, h))
    w, h = im.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    return im


def save_webp(im: Image.Image, out: Path) -> tuple[int, int]:
    """Step quality down until the file fits the budget. Returns (quality, bytes)."""
    quality = QUALITY_START
    while True:
        # No exif= argument, so all metadata is dropped.
        im.save(out, "WEBP", quality=quality, method=6)
        size = out.stat().st_size
        if size <= SIZE_BUDGET_KB * 1024 or quality <= QUALITY_FLOOR:
            return quality, size
        quality -= 6


def main() -> None:
    IMG_OUT.mkdir(parents=True, exist_ok=True)
    OG_OUT.mkdir(parents=True, exist_ok=True)

    total = 0
    for src_dir, src_name, out_name, crop_top in PHOTOS:
        im = load(src_dir, src_name, crop_top)
        quality, size = save_webp(im, IMG_OUT / f"{out_name}.webp")
        total += size
        print(f"{out_name + '.webp':28} {im.size[0]:>4}x{im.size[1]:<5} q={quality:<3} {size / 1024:6.0f} KB")

    print(f"\n{len(PHOTOS)} photos, {total / 1024:.0f} KB total\n")

    for base, out_name, bias in OG_IMAGES:
        src = next(d / f for d, f, n, _ in PHOTOS if n == base)
        src_dir = next(d for d, f, n, _ in PHOTOS if n == base)
        crop_top = next(c for _, _, n, c in PHOTOS if n == base)
        im = load(src_dir, Path(src).name, crop_top)
        tw, th = 1200, 630
        w, h = im.size
        scale = max(tw / w, th / h)
        nw, nh = round(w * scale), round(h * scale)
        im = im.resize((nw, nh), Image.LANCZOS)
        left = (nw - tw) // 2
        top = max(0, min(nh - th, int((nh - th) * bias)))
        im = im.crop((left, top, left + tw, top + th))
        out = OG_OUT / out_name
        im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{out_name:28} 1200x630       {out.stat().st_size / 1024:6.0f} KB")


if __name__ == "__main__":
    main()
