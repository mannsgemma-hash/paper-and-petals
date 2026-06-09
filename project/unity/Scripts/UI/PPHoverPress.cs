using System.Collections;
using UnityEngine;
using UnityEngine.EventSystems;

namespace PaperPetals.UI
{
    /// <summary>
    /// Adds the brand hover-lift + press-scale feel to any UI element. Attach to a
    /// RectTransform that should respond to pointer like paper: lifts a couple of px
    /// on hover, sinks to 96% on press, settles back on the paper easing curve.
    /// Subclasses (chips, nav items) override the OnHover/OnPress hooks to also swap
    /// colors. Buttons use PPButton instead (it derives from uGUI Button).
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    public class PPHoverPress : MonoBehaviour,
        IPointerEnterHandler, IPointerExitHandler, IPointerDownHandler, IPointerUpHandler
    {
        public PaperPetalsTheme theme;
        [Tooltip("If false, this element ignores hover/press (e.g. an active nav item).")]
        public bool interactable = true;

        protected RectTransform Rt;
        protected float BaseY;
        private Coroutine _anim;
        private bool _hover, _down;

        protected PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        protected virtual void Awake()
        {
            Rt = (RectTransform)transform;
            BaseY = Rt.anchoredPosition.y;
        }

        protected virtual void OnEnable() { Apply(); }

        public void OnPointerEnter(PointerEventData e) { if (!interactable) return; _hover = true;  Refresh(); OnHover(true); }
        public void OnPointerExit (PointerEventData e) { if (!interactable) return; _hover = false; _down = false; Refresh(); OnHover(false); OnPress(false); }
        public void OnPointerDown (PointerEventData e) { if (!interactable) return; _down = true;   Refresh(); OnPress(true); }
        public void OnPointerUp   (PointerEventData e) { if (!interactable) return; _down = false;  Refresh(); OnPress(false); }

        private void Refresh()
        {
            var t = T;
            if (t == null) return;
            float lift  = (_hover && !_down) ? t.hoverLift : 0f;          // CSS: hover translateY(-1..-2px) → +Y up in Unity
            float scale = _down ? t.pressScale : 1f;                       // CSS: press scale(.96)
            float dur   = _down ? t.durFast : t.durBase;
            var ease    = _down ? t.easePress : t.easePaper;
            if (_anim != null) StopCoroutine(_anim);
            if (isActiveAndEnabled) _anim = StartCoroutine(PPMotion.LiftPress(Rt, BaseY, BaseY + lift, scale, dur, ease));
        }

        /// <summary>Apply static (resting) styling. Override to tint graphics from the theme.</summary>
        protected virtual void Apply() { }
        /// <summary>Called when hover state changes. Override to warm the background, etc.</summary>
        protected virtual void OnHover(bool hovering) { }
        /// <summary>Called when press state changes.</summary>
        protected virtual void OnPress(bool pressed) { }

#if UNITY_EDITOR
        protected virtual void OnValidate()
        {
            if (Rt == null) Rt = transform as RectTransform;
            if (!Application.isPlaying) Apply();
        }
#endif
    }
}
