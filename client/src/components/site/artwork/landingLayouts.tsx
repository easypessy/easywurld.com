import type { Project } from "@/data";
import { Box, Btn, Head, Photo, Svg, T, TextLines, ctx } from "./primitives";

/* =========================================================================
   Seven landing pages. A single-offer preorder page and a B2B SaaS page
   share almost no anatomy, so these share almost no anatomy either.
   ========================================================================= */

/* 1. SUNDAY TABLE — one offer, one column, countdown, no nav at all */
export function SundayTable(p: Project) {
  const c = ctx(p.visual);
  return (
    <Svg label="The Sunday Table — single-offer preorder page">
      <rect width="800" height="500" fill={c.bg} />
      {/* deliberately no navigation: nothing to click but the one action */}
      <Box x={0} y={0} w={800} h={34} fill={c.ink} />
      <T
        x={400}
        y={22}
        font={c.bf}
        size={9}
        fill={c.bg}
        anchor="middle"
        ls={1.2}
      >
        Orders close Friday 6pm · 41 of 60 boxes left
      </T>
      <Photo x={230} y={62} w={340} h={150} c={c} id="st1" o={0.2} r={3} />
      <T
        x={400}
        y={248}
        font={c.bf}
        size={8}
        fill={c.ac}
        anchor="middle"
        ls={2.6}
      >
        SUNDAY 14 · ONE SITTING
      </T>
      <Head
        x={180}
        y={260}
        w={440}
        h={80}
        font={c.hf}
        size={30}
        fill={c.ink}
        weight={600}
        align="center"
        lh={1.1}
      >
        Six dishes, cooked once a week.
      </Head>
      <T x={400} y={356} font={c.bf} size={10} fill={c.mu} anchor="middle">
        ₦18,500 for two · collect from Yaba between 4 and 7pm
      </T>
      <Btn
        x={300}
        y={378}
        w={200}
        h={40}
        label="Reserve a box"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        size={11}
        r={3}
      />
      <T x={400} y={434} font={c.bf} size={8.5} fill={c.mu} anchor="middle">
        No account. Pay on collection. Cancel by Friday.
      </T>
      {/* countdown as the only secondary element */}
      {["02", "11", "36"].map((n, i) => (
        <g key={i}>
          <text
            x={340 + i * 60}
            y={468}
            textAnchor="middle"
            fontFamily={c.hf}
            fontSize={15}
            fontWeight={700}
            fill={c.ink}
            opacity={0.75}
          >
            {n}
          </text>
          <text
            x={340 + i * 60}
            y={482}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize={7}
            fill={c.mu}
            letterSpacing={1.4}
          >
            {["DAYS", "HRS", "MIN"][i]}
          </text>
        </g>
      ))}
    </Svg>
  );
}

