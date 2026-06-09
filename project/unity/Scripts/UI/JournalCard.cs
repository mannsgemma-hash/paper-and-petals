using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using TMPro;

namespace PaperPetals.UI
{
    /// <summary>
    /// One journal cover card on the SCR-05 carousel. Renders the cover art full-bleed
    /// inside a paper-bound frame: darkened spine on the binding edge, stitched inner
    /// border, a brass label plate with the journal name + "items · edited", and a
    /// ribbon bookmark. The <c>isNew</c> variant shows the dashed "Start a new journal"
    /// slot. Tapping fires <see cref="onTap"/> (the carousel opens the editor).
    /// </summary>
    public class JournalCard : MonoBehaviour, IPointerClickHandler
    {
        [Serializable]
        public class Data
        {
            public string name = "Journal";
            public int items = 0;
            public string edited = "today";
            public Sprite cover;     // a pp_cover_*.png placeholder
            public bool inkLight;    // true for light covers (linen/floral) → dark stitch
            public bool isNew;
        }

        public PaperPetalsTheme theme;
        public Data data = new Data();
        public UnityEvent<JournalCard> onTap;

        [Header("Wiring (assigned by the builder)")]
        public Image coverImage;
        public Image spine;
        public Image stitch;
        public Image brassPlate;
        public TMP_Text title;
        public TMP_Text meta;
        public Image ribbon;
        public GameObject newSlot;     // dashed-slot container (border + "+" + label)
        public TMP_Text newLabel;
        public Image newBorder;
        public TMP_Text newPlus;

        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        private void OnEnable() => Refresh();

        public void SetData(Data d) { data = d; Refresh(); }

        public void Refresh()
        {
            var t = T; if (t == null) return;
            bool isNew = data != null && data.isNew;

            ToggleNormal(!isNew);
            if (newSlot) newSlot.SetActive(isNew);

            if (isNew) { StyleNewSlot(t); return; }

            if (coverImage)
            {
                coverImage.sprite = data.cover;
                coverImage.color = Color.white;
                coverImage.type = Image.Type.Simple;
                coverImage.preserveAspect = false;
            }
            if (spine)  { spine.color = Color.white; }   // fade sprite carries its own alpha; builder assigns it
            if (ribbon) { ribbon.color = data.inkLight
                              ? new Color(1f, 0.992f, 0.965f)            // cream ribbon on light covers
                              : t.terracotta; }
            if (stitch) { stitch.sprite = t.strokeR6; stitch.type = Image.Type.Sliced;
                          stitch.color = (data.inkLight ? t.surfaceCard : t.stitch).A(data.inkLight ? 0.5f : 0.45f); }

            if (brassPlate) brassPlate.color = Color.white;
            if (title) { title.font = t.displayFont != null ? t.displayFont : title.font; title.fontSize = 17;
                         title.color = new Color(0.227f, 0.173f, 0.059f); title.text = data.name; }   // #3A2C0F brass-ink
            if (meta)  { meta.font = t.scriptFont != null ? t.scriptFont : meta.font; meta.fontStyle = FontStyles.Italic;
                         meta.fontSize = 12; meta.color = new Color(0.353f, 0.290f, 0.122f);          // #5A4A1F
                         meta.text = $"{data.items} items · {data.edited}"; }
        }

        private void StyleNewSlot(PaperPetalsTheme t)
        {
            if (newBorder) { newBorder.sprite = t.strokeR16; newBorder.type = Image.Type.Sliced; newBorder.color = t.stitch; }
            if (newPlus)   { newPlus.font = t.displayFont != null ? t.displayFont : newPlus.font; newPlus.fontSize = 56;
                             newPlus.color = t.fg2.A(0.55f); newPlus.text = "+"; }
            if (newLabel)  { newLabel.font = t.scriptFont != null ? t.scriptFont : newLabel.font; newLabel.fontStyle = FontStyles.Italic;
                             newLabel.fontSize = 22; newLabel.color = t.fg1; newLabel.text = "Start a new journal"; }
        }

        private void ToggleNormal(bool on)
        {
            if (coverImage) coverImage.enabled = on;
            if (spine) spine.enabled = on;
            if (stitch) stitch.enabled = on;
            if (brassPlate) brassPlate.enabled = on;
            if (title) title.enabled = on;
            if (meta) meta.enabled = on;
            if (ribbon) ribbon.enabled = on;
        }

        public void OnPointerClick(PointerEventData e) => onTap?.Invoke(this);

#if UNITY_EDITOR
        private void OnValidate() { if (!Application.isPlaying) Refresh(); }
#endif
    }
}
