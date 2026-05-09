# Deploy `ausstd.augustasearch.com` (simple)

This project is a **static** site (HTML/CSS/JS). No build step.

**Important:** DNS for `ausstd` must point to **the same IPv4** your VPS uses on the public internet. On the VPS run:

```bash
curl -4 ifconfig.me
```

Use that value in Squarespace. If `nslookup ausstd.augustasearch.com` shows a **different** IP, Let’s Encrypt will fail with a **connection timeout** (it talks to the IP in DNS, not your SSH session).

---

## 1) Squarespace DNS

Keep Squarespace defaults for `@` and `www` (so your main landing site stays on Squarespace).

Add 1 record:

- **Type**: `A`
- **Name**: `ausstd`
- **Data**: **same IPv4 as** `curl -4 ifconfig.me` **on this VPS**
- **TTL**: default (4 hrs is fine)

Wait a few minutes and verify (**must match `curl`**):

```bash
curl -4 ifconfig.me
nslookup ausstd.augustasearch.com
```

---

## 2) VPS setup (Ubuntu/Debian)

SSH to VPS:

```bash
ssh <your-user>@<same-ip-as-above>
```

Install packages:

```bash
sudo apt update
sudo apt install -y nginx git certbot python3-certbot-nginx
```

---

## 3) Deploy the site files

```bash
sudo mkdir -p /var/www/ausstd
sudo chown -R "$USER":"$USER" /var/www/ausstd
cd /var/www/ausstd
git clone https://github.com/nsaqib238/Augusta-Site.git .
sudo chown -R www-data:www-data /var/www/ausstd
```

---

## 4) nginx config

Create file:

```bash
sudo nano /etc/nginx/sites-available/ausstd.augustasearch.com
```

Paste **only** what is inside the block below — **do not** paste the triple-backtick lines (markdown). If nginx says `unknown directive`, you pasted those by mistake.

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

## 5) HTTPS (Let’s Encrypt)

```bash
sudo certbot --nginx -d ausstd.augustasearch.com
```

Test auto-renew:

```bash
sudo certbot renew --dry-run
```

---

## 6) Update later (when repo changes)

```bash
cd /var/www/ausstd
sudo git pull origin main
sudo chown -R www-data:www-data /var/www/ausstd
sudo systemctl reload nginx
```

---

## Add next country (same steps)

For example `usstd.augustasearch.com`:

- DNS: add `A` record **Name** `usstd` → **Data**: same VPS IPv4 (`curl -4 ifconfig.me`)
- VPS: repeat sections 3–5 but replace `ausstd` with `usstd` in:
  - `/var/www/usstd`
  - `/etc/nginx/sites-available/usstd.augustasearch.com`
  - `certbot --nginx -d usstd.augustasearch.com`