/* 2. QUIET HOURS — objection sequence first, form arrives last, no urgency */
export function QuietHours(p: Project) {
  const c = ctx(p.visual);
  const qs: [string, string][] = [
    [
      "Will I have to talk about it?",
      "Only as much as you want to. Sessions can be mostly silence.",
    ],
    [
      "What if it isn't for me?",
      "Stop after one. There's no package and no cancellation fee.",
    ],
    [
      "Is it confidential?",
      "Yes, with the legal exceptions listed on the ethics page.",
    ],
  ];
  return (
    <Svg label="Quiet Hours — objection-led consultation page">
      <rect width="800" height="500" fill={c.bg} />
      <T x={60} y={44} font={c.hf} size={14} weight={500} fill={c.ink} ls={0.6}>
        Quiet Hours
      </T>
      {/* calm, low-contrast, generous — the opposite of a conversion page */}
      <Head
        x={60}
        y={82}
        w={440}
        h={96}
        font={c.hf}
        size={27}
        fill={c.ink}
        weight={500}
        lh={1.22}
      >
        You don't have to be in crisis to talk to someone.
      </Head>
      <TextLines x={60} y={196} w={400} n={3} gap={14} fill={c.ink} o={0.24} />
      <line
        x1={60}
        y1={256}
        x2={500}
        y2={256}
        stroke={c.ink}
        strokeOpacity={0.14}
      />
      {qs.map(([q, a], i) => (
        <g key={q}>
          <T
            x={60}
            y={288 + i * 62}
            font={c.hf}
            size={13}
            weight={600}
            fill={c.ink}
          >
            {q}
          </T>
          <T x={60} y={308 + i * 62} font={c.bf} size={9} fill={c.mu}>
            {a}
          </T>
        </g>
      ))}
      <T x={60} y={472} font={c.bf} size={9} fill={c.ink} o={0.55}>
        Registered with the national counselling body · reg. 44182
      </T>
      {/* the form is a quiet sidebar, deliberately not the hero */}
      <Box x={548} y={82} w={200} h={300} fill={c.ink} o={0.05} r={4} />
      <T x={572} y={116} font={c.bf} size={8} fill={c.ac} ls={1.8}>
        WHEN YOU'RE READY
      </T>
      {["Your name", "Email or phone", "Best time to reach you"].map((l, i) => (
        <g key={l}>
          <text
            x={572}
            y={146 + i * 54}
            fontFamily={c.bf}
            fontSize={8.5}
            fill={c.mu}
          >
            {l}
          </text>
          <rect
            x={572}
            y={154 + i * 54}
            width={152}
            height={26}
            rx={2}
            fill="#fff"
            fillOpacity={0.8}
            stroke={c.ink}
            strokeOpacity={0.14}
          />
        </g>
      ))}
      <Btn
        x={572}
        y={318}
        w={152}
        h={32}
        label="Ask a question"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        r={3}
      />
      <T x={648} y={368} font={c.bf} size={8} fill={c.mu} anchor="middle">
        Replies within two days.
      </T>
    </Svg>
  );
}

