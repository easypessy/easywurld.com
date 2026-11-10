"""Research fact register for the December 2026 draft carousel track.

Purpose: every undated editorial draft in `december-2026-DRAFT/` currently says
"illustrative editorial hypothesis". That is honest, but it leaves the reader with
no idea which *real* rule, law or platform policy sits behind a claim an owner would
act on. This module holds the researched facts those drafts depend on, plus the
mapping from draft slot -> facts that must be verified before that slot is scheduled.

Boundaries, deliberately kept:
  * A fact here is NOT an approval. It is a source an authorised reviewer can check.
  * `tier` records how strong the source is (primary statute / regulator / platform
    policy / secondary commentary / repository evidence).
  * `confidence` is `verified` only where the primary text was actually read on the
    date in `checked`. Anything else is `verified-secondary` or `unverified`.
  * No legal advice, no guarantee a draft is compliant, no publication permission.

Run `python marketing/operating-system-v2/research_facts.py` to regenerate:
  research-2026-11-10/01_FACT_REGISTER.csv   machine-readable register
  research-2026-11-10/03_DRAFT_FACT_PACKETS.md   series-level mapping
  research-2026-11-10/05_OWNER_VERIFICATION_CHECKLIST.md   open questions
"""
from pathlib import Path
import csv

ROOT = Path(__file__).parent
OUT = ROOT / 'research-2026-11-10'

CHECKED = '2026-11-10'

# In-repo helper text so the register stays readable in a CSV cell.
def _f(fid, statement, detail, instrument, pinpoint, url, tier, confidence, series,
       prevents, caveat=''):
    return {
        'fact_id': fid,
        'statement': statement,
        'detail': detail,
        'instrument': instrument,
        'pinpoint': pinpoint,
        'url': url,
        'tier': tier,
        'confidence': confidence,
        'checked': CHECKED,
        'jurisdiction': 'Nigeria (federal)',
        'series': ','.join(f'S{i:02d}' for i in series),
        'prevents': prevents,
        'caveat': caveat,
    }


ARCON = 'Advertising Regulatory Council of Nigeria Act, 2022 (Act No. 23)'
ARCON_URL = ('https://placng.org/i/wp-content/uploads/2022/10/'
             'Advertising-Regulatory-Council-of-Nigeria-Act-2022.pdf')
NDPA = 'Nigeria Data Protection Act, 2023 (Act No. 37)'
NDPA_URL = ('https://ndpc.gov.ng/wp-content/uploads/2024/03/'
            'Nigeria_Data_Protection_Act_2023.pdf')
NDPC_GN = ('NDPC Guidance Notice on Registration of Data Controllers and Data '
           'Processors of Major Importance (NDPC/HQ/GN/VOL.03/B/24)')
NDPC_GN_URL = ('https://ndpc.gov.ng/wp-content/uploads/2025/07/'
               'Updated-Guidance-Notice-on-Registtration-2024.pdf')
FCCPA = 'Federal Competition and Consumer Protection Act, 2018'
FCCPA_HUB = ('https://www.lawglobalhub.com/'
             'federal-competition-and-consumer-protection-act-2018-nigeria/')
META_ADS = 'Meta Advertising Standards'
META_ATTR = ('https://transparency.meta.com/policies/ad-standards/'
             'objectionable-content/privacy-violations-personal-attributes/')

