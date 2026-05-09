# Deploy `ausstd.augustasearch.com` (Australia app only)

**This subdomain is not your main marketing site.**  
`augustasearch.com` / `www` stay on Squarespace (or wherever you host the landing page).  
**`ausstd.augustasearch.com`** is only for your **Australia product/app** — deploy **that** project’s files here, **not** the Augusta-Site marketing repo.

Stack on the VPS below assumes you serve **static files** from a folder (`index.html` or a built `dist/`). If your Australia app is Node/Python/docker, use a **reverse proxy** in nginx instead (different snippet).

**Important:** DNS for `ausstd` must point to **the same IPv4** your VPS uses on the public internet:

```bash
curl -4 ifconfig.me
```

If `nslookup ausstd.augustasearch.com` shows a **different** IP, Let’s Encrypt will fail (connection timeout).

---

## 1) Squarespace DNS

Keep Squarespace defaults for `@` and `www` (landing site unchanged).

Add:

- **Type**: `A`
- **Name**: `ausstd`
- **Data**: same IPv4 as `curl -4 ifconfig.me` on this VPS
- **TTL**: default (4 hrs is fine)

Verify:

```bash
curl -4 ifconfig.me
nslookup ausstd.augustasearch.com
```

---

## 2) VPS packages (Ubuntu/Debian)

```bash
ssh <your-user>@<your-vps-ip>
sudo apt update
sudo apt install -y nginx git certbot python3-certbot-nginx
```

---

## 3) Put your **Australia app** on the server

Create the web root, then copy or clone **your Australia app** (replace with your real repo or upload path):

```bash
sudo mkdir -p /var/www/ausstd
sudo chown -R "$USER":"$USER" /var/www/ausstd
cd /var/www/ausstd
# Example — use YOUR Australia app repo, not the marketing site:
# git clone https://github.com/YOUR_ORG/your-australia-app.git .
# Or: rsync/scp your build output here so index.html (or the app entry) is under /var/www/ausstd
sudo chown -R www-data:www-data /var/www/ausstd
```

If the app builds to a subfolder (e.g. `dist/`), set nginx `root` to that path in section 4.

---

## 4) nginx

```bash
sudo nano /etc/nginx/sites-available/ausstd.augustasearch.com
```

Paste **only** the lines below (no markdown backticks):

```
server {
    listen 80;
    listen [::]:80;
    server_name ausstd.augustasearch.com;

    root /var/www/ausstd;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable + reload:

```bash
sudo ln -sf /etc/nginx/sites-available/ausstd.augustasearch.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5) HTTPS

```bash
sudo certbot --nginx -d ausstd.augustasearch.com
sudo certbot renew --dry-run
```

---

## 6) Update when your Australia app changes

```bash
cd /var/www/ausstd
sudo git pull   # if you used git
sudo chown -R www-data:www-data /var/www/ausstd
sudo systemctl reload nginx
```

---

## Other countries later (`usstd`, etc.)

Same pattern: new **`A`** record, new folder `/var/www/usstd`, new nginx `server_name`, new certbot `-d`.
