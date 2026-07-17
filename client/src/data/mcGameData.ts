/**
 * INUS MC CUE MATCH - 게임 데이터
 * 5개 진행 기준(축)을 기준으로 사회자 강점을 매핑하고,
 * 브리핑(60%) + 게임 중 선택(40%) 룰베이스로 추천 사회자를 계산한다.
 * 점수/매칭률은 절대 사용자에게 노출하지 않는다 (내부 로직 전용).
 */

export type Axis = "flow" | "emotion" | "guest" | "timing" | "formal";

export const AXIS_LABEL: Record<Axis, string> = {
  flow: "흐름 안정성",
  emotion: "감정선 보호",
  guest: "하객 소통",
  timing: "시간·큐 조율",
  formal: "격식·자연스러움",
};

export interface GameMc {
  name: string;
  image: string;
  profileCardImg: string;
  profileUrl: string;
  youtubeId?: string;
  tags: string[];
  reviewKeywords: string[];
  // 이 사회자가 강점으로 검증된 축 (내부 매칭 전용, UI 노출 금지)
  strengths: Axis[];
  // 결과 카드에 보여줄, 검증된 강점 문구 (reviewKeywords 중 선별)
  matchReasons: Record<Axis, string>;
  fitDescription: string; // "이런 예식에 잘 맞아요"
}