FACTS = [
    # ---------- Nigeria: advertising regulation (ARCON) ----------
    _f('NG-ARCON-01',
       'One federal body has exclusive power over advertising and marketing communication in Nigeria.',
       'ARCON is established with "exclusive power to determine, pronounce upon, administer, monitor '
       'and enforce compliance by persons and organisations on matters relating to advertisements, '
       'advertising, and marketing communication in Nigeria".',
       ARCON, 's.1(2)(d)', ARCON_URL, 'primary statute', 'verified', [1, 3, 7, 10, 11],
       'Telling an owner that platform rules are the only rules that apply to their posts.'),
    _f('NG-ARCON-02',
       'Advertising aimed at the Nigerian market must be legal, decent, honest and truthful.',
       'A core objective is to "ensure that all advertisement exposed and directed at the Nigerian market '
       'is legal, decent, honest, truthful, respectful, and mindful of the Nigerian culture ... devoid of '
       'misinformation or disinformation".',
       ARCON, 's.2(1)(b)', ARCON_URL, 'primary statute', 'verified', [1, 2, 3, 7, 10, 11],
       'Writing a superlative or urgency line that is not true, or implying a claim is just "marketing talk".'),
    _f('NG-ARCON-03',
       'A standards panel reviews advertisements against the law and the advertising code of ethics.',
       'The Advertising Standards Panel (ASP) "is charged with the responsibility of ensuring that '
       'advertising and all advertisements conform with the prevailing laws of the Federation and the code '
       'of ethics of the advertising profession".',
       ARCON, 's.53(1)', ARCON_URL, 'primary statute', 'verified', [1, 6, 7, 10],
       'Presenting a self-declared "compliance check" as if it were the regulator\'s approval.',
       'The Act creates the panel and the offence. The pre-exposure clearance procedure itself sits in the '
       'Nigerian Code of Advertising Practice and ARCON vetting guidelines, which were not retrieved as '
       'primary text for this register — see NG-ARCON-06.'),
    _f('NG-ARCON-04',
       'Exposing an advertisement that breaches the Act is an offence, with statutory minimum fines.',
       'A person or organisation that "exposes any advertisement that contravene any provision of this Act, '
       'commits an offence"; on conviction an individual faces "a fine of at least N500,000 or imprisonment '
       'for a term of one year or both" and an organisation "a fine of at least N1,000,000".',
       ARCON, 's.34(3), s.34(5)(a)-(b)', ARCON_URL, 'primary statute', 'verified', [1, 10, 11],
       'Assuming a post is "just content", not an advertisement, and therefore outside any penalty.',
       'Statutory minima, not the amounts actually imposed in any particular case. Do not quote a fine '
       'figure as though it were a current enforcement tariff.'),
    _f('NG-ARCON-05',
       'Directors and managers can be personally caught when a company breaches the advertising Act.',
       'Where an offence by a body corporate "is proved to have been committed with the connivance of or to '
       'be attributable to any neglect on the part of any director, manager, secretary or other similar '
       'officer", that officer is deemed guilty and punished accordingly.',
       ARCON, 's.34(6)', ARCON_URL, 'primary statute', 'verified', [6, 10],
       'Treating compliance as one junior person\'s job with no owner sign-off.'),
    _f('NG-ARCON-06',
       'Vetting submissions are normally made through a registered practitioner, with the actual creative.',
       'Reported procedure: formal application to the Director-General, Standards Panel Form 001 signed by a '
       'registered practitioner (Associate Member or above), advertiser authorisation letter, the actual '
       'advert material (links generally not accepted), and sector approvals such as NAFDAC where relevant.',
       'ARCON vetting procedure as summarised by Nigerian legal-practice commentary', 'procedure summary',
       'https://lawcarenigeria.com/laws-regulating-advertising-companies-in-nigeria/',
       'secondary commentary', 'verified-secondary', [6, 10],
       'Assuming a client can submit vetting themselves, or that a URL is an acceptable submission.',
       'Read from commentary, not from ARCON\'s own guidelines. Confirm current forms, fees and exemptions '
       'directly with ARCON before advising a client.'),
    _f('NG-ARCON-07',
       'Digital and social advertising has been brought into vetting, with enforcement reported on social platforms.',
       'Trade and legal commentary report a 2025 ARCON position that digital adverts must be vetted and '
       'approved before exposure, and enforcement notices to small online vendors. Enforcement scale and the '
       'litigation position are reported inconsistently across outlets.',
       'ARCON digital vetting enforcement as reported in Nigerian business and legal press',
       'reported 2025-2026', 
       'https://businessday.ng/exclusives/article/rethinking-an-advert-regulatory-system-that-protects-nigerians-without-straining-businesses/',
       'secondary commentary', 'unverified', [1, 7, 10],
       'Stating as fact that "every Instagram post now needs ARCON approval" (or the reverse) without checking.',
       'This is the single most consequential and least settled item in this register. Outlets disagree on '
       'scope, amounts and court outcomes; the BusinessDay piece is partly paywalled. Treat as an open '
       'question for the owner/legal adviser, not a quotable fact.'),

    # ---------- Nigeria: consumer protection (FCCPA) ----------
    _f('NG-FCCPA-01',
       'Marketing representations must not be false, incorrect, misleading or deceptive.',
       'A supplier must not make a representation "in a manner that is likely to imply any false or incorrect '
       'representation", "that is reasonably misleading or likely to be misleading in any material respect", '
       'or "erroneous, fraudulent or deceptive" — including as to the nature, properties, advantages or uses '
       'of the service, the conditions of supply, and the price.',
       FCCPA, 's.123(1)(a)-(c)', FCCPA_HUB, 'primary statute', 'verified', [1, 2, 3, 7, 9, 10, 11],
       'A vague but flattering claim ("we clean everywhere", "space for anything") that a buyer relies on.'),
    _f('NG-FCCPA-02',
       'Performance and efficacy claims need an adequate and proper test, and the seller carries the proof.',
       'No representation "in the form of a statement, warranty or guarantee of performance, efficacy or '
       'length of life of products that is not based on an adequate and proper test ... the proof of which '
       'lies on the person making the representation".',
       FCCPA, 's.123(1)(d)', FCCPA_HUB, 'primary statute', 'verified', [4, 7, 11],
       '"This doubled our enquiries" / "works every time" with no test behind it.',
       'The section speaks of "products"; read it as applying to services with local advice. Do not cite the '
       'section number to a client as settled law without a lawyer.'),
    _f('NG-FCCPA-03',
       'A misleading representation about a material fact creates liability for damages and restitution.',
       'Where a supplier "directly or indirectly expresses or implies a false, misleading or deceptive '
       'representation concerning a material fact", or "fails to correct an apparent misapprehension", the '
       'undertaking "is liable for damages to any person damaged, and shall be ordered to make monetary '
       'restitution".',
       FCCPA, 's.125(1)(a)-(b)', FCCPA_HUB, 'primary statute', 'verified', [1, 4, 7],
       'Leaving an old price, coverage area or turnaround promise online because "people ask anyway".'),
    _f('NG-FCCPA-04',
       'You may not imply sponsorship, approval or affiliation you do not have.',
       'A person acting for a supplier shall not "falsely represent that the person has any sponsorship, '
       'approval or affiliation".',
       FCCPA, 's.125(2)(a)', FCCPA_HUB, 'primary statute', 'verified', [6, 7, 10],
       'A badge, "as featured in", partner logo, or "certified" claim that has no paperwork behind it.'),
    _f('NG-FCCPA-05',
       'A published testimonial needs the person\'s actual words and their written permission.',
       'A supplier may not publish a testimonial unless it can establish that it "was previously made or '
       'published by the person by whom the test was made or the testimonial was given", or that before '
       'publication "it was approved and permission to make or publish it was given in writing".',
       FCCPA, 's.126(1)-(2)', FCCPA_HUB, 'primary statute', 'verified', [7, 10, 11],
       'Writing a plausible-sounding customer quote, or lightly editing one for a slide.',
       'Permission must be in writing and the wording must match what was approved.'),
    _f('NG-FCCPA-06',
       'Consumer-facing notices and information must be in plain, understandable language.',
       'Information must be "in plain language" if no form is prescribed — the test being whether an ordinary '
       'consumer with "average literacy skills and minimal experience" could understand "without undue effort".',
       FCCPA, 's.114(1)-(2)', FCCPA_HUB, 'primary statute', 'verified', [1, 2, 6, 11],
       'Burying cover conditions or turnaround terms in jargon and fine print.'),
    _f('NG-FCCPA-07',
       'A displayed price is binding, and the lowest displayed price wins.',
       'A supplier "shall not require a consumer to pay a price for any goods or services higher than the '
       'displayed price", and where more than one price is displayed, not higher than "the lower or lowest of '
       'the prices so displayed".',
       FCCPA, 's.115(1), s.115(3)', FCCPA_HUB, 'primary statute', 'verified', [10, 11],
       'Posting "from ₦X" then quoting higher, or leaving two conflicting prices live.'),
    _f('NG-FCCPA-08',
       'Terms that strip a consumer\'s statutory rights are void.',
       '"All sales final", blanket no-refund and similar terms are void to the extent they waive or deprive a '
       'consumer of a right set out in the Act.',
       FCCPA, 's.129(1)(b)(i), s.129(2)', FCCPA_HUB, 'primary statute', 'verified', [10, 11],
       'Copying a "no refunds" policy line into a service caption.'),
    _f('NG-FCCPC-01',
       'The consumer regulator actively inspects markets for description and quantity mismatches.',
       'The Commission has publicly reported enforcement against traders selling goods that did not match '
       'their declared descriptions and quantities, citing ss.123 and 125 of the FCCPA.',
       'FCCPC enforcement releases', 'reported 2025', 
       'https://fccpc.gov.ng/consumers/consumer-rights-responsibilities/rights-responsibilities/',
       'regulator', 'verified-secondary', [1, 10],
       'Treating an inaccurate product description as a private customer-service matter.',
       'Use as evidence that enforcement happens in practice. It is not a prediction about any specific '
       'business or sector.'),

    # ---------- Nigeria: data protection (NDPA) ----------
    _f('NG-NDPA-01',
       'Personal data must be processed fairly, for stated purposes, and kept to the minimum needed.',
       'Principles require processing that is "fair, lawful and transparent"; collected "for specified, '
       'explicit, and legitimate purposes"; "adequate, relevant, and limited to the minimum necessary"; kept '
       'no longer than necessary; accurate; and secure.',
       NDPA, 's.24(1)(a)-(f)', NDPA_URL, 'primary statute', 'verified', [6, 9, 11],
       'A booking form that asks for a phone number, address and ID "in case we need it".'),
    _f('NG-NDPA-02',
       'There must be a lawful basis for processing — consent is only one of them.',
       'Processing is lawful where the data subject consented, or where necessary for a contract, a legal '
       'obligation, vital interests, a public-interest task, or legitimate interests that do not override the '
       'person\'s rights.',
       NDPA, 's.25(1), s.25(2)', NDPA_URL, 'primary statute', 'verified', [6, 9],
       'Assuming every data question is solved by adding a consent checkbox.'),
    _f('NG-NDPA-03',
       'Consent must be affirmative; silence or a pre-ticked box is not consent.',
       'The controller "shall bear the burden of proof" for consent; "silence or inactivity ... shall not '
       'constitute consent"; consent "shall be in the affirmative, and not based on a pre-selected confirmation".',
       NDPA, 's.26(1), s.26(3), s.26(7)', NDPA_URL, 'primary statute', 'verified', [6, 9],
       'Pre-ticked "I agree to receive offers" boxes, or counting a form submission as marketing consent.'),
    _f('NG-NDPA-04',
       'People must be told what you do with their data, in a privacy notice they can actually read.',
       'Before collecting data the controller must give its identity and contact, the lawful basis and '
       'purposes, recipients, the person\'s rights, the retention period, the right to complain to the '
       'Commission, and any automated decision-making — "in a privacy policy and expressed in clear, concise, '
       'transparent, intelligible, and easily accessible format".',
       NDPA, 's.27(1), s.27(3)', NDPA_URL, 'primary statute', 'verified', [6, 9, 11],
       'Collecting WhatsApp enquiries with no stated purpose, retention or contact route.'),
    _f('NG-NDPA-05',
       'People can ask for a copy, correction, erasure or a pause on their data.',
       'Rights include confirmation and purposes of processing, "a copy of data subject\'s personal data in a '
       'commonly used electronic format", correction or deletion of inaccurate data, erasure "without undue '
       'delay", and restriction of processing.',
       NDPA, 's.34(1)(a)-(e)', NDPA_URL, 'primary statute', 'verified', [6, 9, 11],
       'Having no route to answer "please delete my details" beyond asking the owner to remember.'),
    _f('NG-NDPA-06',
       'Withdrawing consent must be as easy as giving it, and opting out of marketing must be honoured.',
       'A data subject "shall have the right to withdraw, at any time, consent"; the controller "shall ensure '
       'that it is as easy for the data subject to withdraw, as to give consent"; and where someone objects to '
       'direct marketing, "the personal data shall no longer be processed for such purposes".',
       NDPA, 's.35(1)-(2), s.36(3)-(4)', NDPA_URL, 'primary statute', 'verified', [9, 10, 11],
       'A broadcast list with no opt-out that anyone can actually use.'),
    _f('NG-NDPA-07',
       'People can refuse decisions made purely by an algorithm, and can demand a human look.',
       'A data subject has "the right not to be subject to a decision based solely on automated processing of '
       'personal data, including profiling, which produces legal or similar significant effects", with rights '
       'to "obtain human intervention", express a view, and contest the decision.',
       NDPA, 's.37(1), s.37(3)', NDPA_URL, 'primary statute', 'verified', [9],
       'An auto-reply that declines, prices, or rejects an enquiry with no human route.',
       'Applies to decisions with legal or similarly significant effects. A simple auto-acknowledgement is not '
       'the same thing — do not overstate this as "all automation needs human review".'),
    _f('NG-NDPA-08',
       'A personal data breach must be reported to the Commission within 72 hours.',
       'A controller shall, "within 72 hours of becoming aware of a breach which is likely to result in a risk '
       'to the rights and freedoms of individuals, notify the Commission", and must tell affected people where '
       'the risk is high.',
       NDPA, 's.40(2)-(3)', NDPA_URL, 'primary statute', 'verified', [9],
       'A leaked customer list with no plan and no notification route.'),
    _f('NG-NDPA-09',
       'Sending personal data outside Nigeria needs a documented legal basis.',
       'Transfer from Nigeria is not permitted unless the recipient is subject to a law, binding corporate '
       'rules, contractual clauses, code or certification affording adequate protection, or another condition '
       'applies — and the basis and adequacy must be recorded.',
       NDPA, 's.41(1)-(2), s.43(1)', NDPA_URL, 'primary statute', 'verified', [9],
       'Pasting customer details into whichever overseas tool is convenient, with no record of why it is allowed.'),
    _f('NG-NDPA-10',
       'Registration as a "controller of major importance" can trigger at a low volume threshold.',
       'The Commission designates a controller or processor of major importance where it keeps a filing system '
       'and "processes the personal data of more than Two-Hundred (200) data subjects in six (6) months", or '
       'operates in listed sectors including financial, health, hospitality, e-commerce and education — with '
       'fees by category (N250,000 at the top level).',
       NDPC_GN, 'para 1(1)(a)-(c), para 3', NDPC_GN_URL, 'regulator', 'verified', [9, 10, 11],
       'Assuming data-protection obligations are only for big companies. A small clinic or school can qualify.',
       'Thresholds and fee categories are set by guidance and can change. Re-check the Commission\'s current '
       'notice before telling any business it must or must not register.'),

    # ---------- Platform rules ----------
    _f('PL-META-01',
       'Meta ad copy must not assert or imply a person\'s private attributes.',
       'Ads "must not contain content that asserts or implies personal attributes", including race, religion, '
       'health, "vulnerable financial status", age, disability and criminal record; guidance shows "Do you '
       'have diabetes?" and "Are you bankrupt?" as prohibited, while "you/your" without an attribute is fine.',
       META_ADS + ' — Privacy Violations and Personal Attributes', 'policy page', META_ATTR,
       'platform policy', 'verified', [1, 3, 9, 10],
       '"Struggling to get customers?" / "Tired of debt?" style targeting that names the reader\'s situation '
       'as if the advertiser knows it.',
       'This governs ads. Organic posts are held to the Community Standards, which are related but not '
       'identical. Do not describe this as a rule for all organic copy.'),
    _f('PL-META-02',
       'Music in commercial or brand content on Meta needs a licence you hold.',
       '"Use of music for commercial or non-personal purposes in particular is prohibited unless you have '
       'obtained appropriate licenses." Content with someone else\'s music "may be blocked, muted or removed"; '
       'guidance favours shorter clips, lower music density, and always a visual component.',
       'Meta Music Guidelines (effective 26 March 2024)', 'full page',
       'https://www.facebook.com/legal/music_guidelines', 'platform policy', 'verified', [9, 10],
       'Adding a trending song to a business Reel and calling it "free to use because it is in the app".'),
    _f('PL-META-03',
       'Ad review is automated first, usually inside 24 hours, and ads can be re-reviewed at any time.',
       'Review "relies primarily on automated tools" and "is typically completed within 24 hours"; ads "remain '
       'subject to review and re-review" and may be rejected later; advertisers must also comply with local '
       'laws and, where applicable, self-regulatory advertising codes.',
       META_ADS, 'sections 2-3', 'https://transparency.meta.com/policies/ad-standards/',
       'platform policy', 'verified', [7, 10],
       'Treating an ad approval as permanent, or assuming Meta checks local law for you.'),
    _f('PL-WA-01',
       'WhatsApp business messaging requires opt-in, and free-form replies only inside a 24-hour window.',
       'You may only contact people who gave their number and opted in; business-initiated messages must use '
       'an approved template; you may reply without a template "within the 24-hour customer service window"; '
       'and automated replies need "prompt, clear, and direct escalation paths".',
       'WhatsApp Business Messaging Policy', 'sections 1-2',
       'https://whatsappbusiness.com/policy/', 'platform policy', 'verified', [6, 9],
       'Importing a phone book into a broadcast tool, or auto-replying with no way to reach a person.'),
    _f('PL-TT-01',
       'TikTok separates personal-use sounds from a pre-cleared commercial library, scoped to TikTok.',
       'Business accounts are directed to the Commercial Music Library; commercial-use rights are described as '
       'covering TikTok placements only, with per-track "usable placements" listed, so cross-posting needs '
       'separate clearance.',
       'TikTok Commercial Music Library terms, as summarised in music-licensing commentary',
       'licensing scope',
       'https://luminaclippers.com/blog/tiktok-commercial-music-library',
       'secondary commentary', 'verified-secondary', [9, 10],
       'Assuming a sound cleared on TikTok is cleared for the same video on Reels or the client\'s website.',
       'TikTok\'s own terms were not retrieved for this register (blocked on 2026-11-10). Confirm in TikTok\'s '
       'current Music Terms before relying on any placement claim.'),
    _f('PL-LI-01',
       'LinkedIn Page scheduling needs a Page admin role and has format limits.',
       'Reported: a super admin or content admin can schedule Page posts from one hour to three months ahead; '
       'events, polls, reshares, multiple-photo posts and service posts cannot be scheduled natively.',
       'LinkedIn Help — scheduled posts for Pages, as summarised in practitioner guides',
       'scheduling limits', 'https://www.linkedin.com/help/linkedin/answer/a547681',
       'secondary commentary', 'unverified', [6, 7],
       'Promising a client a queued carousel when the format or the role does not support it.',
       'LinkedIn Help would not load on 2026-11-10. Confirm the role and format limits in the actual account '
       'before promising any timetable.'),

    # ---------- Repository evidence (not external claims) ----------
    _f('REPO-03',
       'Brand typefaces are licensed for commercial use under the SIL Open Font License 1.1.',
       'Fraunces, Inter and JetBrains Mono are published under SIL OFL 1.1, which permits commercial use, '
       'embedding and redistribution in exported graphics. The rendered assets use fixed-weight TTF '
       'instances converted from the fontsource distribution.',
       'SIL Open Font License 1.1 (Fraunces, Inter, JetBrains Mono)', 'licence text',
       'https://openfontlicense.org/', 'licence', 'verified', [6, 7, 10, 11],
       'Treating the font question as unresolved when it is in fact resolved by an open licence.',
       'OFL covers the typefaces, not the logo, photography or any Canva Sans reference elsewhere. '
       'Those remain separate.'),
    _f('REPO-04',
       'The site sells nine packs at a single published price of ₦5,000 each, delivered over WhatsApp.',
       '`client/src/data/offers.ts` exports OFFER_PRICE = 5000 and nine offers, each with a keyword. '
       'Every buy button reads "Message {KEYWORD} on WhatsApp" and the contact number is +234 905 069 0837. '
       'There is no online checkout and nothing is downloadable from the site; files are sent on WhatsApp '
       'after payment is confirmed. `TOTAL_VALUE` (₦297,500) is declared in the file header as an estimate of '
       'replacement cost (hours x RATE), explicitly "not previous selling prices".',
       'client/src/data/offers.ts, client/src/pages/Offers.tsx', 'OFFER_PRICE, OFFERS, waLink',
       'client/src/data/offers.ts', 'repository evidence', 'verified', [10],
       'Quoting a price from memory or from an older brief, or implying the ₦297,500 figure was ever charged.',
       'The site data is the source of the figure, not a legal review of the offer terms. If the price changes '
       'on the site, this register row is out of date until `offers_data.py` is re-run.'),
    _f('REPO-05',
       'Custom service work is deliberately unpriced on the site: it is quoted per brief, not sold as a pack.',
       'The offer FAQ states the ₦5,000 packs include no consultation, and that custom systems or websites are '
       '"a separate paid project" priced "for a range" on WhatsApp. The service pages list categories with no '
       'published figure. A pack is a fixed-price file set; a service is a scoped quote.',
       'client/src/data/offers.ts, client/src/pages/Offers.tsx', 'GENERAL_FAQ',
       'client/src/pages/Offers.tsx', 'repository evidence', 'verified', [10],
       'Advertising a ₦5,000 pack as though it included custom build work, which the FAQ rules out.',
       'A quote for custom work must not be published as a fixed price until the owner sets one.'),
    _f('MKT-01',
       '₦5,000 sits inside or below the published market range for comparable Nigerian digital guides and template packs.',
       'A 2026 pricing guide for African creators puts short guides and PDFs at ₦2,000-₦10,000, comprehensive '
       'workbooks at ₦8,000-₦25,000 and template packs of 3-10 items at ₦3,000-₦20,000. Each Easywurld pack is a '
       'guide plus three editable files, so ₦5,000 is at the low end of the template-pack band and inside the guide band.',
       'Digital Products for African Creators: From Idea to First Sale (Kobocourse, 2026)', 'pricing benchmarks',
       'https://kobocourse.com/blog/digital-products-african-creators-idea-to-first-sale',
       'secondary commentary', 'verified-secondary', [10],
       'Pricing a guide from instinct, or claiming a pack is a discount against a "market price" nobody measured.',
       'A single commercial blog\'s ranges, not a statistical survey or a regulator\'s figure. It supports "inside a '
       'published range" and nothing stronger. It must never be used to imply a saving or a struck-through price.'),
    _f('REPO-01',
       'The logo and the Canva Sans reference in the older brief remain unverified; the typefaces now used are cleared.',
       'The repository contains the mark at client/public/brand/ with no provenance or licence record beside it. '
       'The v2 skill also references Canva Sans, a commercial face: it is not used in the rendered assets and is '
       'not covered by the OFL grant in REPO-03.',
       'marketing/operating-system-v2/skills/'
       'easywurld-human-intelligence-and-editorial-system/SKILL.md', 'section 2',
       'marketing/operating-system-v2/skills/easywurld-human-intelligence-and-editorial-system/SKILL.md',
       'repository evidence', 'verified', [6, 7, 10, 11],
       'Exporting carousels with a logo nobody can prove they own, or switching to Canva Sans without a licence.'),
    _f('REPO-02',
       'The December track is generated copy, and its own checker says so.',
       '`build_calendar.py` states "Structural QA != human approval"; `check.py` states "Passing does not mean '
       'claims/design/approval passed G1-G4". 330 packages / 2,040 slide blocks / 0 rendered assets.',
       'marketing/operating-system-v2/{build_calendar.py,check.py}', 'module docstrings',
       'marketing/operating-system-v2/check.py', 'repository evidence', 'verified', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
       'Anyone re-reading a generated caption as though a person had signed it off.'),
]

