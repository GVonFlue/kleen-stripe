"""
Builds the ADA parking walk-around, the site's lead magnet.

Every figure here comes from the 2010 ADA Standards for Accessible Design
(sections 208 and 502) and from nothing else. No number in this file came from
Devin, from a competitor site, or from memory. That matters because doctrine
hard stop 1 forbids inventing a fact, and because lead_magnet.content_gate said
every figure had to be verified against the 2010 Standards before it was
written. Sources, per line:

  Table 208.2          minimum accessible spaces by total spaces in the facility
  208.2.4              one van space per six accessible spaces, or fraction of six
  208.3.1              located on the shortest accessible route to an accessible entrance
  502.2                car space 96 in min wide, van space 132 in min wide,
                       or 96 in wide beside a 96 in access aisle
  502.3.1 / 502.3.2    access aisle 60 in min wide, full length of the space it serves
  502.3.3              aisle marked so it is not mistaken for a parking space
  502.4                surface slope not steeper than 1:48 in any direction
  502.6                ISA sign, bottom edge 60 in min above the ground,
                       van spaces additionally designated "van accessible"
  402.2 / 403.3        accessible route, running slope 1:20 max unless it is a ramp,
                       cross slope 1:48 max

Run: python3 scripts/build-lead-magnet.py
Out: public/downloads/kleen-stripe-ada-parking-walkaround.pdf
"""

import json
import os
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = json.load(open(os.path.join(ROOT, "content", "kleen-stripe.json")))

BIZ = CONTENT["business"]
COLORS = CONTENT["brand"]["colors"]
INK = HexColor(COLORS["ink"])
ACCENT = HexColor(COLORS["accent"])
ADA = HexColor(COLORS["ada"])
ASPHALT = HexColor(COLORS["asphalt"])
LINE = HexColor(COLORS["line"])
SUBTLE = HexColor(COLORS["subtle"])

OUT_DIR = os.path.join(ROOT, "public", "downloads")
OUT = os.path.join(OUT_DIR, "kleen-stripe-ada-parking-walkaround.pdf")

W, H = LETTER
M = 0.6 * inch

# Table 208.2, verbatim scoping. Left column is total spaces in the parking
# facility, middle is minimum accessible spaces, right is minimum van spaces.
TABLE_208_2 = [
    ("1 to 25", "1", "1"),
    ("26 to 50", "2", "1"),
    ("51 to 75", "3", "1"),
    ("76 to 100", "4", "1"),
    ("101 to 150", "5", "1"),
    ("151 to 200", "6", "1"),
    ("201 to 300", "7", "2"),
    ("301 to 400", "8", "2"),
    ("401 to 500", "9", "2"),
    ("501 to 1000", "2% of the total", "1 of every 6"),
    ("1001 and over", "20, plus 1 per 100 over 1000", "1 of every 6"),
]

