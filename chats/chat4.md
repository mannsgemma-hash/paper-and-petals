# Unity UI Components

_Started 2026-06-03 10:10 UTC_

---

## User

Can you give me the Components to download or give me instructions on how to create the Components in Unity so they have the same look and feel.

## Assistant

_[tool: list_files]_

_[tool: local_ls]_

Let me explore both the project and the attached folder to understand what we're working with.

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

I need access to the local folder, but there's also a copy in the project itself. Let me explore the project files while the permission banner resolves.

_[tool: local_ls]_

_[tool: read_file]_

Access restored. Let me explore the Unity codebase structure and the design document to understand what components exist and what's needed.

_[tool: read_file]_

_[tool: local_ls]_

_[tool: local_ls]_

Let me read the design tokens, the component definitions, and check the Unity project's UI scripts, fonts, and Unity version.

_[tool: local_read]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: questions_v2]_

This is a fresh Unity 6 scaffold (URP 2D + TextMesh Pro) — the `Scripts/UI` and `Fonts` folders are empty, so we're translating the Paper & Petals web design system into Unity from the ground up. Before I build, a few decisions genuinely change what I produce, so let me confirm them.

## User

Questions answered:
- ui_system: uGUI — Canvas, Image, TextMeshPro, prefabs (classic)
- deliverable: Downloadable C# scripts + ScriptableObject theme (drop into Assets/Scripts/UI)
- components: All of them
- fonts: I'll need font recommendations that match the vibe and are game-embeddable
- sprites: Generate placeholder 9-slice sprites I can swap later
- interactions: Yes — include the hover-lift + press-scale behaviour in the C#

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Got it. uGUI + TextMeshPro, all components, downloadable C# + ScriptableObject theme, embeddable font recommendations, placeholder 9-slice sprites, and motion baked in. Let me read the remaining component specs so my C# matches exactly.

_[tool: update_todos]_

I have everything I need. All five component groups, full token spec, Unity 6 + uGUI + TMP, empty scaffold. Let me lay out the plan and build.

_[tool: run_script]_

Starting with the placeholder 9-slice sprites.

_[tool: view_image]_

_[tool: view_image]_

_[tool: update_todos]_

Sprites look right (stroke is white-on-transparent, tinted at runtime; shadow is a soft blur). Now the C# core.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: write_file]_

Now the Editor convenience script — creates the theme asset with brand defaults and auto-applies the 9-slice import settings to the sprites.

_[tool: update_todos]_

_[tool: write_file]_

Now the visual build guide — the on-brand "instructions" document. I'll design it in the Paper & Petals aesthetic using the embeddable fonts I'm recommending, so it doubles as a live preview of the Unity type stack.

_[tool: update_todos]_

Now the README for the package.

_[tool: write_file]_

_[tool: done]_

Let me verify the guide renders cleanly.

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Masthead looks great. The lede sits a touch tight against the TOC pills — let me give it breathing room, then check a lower section.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: multi_screenshot]_

The capture resets to top each time. Let me use the in-page capture to confirm lower sections (sprite images, components) render.

_[tool: get_webview_logs]_

The capture tool keeps snapping the top of the document. Let me check the console for any broken resources, then hand off to the verifier for a full scroll-through.

_[tool: update_todos]_

_[tool: present_fs_item_for_download]_

No errors, sprite images load. Let me package the folder for download and hand off to the verifier.

_[tool: fork_verifier_agent]_

I built you both — the **downloadable components** and the **build instructions**, since they work best together for Unity.

**What you get** (download card above, or open `unity/PaperPetals_Unity_Guide.html` for the illustrated guide):

- **Drop-in C# for Unity 6 uGUI** (`Assets/Scripts/UI`) — `PPButton`, `PPBadge`, `PPChip`, `PPCard`, `PPInputField`, `PPNavItem`/`PPNavGroup`, all driven by a single **`PaperPetalsTheme` ScriptableObject** that holds every color, font, sprite and motion curve.
- **Brand-accurate motion** — a CSS-exact `CubicBezier` (paper/petal/press) powering the hover-lift + 96% press-scale, baked into the components.
- **Placeholder 9-slice sprites** (fills, stroke rings, pill, circle, soft paper shadow) — white & tintable, ready to swap for real paper art.
- **An Editor menu** that creates the theme with brand colors pre-filled and auto-applies the correct sprite import + 9-slice borders.

**Two things to know:**
- The Adobe brand fonts (Henriette, Adorn Pomander, Chaparral Pro) **can't be embedded in a build** — so I recommended four open-licence stand-ins that hold the cozy feel: **Spectral**, **Nunito Sans**, **EB Garamond Italic**, **Pinyon Script**. Bake them as TMP Font Assets and assign to the theme.
- Sprites are placeholders by design — keep the 9-slice borders when you swap in painted art so nothing shifts.

Want me to also generate the **outline icon set** (Tabler-style nav/tool icons) as import-ready sprites, or assemble a sample **Craft Room scene prefab** wiring these components together?

## User

Can you put together the SCR-05 Home Screen in Unity?

## Assistant

_[tool: grep]_

_[tool: read_file]_

Let me read the SCR-05 spec and the existing UI-kit version so the Unity build matches it exactly.

_[tool: update_todos]_

SCR-05 is the Toca-Boca-style **journal carousel** (the v2 home screen that replaced the isometric craft room). I'll assemble it in Unity as a runnable scene-builder: runtime carousel components + an editor menu command that constructs the whole screen hierarchy using the PP kit, plus the placeholder cover/brass/parchment art it needs. Let me plan and start.

_[tool: list_files]_

_[tool: run_script]_

_[tool: copy_files]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: run_script]_

Covers and parchment read beautifully. One more sprite for the spine fade, then the runtime C#.

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: str_replace_edit]_

The builder needs the cover/background sprites imported as Sprites too — let me extend the import command to cover all `pp_` textures, then write the scene builder.

_[tool: str_replace_edit]_

Let me refine `JournalCard` (don't clobber the spine, tint the ribbon), then write the scene builder.

_[tool: write_file]_

