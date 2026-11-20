import type { ReactElement } from "react";
import type { Project, Visual } from "@/data";

/**
 * Every project renders its own artwork from its `visual` tokens.
 * Eight archetypes × four variants × per-project palette and type =
 * no two case studies share a composition.
 *
 * These are deliberately drawn as mockups, not passed off as photographs.
 */

type P = { v: Visual; title: string };

const R = (v: Visual) => ({
  bg: v.bg,
  ink: v.ink,
  ac: v.accent,
  mu: v.muted,
  hf: v.head,
  bf: v.body,
});

/* ---------- shared atoms ---------- */
function Bar({ x, y, w, h, fill, o = 1, r = 0 }: any) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} opacity={o} />
  );
}
function Lines({ x, y, w, n, gap = 9, fill, o = 0.28, last = 0.6 }: any) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * gap}
          width={i === n - 1 ? w * last : w}
          height={3.5}
          rx={1.75}
          fill={fill}
          opacity={o}
        />
      ))}
    </>
  );
}

/* ---------- 1. WEBSITE : desktop frame + phone ---------- */
function Website({ v, title }: P) {
  const c = R(v);
  const hero = v.variant % 2 === 0;
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — website mockup`}
    >
      <rect width="800" height="500" fill={c.bg} />
      {/* browser */}
      <g>
        <Bar x={40} y={40} w={600} h={400} fill="#fff" o={0.85} r={6} />
        <Bar x={40} y={40} w={600} h={26} fill={c.ink} o={0.07} r={6} />
        {[0, 1, 2].map(i => (
          <circle
            key={i}
            cx={56 + i * 12}
            cy={53}
            r={3.5}
            fill={c.ink}
            opacity={0.22}
          />
        ))}
        {/* nav */}
        <text
          x={62}
          y={92}
          fontFamily={c.hf}
          fontSize="13"
          fontWeight="700"
          fill={c.ink}
          letterSpacing="0.5"
        >
          {v.words[0]}
        </text>
        {v.words.slice(1, 4).map((w, i) => (
          <text
            key={i}
            x={380 + i * 82}
            y={92}
            fontFamily={c.bf}
            fontSize="9"
            fill={c.mu}
          >
            {w}
          </text>
        ))}
        <line
          x1={62}
          y1={104}
          x2={618}
          y2={104}
          stroke={c.ink}
          strokeOpacity="0.1"
        />
        {hero ? (
          <>
            <Bar x={62} y={122} w={260} h={190} fill={c.ac} o={0.16} r={3} />
            <Bar x={338} y={122} w={280} h={90} fill={c.ink} o={0.07} r={3} />
            <text
              x={62}
              y={352}
              fontFamily={c.hf}
              fontSize="27"
              fontWeight="700"
              fill={c.ink}
            >
              {title.length > 18 ? title.slice(0, 18) : title}
            </text>
            <Lines x={62} y={368} w={300} n={3} fill={c.ink} />
            <Bar x={62} y={406} w={104} h={22} fill={c.ink} r={2} />
          </>
        ) : (
          <>
            <Bar x={62} y={122} w={556} h={150} fill={c.ac} o={0.18} r={3} />
            <text
              x={80}
              y={200}
              fontFamily={c.hf}
              fontSize="25"
              fontWeight="700"
              fill={c.ink}
            >
              {title.length > 22 ? title.slice(0, 22) : title}
            </text>
            {[0, 1, 2].map(i => (
              <g key={i}>
                <Bar
                  x={62 + i * 190}
                  y={292}
                  w={172}
                  h={78}
                  fill={c.ink}
                  o={0.06}
                  r={3}
                />
                <Lines x={62 + i * 190} y={384} w={150} n={2} fill={c.ink} />
              </g>
            ))}
          </>
        )}
      </g>
      {/* phone */}
      <g transform="translate(662 130)">
        <Bar x={0} y={0} w={104} h={210} fill="#fff" o={0.95} r={12} />
        <rect
          x={0}
          y={0}
          width={104}
          height={210}
          rx={12}
          fill="none"
          stroke={c.ink}
          strokeOpacity="0.14"
        />
        <Bar x={38} y={7} w={28} h={4} fill={c.ink} o={0.2} r={2} />
        <Bar x={10} y={22} w={84} h={56} fill={c.ac} o={0.2} r={3} />
        <Lines x={10} y={88} w={84} n={4} gap={8} fill={c.ink} />
        <Bar x={10} y={130} w={52} h={13} fill={c.ink} r={2} />
        <Bar x={10} y={156} w={84} h={40} fill={c.ink} o={0.06} r={3} />
      </g>
    </svg>
  );
}

/* ---------- 2. LANDING : single column, section stack ---------- */
function Landing({ v, title }: P) {
  const c = R(v);
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — landing page mockup`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <Bar x={238} y={26} w={324} h={448} fill="#fff" o={0.92} r={5} />
      {/* hero */}
      <Bar x={238} y={26} w={324} h={132} fill={c.ac} o={0.17} r={5} />
      <text
        x={262}
        y={74}
        fontFamily={c.hf}
        fontSize="19"
        fontWeight="700"
        fill={c.ink}
      >
        {v.words[0]}
      </text>
      <text x={262} y={96} fontFamily={c.bf} fontSize="10" fill={c.mu}>
        {v.words[1]}
      </text>
      <Bar x={262} y={110} w={86} h={22} fill={c.ink} r={3} />
      <text x={276} y={125} fontFamily={c.bf} fontSize="8.5" fill={c.bg}>
        {v.words[3]}
      </text>
      {/* proof strip */}
      <Bar x={238} y={158} w={324} h={26} fill={c.ink} o={0.05} />
      <text
        x={262}
        y={175}
        fontFamily={c.bf}
        fontSize="8"
        fill={c.mu}
        letterSpacing="1"
      >
        {v.words[2]}
      </text>
      {/* body sections */}
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(0 ${196 + i * 74})`}>
          <Bar x={262} y={0} w={54} h={54} fill={c.ac} o={0.22} r={3} />
          <Lines x={330} y={6} w={206} n={4} gap={9} fill={c.ink} />
        </g>
      ))}
      {/* final cta */}
      <Bar x={262} y={420} w={276} h={38} fill={c.ink} r={4} />
      <text
        x={334}
        y={444}
        fontFamily={c.hf}
        fontSize="12"
        fontWeight="700"
        fill={c.bg}
      >
        {v.words[3]}
      </text>
    </svg>
  );
}

/* ---------- 3. CHAT : conversation UI ---------- */
function Chat({ v, title }: P) {
  const c = R(v);
  const msgs = [
    { t: v.words[0], me: true },
    { t: v.words[1], me: false },
    { t: v.words[2], me: true },
    { t: v.words[3], me: false },
  ];
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — assistant conversation`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <Bar x={210} y={30} w={380} h={440} fill="#fff" o={0.96} r={10} />
      <rect
        x={210}
        y={30}
        width={380}
        height={440}
        rx={10}
        fill="none"
        stroke={c.ink}
        strokeOpacity="0.12"
      />
      <Bar x={210} y={30} w={380} h={44} fill={c.ac} o={0.14} r={10} />
      <circle cx={238} cy={52} r={9} fill={c.ac} opacity={0.5} />
      <text
        x={256}
        y={56}
        fontFamily={c.hf}
        fontSize="11"
        fontWeight="700"
        fill={c.ink}
      >
        {title}
      </text>
      {msgs.map((m, i) => {
        const y = 92 + i * 84;
        const w = Math.min(250, 68 + m.t.length * 5.1);
        const x = m.me ? 560 - w : 232;
        return (
          <g key={i}>
            <Bar
              x={x}
              y={y}
              w={w}
              h={54}
              r={10}
              fill={m.me ? c.ink : c.ac}
              o={m.me ? 0.9 : 0.16}
            />
            <foreignObject x={x + 12} y={y + 9} width={w - 24} height={40}>
              <div
                style={{
                  font: `500 10px ${c.bf}`,
                  lineHeight: "1.35",
                  color: m.me ? c.bg : c.ink,
                }}
              >
                {m.t}
              </div>
            </foreignObject>
          </g>
        );
      })}
      <Bar x={232} y={428} w={336} h={28} fill={c.ink} o={0.05} r={14} />
      <circle cx={548} cy={442} r={9} fill={c.ac} opacity={0.85} />
    </svg>
  );
}

