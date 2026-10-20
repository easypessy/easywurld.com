/* Easywurld social kit — markdown to Google Docs HTML.
 *
 * Converts the kit's .md files into simple HTML that uploads cleanly into
 * Google Docs. Docs imports the HTML and turns it into a real document you
 * can read, search and edit on your phone.
 *
 * Run:  node launch-content/social-command/build/md-to-html.mjs [file.md ...]
 *        with no arguments it converts every .md next to it.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");

/* ------------------------------------------------------------------ */
/* a small, predictable markdown subset                               */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** inline markdown: bold, italic, code, links */
function inline(text) {
  let out = esc(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
    '<a href="$2">$1</a>');
  return out;
}

/** a markdown table row -> cells */
function tableCells(line) {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

/** true when the text has an unclosed inline code span */
function hasOpenCode(text) {
  const ticks = (text.match(/`/g) || []).length;
  return ticks % 2 === 1;
}

/**
 * A list, with one level of nesting and wrapped lines folded in.
 * Sets listEnd to the line after the last line the list consumed.
 */
let listEnd = 0;
function renderList(lines, start, tag) {
  const marker = tag === "ul" ? /^([-*])\s+/ : /^(\d+)\.\s+/;
  const items = [];
  let i = start;

  while (i < lines.length) {
    const m = lines[i].match(marker);
    if (!m) {
      /* a wrapped continuation of the current item */
      if (items.length && /^\s{2,}\S/.test(lines[i])
        && !marker.test(lines[i]) && !/^[-*]\s+/.test(lines[i])
        && !/^\s*[-*]\s+/.test(lines[i])) {
        items[items.length - 1].text += " " + lines[i].trim();
        i++;
        continue;
      }
      break;
    }

    const indent = lines[i].length - lines[i].trimStart().length;
    const item = { indent, text: m[2] ? lines[i].slice(m[0].length) : lines[i].replace(marker, ""), children: [] };
    items.push(item);
    i++;

    /* a code span that runs past the end of the line takes the next line with it */
    while (hasOpenCode(item.text) && i < lines.length) {
      item.text += " " + lines[i].trim();
      i++;
    }

    /* fold in wrapped lines and collect any nested bullets */
    while (i < lines.length) {
      const nm = lines[i].match(/^(\s*)[-*]\s+(.*)$/);
      if (nm && nm[1].length > indent) {
        item.children.push(nm[2]);
        i++;
        /* fold the nested bullet's own wrapped lines */
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])
          && !/^\s*[-*]\s+/.test(lines[i]) && !marker.test(lines[i])) {
          item.children[item.children.length - 1] += " " + lines[i].trim();
          i++;
        }
        continue;
      }
      if (/^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !marker.test(lines[i])) {
        item.text += " " + lines[i].trim();
        i++;
        while (hasOpenCode(item.text) && i < lines.length && !/^\s*[-*]\s+/.test(lines[i])) {
          item.text += " " + lines[i].trim();
          i++;
        }
        continue;
      }
      break;
    }
  }

  listEnd = i;
  const body = items.map((it) => {
    const inner = it.children.length
      ? "<ul>" + it.children.map((c) => `<li>${inline(c)}</li>`).join("") + "</ul>"
      : "";
    return `<li>${inline(it.text)}${inner}</li>`;
  }).join("");
  return `<${tag}>${body}</${tag}>`;
}

/**
 * markdownToHtml(md) -> an HTML fragment Google Docs will accept.
 */
export function markdownToHtml(md) {
  const lines = String(md).split("\n");
  const out = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    /* blank */
    if (!line.trim()) { i++; continue; }

    /* horizontal rule */
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      out.push("<hr/>");
      i++;
      continue;
    }

    /* heading */
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    /* table */
    if (/^\|/.test(line) && /^\|[\s:|-]+\|?$/.test(lines[i + 1] || "")) {
      const head = tableCells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(tableCells(lines[i]));
        i++;
      }
      out.push("<table><thead><tr>"
        + head.map((c) => `<th>${inline(c)}</th>`).join("")
        + "</tr></thead><tbody>");
      for (const r of rows) {
        out.push("<tr>" + r.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>");
      }
      out.push("</tbody></table>");
      continue;
    }

    /* list */
    if (/^[-*]\s+/.test(line)) {
      out.push(renderList(lines, i, "ul"));
      i = listEnd;
      continue;
    }

    /* numbered list */
    if (/^\d+\.\s+/.test(line)) {
      out.push(renderList(lines, i, "ol"));
      i = listEnd;
      continue;
    }

    /* blockquote */
    if (/^>\s?/.test(line)) {
      const quoted = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^>\s?/, "").trimEnd());
        i++;
      }
      out.push("<blockquote><p>" + inline(quoted.join(" ")) + "</p></blockquote>");
      continue;
    }

    /* paragraph — join the lines until a blank */
    const para = [];
    while (i < lines.length && lines[i].trim()
      && !/^(#{1,6}\s|[-*]\s|\d+\.\s|>|\|)/.test(lines[i])
      && !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())) {
      para.push(lines[i].trim());
      i++;
      while (hasOpenCode(para.join(" ")) && i < lines.length && lines[i].trim()
        && !/^\s*[-*]\s+/.test(lines[i])) {
        para.push(lines[i].trim());
        i++;
      }
    }
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    else i++;
  }

  return out.join("\n");
}

/* ------------------------------------------------------------------ */
/* run                                                                 */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const targets = args.length
  ? args
  : readdirSync(outDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(outDir, f));

for (const t of targets) {
  const src = t.endsWith(".md") ? t : join(t, ".md");
  const md = readFileSync(src, "utf8");
  const html = "<html><body>" + markdownToHtml(md) + "</body></html>";
  const out = src.replace(/\.md$/, ".doc.html");
  writeFileSync(out, html);
  console.log(`${basename(src)} -> ${basename(out)} ${html.length} chars`);
}
