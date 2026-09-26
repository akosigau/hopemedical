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
