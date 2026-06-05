import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

type SeedActivity = {
  scheduled_date: string;
  pillar: "mind" | "culture" | "craft";
  type: string;
  title: string;
  description: string;
  source?: string;
  url?: string;
  duration_min: number;
};

// Helper to add days to a date string
function d(base: string, offset: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

const START = "2026-06-04";

// Craft days: Mon/Wed/Fri (days 0,2,4 of each week = offset 0,2,4,7,9,11,...)
function isCraftDay(offset: number): boolean {
  return offset % 7 === 0 || offset % 7 === 2 || offset % 7 === 4;
}

const CURRICULUM: SeedActivity[] = [
  // ─── WEEK 1 (Jun 9–15): How the World Works — Poverty & Inequality ───────
  { scheduled_date: d(START, 0), pillar: "mind", type: "book", title: "Poor Economics — Introduction", description: "Read the introduction and first chapter. Banerjee and Duflo challenge everything you think you know about global poverty.", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 0), pillar: "culture", type: "lecture", title: "200 Countries, 200 Years, 4 Minutes", description: "Hans Rosling's iconic BBC visualisation of global development. The most memorable 4 minutes you'll spend this summer.", source: "BBC / Hans Rosling", url: "https://www.youtube.com/watch?v=jbkSRLYSojo", duration_min: 10 },
  { scheduled_date: d(START, 0), pillar: "craft", type: "reflection", title: "What do I already believe about poverty?", description: "Write freely for 10–15 minutes. What do you assume causes poverty? Where did those assumptions come from? No wrong answers.", duration_min: 15 },

  { scheduled_date: d(START, 1), pillar: "mind", type: "book", title: "Poor Economics — Ch 2: A Box of Bednets", description: "The debate between aid and incentives. Why do poor families sometimes not use free bednets?", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 1), pillar: "culture", type: "article", title: "The Trap of the Poverty Trap", description: "A short accessible piece on the big development economics debate underpinning Poor Economics.", source: "The Economist", url: "https://www.economist.com/finance-and-economics", duration_min: 25 },

  { scheduled_date: d(START, 2), pillar: "mind", type: "book", title: "Poor Economics — Ch 3: Low-Hanging Fruit", description: "Why aren't there more success stories in global health? On malaria, diarrhoea, and the politics of cheap solutions.", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 2), pillar: "culture", type: "lecture", title: "The Best Stats You've Ever Seen — Hans Rosling TED", description: "Rosling dismantles the developed vs. developing world binary with data and showmanship.", source: "TED / Hans Rosling", url: "https://www.youtube.com/watch?v=hVimVzgtD6w", duration_min: 20 },
  { scheduled_date: d(START, 2), pillar: "craft", type: "reflection", title: "What surprised me this week?", description: "What challenged your prior assumptions about poverty? Write 2–3 paragraphs on the most surprising thing you've learned.", duration_min: 15 },

  { scheduled_date: d(START, 3), pillar: "mind", type: "book", title: "Poor Economics — Ch 4: Top of the Class", description: "On education: why poor families sometimes pull kids out of school even when it's free, and what actually works.", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 3), pillar: "culture", type: "article", title: "Global Poverty: Facts and What to Do", description: "Brookings Institution overview of the current state of global poverty and evidence-based interventions.", source: "Brookings Institution", url: "https://www.brookings.edu/topic/global-poverty/", duration_min: 30 },

  { scheduled_date: d(START, 4), pillar: "mind", type: "book", title: "Poor Economics — Ch 5: Pak Sudarno's Big Family", description: "Family size, fertility decisions, and the poverty trap — why large families are sometimes rational.", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 4), pillar: "culture", type: "lecture", title: "Global Health: Achievements and Challenges", description: "WHO overview lecture on where global health has succeeded and where it has failed most egregiously.", source: "WHO / YouTube", url: "https://www.youtube.com/watch?v=OlMfBfFPl1o", duration_min: 35 },
  { scheduled_date: d(START, 4), pillar: "craft", type: "reflection", title: "A problem I want to understand better", description: "Identify one issue from this week's reading that you want to dig into more. Write a short paragraph on why it matters to you personally.", duration_min: 15 },

  { scheduled_date: d(START, 5), pillar: "mind", type: "book", title: "Poor Economics — Ch 6 & 7", description: "Risk, insurance, and the informal economy. How poor households manage financial shocks without safety nets.", source: "Banerjee & Duflo", duration_min: 55 },
  { scheduled_date: d(START, 5), pillar: "culture", type: "documentary", title: "13th — Part 1", description: "Ava DuVernay's essential documentary on race, justice, and mass incarceration in the US. Watch the first 45 minutes.", source: "Netflix", url: "https://www.netflix.com/title/80091741", duration_min: 45 },

  { scheduled_date: d(START, 6), pillar: "mind", type: "book", title: "Poor Economics — Conclusion & Review", description: "Finish the book and reread your highlights. What is the central argument? Do you agree?", source: "Banerjee & Duflo", duration_min: 50 },
  { scheduled_date: d(START, 6), pillar: "culture", type: "documentary", title: "13th — Part 2", description: "Finish the documentary. How does systemic inequality in the US connect to global inequality patterns?", source: "Netflix", url: "https://www.netflix.com/title/80091741", duration_min: 55 },

  // ─── WEEK 2 (Jun 16–22): Food, Hunger and Access ─────────────────────────
  { scheduled_date: d(START, 7), pillar: "mind", type: "book", title: "Educated — Ch 1–3", description: "Begin Tara Westover's memoir. A childhood defined by survivalism and isolation. Striking, immediate, and true.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 7), pillar: "culture", type: "lecture", title: "Food Security: The Silent Crisis", description: "World Food Programme overview of global food insecurity — who goes hungry and why.", source: "WFP / YouTube", url: "https://www.youtube.com/watch?v=rStL7niR7gs", duration_min: 30 },
  { scheduled_date: d(START, 7), pillar: "craft", type: "reflection", title: "What does food security mean to me?", description: "Write a personal reflection: when have you thought about where your food comes from? What does it mean to be truly food insecure?", duration_min: 15 },

  { scheduled_date: d(START, 8), pillar: "mind", type: "book", title: "Educated — Ch 4–7", description: "Westover's education begins to expand her world — and conflict with it. The tension between family loyalty and personal growth.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 8), pillar: "culture", type: "article", title: "The State of Food Security and Nutrition 2025", description: "FAO's annual report — the most authoritative data on world hunger. Read the executive summary and key findings.", source: "FAO / WFP / UNICEF", url: "https://www.fao.org/state-of-food-security-nutrition", duration_min: 30 },

  { scheduled_date: d(START, 9), pillar: "mind", type: "book", title: "Educated — Ch 8–12", description: "The scrape yard, the injuries, and the first glimpse of a different life. Westover begins to question the world she was raised in.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 9), pillar: "culture", type: "lecture", title: "Malala Yousafzai: My Story of Standing Up for Education", description: "Nobel laureate Malala on education as a human right — and what happens when it's denied.", source: "TED / Malala Yousafzai", url: "https://www.youtube.com/watch?v=3rNhZu3ttIU", duration_min: 20 },
  { scheduled_date: d(START, 9), pillar: "craft", type: "reflection", title: "Who has been most affected by what I've read?", description: "Think about a specific person — real or composite — whose life you've encountered in these pages. Write about them as if introducing them to someone who knows nothing.", duration_min: 15 },

  { scheduled_date: d(START, 10), pillar: "mind", type: "book", title: "Educated — Ch 13–17", description: "Westover gets into BYU against the odds. The dissonance of entering formal education with almost no schooling.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 10), pillar: "culture", type: "article", title: "Girls' Education: The Facts", description: "UNICEF data and analysis on the 130 million girls out of school worldwide — causes, consequences, and what works.", source: "UNICEF", url: "https://www.unicef.org/education/girls-education", duration_min: 25 },

  { scheduled_date: d(START, 11), pillar: "mind", type: "book", title: "Educated — Ch 18–22", description: "The costs of learning — on family, identity, and what education forces you to give up.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 11), pillar: "culture", type: "documentary", title: "He Named Me Malala — Part 1", description: "The documentary portrait of Malala Yousafzai. Watch the first half (45 min) — on her childhood and the Taliban's rise.", source: "Disney+/Documentary", url: "https://www.youtube.com/watch?v=3FeVMBMIBZI", duration_min: 45 },
  { scheduled_date: d(START, 11), pillar: "craft", type: "reflection", title: "A letter to my future self — Summer 2026", description: "Write a letter to yourself to open at the end of August. What do you hope you'll have learned, changed, or decided? Be honest.", duration_min: 20 },

  { scheduled_date: d(START, 12), pillar: "mind", type: "book", title: "Educated — Ch 23–27", description: "Cambridge, the PhD, and the final break with her family. The hardest part of the book — and perhaps the most important.", source: "Tara Westover", duration_min: 55 },
  { scheduled_date: d(START, 12), pillar: "culture", type: "documentary", title: "He Named Me Malala — Part 2", description: "Finish the documentary. On advocacy, survival, and what it means to turn personal trauma into structural change.", source: "Documentary", duration_min: 45 },

  { scheduled_date: d(START, 13), pillar: "mind", type: "book", title: "Educated — Final Chapters & Reflection", description: "Finish Educated. Reread the first and last pages. Write three words that describe how it made you feel.", source: "Tara Westover", duration_min: 50 },
  { scheduled_date: d(START, 13), pillar: "culture", type: "lecture", title: "Ken Robinson: Do Schools Kill Creativity?", description: "Still the most-watched TED talk ever. A provocative case that education systems suppress the very qualities we most need.", source: "TED / Ken Robinson", url: "https://www.youtube.com/watch?v=iG9CE55wbtY", duration_min: 20 },

  // ─── WEEK 3 (Jun 23–29): Wrapping Up Global Systems ─────────────────────
  { scheduled_date: d(START, 14), pillar: "mind", type: "book", title: "Factfulness — Introduction & Ch 1", description: "Hans Rosling's final book. Start with the intro and the Ignorance Test — how much do you actually know about the world?", source: "Hans Rosling", duration_min: 55 },
  { scheduled_date: d(START, 14), pillar: "culture", type: "lecture", title: "Amartya Sen on Justice and Global Inequality", description: "Sen's lecture on justice as capability — why GDP is not enough to measure human flourishing.", source: "LSE / Amartya Sen", url: "https://www.youtube.com/watch?v=VCUmVNXBCNQ", duration_min: 40 },
  { scheduled_date: d(START, 14), pillar: "craft", type: "reflection", title: "Three weeks in — what's changed?", description: "What do you now think differently about? Pick one belief you held at the start that has shifted. How and why did it shift?", duration_min: 20 },

  { scheduled_date: d(START, 15), pillar: "mind", type: "book", title: "Factfulness — Ch 2 & 3: The Negativity & Straight Line Instinct", description: "Why humans systematically believe the world is getting worse — and why that's wrong. The gap instinct.", source: "Hans Rosling", duration_min: 55 },
  { scheduled_date: d(START, 15), pillar: "culture", type: "article", title: "The World Is Not Falling Apart", description: "Pinker and Mack on why crime, violence, and poverty are declining globally despite our perception to the contrary.", source: "Slate / Pinker & Mack", url: "https://slate.com/news-and-politics/2014/12/the-world-is-not-falling-apart-the-trend-lines-reveal-an-increasingly-peaceful-period-in-history.html", duration_min: 25 },

  { scheduled_date: d(START, 16), pillar: "mind", type: "book", title: "Factfulness — Ch 4–6", description: "The fear, size, and generalisation instincts. How our brains mislead us about risk, scale, and difference.", source: "Hans Rosling", duration_min: 55 },
  { scheduled_date: d(START, 16), pillar: "culture", type: "lecture", title: "Paul Collier: New Rules for Rebuilding a Broken Nation", description: "Oxford economist on the 'bottom billion' — the countries left behind by globalisation and what it would take to fix it.", source: "TED / Paul Collier", url: "https://www.youtube.com/watch?v=8oTSGxLVE9c", duration_min: 20 },
  { scheduled_date: d(START, 16), pillar: "craft", type: "reflection", title: "A system I would redesign", description: "Pick any system you've encountered in the last three weeks (education, food distribution, healthcare access). How would you redesign it? Think structurally — not just about symptoms.", duration_min: 20 },

  { scheduled_date: d(START, 17), pillar: "mind", type: "book", title: "Factfulness — Ch 7–10", description: "The destiny, single perspective, blame, and urgency instincts. The book's most practically useful section for a future change-maker.", source: "Hans Rosling", duration_min: 55 },
  { scheduled_date: d(START, 17), pillar: "culture", type: "article", title: "IFPRI Food Policy Research Report", description: "A flagship IFPRI report on food systems transformation — evidence-based, global in scope.", source: "IFPRI", url: "https://www.ifpri.org/publications", duration_min: 30 },

  { scheduled_date: d(START, 18), pillar: "mind", type: "book", title: "Factfulness — Final Chapter & Outro", description: "Finish. Rosling's 'factful framework' — 10 instincts to control. Which one are you most prone to?", source: "Hans Rosling", duration_min: 45 },
  { scheduled_date: d(START, 18), pillar: "culture", type: "lecture", title: "Jeffrey Sachs on Ending Extreme Poverty", description: "The Columbia economist makes the case that extreme poverty can be ended within a generation — and the political barriers to doing so.", source: "Columbia University", url: "https://www.youtube.com/watch?v=PK_a7RCo-Cs", duration_min: 45 },
  { scheduled_date: d(START, 18), pillar: "craft", type: "reflection", title: "My compass for the summer", description: "You've spent three weeks on global systems. What values have emerged? Write 5 sentences — one per value — about what you believe.", duration_min: 20 },

  { scheduled_date: d(START, 19), pillar: "mind", type: "article", title: "The Broken Ladder: How Inequality Affects the Mind", description: "Scientific American piece on the psychological effects of inequality — how it shapes cognition, behaviour, and aspiration.", source: "Scientific American", url: "https://www.scientificamerican.com/article/the-broken-ladder/", duration_min: 30 },
  { scheduled_date: d(START, 19), pillar: "culture", type: "documentary", title: "Living on One Dollar", description: "Four college students live on $1 a day for 56 days in rural Guatemala. Direct, human, and uncomfortable.", source: "YouTube/Documentary", url: "https://www.youtube.com/watch?v=5SBQ5-YkpGU", duration_min: 55 },

  { scheduled_date: d(START, 20), pillar: "mind", type: "article", title: "Why Nations Fail — Key Arguments", description: "Read a long-form summary of Acemoglu and Robinson's thesis: institutions, not geography or culture, determine prosperity.", source: "Acemoglu & Robinson (summary)", url: "https://whynationsfail.com/blog/", duration_min: 40 },
  { scheduled_date: d(START, 20), pillar: "culture", type: "lecture", title: "Esther Duflo: Social Experiments to Fight Poverty", description: "Duflo's Nobel lecture on randomised controlled trials in development economics — how we actually know what works.", source: "TED / Esther Duflo", url: "https://www.youtube.com/watch?v=0zvrGiPkVcs", duration_min: 20 },

  // ─── WEEK 4 (Jun 30–Jul 6): Healthcare Access ────────────────────────────
  { scheduled_date: d(START, 21), pillar: "mind", type: "book", title: "Mountains Beyond Mountains — Part 1", description: "Begin Tracy Kidder's portrait of Paul Farmer — the Harvard physician who dedicated his life to treating the poorest people in the world in Haiti.", source: "Tracy Kidder", duration_min: 55 },
  { scheduled_date: d(START, 21), pillar: "culture", type: "lecture", title: "Paul Farmer: Reimagining Global Health", description: "Farmer's own lecture on what it means to provide preferential care to the poor — the ethical and structural case.", source: "Harvard / Paul Farmer", url: "https://www.youtube.com/watch?v=mLHdKKe5gE8", duration_min: 50 },
  { scheduled_date: d(START, 21), pillar: "craft", type: "reflection", title: "What does access to healthcare actually mean?", description: "Not the policy definition — what does it mean for a person? Write it from the perspective of someone who doesn't have it.", duration_min: 15 },

  { scheduled_date: d(START, 22), pillar: "mind", type: "book", title: "Mountains Beyond Mountains — Part 2", description: "The early years of Partners in Health. How Farmer and Kim built a healthcare system where none existed.", source: "Tracy Kidder", duration_min: 55 },
  { scheduled_date: d(START, 22), pillar: "culture", type: "documentary", title: "Living in Emergency: Stories of Doctors Without Borders", description: "Four MSF doctors in the field in Liberia and Congo. Raw and essential.", source: "Documentary/YouTube", url: "https://www.youtube.com/watch?v=pSFGSRUeMUA", duration_min: 45 },

  { scheduled_date: d(START, 23), pillar: "mind", type: "book", title: "Mountains Beyond Mountains — Part 3", description: "The global fight against TB and the politics of WHO drug policy. Farmer vs. the establishment.", source: "Tracy Kidder", duration_min: 55 },
  { scheduled_date: d(START, 23), pillar: "culture", type: "lecture", title: "Atul Gawande: How Do We Heal Medicine?", description: "The surgeon and writer on the failure of modern healthcare systems — fragmentation, cost, and the checklist solution.", source: "TED / Atul Gawande", url: "https://www.youtube.com/watch?v=L3QkaS249Bc", duration_min: 20 },
  { scheduled_date: d(START, 23), pillar: "craft", type: "reflection", title: "A leader who inspired me this week", description: "Write about one person — from this week's reading or elsewhere — whose leadership style resonates with you. What specifically are they doing right?", duration_min: 15 },

  { scheduled_date: d(START, 24), pillar: "mind", type: "book", title: "Mountains Beyond Mountains — Part 4", description: "Russia and MDR-TB. Farmer scales up. The tension between pragmatism and principle.", source: "Tracy Kidder", duration_min: 55 },
  { scheduled_date: d(START, 24), pillar: "culture", type: "article", title: "Universal Health Coverage: Why It Matters", description: "WHO flagship report on UHC — what it means, who lacks it, and what it would cost to achieve it globally.", source: "WHO", url: "https://www.who.int/health-topics/universal-health-coverage", duration_min: 30 },

  { scheduled_date: d(START, 25), pillar: "mind", type: "book", title: "Mountains Beyond Mountains — Finish", description: "Complete the book. Sit with Kidder's final passages. What do they say about ambition, sacrifice, and the limits of one person's impact?", source: "Tracy Kidder", duration_min: 55 },
  { scheduled_date: d(START, 25), pillar: "culture", type: "film", title: "Dallas Buyers Club", description: "The true story of Ron Woodroof and the fight for HIV medication access in the US. About systems, bureaucracy, and survival.", source: "Film (Amazon/Apple)", duration_min: 117 },
  { scheduled_date: d(START, 25), pillar: "craft", type: "reflection", title: "What would I sacrifice for something I believed in?", description: "Farmer gave almost everything. Write honestly: what are you willing to give up for the causes you care about? What are you not willing to give up?", duration_min: 20 },

  { scheduled_date: d(START, 26), pillar: "mind", type: "book", title: "The Checklist Manifesto — Ch 1–4", description: "Atul Gawande on the profound power of a simple checklist. Starts in surgery, ends everywhere.", source: "Atul Gawande", duration_min: 55 },
  { scheduled_date: d(START, 26), pillar: "culture", type: "article", title: "The Global Health Crisis We're Ignoring", description: "The Lancet Commission on healthcare access — a rigorous, data-heavy read on what 'access' actually requires.", source: "The Lancet", url: "https://www.thelancet.com/commissions/healthcare-access", duration_min: 35 },

  { scheduled_date: d(START, 27), pillar: "mind", type: "book", title: "The Checklist Manifesto — Ch 5–8 & Finish", description: "From aviation to construction to surgery: the evidence that checklists save lives. A short, easy, powerful book.", source: "Atul Gawande", duration_min: 55 },
  { scheduled_date: d(START, 27), pillar: "culture", type: "lecture", title: "Jim Kim: The Case for Universal Health Coverage", description: "Former World Bank president on the economics of investing in global health — why it pays and what's stopping us.", source: "World Bank", url: "https://www.youtube.com/watch?v=oKKVivYGRfU", duration_min: 30 },

  // ─── WEEK 5 (Jul 7–13): Pandemic, Disease and Society ────────────────────
  { scheduled_date: d(START, 28), pillar: "mind", type: "book", title: "Being Mortal — Introduction & Ch 1–2", description: "Atul Gawande on medicine and ageing. What are we actually trying to achieve — survival, or a good life?", source: "Atul Gawande", duration_min: 55 },
  { scheduled_date: d(START, 28), pillar: "culture", type: "lecture", title: "How We Can Prevent Pandemics", description: "Bill Gates 2022 lecture on what a proper pandemic preparedness system looks like and what the world failed to build.", source: "MIT / Bill Gates", url: "https://www.youtube.com/watch?v=pMibwxBNvBU", duration_min: 40 },
  { scheduled_date: d(START, 28), pillar: "craft", type: "reflection", title: "If I designed a global health system from scratch...", description: "Ignore current constraints. What would a fair, effective global health system look like? Write a 3-paragraph vision.", duration_min: 20 },

  { scheduled_date: d(START, 29), pillar: "mind", type: "book", title: "Being Mortal — Ch 3–5", description: "The rise of the nursing home. What we traded away when medicine prioritised length of life over quality of life.", source: "Atul Gawande", duration_min: 55 },
  { scheduled_date: d(START, 29), pillar: "culture", type: "article", title: "After COVID-19: What Comes Next for Global Health?", description: "An evidence-based assessment of the pandemic's legacy on global health systems and what structural reforms are needed.", source: "The Lancet", url: "https://www.thelancet.com", duration_min: 30 },

  { scheduled_date: d(START, 30), pillar: "mind", type: "book", title: "Being Mortal — Ch 6–8 & Finish", description: "Gawande confronts his own father's illness. The hardest chapter — on what a good death looks like and how to have a better conversation about it.", source: "Atul Gawande", duration_min: 55 },
  { scheduled_date: d(START, 30), pillar: "culture", type: "lecture", title: "Ezekiel Emanuel: Why I Hope to Die at 75", description: "A controversial and thoughtful argument about medicine, ageing, and what we're really optimising for. Provocative by design.", source: "The Atlantic / YouTube", url: "https://www.youtube.com/watch?v=3U5TxOIUFz0", duration_min: 25 },
  { scheduled_date: d(START, 30), pillar: "craft", type: "reflection", title: "What does a good life look like?", description: "Not a good career. A good life. This is a big question — write your first instinct, then push past it. What would you sacrifice a longer life for?", duration_min: 20 },

  { scheduled_date: d(START, 31), pillar: "mind", type: "article", title: "MSF: Why We Are Witnessing a Healthcare Crisis in Gaza", description: "A frontline medical perspective on conflict and healthcare collapse — one of the most urgent crises of 2026.", source: "Médecins Sans Frontières", url: "https://www.msf.org", duration_min: 25 },
  { scheduled_date: d(START, 31), pillar: "culture", type: "article", title: "The Moral Determinants of Health", description: "Michael Marmot's argument that health is fundamentally a social and political issue — not just a medical one.", source: "The Lancet", url: "https://www.thelancet.com", duration_min: 30 },

  { scheduled_date: d(START, 32), pillar: "mind", type: "article", title: "What the World Got Wrong on COVID-19", description: "A rigorous post-mortem on pandemic response — what failed, what worked, and what needs to change.", source: "Foreign Affairs", url: "https://www.foreignaffairs.com", duration_min: 35 },
  { scheduled_date: d(START, 32), pillar: "culture", type: "article", title: "The Hidden Costs of Healthcare Inequality", description: "NEJM analysis of health disparities and the economic case for closing them.", source: "NEJM", url: "https://www.nejm.org", duration_min: 25 },

  { scheduled_date: d(START, 33), pillar: "mind", type: "article", title: "When the Doctor Is Out: Healthcare Access in Rural Africa", description: "A ground-level STAT News investigation into what healthcare looks like in places with one doctor per 50,000 people.", source: "STAT News", url: "https://www.statnews.com", duration_min: 30 },
  { scheduled_date: d(START, 33), pillar: "culture", type: "lecture", title: "Leana Wen: What Your Doctor Won't Disclose", description: "A physician on radical transparency in medicine and why patients deserve to know everything.", source: "TED / Leana Wen", url: "https://www.youtube.com/watch?v=vsUFCr3PVQY", duration_min: 18 },

  { scheduled_date: d(START, 34), pillar: "mind", type: "article", title: "The Ongoing Failure of Global Mental Health", description: "Mental health: the most underfunded, stigmatised area of global health. What would it take to change that?", source: "The Lancet", url: "https://www.thelancet.com", duration_min: 30 },
  { scheduled_date: d(START, 34), pillar: "culture", type: "lecture", title: "Vikram Patel: Mental Health for All", description: "The global mental health pioneer on why trained community members — not just psychiatrists — can treat depression.", source: "TED / Vikram Patel", url: "https://www.youtube.com/watch?v=eCBeDnMiVJs", duration_min: 16 },

  // ─── WEEK 6 (Jul 14–20): Biology, Genetics and the Future ────────────────
  { scheduled_date: d(START, 35), pillar: "mind", type: "book", title: "The Gene — Prologue & Part 1", description: "Siddhartha Mukherjee's sweeping history of genetics. Begins with Mendel and ends with CRISPR. The most important science of our era.", source: "Siddhartha Mukherjee", duration_min: 55 },
  { scheduled_date: d(START, 35), pillar: "culture", type: "lecture", title: "Jennifer Doudna: How CRISPR Lets Us Edit Our DNA", description: "The Nobel laureate who co-invented CRISPR explains how it works and what it means for medicine, agriculture, and human evolution.", source: "TED / Jennifer Doudna", url: "https://www.youtube.com/watch?v=TdBAHexVYzs", duration_min: 16 },
  { scheduled_date: d(START, 35), pillar: "craft", type: "reflection", title: "Should we edit the human genome?", description: "Write your position. Then argue the opposite. Then write where you actually land.", duration_min: 20 },

  { scheduled_date: d(START, 36), pillar: "mind", type: "book", title: "The Gene — Part 2: In the Sum of Its Parts", description: "The discovery of the double helix. The race between Watson, Crick, and Rosalind Franklin — and what that story reveals about science.", source: "Siddhartha Mukherjee", duration_min: 55 },
  { scheduled_date: d(START, 36), pillar: "culture", type: "documentary", title: "Human Nature — CRISPR Documentary", description: "The definitive documentary on CRISPR gene editing. Scientists, ethicists, patients, and the race to edit life itself.", source: "Netflix/YouTube", url: "https://www.youtube.com/watch?v=5ny9LoR7bRc", duration_min: 55 },

  { scheduled_date: d(START, 37), pillar: "mind", type: "book", title: "The Gene — Part 3 & 4", description: "The genetics of identity: schizophrenia, sexuality, intelligence. How genes interact with environment, culture, and politics.", source: "Siddhartha Mukherjee", duration_min: 55 },
  { scheduled_date: d(START, 37), pillar: "culture", type: "lecture", title: "Eric Lander: The Human Genome and the Future of Medicine", description: "MIT's leading genomics scientist on what the human genome project achieved and where the science goes next.", source: "MIT / Eric Lander", url: "https://www.youtube.com/watch?v=Gfkfq_KGxVw", duration_min: 50 },
  { scheduled_date: d(START, 37), pillar: "craft", type: "reflection", title: "The ethics of knowing vs. acting", description: "If you could know whether you carry a gene for Alzheimer's, would you want to? Write through the ethics of genetic knowledge — who owns it, who can use it.", duration_min: 20 },

  { scheduled_date: d(START, 38), pillar: "mind", type: "book", title: "The Gene — Part 5: Through the Looking Glass", description: "The history of eugenics — one of humanity's most grotesque misapplications of genetic science. Essential reading before we enter the CRISPR era.", source: "Siddhartha Mukherjee", duration_min: 55 },
  { scheduled_date: d(START, 38), pillar: "culture", type: "article", title: "CRISPR Babies: What Went Wrong in China", description: "The He Jiankui case — the first genetically edited human babies, created in secret, and the scientific community's response.", source: "MIT Technology Review", url: "https://www.technologyreview.com/2018/12/03/138024/exclusive-chinese-scientist-who-produced-genetically-altered-babies-confirms-second-pregnancy/", duration_min: 30 },

  { scheduled_date: d(START, 39), pillar: "mind", type: "book", title: "The Gene — Part 6 & Epilogue", description: "The future of the gene. Mukherjee's final vision — and his anxieties. A profound, disquieting ending.", source: "Siddhartha Mukherjee", duration_min: 55 },
  { scheduled_date: d(START, 39), pillar: "culture", type: "film", title: "Gattaca", description: "The 1997 film about a genetically stratified future. Watch it as a thought experiment: how plausible is this, and how soon?", source: "Film (streaming)", duration_min: 112 },
  { scheduled_date: d(START, 39), pillar: "craft", type: "reflection", title: "Halfway reflection — what kind of person am I becoming?", description: "You are halfway through the summer. Look back at your first reflections. What has shifted? Write a short 'state of me' — honestly.", duration_min: 25 },

  { scheduled_date: d(START, 40), pillar: "mind", type: "article", title: "The Promise and Peril of Synthetic Biology", description: "A nuanced account of synthetic biology — engineering organisms to produce medicine, food, and materials.", source: "Nature", url: "https://www.nature.com", duration_min: 35 },
  { scheduled_date: d(START, 40), pillar: "culture", type: "lecture", title: "George Church: Regenesis", description: "Harvard's genomics pioneer on resurrecting extinct species, extending human lifespan, and the outer limits of biotechnology.", source: "TED / George Church", url: "https://www.youtube.com/watch?v=5DFzHlpO_CY", duration_min: 20 },

  { scheduled_date: d(START, 41), pillar: "mind", type: "article", title: "AI and the Future of Drug Discovery", description: "How AI is transforming biotech — from AlphaFold to drug screening. What this means for the healthcare industry you're considering.", source: "Science / STAT News", url: "https://www.statnews.com/category/artificial-intelligence/", duration_min: 30 },
  { scheduled_date: d(START, 41), pillar: "culture", type: "article", title: "Against Longevity: The Case for Ageing", description: "A counterpoint to Silicon Valley's war on ageing — what we lose when we treat death as a disease to be cured.", source: "The Atlantic", url: "https://www.theatlantic.com", duration_min: 20 },

  // ─── WEEK 7 (Jul 21–27): Technology and Power ────────────────────────────
  { scheduled_date: d(START, 42), pillar: "mind", type: "book", title: "Bad Blood — Part 1", description: "John Carreyrou's account of Elizabeth Holmes and Theranos. Begin with the founding — how an extraordinary lie was built.", source: "John Carreyrou", duration_min: 55 },
  { scheduled_date: d(START, 42), pillar: "culture", type: "lecture", title: "Shoshana Zuboff: Surveillance Capitalism", description: "The defining lecture on how big tech profits from human behaviour — and what it means for democracy and autonomy.", source: "LSE / Shoshana Zuboff", url: "https://www.youtube.com/watch?v=hIXhnWUmMvw", duration_min: 50 },
  { scheduled_date: d(START, 42), pillar: "craft", type: "reflection", title: "Technology I would redesign", description: "Pick one technology you use every day. What assumptions is it built on? What does it optimise for? How would you redesign it if you could?", duration_min: 20 },

  { scheduled_date: d(START, 43), pillar: "mind", type: "book", title: "Bad Blood — Part 2", description: "The laboratory falls apart. The gap between the claims and the reality grows. How did so many intelligent people fail to see it?", source: "John Carreyrou", duration_min: 55 },
  { scheduled_date: d(START, 43), pillar: "culture", type: "documentary", title: "The Social Dilemma", description: "Former tech insiders on how social media algorithms are engineered to maximise addiction. Watch this after Zuboff.", source: "Netflix", url: "https://www.netflix.com/title/81254224", duration_min: 94 },

  { scheduled_date: d(START, 44), pillar: "mind", type: "book", title: "Bad Blood — Part 3", description: "The whistleblowers. The cover-up. The moment of reckoning. What enabled Holmes — and what finally stopped her.", source: "John Carreyrou", duration_min: 55 },
  { scheduled_date: d(START, 44), pillar: "culture", type: "film", title: "The Social Network", description: "The founding of Facebook. Watch it now as a case study in what happens when ambition, speed, and ethics don't collide — they just miss each other.", source: "Film (streaming)", duration_min: 120 },
  { scheduled_date: d(START, 44), pillar: "craft", type: "reflection", title: "What does ethical ambition look like?", description: "Both Zuckerberg and Holmes were extraordinarily driven. Where did one go right and one go catastrophically wrong? What does that tell you about your own ambitions?", duration_min: 20 },

  { scheduled_date: d(START, 45), pillar: "mind", type: "book", title: "Bad Blood — Finish & Reflection", description: "Complete the book. What institutional failures enabled Theranos? What does this tell you about the biotech world you're interested in entering?", source: "John Carreyrou", duration_min: 55 },
  { scheduled_date: d(START, 45), pillar: "culture", type: "article", title: "AI Ethics: The New Moral Calculus", description: "MIT Technology Review on the ethical frameworks emerging around AI — who decides what's fair, and who is left out.", source: "MIT Technology Review", url: "https://www.technologyreview.com/topic/ethics/", duration_min: 30 },

  { scheduled_date: d(START, 46), pillar: "mind", type: "article", title: "Tech Giants and the Illusion of Competition", description: "A rigorous antitrust analysis of platform monopolies — why the market isn't self-correcting when it comes to tech power.", source: "Foreign Affairs", url: "https://www.foreignaffairs.com", duration_min: 35 },
  { scheduled_date: d(START, 46), pillar: "culture", type: "lecture", title: "Stuart Russell: 3 Principles for Creating Safer AI", description: "The world's leading AI safety researcher on how to build machines that are aligned with human values — before it's too late.", source: "TED / Stuart Russell", url: "https://www.youtube.com/watch?v=EBK-a94IFHY", duration_min: 17 },
  { scheduled_date: d(START, 46), pillar: "craft", type: "reflection", title: "What does power look like in the 21st century?", description: "Think about the week: tech giants, surveillance, AI. Write a short essay (3 paragraphs) on where power is concentrating and whether that's a problem.", duration_min: 20 },

  { scheduled_date: d(START, 47), pillar: "mind", type: "article", title: "The Techlash Has Only Just Begun", description: "A take on growing public and regulatory backlash against tech companies — and why it may or may not lead to meaningful change.", source: "The Economist", url: "https://www.economist.com/technology", duration_min: 25 },
  { scheduled_date: d(START, 47), pillar: "culture", type: "lecture", title: "Mariana Mazzucato: The Value of Everything", description: "The UCL economist on how we've defined value in the economy — and why Silicon Valley captures so much of it while creating so little.", source: "RSA / Mazzucato", url: "https://www.youtube.com/watch?v=ICppFQ6Tabw", duration_min: 45 },

  { scheduled_date: d(START, 48), pillar: "mind", type: "article", title: "Open Source AI: Democratisation or Danger?", description: "The debate over making powerful AI models publicly available — who benefits, who is harmed, and who decides.", source: "MIT Technology Review", url: "https://www.technologyreview.com", duration_min: 30 },
  { scheduled_date: d(START, 48), pillar: "culture", type: "article", title: "Big Tech's Climate Contradiction", description: "On the irony of Silicon Valley's climate pledges while data centres consume record amounts of energy.", source: "The Guardian", url: "https://www.theguardian.com/environment", duration_min: 20 },

  // ─── WEEK 8 (Jul 28–Aug 3): Climate and the Planet ──────────────────────
  { scheduled_date: d(START, 49), pillar: "mind", type: "book", title: "The Uninhabitable Earth — Introduction & Ch 1", description: "David Wallace-Wells on the worst possible climate futures. The most frightening and important book on climate change ever written. Start with the introduction.", source: "David Wallace-Wells", duration_min: 55 },
  { scheduled_date: d(START, 49), pillar: "culture", type: "lecture", title: "Kate Raworth: A Healthy Economy Should Be Designed to Thrive", description: "The Oxford economist introduces doughnut economics — a model that balances human needs with planetary limits.", source: "TED / Kate Raworth", url: "https://www.youtube.com/watch?v=Rhcrbcg8HBw", duration_min: 16 },
  { scheduled_date: d(START, 49), pillar: "craft", type: "reflection", title: "A climate action I could take this year", description: "Not a political statement — a personal one. What is one concrete thing you could do differently? Be specific and honest about the tradeoffs.", duration_min: 15 },

  { scheduled_date: d(START, 50), pillar: "mind", type: "book", title: "The Uninhabitable Earth — Ch 2–4", description: "Heat death, hunger, drowning. The science of what happens at 2°C, 3°C, 4°C. Read carefully — this is the baseline, not the worst case.", source: "David Wallace-Wells", duration_min: 55 },
  { scheduled_date: d(START, 50), pillar: "culture", type: "documentary", title: "Our Planet — One Planet (Ep 1)", description: "Attenborough's most urgent nature series. The most beautiful and painful 50 minutes you'll spend this week.", source: "Netflix", url: "https://www.netflix.com/title/80049832", duration_min: 50 },

  { scheduled_date: d(START, 51), pillar: "mind", type: "book", title: "The Uninhabitable Earth — Ch 5–8", description: "Wildfire, freshwater, oceans, air. The cascading systems that sustain life — and what happens as they destabilise.", source: "David Wallace-Wells", duration_min: 55 },
  { scheduled_date: d(START, 51), pillar: "culture", type: "lecture", title: "David Attenborough's COP26 Address", description: "The most important speech at the most important climate conference. Four minutes that carry eighty years of watching the planet change.", source: "COP26 / Attenborough", url: "https://www.youtube.com/watch?v=BCvHAMnXv8I", duration_min: 6 },
  { scheduled_date: d(START, 51), pillar: "craft", type: "reflection", title: "Climate and inequality — who pays the price?", description: "The people least responsible for climate change suffer its consequences most. Write a short reflection on the justice dimension of climate change.", duration_min: 20 },

  { scheduled_date: d(START, 52), pillar: "mind", type: "book", title: "The Uninhabitable Earth — Ch 9–12", description: "The economics of climate change. Migration, conflict, and systemic risk. The world we're building for future generations.", source: "David Wallace-Wells", duration_min: 55 },
  { scheduled_date: d(START, 52), pillar: "culture", type: "article", title: "Climate Change and Food Security: The Science", description: "IFPRI and FAO joint report on how climate change is already reshaping food systems — and what the projections look like by 2050.", source: "IFPRI / FAO", url: "https://www.ifpri.org/topic/climate-change-and-nutrition", duration_min: 35 },

  { scheduled_date: d(START, 53), pillar: "mind", type: "book", title: "The Uninhabitable Earth — Final Chapters", description: "Stories, politics, and ethics of climate. Wallace-Wells' conclusion: not optimism, not despair — agency.", source: "David Wallace-Wells", duration_min: 55 },
  { scheduled_date: d(START, 53), pillar: "culture", type: "lecture", title: "Katharine Hayhoe: The Most Important Thing You Can Do About Climate Change", description: "The climate scientist on why talking — not just acting — about climate change is one of the highest-leverage things you can do.", source: "TED / Katharine Hayhoe", url: "https://www.youtube.com/watch?v=IgEXUhxSW7s", duration_min: 15 },
  { scheduled_date: d(START, 53), pillar: "craft", type: "reflection", title: "What does it mean to live well on this planet?", description: "A big, philosophical question. What does consumption mean? What is enough? Write a personal environmental ethic.", duration_min: 20 },

  { scheduled_date: d(START, 54), pillar: "mind", type: "article", title: "Can Carbon Capture Save Us?", description: "A rigorous assessment of carbon capture technology — what it can and cannot do, and why it's controversial.", source: "MIT Technology Review", url: "https://www.technologyreview.com/topic/climate-change/", duration_min: 30 },
  { scheduled_date: d(START, 54), pillar: "culture", type: "article", title: "The Green New Deal: A User's Guide", description: "A clear-headed analysis of the most ambitious climate policy proposal in US history — what it would actually do and what it would cost.", source: "Vox", url: "https://www.vox.com/energy-and-environment", duration_min: 25 },

  { scheduled_date: d(START, 55), pillar: "mind", type: "article", title: "Geoengineering: Playing God with the Climate", description: "The scientists who want to dim the sun to cool the planet — and the ethical questions nobody can answer yet.", source: "The Guardian", url: "https://www.theguardian.com/environment", duration_min: 30 },
  { scheduled_date: d(START, 55), pillar: "culture", type: "article", title: "Indigenous Knowledge and Climate Adaptation", description: "On how indigenous communities are already adapting to climate change — and what the rest of the world can learn from them.", source: "Nature / IPCC", url: "https://www.nature.com", duration_min: 25 },

  // ─── WEEK 9 (Aug 4–10): Economics, Systems and Power ─────────────────────
  { scheduled_date: d(START, 56), pillar: "mind", type: "book", title: "Winners Take All — Introduction & Part 1", description: "Anand Giridharadas's incendiary critique of 'market world' — the belief that business and philanthropy can fix what politics and justice must address.", source: "Anand Giridharadas", duration_min: 55 },
  { scheduled_date: d(START, 56), pillar: "culture", type: "lecture", title: "Anand Giridharadas: The Myth of Benevolent Plutocracy", description: "The author himself at Aspen — a talk about why the world's most powerful people cannot be trusted to fix the world's biggest problems.", source: "Aspen Ideas / YouTube", url: "https://www.youtube.com/watch?v=llHQTSKMRts", duration_min: 20 },
  { scheduled_date: d(START, 56), pillar: "craft", type: "reflection", title: "What does winning take?", description: "The title is pointed: what do you think 'winning' means in the world you're entering? Write about what you want to win — and at what cost.", duration_min: 15 },

  { scheduled_date: d(START, 57), pillar: "mind", type: "book", title: "Winners Take All — Part 2", description: "The 'thought leaders' and 'change makers' of Davos culture. On the difference between talking about justice and doing it.", source: "Anand Giridharadas", duration_min: 55 },
  { scheduled_date: d(START, 57), pillar: "culture", type: "film", title: "The Big Short", description: "The 2008 financial crisis — explained through the people who saw it coming. Watch it as a case study in systemic failure and incentive structures.", source: "Film (streaming)", duration_min: 130 },

  { scheduled_date: d(START, 58), pillar: "mind", type: "book", title: "Winners Take All — Finish", description: "Complete the book. Giridharadas's challenge: can you be inside elite institutions and still work for structural change? Where do you stand?", source: "Anand Giridharadas", duration_min: 55 },
  { scheduled_date: d(START, 58), pillar: "culture", type: "lecture", title: "Ha-Joon Chang: Beware of Economists Bearing Gifts", description: "The Cambridge economist on how mainstream economics has been used to justify inequality — and the alternatives we don't hear about.", source: "RSA / Ha-Joon Chang", url: "https://www.youtube.com/watch?v=7wMIKO4-OvY", duration_min: 40 },
  { scheduled_date: d(START, 58), pillar: "craft", type: "reflection", title: "Consulting, capital, and change — can they coexist?", description: "You want to do good. You're also pursuing a McKinsey internship. Think through that tension honestly. This is not about guilt — it's about clarity.", duration_min: 20 },

  { scheduled_date: d(START, 59), pillar: "mind", type: "article", title: "The Philanthropy Paradox", description: "A sharp piece on why billionaire philanthropy often reinforces the systems it claims to fix — with examples from Gates, Bezos, and others.", source: "The Guardian", url: "https://www.theguardian.com/commentisfree", duration_min: 30 },
  { scheduled_date: d(START, 59), pillar: "culture", type: "lecture", title: "Piketty: Capital in the 21st Century", description: "A condensed lecture version of the most important economics book of the decade. On why inequality compounds — and what to do about it.", source: "LSE / Piketty", url: "https://www.youtube.com/watch?v=ubkMfb1klKM", duration_min: 50 },

  { scheduled_date: d(START, 60), pillar: "mind", type: "article", title: "Against Billionaires: A Philosophical Case", description: "Should billionaires exist? A clear philosophical argument — not populist, rigorous — for why concentrations of wealth are incompatible with democracy.", source: "Boston Review", url: "https://www.bostonreview.net", duration_min: 35 },
  { scheduled_date: d(START, 60), pillar: "culture", type: "article", title: "The IMF on Inequality and Growth", description: "The International Monetary Fund — not usually a radical institution — on why extreme inequality is bad for economic growth.", source: "IMF", url: "https://www.imf.org/en/Topics/Inequality", duration_min: 25 },

  { scheduled_date: d(START, 61), pillar: "mind", type: "article", title: "Post-Growth Economics: Can We Thrive Without GDP Growth?", description: "The 'degrowth' movement and alternatives to GDP as the measure of a society's success. Challenging but important.", source: "Foreign Policy", url: "https://foreignpolicy.com", duration_min: 30 },
  { scheduled_date: d(START, 61), pillar: "culture", type: "lecture", title: "Dambisa Moyo: Is China the New Idol for Emerging Economies?", description: "The Zambian economist on the China model of development — and whether it's a threat to Western liberal democracy or just a different path.", source: "TED / Dambisa Moyo", url: "https://www.youtube.com/watch?v=w3EpHKDMbXs", duration_min: 16 },

  { scheduled_date: d(START, 62), pillar: "mind", type: "article", title: "Why the SDGs Are Failing", description: "A frank assessment of the UN's Sustainable Development Goals — halfway to the 2030 deadline, what's been achieved and what hasn't.", source: "The Economist / UN", url: "https://www.economist.com/international", duration_min: 30 },
  { scheduled_date: d(START, 62), pillar: "culture", type: "lecture", title: "Michael Sandel: The Moral Limits of Markets", description: "Harvard philosopher on what money can't and shouldn't buy — healthcare, education, justice. Essential for your non-profit interests.", source: "TED / Michael Sandel", url: "https://www.youtube.com/watch?v=3nsoN-LS8RQ", duration_min: 20 },

  // ─── WEEK 10 (Aug 11–17): Social Change and Entrepreneurship ─────────────
  { scheduled_date: d(START, 63), pillar: "mind", type: "book", title: "How to Change the World — Introduction & Ch 1–3", description: "David Bornstein's account of social entrepreneurship — what it is, where it came from, and the people who invented it.", source: "David Bornstein", duration_min: 55 },
  { scheduled_date: d(START, 63), pillar: "culture", type: "lecture", title: "Muhammad Yunus: A World Without Poverty", description: "The Bangladeshi Nobel laureate who invented microfinance — on the concept of social business and why profit should not be the only goal.", source: "TED / Muhammad Yunus", url: "https://www.youtube.com/watch?v=T6nFL-YNfNE", duration_min: 18 },
  { scheduled_date: d(START, 63), pillar: "craft", type: "reflection", title: "A problem I want to solve", description: "This is the big one. From everything you've read and watched this summer — what problem do you most want to work on? Write it specifically. Not 'inequality' — what aspect of it, where, how.", duration_min: 25 },

  { scheduled_date: d(START, 64), pillar: "mind", type: "book", title: "How to Change the World — Ch 4–7", description: "The anatomy of a social entrepreneur. What personality traits, skills, and circumstances produce world-changers?", source: "David Bornstein", duration_min: 55 },
  { scheduled_date: d(START, 64), pillar: "culture", type: "documentary", title: "Living on One Dollar — Revisited", description: "Rewatch the first 20 minutes and then watch the extended interviews — the filmmakers return a year later. What changed?", source: "YouTube", url: "https://www.youtube.com/watch?v=5SBQ5-YkpGU", duration_min: 30 },

  { scheduled_date: d(START, 65), pillar: "mind", type: "book", title: "How to Change the World — Ch 8–12", description: "The institutions of social change: Ashoka, Grameen Bank, and how systemic change is different from individual service.", source: "David Bornstein", duration_min: 55 },
  { scheduled_date: d(START, 65), pillar: "culture", type: "lecture", title: "Bill Drayton: Everyone a Changemaker", description: "The founder of Ashoka on the concept that everyone — not just extraordinary individuals — can create systemic change.", source: "Ashoka / YouTube", url: "https://www.youtube.com/watch?v=sNFvUJQKJfg", duration_min: 25 },
  { scheduled_date: d(START, 65), pillar: "craft", type: "reflection", title: "Social entrepreneurship vs. traditional charity", description: "After reading Bornstein — what is the difference between a charity and a social enterprise? Write your own definition of each, and why it matters.", duration_min: 20 },

  { scheduled_date: d(START, 66), pillar: "mind", type: "book", title: "How to Change the World — Finish", description: "Complete the book. What does Bornstein think creates social change? Do you agree? What would you add or challenge?", source: "David Bornstein", duration_min: 45 },
  { scheduled_date: d(START, 66), pillar: "culture", type: "article", title: "Social Enterprise vs. Nonprofit: Which Model Creates More Change?", description: "Stanford Social Innovation Review on the evidence for different models of social impact — and when each is appropriate.", source: "SSIR", url: "https://ssir.org", duration_min: 30 },

  { scheduled_date: d(START, 67), pillar: "mind", type: "book", title: "Shoe Dog — Part 1", description: "Phil Knight's memoir of building Nike from the ground up. The best business memoir ever written — and one of the most honest.", source: "Phil Knight", duration_min: 55 },
  { scheduled_date: d(START, 67), pillar: "culture", type: "article", title: "The Principles of Effective Impact Investing", description: "Brookings on what actually works in impact investing — the gap between claims and evidence.", source: "Brookings", url: "https://www.brookings.edu/topic/economic-development/", duration_min: 25 },
  { scheduled_date: d(START, 67), pillar: "craft", type: "reflection", title: "What kind of founder do I want to be?", description: "Knight was obsessive, flawed, and brilliant. Write about the kind of organisation you'd want to build — its culture, its purpose, its relationship to failure.", duration_min: 20 },

  { scheduled_date: d(START, 68), pillar: "mind", type: "book", title: "Shoe Dog — Part 2", description: "Near-bankruptcy, betrayal, and the relentless drive forward. Knight's account of how Nike almost died before it began.", source: "Phil Knight", duration_min: 55 },
  { scheduled_date: d(START, 68), pillar: "culture", type: "article", title: "The Rise of the B Corp", description: "On benefit corporations — companies legally required to consider social and environmental impact alongside profit. The corporate model you might want to use.", source: "Harvard Business Review", url: "https://hbr.org", duration_min: 25 },

  { scheduled_date: d(START, 69), pillar: "mind", type: "book", title: "Shoe Dog — Finish", description: "Complete the book. What is the central lesson of Knight's story? Write it in one sentence.", source: "Phil Knight", duration_min: 55 },
  { scheduled_date: d(START, 69), pillar: "culture", type: "lecture", title: "Reid Hoffman: The Network Imperative", description: "LinkedIn's founder on how networks amplify social impact — and how to build the right ones.", source: "Stanford / Reid Hoffman", url: "https://www.youtube.com/watch?v=bHlB0hGHGGk", duration_min: 40 },

  // ─── WEEK 11 (Aug 18–24): Leadership, Purpose and Vision ─────────────────
  { scheduled_date: d(START, 70), pillar: "mind", type: "book", title: "Half the Sky — Introduction & Ch 1–3", description: "Kristof and WuDunn on women's oppression as the great moral challenge of our era. Gripping, sometimes hard to read, and essential.", source: "Kristof & WuDunn", duration_min: 55 },
  { scheduled_date: d(START, 70), pillar: "culture", type: "lecture", title: "Jacinda Ardern at Harvard Kennedy School", description: "New Zealand's former prime minister on empathetic leadership, terrorism, and what it means to govern with both competence and humanity.", source: "Harvard Kennedy School", url: "https://www.youtube.com/watch?v=3aaFCLkk5kI", duration_min: 45 },
  { scheduled_date: d(START, 70), pillar: "craft", type: "reflection", title: "My leadership philosophy — first draft", description: "Write 4–5 sentences that capture your leadership philosophy. What do you believe about how to lead people? Don't be aspirational — be honest about what you've observed works.", duration_min: 20 },

  { scheduled_date: d(START, 71), pillar: "mind", type: "book", title: "Half the Sky — Ch 4–7", description: "On education, microfinance, and the evidence that empowering women is the most effective development tool that exists.", source: "Kristof & WuDunn", duration_min: 55 },
  { scheduled_date: d(START, 71), pillar: "culture", type: "lecture", title: "Adam Grant: Are You a Giver or a Taker?", description: "The Wharton psychologist on why the most successful people are often the most generous — and the traps that catch well-meaning givers.", source: "TED / Adam Grant", url: "https://www.youtube.com/watch?v=YyXRYgjQXX0", duration_min: 13 },

  { scheduled_date: d(START, 72), pillar: "mind", type: "book", title: "Half the Sky — Ch 8–11", description: "Congo, Afghanistan, and the economics of women's freedom. The hardest chapters — on maternal mortality, violence, and agency.", source: "Kristof & WuDunn", duration_min: 55 },
  { scheduled_date: d(START, 72), pillar: "culture", type: "film", title: "Hidden Figures", description: "Katherine Johnson, Dorothy Vaughan, and Mary Jackson — three Black women mathematicians who powered NASA. The best feel-good film about systemic change.", source: "Film (Disney+)", duration_min: 127 },
  { scheduled_date: d(START, 72), pillar: "craft", type: "reflection", title: "Who am I becoming?", description: "You're near the end. Write a one-page reflection: who were you in June? Who are you now? What has changed, and what do you want to do with it?", duration_min: 25 },

  { scheduled_date: d(START, 73), pillar: "mind", type: "book", title: "Half the Sky — Final Chapters", description: "The path forward — what works in women's empowerment, and the case for optimism built on evidence rather than wishful thinking.", source: "Kristof & WuDunn", duration_min: 55 },
  { scheduled_date: d(START, 73), pillar: "culture", type: "article", title: "When Women Lead", description: "McKinsey Global Institute on the business and social case for women in leadership — with global data.", source: "McKinsey Global Institute", url: "https://www.mckinsey.com/featured-insights/diversity-and-inclusion", duration_min: 30 },

  { scheduled_date: d(START, 74), pillar: "mind", type: "article", title: "The Power of Purpose", description: "HBR on what makes organisations — and people — endure: a genuine sense of purpose beyond profit.", source: "Harvard Business Review", url: "https://hbr.org/topic/purpose", duration_min: 25 },
  { scheduled_date: d(START, 74), pillar: "culture", type: "lecture", title: "Bryan Stevenson: We Need to Talk About Injustice", description: "One of the greatest TED talks ever given. The Equal Justice Initiative founder on proximity, narrative, and the power of staying hopeful.", source: "TED / Bryan Stevenson", url: "https://www.youtube.com/watch?v=c2tOp7OxyQ8", duration_min: 24 },
  { scheduled_date: d(START, 74), pillar: "craft", type: "reflection", title: "A letter to Ursula", description: "Write a letter to your mum about what this summer has meant to you. You don't have to send it. But write it as if she'll read it.", duration_min: 25 },

  { scheduled_date: d(START, 75), pillar: "mind", type: "article", title: "How to Have a Career That Matters", description: "80,000 Hours research on how to maximise your positive impact across a working life — which careers, organisations, and problems to prioritise.", source: "80,000 Hours", url: "https://80000hours.org/career-guide/", duration_min: 40 },
  { scheduled_date: d(START, 75), pillar: "culture", type: "article", title: "What Makes a Great Life", description: "The Harvard Study of Adult Development — 80 years of data on what actually makes people happy and fulfilled. The answer may surprise you.", source: "Harvard Study of Adult Development", url: "https://www.adultdevelopmentstudy.org", duration_min: 20 },

  { scheduled_date: d(START, 76), pillar: "mind", type: "article", title: "On Being 22: What I Wish I Had Known", description: "An honest compilation of advice from people reflecting on their early twenties — what mattered, what didn't, and what they wish they'd paid attention to.", source: "The Atlantic", url: "https://www.theatlantic.com", duration_min: 25 },
  { scheduled_date: d(START, 76), pillar: "culture", type: "lecture", title: "Brené Brown: The Power of Vulnerability", description: "The most important thing a future leader can understand. On what it means to be truly courageous in life and work.", source: "TED / Brené Brown", url: "https://www.youtube.com/watch?v=iCvmsMzlF7o", duration_min: 20 },

  // ─── WEEK 12 (Aug 25–28): Looking Forward — Final Days ──────────────────
  { scheduled_date: d(START, 77), pillar: "mind", type: "article", title: "Thinking Long-Term in a Short-Term World", description: "On how to develop genuine long-term thinking — one of the rarest and most valuable cognitive skills in any field.", source: "Farnam Street", url: "https://fs.blog/long-term-thinking/", duration_min: 30 },
  { scheduled_date: d(START, 77), pillar: "culture", type: "lecture", title: "Ngozi Okonjo-Iweala: Aid vs. Trade — An African Perspective", description: "Nigeria's former Finance Minister (now WTO Director General) on economic development, structural inequality, and what Africa actually needs from the world.", source: "TED / Ngozi Okonjo-Iweala", url: "https://www.youtube.com/watch?v=kTAGvaAXVpY", duration_min: 15 },
  { scheduled_date: d(START, 77), pillar: "craft", type: "writing", title: "Personal Manifesto — Draft 1", description: "Open a document and begin: 'I believe...' Write everything that comes. Use everything from this summer. Don't edit — this is a first draft. The goal is honesty, not elegance.", duration_min: 30 },

  { scheduled_date: d(START, 78), pillar: "mind", type: "article", title: "The Future of Work and Human Purpose", description: "As AI transforms labour markets — what remains distinctly human? What does work mean in a world where machines do much of the thinking?", source: "The Economist", url: "https://www.economist.com/leaders", duration_min: 30 },
  { scheduled_date: d(START, 78), pillar: "culture", type: "lecture", title: "Chimamanda Ngozi Adichie: The Danger of a Single Story", description: "On the power of narrative to shape how we see the world — and why diverse stories are a matter of justice, not just inclusion.", source: "TED / Chimamanda Ngozi Adichie", url: "https://www.youtube.com/watch?v=D9Ihs241zeg", duration_min: 19 },
  { scheduled_date: d(START, 78), pillar: "craft", type: "writing", title: "Personal Manifesto — Revision", description: "Return to yesterday's draft. Read it once without editing. Then revise with these questions: Is this true? Is this specific? Is this mine?", duration_min: 30 },

  { scheduled_date: d(START, 79), pillar: "mind", type: "article", title: "Systems Thinking: A Framework for Everything", description: "Donella Meadows on how to understand complex systems — poverty, climate, health, education — as interconnected wholes rather than isolated problems.", source: "Academy for Systems Change", url: "https://donellameadows.org/systems-thinking-resources/", duration_min: 35 },
  { scheduled_date: d(START, 79), pillar: "culture", type: "lecture", title: "David Brooks: Should You Live for Your Résumé or Your Eulogy?", description: "On the difference between achievement and meaning. A short, quiet talk that asks the hardest question.", source: "TED / David Brooks", url: "https://www.youtube.com/watch?v=MlLWTeApqIM", duration_min: 5 },
  { scheduled_date: d(START, 79), pillar: "craft", type: "writing", title: "Personal Manifesto — Final", description: "Write the final version. It should be under one page. Read it aloud. Save it somewhere you'll find it again in a year.", duration_min: 30 },

  // Final day — August 28, 2026
  { scheduled_date: d(START, 80), pillar: "mind", type: "reflection", title: "Summer Reading Summary", description: "Go back to the letter you wrote to your future self in Week 2. Read it. Then write a response: what happened? What did you get right? What surprised you?", source: "Your own words", duration_min: 30 },
  { scheduled_date: d(START, 80), pillar: "culture", type: "reflection", title: "The Five Moments That Stayed With Me", description: "From all the documentaries, films, and lectures this summer — which five moments genuinely changed how you see something? Write them down.", duration_min: 30 },
  { scheduled_date: d(START, 80), pillar: "craft", type: "writing", title: "A Plan for Fall Semester", description: "One page. What do you want to carry forward from this summer into your junior year? What courses, conversations, projects, or commitments? Be specific.", duration_min: 25 },
];

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("force") === "true";

  if (force) {
    // Delete all existing activities so we can re-seed with updated dates
    const { error: delErr } = await supabaseAdmin
      .from("summer_activities")
      .delete()
      .eq("user_id", USER_ID);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });
  } else {
    const { data: existing } = await supabaseAdmin
      .from("summer_activities")
      .select("id")
      .eq("user_id", USER_ID)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: "Already seeded — skipped." });
    }
  }

  // Insert in batches of 50 to avoid payload limits
  const batchSize = 50;
  let seeded = 0;
  for (let i = 0; i < CURRICULUM.length; i += batchSize) {
    const batch = CURRICULUM.slice(i, i + batchSize).map((a) => ({
      ...a,
      user_id: USER_ID,
      completed: false,
    }));
    const { error } = await supabaseAdmin.from("summer_activities").insert(batch);
    if (error) return NextResponse.json({ error: error.message, batch: i }, { status: 400 });
    seeded += batch.length;
  }

  return NextResponse.json({ seeded, total: CURRICULUM.length });
}