FACT_BY_ID = {f['fact_id']: f for f in FACTS}

# --------------------------------------------------------------------------
# Slot -> facts. Series-level base, plus sector-level additions.
# --------------------------------------------------------------------------

SERIES_BASE = {
    1: ['NG-ARCON-02', 'NG-FCCPA-01', 'NG-FCCPA-03', 'REPO-02'],
    2: ['NG-FCCPA-01', 'NG-FCCPA-06', 'PL-META-01'],
    3: ['NG-FCCPA-01', 'NG-ARCON-02', 'PL-META-01'],
    4: ['NG-FCCPA-01', 'NG-FCCPA-02', 'PL-META-01'],
    5: ['REPO-02', 'NG-ARCON-01', 'NG-FCCPA-02'],
    6: ['NG-NDPA-04', 'PL-WA-01', 'PL-LI-01', 'NG-ARCON-03'],
    7: ['NG-FCCPA-02', 'NG-FCCPA-03', 'NG-FCCPA-04', 'NG-FCCPA-05', 'PL-META-03'],
    8: ['NG-FCCPA-01', 'NG-FCCPA-02', 'REPO-02'],
    9: ['NG-NDPA-07', 'NG-NDPA-01', 'NG-NDPA-09', 'NG-NDPA-08', 'PL-WA-01', 'NG-NDPA-03'],
    10: ['REPO-04', 'REPO-05', 'NG-FCCPA-01', 'NG-FCCPA-07', 'NG-FCCPA-08', 'NG-ARCON-02', 'MKT-01'],
    11: ['NG-FCCPA-05', 'NG-FCCPA-06', 'NG-NDPA-05', 'NG-NDPA-06', 'REPO-01'],
}

