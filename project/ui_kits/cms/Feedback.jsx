// CMS · Feedback — inbox of submissions from the in-app Send-feedback form
// (SCR-23). Filter by type, mark read.

const FB_TYPE = {
  idea: { label: 'Idea',       icon: 'idea',  bg: 'rgba(168,137,63,0.16)', fg: '#7E6322' },
  bug:  { label: 'Bug',        icon: 'bug',   bg: 'rgba(178,106,90,0.14)', fg: '#9C4F3D' },
  love: { label: 'Kind words', icon: 'heart', bg: 'rgba(78,102,82,0.12)',  fg: '#3F5443' },
};
const FB_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'idea', label: 'Ideas' },
  { id: 'bug', label: 'Bugs' },
  { id: 'love', label: 'Kind words' },
];

const Feedback = ({ feedback, onToggleRead }) => {
  const [filter, setFilter] = React.useState('all');
  const unread = feedback.filter(f => !f.read).length;

  const rows = feedback.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !f.read;
    return f.type === filter;
  });

  return (
    <div>
      <div className="cms-view-head">
        <div>
          <h1 className="cms-h1">Feedback</h1>
          <p className="cms-sub">{unread} unread · synced from your Canny feedback board (in-app “Send feedback”)</p>
        </div>
      </div>

      <div className="cms-toolbar">
        <div className="cms-segment">
          {FB_FILTERS.map(f => (
            <button key={f.id} className={filter === f.id ? 'on' : ''} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="cms-fblist">
        {rows.map(f => {
          const t = FB_TYPE[f.type];
          return (
            <div key={f.id} className={'cms-fbcard' + (f.read ? '' : ' unread')}>
              <span className="cms-fb-type" style={{ background: t.bg, color: t.fg }}>
                <CmsIcon name={t.icon} size={16}/>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cms-fb-top">
                  <span className="cms-fb-typelabel" style={{ color: t.fg }}>{t.label}</span>
                  <span className="cms-muted cms-fb-date">{fmtDate(f.date)}</span>
                </div>
                <p className="cms-fb-msg">{f.message}</p>
                <div className="cms-fb-from">
                  {f.email
                    ? <><CmsIcon name="mail" size={13}/> <a href={'mailto:' + f.email}>{f.email}</a></>
                    : <span className="cms-muted">Anonymous</span>}
                </div>
              </div>
              <button className="cms-fb-read" onClick={() => onToggleRead(f.id)} title={f.read ? 'Mark unread' : 'Mark read'}>
                {f.read ? 'Mark unread' : <><CmsIcon name="check" size={15} stroke={2.2}/> Mark read</>}
              </button>
            </div>
          );
        })}
        {rows.length === 0 && <div className="cms-empty">Nothing here.</div>}
      </div>
    </div>
  );
};

Object.assign(window, { Feedback });
