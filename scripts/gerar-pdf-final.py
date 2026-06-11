from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUTPUT = DOCS / "pdf" / "trabalho-final.pdf"
DIAGRAMS = DOCS / "diagramas" / "renderizados"


def build_styles():
    base = getSampleStyleSheet()
    base["Title"].fontName = "Helvetica-Bold"
    base["Title"].fontSize = 22
    base["Title"].leading = 28
    base["Title"].alignment = TA_CENTER

    base["Heading1"].fontName = "Helvetica-Bold"
    base["Heading1"].fontSize = 15
    base["Heading1"].leading = 19
    base["Heading1"].spaceBefore = 14
    base["Heading1"].spaceAfter = 8

    base["Heading2"].fontName = "Helvetica-Bold"
    base["Heading2"].fontSize = 12
    base["Heading2"].leading = 16
    base["Heading2"].spaceBefore = 10
    base["Heading2"].spaceAfter = 6

    base["BodyText"].fontName = "Helvetica"
    base["BodyText"].fontSize = 9.5
    base["BodyText"].leading = 13
    base["BodyText"].alignment = TA_LEFT
    base["BodyText"].spaceAfter = 5

    base.add(
        ParagraphStyle(
            name="Small",
            parent=base["BodyText"],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#334155"),
        )
    )
    base.add(
        ParagraphStyle(
            name="CodeBlock",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=9,
            backColor=colors.HexColor("#f8fafc"),
            borderColor=colors.HexColor("#cbd5e1"),
            borderWidth=0.5,
            borderPadding=5,
        )
    )
    return base


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("`", "")
        .replace("**", "")
    )


def markdown_to_flowables(path: Path, styles):
    story = []
    in_code = False
    code_lines = []
    bullets = []

    def flush_bullets():
        nonlocal bullets
        if bullets:
            story.append(
                ListFlowable(
                    [ListItem(Paragraph(esc(item), styles["BodyText"])) for item in bullets],
                    bulletType="bullet",
                    leftIndent=16,
                )
            )
            bullets = []

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()

        if line.startswith("```"):
            if in_code:
                story.append(Preformatted("\n".join(code_lines), styles["CodeBlock"]))
                story.append(Spacer(1, 6))
                code_lines = []
                in_code = False
            else:
                flush_bullets()
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            flush_bullets()
            story.append(Spacer(1, 4))
            continue

        if line.startswith("# "):
            flush_bullets()
            story.append(Paragraph(esc(line[2:]), styles["Title"]))
            story.append(Spacer(1, 12))
            continue

        if line.startswith("## "):
            flush_bullets()
            story.append(Paragraph(esc(line[3:]), styles["Heading1"]))
            continue

        if line.startswith("### "):
            flush_bullets()
            story.append(Paragraph(esc(line[4:]), styles["Heading2"]))
            continue

        if line.startswith("- ["):
            bullets.append(line.replace("- [ ]", "[ ]").replace("- [x]", "[x]").strip())
            continue

        if line.startswith("- "):
            bullets.append(line[2:])
            continue

        story.append(Paragraph(esc(line), styles["BodyText"]))

    flush_bullets()
    return story


def add_diagram(story, styles, title: str, image_name: str):
    image_path = DIAGRAMS / image_name
    if not image_path.exists():
        return

    story.append(PageBreak())
    story.append(Paragraph(title, styles["Heading1"]))
    story.append(Spacer(1, 8))

    img = Image(str(image_path))
    max_w = A4[0] - 3.4 * cm
    max_h = A4[1] - 6.0 * cm
    ratio = min(max_w / img.imageWidth, max_h / img.imageHeight)
    img.drawWidth = img.imageWidth * ratio
    img.drawHeight = img.imageHeight * ratio
    story.append(KeepTogether([img]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"Arquivo: docs/diagramas/renderizados/{image_name}", styles["Small"]))


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawRightString(A4[0] - 1.7 * cm, 1.0 * cm, f"Página {doc.page}")
    canvas.restoreState()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()
    story = []

    story.extend(markdown_to_flowables(DOCS / "trabalho-academico.md", styles))
    story.append(PageBreak())
    story.append(Paragraph("Checklist Final", styles["Heading1"]))
    story.extend(markdown_to_flowables(DOCS / "checklist-final.md", styles))

    add_diagram(story, styles, "Diagrama de Casos de Uso", "casos-de-uso.png")
    add_diagram(story, styles, "Diagrama Entidade-Relacionamento", "der.png")
    add_diagram(story, styles, "Diagrama de Classes", "classes.png")
    add_diagram(story, styles, "Diagrama de Sequência", "sequencia-pedido-pagamento.png")

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.7 * cm,
        leftMargin=1.7 * cm,
        topMargin=1.6 * cm,
        bottomMargin=1.5 * cm,
        title="Trabalho Final - Raízes do Nordeste API",
        author="Gerlan",
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"PDF gerado: {OUTPUT}")


if __name__ == "__main__":
    main()