/* 3. ATLAS CRM — the full seven-layer B2B SaaS anatomy, compressed */
export function AtlasCRM(p: Project) {
  const c = ctx(p.visual);
  return (
    <Svg label="Atlas CRM — seven-layer SaaS landing page">
      <rect width="800" height="500" fill={c.bg} />
      {/* 1. stripped header: logo + one CTA, no nav links */}
      <T x={40} y={32} font={c.hf} size={13} weight={700} fill={c.ink}>
        ATLAS
      </T>
      <Btn
        x={676}
        y={18}
        w={84}
        h={22}
        label="Start free"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        size={8.5}
        r={3}
      />
      {/* 2. hero: headline, sub, CTA, product shot — all above the fold */}
      <Head
        x={40}
        y={64}
        w={330}
        h={76}
        font={c.hf}
        size={25}
        fill={c.ink}
        weight={700}
        lh={1.12}
      >
        Every deal, one pipeline, no spreadsheets.
      </Head>
      <T x={40} y={158} font={c.bf} size={9.5} fill={c.mu}>
        Built for teams of 2 to 20. Set up in an afternoon.
      </T>
      <Btn
        x={40}
        y={176}
        w={118}
        h={30}
        label="Start free trial"
        bg={c.ac}
        fg="#fff"
        font={c.bf}
        r={3}
      />
      <T x={170} y={196} font={c.bf} size={8.5} fill={c.mu}>
        No credit card required
      </T>
      {/* product screenshot: kanban, clearly a real UI */}
      <Box x={400} y={64} w={360} h={160} fill="#fff" o={0.92} r={4} />
      <Box x={400} y={64} w={360} h={18} fill={c.ink} o={0.08} r={4} />
      {[0, 1, 2].map(col => (
        <g key={col}>
          <Box
            x={412 + col * 116}
            y={92}
            w={104}
            h={122}
            fill={c.ink}
            o={0.04}
            r={2}
          />
          <T
            x={420 + col * 116}
            y={106}
            font={c.bf}
            size={7}
            fill={c.mu}
            ls={1}
          >
            {["NEW", "IN TALKS", "WON"][col]}
          </T>
          {[0, 1, 2].map(r => (
            <g key={r}>
              <rect
                x={418 + col * 116}
                y={112 + r * 32}
                width={92}
                height={26}
                rx={2}
                fill="#fff"
                stroke={c.ink}
                strokeOpacity={0.1}
              />
              <rect
                x={424 + col * 116}
                y={119 + r * 32}
                width={52}
                height={3}
                rx={1.5}
                fill={c.ink}
                fillOpacity={0.3}
              />
              <rect
                x={424 + col * 116}
                y={127 + r * 32}
                width={30}
                height={3}
                rx={1.5}
                fill={col === 2 ? c.ac : c.ink}
                fillOpacity={col === 2 ? 0.8 : 0.16}
              />
            </g>
          ))}
        </g>
      ))}
      {/* 3. social-proof bar — anonymised, no invented logos */}
      <line
        x1={40}
        y1={244}
        x2={760}
        y2={244}
        stroke={c.ink}
        strokeOpacity={0.12}
      />
      <T x={40} y={266} font={c.bf} size={8} fill={c.mu} ls={1.6}>
        SPECULATIVE CONCEPT — NO CLIENT LOGOS SHOWN
      </T>
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={430 + i * 84}
          y={256}
          width={62}
          height={12}
          rx={2}
          fill={c.ink}
          fillOpacity={0.1}
        />
      ))}
      {/* 4 + 5. benefits then verb-led steps */}
      {[
        "Stop losing follow-ups",
        "See the week ahead",
        "Quote in two clicks",
      ].map((b, i) => (
        <g key={b}>
          <rect
            x={40 + i * 180}
            y={292}
            width={16}
            height={16}
            rx={8}
            fill={c.ac}
            fillOpacity={0.2}
          />
          <text
            x={64 + i * 180}
            y={304}
            fontFamily={c.hf}
            fontSize={11}
            fontWeight={600}
            fill={c.ink}
          >
            {b}
          </text>
          <rect
            x={64 + i * 180}
            y={314}
            width={130}
            height={3}
            rx={1.5}
            fill={c.ink}
            fillOpacity={0.18}
          />
          <rect
            x={64 + i * 180}
            y={322}
            width={96}
            height={3}
            rx={1.5}
            fill={c.ink}
            fillOpacity={0.18}
          />
        </g>
      ))}
      {/* 6. three pricing tiers, middle one lifted */}
      {[
        ["Solo", "₦0"],
        ["Team", "₦14k/mo"],
        ["Scale", "₦38k/mo"],
      ].map(([n, pr], i) => {
        const hi = i === 1;
        return (
          <g key={n}>
            <rect
              x={40 + i * 128}
              y={hi ? 348 : 356}
              width={116}
              height={hi ? 108 : 92}
              rx={3}
              fill={hi ? c.ink : "#fff"}
              fillOpacity={hi ? 1 : 0.85}
              stroke={c.ink}
              strokeOpacity={hi ? 0 : 0.12}
            />
            <text
              x={56 + i * 128}
              y={hi ? 372 : 378}
              fontFamily={c.bf}
              fontSize={8.5}
              fill={hi ? c.bg : c.mu}
              letterSpacing={1.2}
            >
              {n.toUpperCase()}
            </text>
            <text
              x={56 + i * 128}
              y={hi ? 398 : 402}
              fontFamily={c.hf}
              fontSize={16}
              fontWeight={700}
              fill={hi ? c.bg : c.ink}
            >
              {pr}
            </text>
            <rect
              x={56 + i * 128}
              y={hi ? 416 : 418}
              width={70}
              height={3}
              rx={1.5}
              fill={hi ? c.bg : c.ink}
              fillOpacity={0.3}
            />
            <rect
              x={56 + i * 128}
              y={hi ? 426 : 428}
              width={52}
              height={3}
              rx={1.5}
              fill={hi ? c.bg : c.ink}
              fillOpacity={0.3}
            />
          </g>
        );
      })}
      {/* 7. mirrored footer CTA */}
      <Box x={448} y={348} w={312} h={108} fill={c.ac} o={0.12} r={3} />
      <T x={472} y={382} font={c.hf} size={15} weight={700} fill={c.ink}>
        Try it on this week's deals.
      </T>
      <T x={472} y={402} font={c.bf} size={9} fill={c.mu}>
        14 days, all features, no card.
      </T>
      <Btn
        x={472}
        y={416}
        w={116}
        h={28}
        label="Start free"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        r={3}
      />
    </Svg>
  );
}

