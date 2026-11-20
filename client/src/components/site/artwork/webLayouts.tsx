import type { Project } from "@/data";
import { Box, Btn, Head, Photo, Svg, T, TextLines, ctx } from "./primitives";

/* =========================================================================
   Seven web-design layouts. Structurally different, not recoloured copies.
   Patterns grounded in how these industries actually build:
   fashion = full-bleed gallery (Bottega/Zara/Chanel), restaurant = hours +
   order above fold with HTML menu, consulting = typographic no-imagery,
   construction = staged project timeline, beauty = concern-led dual path,
   education = forked IA, real estate = split map/list (Zillow/Redfin).
   ========================================================================= */

/* 1. FASHION — full-bleed, no browser chrome, nav floats over image */
export function NorthlineAtelier(p: Project) {
  const c = ctx(p.visual);
  return (
    <Svg label="Northline Atelier — full-bleed editorial storefront">
      <rect width="800" height="500" fill={c.bg} />
      {/* edge-to-edge hero, no frame at all */}
      <Photo x={0} y={0} w={800} h={330} c={c} id="nl" o={0.22} />
      {/* floating nav, left aligned, tiny */}
      <T x={34} y={40} font={c.hf} size={17} weight={700} fill={c.ink} ls={1.6}>
        NORTHLINE
      </T>
      {["Collection", "Lookbook", "Atelier", "Stockists"].map((w, i) => (
        <T
          key={w}
          x={520 + i * 68}
          y={40}
          font={c.bf}
          size={8}
          fill={c.ink}
          o={0.72}
        >
          {w}
        </T>
      ))}
      {/* single caption on the image — one focal point, no CTA cluster */}
      <T x={34} y={296} font={c.bf} size={8} fill={c.ink} ls={2.4} o={0.7}>
        AUTUMN 04 — THE WEIGHT OF CLOTH
      </T>
      {/* asymmetric gallery: one tall, two short — no uniform grid */}
      <Photo x={34} y={358} w={216} h={112} c={c} id="nl2" o={0.14} />
      <Photo x={266} y={358} w={144} h={112} c={c} id="nl3" o={0.1} />
      <Box x={426} y={358} w={196} h={112} fill={c.ink} o={0.04} />
      <T x={444} y={392} font={c.hf} size={13} weight={600} fill={c.ink}>
        Wool overcoat
      </T>
      <T x={444} y={412} font={c.bf} size={9} fill={c.mu}>
        ₦248,000
      </T>
      <T x={444} y={438} font={c.bf} size={8} fill={c.ink} ls={1.4} o={0.65}>
        VIEW PIECE
      </T>
      <line
        x1={444}
        y1={444}
        x2={508}
        y2={444}
        stroke={c.ink}
        strokeOpacity={0.5}
      />
      <T x={646} y={372} font={c.bf} size={8} fill={c.mu} ls={1.6}>
        01 / 24
      </T>
      <TextLines x={646} y={392} w={120} n={5} gap={11} fill={c.ink} o={0.18} />
    </Svg>
  );
}