# Sectors whose drafts touch a regulated or safety-sensitive area.
SECTOR_FACTS = {
    'independent optician': ['NG-ARCON-02', 'PL-META-01'],
    'independent dental lab': ['NG-NDPA-01', 'NG-NDPA-04'],
    'private music teacher': ['NG-NDPA-03'],
    'local theatre school': ['NG-NDPA-03', 'NG-FCCPA-05'],
    'pet boarding service': ['NG-FCCPA-06'],
    'solar maintenance team': ['NG-ARCON-02', 'NG-FCCPA-04'],
    'organic spice seller': ['NG-ARCON-02', 'NG-FCCPA-01'],
    'handmade candle store': ['NG-ARCON-02'],
    'small cold-chain courier': ['NG-FCCPA-06'],
    'juice-prep business': ['NG-NDPA-03', 'NG-FCCPA-06'],
    'artisan bread subscription': ['NG-NDPA-06', 'NG-FCCPA-07'],
    'remote bookkeeping practice': ['NG-NDPA-04', 'NG-NDPA-09'],
    'language translation studio': ['NG-NDPA-09', 'NG-NDPA-04'],
    'storage-locker operator': ['NG-NDPA-04'],
    'ceramic tile dealer': ['NG-FCCPA-07'],
}


def refs_for(series_number, sector):
    """Ordered, de-duplicated fact ids for one draft slot. Deterministic."""
    ordered = list(SERIES_BASE.get(series_number, []))
    for fid in SECTOR_FACTS.get(sector, []):
        if fid not in ordered:
            ordered.append(fid)
    return ordered[:9]


