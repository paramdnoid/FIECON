# Component Governance

## Ziel

Dieses Dokument stellt sicher, dass neue UI-Entwicklung im Projekt konsistent, wiederverwendbar und designtreu bleibt.

## Verbindliche Architektur

- Neue UI-Bausteine entstehen zuerst in `src/components/ui` (Primitive/Pattern), nicht direkt in einzelnen Sections.
- Sections unter `src/components/sections` dürfen bestehende Primitives komponieren, aber keine neuen visuellen Designregeln einführen.
- Wiederkehrende Interaktionsmuster (Hover, Fokus, Uebergaenge, Card-Frame) werden zentral in `src/app/globals.css` oder UI-Primitives gepflegt.
- Navigationsverhalten wird über gemeinsame Bausteine im Layout-Layer gekapselt (z. B. `SectionNavLink`).

## Design- und Token-Regeln

- Keine neuen Hardcoded-Farben/Shadow-Werte in Section-Komponenten, wenn ein Token existiert.
- Neue semantische Tokens werden in `src/app/globals.css` ergänzt und dokumentiert.
- Utility-Duplikate sind zu vermeiden; stattdessen zentrale Klassen (z. B. `fiecon-card-interactive`) erweitern.

## Komponenten-API-Regeln

- Varianten immer deklarativ über `class-variance-authority` (z. B. `Button`, `Badge`).
- Klassenverkettung immer über `cn()` aus `src/lib/utils.ts`.
- Neue UI-Komponenten benoetigen eine klare, stabile Props-API mit sinnvollen Defaults.
- Fuer interaktive Elemente gilt: sichtbarer Fokuszustand und tastaturbedienbare Semantik.

## i18n- und Content-Regeln

- Keine Hardcoded-UI-Texte in Komponenten; Texte laufen ueber `next-intl`.
- Locale-spezifische Features nutzen zentrale Guard-Logik aus `src/lib/constants.ts`.

## Test-Regeln

- Jede neue wiederverwendbare UI-Komponente bekommt mindestens einen Contract-Test in `src/tests`.
- Feature-Refactors mit Layout- oder Scrolllogik brauchen Integrationstests fuer die kritischen Flows.
- Gemeinsame Test-Mocks werden in `src/tests/test-utils` gepflegt statt pro Testdatei dupliziert.

## PR-Checklist (Pflicht)

- Nutzt die Aenderung bereits vorhandene Primitives/Patterns?
- Wurden neue visuelle Regeln als Token/Utility zentralisiert?
- Ist die Komponenten-API variantenfaehig und dokumentiert?
- Sind i18n, A11y und Tests fuer den Scope abgedeckt?
