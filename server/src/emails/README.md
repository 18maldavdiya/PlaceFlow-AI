# emails

Transactional email templates and send functions, built on the shared transporter in
`lib/mailer.js`. Empty at this stage — no transactional emails exist yet.

## Conventions to follow once emails are added

- `templates/` holds the actual markup (HTML with inline styles, since most email
  clients strip `<style>` blocks and ignore external stylesheets).
- One `<name>.email.js` per email at the top level of this folder, each exporting a
  single `send<Name>Email(to, data)` function that fills a template and calls
  `transporter.sendMail(...)` — controllers/services call these functions, never
  `transporter.sendMail` directly, so template changes never require touching a
  service.
- Every send is logged and failures are caught and reported, never allowed to crash
  the request that triggered the email (e.g. an offer-acceptance confirmation email
  failing should not fail the offer-acceptance API call itself).