def verify_line(refs):
    return ' | '.join(refs)


# --------------------------------------------------------------------------
# Writers
# --------------------------------------------------------------------------

CSV_FIELDS = ['fact_id', 'statement', 'instrument', 'pinpoint', 'url', 'tier',
              'confidence', 'jurisdiction', 'checked', 'series', 'prevents',
              'caveat', 'detail']


def write_register():
    OUT.mkdir(exist_ok=True)
    path = OUT / '01_FACT_REGISTER.csv'
    with path.open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        w.writeheader()
        for fact in FACTS:
            w.writerow({k: fact.get(k, '') for k in CSV_FIELDS})
    return path


SERIES_NAME = {
    1: 'Marketing diagnosis',
    2: 'Marketing education',
    3: 'Marketing myths and truths',
    4: 'Relatable enemy / common ground',
    5: 'If I were hired today',
    6: 'The Easywurld client process',
    7: 'Proof and practical demonstration',
    8: 'Growth strategy and copywriting breakdowns',
    9: 'AI and business automation',
    10: 'Offer and solution',
    11: 'Meet Easywurld: brand and beliefs',
}

UNBLOCK = {
    'NG-ARCON-06': 'Read ARCON\'s current vetting guidelines, or a signed note from a lawyer or registered '
                   'practitioner confirming the procedure and fees.',
    'NG-ARCON-07': 'A dated primary statement from ARCON or a court, plus the owner\'s decision on whether to '
                   'vet before posting. Until then, no draft may state a settled scope.',
    'NG-FCCPC-01': 'Not needed for use as background. Cite it as a Commission release, never as a prediction '
                   'about a specific sector.',
    'PL-TT-01': 'Read TikTok\'s current Music Terms and the per-track "usable placements" for the specific track.',
    'PL-LI-01': 'Check the admin role and the format limit inside the actual Page, then record the screenshot '
                'date.',
}