// McSection.tsx의 실제 데이터와 동일한 이미지/링크를 재사용
export const GAME_MCS: GameMc[] = [
  {
    name: "김민수",
    image: "/images/mc-profile-1_33531819.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/DyhPmZzlNmUwZcsY.png",
    profileUrl: "https://blog.naver.com/inusmusics/223996383838",
    youtubeId: "YmqVrha13G0",
    tags: ["품격형", "아나운서형"],
    reviewKeywords: ["깔끔한진행", "원하는분위기맞춤진행", "안정감있는진행", "돌발상황대응력", "자연스러운분위기리드", "몰입도높은진행"],
    strengths: ["flow", "timing"],
    matchReasons: {
      flow: "안정감 있는 진행으로 흐름이 끊기지 않아요",
      timing: "돌발 상황에서도 침착하게 큐를 조율해요",
      emotion: "",
      guest: "",
      formal: "",
    },
    fitDescription: "예식 흐름이 매끄럽게 이어지길 원하는 예식",
  },
  {
    name: "고승범",
    image: "/images/mc-profile-4_a9e52880.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/SPAinOSuRkaiNJTx.png",
    profileUrl: "https://blog.naver.com/inusmusics/223235771542",
    youtubeId: "iKi77thkR4s",
    tags: ["품격형", "아나운서형"],
    reviewKeywords: ["세심한준비와멘트진행", "친절하고깔끔한진행", "몰입도높은진행", "정돈된목소리톤", "자연스럽고매끄러운진행", "센스있는분위기리드"],
    strengths: ["emotion", "guest"],
    matchReasons: {
      emotion: "세심하게 준비한 멘트로 감정선을 지켜요",
      guest: "센스 있는 분위기 리드로 하객과 자연스럽게 소통해요",
      flow: "",
      timing: "",
      formal: "",
    },
    fitDescription: "따뜻하면서도 자연스러운 소통이 필요한 예식",
  },
  {
    name: "이도영",
    image: "/images/mc-profile-2_f194877b.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/ppTgmcIFaCtGyINq.png",
    profileUrl: "https://blog.naver.com/inusmusics/223845891681",
    youtubeId: "ali34pV7ALk",
    tags: ["품격형", "밝은형", "감동형"],
    reviewKeywords: ["부드러운분위기리드", "위트있는진행", "유연하고친근한진행", "정돈된목소리톤", "프로페셔널한진행", "깔끔하고매끄러운진행"],
    strengths: ["emotion", "guest"],
    matchReasons: {
      emotion: "부드러운 분위기 리드로 감동적인 순간을 살려요",
      guest: "위트 있고 친근한 진행으로 하객과 잘 어울려요",
      flow: "",
      timing: "",
      formal: "",
    },
    fitDescription: "감동적이면서 하객과 함께 즐기는 예식",
  },
  {
    name: "석재선",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/RWSmnUABYYeEBdIF.png",
    profileUrl: "https://blog.naver.com/inusmusics/223822182933",
    youtubeId: "zx_iAhMkMns",
    tags: ["품격형", "감동형"],
    reviewKeywords: ["깔끔한진행", "자연스러운강약조절", "집중도높은목소리톤", "세심한멘트진행", "자연스러운분위기리드", "몰입도높은진행"],
    strengths: ["emotion", "flow"],
    matchReasons: {
      emotion: "세심한 멘트로 감정선을 놓치지 않아요",
      flow: "자연스러운 강약 조절로 몰입도 높은 흐름을 만들어요",
      guest: "",
      timing: "",
      formal: "",
    },
    fitDescription: "차분하면서도 몰입감 있는 진행을 원하는 예식",
  },
  {
    name: "이우영",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/COZSQEgdKVpfNtAZ.png",
    profileUrl: "https://blog.naver.com/inusmusics/220767962639",
    youtubeId: "prhKZqfMjfM",
    tags: ["품격형", "밝은형", "감동형", "아나운서형"],
    reviewKeywords: ["유쾌한분위기리드", "깔끔한진행톤", "원하는분위기맞춤진행", "밝고편안한예식분위기", "돌발상황대응력", "안정감있는진행"],
    strengths: ["guest", "timing"],
    matchReasons: {
      guest: "유쾌한 분위기 리드로 하객이 함께 즐겨요",
      timing: "돌발 상황 대응력이 뛰어나 진행이 안정적이에요",
      emotion: "",
      flow: "",
      formal: "",
    },
    fitDescription: "밝고 편안한 분위기에서 하객과 소통하는 예식",
  },
  {
    name: "김선혁",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/BNPzIkSNQIGLZEfs.png",
    profileUrl: "https://blog.naver.com/inusmusics/221025505211",
    youtubeId: "4Quvg9TIGAk",
    tags: ["품격형", "아나운서형"],
    reviewKeywords: ["젠틀하고깔끔한진행", "정확한딕션과전달력", "프로페셔널한진행", "정돈된목소리톤", "세심한예식준비", "센스있는분위기리드"],
    strengths: ["formal", "timing"],
    matchReasons: {
      formal: "젠틀하고 프로페셔널한 진행으로 격식을 지켜요",
      timing: "세심한 예식 준비로 시간 관리가 철저해요",
      emotion: "",
      guest: "",
      flow: "",
    },
    fitDescription: "품격 있고 정확한 진행이 필요한 예식",
  },
  {
    name: "장윤태",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/BzyEbfDYgsDXpYvx.png",
    profileUrl: "https://blog.naver.com/inusmusics/223246261228",
    youtubeId: "U5cJiiF-WcY",
    tags: ["품격형", "감동형"],
    reviewKeywords: ["프로페셔널한진행", "자연스럽고매끄러운진행", "센스있는분위기리드", "세심한멘트진행", "안정감있는진행톤", "몰입도높은진행"],
    strengths: ["formal", "emotion"],
    matchReasons: {
      formal: "프로페셔널한 진행으로 격식 있는 예식을 완성해요",
      emotion: "세심한 멘트로 감정선을 배려해요",
      guest: "",
      timing: "",
      flow: "",
    },
    fitDescription: "품격과 감동을 함께 챙기고 싶은 예식",
  },
  {
    name: "길상우",
    image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg",
    profileCardImg: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FQxXzn6GslDFTyH_mp_7s7%2F2_NLo2VM.png",
    profileUrl: "https://blog.naver.com/inusmusics/220802942529",
    youtubeId: "0Ske676aw84",
    tags: ["품격형", "밝은형"],
    reviewKeywords: ["세심한예식준비", "정확한딕션과전달력", "프로페셔널한진행", "위트있는분위기리드", "안정감있는진행", "센스있는분위기리드"],
    strengths: ["timing", "guest"],
    matchReasons: {
      timing: "세심한 예식 준비로 진행 타이밍을 꼼꼼히 챙겨요",
      guest: "위트 있는 분위기 리드로 하객 참여를 이끌어요",
      emotion: "",
      flow: "",
      formal: "",
    },
    fitDescription: "꼼꼼한 준비와 유쾌한 진행을 함께 원하는 예식",
  },
  {
    name: "최윤아",
    image: "/images/mc-yuna.jpg",
    profileCardImg: "",
    profileUrl: "https://blog.naver.com/inusmusics/224327229799",
    youtubeId: "wuwAiKu9HbU",
    tags: ["품격형", "아나운서형"],
    reviewKeywords: ["정확한전달력", "깔끔한진행톤", "호텔웨딩분위기맞춤", "센스있는진행", "안정적인진행", "부드러운목소리"],
    strengths: ["formal", "flow"],
    matchReasons: {
      formal: "정확한 전달력과 깔끔한 톤으로 격식을 살려요",
      flow: "안정적인 진행으로 예식 흐름이 일정하게 유지돼요",
      emotion: "",
      guest: "",
      timing: "",
    },
    fitDescription: "호텔·품격 예식 분위기에 맞춘 정확한 진행",
  },
];

