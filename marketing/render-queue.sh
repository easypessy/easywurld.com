#!/usr/bin/env bash
# One driver for the whole video month: render anything with a narration first,
# then re-shoot the pre-upgrade videos with the handheld motion grammar, one at
# a time, until nothing is left. Survives being called repeatedly; safe to
# restart after a workspace rollback.
set -u
cd "$(dirname "$0")/.."
source marketing/setup-env.sh >/dev/null 2>&1
while :; do
  "$EASYWURLD_PYTHON" marketing/build-video.py --pending >/dev/null 2>&1 || true
  left=$("$EASYWURLD_PYTHON" marketing/remotion.py --count 2>/dev/null || echo 0)
  [ "$left" = "0" ] && break
  "$EASYWURLD_PYTHON" marketing/remotion.py --limit 1 || sleep 5
done
echo "QUEUE-DONE: every slot rendered and every finished video re-shot alive."
