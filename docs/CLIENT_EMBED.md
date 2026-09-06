# Dorivien Client Widget Embed

The widget is served from `/widget.html`.

Example:
```html
<iframe
  src="https://YOUR-DORIVIEN-DEPLOYMENT.example/widget.html?accent=%234665F4"
  title="HVAC customer assistant"
  width="100%"
  height="620"
  style="border:0;border-radius:16px"
  loading="lazy">
</iframe>
```

## Important production rule
The visible company label is not a security boundary. Real client rules must be configured server-side with `BUSINESS_PROFILE_JSON`.

When `APP_MODE=production`, the widget reads the configured business name from `/api/config` rather than trusting a query-string company name.

## Frame restriction
For the public demo, `ALLOWED_EMBED_ORIGINS=*` is convenient.

For a client deployment, set for example:
```text
ALLOWED_EMBED_ORIGINS=https://www.clientsite.com https://clientsite.com
```

This narrows the widget's CSP `frame-ancestors` policy to the approved client site(s).
