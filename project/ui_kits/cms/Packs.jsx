// CMS · Daily Packs — build the parcel that lands in each user's app on a given
// date. Each date has two tracks: a FREE pack (every user) and a SUBSCRIPTION
// pack (premium members). Each track references library items by id.

const TRACKS = {
  free: { label: 'Free pack',         short: 'Free',    icon: 'pack',  accent: '#4E6652', soft: 'rgba(78,102,82,0.12)', blurb: 'Ships to every user. Keep it small — one or two free pieces.' },
  sub:  { label: 'Subscription pack', short: 'Premium', icon: 'crown', accent: '#9C7A22', soft: 'rgba(168,137,63,0.18)', blurb: 'Premium members only. A richer set — include paid items free for subscribers.' },
};

const Packs = ({ packs, items, onAddItem, onRemoveItem }) => {
  const [selected, setSelected] = React.useState(packs[0]?.date);
  const [track, setTrack] = React.useState('free');
  const [adding, setAdding] = React.useState(false);
  const [q, setQ] = React.useState('');
  const byId = React.useMemo(() => Object.fromEntries(items.map(i => [i.id, i])), [items]);
  const { CAT_LABEL } = window.CMS;

  const pack = packs.find(p => p.date === selected) || packs[0];
  const ids = pack[track] || [];
  const packItems = ids.map(id => byId[id]).filter(Boolean);
  const candidates = items.filter(i =>
    !ids.includes(i.id) &&
    (!q.trim() || i.name.toLowerCase().includes(q.trim().toLowerCase()))
  );
  const T = TRACKS[track];

  return (
    <div>
      <div className="cms-view-head">
        <div>
          <h1 className="cms-h1">Daily delivery packs</h1>
          <p className="cms-sub">Curate two parcels per day — a free drop for everyone and a richer subscription drop for members. They publish automatically on their date.</p>
        </div>
      </div>

      <div className="cms-packs">
        {/* Date rail */}
        <div className="cms-card cms-daterail">
          {packs.map(p => {
            const d = fmtDayShort(p.date);
            const on = p.date === selected;
            const isToday = p.date === window.CMS.TODAY;
            return (
              <button key={p.date} className={'cms-dayrow' + (on ? ' on' : '')} onClick={() => { setSelected(p.date); setAdding(false); }}>
                <span className="cms-day-cal">
                  <span className="wd">{d.wd}</span>
                  <span className="dm">{p.date.slice(8)}</span>
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="cms-day-title">{p.title}{isToday && <span className="cms-today">Today</span>}</span>
                  <span className="cms-day-meta">
                    <span className="cms-dot" style={{ background: '#4E6652' }}/> {p.free.length} free
                    <span className="cms-dot" style={{ background: '#C8A96B', marginLeft: 8 }}/> {p.sub.length} premium
                  </span>
                </span>
                <CmsIcon name="chevron" size={16}/>
              </button>
            );
          })}
        </div>

        {/* Selected pack */}
        <div className="cms-card cms-packdetail">
          <div className="cms-packdetail-head">
            <div>
              <div className="cms-eyebrow">{fmtDate(pack.date, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <h2 className="cms-h2">{pack.title}</h2>
            </div>
            <button className="cms-btn-secondary" onClick={() => setAdding(a => !a)}>
              <CmsIcon name="plus" size={16} stroke={2.2}/> Add items
            </button>
          </div>

          {/* Free / Subscription track toggle */}
          <div className="cms-trackbar">
            {Object.entries(TRACKS).map(([id, t]) => {
              const active = track === id;
              return (
                <button key={id} className={'cms-track' + (active ? ' on' : '')} onClick={() => { setTrack(id); setAdding(false); }}
                  style={active ? { borderColor: t.accent, background: t.soft, color: t.accent } : {}}>
                  <CmsIcon name={t.icon} size={17}/>
                  {t.label}
                  <span className="cms-track-cnt" style={active ? { background: t.accent, color: '#FFFDF6' } : {}}>{pack[id].length}</span>
                </button>
              );
            })}
          </div>
          <p className="cms-track-blurb"><CmsIcon name={track === 'sub' ? 'lock' : 'sparkle'} size={13}/> {T.blurb}</p>

          {adding && (
            <div className="cms-addpanel">
              <div className="cms-search sm">
                <CmsIcon name="search" size={15}/>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Add an item to the ${T.short.toLowerCase()} pack…`} autoFocus/>
              </div>
              <div className="cms-addlist">
                {candidates.slice(0, 8).map(i => (
                  <button key={i.id} className="cms-addrow" onClick={() => onAddItem(pack.date, track, i.id)}>
                    <ItemThumb item={i} size={30}/>
                    <span className="cms-addrow-name">{i.name}</span>
                    <span className={'cms-tier-tag ' + i.tier}>{i.tier === 'paid' ? `$${i.price.toFixed(2)}` : 'Free'}</span>
                    <CmsIcon name="plus" size={15} stroke={2.2}/>
                  </button>
                ))}
                {candidates.length === 0 && <div className="cms-empty sm">Nothing left to add.</div>}
              </div>
            </div>
          )}

          {packItems.length === 0 ? (
            <div className="cms-packempty">
              <CmsIcon name={T.icon} size={30}/>
              <p>{track === 'sub'
                ? 'No premium items yet. Subscribers expect a little more — add a few, including paid pieces they get for free.'
                : 'This free pack is empty. Add a piece or two that every user receives.'}</p>
            </div>
          ) : (
            <div className="cms-chipgrid">
              {packItems.map(i => (
                <div key={i.id} className="cms-itemchip">
                  <ItemThumb item={i} size={38}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cms-chip-name">{i.name}</div>
                    <div className="cms-chip-meta">
                      <span className={'cms-tier-tag ' + i.tier}>{i.tier === 'paid' ? `$${i.price.toFixed(2)}` : 'Free'}</span>
                      <span className="cms-muted">{CAT_LABEL[i.category]}</span>
                    </div>
                  </div>
                  <button className="cms-chip-x" onClick={() => onRemoveItem(pack.date, track, i.id)} aria-label="Remove">
                    <CmsIcon name="trash" size={15}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Packs });
