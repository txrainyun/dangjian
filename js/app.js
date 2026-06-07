/* ===== 党建信息平台 v2.1 - 主应用逻辑 ===== */
;(function() {
  'use strict';

  let currentPage = 'dashboard';
  let currentMemberId = 1;
  let calendarDate = new Date(2026, 5, 1);
  let nextVolunteerId = 20;
  let nextCustomEventId = 1;

  function getStageIndex(s) { return PartyData.stages.indexOf(s); }
  function stageColor(s) { var i = getStageIndex(s); return i < 0 ? '' : 'stage-' + i; }
  function stageColors() { return ['#2e7d32','#1565c0','#e65100','#c62828','#6a1b9a']; }
  function fmtDate(d) { if (!d) return '-'; var t = new Date(d); return t.getFullYear()+'年'+(t.getMonth()+1)+'月'+t.getDate()+'日'; }
  function pad2(n) { return String(n).padStart(2,'0'); }
  function getMember(id) { return PartyData.members.find(function(m){return m.id===id;}); }

  function show(id) { document.getElementById(id).classList.add('show'); }
  function hide(id) { document.getElementById(id).classList.remove('show'); }

  function getAllEvents() {
    return (PartyData.calendarEvents||[]).concat(PartyData.customEvents||[]);
  }

  // ===== 导航 =====
  function init() {
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.addEventListener('click', function() { if (this.dataset.page) navigateTo(this.dataset.page); });
    });
    document.getElementById('modal-close').addEventListener('click', function(){hide('member-modal');});
    document.getElementById('member-modal').addEventListener('click', function(e) { if (e.target===this) hide('member-modal'); });
    document.getElementById('material-modal-close').addEventListener('click', function(){hide('material-modal');});
    document.getElementById('material-modal').addEventListener('click', function(e) { if (e.target===this) hide('material-modal'); });
    document.getElementById('cal-prev').addEventListener('click', function(){calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();});
    document.getElementById('cal-next').addEventListener('click', function(){calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();});
    document.getElementById('cal-today').addEventListener('click', function(){calendarDate=new Date(2026,5,1);renderCalendar();});
    document.getElementById('add-event-btn').addEventListener('click', function(){show('add-event-modal');});
    document.getElementById('event-close').addEventListener('click', function(){hide('add-event-modal');});
    document.getElementById('add-event-modal').addEventListener('click', function(e){if(e.target===this)hide('add-event-modal');});
    document.getElementById('save-event-btn').addEventListener('click', saveCustomEvent);
    document.getElementById('add-volunteer-btn').addEventListener('click', openVolunteerModal);
    document.getElementById('vol-close').addEventListener('click', function(){hide('add-volunteer-modal');});
    document.getElementById('add-volunteer-modal').addEventListener('click', function(e){if(e.target===this)hide('add-volunteer-modal');});
    document.getElementById('save-volunteer-btn').addEventListener('click', saveVolunteer);
    document.getElementById('search-input').addEventListener('input', doSearch);
    navigateTo('dashboard');
  }

  function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(function(el){el.classList.remove('active');});
    var navItem = document.querySelector('.nav-item[data-page="'+page+'"]');
    if (navItem) navItem.classList.add('active');
    var titles = {dashboard:['首页仪表盘','党组织建设总体情况概览'], members:['党员管理','查看和管理党员个人信息'], timeline:['培养历程','记录党员发展全周期时间线'], calendar:['思政日历','党的重大日子、会议及节假日'], portrait:['数字画像','党员队伍发展状况数据分析']};
    var t = titles[page] || titles.dashboard;
    document.getElementById('page-title').textContent = t[0];
    document.getElementById('page-desc').textContent = t[1];
    document.querySelectorAll('.page').forEach(function(el){el.classList.remove('active');});
    var p = document.getElementById('page-'+page);
    if (p) p.classList.add('active');
    if (page==='dashboard') renderDashboard();
    else if (page==='members') renderMembers();
    else if (page==='timeline') renderTimeline();
    else if (page==='calendar') renderCalendar();
    else if (page==='portrait') renderPortrait();
  }

  // ===== SVG 环形图 (可靠渲染) =====
  function renderDonut(containerId, data, labels, colors, opts) {
    opts = opts || {};
    var size = opts.size || 200;
    var strokeW = size * 0.18;
    var radius = (size - strokeW) / 2;
    var circ = 2 * Math.PI * radius;
    var total = data.reduce(function(a,b){return a+b;},0) || 1;
    var offset = 0;
    var segs = '';
    var cx = size/2, cy = size/2;

    data.forEach(function(v, i) {
      if (v === 0) return;
      var len = circ * v / total;
      segs += '<circle cx="'+cx+'" cy="'+cy+'" r="'+radius+'" fill="none" stroke="'+colors[i]+'" stroke-width="'+strokeW+'" stroke-dasharray="'+len+' '+(circ-len)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 '+cx+' '+cy+')"/>';
      offset += len;
    });

    var container = document.getElementById(containerId);
    container.style.position = 'relative';
    container.style.width = size+'px';
    container.style.height = size+'px';
    container.style.display = 'inline-block';
    container.innerHTML = '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'">'+segs+'</svg><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none"><div style="font-size:'+(size*0.14)+'px;font-weight:700;color:#C41E3A">'+total+'</div><div style="font-size:'+(size*0.055)+'px;color:#999">党员总数</div></div>';
  }

  // ===== 仪表盘 =====
  function renderDashboard() {
    var members = PartyData.members;
    document.getElementById('stat-total').textContent = members.length;

    var sc = {}; PartyData.stages.forEach(function(s){sc[s]=0;});
    members.forEach(function(m){sc[m.stage]++;});
    var colors = stageColors();
    document.getElementById('stat-details').innerHTML = PartyData.stages.map(function(s,i){
      return '<div class="stat-card"><div class="stat-label">'+s+'</div><div class="stat-value" style="color:'+colors[i]+'">'+(sc[s]||0)+'</div><div class="stat-sub">占比 '+((sc[s]/members.length*100)||0).toFixed(1)+'%</div></div>';
    }).join('');

    var labels = PartyData.stages;
    var data = labels.map(function(l){return sc[l]||0;});
    renderDonut('dash-stage-ring', data, labels, colors, {size:140});
    var total = data.reduce(function(a,b){return a+b;},0)||1;
    document.getElementById('dash-stage-legend').innerHTML = labels.map(function(l,i){
      return '<div class="legend-row"><span class="legend-dot-sm" style="background:'+colors[i]+'"></span><span class="name">'+l+'</span><span class="val">'+(data[i]||0)+'</span><span class="pct">'+(data[i]/total*100).toFixed(1)+'%</span></div>';
    }).join('');

    var sorted = members.slice().sort(function(a,b){
      return (b.timeline[b.timeline.length-1].date||'').localeCompare(a.timeline[a.timeline.length-1].date||'');
    }).slice(0,5);
    document.getElementById('recent-members').innerHTML = sorted.map(function(m){
      var last = m.timeline[m.timeline.length-1];
      return '<tr><td>'+m.name+'</td><td>'+m.department+'</td><td><span class="stage-tag '+stageColor(m.stage)+'">'+m.stage+'</span></td><td>'+fmtDate(last.date)+'</td><td><span class="tag '+(m.timeline.length>=3?'tag-green':m.timeline.length>=2?'tag-orange':'tag-blue')+'">'+m.timeline.length+'/'+PartyData.stages.length+'阶段</span></td></tr>';
    }).join('');

    var now = '2026-06-07';
    var upcoming = getAllEvents().filter(function(e){return e.date>=now;}).sort(function(a,b){return a.date.localeCompare(b.date);}).slice(0,6);
    var typeLabels = {party:'党的纪念',holiday:'法定假日',festival:'传统节日',meeting:'党的会议',custom:'自定义'};
    var typeColors = {party:'tag-red',holiday:'tag-green',festival:'tag-orange',meeting:'tag-purple',custom:'tag-blue'};
    var typeDots = {party:'party',holiday:'holiday',festival:'festival',meeting:'meeting',custom:'holiday'};
    document.getElementById('dash-upcoming-list').innerHTML = upcoming.map(function(e){
      return '<li><span class="event-mini-dot '+typeDots[e.type]+'"></span><span style="color:#888;font-size:12px">'+e.date.slice(5)+'</span><span style="flex:1">'+e.name+'</span><span class="tag '+typeColors[e.type]+'">'+(typeLabels[e.type]||e.type)+'</span></li>';
    }).join('');
  }

  // ===== 党员管理 =====
  function renderMembers() {
    var tbody = document.getElementById('members-list');
    tbody.innerHTML = PartyData.members.map(function(m){
      return '<tr style="cursor:pointer" data-id="'+m.id+'"><td>'+m.name+'</td><td>'+m.gender+'</td><td>'+m.department+'</td><td><span class="stage-tag '+stageColor(m.stage)+'">'+m.stage+'</span></td><td>'+(m.joinDate?fmtDate(m.joinDate):'进行中')+'</td><td>'+m.phone+'</td><td><button class="member-btn" style="font-size:12px;padding:4px 12px">查看详情</button></td></tr>';
    }).join('');
    tbody.querySelectorAll('tr').forEach(function(el){el.addEventListener('click',function(){showMemberDetail(parseInt(this.dataset.id));});});
  }

  function doSearch() {
    var q = this.value.trim().toLowerCase();
    document.querySelectorAll('#members-list tr').forEach(function(row){
      var cells = row.querySelectorAll('td');
      var match = q==='' || (cells[0]&&cells[0].textContent.toLowerCase().includes(q)) || (cells[2]&&cells[2].textContent.toLowerCase().includes(q));
      row.style.display = match ? '' : 'none';
    });
  }

  // ===== 党员详情 =====
  function showMemberDetail(id) {
    var m = getMember(id);
    if (!m) return;
    document.getElementById('modal-name').textContent = m.name;
    document.getElementById('modal-gender').textContent = m.gender;
    document.getElementById('modal-birth').textContent = m.birth;
    document.getElementById('modal-dept').textContent = m.department;
    document.getElementById('modal-phone').textContent = m.phone;
    document.getElementById('modal-stage').textContent = m.stage;
    document.getElementById('modal-joindate').textContent = m.joinDate ? fmtDate(m.joinDate) : '尚未转为正式党员';

    var typeLabels = {document:['文档','#1565c0','#e3f2fd'],form:['表格','#2e7d32','#e8f5e9'],report:['汇报','#e65100','#fff3e0'],certificate:['证书','#6a1b9a','#f3e5f5']};
    document.getElementById('modal-timeline').innerHTML = m.timeline.map(function(t,i){
      var isLast = i===m.timeline.length-1;
      var isCur = isLast && m.stage!=='正式党员';
      return '<div class="timeline-item '+(isLast&&m.stage==='正式党员'?'completed':'')+' '+(isCur?'current':'')+'"><div class="timeline-dot"></div><div class="timeline-date">'+fmtDate(t.date)+'</div><div class="timeline-title">'+t.stage+'</div><div class="timeline-materials"><div class="material-list">'+
        t.materials.map(function(mat){
          var tl = typeLabels[mat.type]||['文件','#555','#f5f5f5'];
          return '<span class="material-chip type-'+mat.type+'" data-member="'+m.id+'" data-stage="'+t.stage+'" data-material="'+mat.name+'" style="background:'+tl[2]+';border-color:'+tl[1]+';color:'+tl[1]+'"><span class="mat-type-tag" style="background:'+tl[1]+';color:#fff;padding:0 4px;border-radius:3px;font-size:10px;margin-right:4px;font-weight:600">'+tl[0]+'</span>'+mat.name+'</span>';
        }).join('')+'</div></div></div>';
    }).join('');

    var vols = (PartyData.volunteerActivities||[]).filter(function(v){return v.memberId===m.id;});
    var volContainer = document.getElementById('modal-volunteers');
    if (vols.length===0) {
      volContainer.innerHTML = '<div class="empty-state" style="padding:20px"><p style="font-size:13px">暂无志愿活动记录</p></div>';
    } else {
      volContainer.innerHTML = '<table><thead><tr><th>活动名称</th><th>日期</th><th>时长</th><th>地点</th></tr></thead><tbody>'+
        vols.map(function(v){return '<tr><td>'+v.name+'</td><td>'+fmtDate(v.date)+'</td><td><span class="vol-hours">'+v.hours+'小时</span></td><td>'+v.location+'</td></tr>';}).join('')+'</tbody></table>';
    }

    document.querySelectorAll('#modal-timeline .material-chip').forEach(function(el){
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var mid = parseInt(this.dataset.member);
        var stageName = this.dataset.stage;
        var matName = this.dataset.material;
        var member = getMember(mid);
        if (!member) return;
        var stageObj = member.timeline.find(function(t){return t.stage===stageName;});
        if (!stageObj) return;
        var mat = stageObj.materials.find(function(mt){return mt.name===matName;});
        if (mat) showMaterialContent(matName, mat.content, mat.type);
      });
    });

    show('member-modal');
  }

  function showMaterialContent(name, content, type) {
    var typeLabels = {document:'文档',form:'表格',report:'思想汇报',certificate:'证书'};
    document.getElementById('material-modal-title').innerHTML = name + '<span class="tag tag-blue" style="margin-left:8px;font-size:11px;vertical-align:middle">'+(typeLabels[type]||type)+'</span>';
    document.getElementById('material-modal-content').textContent = content;
    show('material-modal');
  }

  // ===== 培养历程 =====
  function renderTimeline() {
    var sel = document.getElementById('member-selector');
    sel.innerHTML = PartyData.members.map(function(m){
      return '<button class="member-btn '+(m.id===currentMemberId?'active':'')+'" data-id="'+m.id+'">'+m.name+'</button>';
    }).join('');
    sel.querySelectorAll('.member-btn').forEach(function(btn){
      btn.addEventListener('click', function() {
        currentMemberId = parseInt(this.dataset.id);
        sel.querySelectorAll('.member-btn').forEach(function(b){b.classList.remove('active');});
        this.classList.add('active');
        renderTimelineView();
      });
    });
    renderTimelineView();
  }

  function renderTimelineView() {
    var m = getMember(currentMemberId);
    if (!m) return;
    document.getElementById('timeline-member-name').textContent = m.name;
    document.getElementById('timeline-member-dept').textContent = m.department;
    var sc = document.getElementById('timeline-member-current');
    sc.textContent = m.stage;
    sc.className = 'stage-tag '+stageColor(m.stage);

    var typeLabels = {document:['文档','#1565c0','#e3f2fd'],form:['表格','#2e7d32','#e8f5e9'],report:['汇报','#e65100','#fff3e0'],certificate:['证书','#6a1b9a','#f3e5f5']};
    document.getElementById('timeline-container').innerHTML = m.timeline.map(function(t,i){
      var isLast = i===m.timeline.length-1;
      var isCur = isLast && m.stage!=='正式党员';
      return '<div class="timeline-item '+(isLast&&m.stage==='正式党员'?'completed':'')+' '+(isCur?'current':'')+'"><div class="timeline-dot"></div><div class="timeline-date">'+fmtDate(t.date)+'</div><div class="timeline-title">'+t.stage+'</div><div class="timeline-materials"><div class="material-list">'+
        t.materials.map(function(mat){
          var tl = typeLabels[mat.type]||['文件','#555','#f5f5f5'];
          return '<span class="material-chip type-'+mat.type+'" style="background:'+tl[2]+';border-color:'+tl[1]+';color:'+tl[1]+'"><span class="mat-type-tag" style="background:'+tl[1]+';color:#fff;padding:0 4px;border-radius:3px;font-size:10px;margin-right:4px;font-weight:600">'+tl[0]+'</span>'+mat.name+'</span>';
        }).join('')+'</div></div></div>';
    }).join('');
  }

  // ===== 思政日历 =====
  function renderCalendar() {
    var y = calendarDate.getFullYear(), m = calendarDate.getMonth();
    document.getElementById('cal-title').textContent = y+'年'+(m+1)+'月';
    var first = new Date(y,m,1).getDay();
    var dim = new Date(y,m+1,0).getDate();
    var dimPrev = new Date(y,m,0).getDate();
    var grid = document.getElementById('cal-days');
    grid.innerHTML = '';

    var eventMap = {};
    getAllEvents().forEach(function(e){
      var parts = e.date.split('-');
      var key = parts[0]+'-'+parts[1]+'-'+parts[2];
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(e);
    });

    var today = new Date();

    function addCell(dayNum, isOther, isToday) {
      var cell = document.createElement('div');
      cell.className = 'calendar-day'+(isOther?' other-month':'')+(isToday?' today':'');
      var num = document.createElement('div');
      num.className = 'day-number';
      num.textContent = dayNum;
      cell.appendChild(num);
      if (!isOther) {
        var dateStr = y+'-'+pad2(m+1)+'-'+pad2(dayNum);
        var events = eventMap[dateStr] || [];
        events.forEach(function(e){
          var ev = document.createElement('div');
          ev.className = 'calendar-event type-'+(e.type==='custom'?'custom':e.type);
          ev.textContent = e.name;
          cell.appendChild(ev);
        });
      }
      grid.appendChild(cell);
    }

    for (var i=first-1; i>=0; i--) { addCell(dimPrev-i, true, false); }
    for (var d=1; d<=dim; d++) { addCell(d, false, y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate()); }
    var rem = (7 - (first+dim)%7) % 7;
    for (var d=1; d<=rem; d++) { addCell(d, true, false); }
  }

  // ===== 自定义日程 =====
  function saveCustomEvent() {
    var date = document.getElementById('event-date').value;
    var name = document.getElementById('event-name').value.trim();
    var type = document.getElementById('event-type').value;
    if (!date || !name) { alert('请填写完整的日程信息'); return; }
    if (!PartyData.customEvents) PartyData.customEvents = [];
    PartyData.customEvents.push({ date: date, name: name, type: type||'custom' });
    hide('add-event-modal');
    document.getElementById('event-date').value = '';
    document.getElementById('event-name').value = '';
    renderCalendar();
    if (currentPage==='dashboard') renderDashboard();
  }

  // ===== 数字画像 =====
  function renderPortrait() {
    var members = PartyData.members;
    var total = members.length;
    var sc = {}; PartyData.stages.forEach(function(s){sc[s]=0;});
    members.forEach(function(m){sc[m.stage]++;});
    var colors = stageColors();

    var fullM = members.filter(function(m){return m.stage==='正式党员';}).length;
    var inProg = members.filter(function(m){return m.stage!=='正式党员';}).length;
    var avgMat = (members.reduce(function(s,m){return s+m.timeline.reduce(function(a,t){return a+t.materials.length;},0);},0)/total).toFixed(1);
    var fullCycle = members.filter(function(m){return m.timeline.length>=5;}).length;
    var totalVolHours = (PartyData.volunteerActivities||[]).reduce(function(s,v){return s+v.hours;},0);

    document.getElementById('stats-summary').innerHTML =
      '<div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">'+
        '<div class="stat-card"><div class="stat-label">党员总数</div><div class="stat-value" style="color:#C41E3A">'+total+'</div></div>'+
        '<div class="stat-card"><div class="stat-label">已转正</div><div class="stat-value" style="color:#2e7d32">'+fullM+'</div><div class="stat-sub">占比 '+(fullM/total*100).toFixed(1)+'%</div></div>'+
        '<div class="stat-card"><div class="stat-label">在途培养</div><div class="stat-value" style="color:#1565c0">'+inProg+'</div></div>'+
        '<div class="stat-card"><div class="stat-label">平均提交材料</div><div class="stat-value" style="color:#e65100;font-size:26px">'+avgMat+'</div><div class="stat-sub">份/人</div></div>'+
        '<div class="stat-card"><div class="stat-label">完整经历党员</div><div class="stat-value" style="color:#6a1b9a;font-size:26px">'+fullCycle+'</div><div class="stat-sub">已完成转正全流程</div></div>'+
        '<div class="stat-card"><div class="stat-label">志愿总时长</div><div class="stat-value" style="color:#00838f;font-size:26px">'+totalVolHours+'</div><div class="stat-sub">小时</div></div>'+
      '</div>';

    var labels = PartyData.stages;
    var data = labels.map(function(l){return sc[l]||0;});
    renderDonut('stage-donut-container', data, labels, colors, {size:220});
    var ttl = data.reduce(function(a,b){return a+b;},0)||1;
    document.getElementById('stage-donut-legend').innerHTML = labels.map(function(l,i){
      return '<div class="legend-row"><span class="legend-dot-sm" style="background:'+colors[i]+'"></span><span class="name">'+l+'</span><span class="val">'+(data[i]||0)+'人</span><span class="pct">'+(data[i]/ttl*100).toFixed(1)+'%</span></div>';
    }).join('');

    var maxVal = Math.max.apply(null, data) || 1;
    document.getElementById('stage-bar-chart').innerHTML = '<div class="bar-chart">'+
      labels.map(function(l,i){
        return '<div class="bar-col"><div class="bar-value" style="color:'+colors[i]+'">'+(data[i]||0)+'</div><div class="bar-rect" style="height:'+Math.max((data[i]/maxVal)*200,4)+'px;background:'+colors[i]+'"></div><div class="bar-label">'+l+'</div></div>';
      }).join('')+'</div>';

    renderVolunteerTable();
  }

  function renderVolunteerTable() {
    var vols = PartyData.volunteerActivities || [];
    var tbody = document.getElementById('volunteer-table-body');
    if (vols.length===0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state" style="padding:32px"><p>暂无志愿活动记录</p></div></td></tr>';
      return;
    }
    var sorted = vols.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
    tbody.innerHTML = sorted.map(function(v){
      var m = getMember(v.memberId);
      return '<tr><td>'+v.name+'</td><td>'+(m?m.name:'-')+'</td><td>'+fmtDate(v.date)+'</td><td><span class="vol-hours">'+v.hours+'小时</span></td><td>'+v.location+'</td><td><button class="btn btn-sm btn-danger" onclick="deleteVolunteer('+v.id+')">删除</button></td></tr>';
    }).join('');
  }

  function openVolunteerModal() {
    var sel = document.getElementById('vol-member');
    sel.innerHTML = PartyData.members.map(function(m){return '<option value="'+m.id+'">'+m.name+'</option>';}).join('');
    document.getElementById('vol-date').value = '2026-06-07';
    document.getElementById('vol-name').value = '';
    document.getElementById('vol-hours').value = '';
    document.getElementById('vol-location').value = '';
    document.getElementById('vol-desc').value = '';
    show('add-volunteer-modal');
  }

  function saveVolunteer() {
    var memberId = parseInt(document.getElementById('vol-member').value);
    var name = document.getElementById('vol-name').value.trim();
    var date = document.getElementById('vol-date').value;
    var hours = parseFloat(document.getElementById('vol-hours').value);
    var location = document.getElementById('vol-location').value.trim();
    var desc = document.getElementById('vol-desc').value.trim();
    if (!name||!date||!hours||!location) { alert('请填写完整信息'); return; }
    PartyData.volunteerActivities.push({ id: nextVolunteerId++, memberId: memberId, name: name, date: date, hours: hours, location: location, description: desc });
    hide('add-volunteer-modal');
    renderVolunteerTable();
    renderPortrait();
  }

  window.deleteVolunteer = function(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    PartyData.volunteerActivities = (PartyData.volunteerActivities||[]).filter(function(v){return v.id!==id;});
    renderVolunteerTable();
    renderPortrait();
  };

  document.addEventListener('DOMContentLoaded', init);
})();