/* 4. BRIGHTLINE — outcome modules + a real time commitment table */
export function Brightline(p: Project) {
  const c = ctx(p.visual);
  const weeks: [string, string, string][] = [
    ["Week 1", "Find your actual bottleneck", "2 hrs"],
    ["Week 2", "Build one repeatable offer", "3 hrs"],
    ["Week 3", "Write the follow-up sequence", "2 hrs"],
    ["Week 4", "Run it, then cut what failed", "2 hrs"],
  ];
  return (
    <Svg label="Brightline — course launch page with time commitment table">
      <rect width="800" height="500" fill={c.bg} />
      <Box x={0} y={0} w={264} h={500} fill={c.ink} />
      {/* left rail: the pitch, dark and quiet */}
      <T x={32} y={54} font={c.hf} size={14} weight={700} fill={c.ac}>
        BRIGHTLINE
      </T>
      <Head
        x={32}
        y={88}
        w={200}
        h={120}
        font={c.hf}
        size={23}
        fill={c.bg}
        weight={600}
        lh={1.15}
      >
        Four weeks. Nine hours total.
      </Head>
      <TextLines x={32} y={228} w={196} n={4} gap={13} fill={c.bg} o={0.3} />
      <Box x={32} y={306} w={200} h={1} fill={c.bg} o={0.25} />
      <T x={32} y={336} font={c.bf} size={8} fill={c.bg} o={0.6} ls={1.6}>
        STARTS 6 OCTOBER
      </T>
      <T x={32} y={366} font={c.hf} size={22} weight={700} fill={c.bg}>
        ₦72,000
      </T>
      <T x={32} y={386} font={c.bf} size={8.5} fill={c.bg} o={0.55}>
        or three payments of ₦26,000
      </T>
      <Btn
        x={32}
        y={408}
        w={200}
        h={36}
        label="Join the October cohort"
        bg={c.ac}
        fg={c.ink}
        font={c.bf}
        size={9.5}
        r={3}
      />
      <T x={32} y={466} font={c.bf} size={8} fill={c.bg} o={0.45}>
        Concept project · no student results claimed
      </T>
      {/* right: week-by-week table, the honest part */}
      <T x={300} y={58} font={c.bf} size={8} fill={c.ac} ls={2}>
        WHAT YOU ACTUALLY DO
      </T>
      <line
        x1={300}
        y1={72}
        x2={764}
        y2={72}
        stroke={c.ink}
        strokeOpacity={0.18}
      />
      {weeks.map(([w, t, h], i) => (
        <g key={w}>
          <T
            x={300}
            y={104 + i * 62}
            font={c.bf}
            size={8.5}
            fill={c.mu}
            ls={1.2}
          >
            {w.toUpperCase()}
          </T>
          <T
            x={300}
            y={126 + i * 62}
            font={c.hf}
            size={14}
            weight={600}
            fill={c.ink}
          >
            {t}
          </T>
          <T
            x={764}
            y={126 + i * 62}
            font={c.bf}
            size={10}
            fill={c.ac}
            anchor="end"
          >
            {h}
          </T>
          <line
            x1={300}
            y1={144 + i * 62}
            x2={764}
            y2={144 + i * 62}
            stroke={c.ink}
            strokeOpacity={0.1}
          />
        </g>
      ))}
      <Box x={300} y={368} w={464} h={96} fill={c.ac} o={0.1} r={3} />
      <T x={322} y={396} font={c.hf} size={13} weight={600} fill={c.ink}>
        This is wrong for you if…
      </T>
      {[
        "you want a certificate",
        "you can't give it two hours a week",
        "you have no offer yet",
      ].map((s, i) => (
        <text
          key={s}
          x={322}
          y={418 + i * 16}
          fontFamily={c.bf}
          fontSize={9}
          fill={c.mu}
        >
          · {s}
        </text>
      ))}
    </Svg>
  );
}

