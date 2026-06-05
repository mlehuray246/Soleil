"use client";

// ── TED Talk of the Day ────────────────────────────────────────────────────────
// Curated list of ~60 talks. Rotates daily via date-seeding — no API needed.
// Topics: global health, economics & inequality, leadership & social change,
// technology & AI ethics, climate, education, biotech, social entrepreneurship.

type Talk = {
  title: string;
  speaker: string;
  description: string;
  url: string;
  topic: string;
};

const TALKS: Talk[] = [
  // ── Global Health & Medicine ─────────────────────────────────────────────────
  {
    title: "A Doctor's Touch",
    speaker: "Abraham Verghese",
    description: "A plea to restore the human connection — the ritual of the physical exam — at the heart of medicine.",
    url: "https://www.ted.com/talks/abraham_verghese_a_doctor_s_touch",
    topic: "Global Health",
  },
  {
    title: "How Do We Heal Medicine?",
    speaker: "Atul Gawande",
    description: "Why American medicine is failing — and the surprising fix: the pit crew model over the cowboy surgeon.",
    url: "https://www.ted.com/talks/atul_gawande_how_do_we_heal_medicine",
    topic: "Global Health",
  },
  {
    title: "Mental Health for All by Involving All",
    speaker: "Vikram Patel",
    description: "The case for training ordinary people — not just psychiatrists — to treat depression and anxiety.",
    url: "https://www.ted.com/talks/vikram_patel_mental_health_for_all_by_involving_all",
    topic: "Global Health",
  },
  {
    title: "What Your Doctor Won't Disclose",
    speaker: "Leana Wen",
    description: "A physician argues for radical transparency — patients deserve to know everything, including their doctor's conflicts of interest.",
    url: "https://www.ted.com/talks/leana_wen_what_your_doctor_won_t_disclose",
    topic: "Global Health",
  },
  {
    title: "How Childhood Trauma Affects Health Across a Lifetime",
    speaker: "Nadine Burke Harris",
    description: "Childhood adversity is one of the greatest unaddressed public health threats of our time — and there's a science to treating it.",
    url: "https://www.ted.com/talks/nadine_burke_harris_how_childhood_trauma_affects_health_across_a_lifetime",
    topic: "Global Health",
  },
  {
    title: "HIV and Flu: The Vaccine Strategy",
    speaker: "Seth Berkley",
    description: "Why making vaccines for HIV and flu is so hard — and why it matters for every future pandemic.",
    url: "https://www.ted.com/talks/seth_berkley_hiv_and_flu_the_vaccine_strategy",
    topic: "Global Health",
  },
  {
    title: "The Best Stats You've Ever Seen",
    speaker: "Hans Rosling",
    description: "The data wizard who made global health come alive — demolishing the developing vs. developed world binary in 20 minutes.",
    url: "https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen",
    topic: "Global Health",
  },
  {
    title: "How We Must Respond to the Coronavirus Pandemic",
    speaker: "Bill Gates",
    description: "Gates in 2020 — what the world needed to do and didn't. An uncomfortable case study in being right too early.",
    url: "https://www.ted.com/talks/bill_gates_how_we_must_respond_to_the_coronavirus_pandemic",
    topic: "Global Health",
  },
  {
    title: "Ebola Is Beatable",
    speaker: "Pardis Sabeti",
    description: "The computational geneticist who sequenced Ebola in real time — on what it takes to fight a virus at the frontier.",
    url: "https://www.ted.com/talks/pardis_sabeti_how_we_ll_fight_the_next_deadly_virus",
    topic: "Global Health",
  },
  {
    title: "The Moral Determinants of Health",
    speaker: "Michael Marmot",
    description: "Health is political — the evidence that inequality itself is one of the leading causes of premature death.",
    url: "https://www.ted.com/talks/michael_marmot_the_social_determinants_of_health",
    topic: "Global Health",
  },

  // ── Economics & Inequality ───────────────────────────────────────────────────
  {
    title: "Social Experiments to Fight Poverty",
    speaker: "Esther Duflo",
    description: "The Nobel laureate on randomised controlled trials in development — how we actually know what works against poverty.",
    url: "https://www.ted.com/talks/esther_duflo_social_experiments_to_fight_poverty",
    topic: "Economics",
  },
  {
    title: "A Healthy Economy Should Be Designed to Thrive, Not Grow",
    speaker: "Kate Raworth",
    description: "Doughnut Economics — why GDP growth is the wrong target, and what a genuinely sustainable economy looks like.",
    url: "https://www.ted.com/talks/kate_raworth_a_healthy_economy_should_be_designed_to_thrive_not_grow",
    topic: "Economics",
  },
  {
    title: "Is China the New Idol for Emerging Economies?",
    speaker: "Dambisa Moyo",
    description: "The Zambian economist challenges the Western development consensus — and asks what African economies can actually learn from China.",
    url: "https://www.ted.com/talks/dambisa_moyo_is_china_the_new_idol_for_emerging_economies",
    topic: "Economics",
  },
  {
    title: "New Rules for Rebuilding a Broken Nation",
    speaker: "Paul Collier",
    description: "Oxford economist on the 'bottom billion' — why the poorest nations are trapped and what it would take to get them out.",
    url: "https://www.ted.com/talks/paul_collier_s_new_rules_for_rebuilding_a_broken_nation",
    topic: "Economics",
  },
  {
    title: "Why We Shouldn't Trust Markets with Our Civic Life",
    speaker: "Michael Sandel",
    description: "What money can and cannot buy — and why putting a price on everything corrodes the values that matter most.",
    url: "https://www.ted.com/talks/michael_sandel_why_we_shouldn_t_trust_markets_with_our_civic_life",
    topic: "Economics",
  },
  {
    title: "Poverty Isn't a Lack of Character; It's a Lack of Cash",
    speaker: "Rutger Bregman",
    description: "The historian who told Davos billionaires to their faces that all their talk is theatre. On the radical simplicity of cash transfers.",
    url: "https://www.ted.com/talks/rutger_bregman_poverty_isn_t_a_lack_of_character_it_s_a_lack_of_cash",
    topic: "Economics",
  },
  {
    title: "Aid vs. Trade",
    speaker: "Ngozi Okonjo-Iweala",
    description: "Nigeria's former Finance Minister — now WTO Director General — on what Africa actually needs and what it doesn't.",
    url: "https://www.ted.com/talks/ngozi_okonjo_iweala_wants_to_end_aid_to_africa",
    topic: "Economics",
  },
  {
    title: "How to Fight Inequality",
    speaker: "Didier Jacobs",
    description: "A measured, evidence-based case for three specific interventions that would actually reduce wealth inequality globally.",
    url: "https://www.ted.com/talks/didier_jacobs_3_ways_to_close_the_gap_between_rich_and_poor",
    topic: "Economics",
  },

  // ── Leadership & Social Change ───────────────────────────────────────────────
  {
    title: "We Need to Talk About an Injustice",
    speaker: "Bryan Stevenson",
    description: "One of the greatest TED talks ever given. The Equal Justice Initiative founder on proximity, narrative, and staying hopeful in the face of systemic injustice.",
    url: "https://www.ted.com/talks/bryan_stevenson_we_need_to_talk_about_an_injustice",
    topic: "Leadership",
  },
  {
    title: "The Power of Vulnerability",
    speaker: "Brené Brown",
    description: "The most important thing a future leader can understand. On what courage actually requires — and why shame is a leadership killer.",
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    topic: "Leadership",
  },
  {
    title: "Are You a Giver or a Taker?",
    speaker: "Adam Grant",
    description: "The Wharton psychologist on why the most effective people are the most generous — and the one trap that catches well-meaning givers.",
    url: "https://www.ted.com/talks/adam_grant_are_you_a_giver_or_a_taker",
    topic: "Leadership",
  },
  {
    title: "How Great Leaders Inspire Action",
    speaker: "Simon Sinek",
    description: "Start with Why. The most replicated framework for understanding why some organisations — and people — inspire loyalty and others don't.",
    url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
    topic: "Leadership",
  },
  {
    title: "Why We Have Too Few Women Leaders",
    speaker: "Sheryl Sandberg",
    description: "The data on women in leadership — and three specific things women can do to change it. Still provocative, still contested, still worth watching.",
    url: "https://www.ted.com/talks/sheryl_sandberg_why_we_have_too_few_women_leaders",
    topic: "Leadership",
  },
  {
    title: "The Danger of a Single Story",
    speaker: "Chimamanda Ngozi Adichie",
    description: "On the profound power of narrative to shape how we see entire peoples — and what happens when only one story is told.",
    url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
    topic: "Leadership",
  },
  {
    title: "The Puzzle of Motivation",
    speaker: "Dan Pink",
    description: "Forty years of science say carrots and sticks don't work. Here's what does — and why so few organisations act on the evidence.",
    url: "https://www.ted.com/talks/dan_pink_the_puzzle_of_motivation",
    topic: "Leadership",
  },
  {
    title: "Your Body Language May Shape Who You Are",
    speaker: "Amy Cuddy",
    description: "The science of posture and self-perception — and the two-minute practice before any high-stakes moment.",
    url: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
    topic: "Leadership",
  },
  {
    title: "Grit: The Power of Passion and Perseverance",
    speaker: "Angela Duckworth",
    description: "IQ isn't what predicts success. The psychologist who spent a decade measuring what actually does.",
    url: "https://www.ted.com/talks/angela_duckworth_grit_the_power_of_passion_and_perseverance",
    topic: "Leadership",
  },
  {
    title: "Listening to Shame",
    speaker: "Brené Brown",
    description: "The sequel to 'The Power of Vulnerability' — on the difference between shame and guilt, and why shame is lethal to growth.",
    url: "https://www.ted.com/talks/brene_brown_listening_to_shame",
    topic: "Leadership",
  },

  // ── Social Entrepreneurship & Charity ────────────────────────────────────────
  {
    title: "The Way We Think About Charity Is Dead Wrong",
    speaker: "Dan Pallotta",
    description: "Why the rules we impose on nonprofits are designed to keep them small — and the counter-intuitive argument for paying charity CEOs more.",
    url: "https://www.ted.com/talks/dan_pallotta_the_way_we_think_about_charity_is_dead_wrong",
    topic: "Social Change",
  },
  {
    title: "Patient Capital for Africa's Entrepreneurs",
    speaker: "Jacqueline Novogratz",
    description: "The Acumen Fund founder on 'patient capital' — the alternative to aid and traditional investment that's actually changing lives.",
    url: "https://www.ted.com/talks/jacqueline_novogratz_patient_capital_for_africa_s_entrepreneurs",
    topic: "Social Change",
  },
  {
    title: "Inspiring a Life of Immersion",
    speaker: "Jacqueline Novogratz",
    description: "On choosing to live close to the problems you want to solve — what that proximity teaches you and what it demands.",
    url: "https://www.ted.com/talks/jacqueline_novogratz_inspiring_a_life_of_immersion",
    topic: "Social Change",
  },
  {
    title: "Effective Altruism: How to Be Good and Do Good",
    speaker: "Peter Singer",
    description: "The utilitarian philosopher's challenge: if you can do massive good with your resources, do you have a moral obligation to?",
    url: "https://www.ted.com/talks/peter_singer_effective_altruism_how_to_be_good_and_do_good",
    topic: "Social Change",
  },
  {
    title: "A World Without Poverty",
    speaker: "Muhammad Yunus",
    description: "The Grameen Bank founder on social business — the radical idea that companies can exist to solve problems, not make profit.",
    url: "https://www.ted.com/talks/muhammad_yunus_poverty_money_and_love",
    topic: "Social Change",
  },

  // ── Technology & AI Ethics ───────────────────────────────────────────────────
  {
    title: "3 Principles for Creating Safer AI",
    speaker: "Stuart Russell",
    description: "The world's leading AI safety researcher on how to build machines that are actually aligned with human values — before it's too late.",
    url: "https://www.ted.com/talks/stuart_russell_3_principles_for_creating_safer_ai",
    topic: "Technology",
  },
  {
    title: "We Can Now Edit Our DNA. But Let's Do It Wisely",
    speaker: "Jennifer Doudna",
    description: "The Nobel laureate who co-invented CRISPR on how it works, what it could cure — and the ethical nightmares it opens.",
    url: "https://www.ted.com/talks/jennifer_doudna_we_can_now_edit_our_dna_but_let_s_do_it_wisely",
    topic: "Technology",
  },
  {
    title: "How a Handful of Tech Companies Control Billions of Minds",
    speaker: "Tristan Harris",
    description: "A former Google design ethicist on how smartphone apps are engineered to hijack your attention — and what to do about it.",
    url: "https://www.ted.com/talks/tristan_harris_how_a_handful_of_tech_companies_control_billions_of_minds_every_day",
    topic: "Technology",
  },
  {
    title: "Machine Intelligence Makes Human Morals More Important",
    speaker: "Zeynep Tufekci",
    description: "The sociologist on why giving machines moral choices doesn't remove the ethical burden — it amplifies it.",
    url: "https://www.ted.com/talks/zeynep_tufekci_machine_intelligence_makes_human_morals_more_important",
    topic: "Technology",
  },
  {
    title: "Why Fascism Is So Tempting — and How Your Data Could Power It",
    speaker: "Yuval Noah Harari",
    description: "The Sapiens author on what data-driven authoritarian government could look like — and why it's closer than we think.",
    url: "https://www.ted.com/talks/yuval_noah_harari_why_fascism_is_so_tempting_and_how_your_data_could_power_it",
    topic: "Technology",
  },
  {
    title: "The Year Open Data Went Worldwide",
    speaker: "Tim Berners-Lee",
    description: "The inventor of the World Wide Web on why open data is the next revolution — and the radical democratic power it unlocks.",
    url: "https://www.ted.com/talks/tim_berners_lee_the_year_open_data_went_worldwide",
    topic: "Technology",
  },

  // ── Climate & Environment ────────────────────────────────────────────────────
  {
    title: "The Most Important Thing You Can Do to Fight Climate Change",
    speaker: "Katharine Hayhoe",
    description: "Not flying less or going vegan — talking about it. The climate scientist on why conversation is the highest-leverage intervention.",
    url: "https://www.ted.com/talks/katharine_hayhoe_the_most_important_thing_you_can_do_to_fight_climate_change",
    topic: "Climate",
  },
  {
    title: "Let the Environment Guide Our Development",
    speaker: "Johan Rockström",
    description: "The scientist who defined planetary boundaries — nine systems that, if crossed, threaten human civilisation.",
    url: "https://www.ted.com/talks/johan_rockstrom_let_the_environment_guide_our_development",
    topic: "Climate",
  },
  {
    title: "Averting the Climate Crisis",
    speaker: "Al Gore",
    description: "An Inconvenient Truth in 30 minutes. Still one of the most effective climate communications ever made.",
    url: "https://www.ted.com/talks/al_gore_averting_the_climate_crisis",
    topic: "Climate",
  },
  {
    title: "The Disarming Case to Act Right Now on Climate",
    speaker: "Greta Thunberg",
    description: "The teenager who shamed a generation of global leaders — and the radical simplicity of her argument.",
    url: "https://www.ted.com/talks/greta_thunberg_the_disarming_case_to_act_right_now_on_climate_change",
    topic: "Climate",
  },
  {
    title: "How to Transform Apocalyptic Futures into Possibility",
    speaker: "Bina Venkataraman",
    description: "On building institutions that think in decades — and why we are so bad at protecting future generations from present-day decisions.",
    url: "https://www.ted.com/talks/bina_venkataraman_how_to_transform_apocalyptic_futures_into_possibility",
    topic: "Climate",
  },

  // ── Education ────────────────────────────────────────────────────────────────
  {
    title: "Do Schools Kill Creativity?",
    speaker: "Ken Robinson",
    description: "Still the most-watched TED talk ever. A provocative case that the education system treats creativity as a problem to be solved.",
    url: "https://www.ted.com/talks/sir_ken_robinson_do_schools_kill_creativity",
    topic: "Education",
  },
  {
    title: "Let's Use Video to Reinvent Education",
    speaker: "Sal Khan",
    description: "The Khan Academy founder on why flipping the classroom — lectures at home, homework in school — changes everything.",
    url: "https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education",
    topic: "Education",
  },
  {
    title: "Every Kid Needs a Champion",
    speaker: "Rita Pierson",
    description: "A teacher with 40 years in the classroom on the one thing that predicts whether a child learns: whether they feel their teacher believes in them.",
    url: "https://www.ted.com/talks/rita_pierson_every_kid_needs_a_champion",
    topic: "Education",
  },
  {
    title: "Teach Girls Bravery, Not Perfection",
    speaker: "Reshma Saujani",
    description: "The Girls Who Code founder on why we raise girls to be perfect and boys to be brave — and the cost that imposes on women's ambition.",
    url: "https://www.ted.com/talks/reshma_saujani_teach_girls_bravery_not_perfection",
    topic: "Education",
  },

  // ── Wellbeing & Mindset ──────────────────────────────────────────────────────
  {
    title: "Inside the Mind of a Master Procrastinator",
    speaker: "Tim Urban",
    description: "The most honest talk about why smart people do everything at the last minute — and the panic monster that eventually saves them.",
    url: "https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator",
    topic: "Mindset",
  },
  {
    title: "The Power of Introverts",
    speaker: "Susan Cain",
    description: "A third to a half of all people are introverts — and the world is built for the other half. The quiet revolution.",
    url: "https://www.ted.com/talks/susan_cain_the_power_of_introverts",
    topic: "Mindset",
  },
  {
    title: "The New Era of Positive Psychology",
    speaker: "Martin Seligman",
    description: "The founder of positive psychology on what it means to live a genuinely good life — not just the absence of suffering.",
    url: "https://www.ted.com/talks/martin_seligman_the_new_era_of_positive_psychology",
    topic: "Mindset",
  },
  {
    title: "Flow, the Secret to Happiness",
    speaker: "Mihaly Csikszentmihalyi",
    description: "What makes a life worth living? The psychologist who coined 'flow' on the state of complete absorption that produces peak experience.",
    url: "https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness",
    topic: "Mindset",
  },
  {
    title: "The Surprising Science of Happiness",
    speaker: "Dan Gilbert",
    description: "We are terrible at predicting what will make us happy. The Harvard psychologist on synthetic happiness — and why it's just as real.",
    url: "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness",
    topic: "Mindset",
  },
  {
    title: "Should You Live for Your Résumé or Your Eulogy?",
    speaker: "David Brooks",
    description: "A quiet, short talk that asks the hardest question: what is the difference between a life that looks good and a life that is good?",
    url: "https://www.ted.com/talks/david_brooks_should_you_live_for_your_resume_or_your_eulogy",
    topic: "Mindset",
  },

  // ── Women & Equity ───────────────────────────────────────────────────────────
  {
    title: "The Urgent Need to Re-imagine and Re-build the World",
    speaker: "Malala Yousafzai",
    description: "The Nobel laureate on education, girls' rights, and why the fight for access to school is the fight for everything else.",
    url: "https://www.ted.com/talks/malala_yousafzai_the_urgent_need_to_re_imagine_and_re_build_the_world",
    topic: "Women & Equity",
  },
  {
    title: "We Should All Be Feminists",
    speaker: "Chimamanda Ngozi Adichie",
    description: "The writer who turned a viral TEDx talk into a book read by millions — on what feminism actually means and who it's for.",
    url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_we_should_all_be_feminists",
    topic: "Women & Equity",
  },
  {
    title: "The Political Progress Women Have Made — and What's Next",
    speaker: "Cecile Shea",
    description: "The global picture on women in leadership and the evidence on what policies actually move the needle.",
    url: "https://www.ted.com/talks/cecile_shea_the_political_progress_women_have_made_and_what_s_next",
    topic: "Women & Equity",
  },
  {
    title: "My Son Was a Columbine Shooter. This Is My Story.",
    speaker: "Sue Klebold",
    description: "On loving someone capable of terrible violence — one of the most courageous and humbling acts of public vulnerability on record.",
    url: "https://www.ted.com/talks/sue_klebold_my_son_was_a_columbine_shooter_this_is_my_story",
    topic: "Women & Equity",
  },

  // ── Justice & Human Rights ───────────────────────────────────────────────────
  {
    title: "The Danger of Silence",
    speaker: "Clint Smith",
    description: "A poet and scholar on what we lose — politically and personally — when we choose silence over speech about injustice.",
    url: "https://www.ted.com/talks/clint_smith_the_danger_of_silence",
    topic: "Justice",
  },
  {
    title: "How America's Public Schools Keep Kids in Poverty",
    speaker: "Kandice Sumner",
    description: "A Boston teacher on what it looks like — inside a classroom — when the system is designed to fail certain children.",
    url: "https://www.ted.com/talks/kandice_sumner_how_america_s_public_schools_keep_kids_in_poverty",
    topic: "Justice",
  },
  {
    title: "Why I Fight for the Accused",
    speaker: "Chimamanda Ngozi Adichie",
    description: "A defence lawyer on why even people who appear guilty deserve rigorous representation — and what collapses when they don't get it.",
    url: "https://www.ted.com/talks/patrick_l_hymes_why_i_fight_for_the_accused",
    topic: "Justice",
  },
];

