// CMS · Schedule — month calendar of what goes live when: daily packs (forest)
// and individual item launches via publishAt (gold).

const pad2 = (n) => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Schedule = ({ items, packs }) => {
  const [ym, setYm] = React.useState({ y: 2026, m: 5 }); // June 2026
  const { TODAY } = window.CMS;

  const first = new Date(ym.y, ym.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first offset
  const days = new Date(ym.y, ym.m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const step = (dir) => setYm(({ y, m }) => {
    const nm = m + dir;
    if (nm < 0) return { y: y - 1, m: 11 };
    if (nm > 11) return { y: y + 1, m: 0 };
    return { y, m: nm };
  });

  return (
    <div>
      <div className="cms-view-head">
        <div>
          <h1 className="cms-h1">Schedule</h1>
          <p className="cms-sub">Everything dated — staged weeks ahead, live automatically on the day.</p>
        </div>
        <div className="cms-monthnav">
          <button onClick={() => step(-1)} aria-label="Previous month" style={{ transform: 'scaleX(-1)' }}><CmsIcon name="chevron" size={18}/></button>
          <span>{MONTHS[ym.m]} {ym.y}</span>
          <button onClick={() => step(1)} aria-label="Next month"><CmsIcon name="chevron" size={18}/></button>
        </div>
      </div>

      <div className="cms-legend">
        <span><i style={{ background: '#4E6652' }}/> Daily pack</span>
        <span><i style={{ background: '#C8A96B' }}/> Item launch</span>
        <span><i className="ring"/> Today</span>
      </div>

      <div className="cms-card cms-cal">
        <div className="cms-cal-grid cms-cal-head">
          {WEEKDAYS.map(w => <div key={w} className="cms-cal-wd">{w}</div>)}
        </div>
        <div className="cms-cal-grid">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="cms-cal-cell empty"/>;
            const iso = `${ym.y}-${pad2(ym.m + 1)}-${pad2(d)}`;
            const pk = packs.find(p => p.date === iso);
            const launches = items.filter(it => it.publishAt === iso);
            const isToday = iso === TODAY;
            return (
              <div key={i} className={'cms-cal-cell' + (isToday ? ' today' : '')}>
                <span className="cms-cal-num">{d}</span>
                <div className="cms-cal-events">
                  {pk && <span className="cms-cal-ev pack" title={pk.title + (pk.sub.length ? ' · +' + pk.sub.length + ' premium' : '')}><CmsIcon name="pack" size={11}/> {pk.title}{pk.sub.length > 0 && <CmsIcon name="crown" size={11} style={{ marginLeft: 'auto', color: '#9C7A22' }}/>}</span>}
                  {launches.length > 0 && (
                    <span className="cms-cal-ev launch" title={launches.map(l => l.name).join(', ')}>
                      <CmsIcon name="sparkle" size={11}/> {launches.length} launch{launches.length === 1 ? '' : 'es'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Schedule });
