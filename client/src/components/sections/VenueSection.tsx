export default function VenueSection() {
  const venues1 = [
    "공항컨벤션","구로명품웨딩프로포즈","곤자가컨벤션","국회사랑재","공군회관","규수당","그랜드컨벤션센타","글래드호텔","대림펠리체아트홀","그랜드힐튼서울호텔","국방컨벤션","그랜드하얏트서울호텔","그라치아웨딩컨벤션","강북웨딩피에스타귀족","궁전회관","고려플라자","경남호텔","강동웨딩KDW","가든파이브웨딩컨벤션","가천컨벤션","강남S컨벤션","동서울웨드빌","광명역사웨딩홀","강남라루체","구리중학교","광주중앙교회","경기교총웨딩컨벤션","그래머시코엑스","노보텔앰배서더","남산예술원","누리시아","노빌리티웨딩","노체웨딩홀(인천)","나인트리컨벤션","더뉴컨벤션","더채플앳웨스트","더브릴리에","더빅토리아웨딩파티","더이스턴하우스","더모임DMC타워웨딩","더에스비웨딩컨벤션","더모스트웨딩홀","더리버사이드호텔","더바인","더케이호텔","더포레","더프리마베라","더화이트베일","디노체컨벤션","다온플라츠컨벤션","더블레스컨벤션","더웨딩컨벤션","더다이닝호수","더베네치아","더컨벤션","대구파라다이스호텔","대구인터불고호텔","동두천컨벤션홀","대구뉴욕뉴욕","더프라미스","더플라자호텔","대구노비아갈라","대검찰청","더청담","더휴","로프트가든","라마다서울호텔","라마다서울신도림호텔","루나미엘레","라무르웨딩홀","루벨","런던웨딩프라자","라까사호텔","레노스블랑쉬","라온드베뉴","롯데호텔월드","루이비스컨벤션","르벨상스호텔","라비아컨벤션","르와지르호텔","리베라호텔","라플레이스","메이필드호텔","메리골드호텔","마린아일랜드","메모리스클래식","마리앤코(서울역)","명동라루체","미란다호텔(이천)","뮤지엄웨딩홀","마켓오","베뉴지웨딩컨벤션","보타닉파크웨딩","블리스웨딩컨벤션","베스트웨스턴프리미어구로호텔","보벨르웨딩컨벤션","베스트웨스턴프리미어서울가든호텔","백악관웨딩문화원","베라카채플웨딩홀","베르가모","보통드로제","반포원","보테가마지오","백석더테라스웨딩홀","부천영웨딩홀",
  ];
  const venues2 = [
    "세븐스프링스(목동점)","쉐라톤서울디큐브시티호텔","신도림S컨벤션","상암봄날의정원","스칼라티움(상암)","스탠포드호텔","샤이닝스톤웨딩홀","세상의모든아침","썬프라자웨딩홀","서울여성플라자웨딩홀","서울대교수회관","서울대연구공원컨벤션","쉐라톤서울팔래스호텔","세종대왕기념관웨딩홀","스타시티아트홀","씨어터웨딩프라하","시그니엘서울호텔","수원라마다호텔","선한목자교회","세이웨딩홀(평택)","설악웨딩타운(충남)","세종호텔","수원영통스칼라티움","스카이컨벤션웨딩홀(춘천)","송도센트럴파크호텔(인천)","소소한풍경","신라호텔","양천리더스클럽","웨스턴베니비스","웨딩시티","유앤아이웨딩홀","이룸웨딩컨벤션","63컨벤션센터","아모리스(타임스퀘어)","여의도웨딩컨벤션","웨딩그룹위더스","웨딩여율리","아르테스웨딩","연세플라자","엔티움","용산아이컨벤션","육군회관","엘타워","아이윌웨딩홀","아펠가모","엘루체컨벤션","에디스웨딩컨벤션","웨딩스퀘어","웨딩헤너스","H스퀘어","워커힐호텔","어린이회관려움웨딩홀","웨딩부띠크르블랑","이스턴베니비스","올림픽파크텔","SD웨딩","오월컨벤션(남양주)","Y타워컨벤션","오페르타웨딩홀","인터콘티넨탈호텔","일비노로소","안양더그레이스켈리","인천계산CN천년웨딩홀","AW컨벤션(안산)","AW컨벤션(부암동)","의정부낙원웨딩홀","원주오크밸리리조트","아르델웨딩홀(서산)","이천고려웨딩홀","웨딩제이(의정부)","원천교회","MJ컨벤션","엠팰리스","오페라컨벤션(원주)","오드니엘웨딩홀(분당)","아벤티움","양재시민의숲","아무르웨딩컨벤션","엠플러스웨딩홀","앤유하우스","지밸리컨벤션","정협탑웨딩홀시티","제이오스티엘","JK아트컨벤션","전경련플라자","J타워웨딩","JW컨벤션웨딩홀","JJ웨딩컨벤션(일산)","전주엔타워베일리호텔","GD컨벤션","충주더베이스호텔","청담웨딩홀","청주더빈컨벤션","채원웨딩홀(인천)","K컨벤션","KBS웨딩홀","켄싱턴호텔","콘래드서울호텔","KW컨벤션웨딩홀","K미디어웨딩컨벤션","코리아디자인센터","컨벤션웨딩홀(거창)","탑웨딩타운(경북김천)","프라디아","플로팅아일랜드","피제이호텔","푸르미르호텔(수원)","평창농협예식장","파티오나인","호텔베르누이","해군호텔W웨딩홀","한국교총MW컨벤션","호텔JW메리어트","한스갤러리","한강호텔웨딩홀","행복한웨딩홀(충남)","호서웨딩홀(충남)","하얏트호텔",
  ];

  return (
    <section className="py-10 overflow-hidden" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(212,184,150,0.12)", borderBottom: "1px solid rgba(212,184,150,0.12)" }}>
      {/* 상단 배지 */}
      <div className="text-center mb-6">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#d4b896" }}>Performed Venues</p>
        <div className="inline-flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, #d4b896)" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#fff" }}>
            <span style={{ color: "#d4b896" }}>224</span>
            <span style={{ color: "#5BB5A2", fontSize: "1.2rem" }}>+</span>
          </span>
          <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, #d4b896)" }} />
        </div>
        <p className="text-xs mt-2 tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>진행 웨딩홀 · 호텔</p>
      </div>

      {/* marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
        <style>{`
          @keyframes mc-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes mc-marquee2 { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          .mc-marquee-track { display: flex; width: max-content; animation: mc-marquee 120s linear infinite; }
          .mc-marquee-track2 { display: flex; width: max-content; animation: mc-marquee2 120s linear infinite; }
          .mc-marquee-track:hover, .mc-marquee-track2:hover { animation-play-state: paused; }
        `}</style>

        {/* 1행 */}
        <div className="mc-marquee-track mb-3">
          {[...venues1, ...venues1].map((v, i) => (
            <span key={i} className="flex items-center gap-4 px-5 text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.45)" }}>
              {v}<span style={{ color: "#d4b896", opacity: 0.4 }}>✦</span>
            </span>
          ))}
        </div>

        {/* 2행 — 반대 방향 */}
        <div className="mc-marquee-track2">
          {[...venues2, ...venues2].map((v, i) => (
            <span key={i} className="flex items-center gap-4 px-5 text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.45)" }}>
              {v}<span style={{ color: "#5BB5A2", opacity: 0.4 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
