// 党建信息平台 - 模拟数据
const PartyData = {
  members: [
    {
      id: 1, name: '张建国', gender: '男', birth: '1985-03-15',
      department: '党委办公室', phone: '13800001111',
      stage: '正式党员', joinDate: '2020-07-01',
      timeline: [
        { stage: '入党申请人', date: '2017-09-10', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2018-03-20', materials: ['入党积极分子推荐表', '思想汇报(4份)'] },
        { stage: '发展对象', date: '2019-06-15', materials: ['发展对象考核报告', '政审材料', '培训结业证书'] },
        { stage: '预备党员', date: '2019-09-01', materials: ['入党志愿书', '入党誓词记录', '预备党员考察表'] },
        { stage: '正式党员', date: '2020-09-01', materials: ['转正申请书', '转正表决记录'] }
      ]
    },
    {
      id: 2, name: '李明辉', gender: '男', birth: '1990-07-22',
      department: '组织部', phone: '13800002222',
      stage: '预备党员', joinDate: '2025-09-15',
      timeline: [
        { stage: '入党申请人', date: '2022-03-05', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2022-09-18', materials: ['入党积极分子推荐表', '思想汇报(4份)'] },
        { stage: '发展对象', date: '2024-04-10', materials: ['发展对象考核报告', '政审材料', '培训结业证书'] },
        { stage: '预备党员', date: '2025-09-15', materials: ['入党志愿书', '入党誓词记录', '预备党员考察表'] }
      ]
    },
    {
      id: 3, name: '王晓芳', gender: '女', birth: '1992-11-08',
      department: '宣传部', phone: '13800003333',
      stage: '发展对象', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2023-01-12', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2023-07-25', materials: ['入党积极分子推荐表', '思想汇报(3份)'] },
        { stage: '发展对象', date: '2025-12-01', materials: ['发展对象考核报告', '政审材料', '培训结业证书'] }
      ]
    },
    {
      id: 4, name: '赵志强', gender: '男', birth: '1988-05-20',
      department: '纪检部', phone: '13800004444',
      stage: '积极分子', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2024-02-18', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2024-09-03', materials: ['入党积极分子推荐表', '思想汇报(2份)'] }
      ]
    },
    {
      id: 5, name: '陈思远', gender: '女', birth: '1995-09-13',
      department: '办公室', phone: '13800005555',
      stage: '入党申请人', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2025-11-20', materials: ['入党申请书', '个人自传'] }
      ]
    },
    {
      id: 6, name: '刘红梅', gender: '女', birth: '1983-01-25',
      department: '统战部', phone: '13800006666',
      stage: '正式党员', joinDate: '2018-06-30',
      timeline: [
        { stage: '入党申请人', date: '2015-03-10', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2015-10-15', materials: ['入党积极分子推荐表', '思想汇报(5份)'] },
        { stage: '发展对象', date: '2017-04-20', materials: ['发展对象考核报告', '政审材料', '培训结业证书'] },
        { stage: '预备党员', date: '2017-07-01', materials: ['入党志愿书', '入党誓词记录', '预备党员考察表'] },
        { stage: '正式党员', date: '2018-07-01', materials: ['转正申请书', '转正表决记录'] }
      ]
    },
    {
      id: 7, name: '周文斌', gender: '男', birth: '1991-08-17',
      department: '组织部', phone: '13800007777',
      stage: '积极分子', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2024-06-01', materials: ['入党申请书', '个人自传'] },
        { stage: '积极分子', date: '2025-01-10', materials: ['入党积极分子推荐表', '思想汇报(1份)'] }
      ]
    }
  ],

  stages: ['入党申请人', '积极分子', '发展对象', '预备党员', '正式党员'],

  calendarEvents: [
    { date: '2026-01-01', name: '元旦', type: 'holiday' },
    { date: '2026-02-17', name: '春节', type: 'festival' },
    { date: '2026-03-05', name: '学雷锋纪念日', type: 'party' },
    { date: '2026-03-08', name: '国际妇女节', type: 'holiday' },
    { date: '2026-03-12', name: '植树节', type: 'party' },
    { date: '2026-04-05', name: '清明节', type: 'festival' },
    { date: '2026-05-01', name: '劳动节', type: 'holiday' },
    { date: '2026-05-04', name: '青年节', type: 'party' },
    { date: '2026-06-01', name: '国际儿童节', type: 'holiday' },
    { date: '2026-06-19', name: '端午节', type: 'festival' },
    { date: '2026-07-01', name: '建党节', type: 'party' },
    { date: '2026-08-01', name: '建军节', type: 'party' },
    { date: '2026-09-10', name: '教师节', type: 'holiday' },
    { date: '2026-10-01', name: '国庆节', type: 'holiday' },
    { date: '2026-10-06', name: '中秋节', type: 'festival' },
    { date: '2026-12-04', name: '国家宪法日', type: 'party' },
    { date: '2026-12-22', name: '冬至', type: 'festival' }
  ]
};
