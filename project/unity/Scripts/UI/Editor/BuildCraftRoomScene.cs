#if UNITY_EDITOR
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

namespace PaperPetals.UI.EditorTools
{
    /// <summary>
    /// Constructs the entire SCR-05 Home (journal carousel) screen in the open scene,
    /// fully wired to the Paper &amp; Petals theme + components. Run
    /// <c>Tools ▸ Paper &amp; Petals ▸ Build SCR-05 Home</c>.
    /// Everything is created with Undo support — one Ctrl+Z removes it.
    /// </summary>
    public static class BuildCraftRoomScene
    {
        // Seed journals (mirrors the UI kit). cover sprite name + inkLight flag.
        private static readonly (string name, int items, string edited, string cover, bool light)[] Seed =
        {
            ("Spring",         18, "2 days ago", "pp_cover_floral",    true ),
            ("Autumn Library", 24, "yesterday",  "pp_cover_leather",   false),
            ("Coastal",        12, "5 days ago", "pp_cover_linen",     true ),
            ("Romantic",        9, "1 week ago", "pp_cover_wildrose",  true ),
            ("Cottagecore",    31, "3 hours ago","pp_cover_forest",    false),
            ("Field Notes",     7, "today",      "pp_cover_parchment", true ),
        };

        [MenuItem("Tools/Paper & Petals/Build SCR-05 Home", priority = 20)]
        public static void Build()
        {
            PaperPetalsMenu.ApplySpriteImport();            // make sure sprites are sliced/sized
            var theme = GetOrCreateTheme();
            AutoWireThemeSprites(theme);

            // ── Canvas + scaler + event system ─────────────────────────
            var canvasGO = new GameObject("SCR-05 Home", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = canvasGO.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasGO.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1024, 768);
            scaler.matchWidthOrHeight = 0.5f;
            Undo.RegisterCreatedObjectUndo(canvasGO, "Build SCR-05 Home");

            EnsureEventSystem();

            // ── Background ─────────────────────────────────────────────
            var bg = Img("Background", canvasGO.transform);
            Stretch(bg.rectTransform, 0, 0, 0, 0);
            bg.sprite = Spr("pp_bg_parchment"); bg.type = Image.Type.Simple; bg.raycastTarget = false;
            if (bg.sprite == null) bg.color = theme.bg1;

            // ── Home controller root ───────────────────────────────────
            var home = Rect("Home", canvasGO.transform); Stretch(home, 0, 0, 0, 0);
            var ctrl = home.gameObject.AddComponent<CraftRoomHome>();
            ctrl.theme = theme;

            BuildTopLeft(home, theme);
            BuildTopRight(home, theme);

            // ── Carousel area (top 96, bottom 110) ─────────────────────
            var carousel = Rect("Carousel", home); Stretch(carousel, 0, 96, 0, 110);

            ctrl.cards = new List<JournalCard>();
            foreach (var s in Seed)
            {
                var d = new JournalCard.Data { name = s.name, items = s.items, edited = s.edited, cover = Spr(s.cover), inkLight = s.light };
                ctrl.cards.Add(BuildCard(carousel, theme, d, s.name));
            }
            // dashed "new journal" slot
            ctrl.cards.Add(BuildCard(carousel, theme, new JournalCard.Data { isNew = true }, "New"));

            // arrows
            ctrl.prevButton = BuildArrow(carousel, theme, "Prev", "‹", true);
            ctrl.nextButton = BuildArrow(carousel, theme, "Next", "›", false);

            // ── Page dots (96 from bottom) ─────────────────────────────
            var dots = Rect("Dots", home);
            Anchor(dots, new Vector2(0.5f, 0), new Vector2(0.5f, 0), new Vector2(0, 96), new Vector2(320, 10));
            var hlg = dots.gameObject.AddComponent<HorizontalLayoutGroup>();
            hlg.childAlignment = TextAnchor.MiddleCenter; hlg.spacing = 8;
            hlg.childControlWidth = true; hlg.childControlHeight = true;
            hlg.childForceExpandWidth = false; hlg.childForceExpandHeight = false;
            ctrl.dotsContainer = dots;

            // ── Ad banner ──────────────────────────────────────────────
            BuildAdBanner(home, theme);

            // initial layout snapshot for edit-mode preview
            Selection.activeGameObject = canvasGO;
            EditorUtility.SetDirty(canvasGO);
            UnityEditor.SceneManagement.EditorSceneManager.MarkSceneDirty(canvasGO.scene);
            Debug.Log("[Paper & Petals] Built SCR-05 Home. Press Play to scrub the carousel (← → / arrows / dots). " +
                      "Assign TMP fonts on the theme for final type.");
        }

        // ───────────────────────── pieces ─────────────────────────