/* 2. RESTAURANT — hours strip + book button above everything, HTML menu list */
export function MorrowHouse(p: Project) {
  const c = ctx(p.visual);
  const dishes: [string, string, string][] = [
    ["Grilled mackerel", "burnt lemon, fennel", "₦9,500"],
    ["Ogbono, short rib", "slow-cooked, six hours", "₦14,000"],
    ["Charred hispi", "black garlic butter", "₦6,200"],
    ["Buttermilk tart", "bay leaf ice cream", "₦5,000"],
  ];
  return (
    <Svg label="Morrow House — menu-first restaurant site">
      <rect width="800" height="500" fill={c.bg} />
      {/* utility bar: today's hours, not a weekly table */}
      <Box x={0} y={0} w={800} h={30} fill={c.ink} o={0.9} />
      <circle cx={26} cy={15} r={3.5} fill="#5FD08A" />
      <T x={38} y={19} font={c.bf} size={9} fill={c.bg}>
        Open today until 23:00
      </T>
      <T x={214} y={19} font={c.bf} size={9} fill={c.bg} o={0.65}>
        12 Norman Williams St, Ikoyi
      </T>
      <Btn
        x={690}
        y={6}
        w={92}
        h={18}
        label="Book a table"
        bg={c.ac}
        fg="#fff"
        font={c.bf}
        size={8.5}
      />
      {/* wordmark centred, small — the menu is the hero */}
      <T
        x={400}
        y={72}
        font={c.hf}
        size={22}
        weight={600}
        fill={c.ink}
        anchor="middle"
        ls={0.4}
      >
        Morrow House
      </T>
      <T
        x={400}
        y={92}
        font={c.bf}
        size={8.5}
        fill={c.mu}
        anchor="middle"
        ls={1.8}
      >
        NEIGHBOURHOOD KITCHEN · MENU CHANGES WEEKLY
      </T>
      <line
        x1={250}
        y1={110}
        x2={550}
        y2={110}
        stroke={c.ink}
        strokeOpacity={0.15}
      />
      {/* the menu itself, priced, described — dotted leaders like print */}
      <T x={110} y={146} font={c.bf} size={8} fill={c.ac} ls={2}>
        TONIGHT · CHANGED TODAY
      </T>
      {dishes.map(([n, d, pr], i) => (
        <g key={n}>
          <T
            x={110}
            y={182 + i * 52}
            font={c.hf}
            size={14}
            weight={600}
            fill={c.ink}
          >
            {n}
          </T>
          <T x={110} y={200 + i * 52} font={c.bf} size={9} fill={c.mu}>
            {d}
          </T>
          <line
            x1={110}
            y1={214 + i * 52}
            x2={690}
            y2={214 + i * 52}
            stroke={c.ink}
            strokeOpacity={0.1}
            strokeDasharray="2 4"
          />
          <T
            x={690}
            y={182 + i * 52}
            font={c.bf}
            size={11}
            fill={c.ink}
            anchor="end"
          >
            {pr}
          </T>
        </g>
      ))}
      <T x={110} y={412} font={c.bf} size={8.5} fill={c.mu}>
        Full menu · Wine list · Private dining
      </T>
      <Btn
        x={110}
        y={432}
        w={116}
        h={28}
        label="See full menu"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
      />
      <Btn
        x={238}
        y={432}
        w={100}
        h={28}
        label="Book"
        bg="transparent"
        fg={c.ink}
        font={c.bf}
      />
      <rect
        x={238}
        y={432}
        width={100}
        height={28}
        rx={2}
        fill="none"
        stroke={c.ink}
        strokeOpacity={0.4}
      />
    </Svg>
  );
}

/* 3. CONSULTING — typographic, zero imagery, named people + fee table */
export function CedarAdvisory(p: Project) {
  const c = ctx(p.visual);
  const rows: [string, string, string][] = [
    ["Strategy review", "3–4 weeks", "₦1.8m – 2.6m"],
    ["Board advisory", "Retained, monthly", "₦850k / mo"],
    ["Transaction support", "Per engagement", "On application"],
  ];
  return (
    <Svg label="Cedar & Co. — typographic advisory site">
      <rect width="800" height="500" fill={c.bg} />
      <T x={48} y={44} font={c.hf} size={14} weight={700} fill={c.ink} ls={0.2}>
        CEDAR &amp; CO.
      </T>
      {["Practice", "People", "Fees", "Contact"].map((w, i) => (
        <T key={w} x={520 + i * 66} y={44} font={c.bf} size={8.5} fill={c.mu}>
          {w}
        </T>
      ))}
      <line
        x1={48}
        y1={60}
        x2={752}
        y2={60}
        stroke={c.ink}
        strokeOpacity={0.18}
      />
      {/* big typographic statement, no image */}
      <Head
        x={48}
        y={92}
        w={470}
        h={120}
        font={c.hf}
        size={33}
        fill={c.ink}
        weight={600}
        lh={1.08}
      >
        Four people. No account managers.
      </Head>
      <TextLines x={48} y={214} w={400} n={3} gap={13} fill={c.ink} o={0.3} />
      {/* named humans, not stock photos — initials only */}
      <T x={556} y={104} font={c.bf} size={8} fill={c.ac} ls={2}>
        WHO YOU WORK WITH
      </T>
      {[
        ["AO", "Adaeze Okafor", "Strategy"],
        ["BN", "Bola Nwosu", "Transactions"],
        ["IE", "Ife Eze", "Governance"],
      ].map(([ini, name, role], i) => (
        <g key={name} transform={`translate(556 ${122 + i * 46})`}>
          <rect width={30} height={30} rx={1} fill={c.ac} fillOpacity={0.16} />
          <text
            x={15}
            y={20}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize={10}
            fontWeight={600}
            fill={c.ink}
          >
            {ini}
          </text>
          <text
            x={40}
            y={14}
            fontFamily={c.hf}
            fontSize={11}
            fontWeight={600}
            fill={c.ink}
          >
            {name}
          </text>
          <text x={40} y={27} fontFamily={c.bf} fontSize={8.5} fill={c.mu}>
            {role}
          </text>
        </g>
      ))}
      {/* fee table — the thing competitors hide */}
      <T x={48} y={288} font={c.bf} size={8} fill={c.ac} ls={2}>
        INDICATIVE FEES
      </T>
      <line
        x1={48}
        y1={300}
        x2={752}
        y2={300}
        stroke={c.ink}
        strokeOpacity={0.2}
      />
      {rows.map(([a, b, d], i) => (
        <g key={a}>
          <T
            x={48}
            y={326 + i * 40}
            font={c.hf}
            size={12}
            weight={600}
            fill={c.ink}
          >
            {a}
          </T>
          <T x={380} y={326 + i * 40} font={c.bf} size={9.5} fill={c.mu}>
            {b}
          </T>
          <T
            x={752}
            y={326 + i * 40}
            font={c.bf}
            size={10.5}
            fill={c.ink}
            anchor="end"
          >
            {d}
          </T>
          <line
            x1={48}
            y1={340 + i * 40}
            x2={752}
            y2={340 + i * 40}
            stroke={c.ink}
            strokeOpacity={0.1}
          />
        </g>
      ))}
      <T x={48} y={466} font={c.bf} size={9} fill={c.mu}>
        We decline work outside these three areas.
      </T>
    </Svg>
  );
}

