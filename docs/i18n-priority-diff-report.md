# I18n Priority Diff Report

This report summarizes localization changes for the nine priority locales:
`it`, `fr`, `es`, `pt`, `nl`, `pl`, `tr`, `ar`, `ru`.

## Scope

- Compared each locale file against `HEAD`.
- Counted changed translation keys.
- Grouped changes by top-level namespace.
- Captured a sample of changed keys per locale.

## Summary Table

| Locale | Changed Keys | Top Groups |
|---|---:|---|
| `it` | 65 | `gesetze_page` (45), `services` (6), `offices` (5), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |
| `fr` | 79 | `gesetze_page` (45), `services` (7), `offices` (6), `contact` (4), `nav` (3) |
| `es` | 68 | `gesetze_page` (46), `services` (6), `offices` (6), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |
| `pt` | 65 | `gesetze_page` (46), `services` (5), `offices` (5), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |
| `nl` | 69 | `gesetze_page` (45), `offices` (6), `services` (5), `impressum` (3), `team_rene_marquard` (2) |
| `pl` | 73 | `gesetze_page` (46), `offices` (8), `services` (5), `impressum` (3), `contact` (2) |
| `tr` | 69 | `gesetze_page` (46), `offices` (7), `services` (5), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |
| `ar` | 64 | `gesetze_page` (46), `services` (5), `offices` (4), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |
| `ru` | 64 | `gesetze_page` (46), `services` (5), `offices` (4), `team_rene_marquard` (2), `team_andre_zimmermann` (2) |

## Sample Changed Keys

- `it`: `hero.tagline`, `services.yacht.tab`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `offices.texas.city`
- `fr`: `nav.services`, `nav.contact`, `services.badge`, `services.construction.tab`, `gesetze.mehr_erfahren`
- `es`: `hero.tagline`, `services.finance.tab`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `contact.dialog.error_title`
- `pt`: `hero.tagline`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `offices.texas.city`, `datenschutz.section_6_title`
- `nl`: `hero.tagline`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `footer.impressum`, `impressum.title`
- `pl`: `nav.contact`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `contact.badge`, `impressum.contact_title`
- `tr`: `hero.tagline`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `contact.phone`, `impressum.phone_label`
- `ar`: `hero.tagline`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `offices.montenegro.city`, `impressum.responsible_name`
- `ru`: `hero.tagline`, `services.private_health_insurance.title`, `gesetze.mehr_erfahren`, `offices.montenegro.city`, `impressum.responsible_name`

## Related File

- CSV summary: `docs/i18n-priority-diff-summary.csv`