        private static void BuildTopLeft(RectTransform home, PaperPetalsTheme t)
        {
            var tl = Rect("TopLeft", home);
            Anchor(tl, new Vector2(0, 1), new Vector2(0, 1), new Vector2(24, -22), new Vector2(380, 64));
            var logo = Img("Logo", tl);
            Anchor(logo.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), Vector2.zero, new Vector2(64, 64));
            logo.sprite = Spr("pp_logo_sage"); logo.preserveAspect = true;
            if (logo.sprite == null) { logo.sprite = t.fillCircle; logo.color = t.accentSoft; }

            var wm = Txt("Wordmark", tl, "Paper <color=#C47B63>&</color> Petals");
            Anchor(wm.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(76, 0), new Vector2(300, 40));
            wm.font = Display(t); wm.fontSize = 22; wm.color = t.fg1; wm.alignment = TextAlignmentOptions.MidlineLeft; wm.richText = true;
        }

        private static void BuildTopRight(RectTransform home, PaperPetalsTheme t)
        {
            var tr = Rect("TopRight", home);
            Anchor(tr, new Vector2(1, 1), new Vector2(1, 1), new Vector2(-24, -24), new Vector2(180, 56));
            var hlg = tr.gameObject.AddComponent<HorizontalLayoutGroup>();
            hlg.childAlignment = TextAnchor.MiddleRight; hlg.spacing = 12;
            hlg.childControlWidth = false; hlg.childControlHeight = false;
            RoundActionButton(tr, t, "Shop", t.terracotta);
            RoundActionButton(tr, t, "Settings", t.accentSoft);
        }

        private static void RoundActionButton(RectTransform parent, PaperPetalsTheme t, string label, Color c)
        {
            var img = Img(label, parent);
            img.sprite = t.fillPill; img.type = Image.Type.Sliced; img.color = c;
            var le = img.gameObject.AddComponent<LayoutElement>(); le.preferredWidth = 84; le.preferredHeight = 56;
            var btn = img.gameObject.AddComponent<Button>(); btn.transition = Selectable.Transition.None;
            var txt = Txt("Label", img.transform, label);
            Stretch(txt.rectTransform, 0, 0, 0, 0);
            txt.font = UI(t); txt.fontSize = 14; txt.fontStyle = FontStyles.Bold; txt.color = t.surfaceCard;
            txt.alignment = TextAlignmentOptions.Center;
        }

        private static Button BuildArrow(RectTransform parent, PaperPetalsTheme t, string name, string glyph, bool left)
        {
            var img = Img(name, parent);
            Anchor(img.rectTransform, new Vector2(left ? 0 : 1, 0.5f), new Vector2(left ? 0 : 1, 0.5f),
                   new Vector2(left ? 18 : -18, 0), new Vector2(60, 60));
            img.sprite = t.fillCircle; img.type = Image.Type.Simple; img.color = t.surfaceCard;
            var btn = img.gameObject.AddComponent<Button>(); btn.transition = Selectable.Transition.None;
            var txt = Txt("Glyph", img.transform, glyph);
            Stretch(txt.rectTransform, 0, 0, 0, 4);
            txt.font = Display(t); txt.fontSize = 34; txt.color = t.fg1; txt.alignment = TextAlignmentOptions.Center;
            return btn;
        }

        private static JournalCard BuildCard(RectTransform parent, PaperPetalsTheme t, JournalCard.Data d, string name)
        {
            var root = Rect("Card_" + name, parent);
            Anchor(root, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(300, 420));
            root.gameObject.AddComponent<CanvasGroup>();
            var hit = root.gameObject.AddComponent<Image>(); hit.color = new Color(0, 0, 0, 0); // raycast target for taps
            var jc = root.gameObject.AddComponent<JournalCard>(); jc.theme = t; jc.data = d;

            // Frame (rounded mask) + cover + spine
            var frame = Img("Frame", root); Stretch(frame.rectTransform, 0, 0, 0, 0);
            frame.sprite = t.fillR16; frame.type = Image.Type.Sliced; frame.color = Color.white; frame.raycastTarget = false;
            var mask = frame.gameObject.AddComponent<Mask>(); mask.showMaskGraphic = true;

            var cover = Img("Cover", frame.transform); Stretch(cover.rectTransform, 0, 0, 0, 0);
            cover.sprite = d.cover; cover.type = Image.Type.Simple; cover.raycastTarget = false;
            jc.coverImage = cover;

            var spine = Img("Spine", frame.transform);
            Anchor(spine.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), Vector2.zero, new Vector2(40, 420));
            spine.rectTransform.anchorMin = new Vector2(0, 0); spine.rectTransform.anchorMax = new Vector2(0, 1);
            spine.rectTransform.offsetMin = new Vector2(0, 0); spine.rectTransform.offsetMax = new Vector2(40, 0);
            spine.sprite = Spr("pp_fade_h"); spine.type = Image.Type.Sliced; spine.raycastTarget = false; jc.spine = spine;

