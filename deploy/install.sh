#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Easywurld — one-shot installer for a fresh Ubuntu 22.04 / 24.04 server.
# Works on Oracle Cloud "Always Free", any small VPS, or a spare machine.
#
#   sudo DOMAIN=portal.easywurld.com REPO=https://github.com/easypessy/easywurld.com ./deploy/install.sh
#
# Re-running is safe: it updates the code and restarts the service, and never
# overwrites an existing /etc/easywurld.env.
# ---------------------------------------------------------------------------
set -euo pipefail

DOMAIN="${DOMAIN:-}"
REPO="${REPO:-https://github.com/easypessy/easywurld.com}"
BRANCH="${BRANCH:-main}"
APP_DIR=/opt/easywurld
DATA_DIR=/var/lib/easywurld
ENV_FILE=/etc/easywurld.env

log() { printf '\n\033[1;32m== %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run with sudo (it installs packages and services)."
[ -n "$DOMAIN" ] || die "Set DOMAIN, e.g.  sudo DOMAIN=portal.easywurld.com ./deploy/install.sh"

log "1/8 System packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl gnupg git ufw rsync >/dev/null

log "2/8 Node.js 22"
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
node -v

log "3/8 Caddy (automatic HTTPS)"
if ! command -v caddy >/dev/null 2>&1; then
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https >/dev/null
  curl -1fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq && apt-get install -y -qq caddy >/dev/null
fi
caddy version | head -1

log "4/8 Service user and directories"
id -u easywurld >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin easywurld
install -d -o easywurld -g easywurld -m 750 "$DATA_DIR" "$DATA_DIR/backups"
install -d -o easywurld -g easywurld -m 750 "$APP_DIR"

log "5/8 Code"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --quiet origin "$BRANCH"
  git -C "$APP_DIR" reset --hard --quiet "origin/$BRANCH"
else
  git clone --quiet --branch "$BRANCH" "$REPO" "$APP_DIR"
fi
chown -R easywurld:easywurld "$APP_DIR"
sudo -u easywurld bash -c "cd '$APP_DIR' && npm install --legacy-peer-deps --no-audit --no-fund"

log "6/8 Build the site + portal"
sudo -u easywurld bash -c "cd '$APP_DIR' && npm run build"

log "7/8 Configuration"
if [ -f "$ENV_FILE" ]; then
  echo "Keeping existing $ENV_FILE (edit it by hand if anything changed)."
else
  cp "$APP_DIR/.env.example" "$ENV_FILE"
  sed -i "s|^NODE_ENV=.*|NODE_ENV=production|; s|^SITE_URL=.*|SITE_URL=https://$DOMAIN|" "$ENV_FILE"
  printf '\n# Added by install.sh\nDATA_DIR=%s\nPORT=3001\n' "$DATA_DIR" >> "$ENV_FILE"
  chown root:easywurld "$ENV_FILE"
  chmod 640 "$ENV_FILE"
  echo "Created $ENV_FILE — fill in what you have, then: sudo systemctl restart easywurld"
fi

log "8/8 Services, HTTPS and firewall"
install -m 644 "$APP_DIR/deploy/easywurld.service" /etc/systemd/system/easywurld.service
install -m 644 "$APP_DIR/deploy/easywurld-backup.service" /etc/systemd/system/easywurld-backup.service
install -m 644 "$APP_DIR/deploy/easywurld-backup.timer" /etc/systemd/system/easywurld-backup.timer
systemctl daemon-reload
systemctl enable --now easywurld >/dev/null
systemctl enable --now easywurld-backup.timer >/dev/null

install -d -o caddy -g caddy -m 750 /var/log/caddy 2>/dev/null || true
sed "s/easywurld\.com/$DOMAIN/g; s/www\.$DOMAIN, //" "$APP_DIR/deploy/Caddyfile" > /etc/caddy/Caddyfile
systemctl reload caddy 2>/dev/null || systemctl restart caddy

ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

sleep 2
systemctl is-active --quiet easywurld && log "Service is running" || die "Service failed — check: journalctl -u easywurld -n 50"

cat <<EOF

--------------------------------------------------------------------------
Easywurld is installed.

  App       https://$DOMAIN
  Config    $ENV_FILE          (chmod 640, root:easywurld)
  Data      $DATA_DIR          database + uploads + nightly backups
  Logs      journalctl -u easywurld -f
  Restart   sudo systemctl restart easywurld

Next, create your real administrator (prints a one-time password):

  sudo -u easywurld bash -c "cd $APP_DIR && DATA_DIR=$DATA_DIR npm run ops:admin -- --email you@easywurld.com --name 'Your Name'"

Then open https://$DOMAIN/login and change the password.
--------------------------------------------------------------------------
EOF