function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const TOPIC_COLOR: Record<string, string> = {
  "Global Health": "#5C6E45",
  "Economics":     "#7A6E4B",
  "Leadership":    "#8B6914",
  "Social Change": "#6B5D8A",
  "Technology":    "#4A6B8A",
  "Climate":       "#4A7A5A",
  "Education":     "#7A5840",
  "Mindset":       "#8A7A60",
  "Women & Equity":"#8A4A6A",
  "Justice":       "#6A4A3A",
};

export default function TedTalkWidget() {
  const seed = todaySeed();
  const talk = TALKS[seed % TALKS.length];
  const color = TOPIC_COLOR[talk.topic] ?? "var(--accent)";

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 8px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Large watermark ▶ — mirrors the decorative " in the Ursula quote */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: -18,
        right: -8,
        fontFamily: "var(--font-cormorant)",
        fontSize: "9rem",
        lineHeight: 1,
        color: color,
        opacity: 0.08,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        ▶
      </div>

      {/* Label row — matches InlineQuote's "from mum" style exactly */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
        <span style={{
          fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--accent)", fontFamily: "var(--font-dm-sans)",
        }}>
          watch today
        </span>
        <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
      </div>

      {/* Topic badge — with a border for more presence */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: "8px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: color,
        background: `${color}12`,
        border: `1px solid ${color}35`,
        borderRadius: 999,
        padding: "3px 10px",
        marginBottom: 12,
        alignSelf: "flex-start",
        fontFamily: "var(--font-dm-sans)",
      }}>
        {/* Tiny coloured dot */}
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
        {talk.topic}
      </span>

      {/* Talk title — larger, more dramatic */}
      <a
        href={talk.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.35rem",
          fontStyle: "italic",
          fontWeight: 500,
          color: "var(--primary)",
          lineHeight: 1.3,
          marginBottom: 10,
          display: "block",
          textDecoration: "none",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {talk.title}
      </a>

      {/* Speaker — accent dot + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <div style={{ width: 16, height: 1, background: "var(--border)" }} />
        <span style={{
          fontFamily: "var(--font-dancing)",
          fontSize: "1rem",
          color: "var(--accent)",
          letterSpacing: "0.01em",
        }}>
          {talk.speaker}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: "11px",
        color: "var(--muted-foreground)",
        fontFamily: "var(--font-dm-sans)",
        lineHeight: 1.65,
        flex: 1,
        marginBottom: 14,
      }}>
        {talk.description}
      </p>

      {/* Watch link */}
      <a
        href={talk.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: "9px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: color,
          textDecoration: "none",
          fontFamily: "var(--font-dm-sans)",
          alignSelf: "flex-start",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.55")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Watch on TED
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}
