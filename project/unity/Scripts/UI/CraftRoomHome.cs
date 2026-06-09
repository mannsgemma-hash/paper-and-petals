using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace PaperPetals.UI
{
    /// <summary>
    /// SCR-05 Home — a Toca-Boca-style journal carousel. The featured journal sits
    /// centred, neighbours peek scaled + tilted on either side. Arrow buttons,
    /// keyboard ←/→ and page dots all change the active index; the move is eased on
    /// the paper-settle curve. Tapping the centred journal raises <see cref="onOpen"/>.
    /// </summary>
    public class CraftRoomHome : MonoBehaviour
    {
        public PaperPetalsTheme theme;

        [Header("Carousel")]
        public List<JournalCard> cards = new List<JournalCard>();
        public Button prevButton;
        public Button nextButton;

        [Header("Page dots")]
        public RectTransform dotsContainer;   // a HorizontalLayoutGroup; dots are built here

        [Header("Tuning")]
        public float step = 280f;              // px between adjacent cards
        public float transitionTime = 0.42f;   // matches CSS 420ms

        public UnityEvent<JournalCard> onOpen;

        private int _active;
        private float _animActive;             // smoothed fractional index
        private float _from, _to, _t = 1f;
        private readonly List<Image> _dots = new List<Image>();

        private PaperPetalsTheme T => theme != null ? theme : PaperPetalsTheme.Active;

        private void OnEnable()
        {
            if (prevButton) prevButton.onClick.AddListener(Prev);
            if (nextButton) nextButton.onClick.AddListener(Next);
            foreach (var c in cards) if (c != null) { c.onTap.RemoveListener(OnCardTap); c.onTap.AddListener(OnCardTap); }
            BuildDots();
            _animActive = _active;
            Layout(_animActive);
        }

        private void OnDisable()
        {
            if (prevButton) prevButton.onClick.RemoveListener(Prev);
            if (nextButton) nextButton.onClick.RemoveListener(Next);
        }

        public void Next() => GoTo(_active + 1);
        public void Prev() => GoTo(_active - 1);

        public void GoTo(int index)
        {
            index = Mathf.Clamp(index, 0, cards.Count - 1);
            if (index == _active && _t >= 1f) return;
            _active = index;
            _from = _animActive; _to = _active; _t = 0f;
            UpdateButtons();
            UpdateDots();
        }

        private void OnCardTap(JournalCard card)
        {
            int i = cards.IndexOf(card);
            if (i < 0) return;
            if (i != _active) { GoTo(i); return; }   // off-centre tap centres it
            onOpen?.Invoke(card);                     // centred tap opens the editor
        }

        private void Update()
        {
            // keyboard
#if ENABLE_INPUT_SYSTEM
            var kb = Keyboard.current;
            if (kb != null)
            {
                if (kb.rightArrowKey.wasPressedThisFrame) Next();
                else if (kb.leftArrowKey.wasPressedThisFrame) Prev();
            }
#else
            if (Input.GetKeyDown(KeyCode.RightArrow)) Next();
            else if (Input.GetKeyDown(KeyCode.LeftArrow)) Prev();
#endif
            if (_t < 1f)
            {
                _t += Time.unscaledDeltaTime / Mathf.Max(0.0001f, transitionTime);
                float k = T != null ? T.easePaper.Evaluate(Mathf.Clamp01(_t)) : Mathf.Clamp01(_t);
                _animActive = Mathf.LerpUnclamped(_from, _to, k);
                if (_t >= 1f) _animActive = _to;
                Layout(_animActive);
            }
        }

        /// <summary>Position, scale, tilt, fade and stack every card around the (fractional) active index.</summary>
        private void Layout(float active)
        {
            // gather for z-sorting
            var order = new List<(JournalCard card, int z)>();
            for (int i = 0; i < cards.Count; i++)
            {
                var card = cards[i];
                if (card == null) continue;
                float offset = i - active;
                float a = Mathf.Abs(offset);
                var rt = (RectTransform)card.transform;
                var cg = card.GetComponent<CanvasGroup>();

                if (a > 2.4f) { if (cg) cg.alpha = 0f; card.gameObject.SetActive(false); continue; }
                card.gameObject.SetActive(true);

                float sgn = Mathf.Sign(offset);
                float scale   = a < 0.5f ? 1f : a < 1.5f ? 0.74f : 0.52f;
                float tx      = offset * step * (a < 1.5f ? 1f : 1.05f);
                float rot     = a < 0.5f ? 0f : sgn * (a < 1.5f ? 5f : 9f);
                float ty      = a < 0.5f ? 0f : a < 1.5f ? 14f : 26f;
                float opacity = a < 0.5f ? 1f : a < 1.5f ? 0.95f : 0.40f;
                int   z       = 10 - Mathf.RoundToInt(a * 2f);

                rt.anchoredPosition = new Vector2(tx, -ty);                 // CSS +y is down → negate
                rt.localScale = Vector3.one * scale;
                rt.localRotation = Quaternion.Euler(0, 0, -rot);            // CSS +rot clockwise → -z
                if (cg) cg.alpha = opacity;
                order.Add((card, z));
            }
            // higher z drawn last (on top)
            order.Sort((p, q) => p.z.CompareTo(q.z));
            foreach (var o in order) o.card.transform.SetAsLastSibling();
        }

        // ── Dots ────────────────────────────────────────────────────────
        private void BuildDots()
        {
            if (dotsContainer == null) return;
            foreach (Transform c in dotsContainer) if (Application.isPlaying) Destroy(c.gameObject);
            _dots.Clear();
            var t = T;
            for (int i = 0; i < cards.Count; i++)
            {
                var go = new GameObject($"Dot{i}", typeof(RectTransform), typeof(CanvasRenderer), typeof(Image));
                go.transform.SetParent(dotsContainer, false);
                var img = go.GetComponent<Image>();
                if (t != null) { img.sprite = t.fillPill; img.type = Image.Type.Sliced; }
                var le = go.AddComponent<LayoutElement>();
                le.preferredHeight = 8;
                int idx = i;
                var btn = go.AddComponent<Button>();
                btn.transition = Selectable.Transition.None;
                btn.onClick.AddListener(() => GoTo(idx));
                _dots.Add(img);
            }
            UpdateDots();
        }

        private void UpdateDots()
        {
            var t = T;
            for (int i = 0; i < _dots.Count; i++)
            {
                bool on = i == _active;
                _dots[i].color = on ? (t != null ? t.accent : Color.gray)
                                    : (t != null ? t.fg2.A(0.22f) : new Color(0, 0, 0, .22f));
                var le = _dots[i].GetComponent<LayoutElement>();
                if (le) le.preferredWidth = on ? 24 : 8;
            }
        }

        private void UpdateButtons()
        {
            if (prevButton) prevButton.interactable = _active > 0;
            if (nextButton) nextButton.interactable = _active < cards.Count - 1;
        }
    }
}
