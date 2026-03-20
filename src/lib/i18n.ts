export type Locale = 'zh' | 'en';

const translations = {
  zh: {
    // App
    appTitle: '中医协定处方',
    appSubtitle: 'AI 辅助匹配系统',
    newChat: '新对话',

    // Disclaimer
    disclaimer: '医疗声明：本应用仅供参考，不能替代专业医疗诊断。如有不适请及时就医。',

    // Profile form
    profileTitle: '欢迎使用中医协定处方匹配',
    profileSubtitle: '请先填写基本信息，以便更准确地为您匹配处方',
    nameLabel: '姓名',
    nameOptional: '(选填)',
    namePlaceholder: '您的姓名或称呼',
    genderLabel: '性别',
    genderRequired: '*',
    male: '男',
    female: '女',
    ageLabel: '年龄',
    agePlaceholder: '您的年龄',
    pregnantLabel: '是否怀孕',
    pregnantNo: '否',
    pregnantYes: '是',
    medicalHistoryLabel: '既往病史',
    medicalHistoryPlaceholder: '如：高血压、糖尿病、高脂血症等',
    allergiesLabel: '过敏史',
    allergiesPlaceholder: '如：青霉素过敏、海鲜过敏等',
    startConsultation: '开始问诊',
    privacyNotice: '您的信息仅用于本次问诊匹配，不会被存储',

    // Welcome screen
    welcomeTitle: '中医协定处方匹配',
    welcomeSubtitle: '描述您的症状，AI 助手将帮您在 86 个协定处方中匹配最适合的方案',
    tryExamples: '试试这些例子',
    examples: [
      '我最近胃胀，大便粘，拉不干净',
      '我有早泄的问题，手脚心发热',
      '膝盖疼，肿了，上楼梯加重',
      '月经来的时候肚子特别疼，有血块',
      '最近失眠多梦，心慌，没力气',
      '皮肤起红疹，很痒，反复发作',
    ],

    // Chat
    inputPlaceholder: '描述您的症状...',
    sendLabel: '发送',
    userAvatar: '我',
    aiAvatar: '医',
    errorPrefix: '抱歉，出现了一些问题：',
    errorSuffix: '。请稍后再试。',
    unknownError: '未知错误',

    // Language
    langLabel: '语言',
    langZh: '中文',
    langEn: 'English',

    // Landing page
    landingTitle: '协定处方详情',
    landingBack: '返回对话',
    buyNow: '立即购买',
    contactDoctor: '联系医生',
    priceLabel: '价格',
    courseLabel: '疗程方案',
    courseDays: '天为一个疗程',
    coursePrice: '疗程价格',
    paymentTitle: '确认支付',
    paymentSuccess: '支付成功！',
    paymentSuccessMsg: '您的处方订单已提交，医生将尽快与您联系。',
    paymentCancel: '取消',
    paymentConfirm: '确认支付',
    contactTitle: '联系医生',
    contactMsg: '请添加医生微信进行在线咨询',
    wechatId: '微信号：TCM_Doctor_001',
    phoneNumber: '电话：400-123-4567',
    workHours: '工作时间：周一至周六 8:00-18:00',
    contactClose: '我知道了',
    efficacy: '功效',
    indication: '主治',
    symptoms: '适应症',
    patternPoints: '辨证要点',
    dosage: '用法用量',
    precautions: '注意事项',
    prescriptionId: '处方编号',
    category: '类别',
  },
  en: {
    appTitle: 'TCM Prescriptions',
    appSubtitle: 'AI-Assisted Matching System',
    newChat: 'New Chat',

    disclaimer: 'Medical Disclaimer: This app is for reference only and cannot replace professional medical diagnosis. Please seek medical attention if unwell.',

    profileTitle: 'Welcome to TCM Prescription Matching',
    profileSubtitle: 'Please fill in your basic information for more accurate prescription matching',
    nameLabel: 'Name',
    nameOptional: '(optional)',
    namePlaceholder: 'Your name',
    genderLabel: 'Gender',
    genderRequired: '*',
    male: 'Male',
    female: 'Female',
    ageLabel: 'Age',
    agePlaceholder: 'Your age',
    pregnantLabel: 'Pregnant',
    pregnantNo: 'No',
    pregnantYes: 'Yes',
    medicalHistoryLabel: 'Medical History',
    medicalHistoryPlaceholder: 'e.g., Hypertension, Diabetes, etc.',
    allergiesLabel: 'Allergies',
    allergiesPlaceholder: 'e.g., Penicillin allergy, Seafood allergy, etc.',
    startConsultation: 'Start Consultation',
    privacyNotice: 'Your information is only used for this consultation and will not be stored',

    welcomeTitle: 'TCM Prescription Matching',
    welcomeSubtitle: 'Describe your symptoms, and the AI assistant will match the best prescription from 86 formulas',
    tryExamples: 'Try these examples',
    examples: [
      'I have bloating and sticky stool recently',
      'I have premature ejaculation with hot palms and soles',
      'Knee pain with swelling, worse when climbing stairs',
      'Severe menstrual cramps with blood clots',
      'Insomnia, palpitations, and fatigue recently',
      'Red itchy skin rash that keeps recurring',
    ],

    inputPlaceholder: 'Describe your symptoms...',
    sendLabel: 'Send',
    userAvatar: 'Me',
    aiAvatar: 'Dr',
    errorPrefix: 'Sorry, something went wrong: ',
    errorSuffix: '. Please try again later.',
    unknownError: 'Unknown error',

    langLabel: 'Language',
    langZh: '中文',
    langEn: 'English',

    landingTitle: 'Prescription Details',
    landingBack: 'Back to Chat',
    buyNow: 'Purchase Now',
    contactDoctor: 'Contact Doctor',
    priceLabel: 'Price',
    courseLabel: 'Treatment Plan',
    courseDays: 'days per course',
    coursePrice: 'Course Price',
    paymentTitle: 'Confirm Payment',
    paymentSuccess: 'Payment Successful!',
    paymentSuccessMsg: 'Your prescription order has been submitted. The doctor will contact you shortly.',
    paymentCancel: 'Cancel',
    paymentConfirm: 'Confirm Payment',
    contactTitle: 'Contact Doctor',
    contactMsg: 'Please add the doctor on WeChat for online consultation',
    wechatId: 'WeChat: TCM_Doctor_001',
    phoneNumber: 'Phone: 400-123-4567',
    workHours: 'Hours: Mon-Sat 8:00-18:00',
    contactClose: 'Got it',
    efficacy: 'Efficacy',
    indication: 'Indication',
    symptoms: 'Symptoms',
    patternPoints: 'Pattern Points',
    dosage: 'Dosage',
    precautions: 'Precautions',
    prescriptionId: 'Prescription ID',
    category: 'Category',
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

export function t(locale: Locale, key: TranslationKey): string {
  const val = translations[locale][key];
  if (Array.isArray(val)) return val.join(', ');
  return val as string;
}

export function getExamples(locale: Locale): string[] {
  return [...translations[locale].examples];
}