/* 5. HOMEBASE WORKSHOP — event decision blocks, 3-field form, static map */
export function HomebaseWorkshop(p: Project) {
  const c = ctx(p.visual);
  const facts: [string, string][] = [
    ["DATE", "Sat 18 Oct, 10am–1pm"],
    ["PLACE", "Alara, 12A Akin Olugbade"],
    ["COST", "Free · 24 seats"],
    ["CHILDCARE", "Yes, under 8s"],
    ["PARKING", "On-site, free"],
    ["BRING", "Nothing"],
  ];
  return (
    <Svg label="Homebase Workshop — event page with decision blocks">
      <rect width="800" height="500" fill={c.bg} />
      <Head
        x={40}
        y={40}
        w={420}
        h={80}
        font={c.hf}
        size={26}
        fill={c.ink}
        weight={700}
        lh={1.12}
      >
        A free Saturday morning on fixing your own house.
      </Head>
      {/* the six questions people actually need answered, as a grid */}
      {facts.map(([k, v], i) => {
        const col = i % 3,
          row = Math.floor(i / 3);
        const x = 40 + col * 164,
          y = 146 + row * 84;
        return (
          <g key={k}>
            <Box x={x} y={y} w={152} h={72} fill={c.ink} o={0.05} r={2} />
            <Box x={x} y={y} w={152} h={2.5} fill={c.ac} />
            <T
              x={x + 14}
              y={y + 24}
              font={c.bf}
              size={7.5}
              fill={c.ac}
              ls={1.8}
            >
              {k}
            </T>
            <foreignObject x={x + 14} y={y + 32} width={126} height={36}>
              <div
                style={{
                  fontFamily: c.hf,
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: c.ink,
                  lineHeight: 1.25,
                }}
              >
                {v}
              </div>
            </foreignObject>
          </g>
        );
      })}
      {/* three fields only */}
      <T x={40} y={336} font={c.bf} size={8} fill={c.ac} ls={2}>
        CLAIM A SEAT · 3 FIELDS
      </T>
      {["Name", "Phone", "Anything broken at home?"].map((l, i) => (
        <g key={l}>
          <rect
            x={40}
            y={348 + i * 38}
            width={300}
            height={28}
            rx={2}
            fill="#fff"
            stroke={c.ink}
            strokeOpacity={0.16}
          />
          <text
            x={52}
            y={366 + i * 38}
            fontFamily={c.bf}
            fontSize={9}
            fill={c.mu}
          >
            {l}
          </text>
        </g>
      ))}
      <Btn
        x={40}
        y={464}
        w={300}
        h={30}
        label="Save my seat"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        r={2}
      />
      {/* static map + door photo, because it's a physical event */}
      <Box x={488} y={146} w={272} h={200} fill={c.ink} o={0.07} r={2} />
      {[
        [40, 50],
        [130, 92],
        [200, 40],
        [80, 150],
        [190, 160],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={488 + dx}
          cy={146 + dy}
          r={3}
          fill={c.ink}
          fillOpacity={0.25}
        />
      ))}
      <path
        d="M 488 246 L 760 246 M 596 146 L 596 346"
        stroke={c.ink}
        strokeOpacity={0.12}
        strokeWidth={6}
      />
      <circle cx={624} cy={250} r={9} fill={c.ac} />
      <circle cx={624} cy={250} r={18} fill={c.ac} fillOpacity={0.2} />
      <Photo x={488} y={360} w={272} h={100} c={c} id="hb1" o={0.16} r={2} />
      <T x={488} y={480} font={c.bf} size={8.5} fill={c.mu}>
        The blue door on the left. Ring once.
      </T>
    </Svg>
  );
}

