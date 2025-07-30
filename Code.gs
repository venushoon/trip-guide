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
      { theme: "새로운 사람들과의 만남", activities: ["현지 펍 방문하기", "소셜 파티 참여", "플리마켓 구경하며 상인들과 대화하기"], tip: "예상치 못한 골목길 탐험이 행운을 가져다줄 거예요!" },
      { theme: "창의적 영감 탐색", activities: ["현대 미술관 방문", "거리 예술 투어", "독특한 컨셉의 카페에서 아이디어 스케치"], tip: "여행지의 색감과 소리를 기록해보세요." },
      { theme: "자유로운 휴식", activities: ["해변에서 자유롭게 일광욕", "공원 벤치에서 사람들 구경하기", "계획 없이 대중교통 타고 종점까지 가보기"], tip: "마음 가는 대로, 발길 닿는 대로 움직이는 하루!" },
    ],
    'ISTJ': [
      { theme: "역사와 전통 탐방", activities: ["국립 박물관 방문", "유서 깊은 건축물 답사", "전통 시장 둘러보기"], tip: "방문할 장소의 역사를 미리 공부해가면 재미가 두 배!" },
      { theme: "짜임새 있는 미식 투어", activities: ["미슐랭 가이드 맛집 방문 (사전 예약 필수)", "유명 베이커리 대표 메뉴 맛보기", "지역 특산주 시음"], tip: "동선을 고려해 효율적인 맛집 코스를 계획하세요." },
      { theme: "편안하고 안락한 휴식", activities: ["조용한 도서관에서 책 읽기", "전망 좋은 곳에서 차 마시기", "스파에서 피로 풀기"], tip: "익숙하고 편안한 활동이 최고의 재충전을 선사합니다." },
    ]
  };

  let recommendedItinerary = itineraries[userData.mbti] || itineraries['ISTJ']; // 기본값
  const durationDays = parseInt(userData.duration.charAt(0));

  // 여행 기간에 맞춰 일정을 자르거나 추가합니다.
  recommendedItinerary = recommendedItinerary.slice(0, durationDays);
  if (recommendedItinerary.length < durationDays) {
    for(let i = recommendedItinerary.length; i < durationDays; i++) {
         recommendedItinerary.push({ theme: "자유 시간 및 쇼핑", activities: ["기념품 가게 방문", "현지 대형마트 구경", "자유롭게 도시 산책"], tip: "남은 예산으로 소중한 사람들을 위한 선물을 골라보세요." });
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
