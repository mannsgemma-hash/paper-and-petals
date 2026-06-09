using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace PaperPetals.UI
{
    /// <summary>
    /// Styles a TMP_InputField the Paper &amp; Petals way: cream surface, parchment
    /// hairline border, 6px radius, 48px min height. On focus the border turns sage
    /// and a soft sage focus ring appears (never blue). Mirrors comp_inputs.html.
    ///
    /// Prefab anatomy:
    ///   Field (TMP_InputField, this script)
    ///   ├─ FocusRing (Image = pp_stroke_r6, larger, sage glow — off by default)
    ///   ├─ Border    (Image = pp_stroke_r6, the hairline)
    ///   ├─ Background (Image = pp_fill_r6, cream)
    ///   └─ Text Area ▸ Text / Placeholder (TMP, standard input children)
    /// </summary>
    [RequireComponent(typeof(TMP_InputField))]
    public class PPInputField : MonoBehaviour
    {
        public PaperPetalsTheme theme;

        [Header("Wiring")]
        public Image background;
        public Image border;
        public Image focusRing;
        public TMP_Text textComponent;
        public TMP_Text placeholder;

        private TMP_InputField _field;
        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        private void Awake() => _field = GetComponent<TMP_InputField>();

        private void OnEnable()
        {
            if (_field == null) _field = GetComponent<TMP_InputField>();
            _field.onSelect.AddListener(_ => SetFocus(true));
            _field.onDeselect.AddListener(_ => SetFocus(false));
            Apply();
            SetFocus(false);
        }

        private void OnDisable()
        {
            if (_field == null) return;
            _field.onSelect.RemoveAllListeners();
            _field.onDeselect.RemoveAllListeners();
        }

        public void Apply()
        {
            var t = T; if (t == null) return;
            if (background) { background.sprite = t.fillR6;   background.type = Image.Type.Sliced; background.color = t.surfaceCard; }
            if (border)     { border.sprite = t.strokeR6;     border.type = Image.Type.Sliced; }
            if (focusRing)  { focusRing.sprite = t.strokeR6;   focusRing.type = Image.Type.Sliced; focusRing.color = t.accentSoft.A(0.22f); }
            if (textComponent) { textComponent.font = t.uiFont != null ? t.uiFont : textComponent.font; textComponent.fontSize = 16; textComponent.color = t.fg1; }
            if (placeholder)   { placeholder.font   = t.uiFont != null ? t.uiFont : placeholder.font;   placeholder.fontSize = 16;   placeholder.color = t.fg4; }
        }

        private void SetFocus(bool focused)
        {
            var t = T; if (t == null) return;
            if (border)    border.color = focused ? t.accentSoft : t.hairline;
            if (focusRing) focusRing.enabled = focused;
        }
    }
}