            // Stitch ring (inset)
            var stitch = Img("Stitch", root); Stretch(stitch.rectTransform, 26, 14, 14, 14);
            stitch.raycastTarget = false; jc.stitch = stitch;

            // Ribbon
            var ribbon = Img("Ribbon", root);
            Anchor(ribbon.rectTransform, new Vector2(1, 1), new Vector2(1, 1), new Vector2(-36, 2), new Vector2(16, 56));
            ribbon.sprite = Spr("pp_ribbon"); ribbon.type = Image.Type.Simple; ribbon.raycastTarget = false; jc.ribbon = ribbon;

            // Brass plate + title + meta
            var brass = Img("Brass", root);
            Anchor(brass.rectTransform, new Vector2(0.54f, 0), new Vector2(0.5f, 0), new Vector2(0, 58), new Vector2(222, 66));
            brass.sprite = Spr("pp_brass"); brass.type = Image.Type.Sliced; brass.raycastTarget = false; jc.brassPlate = brass;
            var vlg = brass.gameObject.AddComponent<VerticalLayoutGroup>();
            vlg.childAlignment = TextAnchor.MiddleCenter; vlg.padding = new RectOffset(10, 10, 6, 6); vlg.spacing = 1;
            vlg.childControlWidth = true; vlg.childControlHeight = true; vlg.childForceExpandHeight = false;
            var title = Txt("Title", brass.transform, d.name); title.alignment = TextAlignmentOptions.Center; jc.title = title;
            var meta = Txt("Meta", brass.transform, ""); meta.alignment = TextAlignmentOptions.Center; jc.meta = meta;

