#!/usr/bin/env python3
"""Build the full 30-day Easywurld batch: assets, videos, day folders, zips."""
import os, sys, json, shutil, subprocess, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.dirname(HERE)
sys.path.insert(0, TOOL)
sys.path.insert(0, HERE)

import carousel as C
import meme as M
import video as V
from content_01_12 import CAROUSELS, MEMES
from content_13_30 import C4, C5, C6, C7, C8, C9, C10, C11, MEMES13

REPO = "/home/user/website-builder-portfolio"
OLD_VID = f"{REPO}/marketing/library/social/batch01/videos"
OUT = "/tmp/out"
AST = f"{OUT}/assets"
AUD = f"{TOOL}/audio"

CAROUSELS_ALL = CAROUSELS + [C4, C5, C6, C7, C8, C9, C10, C11]
MEMES_ALL = MEMES + MEMES13

BY = {c["slug"].split("_")[0]: c for c in CAROUSELS_ALL}
BY.update({m["slug"]: m for m in MEMES_ALL})

# ------------------------------------------------------------------ videos
VMETA = {
 "V1": dict(slug="C1_PLAYBOOK_dead_end", src="C1_PLAYBOOK_dead_end_9x16.mp4",
            pack="The Chat-to-Customer Playbook", kw="PLAYBOOK",
            name="The price is not the problem", beats=[
    ("THE REAL PROBLEM", "A price on its own is a dead end.", "That is what the silence is about."),
    ("WHAT THEY ACTUALLY MEAN", "It is not the number.", "Nothing followed it."),
    ("THE THREE-PART REPLY", "Price. Scope. Question.", "In that order, every time."),
    ("WHAT IT SOUNDS LIKE", "\u20a618,000, tailored. Five days.", "Would you like me to take your measurements now?"),
    ("WHAT CHANGES", "Same price.", "Completely different ending.")]),
 "V2": dict(slug="C2_CLEAR_five_second_test", src="C2_CLEAR_five_second_test_9x16.mp4",
            pack="The Clear Homepage Blueprint", kw="CLEAR",
            name="The five-second test", beats=[
    ("THE TEST", "Hand a stranger your phone.", "Give them five seconds."),
    ("THEN ASK", "What do we sell, and for who?", "What were you meant to do next?"),
    ("FOUR SILENT QUESTIONS", "What, who, why, next.", "Every visitor asks all four."),
    ("MOST SITES", "\u201cWelcome to our website\u201d", "answers none of them."),
    ("THE REWRITE", "Sell. Who for. Price. Action.", "That is the first screen.")]),
 "V3": dict(slug="C3_PAGE_one_offer", src="C3_PAGE_one_offer_9x16.mp4",
            pack="The One-Offer Landing Page Kit", kw="PAGE",
            name="One page, one offer, one action", beats=[
    ("THE RULE", "If your page can do two things,", "it will do neither."),
    ("A WEBSITE VS A PAGE", "A website answers many questions.", "A page answers one."),
    ("WHY PAGES FAIL", "Too many offers.", "And no actual ask."),
    ("THE STRONGEST BLOCK", "\u201cWho this is not for.\u201d", "Nobody writes it. It does the most work."),
    ("THE SHAPE", "One offer. One price. One action.", "Repeated three times.")]),
 "V4": dict(slug="M1", src="M1_okay_thanks_9x16.mp4",
            pack="The Chat-to-Customer Playbook", kw="PLAYBOOK",
            name="The \u201cokay, thanks\u201d silence", beats=[
    ("EVERY SELLER KNOWS", "\u201cOkay, thanks.\u201d", "That is not a thank you."),
    ("IT IS A POLITE EXIT", "The price was fine.", "Nothing followed it."),
    ("THE FIX", "Say what it includes.", "Then ask one question."),
    ("WHAT THAT SOUNDS LIKE", "Ready in five days.", "Shall I take your measurements now?"),
    ("THE DIFFERENCE", "Same price.", "A conversation instead of silence.")]),
}

