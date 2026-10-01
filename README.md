# Hope Professional Medical Group & Nursing Corporation website

Static brochure site. Open `index.html` in a browser, or upload the whole folder to any web host.

## Pages
- `index.html`: Home (hero, services, team, how we care)
- `services.html`: service details, steps, areas served, FAQ
- `contact.html`: contact details, form, map

## Changing the photos
The photos are free Unsplash placeholders. Search for `images.unsplash.com` in the HTML files and
replace each `src` with your own image (for example `assets/team-1.jpg`).

## Making the contact form send email
The form works visually but doesn't send anything yet. To connect it, for example with Formspree:
1. Create a form at https://formspree.io and copy its endpoint.
2. In `contact.html`, change `<form class="form reveal" data-delay="1" novalidate>` to
   `<form class="form reveal" data-delay="1" action="https://formspree.io/f/XXXX" method="POST">`.
3. In `js/main.js`, delete the "Contact form (design only)" block.

## Preloader
The loader shows the logo mark (no text) with flapping dove wings for at least 2.2 seconds.
To change how long it shows, edit `MIN_LOADER_MS` at the top of `js/main.js`.

## SEO
The site is set up for https://hopeprocare.com. Each page has a title, description, canonical link,
and link-preview tags (`assets/social-share.jpg`). Structured data tells Google about the business
(home page) and the FAQ (services page). `robots.txt` and `sitemap.xml` are in the root folder.

If the address ever changes, search all files for `hopeprocare.com` and replace it.

After launch:
1. Add the site to Google Search Console (https://search.google.com/search-console) and submit
   `https://hopeprocare.com/sitemap.xml`.
2. Create or claim a free Google Business Profile, set up as a service-area business covering
   the areas you serve.
3. When you edit pages, update the `<lastmod>` dates in `sitemap.xml`.
