using System.Collections;
using UnityEngine;

namespace PaperPetals.UI
{
    /// <summary>
    /// Shared tween coroutines that reproduce the design system's "paper physics":
    /// a small lift on the Y axis and a press scale, both eased with a CubicBezier.
    /// Components drive these so the feel is identical everywhere.
    /// </summary>
    public static class PPMotion
    {
        /// <summary>
        /// Animate a RectTransform's anchored Y and uniform scale to targets over <paramref name="dur"/>.
        /// Respects reduced-motion: snaps instantly if duration is ~0.
        /// </summary>
        public static IEnumerator LiftPress(RectTransform rt, float baseY, float toY,
                                            float toScale, float dur, CubicBezier ease)
        {
            if (rt == null) yield break;
            float fromY = rt.anchoredPosition.y;
            float fromS = rt.localScale.x;

            if (dur <= 0.0001f)
            {
                Set(rt, toY, toScale);
                yield break;
            }

            float t = 0f;
            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                float k = ease.Evaluate(Mathf.Clamp01(t / dur));
                float y = Mathf.LerpUnclamped(fromY, toY, k);
                float s = Mathf.LerpUnclamped(fromS, toScale, k);
                Set(rt, y, s);
                yield return null;
            }
            Set(rt, toY, toScale);
        }

        private static void Set(RectTransform rt, float y, float scale)
        {
            var p = rt.anchoredPosition; p.y = y; rt.anchoredPosition = p;
            rt.localScale = new Vector3(scale, scale, 1f);
        }
    }
}
