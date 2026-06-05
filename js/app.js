/* ===== 党建信息平台 - 主应用逻辑 ===== */

;(function() {
  'use strict';

  // ===== 当前页面 =====
  let currentPage = 'dashboard';
  let currentMemberId = 1;
  let calendarDate = new Date(2026, 5, 1); // June 2026

  // ===== 工具函数 =====
  function getStageIndex(stage) {
    return PartyData.stages.indexOf(stage);
  }

  function getStageColor(stage) {
    const idx = getStageIndex(stage);
    if (idx < 0) return '';
    return 'stage-' + idx;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';
  }

  // ===== 导航 =====
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        const page = this.dataset.page;
        if (page) navigateTo(page);
      });
    });
  }

  function navigateTo(page) {
    currentPage = page;
    // Update nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (navItem) navItem.classList.add('active');

    // Update page header
    const titles = {
      dashboard: { title: '首页仪表盘', desc: '党组织建设总体情况概览' },
      members: { title: '党员管理', desc: '查看和管理党员个人信息' },
      timeline: { title: '培养历程', desc: '记录党员发展全周期时间线' },
      calendar: { title: '思政日历', desc: '党的重大日子及传统节假日' },
      portrait: { title: '数字画像', desc: '党员队伍发展状况数据分析' }
    };
    const info = titles[page] || titles.dashboard;
    document.getElementById('page-title').textContent = info.title;
    document.getElementById('page-desc').textContent = info.desc;

    // Show/hide pages
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Render
    switch(page) {
      case 'dashboard': renderDashboard(); break;
      case 'members': renderMembers(); break;
      case 'timeline': renderTimeline(); break;
      case 'calendar': renderCalendar(); break;
      case 'portrait': renderPortrait(); break;
    }
  }

  // ===== 首页仪表盘 =====
  function renderDashboard() {
    const members = PartyData.members;
    const stageCounts = {};
    PartyData.stages.forEach(s => stageCounts[s] = 0);
    members.forEach(m => { stageCounts[m.stage] = (stageCounts[m.stage] || 0) + 1; });

    // Stats cards
    document.getElementById('stat-total').textContent = members.length;

    const statsContainer = document.getElementById('stat-details');
    statsContainer.innerHTML = PartyData.stages.map((s, i) => {
      const count = stageCounts[s] || 0;
      const colors = ['#2e7d32','#1565c0','#e65100','#c62828','#6a1b9a'];
      return `
        <div class="stat-card">
          <div class="stat-label">${s}</div>
          <div class="stat-value" style="color:${colors[i]}">${count}</div>
          <div class="stat-sub">占比 ${(count/members.length*100).toFixed(1)}%</div>
        </div>
      `;
    }).join('');

    // Recent members
    const recentList = document.getElementById('recent-members');
    const sorted = [...members].sort((a, b) => {
      const al = a.timeline[a.timeline.length-1].date;
      const bl = b.timeline[b.timeline.length-1].date;
      return bl.localeCompare(al);
    }).slice(0, 5);

    recentList.innerHTML = sorted.map(m => {
      const lastStage = m.timeline[m.timeline.length-1];
      return `
        <tr>
          <td>${m.name}</td>
          <td>${m.department}</td>
          <td><span class="stage-tag ${getStageColor(m.stage)}">${m.stage}</span></td>
          <td>${formatDate(lastStage.date)}</td>
          <td>
            <span class="tag ${m.timeline.length >= 3 ? 'tag-green' : m.timeline.length >= 2 ? 'tag-orange' : 'tag-blue'}">
              ${m.timeline.length}/${PartyData.stages.length}阶段
            </span>
          </td>
        </tr>
      `;
    }).join('');

    // Upcoming calendar events
    const upcomingList = document.getElementById('upcoming-events');
    const now = '2026-06-05';
    const upcoming = PartyData.calendarEvents
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    upcomingList.innerHTML = upcoming.map(e => {
      const typeLabels = { party: '党的纪念', holiday: '法定假日', festival: '传统节日' };
      const typeColors = { party: 'tag-red', holiday: 'tag-green', festival: 'tag-orange' };
      return `
        <tr>
          <td>${formatDate(e.date)}</td>
          <td>${e.name}</td>
          <td><span class="tag ${typeColors[e.type]}">${typeLabels[e.type]}</span></td>
        </tr>
      `;
    }).join('');
  }

  // ===== 党员管理 =====
  function renderMembers() {
    const tbody = document.getElementById('members-list');
    tbody.innerHTML = PartyData.members.map(m => {
      const joinDateDisplay = m.joinDate ? formatDate(m.joinDate) : '进行中';
      return `
        <tr style="cursor:pointer" data-id="${m.id}">
          <td>${m.name}</td>
          <td>${m.gender}</td>
          <td>${m.department}</td>
          <td><span class="stage-tag ${getStageColor(m.stage)}">${m.stage}</span></td>
          <td>${joinDateDisplay}</td>
          <td>${m.phone}</td>
          <td><button class="member-btn" style="font-size:12px;padding:4px 12px">查看详情</button></td>
        </tr>
      `;
    }).join('');

    // Click to show detail modal
    tbody.querySelectorAll('tr').forEach(tr => {
      tr.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        showMemberDetail(id);
      });
    });
  }

  // ===== 党员详情弹窗 =====
  function showMemberDetail(id) {
    const member = PartyData.members.find(m => m.id === id);
    if (!member) return;

    document.getElementById('modal-name').textContent = member.name;
    document.getElementById('modal-gender').textContent = member.gender;
    document.getElementById('modal-birth').textContent = member.birth;
    document.getElementById('modal-dept').textContent = member.department;
    document.getElementById('modal-phone').textContent = member.phone;
    document.getElementById('modal-stage').textContent = member.stage;
    document.getElementById('modal-joindate').textContent = member.joinDate ? formatDate(member.joinDate) : '尚未转为正式党员';

    const timelineHTML = member.timeline.map((t, i) => {
      const isLast = i === member.timeline.length - 1;
      const isCurrent = isLast && member.stage !== '正式党员';
      return `
        <div class="timeline-item ${isLast && member.stage === '正式党员' ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-date">${formatDate(t.date)}</div>
          <div class="timeline-title">${t.stage}</div>
          <div class="timeline-materials">
            ${t.materials.map(m => `<span class="material-tag">${m}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('modal-timeline').innerHTML = timelineHTML;

    document.getElementById('member-modal').classList.add('show');
  }

  // ===== 培养历程 =====
  function renderTimeline() {
    const selector = document.getElementById('member-selector');
    selector.innerHTML = PartyData.members.map(m => `
      <button class="member-btn ${m.id === currentMemberId ? 'active' : ''}" data-id="${m.id}">${m.name}</button>
    `).join('');

    selector.querySelectorAll('.member-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        currentMemberId = parseInt(this.dataset.id);
        renderTimelineView();
        // Update active state
        selector.querySelectorAll('.member-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    renderTimelineView();
  }

  function renderTimelineView() {
    const member = PartyData.members.find(m => m.id === currentMemberId);
    if (!member) return;

    document.getElementById('timeline-member-name').textContent = member.name;
    document.getElementById('timeline-member-dept').textContent = member.department;
    document.getElementById('timeline-member-current').textContent = member.stage;

    const container = document.getElementById('timeline-container');
    container.innerHTML = member.timeline.map((t, i) => {
      const isLast = i === member.timeline.length - 1;
      const isCurrent = isLast && member.stage !== '正式党员';
      return `
        <div class="timeline-item ${isLast && member.stage === '正式党员' ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-date">${formatDate(t.date)}</div>
          <div class="timeline-title">${t.stage}</div>
          <div class="timeline-materials">
            ${t.materials.map(m => `<span class="material-tag">${m}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ===== 思政日历 =====
  function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById('cal-title').textContent = year + '年' + (month+1) + '月';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = document.getElementById('cal-days');
    grid.innerHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const cell = createDayCell(daysInPrevMonth - i, true, year, month - 1);
      grid.appendChild(cell);
    }

    // Current month days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
      const cell = createDayCell(d, false, year, month, isToday);
      grid.appendChild(cell);
    }

    // Next month days to fill grid
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - totalCells % 7) % 7;
    for (let d = 1; d <= remaining; d++) {
      const cell = createDayCell(d, true, year, month + 1);
      grid.appendChild(cell);
    }
  }

  function createDayCell(day, isOther, year, month, isToday) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day' + (isOther ? ' other-month' : '') + (isToday ? ' today' : '');

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = day;
    cell.appendChild(num);

    // Find events
    if (!isOther) {
      const dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
      const events = PartyData.calendarEvents.filter(e => e.date === dateStr);
      events.forEach(e => {
        const ev = document.createElement('div');
        ev.className = 'calendar-event type-' + e.type;
        ev.textContent = e.name;
        cell.appendChild(ev);
      });
    }

    return cell;
  }

  // ===== 数字画像 =====
  function renderPortrait() {
    renderStageDistribution();
    renderMaterialProgress();
    renderStatsSummary();
  }

  function renderStageDistribution() {
    const stageCounts = {};
    PartyData.stages.forEach(s => stageCounts[s] = 0);
    PartyData.members.forEach(m => { stageCounts[m.stage]++; });

    const labels = PartyData.stages;
    const data = labels.map(s => stageCounts[s]);
    const colors = ['#2e7d32','#1565c0','#e65100','#c62828','#6a1b9a'];

    // Simple bar chart using CSS
    const container = document.getElementById('stage-chart');
    const maxVal = Math.max(...data, 1);
    container.innerHTML = `
      <div style="display:flex;align-items:flex-end;gap:12px;height:260px;padding:0 10px">
        ${labels.map((l, i) => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end">
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:${colors[i]}">${data[i]}</div>
            <div style="width:100%;max-width:60px;border-radius:6px 6px 0 0;
                        height:${(data[i]/maxVal)*200}px;background:${colors[i]};
                        transition:height 0.5s;opacity:0.85"></div>
            <div style="font-size:11px;color:#888;margin-top:6px;text-align:center">${l}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderMaterialProgress() {
    const tbody = document.getElementById('material-progress-body');
    const totalStages = PartyData.stages.length;

    tbody.innerHTML = PartyData.members.map(m => {
      const materialsCount = m.timeline.reduce((sum, t) => sum + t.materials.length, 0);
      const maxPossible = m.timeline.length * 3; // rough max estimate
      const progress = Math.min(100, Math.round((materialsCount / Math.max(maxPossible, 1)) * 100));

      return `
        <tr>
          <td>${m.name}</td>
          <td><span class="stage-tag ${getStageColor(m.stage)}">${m.stage}</span></td>
          <td>${m.timeline.length}/${totalStages}</td>
          <td>${materialsCount} 份</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${progress}%"></div>
            </div>
          </td>
          <td style="font-size:13px;color:#666">${progress}%</td>
        </tr>
      `;
    }).join('');
  }

  function renderStatsSummary() {
    const members = PartyData.members;
    const total = members.length;
    const fullMembers = members.filter(m => m.stage === '正式党员').length;
    const inProgress = members.filter(m => m.stage !== '正式党员').length;
    const avgMaterials = (members.reduce((sum, m) =>
      sum + m.timeline.reduce((s, t) => s + t.materials.length, 0), 0) / total).toFixed(1);
    const hasCompleteTimeline = members.filter(m => m.timeline.length >= 5).length;

    const container = document.getElementById('stats-summary');
    container.innerHTML = `
      <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
        <div class="stat-card">
          <div class="stat-label">党员总数</div>
          <div class="stat-value" style="color:#C41E3A">${total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已转正</div>
          <div class="stat-value" style="color:#2e7d32">${fullMembers}</div>
          <div class="stat-sub">占比 ${(fullMembers/total*100).toFixed(1)}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">在途培养</div>
          <div class="stat-value" style="color:#1565c0">${inProgress}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">平均提交材料</div>
          <div class="stat-value" style="color:#e65100;font-size:26px">${avgMaterials}</div>
          <div class="stat-sub">份/人</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">完整经历党员</div>
          <div class="stat-value" style="color:#6a1b9a;font-size:26px">${hasCompleteTimeline}</div>
          <div class="stat-sub">已完成转正全流程</div>
        </div>
      </div>
    `;
  }

  // ===== 弹窗控制 =====
  function initModal() {
    document.getElementById('modal-close').addEventListener('click', () => {
      document.getElementById('member-modal').classList.remove('show');
    });
    document.getElementById('member-modal').addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('show');
    });
  }

  // ===== 日历导航 =====
  function initCalendarNav() {
    document.getElementById('cal-prev').addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });
    document.getElementById('cal-today').addEventListener('click', () => {
      calendarDate = new Date(2026, 5, 1); // June 2026
      renderCalendar();
    });
  }

  // ===== 搜索功能 =====
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      const rows = document.querySelectorAll('#members-list tr');
      rows.forEach(row => {
        const name = row.querySelector('td:first-child');
        const dept = row.querySelector('td:nth-child(3)');
        const match = (name && name.textContent.toLowerCase().includes(q)) ||
                      (dept && dept.textContent.toLowerCase().includes(q));
        row.style.display = match ? '' : 'none';
      });
    });
  }

  // ===== 初始化 =====
  function init() {
    initNavigation();
    initModal();
    initCalendarNav();
    initSearch();
    navigateTo('dashboard');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