VOICE_NEW = {
 "V5": dict(slug="C9_ENGINE_diary", mp3="V5_ENGINE.mp3",
            pack="The 30-Day Content Engine", kw="ENGINE", name="Posting is not a diary", beats=[
    ("THE CONTENT TRUTH", "Posting when you remember is not marketing.", "It is a diary with better lighting."),
    ("THE REAL PROBLEM", "It is not discipline.", "It is too many decisions."),
    ("FIVE FORMATS", "Teach. Meme. Offer. Proof. Take.", "Rotate, and you never start blank."),
    ("THE ROUTINE", "One afternoon. Seven posts.", "Scheduled before Sunday night."),
    ("THE PART NOBODY SAYS", "Reply for the first hour.", "That is the growth.")]),
 "V6": dict(slug="C4_LOCAL_invisible", mp3="V6_LOCAL.mp3",
            pack="The Lagos Local Visibility Starter", kw="LOCAL", name="You are invisible where it matters", beats=[
    ("LOCAL SEARCH", "Someone searched for your business today.", "They found the shop two streets away."),
    ("WHY", "Their profile is complete.", "Yours is not."),
    ("WHAT THEY SEE", "Hours, photos, reviews.", "That is the whole list."),
    ("THE HARD PART", "Twenty reviews beats a bigger competitor.", "Every time."),
    ("THE COST", "This is free.", "It is just unglamorous.")]),
 "V7": dict(slug="C5_LAUNCH_rots", mp3="V7_LAUNCH.mp3",
            pack="The Website Launch & Care Handbook", kw="LAUNCH", name="Your site died three months ago", beats=[
    ("THE WEBSITE TRUTH", "Your site did not fail at launch.", "It failed three months later, quietly."),
    ("WHAT BREAKS", "The form. The number. The hours.", "Then the domain."),
    ("WHY NOBODY NOTICES", "A broken website", "still looks fine."),
    ("THE ROUTINE", "Four checks. Once a month.", "Forms, facts, phone, backups."),
    ("THE RULE", "Test your own forms.", "Like a customer would.")]),
}