/* 4. CONSTRUCTION — staged project timeline, the middle of the job shown */
export function FieldstoneBuild(p: Project) {
  const c = ctx(p.visual);
  const stages = ["SURVEY", "GROUNDWORK", "STRUCTURE", "FINISH"];
  return (
    <Svg label="Fieldstone Build — staged project timeline">
      <rect width="800" height="500" fill={c.bg} />
      {/* heavy site-signage header */}
      <Box x={0} y={0} w={800} h={54} fill={c.ink} />
      <T x={34} y={34} font={c.hf} size={17} weight={700} fill={c.ac} ls={1.2}>
        FIELDSTONE
      </T>
      <T x={560} y={33} font={c.bf} size={8.5} fill="#fff" o={0.8}>
        NIC EIC · CHAS · 0801 234 5678
      </T>
      <Box x={0} y={54} w={800} h={5} fill={c.ac} />
      <T x={34} y={92} font={c.bf} size={8} fill={c.mu} ls={2}>
        PROJECT 14 · LEKKI · 7 MONTHS
      </T>
      <Head
        x={34}
        y={104}
        w={420}
        h={60}
        font={c.hf}
        size={26}
        fill={c.ink}
        weight={700}
      >
        Four-bedroom rebuild, start to finish.
      </Head>
      {/* horizontal stage rail with photo per stage — chronology, not a gallery */}
      <line
        x1={34}
        y1={200}
        x2={766}
        y2={200}
        stroke={c.ink}
        strokeOpacity={0.2}
        strokeWidth={2}
      />
      {stages.map((s, i) => {
        const x = 34 + i * 190;
        const done = i < 3;
        return (
          <g key={s}>
            <rect
              x={x}
              y={192}
              width={16}
              height={16}
              fill={done ? c.ac : "transparent"}
              stroke={c.ink}
              strokeOpacity={0.4}
            />
            {done && (
              <path
                d={`M ${x + 3} 200 l 4 4 l 7 -8`}
                stroke={c.ink}
                strokeWidth={2}
                fill="none"
              />
            )}
            <T
              x={x}
              y={182}
              font={c.bf}
              size={8}
              fill={c.ink}
              ls={1.4}
              weight={700}
            >
              {s}
            </T>
            <Photo x={x} y={222} w={168} h={104} c={c} id={`fs${i}`} o={0.14} />
            <T x={x} y={344} font={c.bf} size={8.5} fill={c.mu}>
              {
                [
                  "Level survey, soil test",
                  "Footings poured, cured",
                  "Frame up, roof on",
                  "Second fix, snagging",
                ][i]
              }
            </T>
            <T x={x} y={360} font={c.bf} size={8} fill={c.ink} o={0.5}>
              {["Week 1–2", "Week 3–9", "Week 10–21", "Week 22–28"][i]}
            </T>
          </g>
        );
      })}
      {/* qualification bar, not a generic contact form */}
      <Box x={34} y={396} w={732} h={70} fill={c.ink} o={0.06} />
      <T x={52} y={422} font={c.hf} size={13} weight={700} fill={c.ink}>
        What stage is your project at?
      </T>
      {["Not started", "Drawings done", "On site"].map((s, i) => (
        <g key={s}>
          <rect
            x={52 + i * 118}
            y={432}
            width={106}
            height={22}
            rx={1}
            fill="#fff"
            stroke={c.ink}
            strokeOpacity={0.3}
          />
          <text
            x={105 + i * 118}
            y={447}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize={8.5}
            fill={c.ink}
          >
            {s}
          </text>
        </g>
      ))}
      <Btn
        x={620}
        y={428}
        w={128}
        h={28}
        label="Get a price"
        bg={c.ac}
        fg={c.ink}
        font={c.bf}
      />
    </Svg>
  );
}

