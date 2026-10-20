#!/usr/bin/env python3
"""
Split Easywurld_Posts_By_Day into 30 one-day ZIPs containing ONLY the four
Facebook post folders per day (the 08:00 carousel, 12:30 video, 15:00 honest
answer, 20:00 second feed). Each ZIP is ~400 KB so it can be downloaded and
extracted on a phone one day at a time, keeping the gallery/Downloads clean.

Prerequisite:
  unzip -o launch-content/Easywurld_Posts_By_Day.zip -d tmp/kit/

Output:
  tmp/day-zips/Day_01.zip ... Day_30.zip
  Each archive keeps the structure  Day_XX/Post_.../<media + Caption.txt>
"""

import os
import zipfile

SRC = "tmp/kit/Easywurld_Posts_By_Day"
OUT = "tmp/day-zips"


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for day in sorted(os.listdir(SRC)):
        day_dir = os.path.join(SRC, day)
        if not os.path.isdir(day_dir):
            continue
        fb_folders = sorted(
            d
            for d in os.listdir(day_dir)
            if os.path.isdir(os.path.join(day_dir, d)) and "facebook" in d.lower()
        )
        if len(fb_folders) != 4:
            raise SystemExit(f"{day}: expected 4 Facebook folders, found {len(fb_folders)}")
        zip_path = os.path.join(OUT, f"{day}.zip")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for folder in fb_folders:
                for root, _, files in os.walk(os.path.join(day_dir, folder)):
                    for name in sorted(files):
                        full = os.path.join(root, name)
                        zf.write(full, os.path.relpath(full, SRC))
        print(f"{zip_path}  {os.path.getsize(zip_path) // 1024} KB  ({len(fb_folders)} folders)")


if __name__ == "__main__":
    main()