# hand-written video captions where the video needs its own framing
VIDCAP = {
 "V1": ("The price was never the problem.\n\nSomeone asks how much. You send the number. The chat goes quiet.\n\nNothing followed the number. No scope, no timeline, no question.\n\nSay the price. Say what it includes in one line. Ask one question that moves it forward.\n\n\u201cThe Ankara set is \u20a618,000, tailored to your size, ready in 5 days. Would you like me to take your measurements now?\u201d\n\nSame price. Completely different ending.\n\nThe Chat-to-Customer Playbook \u2014 36 scripts, \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837.\n\n#SmallBusinessNigeria #LagosBusiness #WhatsAppBusiness #Easywurld #SalesTips",
        "The price was never the problem.\n\nSomeone asks how much, you send the number, and the chat goes quiet.\n\nNothing followed the number \u2014 no scope, no timeline, no question, so there was nothing left to reply to.\n\nSay the price, say what it includes, then ask one question that moves it forward.\n\nThe Chat-to-Customer Playbook \u2014 36 scripts. \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837."),
 "V2": ("Hand a stranger your phone for five seconds. Then ask them what you sell.\n\nIf they hesitate, it is a wording problem, not a design problem.\n\nA visitor answers four questions in those five seconds: what is this, who is it for, does it solve my problem, what do I do next.\n\n\u201cWelcome to our website\u201d answers none of them. \u201cWebsites for Lagos food businesses, live in 14 days, \u20a6300,000\u201d answers all four.\n\nThe Clear Homepage Blueprint \u2014 \u20a65,000. Message CLEAR on WhatsApp: 0905 069 0837.\n\n#WebDesignNigeria #LagosBusiness #Easywurld #SmallBusinessTips #Copywriting",
        "Hand a stranger your phone for five seconds, then ask them what you sell.\n\nIf they hesitate, that is a wording problem, not a design problem.\n\nFour questions are being answered in those five seconds: what is this, who is it for, does it solve my problem, what do I do next.\n\nThe Clear Homepage Blueprint \u2014 seven blocks, eight rewrites. \u20a65,000. Message CLEAR on WhatsApp: 0905 069 0837."),
 "V3": ("If your page can do two things, it will do neither.\n\nA website answers many questions. A landing page answers one, then asks for the sale.\n\nMost pages fail for two reasons: too many offers, and no ask.\n\nThe strongest block is the one nobody writes \u2014 \u201cwho this is not for.\u201d It proves you know who you are talking to.\n\nThe One-Offer Landing Page Kit \u2014 \u20a65,000. Message PAGE on WhatsApp: 0905 069 0837.\n\n#LandingPage #LagosBusiness #Easywurld #Copywriting #WebDesignNigeria",
        "If your page can do two things, it will do neither.\n\nMost pages fail for two reasons: they offer more than one thing, and they never actually ask.\n\nWrite down the single action you want. If you cannot say it in four words, the page is not ready.\n\nThe One-Offer Landing Page Kit \u2014 ten blocks, headline formulas. \u20a65,000. Message PAGE on WhatsApp: 0905 069 0837."),
 "V4": ("\u201cOkay, thanks.\u201d\n\nIf you sell by chat, you know what that means. It is not a thank you. It is a polite exit.\n\nOne extra line fixes it: say what the price includes, then ask one question.\n\nThe Chat-to-Customer Playbook \u2014 36 scripts, \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837.\n\n#SellerLife #LagosBusiness #SmallBusinessNigeria #Easywurld #WhatsAppBusiness",
        "Customer: \u201chow much?\u201d You: \u201c\u20a615,000, ready in 5 days.\u201d Customer: \u201cokay, thanks.\u201d\n\nThat is not a thank you. It is a polite exit.\n\nThe fix is one extra line \u2014 say what the price includes, then ask a question that keeps the conversation alive.\n\nThe Chat-to-Customer Playbook \u2014 36 scripts. \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837."),
}

# ------------------------------------------------------------- day calendar
# 11 carousels + 12 memes + 7 videos = 30. Carousels and videos carry the
# offer; memes carry reach. No two carousels back to back.
ORDER_30 = ["C1","M1","C2","M2","V1","M3","C3","M4","V2","M5","V3","V4",
            "C4","M6","C5","V5","C6","M7","C7","V6","C8","M8","C9","V7",
            "C11","M9","C10","M10","M11","M12"]

# Times follow the format: carousels and videos take the evening or the lunch
# slot, memes take midday. Computed once up-front so a day's time never moves.
TIME_CYCLE = {
    "Carousel": ["19:30", "19:00", "11:30"],
    "Meme": ["12:30", "12:00"],
    "Video": ["19:30", "20:00", "19:00"],
}

TIMES = {}          # day number -> "HH:MM"


def assign_times(sequence):
    seen = {}
    for n, key, kind in sequence:
        i = seen.get(kind, 0)
        seen[kind] = i + 1
        TIMES[n] = TIME_CYCLE[kind][i % len(TIME_CYCLE[kind])]


