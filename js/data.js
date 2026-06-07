// 党建信息平台 - 升级版模拟数据
const PartyData = {
  stages: ['入党申请人', '积极分子', '发展对象', '预备党员', '正式党员'],

  members: [
    {
      id: 1, name: '张建国', gender: '男', birth: '1985-03-15',
      department: '党委办公室', phone: '13800001111',
      stage: '正式党员', joinDate: '2020-07-01',
      timeline: [
        { stage: '入党申请人', date: '2017-09-10', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党，拥护党的纲领，遵守党的章程，履行党员义务，执行党的决定，严守党的纪律，保守党的秘密，对党忠诚，积极工作，为共产主义奋斗终身，随时准备为党和人民牺牲一切，永不叛党。\n\n中国共产党是中国工人阶级的先锋队，同时是中国人民和中华民族的先锋队，是中国特色社会主义事业的领导核心，代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益。党的最高理想和最终目标是实现共产主义。\n\n我深知，按照党的要求，自己还有一定差距，但我有决心在党组织的培养帮助下，认真学习，努力工作，不断提高，以实际行动争取早日成为一名合格的共产党员。\n\n此致\n敬礼\n\n申请人：张建国\n2017年9月10日' },
          { name: '个人自传', type: 'document', content: '我叫张建国，1985年3月15日出生于山东省济南市一个普通工人家庭。2003年考入山东大学政治学与行政学专业，2007年毕业后进入市委办公室工作至今。\n\n在家庭和学校教育的熏陶下，我从小就对中国共产党有着深厚的感情。工作以来，在领导和同事们的帮助下，我不断提高政治觉悟和业务能力，于2017年正式向党组织递交入党申请书。' }
        ]},
        { stage: '积极分子', date: '2018-03-20', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '经支部委员会研究，同意推荐张建国同志为入党积极分子。该同志政治立场坚定，工作表现突出，群众基础良好。' },
          { name: '思想汇报（第1期）', type: 'report', content: '本期思想汇报主要围绕学习党的十九大精神的心得体会...' },
          { name: '思想汇报（第2期）', type: 'report', content: '重点汇报对习近平新时代中国特色社会主义思想的学习认识...' },
          { name: '思想汇报（第3期）', type: 'report', content: '结合本职工作，谈如何贯彻落实党的群众路线...' },
          { name: '思想汇报（第4期）', type: 'report', content: '对照党员标准，查找自身差距和不足...' }
        ]},
        { stage: '发展对象', date: '2019-06-15', materials: [
          { name: '发展对象考核报告', type: 'form', content: '经组织考察，张建国同志在积极分子期间表现优秀，政治理论水平明显提升，工作业绩突出，同意列为发展对象。' },
          { name: '政审材料', type: 'document', content: '经政治审查，张建国同志历史清白，政治立场坚定，无任何政治历史问题。家庭成员及主要社会关系政治历史清楚。' },
          { name: '培训结业证书', type: 'certificate', content: '张建国同志于2019年5月参加入党发展对象培训班，学习期满，成绩合格，准予结业。' }
        ]},
        { stage: '预备党员', date: '2019-09-01', materials: [
          { name: '入党志愿书', type: 'form', content: '我志愿加入中国共产党...（入党志愿书全文）' },
          { name: '入党誓词记录', type: 'document', content: '我志愿加入中国共产党，拥护党的纲领，遵守党的章程，履行党员义务，执行党的决定，严守党的纪律，保守党的秘密，对党忠诚，积极工作，为共产主义奋斗终身，随时准备为党和人民牺牲一切，永不叛党。\n\n宣誓人：张建国\n2019年9月1日' },
          { name: '预备党员考察表', type: 'form', content: '预备期考察记录：该同志在预备期内能够认真学习党的理论知识，积极参加组织生活，按时缴纳党费，工作表现突出。' }
        ]},
        { stage: '正式党员', date: '2020-09-01', materials: [
          { name: '转正申请书', type: 'document', content: '尊敬的党组织：\n\n2019年9月1日，经党支部大会讨论通过，上级党委批准，我成为一名光荣的中国共产党预备党员。至今预备期已满一年，我郑重向党组织提出转正申请...' },
          { name: '转正表决记录', type: 'form', content: '经支部大会讨论，应到会有表决权党员15人，实到13人。经无记名投票表决，13票赞成，0票反对，0票弃权，同意张建国同志按期转为中共正式党员。' }
        ]}
      ]
    },
    {
      id: 2, name: '李明辉', gender: '男', birth: '1990-07-22',
      department: '组织部', phone: '13800002222',
      stage: '预备党员', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2022-03-05', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党，愿意为共产主义事业奋斗终身...' },
          { name: '个人自传', type: 'document', content: '我叫李明辉，1990年7月22日出生于江苏省南京市...' }
        ]},
        { stage: '积极分子', date: '2022-09-18', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '同意推荐李明辉同志为入党积极分子。' },
          { name: '思想汇报（第1期）', type: 'report', content: '学习党的二十大报告心得体会...' },
          { name: '思想汇报（第2期）', type: 'report', content: '对"两个确立"决定性意义的认识...' },
          { name: '思想汇报（第3期）', type: 'report', content: '如何在工作中践行党员的初心使命...' },
          { name: '思想汇报（第4期）', type: 'report', content: '对照党章查找差距...' }
        ]},
        { stage: '发展对象', date: '2024-04-10', materials: [
          { name: '发展对象考核报告', type: 'form', content: '李明辉同志在培养期间表现良好，同意列为发展对象。' },
          { name: '政审材料', type: 'document', content: '经审查，该同志政治历史清白，无问题。' },
          { name: '培训结业证书', type: 'certificate', content: '发展对象培训合格，准予结业。' }
        ]},
        { stage: '预备党员', date: '2025-09-15', materials: [
          { name: '入党志愿书', type: 'form', content: '我志愿加入中国共产党...' },
          { name: '入党誓词记录', type: 'document', content: '宣誓人：李明辉\n2025年9月15日' },
          { name: '预备党员考察表', type: 'form', content: '预备期考察中...' }
        ]}
      ]
    },
    {
      id: 3, name: '王晓芳', gender: '女', birth: '1992-11-08',
      department: '宣传部', phone: '13800003333',
      stage: '发展对象', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2023-01-12', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党...' },
          { name: '个人自传', type: 'document', content: '我叫王晓芳，1992年11月8日出生于浙江省杭州市...' }
        ]},
        { stage: '积极分子', date: '2023-07-25', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '同意推荐。' },
          { name: '思想汇报（第1期）', type: 'report', content: '学习习近平新时代中国特色社会主义思想心得...' },
          { name: '思想汇报（第2期）', type: 'report', content: '宣传工作如何体现党性原则...' },
          { name: '思想汇报（第3期）', type: 'report', content: '联系群众工作的思考...' }
        ]},
        { stage: '发展对象', date: '2025-12-01', materials: [
          { name: '发展对象考核报告', type: 'form', content: '同意列为发展对象。' },
          { name: '政审材料', type: 'document', content: '政治审查合格。' },
          { name: '培训结业证书', type: 'certificate', content: '培训合格。' }
        ]}
      ]
    },
    {
      id: 4, name: '赵志强', gender: '男', birth: '1988-05-20',
      department: '纪检部', phone: '13800004444',
      stage: '积极分子', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2024-02-18', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党...' },
          { name: '个人自传', type: 'document', content: '我叫赵志强，1988年5月20日出生于广东省广州市...' }
        ]},
        { stage: '积极分子', date: '2024-09-03', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '同意推荐。' },
          { name: '思想汇报（第1期）', type: 'report', content: '学习党纪处分条例心得体会...' },
          { name: '思想汇报（第2期）', type: 'report', content: '如何在纪检岗位上践行忠诚干净担当...' }
        ]}
      ]
    },
    {
      id: 5, name: '陈思远', gender: '女', birth: '1995-09-13',
      department: '办公室', phone: '13800005555',
      stage: '入党申请人', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2025-11-20', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党，拥护党的纲领...' },
          { name: '个人自传', type: 'document', content: '我叫陈思远，1995年9月13日出生于福建省福州市...' }
        ]}
      ]
    },
    {
      id: 6, name: '刘红梅', gender: '女', birth: '1983-01-25',
      department: '统战部', phone: '13800006666',
      stage: '正式党员', joinDate: '2018-06-30',
      timeline: [
        { stage: '入党申请人', date: '2015-03-10', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党...' },
          { name: '个人自传', type: 'document', content: '我叫刘红梅，1983年1月25日出生于湖南省长沙市...' }
        ]},
        { stage: '积极分子', date: '2015-10-15', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '同意推荐。' },
          { name: '思想汇报（第1期）', type: 'report', content: '...' },
          { name: '思想汇报（第2期）', type: 'report', content: '...' },
          { name: '思想汇报（第3期）', type: 'report', content: '...' },
          { name: '思想汇报（第4期）', type: 'report', content: '...' },
          { name: '思想汇报（第5期）', type: 'report', content: '...' }
        ]},
        { stage: '发展对象', date: '2017-04-20', materials: [
          { name: '发展对象考核报告', type: 'form', content: '同意列为发展对象。' },
          { name: '政审材料', type: 'document', content: '政治审查合格。' },
          { name: '培训结业证书', type: 'certificate', content: '培训合格。' }
        ]},
        { stage: '预备党员', date: '2017-07-01', materials: [
          { name: '入党志愿书', type: 'form', content: '...' },
          { name: '入党誓词记录', type: 'document', content: '...' },
          { name: '预备党员考察表', type: 'form', content: '...' }
        ]},
        { stage: '正式党员', date: '2018-07-01', materials: [
          { name: '转正申请书', type: 'document', content: '...' },
          { name: '转正表决记录', type: 'form', content: '...' }
        ]}
      ]
    },
    {
      id: 7, name: '周文斌', gender: '男', birth: '1991-08-17',
      department: '组织部', phone: '13800007777',
      stage: '积极分子', joinDate: '',
      timeline: [
        { stage: '入党申请人', date: '2024-06-01', materials: [
          { name: '入党申请书', type: 'document', content: '尊敬的党组织：\n\n我志愿加入中国共产党...' },
          { name: '个人自传', type: 'document', content: '我叫周文斌，1991年8月17日出生于湖北省武汉市...' }
        ]},
        { stage: '积极分子', date: '2025-01-10', materials: [
          { name: '入党积极分子推荐表', type: 'form', content: '同意推荐。' },
          { name: '思想汇报（第1期）', type: 'report', content: '学习党的基本理论知识心得体会...' }
        ]}
      ]
    }
  ],

  // 志愿活动记录
  volunteerActivities: [
    { id: 1, memberId: 1, name: '社区防疫志愿服务', date: '2025-03-15', hours: 8, location: '阳光社区', description: '协助开展核酸检测、物资配送、秩序维护等工作' },
    { id: 2, memberId: 1, name: '文明城市创建活动', date: '2025-06-20', hours: 4, location: '人民路街道', description: '参与街道环境整治、文明劝导' },
    { id: 3, memberId: 1, name: '走访慰问老党员', date: '2026-01-20', hours: 3, location: '幸福家园小区', description: '春节前走访慰问退休老党员' },
    { id: 4, memberId: 2, name: '社区清扫志愿活动', date: '2025-08-10', hours: 3, location: '花园社区', description: '参与社区环境卫生大扫除' },
    { id: 5, memberId: 2, name: '防汛抗洪志愿服务', date: '2025-07-05', hours: 12, location: '长江堤防段', description: '参与堤防巡查、物资搬运' },
    { id: 6, memberId: 3, name: '理论宣讲志愿服务', date: '2026-03-10', hours: 2, location: '文化宫', description: '面向社区居民宣讲党的二十大精神' },
    { id: 7, memberId: 3, name: '敬老院慰问活动', date: '2026-04-15', hours: 4, location: '夕阳红敬老院', description: '为老人送去慰问品，表演文艺节目' },
    { id: 8, memberId: 4, name: '社区平安巡逻', date: '2026-02-08', hours: 2, location: '平安社区', description: '参与春节前社区平安巡逻' },
    { id: 9, memberId: 6, name: '社区普法宣传', date: '2025-05-20', hours: 3, location: '法治广场', description: '向居民普及法律知识，发放宣传资料' },
    { id: 10, memberId: 6, name: '义务植树活动', date: '2026-03-12', hours: 4, location: '城郊生态林', description: '参加义务植树活动，栽种树苗30余棵' },
    { id: 11, memberId: 7, name: '学雷锋志愿服务活动', date: '2026-03-05', hours: 3, location: '市民广场', description: '为群众提供义务咨询服务' }
  ],

  // 日历事件（含党的会议）
  calendarEvents: [
    // 法定假日
    { date: '2026-01-01', name: '元旦', type: 'holiday' },
    { date: '2026-05-01', name: '劳动节', type: 'holiday' },
    { date: '2026-10-01', name: '国庆节', type: 'holiday' },
    { date: '2026-06-01', name: '国际儿童节', type: 'holiday' },
    { date: '2026-03-08', name: '国际妇女节', type: 'holiday' },
    { date: '2026-09-10', name: '教师节', type: 'holiday' },
    // 传统节日
    { date: '2026-02-17', name: '春节', type: 'festival' },
    { date: '2026-04-05', name: '清明节', type: 'festival' },
    { date: '2026-06-19', name: '端午节', type: 'festival' },
    { date: '2026-10-06', name: '中秋节', type: 'festival' },
    { date: '2026-12-22', name: '冬至', type: 'festival' },
    // 党的纪念日
    { date: '2026-07-01', name: '建党节', type: 'party' },
    { date: '2026-08-01', name: '建军节', type: 'party' },
    { date: '2026-05-04', name: '青年节', type: 'party' },
    { date: '2026-03-05', name: '学雷锋纪念日', type: 'party' },
    { date: '2026-03-12', name: '植树节', type: 'party' },
    { date: '2026-12-04', name: '国家宪法日', type: 'party' },
    // 党的重大会议
    { date: '2026-03-05', name: '全国两会召开', type: 'meeting' },
    { date: '2026-10-15', name: '二十届五中全会', type: 'meeting' },
    { date: '2026-07-01', name: '庆祝建党105周年大会', type: 'meeting' },
    { date: '2026-12-10', name: '中央经济工作会议', type: 'meeting' },
    { date: '2026-05-20', name: '全国组织工作会议', type: 'meeting' },
    { date: '2026-09-15', name: '全国宣传思想文化工作会议', type: 'meeting' },
    // 历史重要会议（供查阅）
    { date: '2024-07-15', name: '二十届三中全会', type: 'meeting' },
    { date: '2025-10-01', name: '二十届四中全会', type: 'meeting' }
  ],

  // 用户自定义日程
  customEvents: []
};
