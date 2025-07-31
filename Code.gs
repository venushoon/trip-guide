/**
 * Apps Script 웹 앱의 진입점입니다.
 * 웹 앱 URL로 요청이 들어올 때 HTML 파일을 서빙합니다.
 * @param {GoogleAppsScript.Events.DoGet} e - GET 요청 이벤트 객체
 * @returns {GoogleAppsScript.HTML.HtmlOutput} HTML 출력
 */
function doGet(e) {
  // Index.html 파일을 불러와 HTML 서비스로 서빙합니다.
  // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  // 이는 앱을 다른 웹 페이지의 iframe 내에서 실행할 수 있도록 허용합니다.
  // .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
  // 모바일 기기에서의 반응형 웹 디자인을 위한 뷰포트 메타 태그를 추가합니다.
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * HTML 템플릿 내에서 다른 HTML 파일을 포함(include)할 수 있도록 돕는 함수입니다.
 * 클라이언트 측 스크립트에서 HTML, CSS, JavaScript 파일을 모듈화하여 관리할 때 유용합니다.
 * @param {string} filename - 포함할 파일의 이름 (확장자 제외)
 * @returns {string} 파일 내용
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
 * 클라이언트에서 호출되어 여행 추천 데이터를 생성하고 반환하는 함수입니다.
 * 실제 Gemini API 호출 로직은 여기에 구현됩니다.
 * 현재는 더미 데이터를 반환합니다.
 * @param {Object} userData - 사용자 입력 데이터 (MBTI, 여행지, 기간 등)
 * @returns {Object} 여행 추천 결과 데이터
 */
function getTravelRecommendation(userData) {
  // 실제 Gemini API 호출 로직을 여기에 구현합니다.
  // const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // 예시: 더미 데이터 생성 (MBTI 및 기간에 따라 간단히 조정)
  const itineraries = {
    'ENFP': [
      {
        theme: "파리 예술과 낭만 탐험",
        activities: [
          { name: "에펠탑 야경 감상", mapLink: "https://www.google.com/maps/search/?api=1&query=에펠탑" },
          { name: "루브르 박물관 관람", mapLink: "https://www.google.com/maps/search/?api=1&query=루브르박물관" },
          { name: "몽마르뜨 언덕과 사크레쾨르 대성당", mapLink: "https://www.google.com/maps/search/?api=1&query=몽마르뜨언덕" },
          { name: "세느강 유람선 타기", mapLink: "https://www.google.com/maps/search/?api=1&query=세느강유람선" },
          { name: "마레 지구 쇼핑 및 카페", mapLink: "https://www.google.com/maps/search/?api=1&query=파리마레지구" }
        ],
        tip: "파리의 골목길을 거닐며 예상치 못한 예술적 영감을 찾아보세요!"
      },
      {
        theme: "도쿄의 활기찬 문화와 미식",
        activities: [
          { name: "시부야 스크램블 교차로 체험", mapLink: "https://www.google.com/maps/search/?api=1&query=시부야스크램블교차로" },
          { name: "신주쿠 오모이데요코초 골목 탐방", mapLink: "https://www.google.com/maps/search/?api=1&query=신주쿠오모이데요코초" },
          { name: "아사쿠사 센소지 사원 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=아사쿠사센소지" },
          { name: "하라주쿠 다케시타 거리 쇼핑", mapLink: "https://www.google.com/maps/search/?api=1&query=하라주쿠다케시타거리" },
          { name: "츠키지 장외시장 미식 투어", mapLink: "https://www.google.com/maps/search/?api=1&query=츠키지장외시장" }
        ],
        tip: "도쿄의 다채로운 매력을 경험하며 새로운 자극을 느껴보세요!"
      },
      {
        theme: "뉴욕의 에너지와 문화 충전",
        activities: [
          { name: "타임스퀘어 야경 감상", mapLink: "https://www.google.com/maps/search/?api=1&query=타임스퀘어" },
          { name: "센트럴 파크 산책 및 피크닉", mapLink: "https://www.google.com/maps/search/?api=1&query=센트럴파크" },
          { name: "브로드웨이 뮤지컬 관람", mapLink: "https://www.google.com/maps/search/?api=1&query=브로드웨이" },
          { name: "메트로폴리탄 미술관 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=메트로폴리탄미술관" },
          { name: "브루클린 브릿지 걷기", mapLink: "https://www.google.com/maps/search/?api=1&query=브루클린브릿지" }
        ],
        tip: "뉴욕의 끊임없는 에너지 속에서 당신만의 영감을 찾아보세요."
      }
    ],
    'ISTJ': [
      {
        theme: "로마 고대 유적과 역사 탐방",
        activities: [
          { name: "콜로세움 및 포로 로마노 탐방", mapLink: "https://www.google.com/maps/search/?api=1&query=콜로세움" },
          { name: "바티칸 시국 및 성 베드로 대성당", mapLink: "https://www.google.com/maps/search/?api=1&query=바티칸시국" },
          { name: "판테온 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=판테온" },
          { name: "트레비 분수 동전 던지기", mapLink: "https://www.google.com/maps/search/?api=1&query=트레비분수" },
          { name: "보르게세 미술관 관람 (사전 예약)", mapLink: "https://www.google.com/maps/search/?api=1&query=보르게세미술관" }
        ],
        tip: "로마의 방대한 역사를 체계적으로 탐험하며 깊은 지식을 얻으세요!"
      },
      {
        theme: "교토 전통 문화와 정원 기행",
        activities: [
          { name: "금각사 (킨카쿠지) 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=금각사" },
          { name: "후시미 이나리 신사 천 개의 토리이", mapLink: "https://www.google.com/maps/search/?api=1&query=후시미이나리신사" },
          { name: "아라시야마 대나무 숲 산책", mapLink: "https://www.google.com/maps/search/?api=1&query=아라시야마대나무숲" },
          { name: "기요미즈데라 (청수사) 관람", mapLink: "https://www.google.com/maps/search/?api=1&query=기요미즈데라" },
          { name: "니조성 방문 및 역사 학습", mapLink: "https://www.google.com/maps/search/?api=1&query=니조성" }
        ],
        tip: "교토의 고즈넉한 아름다움 속에서 질서 정연한 평온함을 느껴보세요."
      },
      {
        theme: "베를린 역사와 현대 예술 탐방",
        activities: [
          { name: "브란덴부르크 문 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=브란덴부르크문" },
          { name: "베를린 장벽 기념관", mapLink: "https://www.google.com/maps/search/?api=1&query=베를린장벽기념관" },
          { name: "박물관 섬 (페르가몬 박물관 등)", mapLink: "https://www.google.com/maps/search/?api=1&query=박물관섬베를린" },
          { name: "체크포인트 찰리 방문", mapLink: "https://www.google.com/maps/search/?api=1&query=체크포인트찰리" },
          { name: "국회의사당 돔 관람 (사전 예약)", mapLink: "https://www.google.com/maps/search/?api=1&query=베를린국회의사당" }
        ],
        tip: "베를린의 복잡한 역사를 깊이 이해하고 현대 예술의 정수를 경험하세요."
      }
    ]
  };

  let recommendedItinerary = itineraries[userData.mbti] || itineraries['ISTJ']; // 기본값
  const durationDays = parseInt(userData.duration.charAt(0));

  // 여행 기간에 맞춰 일정을 자르거나 추가합니다.
  recommendedItinerary = recommendedItinerary.slice(0, durationDays);
  if (recommendedItinerary.length < durationDays) {
    for(let i = recommendedItinerary.length; i < durationDays; i++) {
         recommendedItinerary.push({ theme: "자유 시간 및 쇼핑", activities: [{name: "현지 시장 구경", mapLink: ""}, {name: "기념품 쇼핑", mapLink: ""}, {name: "자유롭게 도시 산책", mapLink: ""}], tip: "남은 예산으로 소중한 사람들을 위한 선물을 골라보세요." });
    }
  }

  return {
    itinerary: recommendedItinerary
  };
}

/**
 * 사용자 데이터와 추천 결과를 Google Sheet에 저장하는 함수입니다.
 * @param {Object} dataToSave - Google Sheet에 저장할 데이터 객체
 */
function saveToSheet(dataToSave) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('기록');
    if (!sheet) {
      console.error('Google Sheet에 "기록" 시트를 찾을 수 없습니다.');
      // 클라이언트에 오류 메시지를 반환하거나 다른 방식으로 처리할 수 있습니다.
      throw new Error('Google Sheet에 "기록" 시트를 찾을 수 없습니다.');
    }

    // 데이터 배열 생성 (시트의 헤더 순서와 일치해야 합니다.)
    const rowData = [
      new Date(), // 타임스탬프
      dataToSave.mbti,
      dataToSave.destination,
      dataToSave.duration,
      dataToSave.partySize,
      dataToSave.style,
      dataToSave.budget,
      dataToSave.itinerary // JSON 문자열로 저장
    ];

    // 일괄 쓰기를 위해 setValues() 대신 appendRow() 사용
    // appendRow는 단일 행 추가에 최적화되어 있고, 여기서는 한 번에 한 행만 추가하므로 적합합니다.
    sheet.appendRow(rowData);
    console.log('데이터가 Google Sheet에 성공적으로 기록되었습니다:', rowData);
  } catch (error) {
    console.error('Google Sheet 기록 중 오류 발생:', error);
    // 에러를 클라이언트 측으로 다시 던져 처리할 수 있습니다.
    throw new Error('데이터 저장 중 오류 발생: ' + error.message);
  }
}