def build_assets():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(AST, exist_ok=True)
    made = {}
    for c in CAROUSELS_ALL:
        p = C.render(c["slides"], os.path.join(AST, c["slug"]), c["slug"])
        made[c["slug"]] = p
        print("carousel", c["slug"], len(p))
    for m in MEMES_ALL:
        d = os.path.join(AST, "meme_" + m["slug"])
        os.makedirs(d, exist_ok=True)
        out = os.path.join(d, f"MEME_{m['slug']}.png")
        M.render(m, out)
        made[m["slug"]] = [out]
        print("meme", m["slug"])
    # existing videos
    for k in ("V1", "V2", "V3", "V4"):
        meta = VMETA[k]
        d = os.path.join(AST, "video_" + k)
        os.makedirs(d, exist_ok=True)
        dst = os.path.join(d, f"{k}_{meta['slug']}_9x16.mp4")
        shutil.copy(os.path.join(OLD_VID, meta["src"]), dst)
        made[k] = [dst]
        print("video", k, "copied")
    # new videos
    for k, meta in VOICE_NEW.items():
        d = os.path.join(AST, "video_" + k)
        os.makedirs(d, exist_ok=True)
        dst = os.path.join(d, f"{k}_{meta['slug']}_9x16.mp4")
        beats = [(("cta", meta["pack"], meta["name"], meta["kw"])
                  if i == 5 else ("frame", b[0], b[1], b[2]))
                 for i, b in enumerate(meta["beats"] + [("CTA", "", "")])]
        out, dur = V.build(beats, os.path.join(AUD, meta["mp3"]),
                           dst, k, os.path.join(OUT, "frames", k))
        made[k] = [dst]
        print("video", k, round(dur, 1), "s")
    return made


def piece_info(key, made):
    if key.startswith("C"):
        c = BY[key]
        return dict(kind="Carousel", title=c["title"], pack=c["pack"], kw=c["kw"],
                    ig=c["ig"], fb=c["fb"], tt=c["tt"], comment=c["comment"],
                    files=made[c["slug"]])
    if key.startswith("M"):
        m = BY[key]
        return dict(kind="Meme", title=m.get("short") or m["big"].replace("\n", " "), pack=m["pack"] or "\u2014",
                    kw=m["kw"] or "\u2014", ig=m["ig"], fb=m["fb"], tt="",
                    comment=m["comment"], files=made[m["slug"]])
    meta = VOICE_NEW.get(key) or VMETA[key]
    ig, fb = VIDCAP.get(key, (None, None))
    if ig is None:
        src = BY[meta["slug"].split("_")[0]] if meta["slug"][0] == "C" else BY[meta["slug"]]
        ig, fb = src["ig"], src["fb"]
    return dict(kind="Video", title=meta["name"], pack=meta["pack"], kw=meta["kw"],
                ig=ig, fb=fb, tt="", comment="Sound is already in the file. Do not add music over it.",
                files=made[key])


def card(n, p):
    offer = p["pack"][4:] if p["pack"].startswith("The ") else p["pack"]
    L = []
    A = L.append
    bar = "=" * 54
    A(bar); A(f"DAY {n:02d}  \u00b7  {p['kind'].upper()}"); A(bar); A("")
    A(f"WHAT      {p['title']}")
    A(f"OFFER     {p['pack']}")
    A(f"KEYWORD   {p['kw']}")
    A(f"TIME      {TIMES[n]} WAT")
    A("")
    A("-" * 54); A("DO THIS, IN ORDER"); A("-" * 54)
    if p["kind"] == "Carousel":
        A(f"1. Upload the {len(p['files'])} slides in order, slide_01 first.")
        A("2. Paste CAPTION_instagram.txt or CAPTION_facebook.txt.")
        A("3. Location: Lagos, Nigeria.")
        A("4. Post the FIRST COMMENT below straight away.")
        A("5. Reply to every comment for the first hour.")
    elif p["kind"] == "Meme":
        A("1. Upload the single image.")
        A("2. Paste CAPTION_instagram.txt or CAPTION_facebook.txt.")
        A("3. Location: Lagos, Nigeria.")
        A("4. Reply to every comment for the first hour.")
    else:
        A("1. Upload the MP4 as a Reel or TikTok.")
        A("2. Paste CAPTION_instagram.txt or CAPTION_facebook.txt.")
        A("3. Sound is already in the file. Do not add music over it.")
        A("4. Location: Lagos, Nigeria.")
        A("5. Reply to every comment for the first hour.")
    A("")
    A("-" * 54); A("FIRST COMMENT"); A("-" * 54)
    A(textwrap.fill(p["comment"], 54)); A("")
    A("-" * 54); A("WHEN SOMEONE MESSAGES THE KEYWORD"); A("-" * 54)
    if p["kw"] == "\u2014":
        A(textwrap.fill("No offer on this one, on purpose. It is a reach post \u2014 "
                        "the job is comments and shares, not sales. Still reply to everyone.", 54))
    elif p["kw"] == "START":
        A(textwrap.fill("Send the list of all nine packs, then the Selar shop link. "
                        "Do not push a bundle. Let them pick the problem.", 54))
    else:
        A(textwrap.fill(f"Send the {offer} PDF, then the Selar link, then one line: "
                        "'If you'd rather I set it up with you, that is a different conversation.' "
                        "Do not negotiate the \u20a65,000.", 54))
    A("")
    A(bar); A("Easywurld \u00b7 Simplify. Optimize. Grow. \u00b7 0905 069 0837"); A(bar)
    return "\n".join(L) + "\n"