CHECKS = [
    (
        "Stall width",
        "A car accessible space is at least 96 inches wide. A van accessible space is at "
        "least 132 inches wide, or 96 inches wide if its access aisle is also 96 inches.",
    ),
    (
        "The access aisle",
        "At least 60 inches wide, running the full length of the space it serves, and marked "
        "so nobody reads it as a parking space. Two spaces may share one aisle.",
    ),
    (
        "Slope",
        "No steeper than 1:48 in any direction, across the space and the aisle both. This is "
        "the one that catches lots that passed years ago: asphalt settles.",
    ),
    (
        "Signage",
        "Each space is marked with the International Symbol of Accessibility on a sign, with "
        "the bottom edge at least 60 inches above the ground. Van spaces say van accessible.",
    ),
    (
        "The route to the door",
        "Accessible spaces sit on the shortest accessible route to an accessible entrance. "
        "The route runs no steeper than 1:20 unless it is a ramp, with cross slope no steeper "
        "than 1:48, and it does not make anyone travel behind parked cars.",
    ),
    (
        "Count it again after a restripe",
        "Adding spaces changes what the table requires. A lot that gains stalls in a restripe "
        "can cross a threshold and come up a space short without anyone noticing.",
    ),
]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    c = canvas.Canvas(OUT, pagesize=LETTER)
    c.setTitle("The ADA parking walk-around")
    c.setAuthor(BIZ["name"])
    c.setSubject("A one page ADA parking walk-around for Kansas commercial lots")

    # Header band. Black with the yellow rule under it, the same two moves the
    # site makes at the top of every dark section.
    band_h = 1.02 * inch
    c.setFillColor(ASPHALT)
    c.rect(0, H - band_h, W, band_h, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(0, H - band_h - 5, W, 5, stroke=0, fill=1)

    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(M, H - 0.52 * inch, "KLEEN STRIPE")
    c.setFillColor(white)
    c.setFont("Helvetica", 9.5)
    c.drawString(M, H - 0.74 * inch, "The ADA parking walk-around")
    c.setFont("Helvetica", 9.5)
    c.drawRightString(W - M, H - 0.52 * inch, BIZ["phone_display"])
    c.setFont("Helvetica", 8.5)
    c.setFillColor(HexColor(COLORS["asphalt_muted"]))
    c.drawRightString(W - M, H - 0.72 * inch, "Wichita, Kansas")

    y = H - band_h - 0.42 * inch

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(M, y, "Take this outside and look at your own lot.")
    y -= 0.2 * inch
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#444444"))
    for line in [
        "Every figure below is from the 2010 ADA Standards for Accessible Design, sections 208 and 502. Count your",
        "total spaces first. That number is what decides everything in the table.",
    ]:
        c.drawString(M, y, line)
        y -= 0.155 * inch

    y -= 0.12 * inch

    # ---- Table 208.2 -------------------------------------------------------
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(M, y, "1.  How many accessible spaces your lot has to have")
    y -= 0.055 * inch

    table_top = y
    col_x = [M, M + 2.5 * inch, M + 5.0 * inch]
    row_h = 0.205 * inch
    head_h = 0.24 * inch

    c.setFillColor(ASPHALT)
    c.rect(M, table_top - head_h, W - 2 * M, head_h, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(col_x[0] + 6, table_top - head_h + 0.082 * inch, "TOTAL SPACES IN THE LOT")
    c.drawString(col_x[1] + 6, table_top - head_h + 0.082 * inch, "MINIMUM ACCESSIBLE")
    c.drawString(col_x[2] + 6, table_top - head_h + 0.082 * inch, "OF THOSE, VAN")

    y = table_top - head_h
    for i, (total, acc, van) in enumerate(TABLE_208_2):
        if i % 2 == 1:
            c.setFillColor(SUBTLE)
            c.rect(M, y - row_h, W - 2 * M, row_h, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawString(col_x[0] + 6, y - row_h + 0.062 * inch, total)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(col_x[1] + 6, y - row_h + 0.062 * inch, acc)
        c.setFont("Helvetica", 9)
        c.drawString(col_x[2] + 6, y - row_h + 0.062 * inch, van)
        y -= row_h

    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.rect(M, y, W - 2 * M, table_top - y, stroke=1, fill=0)

    y -= 0.16 * inch
    c.setFillColor(ADA)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(
        M,
        y,
        "One of every six accessible spaces, or fraction of six, has to be van accessible.",
    )
    y -= 0.14 * inch
    c.setFillColor(HexColor("#444444"))
    c.setFont("Helvetica", 8.5)
    c.drawString(
        M,
        y,
        "Count each parking facility on its own. Two separate lots on one site are counted separately, not added together.",
    )

    y -= 0.3 * inch

    # ---- The five checks ---------------------------------------------------
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(M, y, "2.  Then walk it, in this order")
    y -= 0.22 * inch

    body_w = W - 2 * M - 0.28 * inch
    for title, text in CHECKS:
        c.setFillColor(ACCENT)
        c.rect(M, y - 0.035 * inch, 0.11 * inch, 0.11 * inch, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(M + 0.24 * inch, y, title)
        y -= 0.145 * inch
        c.setFont("Helvetica", 8.8)
        c.setFillColor(HexColor("#3A3A3A"))
        for line in wrap(c, text, "Helvetica", 8.8, body_w):
            c.drawString(M + 0.24 * inch, y, line)
            y -= 0.135 * inch
        y -= 0.085 * inch

    # ---- Worksheet ---------------------------------------------------------
    # The point of a one page walk-around is that somebody carries it outside on
    # a clipboard. Without somewhere to write the two numbers down it is a
    # reference sheet, not a walk-around, so this is the part that earns the
    # print.
    y -= 0.08 * inch
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(M, y, "3.  Write it down while you are standing there")
    y -= 0.17 * inch
    c.setFont("Helvetica", 8.5)
    c.setFillColor(HexColor("#444444"))
    c.drawString(
        M,
        y,
        "If the counted number is under the required number, that gap is the job. Text the photo and these figures and you get a number back.",
    )
    y -= 0.22 * inch

    box_h = 1.14 * inch
    box_top = y
    c.setFillColor(SUBTLE)
    c.rect(M, box_top - box_h, W - 2 * M, box_h, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.rect(M, box_top - box_h, W - 2 * M, box_h, stroke=1, fill=0)

    fields = [
        ("Total spaces I counted", "Accessible spaces I counted"),
        ("Accessible the table requires", "Van spaces I counted"),
        ("Van spaces the table requires", "Signs missing or too low"),
    ]
    fy = box_top - 0.27 * inch
    for left, right in fields:
        for label, x in ((left, M + 0.22 * inch), (right, M + 3.9 * inch)):
            c.setFillColor(HexColor("#3A3A3A"))
            c.setFont("Helvetica", 8.6)
            c.drawString(x, fy, label)
            lx = x + 1.85 * inch
            c.setStrokeColor(HexColor("#999999"))
            c.setLineWidth(0.8)
            c.line(lx, fy - 0.02 * inch, lx + 1.0 * inch, fy - 0.02 * inch)
        fy -= 0.33 * inch

    # ---- Footer ------------------------------------------------------------
    foot_h = 0.86 * inch
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, foot_h, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(M, foot_h - 0.3 * inch, "Not sure what you are looking at? Send a photo of the lot and the address.")
    c.setFont("Helvetica", 9.5)
    c.drawString(
        M,
        foot_h - 0.5 * inch,
        "Call or text {phone}. {name}, striping Wichita lots since {year}.".format(
            phone=BIZ["phone_display"], name=BIZ["name"], year=BIZ["founded_year"]
        ),
    )
    c.setFont("Helvetica", 7.2)
    c.setFillColor(HexColor("#555500"))
    c.drawString(
        M,
        0.19 * inch,
        "A walk-around, not a legal audit. Figures are from the 2010 ADA Standards for Accessible Design, sections 208 and 502. "
        "Older lots may have different obligations.",
    )

    c.showPage()
    c.save()
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


def wrap(c, text, font, size, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


if __name__ == "__main__":
    main()