/* 5. BEAUTY — concern chips → treatment, two booking paths */
export function LumaSkinStudio(p: Project) {
  const c = ctx(p.visual);
  const concerns = [
    "Acne scarring",
    "Pigmentation",
    "Fine lines",
    "Redness",
    "Texture",
    "Dullness",
  ];
  return (
    <Svg label="Luma Skin Studio — concern-led booking site">
      <rect width="800" height="500" fill={c.bg} />
      <T x={40} y={40} font={c.hf} size={16} weight={600} fill={c.ink} ls={2}>
        LUMA
      </T>
      {/* returning clients get a one-tap route in the header */}
      <Btn
        x={646}
        y={26}
        w={114}
        h={24}
        label="Book again"
        bg="transparent"
        fg={c.ink}
        font={c.bf}
        r={12}
      />
      <rect
        x={646}
        y={26}
        width={114}
        height={24}
        rx={12}
        fill="none"
        stroke={c.ink}
        strokeOpacity={0.35}
      />
      {/* new clients start from the problem, not the menu */}
      <T
        x={400}
        y={96}
        font={c.bf}
        size={8.5}
        fill={c.ac}
        anchor="middle"
        ls={2.4}
      >
        FIRST TIME HERE?
      </T>
      <Head
        x={200}
        y={110}
        w={400}
        h={70}
        font={c.hf}
        size={26}
        fill={c.ink}
        weight={600}
        align="center"
      >
        What's bothering you?
      </Head>
      {concerns.map((s, i) => {
        const col = i % 3,
          row = Math.floor(i / 3);
        const x = 214 + col * 128,
          y = 196 + row * 42;
        const on = i === 0;
        return (
          <g key={s}>
            <rect
              x={x}
              y={y}
              width={118}
              height={30}
              rx={15}
              fill={on ? c.ink : "#fff"}
              fillOpacity={on ? 1 : 0.8}
              stroke={c.ink}
              strokeOpacity={on ? 0 : 0.2}
            />
            <text
              x={x + 59}
              y={y + 19}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize={9}
              fill={on ? c.bg : c.ink}
            >
              {s}
            </text>
          </g>
        );
      })}
      {/* honest outcome range, not a before/after promise */}
      <Box x={140} y={296} w={520} h={110} fill="#fff" o={0.85} r={4} />
      <T x={166} y={324} font={c.bf} size={8} fill={c.ac} ls={2}>
        FOR ACNE SCARRING WE USUALLY SUGGEST
      </T>
      <T x={166} y={348} font={c.hf} size={16} weight={600} fill={c.ink}>
        Microneedling course
      </T>
      <T x={166} y={368} font={c.bf} size={9} fill={c.mu}>
        3–4 sessions, six weeks apart · from ₦65,000 per session
      </T>
      <T x={166} y={388} font={c.bf} size={9} fill={c.mu}>
        Most people see gradual change. Some see very little.
      </T>
      <Box x={140} y={296} w={4} h={110} fill={c.ac} />
      <Btn
        x={140}
        y={428}
        w={168}
        h={32}
        label="Book a consultation"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        r={16}
      />
      <T x={324} y={448} font={c.bf} size={9} fill={c.mu}>
        or read what the treatment involves →
      </T>
    </Svg>
  );
}

