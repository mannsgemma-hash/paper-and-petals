// CMS · Library view — the single Item collection that feeds the Shop and the
// journal editor. Filter by category / tier / status, search, toggle free↔paid.

const LIB_STATUS_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'live',      label: 'Live' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'draft',     label: 'Draft' },
];

const Library = ({ items, onTierChange, onNew }) => {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const { CATEGORIES, CAT_LABEL, statusOf } = window.CMS;

  const rows = items.filter(it => {
    if (cat !== 'all' && it.category !== cat) return false;
    if (status !== 'all' && statusOf(it) !== status) return false;
    if (q.trim() && !it.name.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  });

  const COLS = '2.4fr 1.4fr 0.9fr 0.7fr 1fr 1fr';

  return (
    <div>
      <div className="cms-view-head">
        <div>
          <h1 className="cms-h1">Library</h1>
          <p className="cms-sub">{items.length} items · one collection powers the Shop and the journal editor</p>
        </div>
        <button className="cms-btn-primary" onClick={onNew}>
          <CmsIcon name="plus" size={17} stroke={2.2}/> New item
        </button>
      </div>

      {/* Filters */}
      <div className="cms-toolbar">
        <div className="cms-search">
          <CmsIcon name="search" size={16}/>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items…"/>
        </div>
        <div className="cms-segment">
          {LIB_STATUS_FILTERS.map(f => (
            <button key={f.id} className={status === f.id ? 'on' : ''} onClick={() => setStatus(f.id)}>{f.label}</button>
          ))}
        </div>
        <select className="cms-select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="cms-card">
        <div className="cms-trow cms-thead" style={{ gridTemplateColumns: COLS }}>
          <div>Item</div><div>Category</div><div>Tier</div><div>Price</div><div>Status</div><div>Publish date</div>
        </div>
        {rows.map(it => {
          const st = statusOf(it);
          return (
            <div key={it.id} className="cms-trow" style={{ gridTemplateColumns: COLS }}>
              <div className="cms-cell-item">
                <ItemThumb item={it}/>
                <span className="cms-item-name">{it.name}</span>
              </div>
              <div className="cms-muted">{CAT_LABEL[it.category]}</div>
              <div><TierToggle tier={it.tier} onChange={(t) => onTierChange(it.id, t)}/></div>
              <div style={{ fontWeight: 600, color: it.tier === 'paid' ? 'var(--fg-1)' : 'var(--fg-3)' }}>
                {it.tier === 'paid' ? `$${it.price.toFixed(2)}` : 'Free'}
              </div>
              <div><StatusBadge status={st}/></div>
              <div className="cms-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {st === 'scheduled' && <CmsIcon name="clock" size={14}/>}
                {fmtDate(it.publishAt)}
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="cms-empty">No items match these filters.</div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { Library });
