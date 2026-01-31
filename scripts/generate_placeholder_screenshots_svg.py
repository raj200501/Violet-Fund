from __future__ import annotations

from pathlib import Path

pages = [
    "landing",
    "dashboard-cards",
    "dashboard-table",
    "opportunity-detail",
    "tracker",
    "labeling",
    "profile-wizard",
]

viewports = {
    "desktop": (1440, 900),
    "mobile": (390, 844),
}

themes = ["light", "dark"]

output_dir = Path("docs/screenshots")
output_dir.mkdir(parents=True, exist_ok=True)

for page in pages:
    for theme in themes:
        for viewport_name, size in viewports.items():
            width, height = size
            background = "#f5f4fb" if theme == "light" else "#0b1120"
            accent = "#7c3aed" if theme == "light" else "#a78bfa"

            svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>
  <rect width='100%' height='100%' fill='{background}'/>
  <rect x='24' y='24' width='{width - 48}' height='{height - 48}' fill='none' stroke='{accent}' stroke-width='4'/>
  <rect x='60' y='90' width='{width - 120}' height='{height - 180}' fill='none' stroke='{accent}' stroke-width='2' opacity='0.7'/>
  <text x='80' y='160' fill='{accent}' font-size='28' font-family='Inter, sans-serif'>VioletFund UI Preview</text>
  <text x='80' y='210' fill='{accent}' font-size='20' font-family='Inter, sans-serif'>Page: {page}</text>
  <text x='80' y='250' fill='{accent}' font-size='20' font-family='Inter, sans-serif'>Theme: {theme}</text>
  <text x='80' y='290' fill='{accent}' font-size='20' font-family='Inter, sans-serif'>Viewport: {viewport_name}</text>
</svg>
"""
            filename = f"{page}-{theme}-{viewport_name}.svg"
            (output_dir / filename).write_text(svg)

print(f"Generated {len(list(output_dir.glob('*.svg')))} SVG previews in {output_dir}.")
