using System;
using UnityEngine;

namespace PaperPetals.UI
{
    /// <summary>
    /// A CSS-style cubic-bezier timing function, evaluated the same way browsers do
    /// (solve x(t)=input via Newton-Raphson, return y). Lets the Unity motion match
    /// the design system's easing curves exactly.
    /// </summary>
    [Serializable]
    public struct CubicBezier
    {
        public float x1, y1, x2, y2;

        public CubicBezier(float x1, float y1, float x2, float y2)
        { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; }

        // colors_and_type.css motion curves
        public static CubicBezier Paper => new CubicBezier(0.32f, 0.72f, 0.32f, 1f);  // --ease-paper  (slow settle)
        public static CubicBezier Petal => new CubicBezier(0.22f, 1f,    0.36f, 1f);  // --ease-petal  (drift in)
        public static CubicBezier Press => new CubicBezier(0.40f, 0f,    0.20f, 1f);  // --ease-press

        private static float A(float a, float b) => 1f - 3f * b + 3f * a;
        private static float B(float a, float b) => 3f * b - 6f * a;
        private static float C(float a)            => 3f * a;
        private static float Curve(float t, float a, float b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
        private static float Slope(float t, float a, float b) => 3f * A(a, b) * t * t + 2f * B(a, b) * t + C(a);

        /// <summary>Evaluate eased value for a normalized input x in [0,1].</summary>
        public float Evaluate(float x)
        {
            x = Mathf.Clamp01(x);
            // Linear shortcuts
            if (Mathf.Approximately(x1, y1) && Mathf.Approximately(x2, y2)) return x;
            float t = x;
            for (int i = 0; i < 8; i++)               // Newton-Raphson
            {
                float xt = Curve(t, x1, x2) - x;
                float d = Slope(t, x1, x2);
                if (Mathf.Abs(xt) < 1e-5f) break;
                if (Mathf.Abs(d) < 1e-6f) break;
                t -= xt / d;
            }
            return Curve(Mathf.Clamp01(t), y1, y2);
        }
    }

    public static class PPEasing
    {
        /// <summary>Bake a CubicBezier into a Unity AnimationCurve (handy for Inspector preview).</summary>
        public static AnimationCurve ToCurve(this CubicBezier b, int samples = 24)
        {
            var c = new AnimationCurve();
            for (int i = 0; i <= samples; i++)
            {
                float x = i / (float)samples;
                c.AddKey(x, b.Evaluate(x));
            }
            for (int i = 0; i < c.length; i++) c.SmoothTangents(i, 0f);
            return c;
        }
    }
}
