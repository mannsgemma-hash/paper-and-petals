using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace PaperPetals.UI
{
    public enum PPButtonVariant { Primary, Secondary, Ghost, Danger }

    /// <summary>
    /// Paper &amp; Petals button. Derives from uGUI <see cref="Button"/> so you keep
    /// onClick, navigation and the interactable flag, but replaces the visual
    /// transition with brand styling + the paper hover-lift / press-scale.
    ///
    /// Prefab anatomy:
    ///   Button (Image = background fill sprite, this script)
    ///   ├─ Stroke   (Image, optional — ring sprite for secondary/danger outline)
    ///   └─ Label    (TextMeshProUGUI)
    /// </summary>
    [RequireComponent(typeof(Image))]
    public class PPButton : Button
    {
        public PaperPetalsTheme theme;
        public PPButtonVariant variant = PPButtonVariant.Primary;
        [Tooltip("Use the fully-rounded pill sprite instead of the 6px-radius fill.")]
        public bool pill = false;

        [Header("Wiring")]
        public Image background;          // = targetGraphic
        public Image stroke;              // optional outline ring
        public TMP_Text label;

        private RectTransform _rt;
        private float _baseY;
        private Coroutine _anim;

        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        protected override void Awake()
        {
            base.Awake();
            _rt = (RectTransform)transform;
            _baseY = _rt.anchoredPosition.y;
            if (background == null) background = targetGraphic as Image;
            transition = Transition.None;     // we drive visuals ourselves
        }

        protected override void OnEnable()
        {
            base.OnEnable();
            ApplyResting();
        }

        /// <summary>Resting look — call after changing variant in the Inspector or code.</summary>
        public void ApplyResting()
        {
            var t = T; if (t == null || background == null) return;

            // Sprite shape
            if (background.sprite == null || pill)
                background.sprite = pill ? t.fillPill : t.fillR6;
            else background.sprite = t.fillR6;
            background.type = Image.Type.Sliced;

            switch (variant)
            {
                case PPButtonVariant.Primary:
                    background.color = t.accent;
                    SetStroke(false, default);
                    if (label) label.color = t.surfaceCard;
                    break;
                case PPButtonVariant.Secondary:
                    background.color = t.surfaceCard;
                    SetStroke(true, t.hairline);
                    if (label) label.color = t.fg1;
                    break;
                case PPButtonVariant.Ghost:
                    background.color = new Color(0, 0, 0, 0);
                    SetStroke(false, default);
                    if (label) label.color = t.fg2;
                    break;
                case PPButtonVariant.Danger:
                    background.color = new Color(0, 0, 0, 0);
                    SetStroke(true, t.danger);
                    if (label) label.color = t.danger;
                    break;
            }
            if (label) { label.font = t.uiFont != null ? t.uiFont : label.font; label.fontSize = 15; }
        }

        private void SetStroke(bool on, Color c)
        {
            if (stroke == null) return;
            stroke.enabled = on;
            if (on)
            {
                stroke.sprite = pill ? T.strokePill : T.strokeR6;
                stroke.type = Image.Type.Sliced;
                stroke.color = c;
            }
        }

        protected override void DoStateTransition(SelectionState state, bool instant)
        {
            if (!Application.isPlaying) { ApplyResting(); return; }
            var t = T; if (t == null || background == null) return;

            bool hover = state == SelectionState.Highlighted;
            bool press = state == SelectionState.Pressed;
            bool disabled = state == SelectionState.Disabled;

            // Background tint per state (hover warms primary toward forest-deep)
            switch (variant)
            {
                case PPButtonVariant.Primary:
                    background.color = press ? t.accentHover : hover ? t.accentHover : t.accent; break;
                case PPButtonVariant.Secondary:
                    background.color = hover ? t.bg2 : t.surfaceCard; break;
                case PPButtonVariant.Ghost:
                    background.color = (hover || press) ? t.bg2 : new Color(0, 0, 0, 0); break;
                case PPButtonVariant.Danger:
                    background.color = (hover || press) ? t.danger.A(0.08f) : new Color(0, 0, 0, 0); break;
            }
            if (disabled && label) label.color = t.fg4;

            float lift  = hover && !press ? t.hoverLift : 0f;
            float scale = press ? t.pressScale : 1f;
            float dur   = press ? t.durFast : t.durBase;
            var ease    = press ? t.easePress : t.easePaper;
            if (_anim != null) StopCoroutine(_anim);
            if (isActiveAndEnabled)
                _anim = StartCoroutine(PPMotion.LiftPress(_rt, _baseY, _baseY + lift, scale, instant ? 0f : dur, ease));
        }

#if UNITY_EDITOR
        protected override void OnValidate()
        {
            base.OnValidate();
            if (background == null) background = GetComponent<Image>();
            if (!Application.isPlaying) ApplyResting();
        }
#endif
    }
}
