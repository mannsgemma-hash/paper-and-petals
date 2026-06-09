#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;

namespace PaperPetals.UI.EditorTools
{
    /// <summary>
    /// Editor conveniences for the Paper &amp; Petals UI kit. Menu lives under
    /// <c>Tools ▸ Paper &amp; Petals</c>.
    /// </summary>
    public static class PaperPetalsMenu
    {
        private const string ThemeDir  = "Assets/Resources";
        private const string ThemePath = "Assets/Resources/PaperPetalsTheme.asset";

        [MenuItem("Tools/Paper & Petals/Create Theme Asset", priority = 0)]
        public static void CreateTheme()
        {
            if (!Directory.Exists(ThemeDir)) Directory.CreateDirectory(ThemeDir);

            var theme = AssetDatabase.LoadAssetAtPath<PaperPetalsTheme>(ThemePath);
            if (theme == null)
            {
                theme = ScriptableObject.CreateInstance<PaperPetalsTheme>();
                theme.ResetToBrandDefaults();
                AssetDatabase.CreateAsset(theme, ThemePath);
                AssetDatabase.SaveAssets();
                Debug.Log($"[Paper & Petals] Created theme at {ThemePath}. " +
                          "Assign your TMP fonts and the pp_*.png sprites in the Inspector.");
            }
            else Debug.Log("[Paper & Petals] Theme already exists — selecting it.");

            Selection.activeObject = theme;
            EditorGUIUtility.PingObject(theme);
        }

        /// <summary>
        /// Selects the pp_*.png placeholder sprites and applies the correct
        /// Sprite import + 9-slice border so they look right out of the box.
        /// Run after dropping the Sprites folder into the project.
        /// </summary>
        [MenuItem("Tools/Paper & Petals/Apply Sprite Import Settings", priority = 1)]
        public static void ApplySpriteImport()
        {
            // border = corner radius in SOURCE pixels (baked at 4× the css radius)
            var border = new System.Collections.Generic.Dictionary<string, int>
            {
                { "pp_fill_r6", 24 },     { "pp_stroke_r6", 24 },
                { "pp_fill_r10", 40 },
                { "pp_fill_r14", 56 },    { "pp_stroke_r14", 56 },
                { "pp_fill_r16", 64 },    { "pp_stroke_r16", 64 },
                { "pp_fill_pill", 64 },   { "pp_stroke_pill", 64 },
                { "pp_fill_circle", 95 }, { "pp_stroke_circle", 95 },
                { "pp_shadow_r16", 56 },
            };

            int n = 0;
            var guids = AssetDatabase.FindAssets("t:Texture2D pp_");
            foreach (var g in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(g);
                var key = Path.GetFileNameWithoutExtension(path);
                if (!key.StartsWith("pp_")) continue;

                var imp = (TextureImporter)AssetImporter.GetAtPath(path);
                if (imp == null) continue;
                bool sliced = border.TryGetValue(key, out int b);   // 9-slice surfaces vs full images (covers, bg, logo, brass)

                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.spriteBorder = sliced ? new Vector4(b, b, b, b) : Vector4.zero;
                imp.spritePixelsPerUnit = sliced ? 400f : 100f;     // baked at 4× → renders at css size on a 100-PPU canvas
                imp.alphaIsTransparency = true;
                imp.mipmapEnabled = false;
                imp.filterMode = FilterMode.Bilinear;
                imp.wrapMode = TextureWrapMode.Clamp;
                EditorUtility.SetDirty(imp);
                imp.SaveAndReimport();
                n++;
            }
            Debug.Log($"[Paper & Petals] Applied sprite import settings to {n} placeholder sprite(s).");
        }
    }
}
#endif