/* 6. ASTER — narrative scroll, oversized type, floor plan, spec last */
export function AsterProperty(p: Project) {
  const c = ctx(p.visual);
  return (
    <Svg label="Aster Property — single-property narrative page">
      <rect width="800" height="500" fill={c.bg} />
      <Photo x={0} y={0} w={800} h={214} c={c} id="as1" o={0.2} />
      <T x={40} y={38} font={c.bf} size={8.5} fill={c.ink} ls={2.6} o={0.8}>
        ASTER · ONE HOUSE AT A TIME
      </T>
      {/* oversized editorial statement, price withheld until the end */}
      <Head
        x={40}
        y={244}
        w={470}
        h={110}
        font={c.hf}
        size={36}
        fill={c.ink}
        weight={500}
        lh={1.06}
      >
        Built in 1954 and barely touched since.
      </Head>
      <TextLines x={40} y={370} w={420} n={4} gap={14} fill={c.ink} o={0.26} />
      {/* floor plan drawn as a plan, not a photo */}
      <g transform="translate(556 240)">
        <rect
          width={204}
          height={150}
          fill="none"
          stroke={c.ink}
          strokeOpacity={0.45}
          strokeWidth={1.6}
        />
        <line
          x1={0}
          y1={64}
          x2={122}
          y2={64}
          stroke={c.ink}
          strokeOpacity={0.45}
          strokeWidth={1.6}
        />
        <line
          x1={122}
          y1={0}
          x2={122}
          y2={150}
          stroke={c.ink}
          strokeOpacity={0.45}
          strokeWidth={1.6}
        />
        <line
          x1={122}
          y1={96}
          x2={204}
          y2={96}
          stroke={c.ink}
          strokeOpacity={0.45}
          strokeWidth={1.6}
        />
        <rect x={50} y={62} width={22} height={4} fill={c.bg} />
        <rect x={120} y={30} width={4} height={22} fill={c.bg} />
        <text x={12} y={26} fontFamily={c.bf} fontSize={7.5} fill={c.mu}>
          KITCHEN
        </text>
        <text x={12} y={96} fontFamily={c.bf} fontSize={7.5} fill={c.mu}>
          SITTING
        </text>
        <text x={134} y={26} fontFamily={c.bf} fontSize={7.5} fill={c.mu}>
          BED 1
        </text>
        <text x={134} y={122} fontFamily={c.bf} fontSize={7.5} fill={c.mu}>
          BED 2
        </text>
        <text
          x={0}
          y={168}
          fontFamily={c.bf}
          fontSize={7.5}
          fill={c.ac}
          letterSpacing={1.4}
        >
          GROUND FLOOR · 142 SQM
        </text>
      </g>
      {/* spec strip arrives only at the bottom */}
      <line
        x1={40}
        y1={440}
        x2={760}
        y2={440}
        stroke={c.ink}
        strokeOpacity={0.16}
      />
      {[
        ["Guide", "₦148m"],
        ["Beds", "4"],
        ["Plot", "0.3 acre"],
        ["Tenure", "Freehold"],
      ].map(([k, v], i) => (
        <g key={k}>
          <text
            x={40 + i * 150}
            y={462}
            fontFamily={c.bf}
            fontSize={7.5}
            fill={c.mu}
            letterSpacing={1.6}
          >
            {k.toUpperCase()}
          </text>
          <text
            x={40 + i * 150}
            y={482}
            fontFamily={c.hf}
            fontSize={14}
            fontWeight={600}
            fill={c.ink}
          >
            {v}
          </text>
        </g>
      ))}
      <Btn
        x={632}
        y={452}
        w={128}
        h={30}
        label="Arrange a viewing"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        size={8.5}
        r={2}
      />
    </Svg>
  );
}