/* 6. EDUCATION — the IA forks at the first click and never merges */
export function OpenDoorLearning(p: Project) {
  const c = ctx(p.visual);
  const panel = (
    x: number,
    title: string,
    sub: string,
    items: string[],
    warm: boolean,
    id: string
  ) => (
    <g>
      <Box
        x={x}
        y={150}
        w={334}
        h={250}
        fill={warm ? c.ac : c.ink}
        o={warm ? 0.12 : 0.05}
        r={3}
      />
      <Box
        x={x}
        y={150}
        w={334}
        h={4}
        fill={warm ? c.ac : c.ink}
        o={warm ? 1 : 0.5}
      />
      <Photo x={x + 24} y={176} w={80} h={58} c={c} id={id} o={0.16} r={2} />
      <T x={x + 24} y={262} font={c.hf} size={19} weight={700} fill={c.ink}>
        {title}
      </T>
      <T x={x + 24} y={282} font={c.bf} size={9} fill={c.mu}>
        {sub}
      </T>
      {items.map((it, i) => (
        <g key={it}>
          <line
            x1={x + 24}
            y1={300 + i * 26}
            x2={x + 310}
            y2={300 + i * 26}
            stroke={c.ink}
            strokeOpacity={0.12}
          />
          <text
            x={x + 24}
            y={316 + i * 26}
            fontFamily={c.bf}
            fontSize={9}
            fill={c.ink}
            opacity={0.85}
          >
            {it}
          </text>
        </g>
      ))}
      <Btn
        x={x + 24}
        y={362}
        w={128}
        h={26}
        label="Start here"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
      />
    </g>
  );
  return (
    <Svg label="Open Door Learning — forked information architecture">
      <rect width="800" height="500" fill={c.bg} />
      <T x={40} y={42} font={c.hf} size={15} weight={700} fill={c.ink}>
        Open Door Learning
      </T>
      <T x={660} y={42} font={c.bf} size={8.5} fill={c.mu}>
        Term dates · Policies
      </T>
      <line
        x1={40}
        y1={58}
        x2={760}
        y2={58}
        stroke={c.ink}
        strokeOpacity={0.14}
      />
      <T
        x={400}
        y={100}
        font={c.bf}
        size={8.5}
        fill={c.ac}
        anchor="middle"
        ls={2.2}
      >
        TWO AUDIENCES, TWO PATHS
      </T>
      <Head
        x={220}
        y={110}
        w={360}
        h={44}
        font={c.hf}
        size={22}
        fill={c.ink}
        weight={600}
        align="center"
      >
        Who are you here for?
      </Head>
      {panel(
        40,
        "For parents",
        "Ages 4–16 · after school & Saturday",
        [
          "Safeguarding & staff ratios",
          "Term dates and pickup",
          "Fees per term",
        ],
        false,
        "od1"
      )}
      {panel(
        426,
        "For adults",
        "Evening & weekend courses",
        [
          "Cost and payment plans",
          "Timetable flexibility",
          "What the certificate means",
        ],
        true,
        "od2"
      )}
      <line
        x1={400}
        y1={170}
        x2={400}
        y2={380}
        stroke={c.ink}
        strokeOpacity={0.12}
        strokeDasharray="3 5"
      />
      <T x={400} y={434} font={c.bf} size={9} fill={c.mu} anchor="middle">
        Shared pages — safeguarding, the building, staff — appear in both paths,
        framed differently.
      </T>
      <T
        x={400}
        y={462}
        font={c.bf}
        size={8.5}
        fill={c.ink}
        anchor="middle"
        o={0.6}
      >
        Next intake: 12 January · Applications close 20 December
      </T>
    </Svg>
  );
}

