/**
 * PWA Icon Generator Script - Production Ready
 *
 * Generates all required icon sizes for PWA (Android & iOS)
 *
 * Prerequisites:
 *   npm install sharp --save-dev
 *
 * Usage:
 *   node scripts/generate-icons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SOURCE_ICON = path.join(__dirname, "../app/icon.png");
const OUTPUT_DIR = path.join(__dirname, "../public/icons");

// All icon sizes for Android, iOS, and PWA standards
const ICON_SIZES = [
  // Standard PWA icons
  { size: 48, name: "icon-48x48.png" },
  { size: 72, name: "icon-72x72.png" },
  { size: 96, name: "icon-96x96.png" },
  { size: 120, name: "icon-120x120.png" },
  { size: 128, name: "icon-128x128.png" },
  { size: 144, name: "icon-144x144.png" },
  { size: 152, name: "icon-152x152.png" },
  { size: 167, name: "icon-167x167.png" },
  { size: 180, name: "icon-180x180.png" },
  { size: 192, name: "icon-192x192.png" },
  { size: 256, name: "icon-256x256.png" },
  { size: 384, name: "icon-384x384.png" },
  { size: 512, name: "icon-512x512.png" },

  // Maskable icons (Android adaptive icons - needs padding)
  { size: 192, name: "maskable-icon-192x192.png", maskable: true },
  { size: 512, name: "maskable-icon-512x512.png", maskable: true },

  // iOS specific
  { size: 180, name: "apple-touch-icon.png" },
  { size: 1024, name: "apple-touch-icon-1024x1024.png" },

  // Shortcut icons
  { size: 96, name: "shortcut-tracker.png" },
  { size: 96, name: "shortcut-add.png" },
  { size: 96, name: "shortcut-stats.png" },

  // Favicon
  { size: 32, name: "favicon-32x32.png" },
  { size: 16, name: "favicon-16x16.png" },
];

const BACKGROUND_COLOR = { r: 10, g: 10, b: 10, alpha: 1 }; // #0a0a0a

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("🎨 HabitSpark PWA Icon Generator");
  console.log("================================\n");
  console.log(`📁 Source: ${SOURCE_ICON}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const icon of ICON_SIZES) {
    try {
      let pipeline;

      if (icon.maskable) {
        // Maskable icons need 20% padding (safe zone is 80% center)
        const padding = Math.floor(icon.size * 0.1);
        const innerSize = icon.size - padding * 2;

        // First resize the icon smaller
        const resized = await sharp(SOURCE_ICON)
          .resize(innerSize, innerSize, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toBuffer();

        // Then extend with padding
        pipeline = sharp(resized).extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: BACKGROUND_COLOR,
        });
      } else {
        pipeline = sharp(SOURCE_ICON).resize(icon.size, icon.size, {
          fit: "contain",
          background: BACKGROUND_COLOR,
        });
      }

      await pipeline
        .png({ quality: 90 })
        .toFile(path.join(OUTPUT_DIR, icon.name));
      console.log(
        `✅ ${icon.name.padEnd(30)} ${icon.size}x${icon.size}${icon.maskable ? " (maskable)" : ""}`,
      );
      successCount++;
    } catch (error) {
      console.error(`❌ ${icon.name.padEnd(30)} Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n================================");
  console.log(
    `🎉 Complete! ${successCount} icons generated, ${errorCount} errors`,
  );
  console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);

  if (errorCount === 0) {
    console.log("\n✨ Your PWA is ready for installation on Android & iOS!");
  }
}

generateIcons().catch(console.error);
