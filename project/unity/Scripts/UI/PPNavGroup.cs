using System.Collections.Generic;
using UnityEngine;

namespace PaperPetals.UI
{
    /// <summary>
    /// Manages single-selection across a set of <see cref="PPNavItem"/>s (the left
    /// sidebar rail). Drop on the rail container and add the items, or let them
    /// register themselves by setting their <c>group</c> field.
    /// </summary>
    public class PPNavGroup : MonoBehaviour
    {
        public List<PPNavItem> items = new List<PPNavItem>();

        private void OnEnable()
        {
            if (items == null || items.Count == 0)
                items = new List<PPNavItem>(GetComponentsInChildren<PPNavItem>(true));
            foreach (var it in items) if (it != null) it.group = this;
        }

        public void Select(PPNavItem chosen)
        {
            foreach (var it in items)
                if (it != null) it.SetActive(it == chosen);
        }
    }
}
