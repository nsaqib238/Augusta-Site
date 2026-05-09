# Deploy this repo to `www.augustasearch.com` (Contabo VPS)

Static site: clone this repo, nginx, Let’s Encrypt.

**Before you start:** Pointing **`@`** and **`www`** at your VPS **stops** Squarespace from hosting the main domain. Your landing site becomes **this repo** on the VPS.

On the VPS, confirm your public IP (DNS must use **this**):

```bash
curl -4 ifconfig.me
```

---

## 1) Squarespace DNS

In **Settings → Domains → augustasearch.com → DNS**:

1. **Remove** the **Squarespace Defaults** preset (or remove the old `@` A records and `www` CNAME) so you are not still sending the domain to Squarespace.
2. Add **custom** records (names may show as Host / Name):

   | Type | Name | Data |
   |------|------|------|
   | **A** | `@` | Your VPS IPv4 (`curl -4 ifconfig.me`) |
   | **A** | `www` | Same VPS IPv4 |

3. Wait for propagation, then check:

```bash
nslookup augustasearch.com
nslookup www.augustasearch.com
```

Both should return your VPS IP.

**Keep** your separate records (e.g. `ausstd` → same VPS) as they are if you still use them.

---

## 2) VPS: install tools (if needed)

```bash
sudo apt update
sudo apt install -y nginx git certbot python3-certbot-nginx
```

---

## 3) Deploy this repository

```bash
sudo mkdir -p /var/www/augustasearch
sudo chown -R "$USER":"$USER" /var/www/augustasearch
cd /var/www/augustasearch
git clone https://github.com/nsaqib238/Augusta-Site.git .
sudo chown -R www-data:www-data /var/www/augustasearch
```

Use SSH clone instead if the repo is private and your VPS has a deploy key:

```bash
git clone git@github.com:nsaqib238/Augusta-Site.git .
```

---

## 4) nginx

```bash
sudo nano /etc/nginx/sites-available/www.augustasearch.com
```

Paste **only** nginx (no markdown fences):

```
server {
    listen 80;
    listen [::]:80;
    server_name augustasearch.com www.augustasearch.com;

    root /var/www/augustasearch;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/www.augustasearch.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

If another site already claims port 80 as default, adjust `listen` / `server_name` conflicts — each hostname should hit **this** `server` block for these names.

---

## 5) HTTPS (both names on one certificate)

```bash
sudo certbot --nginx -d augustasearch.com -d www.augustasearch.com
sudo certbot renew --dry-run
```

Then open **https://www.augustasearch.com** and **https://augustasearch.com**.

---

## 6) Updates after you push to GitHub

The web root is owned by **`www-data`**, so **`git pull`** as your user needs write access to **`.git`**. Use this sequence (not `sudo git pull`, which can create root-owned files):

```bash
sudo chown -R "$USER":"$USER" /var/www/augustasearch
cd /var/www/augustasearch
git pull origin main
sudo chown -R www-data:www-data /var/www/augustasearch
sudo systemctl reload nginx
```

Optional: `git config --global --add safe.directory /var/www/augustasearch` (stops the “dubious ownership” message; it does **not** fix permission errors on `FETCH_HEAD`).

---

## Optional: always use `www`

After HTTPS works, you can add a second small nginx server block that redirects **apex → www** only on HTTP, then run Certbot again if needed — or use Certbot’s redirect option when it asks. Easiest path: ask Certbot to redirect HTTP to HTTPS; add apex→www redirect in nginx docs when you need it.

---

## Troubleshooting

| Problem | Check |
|--------|--------|
| Wrong site or timeout | `nslookup` matches VPS IP; firewall allows **80** and **443** |
| Certbot fails | DNS for **both** names points to this VPS; nginx serves port **80** publicly |