SERIES_NOTE = {
    1: 'Diagnosis posts tell an owner where a buying detail is missing. The risk is inventing a problem '
       'and calling it a finding. Every claim about a business must stay labelled illustrative; every '
       'statement about what a seller may say is anchored in FCCPA s.123 and ARCON\'s truthfulness objective.',
    2: 'Teaching posts are the highest-risk for accidental pseudo-law. Explain a consumer-protection or '
       'plain-language principle, cite the instrument, and keep the "apply it" step advisory rather than '
       'regulatory advice.',
    3: 'Myth posts must not swap one confident falsehood for another. A myth is only "busted" when a statute '
       'or regulator supports the correction; otherwise the slide says the claim is conditional.',
    4: 'Common-ground posts use the buyer\'s frustration. Never turn a buyer\'s situation into a stated '
       'personal attribute — that is both a Meta ad rule and a decency question.',
    5: 'Hypothetical briefs must be labelled twice: hypothetical, and not a client case. No invented result, '
       'no invented brief, no invented testimonial.',
    6: 'Process posts describe a documented workflow. Do not say "approved", "certified" or "compliant" — the '
       'process produces evidence; the regulator or a named approver grants approval.',
    7: 'Proof posts are the easiest place to fabricate a result or a quote. FCCPA s.126 requires real words '
       'and written permission for any testimonial; s.123(1)(d) requires a test behind an efficacy claim.',
    8: 'Technique posts quote "before" copy. A before/after is an illustration, never a measured outcome. '
       'Say "illustrative rewrite", not "this doubled enquiries".',
    9: 'Automation posts need the data-protection frame: lawful basis, notice, human route, breach reporting '
       'and cross-border transfer. NDPA s.37 is narrowly about solely automated decisions with significant '
       'effects — do not overstate it.',
    10: 'Offer posts are the hardest gate. Price, scope, turnaround and availability must be confirmed by the '
        'owner before any draft with a bracketed placeholder is published. FCCPA ss.115, 123 and 129 bite here.',
    11: 'Belief posts carry the brand voice. They are low-fact but not exempt: any claim about what Easywurld '
        'does, has done, or guarantees is a commercial representation.',
}