def build_days(made):
    days = f"{OUT}/days"
    os.makedirs(days, exist_ok=True)
    kinds = [(n, k, ("Video" if k.startswith("V") else
                     "Carousel" if k.startswith("C") else "Meme"))
             for n, k in enumerate(ORDER_30, 1)]
    assign_times(kinds)
    index = ["EASYWURLD \u2014 30 DAYS, ONE POST A NIGHT", "=" * 54, "",
             "Download the day you are posting. Unzip. Post.", ""]
    for n, key in enumerate(ORDER_30, 1):
        p = piece_info(key, made)
        dname = f"Day_{n:02d}"
        dd = os.path.join(days, dname)
        os.makedirs(dd, exist_ok=True)
        for i, f in enumerate(p["files"], 1):
            ext = os.path.splitext(f)[1]
            if p["kind"] == "Carousel":
                shutil.copy(f, os.path.join(dd, f"slide_{i:02d}.png"))
            elif p["kind"] == "Meme":
                shutil.copy(f, os.path.join(dd, "meme_4x5.png"))
            else:
                shutil.copy(f, os.path.join(dd, "video_9x16_voiced.mp4"))
        open(os.path.join(dd, "00_START_HERE.txt"), "w").write(card(n, p))
        open(os.path.join(dd, "CAPTION_instagram.txt"), "w").write(p["ig"] + "\n")
        open(os.path.join(dd, "CAPTION_facebook.txt"), "w").write(p["fb"] + "\n")
        if p["tt"]:
            open(os.path.join(dd, "TIKTOK_script.txt"), "w").write(p["tt"] + "\n")
        t = p["title"].replace("/", "-").strip().rstrip(".")
        if len(t) > 58:
            t = t[:58].rsplit(" ", 1)[0].rstrip(",;:") + "\u2026"
        label = f"Day {n:02d} \u2014 {p['kind']} \u2014 {t}"
        subprocess.run(f'cd {days} && zip -qr "{label}.zip" {dname}', shell=True, check=True)
        shutil.rmtree(dd)
        t = p["title"] if len(p["title"]) <= 50 else p["title"][:49].rsplit(" ", 1)[0] + "\u2026"
        index.append(f"Day {n:02d}  {p['kind']:<9} {t:<52}{TIMES[n]}  {p['kw']}")
        print("day", n, key, p["kind"])
    open(os.path.join(days, "INDEX.txt"), "w").write("\n".join(index) + "\n")
    subprocess.run(f'cd {days} && zip -q ALL_30_DAYS.zip Day*.zip', shell=True, check=True)
    return days, index


if __name__ == "__main__":
    made = build_assets()
    days, index = build_days(made)
    print("\n".join(index))
