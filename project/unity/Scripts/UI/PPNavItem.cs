using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using TMPro;

namespace PaperPetals.UI
{
    /// <summary>
    /// A left-rail navigation item: rounded row with a 18px outline icon + label.
    /// Active = forest fill with cream icon/label; inactive = transparent with
    /// stone-warm text that warms on hover. Mirrors comp_navigation.html.
    ///
    /// Prefab anatomy:
    ///   NavItem (Image = pp_fill_r? rounded ~8, this script)
    ///   ├─ Icon  (Image, outline sprite — tinted by this script)
    ///   └─ Label (TextMeshProUGUI)
    /// </summary>
    public class PPNavItem : PPHoverPress, IPointerClickHandler
    {
        [Header("Nav item")]
        public bool active = false;
        public PPNavGroup group;
        public UnityEvent onSelected;

        [Header("Wiring")]
        public Image background;
        public Image icon;
        public TMP_Text label;

        public void OnPointerClick(PointerEventData e)
        {
            if (!interactable) return;
            if (group != null) group.Select(this);
            else SetActive(true);
            onSelected?.Invoke();
        }

        public void SetActive(bool on)
        {
            active = on;
            Apply();
        }

        protected override void Apply()
        {
            var t = T; if (t == null) return;
            Color content = active ? t.surfaceCard : t.fg3;

            if (background)
            {
                if (background.sprite == null) background.sprite = t.fillR10;
                background.type = Image.Type.Sliced;
                background.color = active ? t.accent : new Color(0, 0, 0, 0);
            }
            if (icon)  icon.color = content;
            if (label) { label.font = t.uiFont != null ? t.uiFont : label.font; label.fontSize = 13; label.color = content; }
        }

        // Inactive rows warm their background on hover; active rows stay forest.
        protected override void OnHover(bool hovering)
        {
            if (active || background == null) return;
            background.color = hovering ? T.bg2 : new Color(0, 0, 0, 0);
        }
    }
}
