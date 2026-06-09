// Tabler-style outline icons used across the kit. Stroke inherits from currentColor.
// 24×24 viewBox, 1.75 stroke, rounded caps.

const Icon = ({ name, size = 22, stroke = 1.75, ...rest }) => {
  const paths = {
    home: <><path d="M5 12L12 5l7 7"/><path d="M7 11v8h10v-8"/></>,
    undo: <><path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-1"/></>,
    redo: <><path d="M15 7l5 5-5 5"/><path d="M20 12H9a5 5 0 0 0 0 10h1"/></>,
    scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/></>,
    ribbon: <><path d="M8 3l4 5 4-5"/><path d="M8 3l-3 6 7 12 7-12-3-6"/><path d="M12 8v13"/></>,
    bag: <><path d="M5 9h14l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    book: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></>,
    archive: <><rect x="4" y="6" width="16" height="4" rx="1"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M10 14h4"/></>,
    window: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16"/></>,
    shop: <><path d="M4 9h16l-1.5 10.5a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    mail: <><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></>,
    back: <><path d="M15 6l-6 6 6 6"/></>,
    close: <><path d="M19 5L5 19M5 5l14 14"/></>,
    add: <><path d="M12 6v12M6 12h12"/></>,
    edit: <><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14 6l4 4"/></>,
    share: <><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></>,
    star: <><polygon points="12,4 14.5,9.5 20.5,10 16,14.5 17.2,20.5 12,17.5 6.8,20.5 8,14.5 3.5,10 9.5,9.5"/></>,
    heart: <><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></>,
    bug: <><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M5 13h14M5 17h14M5 9h14"/><path d="M12 9v12"/></>,
    bulb: <><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z"/></>,
    chat: <><path d="M21 12a8 8 0 1 1-3-6.3L21 4l-1.3 3.7A8 8 0 0 1 21 12z"/></>,
    flag: <><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></>,
    check: <><path d="M5 12l5 5L20 7"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></>,
    scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/></>,
    pencil: <><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/></>,
    stamp: <><path d="M5 21h14"/><rect x="6" y="14" width="12" height="4"/><path d="M9 14V9a3 3 0 0 1 6 0v5"/></>,
    border: <><rect x="4" y="4" width="16" height="16" rx="1" strokeDasharray="3 3"/></>,
    paper: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/></>,
    flower: <><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-2 1-3.6 2.6-3.6S17 7.6 17 9.6"/><path d="M12 14.4c0 2 1 3.6 2.6 3.6S17 16.4 17 14.4"/><path d="M12 9.6c0-2-1-3.6-2.6-3.6S7 7.6 7 9.6"/><path d="M12 14.4c0 2-1 3.6-2.6 3.6S7 16.4 7 14.4"/></>,
    package: <><path d="M3 8l9-5 9 5M3 8v9l9 5M3 8l9 5M21 8v9l-9 5M21 8l-9 5M12 13v9"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    shield: <><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></>,
    volume: <><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 8a5 5 0 0 1 0 8"/></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 5v6h-6"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></>,
    chevron: <><path d="M9 6l6 6-6 6"/></>,
    crown: <><path d="M3 18h18"/><path d="M3 8l4 4 5-6 5 6 4-4v10H3z"/></>,
    moon: <><path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/></>,
    gift: <><rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11"/><path d="M9 9a3 3 0 0 1 0-6c2 0 3 3 3 6-1 0-3 0-3 0z"/><path d="M15 9a3 3 0 0 0 0-6c-2 0-3 3-3 6 1 0 3 0 3 0z"/></>,
    doc: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13h6M9 17h6M9 9h2"/></>,
    logout: <><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"/><path d="M16 8l4 4-4 4"/><path d="M20 12H9"/></>,
    image: <><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.5"/><path d="M5 17l4-4 3 3 4-5 3 4"/></>,
    palette: <><path d="M12 3a9 9 0 0 0 0 18c2 0 2-1 1.5-2.5S13 16 14.5 16H17a4 4 0 0 0 4-4 9 9 0 0 0-9-9z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/></>,
    seal: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4"/><path d="M12 5v-2M12 19v2M5 12h-2M19 12h2"/></>,
    layers: <><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></>,
    grip: <><path d="M8 8h8M8 12h8M8 16h8"/></>,
    leaf: <><path d="M5 19c4-13 14-14 14-14s-1 10-14 14z"/><path d="M12 12L18 6"/></>,
    heart: <><path d="M12 20s-7-4-9-9c-1-3 1-6 4-6s4 3 5 4c1-1 2-4 5-4s5 3 4 6c-2 5-9 9-9 9z"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

Object.assign(window, { Icon });