// ---------------------------------------------------------
// 화면 2: 예식 브리핑 질문
// ---------------------------------------------------------
export interface BriefingOption {
  label: string;
  axisWeights: Partial<Record<Axis, number>>;
}

export interface BriefingQuestion {
  id: string;
  question: string;
  maxSelect: number; // 1 = 단일선택
  options: BriefingOption[];
}

export const BRIEFING_QUESTIONS: BriefingQuestion[] = [
  {
    id: "mood",
    question: "우리 예식은 어떤 분위기였으면 하나요?",
    maxSelect: 1,
    options: [
      { label: "따뜻하고 감동적인 예식", axisWeights: { emotion: 2 } },
      { label: "밝고 유쾌한 예식", axisWeights: { guest: 2 } },
      { label: "차분하고 품격 있는 예식", axisWeights: { formal: 2 } },
      { label: "하객과 함께하는 참여형 예식", axisWeights: { guest: 2, emotion: 0.5 } },
    ],
  },
  {
    id: "guests",
    question: "하객은 어떤 분들이 가장 많을 것 같나요?",
    maxSelect: 1,
    options: [
      { label: "가족·어르신 중심", axisWeights: { emotion: 1, formal: 1 } },
      { label: "친구 하객 중심", axisWeights: { guest: 2 } },
      { label: "직장 동료 중심", axisWeights: { formal: 2 } },
      { label: "가족과 친구가 고르게 참석", axisWeights: { flow: 1.5 } },
    ],
  },
  {
    id: "expect",
    question: "사회자에게 가장 기대하는 점은?",
    maxSelect: 2,
    options: [
      { label: "예식 흐름이 끊기지 않는 진행", axisWeights: { flow: 2 } },
      { label: "부모님과 신랑신부를 배려하는 멘트", axisWeights: { emotion: 2 } },
      { label: "하객과 자연스럽게 소통하는 분위기", axisWeights: { guest: 2 } },
      { label: "예식 시간을 정확하게 관리하는 진행", axisWeights: { timing: 2 } },
      { label: "과하지 않고 품격 있는 진행", axisWeights: { formal: 2 } },
      { label: "감동적인 순간의 여운을 살리는 진행", axisWeights: { emotion: 1.5 } },
    ],
  },
  {
    id: "avoid",
    question: "피하고 싶은 진행이 있다면? (선택)",
    maxSelect: 3,
    options: [
      { label: "과한 유머", axisWeights: { formal: 1, guest: -0.5 } },
      { label: "지나치게 긴 멘트", axisWeights: { timing: 1 } },
      { label: "하객 참여를 강요하는 진행", axisWeights: { formal: 1 } },
      { label: "너무 딱딱한 분위기", axisWeights: { guest: 1 } },
      { label: "예식이 지연되는 것", axisWeights: { timing: 1.5 } },
    ],
  },
];

// ---------------------------------------------------------
// 화면 3~4: 가상 사회자 상황 (Prototype = 신부 입장 지연 1개)
// ---------------------------------------------------------
export interface ScenarioChoice {
  label: string;
  resultText: string;
  axisWeights: Partial<Record<Axis, number>>;
  gaugeChange: { flowGauge: number; emotionGauge: number; guestGauge: number; timeGauge: number };
}

export const SCENARIO_1 = {
  title: "신부 입장 지연",
  situation:
    "신부 입장 음악이 시작되었습니다.\n하지만 신부는 아직 입장을 준비 중이고,\n신랑은 앞에서 대기하고 있습니다.\n\n사회자인 당신은 어떻게 진행하시겠어요?",
  choices: [
    {
      label: "하객에게 상황을 직접 설명하고 기다린다",
      resultText: "상황 전달은 명확하지만, 하객의 시선이 신부의 지연 상황에 집중될 수 있습니다.",
      axisWeights: { guest: 1.5, emotion: 0.5 },
      gaugeChange: { flowGauge: -1, emotionGauge: 0, guestGauge: 1, timeGauge: -1 },
    },
    {
      label: "음악과 입장 큐를 조정하고, 하객에게는 짧은 안내만 전달한다",
      resultText: "음악·신부 준비 상태·하객의 시선을 함께 조정했습니다. 예식 흐름을 안정적으로 유지하는 진행입니다.",
      axisWeights: { flow: 2, timing: 1.5 },
      gaugeChange: { flowGauge: 1, emotionGauge: 1, guestGauge: 0, timeGauge: 1 },
    },
    {
      label: "가벼운 멘트로 하객의 분위기를 유지한다",
      resultText: "대기 시간을 자연스럽게 만들 수 있지만, 예식 분위기와 하객 구성에 따라 유머의 강도를 조절해야 합니다.",
      axisWeights: { guest: 2 },
      gaugeChange: { flowGauge: 0, emotionGauge: -1, guestGauge: 1, timeGauge: -1 },
    },
  ] as ScenarioChoice[],
};

