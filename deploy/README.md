# Free hosting for the Easywurld operations system

You asked for free. Here is the honest map, then the one path I recommend.

## Why "free Vercel" does not work for this part

| Free tier | Can it host this? | Why |
|---|---|---|
| **Vercel** (free) | Front end only | No disk, functions are ephemeral. A client's uploaded logo would vanish on the next deploy and a purchase webhook would have nowhere to write. |
| **Render** (free) | **No** | The free web service has *no persistent disk* and sleeps after 15 min. Restart = wiped client data. Paying $7/mo fixes it; free does not. |
| **Railway** | No free tier any more | Trial credit only. |
| **Fly.io** | Nearly free, not free | ~$2/month for a 256 MB machine + volume. Card required. |
| **Cloudflare Workers + D1/R2** | Free, but a rewrite | Genuinely generous free tier, but this app is Node + Express + SQLite; porting it is a multi-day job, not a config change. |
| **Oracle Cloud "Always Free"** | **Yes — $0, forever** | A real Ubuntu VM (1–4 cores, 1–24 GB RAM, 200 GB disk) with a public IP. Free permanently, no expiry. This is what I recommend. |

Oracle asks for a card **for identity verification only** — the Always Free
resources are not charged, and you can (and should) set a budget alert at $0.

## What you get

```
Internet ──▶ Caddy (HTTPS, auto-renewing) ──▶ Node app :3001
                                              ├── SQLite  /var/lib/easywurld/easywurld.db
                                              ├── uploads /var/lib/easywurld/storage/...
                                              └── backups /var/lib/easywurld/backups (nightly)
```

One machine, one process, 200 GB of room for client files. No Drive, no
subscriptions, no serverless surprises.

## Oracle Cloud, click by click (~30 minutes, once)

1. **signup.oraclecloud.com** — pick a home region close to Lagos (Johannesburg
   or Frankfurt). Verify the card; you will not be charged for Always Free.
2. Menu → **Compute → Instances → Create instance**.
   - Image: **Ubuntu 24.04**
   - Shape: **VM.Standard.E2.1.Micro** (Always Free) — or an Ampere A1 with 4 OCPU/24 GB, also Always Free
   - Add SSH key: *Generate a key pair for me* → **download the private key**
3. Create. Wait ~2 minutes, then copy the instance's **Public IP address**.
4. **Open the web ports** (this trips everyone up):
   - Instance details → **Primary VNIC → Subnet → Security Lists → Default
     Security List → Add Ingress Rules**: source `0.0.0.0/0`, protocols TCP,
     destination ports `80` and `443` (and `22` if not already there).
   - Ubuntu images also have a local firewall; the installer runs `ufw` for you,
     but OCI's own iptables rules may still block 80/443. On the server run:
     `sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT`
     `sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT`
     `sudo netfilter-persistent save`
5. Point your domain at the IP: at your registrar add an **A record**
   `portal` → that IP (and `@`/`www` too if the whole site moves here).
6. From your own computer:

```bash
chmod 600 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<PUBLIC_IP>
```

7. On the server:

```bash
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/easypessy/easywurld.com /tmp/ew
sudo DOMAIN=portal.easywurld.com /tmp/ew/deploy/install.sh
```

8. Create your administrator (the installer prints this command too):

```bash
sudo -u easywurld bash -c "cd /opt/easywurld && DATA_DIR=/var/lib/easywurld npm run ops:admin -- --email you@easywurld.com --name 'Your Name'"
```

9. Open `https://portal.easywurld.com/login`, sign in, change the password.

## Everyday commands

| Task | Command |
|---|---|
| See status | `systemctl status easywurld` |
| Follow logs | `journalctl -u easywurld -f` |
| Edit settings | `sudo nano /etc/easywurld.env` then `sudo systemctl restart easywurld` |
| Deploy new code | `sudo /opt/easywurld/deploy/install.sh` (with DOMAIN set) — it re-clones, rebuilds, restarts |
| Update code, keep data | same as above; data lives in `/var/lib/easywurld`, never in the repo |
| Back up now | `sudo systemctl start easywurld-backup` |
| Restore | stop service, copy `backups/*.db` over `easywurld.db`, start service |

## Free-tier companions

- **Email:** Brevo free (300/day), Zoho Mail free (own domain), or Gmail app
  password. Without one, messages queue in the outbox — nothing is lost.
- **Notion:** free plan is enough for the five databases.
- **Paystack:** no monthly fee; you pay per successful transaction only.
- **Monitoring:** UptimeRobot free checks `https://your-domain/api/public/health`
  every 5 minutes and emails you if the app is down.
- **Off-site backup:** `rclone` to your existing Drive (a nightly 1-file copy is
  a few MB, so the full Drive does not matter) or to Backblaze B2's 10 GB free.

## If you would rather not run a server

The nearest thing to hands-off is Fly.io at roughly **$2/month**; Vercel stays
free for the marketing site. I would not pretend otherwise: nothing free and
fully managed will hold a live client database and uploaded files reliably.
Oracle's free VM is the free option that actually works.