def write_packets():
    OUT.mkdir(exist_ok=True)
    lines = [
        '# Draft fact packets — which research each series must carry',
        '',
        '**State: research attached, approval not granted.** These packets map the research register onto the '
        'eleven draft series. They exist so a reviewer can see, per slot, which real rule or policy the copy '
        'leans on and what still has to be confirmed by a named person.',
        '',
        'A packet is not a clearance. It records the source behind a claim; it does not decide that the claim '
        'is used well, that the design is readable, or that the post may be published.',
        '',
    ]
    for n in range(1, 12):
        base = SERIES_BASE[n]
        lines += [f'## Series {n:02d} — {SERIES_NAME[n]}', '', SERIES_NOTE[n], '',
                  '| Fact | What it establishes | Source | Pinpoint |', '|---|---|---|---|']
        for fid in base:
            f = FACT_BY_ID[fid]
            lines.append(f"| `{fid}` | {f['statement']} | {f['instrument']} | {f['pinpoint']} |")
        sector_rows = [(s, f) for s, f in SECTOR_FACTS.items() if any(x not in base for x in f)]
        if sector_rows:
            lines += ['', '**Sector additions** (applied when the draft uses that sector):', '']
            for sector, fids in sector_rows:
                added = [x for x in fids if x not in base]
                if added:
                    lines.append(f"- *{sector}*: " + ', '.join(f'`{x}`' for x in added))
        lines += ['', '**Hold back** in this series: anything named in the register\'s `prevents` column for the '
                      'facts above. If a caption needs a number, a date, a quotation or a rate, it waits for a '
                      'source row in the register first.', '', '---', '']

    lines += [
        '## Facts that must not be turned into copy yet',
        '',
        '| Fact | Why not | What would unblock it |', '|---|---|---|',
    ]
    with (OUT / '01_FACT_REGISTER.csv').open(newline='', encoding='utf-8') as fh:
        for row in csv.DictReader(fh):
            if row['confidence'] != 'verified':
                lines.append(f"| `{row['fact_id']}` | {row['caveat']} | "
                             f"{UNBLOCK.get(row['fact_id'], 'A primary source read and dated, or a named reviewer')} |")
    lines += ['', 'Every row marked `verified` still needs the document re-checked on the day a post goes out. '
                  'Statutes change, platform policies change faster, and this register is a snapshot dated '
                  f'{CHECKED}.', '']
    path = OUT / '03_DRAFT_FACT_PACKETS.md'
    path.write_text('\n'.join(lines), encoding='utf-8')
    return path