/* ---------- 4. WORKFLOW : flow diagram ---------- */
function Workflow({ v, title }: P) {
  const c = R(v);
  const steps = v.words.slice(0, 4);
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — workflow diagram`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <text
        x={56}
        y={62}
        fontFamily={c.hf}
        fontSize="15"
        fontWeight="700"
        fill={c.ink}
        letterSpacing="0.4"
      >
        {title}
      </text>
      <line
        x1={56}
        y1={78}
        x2={744}
        y2={78}
        stroke={c.ink}
        strokeOpacity="0.12"
      />
      {steps.map((s, i) => {
        const x = 62 + i * 172;
        const diamond = i === 1;
        return (
          <g key={i}>
            {diamond ? (
              <path
                d={`M ${x + 72} 168 L ${x + 140} 226 L ${x + 72} 284 L ${x + 4} 226 Z`}
                fill={c.ac}
                fillOpacity="0.18"
                stroke={c.ac}
                strokeWidth="1.5"
              />
            ) : (
              <rect
                x={x}
                y={182}
                width={144}
                height={88}
                rx={4}
                fill="#fff"
                fillOpacity="0.9"
                stroke={c.ink}
                strokeOpacity="0.2"
              />
            )}
            <text
              x={x + 72}
              y={230}
              textAnchor="middle"
              fontFamily={c.hf}
              fontSize="11.5"
              fontWeight="700"
              fill={c.ink}
            >
              {s}
            </text>
            <text
              x={x + 72}
              y={248}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize="8"
              fill={c.mu}
            >{`Step ${i + 1}`}</text>
            {i < 3 && (
              <>
                <line
                  x1={x + 148}
                  y1={226}
                  x2={x + 168}
                  y2={226}
                  stroke={c.ac}
                  strokeWidth="2"
                />
                <path d={`M ${x + 168} 226 l -6 -4 v 8 z`} fill={c.ac} />
              </>
            )}
          </g>
        );
      })}
      {/* failure path */}
      <path
        d="M 306 284 L 306 340 L 640 340"
        fill="none"
        stroke={c.ink}
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x={318} y={334} fontFamily={c.bf} fontSize="8.5" fill={c.mu}>
        not qualified → nurture
      </text>
      <rect
        x={640}
        y={322}
        width={104}
        height={36}
        rx={4}
        fill={c.ink}
        fillOpacity="0.07"
      />
      <text
        x={692}
        y={344}
        textAnchor="middle"
        fontFamily={c.bf}
        fontSize="9"
        fill={c.mu}
      >
        Nurture list
      </text>
      {/* human checkpoint */}
      <circle cx={700} cy={430} r={7} fill={c.ac} />
      <text x={716} y={434} fontFamily={c.bf} fontSize="9" fill={c.mu}>
        human checkpoint
      </text>
    </svg>
  );
}

/* ---------- 5. SOCIAL : 3×3 grid of posts ---------- */
function Social({ v, title }: P) {
  const c = R(v);
  const dark = v.variant === 1;
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — social content grid`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <text
        x={56}
        y={58}
        fontFamily={c.hf}
        fontSize="15"
        fontWeight="700"
        fill={c.ink}
      >
        {title}
      </text>
      <text x={56} y={76} fontFamily={c.bf} fontSize="9" fill={c.mu}>
        {v.words.slice(0, 3).join("  ·  ")}
      </text>
      {Array.from({ length: 9 }).map((_, i) => {
        const col = i % 3,
          row = Math.floor(i / 3);
        const x = 56 + col * 132,
          y = 100 + row * 124;
        const kind = i % 3;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={116}
              height={110}
              rx={2}
              fill={kind === 0 ? c.ac : c.ink}
              fillOpacity={kind === 0 ? 0.22 : kind === 1 ? 0.08 : 0.04}
            />
            {kind === 1 && (
              <>
                <Lines
                  x={x + 12}
                  y={y + 20}
                  w={92}
                  n={4}
                  gap={10}
                  fill={c.ink}
                  o={0.35}
                />
                <Bar
                  x={x + 12}
                  y={y + 78}
                  w={44}
                  h={10}
                  fill={c.ac}
                  o={0.6}
                  r={2}
                />
              </>
            )}
            {kind === 2 && (
              <text
                x={x + 58}
                y={y + 60}
                textAnchor="middle"
                fontFamily={c.hf}
                fontSize="12"
                fontWeight="700"
                fill={c.ink}
                opacity={0.75}
              >
                {v.words[i % v.words.length].slice(0, 14)}
              </text>
            )}
            {kind === 0 && (
              <circle
                cx={x + 58}
                cy={y + 55}
                r={22}
                fill={c.ac}
                opacity={0.4}
              />
            )}
          </g>
        );
      })}
      {/* calendar rail */}
      <g transform="translate(460 100)">
        <rect
          x={0}
          y={0}
          width={284}
          height={348}
          rx={4}
          fill={dark ? "#fff" : c.ink}
          fillOpacity={dark ? 0.06 : 0.04}
        />
        <text
          x={18}
          y={28}
          fontFamily={c.hf}
          fontSize="10"
          fontWeight="700"
          fill={c.ink}
          letterSpacing="1.2"
        >
          CONTENT CALENDAR
        </text>
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i} transform={`translate(18 ${46 + i * 42})`}>
            <rect
              x={0}
              y={0}
              width={30}
              height={30}
              rx={2}
              fill={c.ac}
              fillOpacity={0.12 + (i % 3) * 0.12}
            />
            <text
              x={15}
              y={20}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize="9"
              fill={c.ink}
              opacity={0.7}
            >
              {i + 1}
            </text>
            <Lines x={44} y={6} w={200} n={2} gap={11} fill={c.ink} o={0.22} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- 6. STRATEGY : journey / framework diagram ---------- */