            // New-journal slot (hidden unless isNew)
            var slot = Rect("NewSlot", root); Stretch(slot, 0, 0, 0, 0);
            var nb = Img("NewBorder", slot); Stretch(nb.rectTransform, 0, 0, 0, 0); nb.raycastTarget = false; jc.newBorder = nb;
            var plus = Txt("Plus", slot, "+");
            Anchor(plus.rectTransform, new Vector2(0.5f, 0.62f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(120, 120));
            plus.alignment = TextAlignmentOptions.Center; jc.newPlus = plus;
            var nl = Txt("NewLabel", slot, "Start a new journal");
            Anchor(nl.rectTransform, new Vector2(0.5f, 0.34f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(240, 60));
            nl.alignment = TextAlignmentOptions.Center; nl.enableWordWrapping = true; jc.newLabel = nl;
            jc.newSlot = slot.gameObject;

            jc.Refresh();
            return jc;
        }

        private static void BuildAdBanner(RectTransform home, PaperPetalsTheme t)
        {
            var ad = Img("AdBanner", home);
            ad.rectTransform.anchorMin = new Vector2(0, 0); ad.rectTransform.anchorMax = new Vector2(1, 0);
            ad.rectTransform.pivot = new Vector2(0.5f, 0);
            ad.rectTransform.offsetMin = new Vector2(18, 12); ad.rectTransform.offsetMax = new Vector2(-18, 96);
            ad.sprite = t.fillR10; ad.type = Image.Type.Sliced; ad.color = t.surfaceCard;

            var swatch = Img("Swatch", ad.transform);
            Anchor(swatch.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(16, 0), new Vector2(56, 56));
            swatch.sprite = t.fillR6; swatch.type = Image.Type.Sliced; swatch.color = t.bg3;
            var adlbl = Txt("AD", swatch.transform, "AD"); Stretch(adlbl.rectTransform, 0, 0, 0, 0);
            adlbl.font = UI(t); adlbl.fontSize = 11; adlbl.characterSpacing = 16; adlbl.color = t.fg3;
            adlbl.alignment = TextAlignmentOptions.Center;

            var sponsored = Txt("Sponsored", ad.transform, "SPONSORED");
            Anchor(sponsored.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(86, 12), new Vector2(300, 18));
            sponsored.font = UI(t); sponsored.fontSize = 11; sponsored.characterSpacing = 18; sponsored.color = t.fg3;
            sponsored.fontStyle = FontStyles.UpperCase; sponsored.alignment = TextAlignmentOptions.MidlineLeft;
            var headline = Txt("Headline", ad.transform, "Your advertisement here");
            Anchor(headline.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(86, -10), new Vector2(360, 24));
            headline.font = Display(t); headline.fontSize = 17; headline.color = t.fg1; headline.alignment = TextAlignmentOptions.MidlineLeft;

            var remove = MakePPButton(ad.transform, t, "Remove ads with subscription", PPButtonVariant.Secondary, true);
            Anchor(((RectTransform)remove.transform), new Vector2(1, 0.5f), new Vector2(1, 0.5f), new Vector2(-16, 0), new Vector2(290, 40));
        }

        private static PPButton MakePPButton(Transform parent, PaperPetalsTheme t, string label, PPButtonVariant variant, bool pill)
        {
            var img = Img("PPButton", parent);
            var btn = img.gameObject.AddComponent<PPButton>();
            btn.theme = t; btn.variant = variant; btn.pill = pill; btn.background = img;
            var stroke = Img("Stroke", img.transform); Stretch(stroke.rectTransform, 0, 0, 0, 0); stroke.raycastTarget = false; btn.stroke = stroke;
            var lbl = Txt("Label", img.transform, label); Stretch(lbl.rectTransform, 0, 0, 0, 0);
            lbl.font = UI(t); lbl.alignment = TextAlignmentOptions.Center; btn.label = lbl;
            btn.ApplyResting();
            return btn;
        }

        // ───────────────────────── helpers ─────────────────────────

        private static PaperPetalsTheme GetOrCreateTheme()
        {
            var t = PaperPetalsTheme.Active;
            if (t == null) { PaperPetalsMenu.CreateTheme(); t = PaperPetalsTheme.Active; }
            return t;
        }

        private static void AutoWireThemeSprites(PaperPetalsTheme t)
        {
            if (t == null) return;
            if (t.fillR6 == null)     t.fillR6 = Spr("pp_fill_r6");
            if (t.fillR10 == null)    t.fillR10 = Spr("pp_fill_r10");
            if (t.fillR14 == null)    t.fillR14 = Spr("pp_fill_r14");
            if (t.fillR16 == null)    t.fillR16 = Spr("pp_fill_r16");
            if (t.fillPill == null)   t.fillPill = Spr("pp_fill_pill");
            if (t.fillCircle == null) t.fillCircle = Spr("pp_fill_circle");
            if (t.strokeR6 == null)   t.strokeR6 = Spr("pp_stroke_r6");
            if (t.strokeR14 == null)  t.strokeR14 = Spr("pp_stroke_r14");
            if (t.strokeR16 == null)  t.strokeR16 = Spr("pp_stroke_r16");
            if (t.strokePill == null) t.strokePill = Spr("pp_stroke_pill");
            if (t.strokeCircle == null) t.strokeCircle = Spr("pp_stroke_circle");
            if (t.shadowR16 == null)  t.shadowR16 = Spr("pp_shadow_r16");
            EditorUtility.SetDirty(t);
            AssetDatabase.SaveAssets();
        }

        private static void EnsureEventSystem()
        {
            if (Object.FindObjectOfType<EventSystem>() != null) return;
            var es = new GameObject("EventSystem", typeof(EventSystem));
            Undo.RegisterCreatedObjectUndo(es, "Create EventSystem");
#if ENABLE_INPUT_SYSTEM && !ENABLE_LEGACY_INPUT_MANAGER
            es.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
            es.AddComponent<StandaloneInputModule>();
#endif
        }

        private static TMP_FontAsset Display(PaperPetalsTheme t) => t.displayFont != null ? t.displayFont : TMP_Settings.defaultFontAsset;
        private static TMP_FontAsset UI(PaperPetalsTheme t)      => t.uiFont != null ? t.uiFont : TMP_Settings.defaultFontAsset;

        private static Sprite Spr(string name)
        {
            foreach (var g in AssetDatabase.FindAssets("t:Sprite " + name))
            {
                var p = AssetDatabase.GUIDToAssetPath(g);
                if (Path.GetFileNameWithoutExtension(p) == name)
                    return AssetDatabase.LoadAssetAtPath<Sprite>(p);
            }
            return null;
        }

        private static RectTransform Rect(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return (RectTransform)go.transform;
        }

        private static Image Img(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image));
            go.transform.SetParent(parent, false);
            return go.GetComponent<Image>();
        }

        private static TMP_Text Txt(string name, Transform parent, string text)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var t = go.AddComponent<TextMeshProUGUI>();
            t.text = text; t.enableWordWrapping = false; t.color = Color.black;
            return t;
        }

        /// <summary>Stretch to fill the parent with inset margins (left, top, right, bottom).</summary>
        private static void Stretch(RectTransform rt, float l, float t, float r, float b)
        {
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
            rt.offsetMin = new Vector2(l, b); rt.offsetMax = new Vector2(-r, -t);
        }

        private static void Anchor(RectTransform rt, Vector2 anchor, Vector2 pivot, Vector2 pos, Vector2 size)
        {
            rt.anchorMin = rt.anchorMax = anchor; rt.pivot = pivot;
            rt.anchoredPosition = pos; rt.sizeDelta = size;
        }
    }
}
#endif