def write_checklist():
    OUT.mkdir(exist_ok=True)
    lines = [
        '# Owner verification checklist — what research cannot settle',
        '',
        f'Sources checked {CHECKED}. This page lists the decisions only the owner (or a named delegate) can make. '
        'Nothing here is an approval, and a tick is not a publication permission.',
        '',
        '## 1. Commercial facts Easywurld must supply',
        '',
        '| Item | Why it blocks release | Status |', '|---|---|---|',
        '| Current service list and which are actually available | Series 10 names service categories; the site is '
        'source code, not a live commercial promise | UNKNOWN — CONFIRM |',
        '| Prices, "from" prices and what is included | FCCPA s.115 makes a displayed price binding; s.123 makes '
        'an unclear scope misleading | UNKNOWN — CONFIRM |',
        '| Turnaround and delivery promises | An untested efficacy claim; s.123(1)(d) | UNKNOWN — CONFIRM |',
        '| Written permission for any client work, quote or result | FCCPA s.126 requires the real words and '
        'written permission | UNKNOWN — CONFIRM |',
        '| Enquiry route (WhatsApp number, email, form) and who answers it | A CTA with no destination is a dead '
        'end; WhatsApp rules also apply | UNKNOWN — CONFIRM |',
        '',
        '## 2. Regulatory position that needs a lawyer, not a draft',
        '',
        '| Question | Register rows | Why it matters |', '|---|---|---|',
        '| Does posting this carousel count as an "advertisement" needing pre-exposure clearance? | '
        '`NG-ARCON-03`, `NG-ARCON-06`, `NG-ARCON-07` | The penalty provision is real; the scope for organic social '
        'is the unsettled part |',
        '| If vetting applies, who is the registered practitioner and what does it cost? | `NG-ARCON-06` | '
        'Submission is not normally done by the advertiser alone |',
        '| Does any sector we discuss (health, education, financial) need its own regulator approval? | '
        '`NG-ARCON-06`, `NG-ARCON-02` | Sector approvals are a precondition for vetting |',
        '| Do we need to register as a data controller of major importance? | `NG-NDPA-10` | Thresholds are low '
        'and sector-based |',
        '',
        '## 3. Rights and production',
        '',
        '| Item | Register rows | Status |', '|---|---|---|',
        '| Font licence for every typeface in an exported carousel | `REPO-01` | NOT CLEARED |',
        '| Logo source and permission | `REPO-01` | NOT CLEARED |',
        '| Photography, illustrations and any likeness used | `NG-FCCPA-05` | NOT CLEARED |',
        '| Music, if any is added later | `PL-META-02`, `PL-TT-01` | DEFERRED — see 04_MUSIC_AND_RIGHTS_NOTE.md |',
        '| Named release approver for G4 | — | NOT NAMED |',
        '',
        '## 4. Timetable and accounts',
        '',
        'Every draft still says `TIME PENDING`. There is no approved cadence, no verified admin role on any '
        'Page, and no confirmed queue. Register row `PL-LI-01` is itself unverified, so even the scheduling '
        'limits cannot be quoted to the owner yet.',
        '',
    ]
    path = OUT / '05_OWNER_VERIFICATION_CHECKLIST.md'
    path.write_text('\n'.join(lines), encoding='utf-8')
    return path


if __name__ == '__main__':
    a = write_register()
    b = write_packets()
    c = write_checklist()
    print(f'register: {len(FACTS)} facts -> {a.relative_to(ROOT)}')
    print(f'packets -> {b.relative_to(ROOT)}')
    print(f'checklist -> {c.relative_to(ROOT)}')
