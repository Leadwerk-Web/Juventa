from pathlib import Path

path = Path(r"C:\Users\haag_\Desktop\Github\Juventa\ueber-juventa.html")
text = path.read_text(encoding="utf-8")

marker_standort = "  <!-- ============ STANDORTE ============ -->"
marker_einzugsgebiet = '  <section class="section section--cream" id="einzugsgebiet"'
marker_philosophie = "  <!-- ============ PHILOSOPHIE ============ -->"

i_standort = text.index(marker_standort)
i_einzugsgebiet = text.index(marker_einzugsgebiet)
i_philosophie = text.index(marker_philosophie)

standort = text[i_standort:i_einzugsgebiet]
einzugsgebiet = text[i_einzugsgebiet:i_philosophie]

# CTA: after reorder, point to contact instead of the map above
standort = standort.replace(
    """          <a class="btn btn--primary" href="#einzugsgebiet">
            Zur Einzugsgebietskarte
            <span class="btn__arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </a>""",
    """          <a class="btn btn--primary" href="#kontakt">
            Kontakt aufnehmen
            <span class="btn__arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </a>""",
)

new_text = text[:i_standort] + einzugsgebiet + standort + text[i_philosophie:]
path.write_text(new_text, encoding="utf-8")
print("reordered ok")
print("standort after einzugsgebiet:", new_text.index('id="einzugsgebiet"') < new_text.index('id="standort"'))