function Strategy({ v, title }: P) {
  const c = R(v);
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — strategy diagram`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <text
        x={56}
        y={60}
        fontFamily={c.hf}
        fontSize="15"
        fontWeight="700"
        fill={c.ink}
      >
        {title}
      </text>
      <line
        x1={56}
        y1={76}
        x2={744}
        y2={76}
        stroke={c.ink}
        strokeOpacity="0.12"
      />
      {/* journey spine */}
      <line
        x1={80}
        y1={176}
        x2={720}
        y2={176}
        stroke={c.ink}
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      {v.words.slice(0, 4).map((w, i) => {
        const x = 80 + i * 213;
        const drop = i === 2;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={176}
              r={drop ? 13 : 9}
              fill={drop ? c.ac : c.ink}
              fillOpacity={drop ? 1 : 0.8}
            />
            <text
              x={x}
              y={152}
              textAnchor="middle"
              fontFamily={c.hf}
              fontSize="11"
              fontWeight="700"
              fill={c.ink}
            >
              {w}
            </text>
            <text
              x={x}
              y={206}
              textAnchor="middle"
              fontFamily={c.bf}
              fontSize="8.5"
              fill={c.mu}
            >{`Stage ${i + 1}`}</text>
            {drop && (
              <text
                x={x}
                y={224}
                textAnchor="middle"
                fontFamily={c.bf}
                fontSize="8.5"
                fill={c.ac}
                fontWeight="700"
              >
                drop-off
              </text>
            )}
          </g>
        );
      })}
      {/* three framework columns */}
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${72 + i * 226} 264)`}>
          <rect
            x={0}
            y={0}
            width={202}
            height={176}
            rx={4}
            fill="#fff"
            fillOpacity="0.75"
            stroke={c.ink}
            strokeOpacity="0.14"
          />
          <rect
            x={0}
            y={0}
            width={202}
            height={5}
            fill={c.ac}
            fillOpacity={0.3 + i * 0.25}
          />
          <text
            x={16}
            y={32}
            fontFamily={c.hf}
            fontSize="10.5"
            fontWeight="700"
            fill={c.ink}
            letterSpacing="0.8"
          >
            {["AUDIENCE", "MESSAGE", "CHANNEL"][i]}
          </text>
          <Lines x={16} y={48} w={168} n={6} gap={12} fill={c.ink} o={0.24} />
          <rect
            x={16}
            y={132}
            width={72}
            height={18}
            rx={9}
            fill={c.ac}
            fillOpacity="0.2"
          />
          <text
            x={52}
            y={144}
            textAnchor="middle"
            fontFamily={c.bf}
            fontSize="8"
            fill={c.ink}
            opacity={0.8}
          >
            priority {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- 7. REPORT : cover + spread ---------- */
function Report({ v, title }: P) {
  const c = R(v);
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — document layout`}
    >
      <rect width="800" height="500" fill={c.bg} />
      {/* cover */}
      <g>
        <rect
          x={64}
          y={44}
          width={250}
          height={340}
          rx={2}
          fill="#fff"
          stroke={c.ink}
          strokeOpacity="0.14"
        />
        <rect
          x={64}
          y={44}
          width={250}
          height={92}
          fill={c.ac}
          fillOpacity="0.18"
        />
        <text
          x={86}
          y={82}
          fontFamily={c.bf}
          fontSize="8.5"
          fill={c.mu}
          letterSpacing="1.6"
        >
          {v.words[3]}
        </text>
        <foreignObject x={86} y={168} width={206} height={96}>
          <div
            style={{
              font: `700 22px ${c.hf}`,
              lineHeight: "1.12",
              color: c.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
        </foreignObject>
        <line
          x1={86}
          y1={290}
          x2={292}
          y2={290}
          stroke={c.ink}
          strokeOpacity="0.2"
        />
        <text x={86} y={312} fontFamily={c.bf} fontSize="9" fill={c.mu}>
          Easywurld · {v.words[1]}
        </text>
      </g>
      {/* inner spread */}
      <g>
        <rect
          x={340}
          y={44}
          width={396}
          height={340}
          rx={2}
          fill="#fff"
          stroke={c.ink}
          strokeOpacity="0.14"
        />
        <line
          x1={538}
          y1={44}
          x2={538}
          y2={384}
          stroke={c.ink}
          strokeOpacity="0.08"
        />
        <text
          x={362}
          y={78}
          fontFamily={c.hf}
          fontSize="11"
          fontWeight="700"
          fill={c.ink}
        >
          {v.words[1]}
        </text>
        <Lines x={362} y={92} w={154} n={9} gap={11} fill={c.ink} o={0.22} />
        {/* chart */}
        <g transform="translate(560 72)">
          <text
            x={0}
            y={0}
            fontFamily={c.bf}
            fontSize="8"
            fill={c.mu}
            letterSpacing="1"
          >
            {v.words[2]}
          </text>
          {[52, 88, 36, 104, 70].map((h, i) => (
            <rect
              key={i}
              x={i * 30}
              y={132 - h}
              width={18}
              height={h}
              rx={1}
              fill={c.ac}
              fillOpacity={0.35 + i * 0.12}
            />
          ))}
          <line
            x1={0}
            y1={132}
            x2={152}
            y2={132}
            stroke={c.ink}
            strokeOpacity="0.25"
          />
        </g>
        <Lines x={560} y={226} w={154} n={7} gap={11} fill={c.ink} o={0.2} />
        <text x={362} y={366} fontFamily={c.bf} fontSize="8" fill={c.mu}>
          p. 04
        </text>
      </g>
      {/* slide */}
      <g transform="translate(64 402)">
        <rect
          x={0}
          y={0}
          width={672}
          height={64}
          rx={3}
          fill={c.ink}
          fillOpacity="0.06"
        />
        <text
          x={20}
          y={40}
          fontFamily={c.hf}
          fontSize="17"
          fontWeight="700"
          fill={c.ink}
        >
          {v.words[0]}
        </text>
        <rect
          x={596}
          y={20}
          width={56}
          height={24}
          rx={2}
          fill={c.ac}
          fillOpacity="0.3"
        />
      </g>
    </svg>
  );
}

/* ---------- 8. COPY : before / after ---------- */
function Copy({ v, title }: P) {
  const c = R(v);
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`${title} — copy before and after`}
    >
      <rect width="800" height="500" fill={c.bg} />
      <text
        x={56}
        y={58}
        fontFamily={c.hf}
        fontSize="15"
        fontWeight="700"
        fill={c.ink}
      >
        {title}
      </text>
      <line
        x1={56}
        y1={74}
        x2={744}
        y2={74}
        stroke={c.ink}
        strokeOpacity="0.12"
      />
      {/* before */}
      <g>
        <rect
          x={56}
          y={100}
          width={320}
          height={352}
          rx={3}
          fill={c.ink}
          fillOpacity="0.04"
        />
        <text
          x={78}
          y={132}
          fontFamily={c.bf}
          fontSize="9"
          fill={c.mu}
          letterSpacing="2"
        >
          {v.words[0]}
        </text>
        <Lines
          x={78}
          y={150}
          w={276}
          n={14}
          gap={13}
          fill={c.ink}
          o={0.3}
          last={0.9}
        />
        <text x={78} y={432} fontFamily={c.bf} fontSize="9" fill={c.mu}>
          {v.words[2]}
        </text>
      </g>
      {/* arrow */}
      <g>
        <line
          x1={390}
          y1={276}
          x2={418}
          y2={276}
          stroke={c.ac}
          strokeWidth="2"
        />
        <path d="M 418 276 l -7 -5 v 10 z" fill={c.ac} />
      </g>
      {/* after */}
      <g>
        <rect
          x={432}
          y={100}
          width={312}
          height={352}
          rx={3}
          fill="#fff"
          fillOpacity="0.9"
          stroke={c.ac}
          strokeOpacity="0.5"
        />
        <text
          x={454}
          y={132}
          fontFamily={c.bf}
          fontSize="9"
          fill={c.ac}
          letterSpacing="2"
          fontWeight="700"
        >
          {v.words[1]}
        </text>
        <foreignObject x={454} y={148} width={268} height={70}>
          <div
            style={{
              font: `700 19px ${c.hf}`,
              lineHeight: "1.18",
              color: c.ink,
              letterSpacing: "-0.015em",
            }}
          >
            {v.words[3]}
          </div>
        </foreignObject>
        <Lines x={454} y={244} w={268} n={6} gap={13} fill={c.ink} o={0.26} />
        <rect x={454} y={340} width={104} height={28} rx={3} fill={c.ink} />
        <text x={454} y={432} fontFamily={c.bf} fontSize="9" fill={c.mu}>
          {v.words[3]}
        </text>
      </g>
    </svg>
  );
}

import * as WL from "./artwork/webLayouts";
import * as LL from "./artwork/landingLayouts";

/** Bespoke, per-project layouts. Each one is its own composition, researched
 *  against how that industry actually builds. Archetypes below are fallback. */
const BESPOKE: Record<string, (p: Project) => ReactElement> = {
  "northline-atelier": WL.NorthlineAtelier,
  "morrow-house": WL.MorrowHouse,
  "cedar-advisory": WL.CedarAdvisory,
  "fieldstone-build": WL.FieldstoneBuild,
  "luma-skin-studio": WL.LumaSkinStudio,
  "open-door-learning": WL.OpenDoorLearning,
  "harbour-and-home": WL.HarbourAndHome,
  "sunday-table-preorder": LL.SundayTable,
  "quiet-hours-consult": LL.QuietHours,
  "atlas-crm-saas": LL.AtlasCRM,
  "brightline-course": LL.Brightline,
  "homebase-workshop-event": LL.HomebaseWorkshop,
  "aster-property-single": LL.AsterProperty,
  "first-step-finance-lead": LL.FirstStepFinance,
};

const MAP = {
  website: Website,
  landing: Landing,
  chat: Chat,
  workflow: Workflow,
  social: Social,
  strategy: Strategy,
  report: Report,
  copy: Copy,
} as const;

export default function Artwork({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const Bespoke = BESPOKE[project.slug];
  const C = MAP[project.visual.archetype] ?? Website;
  return (
    <div
      className={`artwork ${className}`}
      data-arch={project.visual.archetype}
    >
      {Bespoke ? (
        <Bespoke {...project} />
      ) : (
        <C v={project.visual} title={project.title} />
      )}
    </div>
  );
}