/* 7. FIRST STEP FINANCE — progressive 4-step form, eligibility before contact */
export function FirstStepFinance(p: Project) {
  const c = ctx(p.visual);
  const steps = ["Amount", "Purpose", "Eligibility", "Contact"];
  return (
    <Svg label="First Step Finance — progressive eligibility form">
      <rect width="800" height="500" fill={c.bg} />
      <Box x={0} y={0} w={800} h={44} fill={c.ink} />
      <T x={32} y={28} font={c.hf} size={13} weight={700} fill={c.bg}>
        First Step Finance
      </T>
      <T x={768} y={28} font={c.bf} size={8.5} fill={c.bg} o={0.7} anchor="end">
        Regulated · we never sell your data
      </T>
      {/* progress rail: contact is step 4, not step 1 */}
      {steps.map((s, i) => {
        const x = 60 + i * 178;
        const state = i < 1 ? "done" : i === 1 ? "now" : "todo";
        return (
          <g key={s}>
            {i < 3 && (
              <line
                x1={x + 16}
                y1={84}
                x2={x + 162}
                y2={84}
                stroke={state === "todo" ? c.ink : c.ac}
                strokeOpacity={state === "todo" ? 0.15 : 0.6}
                strokeWidth={2}
              />
            )}
            <circle
              cx={x}
              cy={84}
              r={13}
              fill={state === "todo" ? "transparent" : c.ac}
              fillOpacity={state === "now" ? 1 : 0.35}
              stroke={c.ink}
              strokeOpacity={state === "todo" ? 0.25 : 0}
            />
            <text
              x={x}
              y={88}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize={9}
              fontWeight={700}
              fill={state === "todo" ? c.mu : c.ink}
            >
              {i + 1}
            </text>
            <text
              x={x}
              y={112}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize={8.5}
              fill={state === "now" ? c.ink : c.mu}
            >
              {s}
            </text>
          </g>
        );
      })}
      {/* the current step, alone on the page */}
      <Box x={60} y={146} w={440} h={244} fill="#fff" o={0.9} r={4} />
      <T x={88} y={182} font={c.bf} size={8} fill={c.ac} ls={2}>
        STEP 2 OF 4
      </T>
      <T x={88} y={210} font={c.hf} size={19} weight={600} fill={c.ink}>
        What's the money for?
      </T>
      {[
        "Stock or equipment",
        "Covering a slow month",
        "Hiring someone",
        "Something else",
      ].map((o, i) => {
        const on = i === 1;
        return (
          <g key={o}>
            <rect
              x={88}
              y={230 + i * 38}
              width={384}
              height={30}
              rx={2}
              fill={on ? c.ac : "transparent"}
              fillOpacity={on ? 0.14 : 1}
              stroke={c.ink}
              strokeOpacity={on ? 0.3 : 0.12}
            />
            <circle
              cx={106}
              cy={245 + i * 38}
              r={5.5}
              fill="none"
              stroke={c.ink}
              strokeOpacity={0.4}
            />
            {on && <circle cx={106} cy={245 + i * 38} r={3} fill={c.ac} />}
            <text
              x={122}
              y={249 + i * 38}
              fontFamily={c.bf}
              fontSize={9.5}
              fill={c.ink}
            >
              {o}
            </text>
          </g>
        );
      })}
      <Btn
        x={60}
        y={410}
        w={140}
        h={34}
        label="Continue"
        bg={c.ink}
        fg={c.bg}
        font={c.bf}
        r={2}
      />
      <T x={216} y={432} font={c.bf} size={8.5} fill={c.mu}>
        Back · Takes about 90 seconds
      </T>
      {/* honest reassurance column instead of testimonials */}
      <T x={540} y={182} font={c.bf} size={8} fill={c.ac} ls={2}>
        BEFORE YOU START
      </T>
      {[
        ["No credit check yet", "Nothing here touches your score."],
        ["No phone calls", "We only ring if you ask us to."],
        [
          "You'll see a decision range",
          "Not a yes/no. A range, with the rate.",
        ],
      ].map(([h, s], i) => (
        <g key={h}>
          <line
            x1={540}
            y1={200 + i * 70}
            x2={760}
            y2={200 + i * 70}
            stroke={c.ink}
            strokeOpacity={0.12}
          />
          <text
            x={540}
            y={224 + i * 70}
            fontFamily={c.hf}
            fontSize={12}
            fontWeight={600}
            fill={c.ink}
          >
            {h}
          </text>
          <foreignObject x={540} y={230 + i * 70} width={220} height={40}>
            <div
              style={{
                fontFamily: c.bf,
                fontSize: "9px",
                color: c.mu,
                lineHeight: 1.45,
              }}
            >
              {s}
            </div>
          </foreignObject>
        </g>
      ))}
      <T x={540} y={432} font={c.bf} size={8} fill={c.mu}>
        Sample project. No lender partnerships implied.
      </T>
    </Svg>
  );
}
