"""English versions of the blog posts. Same order as POSTS in _build.py:
POSTS_EN[i] is the translation of POSTS[i] (used for the PT ⇄ EN links)."""

POSTS_EN = [
{
"slug": "how-to-appear-in-chatgpt-answers",
"title": "How to get your business into ChatGPT’s answers",
"description": "More and more clients ask AI tools for recommendations. Learn what makes ChatGPT, Perplexity and Google cite a business, and how to prepare your website.",
"dek": "More and more people ask an AI tool for recommendations instead of scrolling through a page of results. Here’s what gets a business cited in those answers, and how to prepare your website.",
"category": "AI & search",
"cover_alt": "Illustration: a glowing answer at the centre, with orbits and three highlighted sources",
"takeaways": [
  "AI tools recommend businesses they can read, understand and confirm in other sources.",
  "Your website must be open to search crawlers and say clearly what you do, for whom and where.",
  "Direct answers to real questions, like an FAQ section, are the easiest format to cite.",
  "Reviews, mentions on other websites and a complete Google Business Profile build trust.",
],
"body": """
<h2>Search has changed shape</h2>
<p>For years, being online meant climbing Google’s rankings. Today, many clients ask an AI tool the full question, something like <em>“which interior design studio in Bristol is good with small flats?”</em>, and get a short answer with a handful of names.</p>
<p>If your business isn’t among those names, for that client it simply doesn’t exist. Traditional SEO still matters, not least because these tools rely on search indexes, but the goal has shifted: ranking well is no longer enough. You need to be <strong>cited</strong>.</p>

<h2>How AI decides who to recommend</h2>
<p>There’s no public formula, but there is a clear pattern. The tools tend to recommend businesses that meet three conditions:</p>
<ol>
  <li><strong>They can access the content</strong>: the website doesn’t block the crawlers that collect information.</li>
  <li><strong>They understand what the business does</strong>: the information is explicit, structured and unambiguous.</li>
  <li><strong>They find confirmation elsewhere</strong>: reviews, directories, press and consistent details.</li>
</ol>
<p>The five steps below work on exactly these three conditions.</p>

<h2>1. Make sure crawlers can read your website</h2>
<p>It sounds obvious, but it’s the most common mistake. Some websites block search crawlers without knowing it, through the <code>robots.txt</code> file, a security plugin or a hosting setting.</p>
<ul>
  <li>Check that <code>robots.txt</code> doesn’t block Googlebot, Bingbot or AI crawlers such as OAI-SearchBot (ChatGPT search) and PerplexityBot.</li>
  <li>Register your website in Google Search Console and Bing Webmaster Tools and submit your sitemap. Several AI tools rely on existing search indexes, and Bing’s is one of them.</li>
  <li>Make sure important information is written as text, not only inside images, videos or PDFs.</li>
</ul>

<h2>2. Say clearly what you do, for whom and where</h2>
<p>Pretty but vague slogans are hard to interpret, for people and machines alike. The first sentence on your homepage should answer three questions: what you do, for whom and where.</p>
<div class="compare">
  <p class="-bad"><b>Vague</b>Tailored solutions to transform your space.</p>
  <p class="-good"><b>Clear</b>Interior design studio in Bristol, specialising in flat renovations and small retail spaces.</p>
</div>
<p>Give each service its own page too, with a title that names it the way clients search for it.</p>

<h2>3. Answer the questions your clients ask</h2>
<p>AI tools exist to answer questions. The more directly your website answers your clients’ real questions, the easier it is to be used as a source.</p>
<ul>
  <li>How much does your service cost, on average?</li>
  <li>How long does it take?</li>
  <li>Which areas do you cover?</li>
  <li>How does the process work, from first contact to the end?</li>
</ul>
<p>Put the answer in the first sentence and expand afterwards. An FAQ section on each service page is a great way to do this.</p>
<div class="callout"><b>Tip</b>To find the right questions, reread the emails and messages from the last few months. The questions that keep coming up are the ones your website should answer.</div>

<h2>4. Use structured data</h2>
<p>Structured data (<em>schema.org</em>) is code, invisible to visitors, that describes your business without any ambiguity: name, address, opening hours, services, service area and reviews.</p>
<p>For a small business, the most useful types are <code>LocalBusiness</code> (or the more specific type for your sector), <code>Service</code> and <code>FAQPage</code>. None of them change how your website looks, but together they remove any doubt about who you are and what you do.</p>

<h2>5. Build trust beyond your website</h2>
<p>An AI tool won’t recommend a business just because its own website says it’s the best. It looks for confirmation elsewhere:</p>
<ul>
  <li>A complete Google Business Profile, with real photos and up-to-date information.</li>
  <li>Recent, detailed reviews that mention the service and the location.</li>
  <li>The same name, address and phone number across every directory and social network.</li>
  <li>Mentions in local press, trade associations and partner websites.</li>
</ul>

<h2>What about llms.txt?</h2>
<p><code>llms.txt</code> is a recent proposal: a plain text file at the root of your website that summarises the business and points to its most important pages, written with language models in mind. It isn’t a standard yet and it guarantees nothing, but it only takes minutes to create. Worth having, as long as the five points above come first.</p>

<h2>Where to start</h2>
<ol>
  <li>Ask ChatGPT and Perplexity what your clients would ask, and note who shows up.</li>
  <li>Check your <code>robots.txt</code> and register the website in Search Console and Bing Webmaster Tools.</li>
  <li>Rewrite the first sentence of your homepage to say what you do, for whom and where.</li>
  <li>Add FAQs to your service pages.</li>
  <li>Complete your Google Business Profile and ask your latest clients for reviews.</li>
</ol>
""",
"faq": [
  ("Do I have to pay to appear in ChatGPT’s answers?",
   "No. Organic recommendations can’t be bought: they depend on the information the tools find and can confirm about your business."),
  ("Are SEO and AI optimisation different things?",
   "They share the same foundation: a website that’s accessible, fast and clearly written. AI optimisation puts more weight on direct answers, structured data and confirmation of your reputation in other sources."),
  ("How long does it take to see results?",
   "Technical fixes, such as unblocking crawlers or submitting your sitemap, take effect within weeks. Reputation beyond your website, with reviews and mentions, builds over months."),
  ("How do I know if my business already shows up?",
   "Ask the tools the questions your clients would ask, phrased in several ways, and note the results. In your website statistics, also check for visits coming from chatgpt.com or perplexity.ai."),
],
},
{
"slug": "signs-your-website-is-driving-clients-away",
"title": "8 signs your website is driving clients away",
"description": "An outdated website costs you enquiries every day, even if you don’t notice. The eight most common signs, and what to do about each one.",
"dek": "A website rarely breaks in a visible way. It simply stops working, and enquiries drop without anyone quite knowing why. These are the eight signs to watch for.",
"category": "Redesign",
"cover_alt": "Illustration: eight website pages drifting away and fading from left to right",
"takeaways": [
  "Visitors decide within seconds whether to stay or leave.",
  "Mobile problems, slow loading and vague messages drive away the most clients.",
  "Not every sign calls for a new website: some can be fixed with targeted changes.",
  "If you spot four or more signs, a redesign is usually the most effective route.",
],
"body": """
<h2>1. It’s hard to use on a phone</h2>
<p>For most businesses, a large share of visits comes from phones. If people need to zoom in to read, if the buttons are too small or the menu doesn’t work well, they give up.</p>
<p><strong>What to do:</strong> open your website on your phone and try to do what a client would: understand what you offer and get in touch. If you can’t do it in under a minute, there’s work to do.</p>

<h2>2. It’s slow to load</h2>
<p>Every second of waiting makes visitors more likely to go back. Heavy images, too many plugins and slow hosting are the most frequent causes.</p>
<p><strong>What to do:</strong> test your website with Google’s PageSpeed Insights. Compressing images and removing what you don’t use usually brings immediate improvements.</p>

<h2>3. It’s not clear what you do within five seconds</h2>
<p>If the first thing visitors see is a generic slogan or an image without context, you’re making them work for it. Most won’t: they’ll leave.</p>
<p><strong>What to do:</strong> make sure the top of your homepage says, in one sentence, what you do, for whom and what the next step is.</p>

<h2>4. There’s no clear next step</h2>
<p>An interested visitor needs to know what to do next: request a quote, book a call, make a reservation. Give them five equally weighted options, or none at all, and they’ll put the decision off.</p>
<p><strong>What to do:</strong> choose one main action per page and make it obvious, with a button visible without scrolling.</p>

<h2>5. The design looks dated</h2>
<p>A footer saying “© 2019”, generic stock photos or a clearly dated style suggest the business has stood still, even when it hasn’t.</p>
<p><strong>What to do:</strong> use real photos of your team, your space and your work, and update old dates, copy and references.</p>

<h2>6. Getting in touch takes effort</h2>
<p>Forms with ten fields, an email address hidden in the footer or having to call during office hours are needless obstacles.</p>
<p><strong>What to do:</strong> cut the form down to the essentials and offer alternatives, like WhatsApp, online booking or chat, for people who prefer another channel.</p>

<h2>7. People can’t find you on Google or AI tools</h2>
<p>A beautiful website that nobody finds won’t bring in enquiries. Search for your service and your town: if your business doesn’t show up, your competitors are getting those clients.</p>
<p><strong>What to do:</strong> review the titles, descriptions and content of each page, and complete your Google Business Profile. I explain <a href="../how-to-appear-in-chatgpt-answers/">how to show up in ChatGPT’s answers too</a> in a separate article.</p>

<h2>8. You can’t update it yourself</h2>
<p>If changing a price or adding a project means asking for help and waiting days, the website ends up out of date. And an out-of-date website looks careless.</p>
<p><strong>What to do:</strong> make sure you have the access and autonomy to edit day-to-day content.</p>

<h2>Redesign or tweaks?</h2>
<p>If you spotted one or two signs, targeted tweaks will probably be enough. If you spotted four or more, or if the website’s structure no longer reflects what your business does today, a redesign tends to be more effective, and cheaper, than patching it again and again.</p>
<p>Not sure how many signs your website has? <a href="../../diagnosis/">Take the free diagnosis</a>: in 2 minutes you’ll know where your website is falling short and the best next step.</p>
<p>If you’d like a concrete opinion, I can <a href="../../#free">redesign your homepage for free</a> so you can see the potential before you decide.</p>
""",
"faq": [
  ("How often should I renew my website?",
   "There’s no fixed rule. Review your website once a year and consider a redesign when your business has changed, or when you spot several of the signs in this article."),
  ("Can a redesign make me lose Google rankings?",
   "It can, if page addresses change without redirects or content is lost. With well-planned 301 redirects and the important content preserved, the risk is minimal."),
  ("Can I keep my current content in a redesign?",
   "Yes. A visual redesign can keep the existing structure and copy and improve only the design, readability and mobile experience."),
],
},
{
"slug": "local-seo-for-small-businesses",
"title": "Local SEO: how to be found by clients in your area",
"description": "A practical guide for small businesses to show up on Google Maps and in local searches: Business Profile, reviews, location pages and structured data.",
"dek": "People who search “near me” or add a town to their search are often ready to hire. This guide shows you how to make your business the answer.",
"category": "SEO",
"cover_alt": "Illustration: a topographic map with one place marked in teal",
"takeaways": [
  "Searches with local intent often come from people ready to hire.",
  "Your Google Business Profile is the starting point, and it’s free.",
  "Your name, address and phone number must match everywhere.",
  "Recent, detailed reviews make a real difference to clients’ choices.",
],
"body": """
<h2>What local SEO is</h2>
<p>Local SEO is the set of practices that help a business show up when someone looks for a service in a specific area, whether on Google Maps, in the search results or in AI tools’ answers.</p>
<p>For businesses serving clients in a region, such as clinics, studios, restaurants, builders or practices, it’s often the most cost-effective way to win new enquiries.</p>

<h2>1. Create and complete your Google Business Profile</h2>
<p>Your Google Business Profile (formerly Google My Business) is what appears on the map and in the side panel of the results. It’s free, and it’s probably the single most effective step in this guide.</p>
<ul>
  <li>Choose your main category carefully: it should describe what you do, not what you’d like to do.</li>
  <li>Add secondary categories, services, opening hours and service area.</li>
  <li>Post real photos of your space, team and work, and update them regularly.</li>
  <li>Make sure the website link points to the right page.</li>
</ul>

<h2>2. Keep your name, address and phone number consistent</h2>
<p>Google and AI tools cross-check information from several sources. If your name, address or phone number appear differently on your website, profile, social networks and directories, trust in that data drops.</p>
<p>Pick one exact version and use it everywhere, down to how you write the street name.</p>

<h2>3. Ask for reviews and reply to all of them</h2>
<p>Reviews influence your rankings and, above all, whether a client picks you. The most valuable ones are recent, detailed and mention the service and the location.</p>
<ul>
  <li>Ask for the review right after a successful job, while the experience is fresh.</li>
  <li>Send a direct link, so leaving the review takes seconds.</li>
  <li>Reply to all of them, including negative ones, calmly and professionally.</li>
</ul>
<div class="callout"><b>Tip</b>Suggest clients mention which service they hired and where. A review like “they renovated our kitchen in Clifton in three weeks” is worth far more than “excellent service”.</div>

<h2>4. Give each service and location its own page</h2>
<p>If you work in several towns or offer several services, create dedicated pages. But avoid the common mistake of duplicating the same page and only swapping the town name: that’s seen as low-quality content.</p>
<p>Each page should have genuine content, such as projects completed in that area, local specifics and testimonials from clients there.</p>

<h2>5. Show Google where you are</h2>
<ul>
  <li>Include your address and contact details in the footer of every page.</li>
  <li>Have a contact page with a map and directions.</li>
  <li>Add <code>LocalBusiness</code> structured data with your name, address, opening hours, service area and contact details.</li>
</ul>

<h2>6. A fast, mobile-first website</h2>
<p>Many local searches happen on phones, often on the street or on the way somewhere. Your website must open quickly and let people call, get directions or send a message with one tap.</p>

<h2>How to measure results</h2>
<p>In your Business Profile you can track calls, direction requests and clicks to your website. In Google Search Console, see which searches with place names bring visits. These numbers, more than your position on the map, show whether local SEO is actually bringing in business.</p>
""",
"faq": [
  ("Do I need a physical address to appear on Google Maps?",
   "No. If you serve clients at their premises, you can hide your address in your Business Profile and set the area you serve instead."),
  ("Can I create profiles for several locations?",
   "Only if you have real premises in those locations, open to clients. Creating profiles at addresses where you aren’t present breaks Google’s rules and can lead to suspension."),
  ("How long does it take to appear on the map?",
   "Verifying your profile usually takes a few days. Rankings improve gradually and depend on the competition in your area, the profile’s relevance and your reviews."),
],
},
{
"slug": "website-visitors-but-no-enquiries",
"title": "Getting visitors but no enquiries? 7 fixes for your website",
"description": "If people visit your website but don’t get in touch, the problem is rarely traffic. Seven practical changes to turn visits into enquiries.",
"dek": "Bringing in visitors is the expensive part. Losing them through lack of clarity or trust is the avoidable part. Seven fixes that turn visits into enquiries.",
"category": "Conversion",
"cover_alt": "Illustration: many dots converging on a narrow passage that only a few pass through",
"takeaways": [
  "The problem is rarely a lack of visitors: it’s a lack of clarity and trust.",
  "Every page should have one goal and an obvious next step.",
  "Fewer fields, more ways to get in touch and real proof increase enquiries.",
  "Without measurement, you’re making decisions blind.",
],
"body": """
<h2>1. A headline that says what you do, and for whom</h2>
<p>Visitors need to know within seconds whether they’re in the right place. Your main headline should name the service and the type of client, not just make a generic promise.</p>
<div class="compare">
  <p class="-bad"><b>Before</b>Quality and trust since 2005.</p>
  <p class="-good"><b>After</b>Accounting for restaurants and cafés in Manchester, with monthly support and replies within 24 hours.</p>
</div>

<h2>2. One next step per page</h2>
<p>When everything is important, nothing is. Choose the main action for each page, whether that’s requesting a quote, booking a call or making a reservation, and give it prominence: a button visible at the top and repeated down the page.</p>
<p>Secondary actions can exist, but with less visual weight.</p>

<h2>3. Short forms</h2>
<p>Every extra field is another reason to give up. Ask only for what you need to reply: usually name, email and a message. Everything else can come later.</p>

<h2>4. More than one way to get in touch</h2>
<p>Some people prefer to write, some prefer to talk and some want to book straight away. Offering alternatives makes visitors more likely to take the step:</p>
<ul>
  <li>WhatsApp, for a quick question.</li>
  <li>Online booking, for people who’ve already decided.</li>
  <li>A chat that answers the most common questions and hands over to a person when needed.</li>
</ul>

<h2>5. Show real proof</h2>
<p>Before getting in touch, visitors want to know they can trust you. Named testimonials with context, client logos, photos of real projects and concrete numbers from your work are worth more than any adjective.</p>
<div class="callout"><b>Tip</b>Put a testimonial near your contact button. That’s exactly when the “is it worth it?” doubt is strongest.</div>

<h2>6. Answer objections before they come up</h2>
<p>Price, timings, service area, how the process works: if these questions go unanswered, many visitors won’t ask. They’ll just go and check out your competitors.</p>
<p>A price range (“from…”), a simple explanation of the process and an FAQ section remove much of the hesitation.</p>

<h2>7. Measure what happens</h2>
<p>Without data, every improvement is a guess. Set up an analytics tool, such as Google Analytics or a privacy-focused alternative, and track the important actions: clicks on contact buttons, form submissions, WhatsApp clicks and bookings.</p>
<p>Then see where people drop off, and start there.</p>

<h2>Where to start</h2>
<p>You don’t need to change everything at once. Find the three pages with the most visits and apply these seven fixes to them. That’s where any improvement has the most impact.</p>
""",
"faq": [
  ("What’s a good conversion rate for a website?",
   "It varies a lot with the sector, the type of service and where visitors come from, so general averages aren’t very useful. More important than comparing with others is measuring your own rate and raising it over time."),
  ("Should I show prices on my website?",
   "In most cases, yes, at least a range or a starting price. It filters out enquiries without a budget, reduces hesitation for interested visitors and shows transparency."),
  ("Is a chatbot worth it on a small website?",
   "It is if it answers the most common questions well and hands over to a person when needed. It shouldn’t replace human contact, but it can capture requests outside office hours."),
],
},
{
"slug": "how-much-does-a-professional-website-cost",
"title": "How much does a professional website cost? What drives the price",
"description": "From website builders to agencies: what determines the price of a professional website, what should be included and how to compare quotes without surprises.",
"dek": "Two quotes for “the same website” can be worlds apart. This guide explains what makes the price vary, what should be included and how to compare fairly.",
"category": "Investment",
"cover_alt": "Illustration: a rising bar chart, with the last bars in lilac",
"takeaways": [
  "The price depends mainly on scope: pages, content, features and integrations.",
  "Compare what each quote includes, not just the final figure.",
  "Running costs, such as domain, hosting and maintenance, count too.",
  "A website should be judged by what it brings in, not just by what it costs.",
],
"body": """
<h2>The three most common ways to get a website</h2>
<h3>Website builders</h3>
<p>Platforms like Wix or Squarespace let you build a website yourself from templates. The direct cost is low, but the real investment is your time, and the result depends heavily on your experience with design, writing and SEO.</p>
<h3>Freelancer</h3>
<p>A professional takes care of design and development, with direct contact and without the layers of a bigger structure. For small businesses it’s often the best balance of quality, personal attention and cost.</p>
<h3>Agency</h3>
<p>An agency brings together several people (project management, design, development, content), which makes sense for large or complex projects. That structure is reflected in the price.</p>

<h2>What makes the price go up or down</h2>
<ul>
  <li><strong>Number of pages</strong> and of different page templates.</li>
  <li><strong>Custom design or adapted template</strong>: a design made for your business takes more work than adjusting an existing template.</li>
  <li><strong>Content</strong>: who writes the copy and who takes care of the photos.</li>
  <li><strong>Features and integrations</strong>: bookings, advanced forms, WhatsApp, chatbot, contact management tools, online shop.</li>
  <li><strong>Languages</strong>: each extra language is, in practice, another version of the website.</li>
  <li><strong>SEO and migration</strong>: keeping your rankings when replacing an existing website takes planning.</li>
</ul>

<h2>What a quote should include</h2>
<p>When comparing quotes, check whether each one includes:</p>
<ul>
  <li>Design adapted to phone, tablet and desktop.</li>
  <li>The number of pages and rounds of revisions.</li>
  <li>Who is responsible for the content.</li>
  <li>Basic SEO: titles, descriptions, redirects and structured data.</li>
  <li>Analytics setup.</li>
  <li>Publishing the website and training so you can edit it.</li>
  <li>Ownership of the domain and the website in your name.</li>
  <li>Support after launch: what’s included and for how long.</li>
</ul>

<h2>Running costs to budget for</h2>
<p>On top of the initial price, a website has yearly costs: the domain, hosting, any licences or plugins and, if you choose it, a maintenance service. Ask for these figures up front.</p>

<h2>How I price my work</h2>
<p>To give you a concrete reference, here’s how I price my own work:</p>
<ul>
  <li><strong>Fresh Look, €750</strong>: a new design that keeps your current structure and content, optimised for mobile and launched. For websites of up to 4 pages; larger websites on request.</li>
  <li><strong>Enquiry Engine, from €1,800</strong>: custom design and structure, optimisation for Google and AI tools, bookings, WhatsApp, chatbot and a metrics dashboard.</li>
</ul>
<p>Not sure yet? I can <a href="../../#free">redesign your homepage for free</a> and email you a personalised report on what to improve, so you can see the potential before you invest. You’ll find the details of each plan in the <a href="../../#solutions">plans section</a>.</p>

<h2>Cost or investment?</h2>
<p>The best way to judge a website is to compare it with what it can bring in. If a new client is worth €500 to your business on average, an €1,800 website pays for itself after four clients. After that, every enquiry it brings in is pure return.</p>
<p>Do the maths with your own numbers: it helps you decide how much to invest and what to expect from the website in return.</p>
""",
"faq": [
  ("Why are quotes for the same website so different?",
   "Because they rarely describe the same work. Differences in the number of pages, custom design, content, integrations and post-launch support explain most of the variation."),
  ("Will the website be in my name?",
   "It should be. Make sure the domain is registered in your name and that you receive all the logins at the end of the project."),
  ("Do I need to pay for maintenance?",
   "It depends on the platform and the integrations. Websites with many plugins need regular security updates; simpler websites need little technical maintenance, but benefit from up-to-date content."),
],
},
]