/* 7. REAL ESTATE — split map / list, the Zillow–Redfin standard */
export function HarbourAndHome(p: Project) {
  const c = ctx(p.visual);
  const lifestyle = [
    "Walkable",
    "Quiet street",
    "Room to work",
    "Near schools",
  ];
  const listings: [string, string, string][] = [
    ["₦185m", "Ikoyi · 4 bed · 3 bath", "Walk to market 6 min"],
    ["₦96m", "Yaba · 3 bed · 2 bath", "Quiet cul-de-sac"],
    ["₦240m", "Lekki Ph 1 · 5 bed · 4 bath", "Outbuilding / studio"],
  ];
  return (
    <Svg label="Harbour & Home — split map and list property search">
      <rect width="800" height="500" fill={c.bg} />
      <T x={28} y={34} font={c.hf} size={14} weight={600} fill={c.ink}>
        Harbour &amp; Home
      </T>
      {/* lifestyle entry points instead of four numeric filters */}
      {lifestyle.map((s, i) => (
        <g key={s}>
          <rect
            x={200 + i * 104}
            y={20}
            width={96}
            height={22}
            rx={11}
            fill={i === 0 ? c.ink : "transparent"}
            stroke={c.ink}
            strokeOpacity={i === 0 ? 0 : 0.25}
          />
          <text
            x={248 + i * 104}
            y={35}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize={8}
            fill={i === 0 ? c.bg : c.ink}
          >
            {s}
          </text>
        </g>
      ))}
      <line
        x1={0}
        y1={56}
        x2={800}
        y2={56}
        stroke={c.ink}
        strokeOpacity={0.14}
      />
      {/* LEFT: list column */}
      <T x={28} y={80} font={c.bf} size={8} fill={c.mu} ls={1.6}>
        34 HOMES · WALKABLE
      </T>
      {listings.map(([price, spec, note], i) => (
        <g key={price} transform={`translate(28 ${94 + i * 126})`}>
          <Box x={0} y={0} w={372} h={112} fill="#fff" o={0.9} r={3} />
          <Photo
            x={0}
            y={0}
            w={148}
            h={112}
            c={c}
            id={`hh${i}`}
            o={0.18}
            r={3}
          />
          <rect
            x={8}
            y={8}
            width={52}
            height={15}
            rx={2}
            fill={c.ink}
            fillOpacity={0.85}
          />
          <text
            x={34}
            y={19}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize={7.5}
            fill={c.bg}
          >
            {i === 0 ? "NEW" : "VIEWING"}
          </text>
          <text
            x={166}
            y={32}
            fontFamily={c.hf}
            fontSize={17}
            fontWeight={600}
            fill={c.ink}
          >
            {price}
          </text>
          <text x={166} y={52} fontFamily={c.bf} fontSize={9} fill={c.mu}>
            {spec}
          </text>
          <line
            x1={166}
            y1={66}
            x2={356}
            y2={66}
            stroke={c.ink}
            strokeOpacity={0.1}
          />
          <text x={166} y={84} fontFamily={c.bf} fontSize={8.5} fill={c.ac}>
            {note}
          </text>
          <text
            x={166}
            y={100}
            fontFamily={c.bf}
            fontSize={8}
            fill={c.ink}
            opacity={0.5}
          >
            Travel to CBD · 22 min
          </text>
        </g>
      ))}
      {/* RIGHT: persistent map */}
      <Box x={420} y={68} w={352} h={404} fill={c.ink} o={0.07} r={3} />
      {[
        [70, 60],
        [150, 130],
        [240, 96],
        [110, 250],
        [260, 300],
        [180, 360],
        [300, 200],
      ].map(([dx, dy], i) => (
        <g key={i}>
          <line
            x1={420}
            y1={68 + dy}
            x2={772}
            y2={68 + dy}
            stroke={c.ink}
            strokeOpacity={0.05}
          />
          <circle
            cx={420 + dx}
            cy={68 + dy}
            r={i < 3 ? 13 : 5}
            fill={i < 3 ? c.ac : c.ink}
            fillOpacity={i < 3 ? 0.9 : 0.3}
          />
          {i < 3 && (
            <text
              x={420 + dx}
              y={72 + dy}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize={7.5}
              fontWeight={700}
              fill="#fff"
            >
              {["185", "96", "240"][i]}
            </text>
          )}
        </g>
      ))}
      <Box x={436} y={432} w={120} h={24} fill="#fff" o={0.95} r={2} />
      <T x={452} y={448} font={c.bf} size={8.5} fill={c.ink}>
        Draw your own area
      </T>
    </Svg>
  );
}