export const SCENARIO_2 = {
  title: "축가 후 박수 연결",
  situation:
    "축가가 끝났습니다.\n하객의 박수가 이어지고 있고,\n다음 순서는 부모님 인사입니다.\n\n어떻게 연결하시겠어요?",
  choices: [
    {
      label: "박수의 여운을 충분히 기다린 뒤 짧게 연결한다",
      resultText: "축가의 감정선을 보호하면서 부모님 순서로 자연스럽게 전환하는 방식입니다.",
      axisWeights: { emotion: 2, flow: 1 },
      gaugeChange: { flowGauge: 1, emotionGauge: 1, guestGauge: 0, timeGauge: 0 },
    },
    {
      label: "바로 멘트를 시작해 다음 순서로 전환한다",
      resultText: "순서 연결은 빠르지만, 축가 직후의 감정과 박수가 짧게 끊길 수 있습니다.",
      axisWeights: { timing: 2 },
      gaugeChange: { flowGauge: 0, emotionGauge: -1, guestGauge: -1, timeGauge: 1 },
    },
    {
      label: "축가에 대한 감상을 덧붙이고 하객의 박수를 더 유도한다",
      resultText: "하객 참여와 분위기를 높일 수 있지만, 다음 순서 준비 시간이 줄어들 수 있습니다.",
      axisWeights: { guest: 2 },
      gaugeChange: { flowGauge: 0, emotionGauge: 0, guestGauge: 1, timeGauge: -1 },
    },
  ] as ScenarioChoice[],
};

export const SCENARIO_3 = {
  title: "예식 5분 지연",
  situation:
    "현재 예식이 약 5분 지연되었습니다.\n신랑신부 입장과 부모님 순서는 유지해야 하고,\n뒤 예식까지 남은 시간은 35분입니다.\n\n어떤 방식으로 조정하시겠어요?",
  choices: [
    {
      label: "모든 순서를 유지하되 멘트를 빠르게 진행한다",
      resultText: "모든 순서를 지킬 수 있지만, 진행이 급하게 느껴질 수 있습니다.",
      axisWeights: { timing: 1.5 },
      gaugeChange: { flowGauge: -1, emotionGauge: -1, guestGauge: 0, timeGauge: 1 },
    },
    {
      label: "핵심 순서는 유지하고, 전환 멘트와 대기 시간을 줄인다",
      resultText: "핵심 순간은 유지하면서 전환과 대기 시간을 조정하는 안정적인 방식입니다.",
      axisWeights: { flow: 1.5, timing: 2 },
      gaugeChange: { flowGauge: 1, emotionGauge: 0, guestGauge: 0, timeGauge: 1 },
    },
    {
      label: "선택 가능한 이벤트나 순서를 간소화한다",
      resultText: "전체 시간은 확보할 수 있지만, 신랑신부가 중요하게 생각한 순서인지 먼저 확인해야 합니다.",
      axisWeights: { formal: 1, timing: 1 },
      gaugeChange: { flowGauge: 0, emotionGauge: 0, guestGauge: 0, timeGauge: 2 },
    },
  ] as ScenarioChoice[],
};

export const SCENARIOS = [SCENARIO_1, SCENARIO_2, SCENARIO_3];

// ---------------------------------------------------------
// 결과 유형 문구 (지배적 축 조합에 따라 선택)
// ---------------------------------------------------------
export const RESULT_TYPES: { axes: Axis[]; title: string }[] = [
  { axes: ["emotion", "flow"], title: "감정을 지키는 안정형 진행" },
  { axes: ["guest", "flow"], title: "하객과 함께 만드는 자연스러운 진행" },
  { axes: ["timing", "flow"], title: "정확하고 깔끔한 흐름 중심 진행" },
  { axes: ["guest", "emotion"], title: "분위기를 자연스럽게 끌어올리는 진행" },
  { axes: ["emotion", "formal"], title: "따뜻한 품격을 중심으로 하는 진행" },
  { axes: ["formal", "timing"], title: "정확하고 격식 있는 진행" },
];
