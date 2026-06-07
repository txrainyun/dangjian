/* ===== 党建信息平台 v2.0 - 主应用逻辑 ===== */

;(function() {
  const app = {};

  // ===== 状态 =====
  let currentPage = 'dashboard';
  let currentMemberId = 1;
  let calendarDate = new Date(2026, 5, 1);
  let nextVolunteerId = 20;
  let nextCustomEventId = 1;

  // ===== 工具 =====
  function getStageIndex(s) { return PartyData.stages.indexOf(s); }
  function stageColor(s) { const i = getStageIndex(s); return i < 0 ? '' : 'stage-' + i; }
  function stageColors() { return ['#2e7d32','#1565c0','#e65100','#c62828','#6a1b9a']; }
  function fmtDate(d) { if (!d) return '-'; const t = new Date(d); return t.getFullYear()+'年'+(t.getMonth()+1)+'月'+t.getDate()+'日'; }
  function pad2(n) { return String(n).padStart(2,'0'); }
  function getMember(id) { return PartyData.members.find(m => m.id === id); }

  // ===== 导航 =====
  function init() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', function() { if (this.dataset.page) navigateTo(this.dataset.page); });
    });
    document.getElementById('modal-close').addEventListener('click', () => hide('member-modal'));
    document.getElementById('member-modal').addEventListener('click', function(e) { if (e.target===this) hide('member-modal'); });
    document.getElementById('material-modal-close').addEventListener('click', () => hide('material-modal'));
    document.getElementById('material-modal').addEventListener('click', function(e) { if (e.target===this) hide('material-modal'); });
    document.getElementById('cal-prev').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth()-1); renderCalendar(); });
    document.getElementById('cal-next').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth()+1); renderCalendar(); });
    document.getElementById('cal-today').addEventListener('click', () => { calendarDate = new Date(2026,5,1); renderCalendar(); });
    document.getElementById('add-event-btn').addEventListener('click', () => show('add-event-modal'));
    document.getElementById('event-close').addEventListener('click', () => hide('add-event-modal'));
    document.getElementById('add-event-modal').addEventListener('click', function(e) { if (e.target===this) hide('add-event-modal'); });
    document.getElementById('save-event-btn').addEventListener('click', saveCustomEvent);
    document.getElementById('add-volunteer-btn').addEventListener('click', openVolunteerModal);
    document.getElementById('vol-close').addEventListener('click', () => hide('add-volunteer-modal'));
    document.getElementById('add-volunteer-modal').addEventListener('click', function(e) { if (e.target===this) hide('add-volunteer-modal'); });
    document.getElementById('save-volunteer-btn').addEventListener('click', saveVolunteer);
    document.getElementById('search-input').addEventListener('input', doSearch);
    navigateTo('dashboard');
  }

  function show(id) { document.getElementById(id).classList.add('show'); }
  function hide(id) { document.getElementById(id).classList.remove('show'); }

  function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector('.nav-item[data-page="'+page+'"]');
    if (navItem) navItem.classList.add('active');
    const titles = { dashboard:['首页仪表盘','党组织建设总体情况概览'], members:['党员管理','查看和管理党员个人信息'], timeline:['培养历程','记录党员发展全周期时间线'], calendar:['思政日历','党的重大日子、会议及节假日'], portrait:['数字画像','党员队伍发展状况数据分析'] };
    const t = titles[page] || titles.dashboard;
    document.getElementById('page-title').textContent = t[0];
    document.getElementById('page-desc').textContent = t[1];
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const p = document.getElementById('page-'+page);
    if (p) p.classList.add('active');
    if (page==='dashboard') renderDashboard();
    else if (page==='members') renderMembers();
    else if (page==='timeline') renderTimeline();
    else if (page==='calendar') renderCalendar();
    else if (page==='portrait') renderPortrait();
  }

  // ==================== 仪表盘 ====================
  function renderDashboard() {
    const members = PartyData.members;
    document.getElementById('stat-total').textContent = members.length;

    const sc = {}; PartyData.stages.forEach(s => sc[s]=0);
    members.forEach(m => sc[m.stage]++);
    const colors = stageColors();
    const container = document.getElementById('stat-details');
    container.innerHTML = PartyData.stages.map((s,i) =>
      '<div class="stat-card"><div class="stat-label">'+s+'</div><div class="stat-value" style="color:'+colors[i]+'">'+(sc[s]||0)+'</div><div class="stat-sub">占比 '+((sc[s]/members.length*100)||0).toFixed(1)+'%</div></div>'
    ).join('');

    // 小型环形图
    const labels = PartyData.stages;
    const data = labels.map(l => sc[l]||0);
    renderDonut('dash-stage-ring', data, labels, colors, {size:140, innerPct:55, showCenter:true});

    // 图例
    const total = data.reduce((a,b)=>a+b,0)||1;
    const leg = document.getElementById('dash-stage-legend');
    leg.innerHTML = labels.map((l,i) =>
      '<div class="legend-row"><span class="legend-dot-sm" style="background:'+colors[i]+'"></span><span class="name">'+l+'</span><span class="val">'+(data[i]||0)+'</span><span class="pct">'+(data[i]/total*100).toFixed(1)+'%</span></div>'
    ).join('');

    // 近期活动
    const sorted = [...members].sort((a,b)=>(b.timeline[b.timeline.length-1].date||'').localeCompare(a.timeline[a.timeline.length-1].date||'')).slice(0,5);
    document.getElementById('recent-members').innerHTML = sorted.map(m => {
      const last = m.timeline[m.timeline.length-1];
      return '<tr><td>'+m.name+'</td><td>'+m.department+'</td><td><span class="stage-tag '+stageColor(m.stage)+'">'+m.stage+'</span></td><td>'+fmtDate(last.date)+'</td><td><span class="tag '+(m.timeline.length>=3?'tag-green':m.timeline.length>=2?'tag-orange':'tag-blue')+'">'+m.timeline.length+'/'+PartyData.stages.length+'阶段</span></td></tr>';
    }).join('');

    // 即将到来的日程
    const now = '2026-06-07';
    const upcoming = getAllEvents().filter(e => e.date >= now).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
    const typeLabels = {party:'党的纪念',holiday:'法定假日',festival:'传统节日',meeting:'党的会议',custom:'自定义'};
    const typeColors = {party:'tag-red',holiday:'tag-green',festival:'tag-orange',meeting:'tag-purple',custom:'tag-blue'};
    const typeDots = {party:'party',holiday:'holiday',festival:'festival',meeting:'meeting',custom:'holiday'};
    document.getElementById('dash-upcoming-list').innerHTML = upcoming.map(e =>
      '<li><span class="event-mini-dot '+typeDots[e.type]+'"></span><span style="color:#888;font-size:12px">'+e.date.slice(5)+'</span><span style="flex:1">'+e.name+'</span><span class="tag '+typeColors[e.type]+'">'+(typeLabels[e.type]||e.type)+'</span></li>'
    ).join('');
  }

  // ==================== 环形图 ====================
  function renderDonut(containerId, data, labels, colors, opts) {
    opts = opts || {};
    const size = opts.size || 200;
    const innerPct = opts.innerPct || 60;
    const total = data.reduce((a,b)=>a+b,0)||1;
    let angle = 0;
    const segments = data.map((v,i) => {
      if (v===0) return '';
      const pct = v/total*100;
      const deg = pct/100*360;
      const s = colors[i]+' '+angle+'deg '+(angle+deg)+'deg';
      angle += deg;
      return s;
    }).filter(Boolean).join(', ');

    const gradient = segments ? 'conic-gradient('+segments+')' : '#eee';
    const html = '<div class="donut-ring" style="width:'+size+'px;height:'+size+'px;background:'+gradient+'"><div class="donut-center"><span class="num">'+total+'</span><span class="label">党员总数</span></div></div>';
    document.getElementById(containerId).innerHTML = html;
  }

  function getAllEvents() {
    return [...PartyData.calendarEvents, ...(PartyData.customEvents||[])];
  }

  // ==================== 党员管理 ====================
  function renderMembers() {
    const tbody = document.getElementById('members-list');
    tbody.innerHTML = PartyData.members.map(m =>
      '<tr style="cursor:pointer" data-id="'+m.id+'"><td>'+m.name+'</td><td>'+m.gender+'</td><td>'+m.department+'</td><td><span class="stage-tag '+stageColor(m.stage)+'">'+m.stage+'</span></td><td>'+(m.joinDate?fmtDate(m.joinDate):'进行中')+'</td><td>'+m.phone+'</td><td><button class="member-btn" style="font-size:12px;padding:4px 12px">查看详情</button></td></tr>'
    ).join('');
    tbody.querySelectorAll('tr').forEach(el => el.addEventListener('click', function() { showMemberDetail(parseInt(this.dataset.id)); }));
  }

  function doSearch() {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('#members-list tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      const match = q==='' || (cells[0]&&cells[0].textContent.toLowerCase().includes(q)) || (cells[2]&&cells[2].textContent.toLowerCase().includes(q));
      row.style.display = match ? '' : 'none';
    });
  }

  // ==================== 党员详情 ====================
  function showMemberDetail(id) {
    const m = getMember(id);
    if (!m) return;
    document.getElementById('modal-name').textContent = m.name;
    document.getElementById('modal-gender').textContent = m.gender;
    document.getElementById('modal-birth').textContent = m.birth;
    document.getElementById('modal-dept').textContent = m.department;
    document.getElementById('modal-phone').textContent = m.phone;
    document.getElementById('modal-stage').textContent = m.stage;
    document.getElementById('modal-joindate').textContent = m.joinDate ? fmtDate(m.joinDate) : '尚未转为正式党员';

    // 时间线
    const tlHTML = m.timeline.map((t,i) => {
      const isLast = i===m.timeline.length-1;
      const isCur = isLast && m.stage!=='正式党员';
      return '<div class="timeline-item '+(isLast&&m.stage==='正式党员'?'completed':'')+' '+(isCur?'current':'')+'"><div class="timeline-dot"></div><div class="timeline-date">'+fmtDate(t.date)+'</div><div class="timeline-title">'+t.stage+'</div><div class="timeline-materials"><div class="material-list">'+
        t.materials.map(mat => {
          const typeIcon = {document:'📄',form:'📋',report:'📝',certificate:'🏅'};
          return '<span class="material-chip type-'+mat.type+'" data-member="'+m.id+'" data-stage="'+t.stage+'" data-material="'+mat.name+'"><span class="mat-icon">'+(typeIcon[mat.type]||'📄')+'</span>'+mat.name+'</span>';
        }).join('')+'</div></div></div>';
    }).join('');
    document.getElementById('modal-timeline').innerHTML = tlHTML;

    // 志愿活动
    const vols = (PartyData.volunteerActivities||[]).filter(v => v.memberId === m.id);
    const volContainer = document.getElementById('modal-volunteers');
    if (vols.length===0) {
      volContainer.innerHTML = '<div class="empty-state" style="padding:20px"><p style="font-size:13px">暂无志愿活动记录</p></div>';
    } else {
      volContainer.innerHTML = '<table><thead><tr><th>活动名称</th><th>日期</th><th>时长</th><th>地点</th></tr></thead><tbody>'+
        vols.map(v => '<tr><td>'+v.name+'</td><td>'+fmtDate(v.date)+'</td><td><span class="vol-hours">'+v.hours+'小时</span></td><td>'+v.location+'</td></tr>').join('')+'</tbody></table>';
    }

    // 绑定材料点击
    document.querySelectorAll('#modal-timeline .material-chip').forEach(el => {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        const mid = parseInt(this.dataset.member);
        const stageName = this.dataset.stage;
        const matName = this.dataset.material;
        const member = getMember(mid);
        if (!member) return;
        const stageObj = member.timeline.find(t => t.stage === stageName);
        if (!stageObj) return;
        const mat = stageObj.materials.find(mt => mt.name === matName);
        if (mat) showMaterialContent(matName, mat.content, mat.type);
      });
    });

    show('member-modal');
  }

  function showMaterialContent(name, content, type) {
    document.getElementById('material-modal-title').textContent = name;
    const typeLabels = {document:'文档',form:'表格',report:'思想汇报',certificate:'证书'};
    const typeTag = '<span class="tag '+(type==='document'?'tag-blue':type==='form'?'tag-green':type==='report'?'tag-orange':'tag-purple')+'" style="margin-left:8px;font-size:11px;vertical-align:middle">'+(typeLabels[type]||type)+'</span>';
    document.getElementById('material-modal-title').innerHTML = name + typeTag;
    document.getElementById('material-modal-content').textContent = content;
    show('material-modal');
  }

  // ==================== 培养历程 ====================
  function renderTimeline() {
    const sel = document.getElementById('member-selector');
    sel.innerHTML = PartyData.members.map(m =>
      '<button class="member-btn '+(m.id===currentMemberId?'active':'')+'" data-id="'+m.id+'">'+m.name+'</button>'
    ).join('');
    sel.querySelectorAll('.member-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        currentMemberId = parseInt(this.dataset.id);
        sel.querySelectorAll('.member-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderTimelineView();
      });
    });
    renderTimelineView();
  }

  function renderTimelineView() {
    const m = getMember(currentMemberId);
    if (!m) return;
    document.getElementById('timeline-member-name').textContent = m.name;
    document.getElementById('timeline-member-dept').textContent = m.department;
    const sc = document.getElementById('timeline-member-current');
    sc.textContent = m.stage;
    sc.className = 'stage-tag '+stageColor(m.stage);
    document.getElementById('timeline-container').innerHTML = m.timeline.map((t,i) => {
      const isLast = i===m.timeline.length-1;
      const isCur = isLast && m.stage!=='正式党员';
      return '<div class="timeline-item '+(isLast&&m.stage==='正式党员'?'completed':'')+' '+(isCur?'current':'')+'"><div class="timeline-dot"></div><div class="timeline-date">'+fmtDate(t.date)+'</div><div class="timeline-title">'+t.stage+'</div><div class="timeline-materials"><div class="material-list">'+
        t.materials.map(mat => {
          const typeIcon = {document:'📄',form:'📋',report:'📝',certificate:'🏅'};
          return '<span class="material-chip type-'+mat.type+'"><span class="mat-icon">'+(typeIcon[mat.type]||'📄')+'</span>'+mat.name+'</span>';
        }).join('')+'</div></div></div>';
    }).join('');
  }

  // ==================== 思政日历 ====================
  function renderCalendar() {
    const y = calendarDate.getFullYear(), m = calendarDate.getMonth();
    document.getElementById('cal-title').textContent = y+'年'+(m+1)+'月';
    const first = new Date(y,m,1).getDay();
    const dim = new Date(y,m+1,0).getDate();
    const dimPrev = new Date(y,m,0).getDate();
    const grid = document.getElementById('cal-days');
    grid.innerHTML = '';

    // 所有事件索引
    const eventMap = {};
    getAllEvents().forEach(e => {
      const parts = e.date.split('-');
      const ey = parseInt(parts[0]), em = parseInt(parts[1])-1, ed = parseInt(parts[2]);
      const key = ey+'-'+pad2(em+1)+'-'+pad2(ed);
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(e);
    });

    const today = new Date();
    const dayTypes = {party:'党的纪念',holiday:'法定假日',festival:'传统节日',meeting:'党的会议',custom:'自定义'};

    function addCell(dayNum, isOther, isToday, monthAdjust) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day'+(isOther?' other-month':'')+(isToday?' today':'');
      const num = document.createElement('div');
      num.className = 'day-number';
      num.textContent = dayNum;
      cell.appendChild(num);
      if (!isOther) {
        const dateStr = y+'-'+pad2(m+1+monthAdjust)+'-'+pad2(dayNum);
        const events = eventMap[dateStr] || [];
        events.forEach(e => {
          const ev = document.createElement('div');
          ev.className = 'calendar-event type-'+(e.type==='custom'?'custom':e.type);
          ev.textContent = e.name;
          ev.title = dayTypes[e.type]||e.type;
          cell.appendChild(ev);
        });
      }
      grid.appendChild(cell);
    }

    for (let i=first-1; i>=0; i--) addCell(dimPrev-i, true, false, -1);
    for (let d=1; d<=dim; d++) addCell(d, false, y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate(), 0);
    const rem = (7 - (first+dim)%7) % 7;
    for (let d=1; d<=rem; d++) addCell(d, true, false, 1);
  }

  // ==================== 自定义日程 ====================
  function saveCustomEvent() {
    const date = document.getElementById('event-date').value;
    const name = document.getElementById('event-name').value.trim();
    const type = document.getElementById('event-type').value;
    if (!date || !name) { alert('请填写完整的日程信息'); return; }
    if (!PartyData.customEvents) PartyData.customEvents = [];
    PartyData.customEvents.push({ date: date, name: name, type: type||'custom' });
    hide('add-event-modal');
    document.getElementById('event-date').value = '';
    document.getElementById('event-name').value = '';
    renderCalendar();
    if (currentPage==='dashboard') renderDashboard();
  }

  // ==================== 数字画像 ====================
  function renderPortrait() {
    const members = PartyData.members;
    const total = members.length;
    const sc = {}; PartyData.stages.forEach(s => sc[s]=0);
    members.forEach(m => sc[m.stage]++);
    const colors = stageColors();

    // 统计概览
    const fullM = members.filter(m => m.stage==='正式党员').length;
    const inProg = members.filter(m => m.stage!=='正式党员').length;
    const avgMat = (members.reduce((s,m) => s+m.timeline.reduce((a,t) => a+t.materials.length,0), 0)/total).toFixed(1);
    const fullCycle = members.filter(m => m.timeline.length>=5).length;
    const totalVolHours = (PartyData.volunteerActivities||[]).reduce((s,v) => s+v.hours, 0);
    document.getElementById('stats-summary').innerHTML =
      '<div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">'+
        '<div class="stat-card"><div class="stat-label">党员总数</div><div class="stat-value" style="color:#C41E3A">'+total+'</div></div>'+
        '<div class="stat-card"><div class="stat-label">已转正</div><div class="stat-value" style="color:#2e7d32">'+fullM+'</div><div class="stat-sub">占比 '+(fullM/total*100).toFixed(1)+'%</div></div>'+
        '<div class="stat-card"><div class="stat-label">在途培养</div><div class="stat-value" style="color:#1565c0">'+inProg+'</div></div>'+
        '<div class="stat-card"><div class="stat-label">平均提交材料</div><div class="stat-value" style="color:#e65100;font-size:26px">'+avgMat+'</div><div class="stat-sub">份/人</div></div>'+
        '<div class="stat-card"><div class="stat-label">完整经历党员</div><div class="stat-value" style="color:#6a1b9a;font-size:26px">'+fullCycle+'</div><div class="stat-sub">已完成转正全流程</div></div>'+
        '<div class="stat-card"><div class="stat-label">志愿总时长</div><div class="stat-value" style="color:#00838f;font-size:26px">'+totalVolHours+'</div><div class="stat-sub">小时</div></div>'+
      '</div>';

    // 大环形图
    const labels = PartyData.stages;
    const data = labels.map(l => sc[l]||0);
    renderDonut('stage-donut-container', data, labels, colors, {size:220, innerPct:58, showCenter:true});
    // 图例
    const ttl = data.reduce((a,b)=>a+b,0)||1;
    const leg = document.getElementById('stage-donut-legend');
    leg.innerHTML = labels.map((l,i) =>
      '<div class="legend-row"><span class="legend-dot-sm" style="background:'+colors[i]+'"></span><span class="name">'+l+'</span><span class="val">'+(data[i]||0)+'人</span><span class="pct">'+(data[i]/ttl*100).toFixed(1)+'%</span></div>'
    ).join('');

    // 柱状图
    const maxVal = Math.max(...data, 1);
    const barChart = document.getElementById('stage-bar-chart');
    barChart.innerHTML = '<div class="bar-chart">'+
      labels.map((l,i) =>
        '<div class="bar-col"><div class="bar-value" style="color:'+colors[i]+'">'+(data[i]||0)+'</div><div class="bar-rect" style="height:'+Math.max((data[i]/maxVal)*200,4)+'px;background:'+colors[i]+'"></div><div class="bar-label">'+l+'</div></div>'
      ).join('')+'</div>';

    // 志愿活动
    renderVolunteerTable();
  }

  function renderVolunteerTable() {
    const vols = PartyData.volunteerActivities || [];
    const tbody = document.getElementById('volunteer-table-body');
    if (vols.length===0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state" style="padding:32px"><p>暂无志愿活动记录</p></div></td></tr>';
      return;
    }
    const sorted = [...vols].sort((a,b)=>b.date.localeCompare(a.date));
    tbody.innerHTML = sorted.map(v => {
      const m = getMember(v.memberId);
      return '<tr><td>'+v.name+'</td><td>'+(m?m.name:'-')+'</td><td>'+fmtDate(v.date)+'</td><td><span class="vol-hours">'+v.hours+'小时</span></td><td>'+v.location+'</td><td><button class="btn btn-sm btn-danger" onclick="deleteVolunteer('+v.id+')">删除</button></td></tr>';
    }).join('');
  }

  function openVolunteerModal() {
    const sel = document.getElementById('vol-member');
    sel.innerHTML = PartyData.members.map(m => '<option value="'+m.id+'">'+m.name+'</option>').join('');
    document.getElementById('vol-date').value = '2026-06-07';
    document.getElementById('vol-name').value = '';
    document.getElementById('vol-hours').value = '';
    document.getElementById('vol-location').value = '';
    document.getElementById('vol-desc').value = '';
    show('add-volunteer-modal');
  }

  function saveVolunteer() {
    const memberId = parseInt(document.getElementById('vol-member').value);
    const name = document.getElementById('vol-name').value.trim();
    const date = document.getElementById('vol-date').value;
    const hours = parseFloat(document.getElementById('vol-hours').value);
    const location = document.getElementById('vol-location').value.trim();
    const desc = document.getElementById('vol-desc').value.trim();
    if (!name||!date||!hours||!location) { alert('请填写完整信息'); return; }
    PartyData.volunteerActivities.push({ id: nextVolunteerId++, memberId, name, date, hours, location, description: desc });
    hide('add-volunteer-modal');
    renderVolunteerTable();
    renderPortrait();
  }

  window.deleteVolunteer = function(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    PartyData.volunteerActivities = (PartyData.volunteerActivities||[]).filter(v => v.id !== id);
    renderVolunteerTable();
    renderPortrait();
  };

  // ===== 启动 =====
  document.addEventListener('DOMContentLoaded', init);
})();
